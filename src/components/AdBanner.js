export default function AdBanner({ type = 'horizontal' }) {
  const styles = {
    horizontal: { width: '100%', height: '90px', maxWidth: '728px' },
    sidebar: { width: '100%', height: '250px' }
  };

  return (
    <div style={{
      ...styles[type],
      backgroundColor: '#e2e8f0',
      color: '#94a3b8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '2rem auto',
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
