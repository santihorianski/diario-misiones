'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full sticky top-0 z-50">
      {/* Main Navigation - Estilo Diario Moderno (Glassmorphism) */}
      <header className="bg-[var(--background)]/90 backdrop-blur-md border-t border-b border-[var(--border-color)] transition-all shadow-sm">
        <div className="container mx-auto max-w-[1250px] px-6 h-[56px] flex items-center justify-between relative">
          
          {/* Izquierda: Hamburguesa y Secciones */}
          <div className="flex items-center gap-5 z-10 h-full">
            <button onClick={() => setIsMenuOpen(true)} className="flex items-center gap-1.5 text-[var(--foreground)] hover:text-red-600 transition-colors h-full">
              <Menu size={22} strokeWidth={2.5} />
              <span className="hidden md:block font-bold text-[14px] ml-1 uppercase tracking-wider">Secciones</span>
            </button>
            <div className="hidden lg:flex items-center gap-6 font-bold text-[13.5px] uppercase ml-6 tracking-wide h-full">
              <Link href="/" className="flex items-center h-full text-[var(--foreground)] hover:text-red-600 transition-colors">Últimas noticias</Link>
              <Link href="/categoria/politica" className="flex items-center h-full text-[var(--foreground)] hover:text-red-600 transition-colors">Política</Link>
              <Link href="/categoria/economia" className="flex items-center h-full text-[var(--foreground)] hover:text-red-600 transition-colors">Economía</Link>
              <Link href="/categoria/deportes" className="flex items-center h-full text-[var(--foreground)] hover:text-red-600 transition-colors">Deportes</Link>
            </div>
          </div>

          {/* Logo en Móvil (solo visible en pantallas pequeñas) */}
          <div className="md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="text-3xl font-black tracking-tighter italic flex items-center leading-none">
              <span className="text-[var(--foreground)] drop-shadow-sm">MISIONES</span>
              <span className="text-[#E5232A] drop-shadow-sm ml-1">YA</span>
            </Link>
          </div>

          {/* Derecha: Lupa Móvil */}
          <div className="flex items-center gap-4 z-10 text-[var(--foreground)]">
            <Link href="/buscar" className="md:hidden hover:text-red-600 transition-colors p-2">
              <Search size={22} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </header>

      {/* Menú Lateral Offcanvas */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Overlay oscuro */}
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setIsMenuOpen(false)}
          ></div>
          
          {/* Sidebar */}
          <div className="relative w-[320px] h-full bg-[#000518] text-white shadow-2xl flex flex-col animate-slide-in">
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#E5232A]">
              <span className="font-black text-2xl italic tracking-tighter drop-shadow-md">MISIONES YA</span>
              <button onClick={() => setIsMenuOpen(false)} className="hover:text-gray-200 bg-white/20 p-1 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col p-6 space-y-5 overflow-y-auto font-black text-xl tracking-tight">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between hover:text-[#E5232A] transition-colors border-b border-white/5 pb-4 group"><span>Últimas Noticias</span> <span className="text-gray-600 text-sm group-hover:text-[#E5232A]">›</span></Link>
              <Link href="/categoria/politica" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between hover:text-[#E5232A] transition-colors border-b border-white/5 pb-4 group"><span>Política</span> <span className="text-gray-600 text-sm group-hover:text-[#E5232A]">›</span></Link>
              <Link href="/categoria/economia" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between hover:text-[#E5232A] transition-colors border-b border-white/5 pb-4 group"><span>Economía</span> <span className="text-gray-600 text-sm group-hover:text-[#E5232A]">›</span></Link>
              <Link href="/categoria/sociedad" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between hover:text-[#E5232A] transition-colors border-b border-white/5 pb-4 group"><span>Sociedad</span> <span className="text-gray-600 text-sm group-hover:text-[#E5232A]">›</span></Link>
              <Link href="/categoria/deportes" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between hover:text-[#E5232A] transition-colors border-b border-white/5 pb-4 group"><span>Deportes</span> <span className="text-gray-600 text-sm group-hover:text-[#E5232A]">›</span></Link>
              <Link href="/categoria/policiales" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between hover:text-[#E5232A] transition-colors border-b border-white/5 pb-4 group"><span>Policiales</span> <span className="text-gray-600 text-sm group-hover:text-[#E5232A]">›</span></Link>
              <Link href="/categoria/tecnologia" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between hover:text-[#E5232A] transition-colors group"><span>Tecnología</span> <span className="text-gray-600 text-sm group-hover:text-[#E5232A]">›</span></Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
