import Link from "next/link"

export function Services() {
  const services = [
    {
      title: "Equipos de Carga",
      description: "Rampas móviles, niveladoras y muelles de carga para optimizar tiempos de operación en almacén.",
      icon: "📦", // Puedes cambiar esto por un <Icon /> de lucide-react
      link: "/catalogo",
      cta: "Ver Equipos"
    },
    {
      title: "Maquinaria",
      description: "Montacargas duales, eléctricos, apiladores y transpaletas de alto rendimiento para movimiento de carga.",
      icon: "🚜",
      link: "/catalogo",
      cta: "Ver Maquinaria"
    },
    {
      title: "Servicios Logísticos",
      description: "Personal especializado para estiba, desestiba, maquila, mantenimiento de flota y gestión de almacenes.",
      icon: "🛠️",
      link: "/servicios",
      cta: "Conocer Servicios"
    }
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#232755] mb-4">
            Todo lo que tu almacén necesita
          </h2>
          <p className="text-gray-600">
            Desde la venta de maquinaria pesada hasta la gestión operativa de tu personal. Ofrecemos soluciones 360°.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-[#232755]/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#ed9b19] transition-colors duration-300">
                <span className="text-3xl">{service.icon}</span>
              </div>
              
              <h3 className="text-xl font-bold text-[#232755] mb-3 group-hover:text-[#ed9b19] transition-colors">
                {service.title}
              </h3>
              
              <p className="text-gray-500 mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <Link 
                href={service.link} 
                className="inline-flex items-center font-bold text-[#232755] group-hover:translate-x-2 transition-transform"
              >
                {service.cta} <span className="ml-2">→</span>
              </Link>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  )
}