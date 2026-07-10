import { getAdsConfig } from '@/lib/cms';
import AdsClientForm from './AdsClientForm';

export default async function AdminAnunciosPage() {
  const adsConfig = await getAdsConfig();

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 mx-auto">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Gestión de Publicidad</h1>
        <p className="text-slate-400 mt-2 text-lg">Configura los banners de tu sitio web, ya sean imágenes directas o códigos de Google AdSense.</p>
      </div>

      <AdsClientForm initialAds={adsConfig} />
    </div>
  );
}
