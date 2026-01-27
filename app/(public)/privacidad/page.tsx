import { Shield, Lock, Eye, Mail } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* CABECERA */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#232755] mb-4">
            Política de Privacidad
          </h1>
          <p className="text-gray-500">
            Última actualización: Enero 2026
          </p>
        </div>

        {/* RESUMEN PARA HUMANOS */}
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-12">
          <h2 className="text-xl font-bold text-[#232755] mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#ed9b19]" />
            Resumen (TL;DR)
          </h2>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>✅ <strong>Tus Datos:</strong> Solo guardamos lo que escribes en los formularios (Nombre, Correo, Teléfono) para poder cotizarte.</li>
            <li>✅ <strong>No Spameamos:</strong> No vendemos tu correo a terceros.</li>
            <li>✅ <strong>Seguridad:</strong> Tu información viaja encriptada y se almacena en servidores seguros (Supabase).</li>
            <li>✅ <strong>Tus Derechos:</strong> Puedes pedirnos que borremos tus datos cuando quieras escribiendo a ventas@ilpsolucioneslogistica.com.pe.</li>
          </ul>
        </div>

        {/* CONTENIDO LEGAL */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 text-gray-700 leading-relaxed space-y-8">
          
          <section>
            <h3 className="text-xl font-bold text-[#232755] mb-3">1. Identidad del Responsable</h3>
            <p>
              <strong>ILP Soluciones Logística S.A.C.</strong> (en adelante, "LA EMPRESA"), identificada con RUC N° 20601234567, con domicilio legal en Calle Sibelius 148 Of. 102, San Borja, Lima, asegura el cumplimiento de la Ley N° 29733, Ley de Protección de Datos Personales, y su Reglamento.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#232755] mb-3">2. Información que Recopilamos</h3>
            <p>
              Recopilamos información personal que usted nos proporciona voluntariamente a través de nuestros formularios de contacto, cotización y WhatsApp:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Nombres y Apellidos.</li>
              <li>Correo electrónico corporativo o personal.</li>
              <li>Número de teléfono / celular.</li>
              <li>Razón Social y RUC de la empresa que representa.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#232755] mb-3">3. Finalidad del Tratamiento</h3>
            <p>Los datos personales serán utilizados exclusivamente para:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Responder a sus solicitudes de cotización de equipos y servicios.</li>
              <li>Gestión comercial, facturación y seguimiento de pedidos.</li>
              <li>Envío de información técnica relevante sobre maquinaria adquirida.</li>
              <li>Mejora de nuestros servicios y atención al cliente.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#232755] mb-3">4. Seguridad y Confidencialidad</h3>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos contra accesos no autorizados. Utilizamos proveedores de tecnología de clase mundial (como Google Cloud y Supabase) que cumplen con altos estándares de seguridad.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#232755] mb-3">5. Derechos ARCO</h3>
            <p>
              Como titular de sus datos personales, usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse (Derechos ARCO) al tratamiento de su información. Para ejercer estos derechos, puede enviar una solicitud a nuestro correo oficial:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center gap-3">
              <Mail className="text-[#ed9b19]" />
              <a href="mailto:ventas@ilpsolucioneslogistica.com.pe" className="font-bold text-[#232755] hover:underline">
                ventas@ilpsolucioneslogistica.com.pe
              </a>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#232755] mb-3">6. Uso de Cookies</h3>
            <p>
              Este sitio web puede utilizar cookies técnicas necesarias para su funcionamiento y cookies analíticas anónimas para mejorar la experiencia de usuario. No utilizamos cookies publicitarias invasivas.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}