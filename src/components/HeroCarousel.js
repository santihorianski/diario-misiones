'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import Link from 'next/link';

// Estilos base de Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function HeroCarousel({ articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="hero-carousel-container relative overflow-hidden rounded-xl h-[400px] md:h-[500px] lg:h-[600px] shadow-2xl">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        speed={800}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-white',
          bulletClass: 'swiper-pagination-bullet !bg-white/50 !w-3 !h-3 !mx-1 transition-all'
        }}
        loop={true}
        className="w-full h-full"
      >
        {articles.map((article) => (
          <SwiperSlide key={article.id}>
            <div className="relative w-full h-full">
              {article.image ? (
                <img src={article.image} alt={article.title} className="w-full h-full object-cover select-none" />
              ) : (
                <div className="w-full h-full bg-slate-900"></div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-12 text-white flex flex-col justify-end h-full pointer-events-none">
                <div className="pointer-events-auto w-fit max-w-4xl">
                  <Link href={`/article/${article.id}`} className="block group">
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight mb-2 md:mb-4 group-hover:text-gray-200 transition-colors drop-shadow-lg">
                      {article.title}
                    </h2>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Añadir estos estilos globales para tapar los del CSS antiguo si es necesario */}
      <style jsx global>{`
        .hero-carousel-container .swiper-pagination {
          bottom: 20px !important;
          text-align: right !important;
          padding-right: 30px !important;
        }
      `}</style>
    </div>
  );
}
