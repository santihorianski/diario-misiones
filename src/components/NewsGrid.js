'use client';
import { useState } from 'react';
import Link from 'next/link';
// We need stripHtml from fetchNews, but since it's a client component, 
// we'll just write a small helper here to avoid importing server-only code if there is any.
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
}

export default function NewsGrid({ news }) {
  const INITIAL_COUNT = 12;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const loadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  const visibleNews = news.slice(0, visibleCount);

  return (
    <div>
      <div className="news-grid">
        {visibleNews.map((item, idx) => (
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
      
      {visibleCount < news.length && (
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button 
            onClick={loadMore}
            style={{
              padding: '1rem 2rem',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            Cargar más noticias
          </button>
        </div>
      )}
    </div>
  );
}
