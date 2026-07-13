import Link from 'next/link';
import { fetchAllNews, getTrendingTopics } from '@/lib/newsFetcher';

export default async function TemasDeHoy() {
  const news = await fetchAllNews();
  const trending = getTrendingTopics(news, 5);

  if (!trending || trending.length === 0) return null;

  return (
    <div className="bg-[#f4f4f4] text-[13px] font-sans border-b border-gray-300 h-[38px] flex items-center">
      <div className="container mx-auto px-6 flex items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar">
        <span className="text-gray-600 font-normal">Temas de hoy:</span>
        {trending.map((topic, idx) => (
          <span key={topic} className="flex items-center gap-2">
            <Link href={`/buscar?q=${encodeURIComponent(topic)}`} className="font-bold text-gray-900 hover:text-blue-600 transition-colors">
              {topic}
            </Link>
            {idx < trending.length - 1 && <span className="text-gray-400 font-bold">&middot;</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
