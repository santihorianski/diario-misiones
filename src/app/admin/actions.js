'use server';

import { toggleArticleVisibility, deleteArticle, updateArticleAdmin, createCustomArticle, updateAdsConfig } from '@/lib/cms';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function toggleVisibilityAction(id, isHidden) {
  await toggleArticleVisibility(id, isHidden);
  revalidatePath('/');
  revalidatePath('/admin/noticias');
}

export async function deleteArticleAction(id) {
  await deleteArticle(id);
  revalidatePath('/');
  revalidatePath('/admin/noticias');
}

export async function updateArticleAction(id, formData) {
  const editedTitle = formData.get('title');
  const editedContent = formData.get('content');
  const image = formData.get('image');
  const status = formData.get('status')?.toString();
  const seoDescription = formData.get('seoDescription')?.toString();
  
  await updateArticleAdmin(id, { 
    editedTitle: editedTitle ? editedTitle.toString() : undefined, 
    editedContent: editedContent ? editedContent.toString() : undefined,
    image: image ? image.toString() : undefined,
    status: status,
    seoDescription: seoDescription
  });
  
  revalidatePath('/');
  revalidatePath('/admin/noticias');
}

export async function createNewsAction(formData) {
  const title = formData.get('title')?.toString();
  const fullContent = formData.get('content')?.toString();
  const image = formData.get('image')?.toString();
  const categoriesRaw = formData.get('categories')?.toString();
  const status = formData.get('status')?.toString() || 'published';
  const seoDescription = formData.get('seoDescription')?.toString();
  
  const categories = categoriesRaw ? categoriesRaw.split(',').map(c => c.trim()) : ['Destacado'];
  
  if (title && fullContent) {
    await createCustomArticle({ title, fullContent, image, categories, status, seoDescription });
    revalidatePath('/');
    revalidatePath('/admin/noticias');
  }
}

export async function saveAdsAction(formData) {
  const headerActive = formData.get('headerActive') === 'on';
  const headerType = formData.get('headerType')?.toString();
  const headerImage = formData.get('headerImage')?.toString();
  const headerLink = formData.get('headerLink')?.toString();
  const headerScript = formData.get('headerScript')?.toString();

  const sidebarActive = formData.get('sidebarActive') === 'on';
  const sidebarType = formData.get('sidebarType')?.toString();
  const sidebarImage = formData.get('sidebarImage')?.toString();
  const sidebarLink = formData.get('sidebarLink')?.toString();
  const sidebarScript = formData.get('sidebarScript')?.toString();

  const inArticleActive = formData.get('inArticleActive') === 'on';
  const inArticleType = formData.get('inArticleType')?.toString();
  const inArticleImage = formData.get('inArticleImage')?.toString();
  const inArticleLink = formData.get('inArticleLink')?.toString();
  const inArticleScript = formData.get('inArticleScript')?.toString();

  const newConfig = {
    header: { active: headerActive, type: headerType, imageUrl: headerImage, link: headerLink, script: headerScript },
    sidebar: { active: sidebarActive, type: sidebarType, imageUrl: sidebarImage, link: sidebarLink, script: sidebarScript },
    inArticle: { active: inArticleActive, type: inArticleType, imageUrl: inArticleImage, link: inArticleLink, script: inArticleScript }
  };

  await updateAdsConfig(newConfig);
  revalidatePath('/');
  revalidatePath('/admin/anuncios');
}
