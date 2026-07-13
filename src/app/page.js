import { getPublishedArticles } from '@/app/actions/articles';
import Link from 'next/link';
import NewsGrid from '@/components/NewsGrid';
import AdBanner from '@/components/AdBanner';
import TNHeroGrid from '@/components/TNHeroGrid';
import NewsTicker from '@/components/NewsTicker';
import NewsStories from '@/components/NewsStories';

export const revalidate = 900; 

export default async function Home() {
  const news = await getPublishedArticles();

  if (news.length === 0) {
    return (
      <main>
        <div className="container">
          <div className="loading">Obteniendo las últimas noticias...</div>
        </div>
      </main>
    );
  }

  // Optimización de Payload: getPublishedArticles ya devuelve un payload optimizado
  const lightNews = news;

  // Filtrar para dar más protagonismo a otras fuentes que no sean Misiones Online en el Top 4
  const premiumNews = lightNews.filter(n => n.source.toLowerCase() !== 'misiones online');
  const misionesOnline = lightNews.filter(n => n.source.toLowerCase() === 'misiones online');

  // El Hero Grid usa las primeras 4 noticias premium. Si no hay suficientes, rellena con las de Misiones Online.
  const carouselNews = [...premiumNews, ...misionesOnline].slice(0, 4);
  
  // Las demás noticias van al grid inferior respetando el orden cronológico original
  const carouselIds = new Set(carouselNews.map(n => n.id));
  const gridNews = lightNews.filter(n => !carouselIds.has(n.id));

  return (
    <main className="bg-[var(--background)]">
      {/* Ticker Dinámico Última Hora */}
      <NewsTicker news={lightNews.slice(0, 10)} />

      {/* Historias estilo Instagram */}
      <NewsStories articles={lightNews.slice(0, 8)} />

      <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 mt-2">
        {/* Carrusel Dinámico (Hero 4 columnas Full-Width) */}
        <TNHeroGrid articles={carouselNews} />
      </div>

      <div className="container pt-4">
        
        <div className="newspaper-layout">
          
          {/* Columna Principal (Izquierda) */}
          <div className="main-content">
            <h2 className="section-title !mt-0">Últimas Noticias</h2>
            <NewsGrid news={gridNews} />
          </div>

          {/* Destacados Secundarios (Sidebar Derecha) */}
          <aside className="secondary-sidebar">
            <AdBanner type="sidebar" />

            {/* Lo más leído (ahora arriba del CTA) */}
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm p-6 mb-8 mt-4 rounded-lg">
              <h3 className="border-b-[3px] border-[var(--primary)] pb-2 mb-5 font-black uppercase text-[var(--foreground)] tracking-tight text-xl">Lo más leído</h3>
              <ol className="flex flex-col gap-5">
                {lightNews.slice(5, 10).map((item, idx) => (
                  <li key={item.id} className="flex gap-4 items-start border-b border-[var(--border-color)] pb-5 last:border-0 last:pb-0 group">
                    <span className="text-4xl font-black text-[var(--primary)] leading-none mt-1">{idx + 1}.</span>
                    <Link href={`/article/${item.id}`} className="flex-1">
                      <h4 className="text-[var(--foreground)] text-[15px] font-bold group-hover:text-[var(--primary)] transition-colors leading-snug">{item.title}</h4>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
            
          </aside>

        </div>

        <AdBanner type="horizontal" />

      </div>
    </main>
  );
}
