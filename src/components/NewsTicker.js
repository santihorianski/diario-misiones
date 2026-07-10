'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NewsTicker({ news }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !news || news.length === 0) return null;

  return (
    <div className="bg-[#f4f4f4] border-b border-gray-200 text-sm h-[45px] flex items-center overflow-hidden">
      <div className="container mx-auto max-w-[1250px] px-6 h-full flex items-center justify-between">
        
        {/* Ticker Izquierdo */}
        <div className="flex items-center h-full flex-1 overflow-hidden relative">
          <div className="flex items-center text-[#E5232A] font-bold shrink-0 mr-4 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5232A] mr-1.5 animate-pulse"></span>
            Minuto a minuto
          </div>
          
          <div className="marquee">
            {news.map((item, i) => (
              <span key={`t1-${i}`} className="ticker-item text-gray-800">
                <Link href={`/article/${item.id}`} className="hover:text-blue-600 hover:underline">
                  {item.title}
                </Link>
                <span className="text-gray-400 text-xs ml-2 font-normal">hace 5 min</span>
                <span className="mx-4 text-gray-300">|</span>
              </span>
            ))}
            {news.map((item, i) => (
              <span key={`t2-${i}`} className="ticker-item text-gray-800">
                <Link href={`/article/${item.id}`} className="hover:text-blue-600 hover:underline">
                  {item.title}
                </Link>
                <span className="text-gray-400 text-xs ml-2 font-normal">hace 5 min</span>
                <span className="mx-4 text-gray-300">|</span>
              </span>
            ))}
          </div>
        </div>

        {/* Social Pills Derecha */}
        <div className="hidden lg:flex items-center gap-2 shrink-0 ml-6 text-xs text-gray-600 font-medium">
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm">
            <span className="text-blue-600 font-bold">G</span> Google 40,1M
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm">
            <span className="text-blue-600 font-bold">f</span> Facebook 12,7M
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm">
            <span className="text-pink-600 font-bold">ig</span> Instagram 7,7M
          </div>
        </div>

      </div>
    </div>
  );
}
