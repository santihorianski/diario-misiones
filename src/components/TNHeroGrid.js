import Link from 'next/link';
import Image from 'next/image';

export default function TNHeroGrid({ articles }) {
  if (!articles || articles.length < 1) return null;

  // Tomamos hasta 4 artículos para este nuevo diseño
  const displayArticles = articles.slice(0, 4);

  const getCategoryColor = (category) => {
    if (!category) return 'bg-blue-600';
    const cat = category.toLowerCase();
    
    if (cat.includes('política') || cat.includes('politica')) return 'bg-blue-600';
    if (cat.includes('mundial')) return 'bg-blue-600'; // Azul para Mundial como en la captura
    if (cat.includes('deporte')) return 'bg-green-600';
    // El tono de Misiones en la imagen es un violeta claro tipo #8b5cf6 (violet-500)
    if (cat.includes('misiones') || cat.includes('provinciales')) return 'bg-[#8b5cf6]';
    if (cat.includes('nacional')) return 'bg-indigo-600';
    if (cat.includes('policial')) return 'bg-red-600';
    if (cat.includes('econom')) return 'bg-amber-600';
    if (cat.includes('salud')) return 'bg-pink-600';
    if (cat.includes('espect') || cat.includes('cultura')) return 'bg-fuchsia-600';
    if (cat.includes('internacional')) return 'bg-teal-600';
    
    // Color por defecto
    return 'bg-[#8b5cf6]';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 mb-8">
      {displayArticles.map((article, idx) => {
        // Extraemos la categoría o usamos una por defecto
        const rawCategory = article.categories && article.categories.length > 0 
          ? article.categories[0]
          : 'Último Momento';
          
        const categoryName = rawCategory.toUpperCase();
        const badgeColorClass = getCategoryColor(rawCategory);

        // Formatear fecha
        const dateObj = article.pubDate || article.published_at ? new Date(article.pubDate || article.published_at) : new Date();
        const dateStr = dateObj.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' }); // Ej: "9 de Julio"

        return (
          <Link key={article.id || idx} href={`/article/${article.id}`} className="group block relative w-full h-[450px] lg:h-[500px] overflow-hidden">
            {/* Imagen de Fondo Full */}
            <Image 
              src={article.image || article.imageUrl || 'https://placehold.co/400x600/000b29/FFF?text=Noticia'} 
              alt={article.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Gradiente oscuro inferior */}
            <div className="absolute inset-0 top-1/4 bg-gradient-to-t from-black via-black/80 to-transparent opacity-100 z-0"></div>

            {/* Contenido en la parte inferior (Subido con más padding bottom y más márgenes laterales) */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 md:px-10 md:pb-12 pt-20 flex flex-col justify-end z-10 font-sans">
              
              {/* Badge de Categoría Dinámico */}
              <div className="mb-4">
                <span className={`${badgeColorClass} text-white text-[10px] md:text-[12px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md shadow-sm`}>
                  {categoryName}
                </span>
              </div>

              {/* Título de la Noticia (Más protagonismo, fuente más grande) */}
              <h2 className="!text-white font-sans text-[22px] md:text-[26px] font-extrabold leading-[1.2] tracking-tight mb-6 group-hover:!text-gray-200 transition-colors line-clamp-4 drop-shadow-lg">
                {article.title}
              </h2>

              {/* Fecha / Pie (Más separada del título y más clara para máxima visibilidad) */}
              <p className="!text-gray-300 text-[12px] md:text-[14px] font-medium drop-shadow-md">
                {dateStr}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
