'use client';
import { useState, useEffect } from 'react';
import AudioPlayer from './AudioPlayer';

export default function ArticleContent({ initialArticle }) {
  const [content, setContent] = useState(initialArticle.fullContent);
  const [isLoading, setIsLoading] = useState(!initialArticle.scraped && initialArticle.fullContent.length < 1500);

  useEffect(() => {
    if (isLoading) {
      // Llamada no bloqueante a la API para extraer el texto
      fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: initialArticle.id, link: initialArticle.link })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setContent(data.content);
        }
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
    }
  }, [initialArticle, isLoading]);

  if (isLoading) {
    return (
      <div className="article-content space-y-4 animate-pulse pt-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
        <div className="mt-8 h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    );
  }

  useEffect(() => {
    // Mover el botón de escuchar noticia debajo de las fotos (antes del primer párrafo)
    if (!isLoading && content) {
      const timer = setTimeout(() => {
        const contentDiv = document.querySelector('.article-content');
        const audioContainer = document.querySelector('#audio-player-wrapper');
        
        if (contentDiv && audioContainer) {
          const firstP = contentDiv.querySelector('p, h2, h3, h4');
          if (firstP) {
            contentDiv.insertBefore(audioContainer, firstP);
          }
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, content]);

  // Limpiar imágenes duplicadas del contenido HTML (porque ya mostramos la imagen principal arriba)
  const cleanContent = content ? content.replace(/<img[^>]*>/gi, '').replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '') : '';

  return (
    <>
      <div id="audio-player-wrapper">
        <AudioPlayer title={initialArticle.title} contentHtml={cleanContent} />
      </div>
      <div 
        className="article-content"
        dangerouslySetInnerHTML={{ __html: cleanContent }}
      />
    </>
  );
}
