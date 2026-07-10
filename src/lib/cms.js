import { supabase } from './supabaseClient';
import fs from 'fs/promises';
import path from 'path';

const getAdsPath = () => path.join(process.cwd(), 'data', 'ads.json');

// Obtener todas las noticias (incluyendo ocultas) para el panel admin
export async function getAdminNews() {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(500);
      
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id ? item.id.toString() : Buffer.from(item.source_url).toString('base64').replace(/[^a-zA-Z0-9]/g, ''),
      source: item.source,
      title: item.title,
      editedTitle: item.edited_title,
      link: item.source_url,
      pubDate: item.published_at,
      contentSnippet: item.content_snippet,
      fullContent: item.content,
      editedContent: item.edited_content,
      image: item.image,
      categories: item.categories || [],
      scraped: item.scraped,
      isCustom: item.source === 'MisionesYa',
      isHidden: item.is_hidden,
      status: item.status,
      seoDescription: item.meta_description
    }));
  } catch (err) {
    console.error('Error in getAdminNews:', err);
    return [];
  }
}

// Ocultar o mostrar un artículo
export async function toggleArticleVisibility(id, isHidden) {
  try {
    // Intentamos buscar por id numérico, pero si estamos usando UUID o base64, adaptamos
    const { error } = await supabase
      .from('articles')
      .update({ is_hidden: isHidden })
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error toggling visibility:', err);
    return false;
  }
}

export const updateArticleAdmin = async (id, updates) => {
  try {
    const payload = {};
    if (updates.editedTitle !== undefined) payload.edited_title = updates.editedTitle;
    if (updates.editedContent !== undefined) payload.edited_content = updates.editedContent;
    if (updates.image !== undefined) payload.image = updates.image;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.seoDescription !== undefined) payload.meta_description = updates.seoDescription;
    if (updates.categories !== undefined) payload.categories = updates.categories;

    const { error } = await supabase
      .from('articles')
      .update(payload)
      .eq('id', id);
      
    if (error) throw error;
  } catch (err) {
    console.error('Error updating article admin:', err);
  }
};

// Crear un artículo personalizado 100% propio
export const createCustomArticle = async ({ title, fullContent, image, categories, status = 'published', seoDescription = '' }) => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .insert({
        title,
        content: fullContent,
        content_snippet: fullContent.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...',
        source: 'MisionesYa',
        source_url: `https://misionesya.com/article/custom-${Date.now()}`,
        image,
        categories: categories || ['Destacado'],
        status,
        meta_description: seoDescription,
        published_at: new Date().toISOString(),
        is_hidden: false,
        scraped: true
      })
      .select();

    if (error) throw error;
    return data[0];
  } catch (err) {
    console.error('Error creating custom article:', err);
    return null;
  }
};

// Eliminar un artículo definitivamente
export async function deleteArticle(id) {
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error deleting article:', err);
    return false;
  }
}

// GESTIÓN DE ANUNCIOS

const DEFAULT_ADS = {
  header: { active: true, type: 'image', imageUrl: 'https://placehold.co/728x90.png?text=Tu+Anuncio+Aqui', link: '#', script: '' },
  sidebar: { active: true, type: 'image', imageUrl: 'https://placehold.co/300x250.png?text=Tu+Anuncio+Aqui', link: '#', script: '' },
  inArticle: { active: false, type: 'image', imageUrl: '', link: '', script: '' }
};

export const getAdsConfig = async () => {
  try {
    const fileContents = await fs.readFile(getAdsPath(), 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    return {
      header: { active: false, type: 'image', imageUrl: '', link: '', script: '' },
      sidebar: { active: false, type: 'image', imageUrl: '', link: '', script: '' },
      inArticle: { active: false, type: 'image', imageUrl: '', link: '', script: '' }
    };
  }
};

export async function updateAdsConfig(newConfig) {
  try {
    await fs.writeFile(getAdsPath(), JSON.stringify(newConfig, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error updating ads:', err);
    return false;
  }
}
