import * as cheerio from 'cheerio';
import { supabase } from './supabaseClient';

const FEED_URLS = [
  { name: 'Misiones Online', url: 'https://misionesonline.net/feed/' },
  { name: 'El Territorio', url: 'https://www.elterritorio.com.ar/rss' },
  { name: 'Diario de la Ciudad', url: 'https://diariodelaciudad.com.ar/feed/' },
  { name: 'Misiones Cuatro', url: 'https://misionescuatro.com/feed/' },
  { name: 'Primera Edición', url: 'https://www.primeraedicion.com.ar/feed/' }
];

export async function fetchAllNews(forceSync = false) {
  // Sincronizar RSS solo si se solicita explícitamente (por ejemplo, desde el dashboard o el Cron Job)
  if (forceSync) {
    await syncRssFeeds();
  }

  // Obtener noticias desde Supabase
  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(500);

  if (error || !articles) {
    console.error('Error al obtener noticias de Supabase:', error);
    return [];
  }

  // Adaptar el formato de DB al que espera el frontend
  return articles
    .filter(n => !n.is_hidden && n.status !== 'draft')
    .map(item => ({
      id: item.id || Buffer.from(item.source_url).toString('base64').replace(/[^a-zA-Z0-9]/g, ''),
      source: item.source,
      title: item.edited_title || item.title,
      link: item.source_url,
      pubDate: item.published_at,
      contentSnippet: item.edited_content 
        ? stripHtml(item.edited_content).substring(0, 150) + '...'
        : item.content_snippet || stripHtml(item.title).substring(0, 150),
      fullContent: item.edited_content || item.content,
      image: item.image,
      categories: item.categories || [],
      scraped: item.scraped,
      status: item.status,
      seoDescription: item.meta_description
    }));
}

// Helper para reparar XML roto de RSS (Ej: El Territorio)
async function fetchAndFixRSS(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    }
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  let text = await res.text();
  // El Territorio a veces tiene un "=" suelto en urls dentro de atributos mal formados o & no escapados.
  // rss-parser usa xml2js que es estricto. Reemplazamos los unescaped ampersands que rompen todo.
  text = text.replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g, '&amp;');
  return text;
}

export async function syncRssFeeds() {
  for (const site of FEED_URLS) {
    try {
      const xmlString = await fetchAndFixRSS(site.url);
      const $ = cheerio.load(xmlString, { xmlMode: true });
      
      const items = $('item').toArray();
      
      for (const el of items) {
        const item = $(el);
        const title = item.children('title').text();
        const link = item.children('link').text();
        const pubDateStr = item.children('pubDate').text();
        
        let imageUrl = item.children('enclosure').attr('url') || null;
        if (!imageUrl) {
          imageUrl = item.children('media\\:content, content').attr('url') || null;
        }

        let fullContent = item.children('content\\:encoded').text() || item.children('description').text() || '';
        if (!imageUrl) {
          const imgMatch = fullContent.match(/<img[^>]+src=["']([^"']+)["']/i);
          if (imgMatch && imgMatch[1]) imageUrl = imgMatch[1];
        }

        const snippet = stripHtml(fullContent).substring(0, 200) + '...';

        const categories = [];
        item.children('category').each((i, cat) => {
           categories.push($(cat).text());
        });

        const { error } = await supabase
          .from('articles')
          .upsert({
            title: title,
            content: fullContent,
            content_snippet: snippet,
            source_url: link,
            source: site.name,
            image: imageUrl,
            published_at: new Date(pubDateStr || Date.now()).toISOString(),
            status: 'published',
            scraped: false,
            categories: categories.length > 0 ? categories : ['Noticias']
          }, { onConflict: 'source_url' });
          
        if (error) console.error(`Supabase Upsert Error (${site.name}):`, error.message);
      }
    } catch (error) {
      console.error(`Error fetching news from ${site.name}:`, error.message);
    }
  }
}

export async function scrapeFullArticle(url) {
  try {
    // 1. Eliminar el proxy, hacer fetch directo desde el servidor NodeJS
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    });
    
    if (!res.ok) return null;
    const htmlString = await res.text();
    const $ = cheerio.load(htmlString);
    
    // 2. Selectores Específicos por Dominio
    let $article = null;
    if (url.includes('misionesonline.net')) $article = $('.entry-content').first();
    else if (url.includes('elterritorio.com.ar')) $article = $('.nota-cuerpo').first();
    else if (url.includes('diariodelaciudad.com.ar')) $article = $('.td-post-content, .entry-content').first();
    else if (url.includes('misionescuatro.com')) $article = $('.entry-content').first();
    else if (url.includes('primeraedicion.com.ar')) $article = $('.entry-content').first();
    else $article = $('article, .entry-content, .nota-cuerpo, .content, main').first(); // Fallback
    
    if (!$article || !$article.length) return null;

    // 3. Limpieza Avanzada (Embeds Sociales, Ads, Scripts, Recomendaciones)
    const selectorsToRemove = [
      'blockquote.twitter-tweet', 'iframe[src*="twitter.com"]', 'iframe[src*="x.com"]',
      'blockquote.instagram-media', 'iframe[src*="instagram.com"]',
      'blockquote.tiktok-embed', 'iframe[src*="tiktok.com"]',
      'div.fb-post', 'iframe[src*="facebook.com"]',
      'script', 'style', 'noscript', 'iframe', 'object', 'embed',
      '.ad-container', '.banner', '.td-a-rec', '.apester-media'
    ];
    
    $article.find(selectorsToRemove.join(', ')).remove();
    
    // Remover párrafos de "Leé también"
    $article.find('p, div, h2, h3, h4').each((i, el) => {
      const text = $(el).text().toLowerCase();
      if (text.includes('leé también') || text.includes('lee también') || 
          text.includes('te puede interesar') || text.includes('quizás te interese') ||
          text.includes('lee mas:')) {
        $(el).remove();
      }
    });
    
    // Extraemos el texto limpio
    const articleBody = $article.text().trim();
    
    return articleBody || null;
  } catch (error) {
    return null;
  }
}

export async function updateArticleInCache(id, newContent, newImage, editedContent = null, editedTitle = null, editedCategory = null) {
  // Ahora actualiza directamente en Supabase (Lazy Scrape Client-Side Callback)
  const updateData = { 
    content: newContent, 
    scraped: true
  };

  if (newImage) updateData.image = newImage;
  if (editedContent) updateData.edited_content = editedContent;
  if (editedTitle) updateData.edited_title = editedTitle;
  if (editedCategory) updateData.categories = [editedCategory];

  const { error } = await supabase
    .from('articles')
    .update(updateData)
    .eq('id', id); // o eq('source_url', id) si el ID que pasamos es diferente

  if (error) console.error(`Error updating scraped article ${id}:`, error);
}

export function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
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

  return Object.keys(words).sort((a, b) => words[b] - words[a]).slice(0, count).map(w => w.charAt(0).toUpperCase() + w.slice(1));
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
  
  return Object.keys(catCount).sort((a, b) => catCount[b] - catCount[a]).slice(0, count).map(c => c.charAt(0).toUpperCase() + c.slice(1));
}
