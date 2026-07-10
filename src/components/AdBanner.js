import { getAdsConfig } from '@/lib/cms';

export default async function AdBanner({ type = 'horizontal' }) {
  const ads = await getAdsConfig();
  
  // Map type string to config key
  const configKey = type === 'horizontal' ? 'header' : type;
  const adConfig = ads[configKey];

  if (!adConfig || !adConfig.active) {
    return null; // No mostrar nada si está inactivo
  }

  const styles = {
    horizontal: { width: '100%', minHeight: '90px', maxWidth: '728px', margin: '2rem auto' },
    sidebar: { width: '100%', minHeight: '250px', margin: '0 auto 2rem auto' }
  };

  // Si es script de AdSense
  if (adConfig.type === 'script' && adConfig.script) {
    return (
      <div style={styles[type]} className="ad-container overflow-hidden flex items-center justify-center">
        {/* Usamos dangerouslySetInnerHTML para renderizar el script de Google */}
        <div dangerouslySetInnerHTML={{ __html: adConfig.script }} />
      </div>
    );
  }

  // Si es imagen propia (banner local)
  if (adConfig.type === 'image' && adConfig.imageUrl) {
    return (
      <div style={styles[type]} className="overflow-hidden flex items-center justify-center">
        <a href={adConfig.link || '#'} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
          <img 
            src={adConfig.imageUrl} 
            alt="Publicidad" 
            className="w-full h-full object-cover"
          />
        </a>
      </div>
    );
  }

  // Fallback si está activo pero vacío
  return (
    <div style={{
      ...styles[type],
      backgroundColor: '#e2e8f0',
      color: '#94a3b8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #cbd5e1',
      fontSize: '0.85rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    }}>
      Espacio Publicitario
    </div>
  );
}
