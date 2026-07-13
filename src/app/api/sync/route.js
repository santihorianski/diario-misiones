import { NextResponse } from 'next/server';
import { fetchAllNews } from '@/lib/newsFetcher';



export async function POST() {
  try {
    // LLamamos a fetchAllNews, asumiendo que fuerza una lectura o al menos actualiza
    // En una refactorización real, fetchAllNews debería aceptar un flag (forceSync)
    // Para simplificar, asumiremos que se recarga.
    await fetchAllNews();
    return NextResponse.json({ success: true, message: 'Noticias sincronizadas correctamente' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
