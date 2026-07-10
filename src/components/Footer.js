import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer" style={{
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      padding: '4rem 0 2rem',
      marginTop: '4rem',
      borderTop: '4px solid var(--primary)'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '3rem',
        marginBottom: '3rem'
      }}>
        
        {/* Institucional */}
        <div className="footer-section">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>MisionesYa</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Tu portal de noticias con la mejor información de Misiones y la región. Mantente informado al instante con las últimas novedades, cotizaciones y más.
          </p>
        </div>

        {/* Secciones Rápidas */}
        <div className="footer-section">
          <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '1px' }}>Secciones</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Inicio</Link></li>
            <li><Link href="/categoria/política" style={{ textDecoration: 'none', color: 'inherit' }}>Política</Link></li>
            <li><Link href="/categoria/economía" style={{ textDecoration: 'none', color: 'inherit' }}>Economía</Link></li>
            <li><Link href="/categoria/sociedad" style={{ textDecoration: 'none', color: 'inherit' }}>Sociedad</Link></li>
            <li><Link href="/categoria/deportes" style={{ textDecoration: 'none', color: 'inherit' }}>Deportes</Link></li>
          </ul>
        </div>

        {/* Contacto */}
        <div className="footer-section">
          <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '1px' }}>Contacto</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem' }}>
            <li>📍 Posadas, Misiones, Argentina</li>
            <li>📧 contacto@espectadormisiones.com</li>
            <li>📞 +54 376 15-555555</li>
            <li style={{ marginTop: '1rem' }}>
              <strong>Redes Sociales:</strong>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <a href="#" style={{ color: '#94a3b8' }}>Facebook</a>
                <a href="#" style={{ color: '#94a3b8' }}>Twitter</a>
                <a href="#" style={{ color: '#94a3b8' }}>Instagram</a>
              </div>
            </li>
          </ul>
        </div>

      </div>

      <div style={{
        borderTop: '1px solid #1e293b',
        paddingTop: '2rem',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.85rem'
      }}>
        <p>&copy; {new Date().getFullYear()} MisionesYa. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
