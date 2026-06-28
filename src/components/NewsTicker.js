"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NewsTicker({ news }) {
  // Solo renderizamos en el cliente para evitar hidrataciones erróneas
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !news || news.length === 0) return null;

  return (
    <div className="news-ticker-wrapper">
      <div className="ticker-label">
        <span className="pulsing-dot"></span> ÚLTIMA HORA
      </div>
      <div className="ticker-content">
        <div className="marquee">
          {/* Renderizamos doble para lograr el efecto infinito */}
          {news.map((item, i) => (
            <span key={`t1-${i}`} className="ticker-item">
              <span className="ticker-source">{item.source}</span>
              <Link href={`/article/${item.id}`} className="ticker-link">
                {item.title}
              </Link>
            </span>
          ))}
          {news.map((item, i) => (
            <span key={`t2-${i}`} className="ticker-item">
              <span className="ticker-source">{item.source}</span>
              <Link href={`/article/${item.id}`} className="ticker-link">
                {item.title}
              </Link>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
