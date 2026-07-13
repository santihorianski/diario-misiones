export const runtime = 'nodejs';
import { fetchAllNews, stripHtml } from '@/lib/newsFetcher';
import Link from 'next/link';

export default async function TemaPage({ params }) {
  const { id } = await params;
  const decodedTopic = decodeURIComponent(id);
  const news = await fetchAllNews();
  
  const topicLower = decodedTopic.toLowerCase();
  
  // Buscar coincidencia del tema en título o contenido
  const filteredNews = news.filter(article => {
    return article.title.toLowerCase().includes(topicLower) || 
           article.contentSnippet.toLowerCase().includes(topicLower);
  });

  return (
    <main>
      <div className="container">
        <header className="section-header" style={{ marginBottom: '2rem', borderBottom: '2px solid var(--foreground)', paddingBottom: '1rem' }}>
          <h1 className="site-title" style={{ fontSize: '2.5rem', textAlign: 'left' }}>
            Tema: {decodedTopic.charAt(0).toUpperCase() + decodedTopic.slice(1)}
          </h1>
        </header>

        {filteredNews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <h2>No se encontraron noticias recientes sobre este tema.</h2>
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

