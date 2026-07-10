'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Newspaper, Users, Eye, TrendingUp, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { publishArticle } from '../actions/articles';

export default function AdminDashboard({ newsCount, chartData, pendingNews = [] }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async (id) => {
    setIsPublishing(true);
    try {
      const res = await publishArticle(id);
      if (res.success) {
        toast.success('Noticia aprobada y publicada exitosamente.');
      } else {
        toast.error('Error al aprobar la noticia.');
      }
    } catch (e) {
      toast.error('Ocurrió un error inesperado.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error('Error al sincronizar');
      }
    } catch (e) {
      toast.error('Error de conexión');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500 pt-8 pb-20 space-y-12">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-100 tracking-tight">Overview</h1>
          <p className="text-neutral-500 mt-1 text-sm">Resumen de rendimiento y métricas principales de tu medio.</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="bg-blue-600 hover:bg-blue-500 transition-colors text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Sincronizando...' : 'Forzar Actualización RSS'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4 text-neutral-500">
            <h3 className="text-xs font-semibold uppercase tracking-wider">Total Noticias</h3>
            <Newspaper className="w-4 h-4" />
          </div>
          <div>
            <span className="text-3xl font-bold text-neutral-100">{newsCount}</span>
            <div className="text-xs text-emerald-500 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +12% esta semana
            </div>
          </div>
        </div>

        <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4 text-neutral-500">
            <h3 className="text-xs font-semibold uppercase tracking-wider">Visitas (Semana)</h3>
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <span className="text-3xl font-bold text-neutral-100">27.5K</span>
            <div className="text-xs text-emerald-500 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +5.2% esta semana
            </div>
          </div>
        </div>

        <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4 text-neutral-500">
            <h3 className="text-xs font-semibold uppercase tracking-wider">Lectores Únicos</h3>
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-3xl font-bold text-neutral-100">12.1K</span>
            <div className="text-xs text-neutral-600 mt-1">Usuarios recurrentes: 45%</div>
          </div>
        </div>

        <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-lg flex flex-col justify-center items-center text-center">
          <Link href="/admin/noticias/crear" className="bg-neutral-100 text-neutral-900 hover:bg-white px-6 py-3 rounded-md font-medium transition-colors text-sm w-full">
            Redactar Artículo
          </Link>
          <Link href="/admin/anuncios" className="text-neutral-500 hover:text-neutral-300 mt-4 text-xs font-medium transition-colors">
            Configurar Anuncios
          </Link>
        </div>
      </div>

      {/* Sección Noticias Pendientes */}
      {pendingNews && pendingNews.length > 0 && (
        <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <h3 className="text-sm font-semibold text-amber-500 mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4" /> Noticias Pendientes de Aprobación ({pendingNews.length})
          </h3>
          <div className="space-y-3">
            {pendingNews.map(news => (
              <div key={news.id} className="flex justify-between items-center bg-neutral-900/50 p-3 rounded border border-neutral-800">
                <div className="truncate pr-4">
                  <div className="text-sm font-medium text-neutral-200 truncate">{news.title}</div>
                  <div className="text-xs text-neutral-500">{news.source} • {new Date(news.pubDate).toLocaleDateString()}</div>
                </div>
                <button 
                  onClick={() => handlePublish(news.id)}
                  disabled={isPublishing}
                  className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50"
                >
                  Aprobar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gráfico */}
      <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-lg h-[400px] flex flex-col">
        <h3 className="text-sm font-semibold text-neutral-100 mb-6">Productividad (Noticias Publicadas)</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis dataKey="name" stroke="#525252" tick={{ fill: '#737373', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#525252" tick={{ fill: '#737373', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px' }}
                itemStyle={{ color: '#e5e5e5' }}
              />
              <Line type="monotone" dataKey="publicaciones" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
