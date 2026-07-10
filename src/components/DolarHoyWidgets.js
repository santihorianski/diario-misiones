'use client';
import { useState, useEffect } from 'react';

export default function DolarHoyWidgets() {
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

  if (loading || !quotes['oficial']) {
    return <div className="bg-[#000518] text-gray-400 text-[13px] py-2 text-center border-t border-gray-700/80">Cargando cotizaciones...</div>;
  }

  // Simulación de variaciones con diseño más limpio y sobrio
  const renderItem = (label, data, variation = "= 0,0%", varColor = "text-gray-400") => {
    const price = Number.isInteger(data.venta) ? `${data.venta}.0` : data.venta;
    return (
      <span className="flex items-center whitespace-nowrap text-[13px]">
        <span className="text-gray-300 font-normal mr-1">{label}</span>
        <span className="text-white font-bold">${price}</span>
        <span className={`${varColor} font-normal ml-1.5 tracking-tight`}>{variation}</span>
      </span>
    );
  };

  return (
    <div className="bg-[#000518] pt-10">
      <div className="font-sans overflow-x-auto no-scrollbar border-t border-gray-600/30">
        <div className="container mx-auto max-w-[1250px] px-6">
          <div className="py-2 flex items-center justify-center gap-3 min-w-max">
            <span className="text-white font-bold tracking-wide mr-1">Dólar:</span>
            {quotes['oficial'] && renderItem('Oficial', quotes['oficial'], "= 0,0%", "text-gray-400")}
            <span className="text-gray-500 font-bold">&middot;</span>
            {quotes['blue'] && renderItem('Blue', quotes['blue'], "- 0,3%", "text-[#2dd4bf]")}
            <span className="text-gray-500 font-bold">&middot;</span>
            {quotes['mep'] && renderItem('Mep', quotes['mep'], "- 0,6%", "text-[#2dd4bf]")}
            <span className="text-gray-500 font-bold hidden md:inline">&middot;</span>
            {quotes['tarjeta'] && <span className="hidden md:flex">{renderItem('Tarjeta', quotes['tarjeta'], "= 0,0%", "text-gray-400")}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
