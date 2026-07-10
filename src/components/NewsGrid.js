'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
          <article key={item.id || idx} className="grid-article article-card animate-in fade-in slide-in-from-bottom-4 duration-500">
            {item.image && (
              <Link href={`/article/${item.id}`} className="relative block w-full aspect-[16/9]">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </Link>
            )}
            <div className="secondary-content p-4">
              <Link href={`/article/${item.id}`}>
                <h3 className="grid-title text-lg font-bold leading-tight mb-2 hover:text-blue-600 transition-colors">{item.title}</h3>
              </Link>
              <p className="news-snippet text-gray-600 text-sm line-clamp-3 mb-4">{stripHtml(item.contentSnippet)}</p>
              
              <div className="news-meta text-xs text-gray-400">
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
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded transition-colors text-sm uppercase tracking-wider"
          >
            Cargar más noticias
          </button>
        </div>
      )}
    </div>
  );
}
