import Link from 'next/link';
import { MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0b1120] text-gray-300 mt-16 border-t-[5px] border-[var(--primary)] font-sans relative overflow-hidden">
      
      {/* Elemento decorativo de fondo */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* 1. Institucional y Marca (Ocupa 4 columnas) */}
          <div className="lg:col-span-4 flex flex-col pr-0 lg:pr-8">
            <Link href="/" className="inline-block mb-6">
              <span className="text-3xl font-black italic tracking-tighter">
                <span className="text-white">MISIONES</span>
                <span className="text-[var(--primary)] drop-shadow-md">YA</span>
              </span>
            </Link>
            <p className="text-gray-400 text-[15px] leading-relaxed mb-8">
              Diario digital independiente con foco absoluto en Misiones y la región litoral. 
              Periodismo de verdad, información verificada y las últimas noticias al instante.
            </p>
            
            {/* Redes Sociales (Native SVGs) */}
            <div className="flex gap-4 mt-auto">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all duration-300 shadow-sm" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C] transition-all duration-300 shadow-sm" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            </div>
          </div>

          {/* 2. Secciones Rápidas (Ocupa 4 columnas) */}
          <div className="lg:col-span-4 lg:pl-8">
            <h4 className="text-white text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
              Secciones
            </h4>
            <ul className="grid grid-cols-2 gap-y-4 gap-x-2">
              {[
                { name: 'Último Momento', path: '/' },
                { name: 'Política', path: '/categoria/política' },
                { name: 'Economía', path: '/categoria/economía' },
                { name: 'Sociedad', path: '/categoria/sociedad' },
                { name: 'Policiales', path: '/categoria/policiales' },
                { name: 'Deportes', path: '/categoria/deportes' },
                { name: 'Internacionales', path: '/categoria/internacionales' },
                { name: 'Espectáculos', path: '/categoria/espectáculos' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.path} 
                    className="text-gray-400 text-[15px] font-medium hover:text-[var(--primary)] hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Contacto Físico y Digital (Ocupa 4 columnas) */}
          <div className="lg:col-span-4 lg:pl-4">
            <h4 className="text-white text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
              Contacto
            </h4>
            <ul className="flex flex-col gap-6">
              
              <li className="flex items-start gap-4 group">
                <div className="mt-1 text-gray-400 group-hover:text-white transition-colors">
                  <MapPin size={22} strokeWidth={2} />
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Ubicación</span>
                  <span className="text-gray-300 font-medium text-[15px]">Posadas, Misiones, Argentina</span>
                </div>
              </li>

              <li className="flex items-start gap-4 group">
                <div className="mt-1 text-gray-400 group-hover:text-white transition-colors">
                  <Mail size={22} strokeWidth={2} />
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Email</span>
                  <a href="mailto:contacto@misionesya.com" className="text-gray-300 font-medium text-[15px] hover:text-[var(--primary)] transition-colors">
                    contacto@misionesya.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-4 group">
                <div className="mt-1 text-[var(--primary)] group-hover:text-red-400 transition-colors">
                  <Phone size={22} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[var(--primary)] text-xs font-bold uppercase tracking-wider mb-1">WhatsApp / Llamadas</span>
                  <a href="tel:+5437615555555" className="text-white font-bold text-[16px] tracking-wide hover:text-[var(--primary)] transition-colors">
                    +54 376 15-555555
                  </a>
                </div>
              </li>

            </ul>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm font-medium">
            &copy; {currentYear} <span className="text-gray-400 font-bold">Misiones Ya</span>. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm font-medium text-gray-500">
            <Link href="/terminos" className="hover:text-gray-300 transition-colors">Términos y Condiciones</Link>
            <Link href="/privacidad" className="hover:text-gray-300 transition-colors">Política de Privacidad</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
