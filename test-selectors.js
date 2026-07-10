import * as cheerio from 'cheerio';

const urls = [
  'https://misionesonline.net/2026/07/09/misiones-online-test/', // Need real URLs, I will pull from their RSS feeds first
];

async function run() {
  // We'll first fetch the RSS feeds to get a valid URL for each source
  const Parser = (await import('rss-parser')).default;
  const parser = new Parser();

  const FEED_URLS = [
    { name: 'Misiones Online', url: 'https://misionesonline.net/feed/' },
    { name: 'El Territorio', url: 'https://www.elterritorio.com.ar/rss' },
    { name: 'Diario de la Ciudad', url: 'https://diariodelaciudad.com.ar/feed/' },
    { name: 'Misiones Cuatro', url: 'https://misionescuatro.com/feed/' },
    { name: 'Primera Edición', url: 'https://www.primeraedicion.com.ar/feed/' }
  ];

  for (const site of FEED_URLS) {
    try {
      console.log(`\n--- Fetching RSS for: ${site.name} ---`);
      const feed = await parser.parseURL(site.url);
      if (feed.items.length === 0) {
        console.log(`No items found in feed for ${site.name}`);
        continue;
      }
      
      const testUrl = feed.items[0].link;
      console.log(`Testing URL: ${testUrl}`);
      
      // Let's use allorigins to mimic the scraper
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(testUrl)}`;
      const res = await fetch(proxyUrl);
      const data = await res.json();
      
      const $ = cheerio.load(data.contents);
      
      // Dump potential body containers
      console.log('Found <article>?:', $('article').length);
      console.log('Found .entry-content?:', $('.entry-content').length);
      console.log('Found .nota-cuerpo?:', $('.nota-cuerpo').length);
      
      // Specific domain heuristics:
      if (site.name === 'Misiones Online') console.log('Misiones Online body snippet:', $('.entry-content').text().substring(0, 100).trim());
      if (site.name === 'El Territorio') console.log('El Territorio body snippet:', $('.nota-cuerpo').text().substring(0, 100).trim());
      // Add generic fallback
      const generic = $('article, .entry-content, .nota-cuerpo, .content, main').first();
      console.log(`Fallback length: ${generic.text().length}`);
      
    } catch (err) {
      console.error(`Error processing ${site.name}:`, err.message);
    }
  }
}

run();
