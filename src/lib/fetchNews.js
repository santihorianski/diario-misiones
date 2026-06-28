import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['image', 'image']
    ]
  }
});

const FEED_URLS = [
  { name: 'Misiones Online', url: 'https://misionesonline.net/feed/' },
  { name: 'El Territorio', url: 'https://www.elterritorio.com.ar/rss' },
  { name: 'Diario de la Ciudad', url: 'https://diariodelaciudad.com.ar/feed/' },
  { name: 'Misiones Cuatro', url: 'https://misionescuatro.com/feed/' },
  { name: 'Primera Edición', url: 'https://www.primeraedicion.com.ar/feed/' }
];

function calculateSimilarity(str1, str2) {
  const stopWords = ['el', 'la', 'los', 'las', 'un', 'una', 'y', 'o', 'de', 'del', 'que', 'en', 'a', 'con', 'por', 'para', 'se', 'su', 'al', 'lo', 'como', 'más', 'pero', 'sus'];
  
  const getWords = (str) => {
    return str.toLowerCase()
              .replace(/[.,:;?!()""''\-]/g, ' ')
              .split(/\s+/)
              .filter(w => w.length > 2 && !stopWords.includes(w));
  };

  const set1 = new Set(getWords(str1));
  const set2 = new Set(getWords(str2));

  if (set1.size === 0 && set2.size === 0) return 1;
  if (set1.size === 0 || set2.size === 0) return 0;

  let intersection = 0;
  for (const w of set1) {
    if (set2.has(w)) intersection++;
  }

  const union = set1.size + set2.size - intersection;
  return intersection / union;
}

import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';

export async function scrapeFullArticle(url) {
  try {
    // Usamos AllOrigins Proxy para evadir el bloqueo 403 de Cloudflare
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl);
    
    if (!res.ok) {
      console.log(`Proxy Error (${res.status}) para: ${url}`);
      return null;
    }
    
    const data = await res.json();
    if (!data.contents) return null;
    
    const html = data.contents;
    const $ = cheerio.load(html);
    
    // Limpiar basura publicitaria y scripts
    $('script, style, noscript, iframe, .ad, .social-share, .related-posts, nav, header, footer').remove();

    // Selectores comunes de los diarios
    let contentHtml = '';
    const selectors = [
      '.entry-content',
      '.post-content',
      'article .content',
      '.article-body',
      '.noticia-cuerpo',
      '#main-content'
    ];

    for (const selector of selectors) {
      const el = $(selector);
      if (el.length > 0) {
        contentHtml = el.html();
        break;
      }
    }

    if (!contentHtml) {
      const paragraphs = $('article p');
      if (paragraphs.length > 0) {
        paragraphs.each((i, el) => {
          contentHtml += `<p>${$(el).html()}</p>`;
        });
      }
    }

    return contentHtml ? contentHtml.trim() : null;
  } catch (err) {
    console.log('No se pudo scrapear: ', url);
    return null;
  }
}

// ... (keep calculateSimilarity and parser imports below)

export async function fetchAllNews() {
  const dataDir = path.join(process.cwd(), 'data');
  const filePath = path.join(dataDir, 'news.json');
  
  let allArticles = [];

  // 1. Intentar cargar el historial local
  try {
    const fileData = await fs.readFile(filePath, 'utf-8');
    allArticles = JSON.parse(fileData);
    console.log(`Cargadas ${allArticles.length} noticias desde la base de datos local.`);
  } catch (err) {
    console.log('No se encontró base de datos local, se creará una nueva.');
  }

  // 2. Traer nuevas noticias
  let newArticlesFetched = 0;
  for (const site of FEED_URLS) {
    try {
      const feed = await parser.parseURL(site.url);
      
      for (const item of feed.items) {
        let imageUrl = item.enclosure ? item.enclosure.url : null;
        
        if (!imageUrl && item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) {
          imageUrl = item.mediaContent.$.url;
        }

        let fullContent = item['content:encoded'] || item.content || item.description || '';
        
        if (!imageUrl) {
          const imgMatch = fullContent.match(/<img[^>]+src=["']([^"']+)["']/i);
          if (imgMatch && imgMatch[1]) {
            imageUrl = imgMatch[1];
          }
        }

        const id = Buffer.from(item.link || item.guid || Math.random().toString()).toString('base64').replace(/[^a-zA-Z0-9]/g, '');

        let isDuplicate = false;
        for (const existing of allArticles) {
          if (existing.link === item.link || existing.id === id) {
             isDuplicate = true;
             break;
          }
          const sim = calculateSimilarity(item.title, existing.title);
          if (sim >= 0.60) {
            isDuplicate = true;
            break;
          }
        }

        if (isDuplicate) continue;

        allArticles.push({
          id,
          source: site.name,
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          contentSnippet: item.contentSnippet || stripHtml(fullContent).substring(0, 200) + '...',
          fullContent: fullContent,
          image: imageUrl,
          categories: item.categories || [],
          scraped: false // Bandera para saber si ya extrajimos el texto completo
        });
        newArticlesFetched++;
      }
    } catch (error) {
      console.error(`Error fetching news from ${site.name}:`, error);
    }
  }

  // 3. Ordenar, limitar y guardar
  if (newArticlesFetched > 0) {
    // Ordenar de más reciente a más antigua
    allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    
    // Limitar a las últimas 500 para no reventar el servidor
    allArticles = allArticles.slice(0, 500);

    // Asegurar que la carpeta data exista
    try { await fs.mkdir(dataDir, { recursive: true }); } catch (e) {}

    // Guardar en disco
    await fs.writeFile(filePath, JSON.stringify(allArticles, null, 2), 'utf-8');
    console.log(`Se agregaron ${newArticlesFetched} noticias nuevas. Total guardadas: ${allArticles.length}`);
  }

  return allArticles;
}

export function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
}

// NUEVA FUNCIÓN: Guarda el artículo en la base de datos local en tiempo real
export async function updateArticleInCache(id, newContent, newImage) {
  const dataDir = path.join(process.cwd(), 'data');
  const filePath = path.join(dataDir, 'news.json');
  
  try {
    const fileData = await fs.readFile(filePath, 'utf-8');
    let articles = JSON.parse(fileData);
    
    let updated = false;
    for (let i = 0; i < articles.length; i++) {
      if (articles[i].id === id) {
        if (newContent) articles[i].fullContent = newContent;
        if (newImage && !articles[i].image) articles[i].image = newImage;
        articles[i].scraped = true; // Marcamos para no volver a scrapear
        updated = true;
        break;
      }
    }
    
    if (updated) {
      await fs.writeFile(filePath, JSON.stringify(articles, null, 2), 'utf-8');
      console.log(`Artículo ${id} actualizado en caché local (Lazy Scraped).`);
    }
  } catch (err) {
    console.error('Error actualizando caché:', err);
  }
}

export function getTrendingTopics(news, count = 5) {
  const words = {};
  const stopWords = ['el', 'la', 'los', 'las', 'un', 'una', 'y', 'o', 'de', 'del', 'que', 'en', 'a', 'con', 'por', 'para', 'se', 'su', 'al', 'lo', 'como', 'más', 'pero', 'sus', 'le', 'es', 'este', 'esta', 'estos', 'estas', 'sobre', 'desde', 'hasta', 'entre'];
  
  news.forEach(article => {
    if (!article.title) return;
    const titleWords = article.title.toLowerCase().split(/[\s,.:;"'?!()\-]+/);
    titleWords.forEach(word => {
      if (word.length > 4 && !stopWords.includes(word)) {
        words[word] = (words[word] || 0) + 1;
      }
    });
  });

  return Object.keys(words)
    .sort((a, b) => words[b] - words[a])
    .slice(0, count)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1));
}

export function getTopCategories(news, count = 6) {
  const catCount = {};
  news.forEach(article => {
    if (article.categories && Array.isArray(article.categories)) {
      article.categories.forEach(cat => {
        const c = cat.trim();
        if (c.length > 2) {
          catCount[c] = (catCount[c] || 0) + 1;
        }
      });
    }
  });
  
  return Object.keys(catCount)
    .sort((a, b) => catCount[b] - catCount[a])
    .slice(0, count)
    .map(c => c.charAt(0).toUpperCase() + c.slice(1));
}
