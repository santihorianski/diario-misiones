import { createUploadthing } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
  // Define la ruta para imágenes de portada y contenido
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      // 1. Validar la sesión con Clerk de manera asíncrona
      const { userId } = await auth();
      
      // 2. Si no hay usuario autenticado en /admin, denegar la subida
      if (!userId) throw new Error("No autorizado");
      
      return { userId };
    })
    .onUploadComplete(async ({ middlewareData, file }) => {
      // Retorna la URL al cliente de Next.js
      return { uploadedBy: middlewareData.userId, url: file.url };
    }),
};
