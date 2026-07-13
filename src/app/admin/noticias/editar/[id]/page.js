export const runtime = 'nodejs';
import { getAdminNews } from '@/lib/cms';
import EditarClient from './EditarClient';

export default async function EditarNoticiaPage({ params }) {
  // En Next.js 15, params es una Promise que se resuelve (en este caso el componente cliente usará React.use)
  // Pero aquí en el servidor podemos obtenerlo así:
  const unwrappedParams = await params;
  const { id } = unwrappedParams;
  
  const news = await getAdminNews();
  const article = news.find(n => n.id === id);

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
        <h2 className="text-2xl font-bold text-white mb-2">Noticia no encontrada</h2>
        <p>El artículo que intentas editar no existe o fue eliminado.</p>
      </div>
    );
  }

  return <EditarClient params={params} initialNews={article} />;
}

