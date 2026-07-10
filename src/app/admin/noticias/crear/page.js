'use client';

import { createNewsAction } from '../../actions';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, EyeOff, Search, Settings2, Image as ImageIcon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import TiptapEditor from '../../../../components/TiptapEditor';
import { UploadButton } from '../../../../utils/uploadthing';
import '@uploadthing/react/styles.css';

export default function RedactarNoticiaPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('published');
  
  // Categorías
  const [selectedCats, setSelectedCats] = useState(['Destacado']);
  const availableCats = ['Destacado', 'Política', 'Deportes', 'Policiales', 'Economía', 'Sociedad', 'Internacionales'];

  const toggleCategory = (cat) => {
    if (selectedCats.includes(cat)) {
      setSelectedCats(selectedCats.filter(c => c !== cat));
    } else {
      setSelectedCats([...selectedCats, cat]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    formData.set('content', content);
    formData.set('categories', selectedCats.join(', '));
    formData.set('status', status);
    
    if (!content || content === '<p></p>') {
      toast.error('El contenido está vacío.');
      return;
    }

    startTransition(async () => {
      try {
        await createNewsAction(formData);
        toast.success(status === 'published' ? 'Publicado' : 'Borrador guardado');
        router.push('/admin/noticias');
      } catch (err) {
        toast.error('Ocurrió un error');
      }
    });
  };

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500 pb-20 pt-8">
      
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-12">
        
        {/* Lado Principal: Creador (Lienzo en Blanco) */}
        <div className="flex-1 space-y-8">
          
          <div className="flex items-center gap-4 text-neutral-400 mb-8">
            <Link href="/admin/noticias" className="hover:text-neutral-200 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="text-sm">Regresar a las publicaciones</span>
          </div>

          <div className="space-y-6">
            <input 
              type="text" 
              name="title" 
              required
              placeholder="Título del artículo" 
              className="w-full bg-transparent text-neutral-100 placeholder:text-neutral-700 text-4xl md:text-5xl font-bold focus:outline-none tracking-tight border-none p-0 resize-none"
            />
            
            <TiptapEditor 
              content={content} 
              onChange={setContent} 
            />
          </div>
        </div>

        {/* Lado Secundario: Panel de Configuración Estilo Settings */}
        <div className="lg:w-[320px] shrink-0 border-l border-neutral-800 pl-0 lg:pl-10 space-y-8">
          
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2 uppercase tracking-widest">
              <Settings2 className="w-4 h-4" /> Ajustes
            </h3>
          </div>

          {/* Estado */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide">Estado de Publicación</label>
            <div className="flex rounded-md overflow-hidden border border-neutral-800 p-0.5 bg-neutral-900/50">
              <button 
                type="button" 
                onClick={() => setStatus('draft')}
                className={`flex-1 py-1.5 text-xs font-medium transition-colors rounded ${status === 'draft' ? 'bg-neutral-800 text-neutral-200' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                Borrador
              </button>
              <button 
                type="button" 
                onClick={() => setStatus('published')}
                className={`flex-1 py-1.5 text-xs font-medium transition-colors rounded ${status === 'published' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                Publicar
              </button>
            </div>
          </div>

          {/* Portada */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide">Imagen Destacada</label>
            {imageUrl ? (
              <div className="w-full aspect-video rounded border border-neutral-800 overflow-hidden relative group">
                <img src={imageUrl} alt="Portada" className="object-cover w-full h-full" onError={(e) => { e.target.src=''; setImageUrl(''); }} />
                <button type="button" onClick={() => setImageUrl('')} className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">Quitar Imagen</button>
              </div>
            ) : (
              <div className="w-full aspect-video rounded border border-neutral-800 border-dashed bg-neutral-900/30 flex flex-col items-center justify-center text-neutral-600">
                <ImageIcon className="w-6 h-6 mb-2 opacity-50" />
                <span className="text-[10px] uppercase tracking-wide">Sin portada</span>
              </div>
            )}
            <input type="hidden" name="image" value={imageUrl} />
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res && res[0]) {
                  setImageUrl(res[0].url);
                  toast.success('Imagen subida correctamente');
                }
              }}
              onUploadError={(error) => {
                toast.error(`Error al subir: ${error.message}`);
              }}
              appearance={{
                button: "bg-neutral-800 hover:bg-neutral-700 text-xs w-full text-white py-2 rounded border border-neutral-700"
              }}
            />
          </div>

          {/* Categorías */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide">Etiquetas</label>
            <div className="flex flex-wrap gap-1.5">
              {availableCats.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-2 py-1 rounded text-[10px] font-medium transition-colors border ${selectedCats.includes(cat) ? 'bg-neutral-800 text-neutral-200 border-neutral-700' : 'bg-transparent text-neutral-500 border-neutral-800 hover:border-neutral-700'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* SEO */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-medium text-neutral-500 uppercase tracking-wide">
              <Search className="w-3.5 h-3.5" /> Meta Descripción
            </label>
            <textarea 
              name="seoDescription" 
              rows="4" 
              placeholder="Resumen corto para Google..." 
              className="w-full bg-neutral-950 text-neutral-300 px-3 py-2 text-xs border border-neutral-800 rounded focus:border-neutral-600 focus:outline-none transition-colors resize-none"
            ></textarea>
          </div>
          
          <div className="pt-6">
            <button 
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 bg-neutral-100 text-neutral-900 hover:bg-white px-4 py-3 rounded font-medium transition-colors disabled:opacity-50 text-sm"
            >
              {isPending ? 'Guardando...' : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{status === 'published' ? 'Publicar Artículo' : 'Guardar Borrador'}</span>
                </>
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
