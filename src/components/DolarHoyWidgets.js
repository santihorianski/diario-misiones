'use client';
import { useState, useEffect } from 'react';

export default function DolarHoyWidgets() {
  const [activeTab, setActiveTab] = useState('blue');
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDolar() {
      try {
        const res = await fetch('https://dolarapi.com/v1/dolares');
        const data = await res.json();
        
        const formatted = {};
        data.forEach(item => {
          formatted[item.casa] = item;
        });
        
        setQuotes(formatted);
      } catch (err) {
        console.error('Error fetching dolar:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDolar();
    const interval = setInterval(fetchDolar, 300000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'blue', label: 'Blue' },
    { id: 'oficial', label: 'Oficial' },
    { id: 'mep', label: 'MEP' },
    { id: 'tarjeta', label: 'Tarjeta' }
  ];

  const activeData = quotes[activeTab];

  return (
    <div className="dolarhoy-mini" style={{
      backgroundColor: '#111827',
      color: '#f8fafc',
      padding: '0.4rem 0',
      fontSize: '0.85rem',
      fontFamily: 'var(--font-sans)',
      borderBottom: '2px solid var(--primary)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', paddingBottom: '0' }}>
        
        {/* Minimal Tabs */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={{ fontWeight: '700', color: '#94a3b8', marginRight: '0.5rem' }}>DÓLAR</span>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === tab.id ? '#fff' : '#64748b',
                fontWeight: activeTab === tab.id ? '700' : '500',
                cursor: 'pointer',
                padding: '0',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
                borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Minimal Values */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {loading ? (
            <span style={{ color: '#64748b' }}>Cargando...</span>
          ) : activeData ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>C</span>
                <span style={{ fontWeight: '700' }}>${activeData.compra}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>V</span>
                <span style={{ fontWeight: '700' }}>${activeData.venta}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
              </div>
            </>
          ) : null}
        </div>

      </div>
    </div>
  );
}
