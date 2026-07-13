import { fetchAllNews } from '@/lib/newsFetcher';

export default async function sitemap() {
  const news = await fetchAllNews();
  const baseUrl = 'https://misionesya-news.pages.dev';

  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    }
  ];

  const newsRoutes = news.map((article) => ({
    url: `${baseUrl}/article/${article.id}`,
    lastModified: new Date(article.pubDate),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [...routes, ...newsRoutes];
}
