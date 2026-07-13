'use client';
import { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';

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
    return <div className="text-[var(--text-muted)] text-[11px] py-1 text-center font-bold uppercase tracking-wider flex items-center justify-center gap-1"><DollarSign size={14} />Cargando cotizaciones...</div>;
  }

  const renderItem = (label, data, variation = "= 0,0%", varColor = "text-gray-400") => {
    const price = Number.isInteger(data.venta) ? `${data.venta}.0` : data.venta;
    return (
      <span className="flex items-center whitespace-nowrap text-[13px]">
        <span className="text-[var(--text-muted)] font-normal mr-1">{label}</span>
        <span className="text-[var(--foreground)] font-bold">${price}</span>
        <span className={`${varColor} font-normal ml-1.5 tracking-tight`}>{variation}</span>
      </span>
    );
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 md:py-0 md:justify-end">
      <div className="flex items-center gap-1 text-[var(--text-muted)] font-bold text-[11px] uppercase tracking-wider mr-1 h-full">
        <DollarSign size={14} className="text-[#2dd4bf]" />
        <span>Dólar:</span>
      </div>
      {quotes['oficial'] && renderItem('Oficial', quotes['oficial'], "= 0,0%", "text-[var(--text-muted)]")}
      <span className="mx-1.5 text-gray-300 dark:text-gray-700 leading-none flex items-center h-full">&middot;</span>
      {quotes['blue'] && renderItem('Blue', quotes['blue'], "- 0,3%", "text-green-600 dark:text-green-400")}
      <span className="mx-1.5 text-gray-300 dark:text-gray-700 leading-none flex items-center h-full">&middot;</span>
      {quotes['mep'] && renderItem('Mep', quotes['mep'], "- 0,6%", "text-green-600 dark:text-green-400")}
    </div>
  );
}
