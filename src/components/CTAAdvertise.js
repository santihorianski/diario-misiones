import Image from 'next/image';
import { MessageCircle, Megaphone } from 'lucide-react';

export default function CTAAdvertise() {
  return (
    <div className="w-full my-12 relative overflow-hidden rounded-xl shadow-2xl group border-2 border-white/10">
      
      {/* Imagen Premium de Fondo (V2) */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/premium_cta_bg_v2.png" 
          alt="Fondo Premium Publicidad" 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-1000 object-left"
        />
        {/* Capa oscura para asegurar contraste de texto */}
        <div className="absolute inset-0 bg-black/60 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
      </div>
      
      <div className="container mx-auto max-w-[1250px] px-8 py-20 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
        
        {/* Textos */}
        <div className="flex-1 max-w-3xl">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <Megaphone size={32} className="text-[#E5232A] drop-shadow-[0_0_15px_rgba(229,35,42,0.8)]" />
            <h2 className="text-3xl md:text-[42px] font-black tracking-tighter text-white drop-shadow-lg leading-tight">
              Publica con <span className="text-[#E5232A]">Misiones Ya</span>
            </h2>
          </div>
          <p className="text-lg md:text-[22px] text-gray-200 font-semibold max-w-2xl drop-shadow-md leading-relaxed">
            Llega a miles de lectores diariamente. Destaca tu marca con la plataforma de noticias de mayor crecimiento en la región.
          </p>
        </div>

        {/* Número Gigante y Botón */}
        <div className="shrink-0 flex flex-col items-center md:items-end z-20">
          <div className="text-[55px] md:text-[65px] font-black text-white tracking-tighter mb-5 drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)] leading-none">
            376 15-555555
          </div>
          
          <a 
            href="https://wa.me/54937615555555" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#E5232A] text-white hover:bg-white hover:text-[#E5232A] font-black text-xl px-8 py-4 rounded-full shadow-[0_10px_30px_rgba(229,35,42,0.5)] hover:shadow-[0_10px_40px_rgba(255,255,255,0.4)] hover:-translate-y-1.5 transition-all duration-300 border-2 border-transparent hover:border-[#E5232A]"
          >
            <MessageCircle size={26} fill="currentColor" />
            <span>Contactar por WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
}
