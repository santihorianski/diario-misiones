import { fetchAllNews } from '@/lib/fetchNews';
import Link from 'next/link';
import NewsGrid from '@/components/NewsGrid';
import AdBanner from '@/components/AdBanner';
import HeroCarousel from '@/components/HeroCarousel';
import NewsTicker from '@/components/NewsTicker';

export const revalidate = 900; 

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
}

export default async function Home() {
  const news = await fetchAllNews();

  if (news.length === 0) {
    return (
      <main>
        <div className="container">
          <div className="loading">Obteniendo las últimas noticias...</div>
        </div>
      </main>
    );
  }

  const carouselNews = news.slice(0, 4);
  const gridNews = news.slice(4);

  return (
    <main>
      <header className="header">
        <h1 className="site-title">Espectador Misiones</h1>
        <div className="site-subtitle">
          <span>{new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span>Actualizado al Instante</span>
        </div>
      </header>

      {/* Ticker Dinámico Última Hora */}
      <NewsTicker news={news.slice(0, 10)} />

      <div className="container">
        
        <div className="newspaper-layout">
          
          {/* Carrusel Dinámico (Hero) */}
          <div className="hero-section">
            <HeroCarousel articles={carouselNews} />
          </div>

          {/* Destacados Secundarios (Sidebar) */}
          <aside className="secondary-sidebar">
            <AdBanner type="sidebar" />

            {/* Lo más leído (Simulado) */}
            <div className="most-read-section" style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
              <h3 style={{ borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Lo más leído</h3>
              <ol style={{ paddingLeft: '1.5rem', margin: 0 }}>
                {news.slice(5, 10).map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                    <Link href={`/article/${item.id}`}>
                      <h4 style={{ fontSize: '0.95rem', margin: 0, fontWeight: '600' }}>{item.title}</h4>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

        </div>

        <AdBanner type="horizontal" />

        {/* Último Momento (Grilla general paginada) */}
        <h2 className="section-title">Últimas Noticias</h2>
        
        <NewsGrid news={gridNews} />

      </div>
    </main>
  );
}
