export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { scrapeFullArticle, updateArticleInCache } from '@/lib/newsFetcher';
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
    let editedCategory = null;

    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `Eres un periodista profesional y redactor web para el diario digital MISIONES YA. 
Tu tarea es tomar el siguiente texto de una noticia (que fue extraída de otro medio) y reescribirla por completo para crear un artículo original y evitar el plagio.
Requisitos:
- Mantén los hechos estrictamente verídicos. No inventes datos.
- Usa un tono periodístico, serio y objetivo.
- Formatea el resultado en HTML (usa etiquetas <p>, <strong>, y <h2> si es necesario). No incluyas bloques de código, solo el contenido.
- Escribe también un nuevo titular impactante y original para la noticia.
- Analiza la noticia y asígnale UNA sola categoría principal (Ej: Política, Policiales, Deportes, Economía, Sociedad, Internacionales, Espectáculos).
- Extrae los 3 puntos más importantes de la noticia en frases cortas.
- Devuelve la respuesta en formato JSON estrictamente: {"title": "Nuevo Titular", "content": "<p>Contenido reescrito...</p>", "summary": ["Punto 1", "Punto 2", "Punto 3"], "category": "Política"}

Texto original:
${scrapedText.substring(0, 4000)}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          editedTitle = parsed.title;
          
          let summaryHtml = '';
          if (parsed.summary && Array.isArray(parsed.summary)) {
            summaryHtml = `
              <div class="ai-summary mb-8 p-6 bg-gray-50 dark:bg-gray-800/80 rounded-xl border-l-4 border-[#E5232A] shadow-sm">
                <h3 class="font-black text-xl mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100 uppercase tracking-tight">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E5232A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"></path><path d="m17 5-5-3-5 3"></path><path d="m17 19-5 3-5-3"></path><path d="M2 12h20"></path><path d="m5 7 3 5-3 5"></path><path d="m19 7-3 5 3 5"></path></svg>
                  Resumen de la noticia
                </h3>
                <ul class="list-none space-y-3">
                  ${parsed.summary.map(p => `
                    <li class="flex items-start gap-3">
                      <span class="text-[#E5232A] mt-1.5 opacity-80">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"></circle></svg>
                      </span>
                      <span class="text-gray-700 dark:text-gray-300 font-semibold leading-relaxed text-[17px]">${p}</span>
                    </li>`).join('')}
                </ul>
              </div>
            `;
          }
          
          editedContent = summaryHtml + parsed.content;
          if (parsed.category) editedCategory = parsed.category;
        }
      } catch (geminiError) {
        console.error("Error al reescribir con Gemini:", geminiError);
      }
    }

    await updateArticleInCache(id, scrapedText, newImage, editedContent, editedTitle, editedCategory);

    return NextResponse.json({ 
      success: true, 
      content: scrapedText, 
      image: newImage,
      edited_content: editedContent,
      edited_title: editedTitle,
      category: editedCategory
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
