'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

function StoryItem({ article }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link 
      href={`/article/${article.id}`}
      className="flex flex-col items-center gap-2 group min-w-[85px] max-w-[85px] snap-start"
    >
      {/* Brand-style Ring */}
      <div className="relative w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-[var(--primary)] to-red-800 shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0">
        <div className="w-full h-full rounded-full border-2 border-white dark:border-[var(--card-bg)] overflow-hidden relative bg-gray-100 flex items-center justify-center">
          {article.image && !imgError ? (
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover"
              onError={() => {
                setImgError(true);
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#E5232A] to-[#990f14] flex flex-col items-center justify-center text-white">
              <span className="font-bold text-[11px] leading-tight text-center drop-shadow-sm px-1 font-[family-name:var(--font-serif)]">Misiones<br/>Ya</span>
            </div>
          )}
        </div>
      </div>
      <span className="text-[11px] leading-tight text-center font-bold text-[var(--foreground)] line-clamp-2 px-1 opacity-90 group-hover:opacity-100 group-hover:text-[#E5232A]">
        {article.title}
      </span>
    </Link>
  );
}

export default function NewsStories({ articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="w-full my-4 bg-white dark:bg-[var(--card-bg)] pt-4 pb-2 border-b border-[var(--border-color)] overflow-hidden">
      <div className="container mx-auto">
        <div className="flex gap-5 justify-start md:justify-center overflow-x-auto scrollbar-hide pb-4 px-4 snap-x">
          {articles.map((article) => (
            <StoryItem key={article.id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}
