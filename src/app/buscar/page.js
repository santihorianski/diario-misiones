import { fetchAllNews, stripHtml } from '@/lib/fetchNews';
import Link from 'next/link';

export default async function BuscarPage({ searchParams }) {
  // Await searchParams in Next.js 15
  const params = await searchParams;
  const query = params?.q || '';
  const decodedQuery = decodeURIComponent(query).toLowerCase();
  
  const news = await fetchAllNews();
  
  // Filtrar noticias por título o contenido
  const filteredNews = query ? news.filter(article => {
    return article.title.toLowerCase().includes(decodedQuery) || 
           article.contentSnippet.toLowerCase().includes(decodedQuery);
  }) : [];

  return (
    <main>
      <div className="container" style={{ marginTop: '2rem' }}>
        <header className="section-header" style={{ marginBottom: '2rem', borderBottom: '2px solid var(--foreground)', paddingBottom: '1rem' }}>
          <h1 className="site-title" style={{ fontSize: '2rem', textAlign: 'left' }}>
            Resultados para: <span style={{ color: 'var(--primary)' }}>"{query}"</span>
          </h1>
        </header>

        {!query ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <h2>Ingresa un término de búsqueda en la barra superior.</h2>
          </div>
        ) : filteredNews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <h2>No se encontraron noticias que coincidan con tu búsqueda.</h2>
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
