import { fetchAllNews } from '@/lib/newsFetcher';
import Link from 'next/link';
import { stripHtml } from '@/lib/newsFetcher'; // Need to export stripHtml in fetchNews.js

export default async function CategoryPage({ params }) {
  const { id } = await params;
  const decodedCategory = decodeURIComponent(id);
  const news = await fetchAllNews();
  
  // Filtrado inteligente
  const catLower = decodedCategory.toLowerCase();
  
  const filteredNews = news.filter(article => {
    // 1. Check in RSS categories
    if (article.categories && Array.isArray(article.categories)) {
      const hasCat = article.categories.some(c => c.toLowerCase().includes(catLower));
      if (hasCat) return true;
    }
    
    // 2. Keyword match in title or snippet as fallback
    const titleMatch = article.title.toLowerCase().includes(catLower);
    
    // Some custom mapping for common categories
    let keywordMatch = false;
    if (catLower === 'policiales') {
      keywordMatch = /policía|robo|accidente|muerte|crimen|detenido|allanamiento|justicia/i.test(article.title);
    } else if (catLower === 'política') {
      keywordMatch = /gobierno|gobernador|presidente|milei|ley|diputados|senado|elecciones|ministro/i.test(article.title);
    } else if (catLower === 'economía') {
      keywordMatch = /dólar|precio|inflación|mercado|aumento|salario|pago|banco|afip/i.test(article.title);
    } else if (catLower === 'deportes') {
      keywordMatch = /fútbol|boca|river|partido|torneo|campeón|copa|jugador/i.test(article.title);
    }
    
    return titleMatch || keywordMatch;
  });

  return (
    <main>
      <div className="container">
        <header className="section-header" style={{ marginBottom: '2rem', borderBottom: '2px solid var(--foreground)', paddingBottom: '1rem' }}>
          <h1 className="site-title" style={{ fontSize: '2.5rem', textAlign: 'left' }}>
            {decodedCategory.charAt(0).toUpperCase() + decodedCategory.slice(1)}
          </h1>
        </header>

        {filteredNews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <h2>No se encontraron noticias recientes en esta categoría.</h2>
          </div>
        ) : (
          <div className="news-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {filteredNews.map((item, idx) => (
              <article key={idx} className="grid-article article-card">
                {item.image && (
                  <Link href={`/article/${item.id}`}>
                    <img src={item.image} alt={item.title} className="grid-image" loading="lazy" />
                  </Link>
                )}
                <div className="secondary-content">
                  <span className="news-source">FUENTE: {item.source}</span>
                  <Link href={`/article/${item.id}`}>
                    <h3 className="grid-title">{item.title}</h3>
                  </Link>
                  <p className="news-snippet">{stripHtml(item.contentSnippet)}</p>
                  
                  <div className="news-meta">
                    <span>{new Date(item.pubDate).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} hs</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
