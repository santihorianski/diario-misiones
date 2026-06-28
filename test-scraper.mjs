import * as cheerio from 'cheerio';

async function testScraper(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
    if (!res.ok) {
      console.log('HTTP Error:', res.status, res.statusText);
      return;
    }
    const html = await res.text();
    const $ = cheerio.load(html);
    
    // Remove ads
    $('script, style, noscript, iframe, .ad, .social-share, .related-posts, nav, header, footer').remove();

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
        console.log('Found selector:', selector);
        contentHtml = el.html();
        break;
      }
    }

    if (!contentHtml) {
      console.log('No common selectors found, trying all paragraphs in article...');
      const paragraphs = $('article p');
      if (paragraphs.length > 0) {
        paragraphs.each((i, el) => {
          contentHtml += `<p>${$(el).html()}</p>`;
        });
      }
    }

    console.log('Content Length:', contentHtml ? contentHtml.length : 0);
    if (contentHtml) {
      console.log('Content Snippet:', contentHtml.substring(0, 500));
    } else {
      console.log('FAILED to extract any content.');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

testScraper('https://misionesonline.net/2026/06/15/posadenos-y-turistas-coparon-la-costanera-de-posadas-este-lunes-feriado/');
