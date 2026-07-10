'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Save, Image as ImageIcon, Code2, LayoutPanelTop, MonitorPlay } from 'lucide-react';
import { saveAdsAction } from '../actions';
import { useRouter } from 'next/navigation';

export default function AdsClientForm({ initialAds }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      try {
        await saveAdsAction(formData);
        toast.success('Configuración guardada correctamente');
        router.refresh();
      } catch (err) {
        toast.error('Error al guardar la configuración');
      }
    });
  };

  const Switch = ({ name, defaultChecked }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="sr-only peer" />
      <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 peer-checked:after:bg-white after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neutral-100"></div>
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      
      {/* Cabecera */}
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-6 md:p-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-800">
          <div>
            <h2 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
              <LayoutPanelTop className="w-5 h-5 text-neutral-400" /> Banner Cabecera
            </h2>
            <p className="text-xs text-neutral-500 mt-1">Anuncio superior (728x90px).</p>
          </div>
          <Switch name="headerActive" defaultChecked={initialAds.header?.active} />
        </div>
        
        <div className="space-y-6 max-w-2xl">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide">Formato</label>
            <select name="headerType" defaultValue={initialAds.header?.type || 'image'} className="w-full bg-neutral-950 text-neutral-300 px-4 py-2 border border-neutral-800 rounded focus:border-neutral-500 focus:outline-none text-sm appearance-none">
              <option value="image">Imagen + Enlace</option>
              <option value="script">Código AdSense</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide">URL Imagen</label>
              <input type="text" name="headerImage" defaultValue={initialAds.header?.imageUrl} placeholder="https://..." className="w-full bg-neutral-950 text-neutral-300 px-4 py-2 border border-neutral-800 rounded focus:border-neutral-500 focus:outline-none text-sm" />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide">Destino</label>
              <input type="text" name="headerLink" defaultValue={initialAds.header?.link} placeholder="https://..." className="w-full bg-neutral-950 text-neutral-300 px-4 py-2 border border-neutral-800 rounded focus:border-neutral-500 focus:outline-none text-sm" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide">Script (HTML)</label>
              <textarea name="headerScript" defaultValue={initialAds.header?.script} rows="2" placeholder="<script>...</script>" className="w-full bg-neutral-950 text-neutral-300 px-4 py-3 border border-neutral-800 rounded focus:border-neutral-500 focus:outline-none text-xs font-mono resize-none"></textarea>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-6 md:p-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-800">
          <div>
            <h2 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
              <LayoutPanelTop className="w-5 h-5 text-neutral-400 rotate-90" /> Banner Lateral
            </h2>
            <p className="text-xs text-neutral-500 mt-1">Columna derecha (300x250px).</p>
          </div>
          <Switch name="sidebarActive" defaultChecked={initialAds.sidebar?.active} />
        </div>
        
        <div className="space-y-6 max-w-2xl">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide">Formato</label>
            <select name="sidebarType" defaultValue={initialAds.sidebar?.type || 'image'} className="w-full bg-neutral-950 text-neutral-300 px-4 py-2 border border-neutral-800 rounded focus:border-neutral-500 focus:outline-none text-sm appearance-none">
              <option value="image">Imagen + Enlace</option>
              <option value="script">Código AdSense</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide">URL Imagen</label>
              <input type="text" name="sidebarImage" defaultValue={initialAds.sidebar?.imageUrl} placeholder="https://..." className="w-full bg-neutral-950 text-neutral-300 px-4 py-2 border border-neutral-800 rounded focus:border-neutral-500 focus:outline-none text-sm" />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide">Destino</label>
              <input type="text" name="sidebarLink" defaultValue={initialAds.sidebar?.link} placeholder="https://..." className="w-full bg-neutral-950 text-neutral-300 px-4 py-2 border border-neutral-800 rounded focus:border-neutral-500 focus:outline-none text-sm" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide">Script (HTML)</label>
              <textarea name="sidebarScript" defaultValue={initialAds.sidebar?.script} rows="2" placeholder="<script>...</script>" className="w-full bg-neutral-950 text-neutral-300 px-4 py-3 border border-neutral-800 rounded focus:border-neutral-500 focus:outline-none text-xs font-mono resize-none"></textarea>
            </div>
          </div>
        </div>
      </div>

      {/* In-Article */}
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-6 md:p-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-800">
          <div>
            <h2 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
              <MonitorPlay className="w-5 h-5 text-neutral-400" /> Banner In-Article
            </h2>
            <p className="text-xs text-neutral-500 mt-1">Insertado en medio de la noticia.</p>
          </div>
          <Switch name="inArticleActive" defaultChecked={initialAds.inArticle?.active} />
        </div>
        
        <div className="space-y-6 max-w-2xl">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide">Formato</label>
            <select name="inArticleType" defaultValue={initialAds.inArticle?.type || 'image'} className="w-full bg-neutral-950 text-neutral-300 px-4 py-2 border border-neutral-800 rounded focus:border-neutral-500 focus:outline-none text-sm appearance-none">
              <option value="image">Imagen + Enlace</option>
              <option value="script">Código AdSense</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide">URL Imagen</label>
              <input type="text" name="inArticleImage" defaultValue={initialAds.inArticle?.imageUrl} placeholder="https://..." className="w-full bg-neutral-950 text-neutral-300 px-4 py-2 border border-neutral-800 rounded focus:border-neutral-500 focus:outline-none text-sm" />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide">Destino</label>
              <input type="text" name="inArticleLink" defaultValue={initialAds.inArticle?.link} placeholder="https://..." className="w-full bg-neutral-950 text-neutral-300 px-4 py-2 border border-neutral-800 rounded focus:border-neutral-500 focus:outline-none text-sm" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide">Script (HTML)</label>
              <textarea name="inArticleScript" defaultValue={initialAds.inArticle?.script} rows="2" placeholder="<script>...</script>" className="w-full bg-neutral-950 text-neutral-300 px-4 py-3 border border-neutral-800 rounded focus:border-neutral-500 focus:outline-none text-xs font-mono resize-none"></textarea>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t border-neutral-800 pt-6">
        <button 
          type="submit" 
          disabled={isPending}
          className="flex items-center gap-2 bg-neutral-100 text-neutral-900 hover:bg-white px-6 py-2.5 rounded font-medium transition-colors disabled:opacity-50 text-sm"
        >
          {isPending ? 'Guardando...' : (
            <>
              <Save className="w-4 h-4" />
              <span>Guardar</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
