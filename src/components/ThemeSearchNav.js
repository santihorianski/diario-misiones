'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ThemeSearchNav() {
  const [isDark, setIsDark] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  // Initialize theme (Siempre claro por defecto, a menos que guarde oscuro explícitamente)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        setIsDark(true);
      } else {
        document.documentElement.classList.remove('dark');
        setIsDark(false);
      }
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      
      {/* Botón de Modo Oscuro */}
      <button 
        onClick={toggleTheme}
        aria-label="Alternar modo oscuro"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--foreground)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isDark ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        )}
      </button>

      {/* Buscador */}
      <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '0.4rem 1rem',
            borderRadius: '20px 0 0 20px',
            border: '1px solid var(--border-color)',
            borderRight: 'none',
            background: 'var(--card-bg)',
            color: 'var(--foreground)',
            outline: 'none',
            fontSize: '0.85rem'
          }}
        />
        <button 
          type="submit" 
          aria-label="Buscar"
          style={{
            padding: '0.4rem 0.8rem',
            borderRadius: '0 20px 20px 0',
            border: '1px solid var(--border-color)',
            borderLeft: 'none',
            background: 'var(--card-bg)',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
      </form>

    </div>
  );
}
