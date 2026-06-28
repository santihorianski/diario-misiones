'use client';
import { useEffect, useState } from 'react';

export default function DollarTicker() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRates() {
      try {
        const response = await fetch('https://dolarapi.com/v1/dolares');
        const data = await response.json();
        
        // Filtrar los que nos importan
        const targetTypes = ['oficial', 'blue', 'mep', 'tarjeta'];
        const filtered = data.filter(d => targetTypes.includes(d.casa));
        
        // Ordenarlos
        filtered.sort((a, b) => targetTypes.indexOf(a.casa) - targetTypes.indexOf(b.casa));
        
        setQuotes(filtered);
      } catch (error) {
        console.error("Error fetching dollar rates:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRates();
    // Actualizar cada 15 minutos (900000ms)
    const interval = setInterval(fetchRates, 900000);
    return () => clearInterval(interval);
  }, []);

  if (loading || quotes.length === 0) {
    return (
      <div className="dollar-ticker">
        <div className="container ticker-container">
          <span className="ticker-label">Cargando cotizaciones...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dollar-ticker">
      <div className="container ticker-container">
        
        {/* Ícono general de Moneda */}
        <div className="ticker-brand">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#4ade80'}}>
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
            <path d="M12 18V6"></path>
          </svg>
          <span className="ticker-label">Cotizaciones:</span>
        </div>

        <div className="ticker-items">
          {quotes.map((quote, idx) => (
            <span key={quote.casa} className="ticker-item">
              <span className="ticker-name">{quote.nombre}</span>{' '}
              <span className="ticker-value">${quote.venta}</span>
              
              {/* Ícono de tendencia (Simulado para fines estéticos) */}
              {quote.casa === 'blue' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              ) : quote.casa === 'oficial' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              )}

              {idx < quotes.length - 1 && <span className="ticker-separator">|</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
