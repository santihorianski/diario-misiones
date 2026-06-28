import Link from 'next/link';
import { fetchAllNews, getTrendingTopics, getTopCategories } from '@/lib/fetchNews';
import WeatherWidget from '@/components/WeatherWidget';
import ThemeSearchNav from '@/components/ThemeSearchNav';

export default async function Navbar() {
  const news = await fetchAllNews();
  const trendingTopics = getTrendingTopics(news, 6);
  
  // The user explicitly requested these categories
  const categories = ["Política", "Economía", "Sociedad", "Policiales", "Deportes", "Internacionales"];

  return (
    <div className="navbar-wrapper">
      {/* Temas de Hoy y Clima */}
      <div className="trending-bar">
        <div className="container trending-container" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="trending-label">Temas de hoy:</span>
            <div className="trending-links">
              {trendingTopics.map((topic, idx) => (
                <span key={idx} className="trending-item">
                  <Link href={`/tema/${encodeURIComponent(topic.toLowerCase())}`}>{topic}</Link>
                  {idx < trendingTopics.length - 1 && <span className="trending-separator">·</span>}
                </span>
              ))}
            </div>
          </div>
          <WeatherWidget />
        </div>
      </div>

      {/* Navegación Principal */}
      <nav className="main-nav">
        <div className="container nav-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ul className="nav-list">
            <li>
              <Link href="/" className="nav-link active">Inicio</Link>
            </li>
            {categories.map((cat, idx) => (
              <li key={idx}>
                <Link href={`/categoria/${encodeURIComponent(cat.toLowerCase())}`} className="nav-link">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
          
          <ThemeSearchNav />
        </div>
      </nav>
    </div>
  );
}
