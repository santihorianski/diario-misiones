import { getAdminNews } from '@/lib/cms';
import { getPendingArticles } from '@/app/actions/articles';
import DashboardClient from './DashboardClient';

export default async function AdminDashboard() {
  const news = await getAdminNews();
  const pendingNews = await getPendingArticles();
  
  // Procesar noticias para el gráfico (últimos 7 días)
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const chartData = last7Days.map(date => {
    const dayName = date.toLocaleDateString('es-AR', { weekday: 'short' });
    const dateString = date.toISOString().split('T')[0];
    
    const publishedCount = news.filter(n => {
      if (!n.pubDate) return false;
      const pubDateString = new Date(n.pubDate).toISOString().split('T')[0];
      return pubDateString === dateString;
    }).length;

    return {
      name: dayName.charAt(0).toUpperCase() + dayName.slice(1),
      publicaciones: publishedCount
    };
  });

  return <DashboardClient newsCount={news.length} chartData={chartData} pendingNews={pendingNews} />;
}
