import { NextResponse } from 'next/server';
import { scrapeFullArticle, updateArticleInCache } from '@/lib/fetchNews';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  try {
    const { id, link } = await req.json();
    if (!id || !link) return NextResponse.json({ error: 'Missing id or link' }, { status: 400 });

    const scrapedText = await scrapeFullArticle(link);
    if (!scrapedText || scrapedText.length < 500) {
      return NextResponse.json({ error: 'No se pudo extraer suficiente contenido' }, { status: 400 });
    }

    let newImage = null;
    const imgMatch = scrapedText.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch && imgMatch[1]) newImage = imgMatch[1];

    let editedContent = null;
    let editedTitle = null;

    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `Eres un periodista profesional y redactor web para el diario digital MISIONESYA. 
Tu tarea es tomar el siguiente texto de una noticia (que fue extraída de otro medio) y reescribirla por completo para crear un artículo original y evitar el plagio.
Requisitos:
- Mantén los hechos estrictamente verídicos. No inventes datos.
- Usa un tono periodístico, serio y objetivo.
- Formatea el resultado en HTML (usa etiquetas <p>, <strong>, y <h2> si es necesario). No incluyas bloques de código, solo el contenido.
- Escribe también un nuevo titular impactante y original para la noticia.
- Devuelve la respuesta en formato JSON estrictamente: {"title": "Nuevo Titular", "content": "<p>Contenido reescrito...</p>"}

Texto original:
${scrapedText.substring(0, 4000)}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          editedTitle = parsed.title;
          editedContent = parsed.content;
        }
      } catch (geminiError) {
        console.error("Error al reescribir con Gemini:", geminiError);
      }
    }

    await updateArticleInCache(id, scrapedText, newImage, editedContent, editedTitle);

    return NextResponse.json({ 
      success: true, 
      content: scrapedText, 
      image: newImage,
      edited_content: editedContent,
      edited_title: editedTitle
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
