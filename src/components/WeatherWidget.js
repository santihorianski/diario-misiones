'use client';
import { useEffect, useState } from 'react';

const CITIES = [
  { name: 'Posadas', lat: -27.3671, lon: -55.8961 },
  { name: 'Oberá', lat: -27.4871, lon: -55.1200 },
  { name: 'Iguazú', lat: -25.5991, lon: -54.5736 }
];

import Link from 'next/link';

export default function WeatherWidget() {
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllWeather() {
      try {
        const results = {};
        for (const city of CITIES) {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`);
          const data = await res.json();
          results[city.name] = data.current_weather.temperature;
        }
        setWeather(results);
      } catch (err) {
        console.error("Error fetching weather:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllWeather();
  }, []);

  if (loading || Object.keys(weather).length === 0) return <span className="weather-widget">Cargando clima...</span>;

  return (
    <div className="weather-widget" style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
      <Link href="/clima" style={{ fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline', color: 'var(--foreground)' }}>
        Clima Misiones:
      </Link>
      {CITIES.map(city => (
        <span key={city.name} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {city.name} <strong>{weather[city.name]}°C</strong>
        </span>
      ))}
    </div>
  );
}
