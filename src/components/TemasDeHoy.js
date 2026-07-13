import Link from 'next/link';
import { fetchAllNews, getTrendingTopics } from '@/lib/newsFetcher';
import { TrendingUp } from 'lucide-react';

export default async function TemasDeHoy() {
  const news = await fetchAllNews();
  const trending = getTrendingTopics(news, 5);

  if (!trending || trending.length === 0) return null;

  return (
    <div className="flex-1 flex items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar py-2 border-b md:border-b-0 border-[var(--border-color)]">
      <div className="flex items-center gap-1.5 text-[var(--text-muted)] font-bold text-[11px] uppercase tracking-wider h-full shrink-0">
        <TrendingUp size={14} className="text-[#E5232A]" />
        <span>Tendencias:</span>
      </div>
      {trending.map((topic, idx) => (
        <span key={topic} className="flex items-center">
          <Link href={`/buscar?q=${encodeURIComponent(topic)}`} className="font-semibold text-[var(--foreground)] hover:text-red-500 transition-colors leading-none">
            {topic}
          </Link>
          {idx < trending.length - 1 && <span className="mx-2 text-gray-300 dark:text-gray-700 leading-none flex items-center h-full">&middot;</span>}
        </span>
      ))}
    </div>
  );
}
