import { FileText, Truck, AlertTriangle, CheckCircle } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* CABECERA */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#232755] mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-gray-500">
            Última actualización: Enero 2026
          </p>
        </div>

        {/* INTRODUCCIÓN */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 text-gray-700 leading-relaxed space-y-8">
          
          <section>
            <h3 className="text-xl font-bold text-[#232755] mb-3">1. Aceptación</h3>
            <p>
              Al utilizar el sitio web de <strong>ILP Soluciones Logística S.A.C.</strong> y solicitar nuestros servicios, usted acepta los presentes Términos y Condiciones. Estos términos rigen la venta de maquinaria, alquiler de equipos y prestación de servicios logísticos.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#232755] mb-3">2. Sobre las Cotizaciones y Precios</h3>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Los precios mostrados en el catálogo web son referenciales y pueden variar según el tipo de cambio, stock disponible y configuración específica del equipo.</li>
              <li>Una cotización emitida por nuestros asesores tiene una validez de <strong>7 días calendario</strong>, salvo que se indique lo contrario en el documento.</li>
              <li>La venta solo se considera perfeccionada una vez que el cliente envía la Orden de Compra (OC) y esta es aceptada por ILP.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#232755] mb-3">3. Entregas y Despachos</h3>
            <div className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg">
              <Truck className="w-6 h-6 text-[#ed9b19] flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold text-[#232755] mb-1">Logística de Entrega</p>
                <p className="text-sm">
                  Los tiempos de entrega se coordinan al momento de la compra. Para maquinaria pesada, la entrega se realiza en nuestro Centro de Operaciones (Punta Hermosa) o en las instalaciones del cliente, previo acuerdo de costos de flete. ILP no se responsabiliza por retrasos debidos a fuerza mayor (bloqueos de carreteras, desastres naturales).
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#232755] mb-3">4. Garantías de Maquinaria</h3>
            <p>
              Todos nuestros equipos nuevos (Montacargas, Apiladores, etc.) cuentan con garantía de fábrica contra defectos de fabricación.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Equipos Nuevos:</strong> Garantía estándar de 1 año o 2,000 horas (lo que ocurra primero), salvo indicación contraria en la factura.</li>
              <li><strong>Baterías de Litio:</strong> Cuentan con garantías extendidas específicas según el fabricante (usualmente hasta 5 años).</li>
              <li><strong>Exclusiones:</strong> La garantía no cubre daños por mal uso, falta de mantenimiento preventivo, o accidentes operativos.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#232755] mb-3">5. Servicios de Alquiler y Operaciones</h3>
            <p>
              Para los servicios de alquiler de flota y tercerización de personal (maquila/estiba), se firmará un contrato específico que detalla:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Responsabilidades del seguro (TREC).</li>
              <li>Horas mínimas de facturación.</li>
              <li>Condiciones de seguridad y salud en el trabajo (SST).</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#232755] mb-3">6. Propiedad Intelectual</h3>
            <p>
              Todo el contenido de este sitio web (imágenes de productos, logotipos, fichas técnicas y textos) es propiedad de ILP Soluciones Logística S.A.C. o de sus proveedores autorizados. Está prohibida su reproducción sin consentimiento escrito.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#232755] mb-3">7. Ley Aplicable</h3>
            <p>
              Estos términos se rigen por las leyes de la República del Perú. Cualquier controversia se someterá a la competencia de los Jueces y Tribunales del Cercado de Lima.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}