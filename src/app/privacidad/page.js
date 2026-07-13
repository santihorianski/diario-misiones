export const metadata = {
  title: 'Política de Privacidad | Misiones Ya',
  description: 'Política de Privacidad y protección de datos del portal Misiones Ya.',
};

export default function PrivacidadPage() {
  return (
    <main className="bg-white dark:bg-[#111111] min-h-screen py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black mb-8 text-gray-900 dark:text-white uppercase tracking-tight">
          Política de Privacidad
        </h1>
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6">
          <p className="font-semibold text-lg">
            Última actualización: {new Date().toLocaleDateString('es-AR')}
          </p>

          <p>
            En <strong>Misiones Ya</strong>, estamos comprometidos con la protección de la privacidad de nuestros usuarios y la confidencialidad de la información personal que se nos confía, en estricto cumplimiento con la legislación vigente en la República Argentina.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10">1. Marco Legal Aplicable</h2>
          <p>
            Toda recolección y tratamiento de datos personales realizado por el Sitio se ajusta plenamente a las disposiciones de la <strong>Ley N° 25.326 de Protección de Datos Personales</strong>, su Decreto Reglamentario 1558/2001, y las resoluciones emitidas por la Agencia de Acceso a la Información Pública (AAIP).
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10">2. Recopilación de Datos</h2>
          <p>
            Misiones Ya puede recopilar información mediante:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Datos analíticos y de navegación:</strong> Se recaba información anónima sobre el comportamiento de navegación (dirección IP, navegador, tiempo de sesión, páginas visitadas) mediante cookies técnicas y de terceros (ej. Google Analytics) para fines estadísticos y de mejora de rendimiento.</li>
            <li><strong>Datos otorgados voluntariamente:</strong> Al suscribirse a nuestro newsletter o utilizar formularios de contacto, se solicitará únicamente información básica y pertinente (ej. nombre y correo electrónico).</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10">3. Uso de la Información</h2>
          <p>
            Los datos personales proporcionados serán utilizados exclusivamente para los fines para los cuales fueron suministrados, tales como: responder consultas, enviar boletines informativos (newsletters) o mejorar la experiencia del usuario en nuestra plataforma. 
            Misiones Ya no vende, alquila ni comparte bases de datos con terceros con fines comerciales sin el consentimiento previo y expreso del titular.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10">4. Uso de Cookies</h2>
          <p>
            Nuestro sitio utiliza <em>cookies</em> y tecnologías similares de rastreo. El usuario puede configurar su navegador para rechazar todas las cookies, sin embargo, es posible que algunas funciones del Sitio dejen de funcionar óptimamente. Al continuar navegando, usted consiente el uso de estas herramientas.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10">5. Derechos de los Titulares (ARCO)</h2>
          <p>
            De acuerdo a la Ley 25.326 (Art. 14, 16 y concordantes), el titular de los datos personales tiene la facultad de ejercer en cualquier momento sus derechos de:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Acceso:</strong> Solicitar información sobre qué datos suyos obran en nuestros registros (gratuito en intervalos no inferiores a seis meses).</li>
            <li><strong>Rectificación:</strong> Solicitar la corrección de datos falsos o desactualizados.</li>
            <li><strong>Supresión:</strong> Solicitar la eliminación total de sus datos de nuestros registros.</li>
          </ul>
          <p>
            La Agencia de Acceso a la Información Pública, en su carácter de Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes.
          </p>

          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="m-0 text-sm">
              Para ejercer cualquiera de sus derechos o manifestar dudas sobre nuestra Política de Privacidad, el canal oficial y directo de contacto es: <strong>contacto@misionesya.com</strong>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
