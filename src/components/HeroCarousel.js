"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroCarousel({ articles }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!articles || articles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000); // Rota cada 5 segundos
    return () => clearInterval(interval);
  }, [articles]);

  if (!articles || articles.length === 0) return null;

  return (
    <div className="hero-carousel-container">
      {articles.map((article, index) => {
        const isActive = index === currentIndex;
        return (
          <div key={article.id} className={`hero-slide ${isActive ? 'active' : ''}`}>
            {article.image && (
              <img src={article.image} alt={article.title} className="hero-bg-image" />
            )}
            <div className="hero-gradient-overlay"></div>
            <div className="hero-slide-content">
              <span className="hero-slide-source">{article.source}</span>
              <Link href={`/article/${article.id}`}>
                <h2 className="hero-slide-title">{article.title}</h2>
              </Link>
              <p className="hero-slide-snippet">{article.contentSnippet.substring(0, 120)}...</p>
            </div>
          </div>
        );
      })}
      
      {/* Indicadores / Puntos */}
      <div className="carousel-indicators">
        {articles.map((_, idx) => (
          <button 
            key={idx} 
            className={`indicator-dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Ir a noticia ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
