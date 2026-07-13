export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { fetchAllNews } from '@/lib/newsFetcher';



export async function POST() {
  try {
    // LLamamos a fetchAllNews con forceSync = true
    await fetchAllNews(true);
    return NextResponse.json({ success: true, message: 'Noticias sincronizadas correctamente' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
