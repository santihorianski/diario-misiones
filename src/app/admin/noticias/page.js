import { getAdminNews } from '@/lib/cms';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import NewsTable from './NewsTable';

export default async function AdminNoticiasPage() {
  const news = await getAdminNews();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Gestión de Noticias</h1>
          <p className="text-slate-400 mt-1">Controla lo que ven tus lectores. Oculta, edita o crea.</p>
        </div>
        <Link 
          href="/admin/noticias/crear" 
          className="group flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30"
        >
          <Plus className="w-5 h-5" />
          <span>Redactar Noticia</span>
        </Link>
      </div>

      <NewsTable news={news} />
    </div>
  );
}
