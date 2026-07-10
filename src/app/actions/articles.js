'use server';

import { supabase } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';
import { stripHtml } from '@/lib/fetchNews'; // Para limpiar HTML si es necesario

// 1. Obtener solo artículos pendientes para el admin
export async function getPendingArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'draft')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending articles:', error);
    return [];
  }

  return mapSupabaseArticles(data);
}

// 2. Publicar un artículo desde el panel
export async function publishArticle(id) {
  const { error } = await supabase
    .from('articles')
    .update({ 
      status: 'published',
      published_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error(`Error publishing article ${id}:`, error);
    return { success: false, error: error.message };
  }

  // Limpiar el caché de la portada pública para que refleje el cambio inmediatamente
  revalidatePath('/');
  return { success: true };
}

// 3. Obtener solo artículos publicados para la portada pública (optimizado a 20)
export async function getPublishedArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, content_snippet, edited_title, edited_content, source, source_url, image, categories, published_at') // omit full content if possible to save bandwidth, or select all if needed
    .eq('status', 'published')
    .eq('is_hidden', false)
    .order('published_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching published articles:', error);
    return [];
  }

  return mapSupabaseArticles(data);
}

// Función auxiliar para adaptar el modelo de la DB al Frontend
function mapSupabaseArticles(data) {
  return data.map(item => ({
    id: item.id.toString(),
    source: item.source,
    title: item.edited_title || item.title,
    link: item.source_url,
    pubDate: item.published_at,
    contentSnippet: item.edited_content 
      ? stripHtml(item.edited_content).substring(0, 150) + '...'
      : item.content_snippet || stripHtml(item.title).substring(0, 150),
    fullContent: item.edited_content || item.content, // Puede ser null en getPublishedArticles si omitimos content
    image: item.image,
    categories: item.categories || [],
    scraped: item.scraped,
    status: item.status,
    seoDescription: item.meta_description
  }));
}
