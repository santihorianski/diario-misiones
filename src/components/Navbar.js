'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, Bell, User, X, Search } from 'lucide-react';
import { UserButton, useAuth } from '@clerk/nextjs';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  const { userId } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Main Header Azul Marino */}
      <header className="bg-[#000518] text-white">
        <div className="container mx-auto max-w-[1250px] px-6 h-[85px] flex items-center justify-between relative">
          
          {/* Izquierda: Hamburguesa, Lupa y Secciones */}
          <div className="flex items-center gap-5 z-10">
            <button onClick={() => setIsMenuOpen(true)} className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
              <Menu size={22} strokeWidth={2.5} />
              <Search size={20} strokeWidth={2.5} className="ml-1" />
              <span className="hidden md:block font-bold text-[15px] ml-1">Secciones</span>
            </button>
            <div className="hidden lg:flex items-center gap-5 font-bold text-[14px] ml-2 tracking-wide">
              <Link href="/" className="hover:text-gray-300">Últimas noticias</Link>
              <Link href="/categoria/deportes" className="hover:text-gray-300">Deportivo</Link>
              <Link href="/categoria/espectaculos" className="hover:text-gray-300">Show</Link>
            </div>
          </div>

          {/* Centro: Logo absoluto (gigante) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 mt-1">
            <Link href="/" className="text-5xl md:text-[60px] font-black tracking-tighter text-blue-500 italic flex items-center drop-shadow-lg hover:scale-[1.02] transition-transform duration-300">
              <span className="text-white">MISIONES</span><span className="text-[#E5232A]">YA</span>
            </Link>
          </div>

          {/* Derecha: Notificaciones, Tema e Ingreso */}
          <div className="flex items-center gap-4 z-10">
            <button className="hover:text-gray-300 transition-colors hidden md:block">
              <Bell size={20} />
            </button>
            <ThemeToggle />
            {!userId ? (
              <Link href="/admin" className="hidden md:flex items-center gap-2 text-sm font-bold hover:text-gray-300 transition-colors">
                <User size={18} />
                Ingresar
              </Link>
            ) : (
              <UserButton afterSignOutUrl="/" />
            )}
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
              <span className="font-black text-2xl italic tracking-tighter drop-shadow-md">MISIONESYA</span>
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
