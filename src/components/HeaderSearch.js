'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeaderSearch() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="w-full bg-[var(--background)] border-b border-[var(--border-color)] py-6 shadow-sm hidden md:block">
      <div className="container mx-auto max-w-[1250px] px-6 flex items-center justify-between gap-6">
        
        {/* LOGO IZQUIERDA (Original, más grande) */}
        <Link href="/" className="text-[70px] lg:text-[85px] font-black tracking-tighter italic flex items-center hover:scale-[1.02] transition-transform duration-300 leading-none shrink-0">
          <span className="text-[var(--foreground)] drop-shadow-md">MISIONES</span>
          <span className="text-[#E5232A] drop-shadow-md ml-1">YA</span>
        </Link>

        {/* DERECHA (Fecha y Buscador) */}
        <div className="flex-1 flex flex-col items-end gap-2">
          
          {/* FECHA EN VIVO */}
          <div className="text-[12px] md:text-[13px] font-medium text-[var(--text-muted)] uppercase tracking-widest">
            {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>

          <form onSubmit={handleSearch} className="relative w-full max-w-sm group">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar noticias..." 
              className="w-full border-2 border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--foreground)] rounded-full py-2 px-5 pr-12 focus:outline-none focus:border-[var(--primary)] transition-colors shadow-inner font-medium text-[14px]"
            />
            <button 
              type="submit" 
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-[var(--primary)] text-white rounded-full hover:bg-red-700 transition-colors"
            >
              <Search size={14} strokeWidth={3} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
