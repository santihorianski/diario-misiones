import { fetchAllNews, scrapeFullArticle, updateArticleInCache } from '@/lib/fetchNews';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReadingProgress from '@/components/ReadingProgress';

export const revalidate = 900;

export async function generateStaticParams() {
  const news = await fetchAllNews();
  return news.map((article) => ({
    id: article.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const news = await fetchAllNews();
  const article = news.find((item) => item.id === id);

  if (!article) return { title: 'Noticia no encontrada' };

  return {
    title: `${article.title} | Espectador Misiones`,
    description: article.contentSnippet,
    openGraph: {
      title: article.title,
      description: article.contentSnippet,
      url: `https://espectadormisiones.com/article/${article.id}`,
      siteName: 'Espectador Misiones',
      images: [
        {
          url: article.image || 'https://espectadormisiones.com/default-share.jpg',
          width: 1200,
          height: 630,
        },
      ],
      locale: 'es_AR',
      type: 'article',
    },
  };
}

export default async function ArticlePage({ params }) {
  const { id } = await params;
  const news = await fetchAllNews();
  const article = news.find((item) => item.id === id);

  if (!article) {
    notFound();
  }

  // LAZY SCRAPING: Si la noticia nunca fue extraída o está muy corta, la robamos AHORA
  if (!article.scraped && article.fullContent.length < 1500) {
    const scrapedText = await scrapeFullArticle(article.link);
    if (scrapedText && scrapedText.length > article.fullContent.length) {
      article.fullContent = scrapedText;
      
      let newImage = null;
      if (!article.image) {
        const imgMatch = scrapedText.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch && imgMatch[1]) newImage = imgMatch[1];
        if (newImage) article.image = newImage;
      }
      
      // Guardar en el servidor (caché local) de forma asíncrona pero sin bloquear al lector
      updateArticleInCache(article.id, scrapedText, newImage);
    }
  }

  return (
    <>
      <ReadingProgress />
      <main className="article-page">
        <header className="header">
          <h1 className="site-title">Espectador Misiones</h1>
        </header>

        <div className="container article-container">
          <Link href="/" className="back-link">← Volver a la Portada</Link>
          <article className="full-article">
            <div className="article-header">
              <span className="news-source">FUENTE: {article.source}</span>
              <h1 className="article-title">{article.title}</h1>
              <div className="article-meta">
                Publicado el: {new Date(article.pubDate).toLocaleDateString('es-AR', {
                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </div>
            </div>
          
          {article.image && (
            <img src={article.image} alt={article.title} className="article-main-image" />
          )}

          <div 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.fullContent }}
          />

          {/* Compartir Redes Sociales (Minimalista Moderno) */}
          <div className="share-container">
            <span className="share-label">Compartir artículo</span>
            
            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' https://espectadormisiones.com/article/' + article.id)}`} target="_blank" rel="noopener noreferrer" className="share-btn" style={{ padding: '0.5rem 1.2rem', backgroundColor: '#25D366', color: '#fff', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              WhatsApp
            </a>
            
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent('https://espectadormisiones.com/article/' + article.id)}`} target="_blank" rel="noopener noreferrer" className="share-btn" style={{ padding: '0.5rem 1.2rem', backgroundColor: '#000000', color: '#fff', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              X (Post)
            </a>

            <a href={`https://t.me/share/url?url=${encodeURIComponent('https://espectadormisiones.com/article/' + article.id)}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer" className="share-btn" style={{ padding: '0.5rem 1.2rem', backgroundColor: '#0088cc', color: '#fff', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              Telegram
            </a>

            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://espectadormisiones.com/article/' + article.id)}`} target="_blank" rel="noopener noreferrer" className="share-btn" style={{ padding: '0.5rem 1.2rem', backgroundColor: '#1877F2', color: '#fff', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              Facebook
            </a>
          </div>

          <div className="article-footer">
            <a href={article.link} target="_blank" rel="noopener noreferrer" className="original-link">
              Leer fuente original
            </a>
          </div>
        </article>
      </div>

      {/* Te puede interesar (Noticias Relacionadas) */}
      <div style={{ backgroundColor: 'var(--background)', borderTop: '4px solid var(--primary)', padding: '4rem 0' }}>
        <div className="container">
          <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem', borderBottom: '2px solid var(--foreground)', paddingBottom: '0.5rem', display: 'inline-block' }}>
            Te puede interesar...
          </h3>
          <div className="news-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            {news.filter(n => n.id !== article.id).slice(0, 4).map((item, idx) => (
              <article key={idx} className="grid-article article-card" style={{ backgroundColor: 'var(--card-bg)' }}>
                {item.image && (
                  <Link href={`/article/${item.id}`}>
                    <img src={item.image} alt={item.title} className="grid-image" loading="lazy" />
                  </Link>
                )}
                <div className="secondary-content">
                  <span className="news-source">{item.source}</span>
                  <Link href={`/article/${item.id}`}>
                    <h4 className="grid-title" style={{ fontSize: '1rem' }}>{item.title}</h4>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
