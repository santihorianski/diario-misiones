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

  return (
    <>
      <AudioPlayer title={initialArticle.title} contentHtml={content} />
      <div 
        className="article-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
}
