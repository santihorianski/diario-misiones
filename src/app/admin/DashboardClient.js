'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Newspaper, Clock, Zap, TrendingUp, RefreshCw, Edit3 } from 'lucide-react';
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
      
      {/* Cabecera Premium */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[var(--primary)] shadow-[0_0_15px_var(--primary)] animate-pulse"></span>
            Panel de Control
          </h1>
          <p className="text-gray-400 mt-2 text-sm font-medium">Gestión inteligente de publicaciones y métricas de Misiones Ya.</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="bg-[var(--primary)] hover:bg-red-700 transition-colors text-white px-5 py-2.5 rounded-md text-sm font-bold tracking-wide flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-[var(--primary)]/20"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} strokeWidth={2.5} />
          {isSyncing ? 'Buscando...' : 'Escanear Nuevas Noticias'}
        </button>
      </div>

      {/* Tarjetas de Métricas Corporativas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-[#0b1120] border border-[var(--primary)]/20 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-[var(--primary)]/10"></div>
          <div className="flex justify-between items-start mb-4 text-gray-400 relative z-10">
            <h3 className="text-xs font-bold uppercase tracking-wider">Total Noticias</h3>
            <Newspaper className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div className="relative z-10">
            <span className="text-4xl font-black text-white">{newsCount}</span>
            <div className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3" /> Base de datos activa
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#0b1120] border border-white/5 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-amber-500/10"></div>
          <div className="flex justify-between items-start mb-4 text-gray-400 relative z-10">
            <h3 className="text-xs font-bold uppercase tracking-wider">Pendientes de Revisión</h3>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="relative z-10">
            <span className="text-4xl font-black text-white">{pendingNews.length}</span>
            <div className="text-xs text-amber-400 font-medium flex items-center gap-1 mt-2">
              Requieren tu aprobación
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#0b1120] border border-white/5 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-blue-500/10"></div>
          <div className="flex justify-between items-start mb-4 text-gray-400 relative z-10">
            <h3 className="text-xs font-bold uppercase tracking-wider">Inteligencia Artificial</h3>
            <Zap className="w-5 h-5 text-blue-500" />
          </div>
          <div className="relative z-10">
            <span className="text-4xl font-black text-white">Activa</span>
            <div className="text-xs text-blue-400 font-medium mt-2">Reescribiendo y resumiendo</div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-[var(--primary)]/10 to-[#0b1120] border border-[var(--primary)]/30 rounded-xl flex flex-col justify-center items-center text-center shadow-lg shadow-[var(--primary)]/5">
          <Link href="/admin/noticias/crear" className="bg-white text-black hover:bg-gray-100 px-6 py-3 rounded-lg font-bold transition-all text-sm w-full shadow-md">
            + Redactar Manual
          </Link>
          <Link href="/admin/anuncios" className="text-gray-400 hover:text-white mt-4 text-xs font-bold uppercase tracking-wider transition-colors">
            Gestor de Publicidad
          </Link>
        </div>
      </div>

      {/* Sección Noticias Pendientes Premium con Edición Rápida */}
      {pendingNews && pendingNews.length > 0 && (
        <div className="p-6 bg-[#0b1120] border border-amber-500/30 rounded-xl shadow-lg">
          <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            Bandeja de Entrada: {pendingNews.length} Pendientes
          </h3>
          <div className="space-y-3">
            {pendingNews.map(news => (
              <div key={news.id} className="flex flex-col md:flex-row md:justify-between md:items-center bg-black/40 p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors gap-4">
                <div className="truncate pr-4 flex-1">
                  <div className="text-base font-bold text-white truncate">{news.title}</div>
                  <div className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wide">
                    Origen: <span className="text-gray-300">{news.source}</span> &nbsp;|&nbsp; 
                    Fecha: <span className="text-gray-300">{new Date(news.pubDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link 
                    href={`/admin/noticias/editar/${news.id}`}
                    className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md text-xs font-bold uppercase transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Revisar
                  </Link>
                  <button 
                    onClick={() => handlePublish(news.id)}
                    disabled={isPublishing}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wide transition-colors disabled:opacity-50 shadow-lg shadow-emerald-900/20"
                  >
                    Publicar Ya
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gráfico Productividad Premium */}
      <div className="p-6 bg-[#0b1120] border border-white/5 rounded-xl h-[450px] flex flex-col shadow-lg">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Volumen de Publicaciones de la IA</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
              <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px', fontWeight: 'bold' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="publicaciones" stroke="var(--primary)" strokeWidth={4} dot={{ r: 5, fill: '#000', stroke: 'var(--primary)', strokeWidth: 2 }} activeDot={{ r: 8, fill: 'var(--primary)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
