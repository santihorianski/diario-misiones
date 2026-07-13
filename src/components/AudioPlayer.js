'use client';

import { useState, useEffect } from 'react';

export default function AudioPlayer({ title, contentHtml }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [utterance, setUtterance] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    } else {
      setIsSupported(false);
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const togglePlay = () => {
    if (!speechSynthesis) return;

    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      // Limpiamos el HTML para leer solo texto
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = contentHtml;
      const plainText = tempDiv.textContent || tempDiv.innerText || '';

      const textToRead = `${title}. ${plainText}`;
      
      const newUtterance = new SpeechSynthesisUtterance(textToRead);
      newUtterance.lang = 'es-AR'; // Español de Argentina o el default
      newUtterance.rate = 1.05; // Velocidad un poquito más rápida para no aburrir
      
      newUtterance.onend = () => setIsPlaying(false);
      newUtterance.onerror = () => setIsPlaying(false);

      setUtterance(newUtterance);
      speechSynthesis.speak(newUtterance);
      setIsPlaying(true);
    }
  };

  if (!isSupported) return null;

  return (
    <div className="audio-player-container mb-6 mt-2">
      <button 
        onClick={togglePlay}
        className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-[15px] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 ${
          isPlaying 
            ? 'bg-gray-800 text-white hover:bg-gray-700' 
            : 'bg-[#E5232A] text-white hover:bg-[#c71e24]'
        }`}
      >
        {isPlaying ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
            Detener Lectura
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            Escuchar Noticia
          </>
        )}
      </button>
    </div>
  );
}
