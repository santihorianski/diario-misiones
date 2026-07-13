export const metadata = {
  title: 'Términos y Condiciones | Misiones Ya',
  description: 'Términos y Condiciones de Uso del portal informativo Misiones Ya.',
};

export default function TerminosPage() {
  return (
    <main className="bg-white dark:bg-[#111111] min-h-screen py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black mb-8 text-gray-900 dark:text-white uppercase tracking-tight">
          Términos y Condiciones
        </h1>
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6">
          <p className="font-semibold text-lg">
            Última actualización: {new Date().toLocaleDateString('es-AR')}
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10">1. Objeto y Naturaleza del Servicio</h2>
          <p>
            El presente documento establece las Condiciones Generales de Uso del portal digital informativo <strong>Misiones Ya</strong> (en adelante, "el Sitio"). El Sitio funciona como una plataforma de agregación periodística, que tiene como objetivo centralizar, organizar y facilitar el acceso a la información de interés público de la provincia de Misiones y la región del Litoral argentino.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10">2. Propiedad Intelectual y Curación de Contenidos</h2>
          <p>
            Misiones Ya respeta y se acoge estrictamente a la legislación de la República Argentina en materia de Propiedad Intelectual, en especial a la <strong>Ley N° 11.723</strong>. En cumplimiento de su Artículo 31 sobre el <em>Derecho de Cita</em> y normativas complementarias referidas a la difusión de noticias de interés general:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Los hechos noticiosos no son susceptibles de protección por derechos de autor (Artículo 28).</li>
            <li>El Sitio utiliza herramientas de inteligencia artificial y revisión editorial para procesar, reescribir y generar resúmenes propios de las noticias, asegurando que la redacción final sea una obra derivada original y no constituya plagio o copia literal.</li>
            <li>Se cita y enlaza correspondientemente a la fuente original de los datos para garantizar el derecho a la información de los usuarios y reconocer el origen periodístico de los mismos.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10">3. Exención de Responsabilidad</h2>
          <p>
            Misiones Ya actúa de buena fe difundiendo contenido noticioso. Sin embargo, no se hace responsable por:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>La veracidad, exactitud o vigencia de la información provista por terceros u originada en fuentes externas.</li>
            <li>Las opiniones vertidas en columnas, citas, redes sociales incrustadas o comentarios de lectores.</li>
            <li>El contenido de los enlaces a sitios web de terceros, los cuales se rigen por sus propias políticas de privacidad y términos de uso.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10">4. Modificaciones del Servicio</h2>
          <p>
            Nos reservamos el derecho de modificar, suspender o interrumpir el acceso al Sitio en cualquier momento, así como de actualizar estos Términos y Condiciones sin previo aviso, entrando en vigor las modificaciones al momento de su publicación.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10">5. Jurisdicción y Legislación Aplicable</h2>
          <p>
            Estos términos se regirán por las leyes vigentes de la República Argentina. Cualquier conflicto que surja en relación con el uso de Misiones Ya será sometido a la jurisdicción de los tribunales ordinarios de la ciudad de Posadas, Misiones, renunciando a cualquier otro fuero que pudiera corresponder.
          </p>

          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="m-0 text-sm">
              Para cualquier consulta legal o solicitud de remoción de contenido según las normativas de la Dirección Nacional del Derecho de Autor, por favor escriba a <strong>contacto@misionesya.com</strong>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
