'use client';
import { useEffect, useState } from 'react';

const CITIES = [
  { name: 'Posadas', lat: -27.3671, lon: -55.8961 },
  { name: 'Garupá', lat: -27.4833, lon: -55.8333 },
  { name: 'Oberá', lat: -27.4871, lon: -55.1200 },
  { name: 'Eldorado', lat: -26.4076, lon: -54.6236 },
  { name: 'Puerto Iguazú', lat: -25.5991, lon: -54.5736 },
  { name: 'San Vicente', lat: -26.6167, lon: -54.1333 },
  { name: 'Apóstoles', lat: -27.9150, lon: -55.7533 },
  { name: 'Puerto Rico', lat: -26.7958, lon: -55.0240 },
  { name: 'Leandro N. Alem', lat: -27.6012, lon: -55.3228 },
  { name: 'Montecarlo', lat: -26.5658, lon: -54.7571 },
  { name: 'Aristóbulo del Valle', lat: -27.0954, lon: -54.8963 },
  { name: 'El Soberbio', lat: -27.2974, lon: -54.1970 },
  { name: 'Jardín América', lat: -27.0428, lon: -55.2269 },
  { name: 'San Pedro', lat: -26.6225, lon: -54.1081 },
  { name: 'Comandante Andresito', lat: -25.6667, lon: -54.0500 },
  { name: 'Wanda', lat: -25.9702, lon: -54.5684 },
  { name: 'Puerto Esperanza', lat: -25.9753, lon: -54.6433 },
  { name: 'San Ignacio', lat: -27.2608, lon: -55.5342 },
  { name: 'Candelaria', lat: -27.4601, lon: -55.7460 },
  { name: 'Concepción de la Sierra', lat: -27.9818, lon: -55.5204 }
];

export default function ClimaPage() {
  const [forecasts, setForecasts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchForecasts() {
      try {
        const results = {};
        for (const city of CITIES) {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=America/Sao_Paulo`);
          const data = await res.json();
          results[city.name] = data;
        }
        setForecasts(results);
      } catch (err) {
        console.error("Error fetching weather:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchForecasts();
  }, []);

  const getWeatherDescription = (code) => {
    if (code === 0) return 'Despejado';
    if (code === 1 || code === 2 || code === 3) return 'Parcialmente Nublado';
    if (code === 45 || code === 48) return 'Niebla';
    if (code >= 51 && code <= 67) return 'Lluvia';
    if (code >= 71 && code <= 77) return 'Nieve';
    if (code >= 80 && code <= 82) return 'Chubascos';
    if (code >= 95 && code <= 99) return 'Tormenta';
    return 'Desconocido';
  };

  const getWeatherEmoji = (code) => {
    if (code === 0) return '☀️';
    if (code === 1 || code === 2 || code === 3) return '⛅';
    if (code === 45 || code === 48) return '🌫️';
    if (code >= 51 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 95 && code <= 99) return '⛈️';
    return '🌡️';
  };

  return (
    <main>
      <div className="container" style={{ marginTop: '2rem' }}>
        <header className="section-header" style={{ marginBottom: '2rem', borderBottom: '2px solid var(--foreground)', paddingBottom: '1rem' }}>
          <h1 className="site-title" style={{ fontSize: '2.5rem', textAlign: 'left' }}>
            Estado del Tiempo en Misiones
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Pronóstico actualizado en vivo para las ciudades más importantes de la provincia.</p>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <h2>Cargando pronósticos...</h2>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {CITIES.map((city) => {
              const data = forecasts[city.name];
              if (!data) return null;
              
              const current = data.current_weather;
              const daily = data.daily;

              return (
                <article key={city.name} className="article-card" style={{ padding: '2rem', textAlign: 'center' }}>
                  <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>{city.name}</h2>
                  
                  <div style={{ fontSize: '4rem', margin: '1rem 0' }}>
                    {getWeatherEmoji(current.weathercode)}
                  </div>
                  
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                    {current.temperature}°C
                  </div>
                  
                  <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {getWeatherDescription(current.weathercode)}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Máxima</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{daily.temperature_2m_max[0]}°C</div>
                    </div>
                    <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }}></div>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mínima</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{daily.temperature_2m_min[0]}°C</div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
