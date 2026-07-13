'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Newspaper, Megaphone, Settings, ArrowLeft, BarChart3, PlusSquare } from 'lucide-react';
import { Toaster } from 'sonner';
import { UserButton, Show } from '@clerk/nextjs';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const links = [
    { href: '/admin', icon: BarChart3, label: 'Dashboard' },
    { href: '/admin/noticias', icon: Newspaper, label: 'Noticias' },
    { href: '/admin/noticias/crear', icon: PlusSquare, label: 'Nuevo Artículo' },
    { href: '/admin/anuncios', icon: Megaphone, label: 'Publicidad' },
  ];

  return (
    <div className="min-h-screen bg-black text-neutral-200 font-sans selection:bg-neutral-800 selection:text-white">
      {/* Notificaciones Toaster en estilo oscuro/minimal */}
      <Toaster theme="dark" toastOptions={{ style: { background: '#0a0a0a', border: '1px solid #262626', color: '#e5e5e5' } }} />
      
      <div className="flex h-screen overflow-hidden">
        {/* Barra Lateral Minimalista */}
        <aside className="w-64 border-r border-neutral-800 bg-[#0a0a0a] flex flex-col hidden md:flex shrink-0 z-10">
          <div className="h-16 flex items-center px-6 border-b border-neutral-800">
            <span className="text-sm font-semibold tracking-widest uppercase text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-neutral-200 rounded-full"></div>
              Misiones Ya
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            <div className="text-[10px] font-semibold text-neutral-600 uppercase tracking-widest mb-4 px-2">Gestión</div>
            {links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium ${
                    isActive 
                      ? 'bg-neutral-900 text-neutral-100' 
                      : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-100' : 'text-neutral-500'}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t border-neutral-800 space-y-2">
            <div className="flex items-center gap-3 px-3 py-2 bg-neutral-900 rounded-md">
              <Show when="signed-in">
                <UserButton appearance={{ elements: { userButtonAvatarBox: "w-6 h-6" } }} />
              </Show>
              <div className="text-xs font-medium text-neutral-400">Admin</div>
            </div>
            <Link 
              href="/"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-neutral-500 hover:text-neutral-300 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Salir al diario
            </Link>
          </div>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 overflow-y-auto bg-black relative">
          {/* Header móvil */}
          <header className="md:hidden h-14 border-b border-neutral-800 bg-[#0a0a0a] flex items-center justify-between px-4 sticky top-0 z-20">
            <span className="text-xs font-bold tracking-widest uppercase text-white">Misiones Ya Admin</span>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </header>

          <div className="p-4 md:p-8 lg:p-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
