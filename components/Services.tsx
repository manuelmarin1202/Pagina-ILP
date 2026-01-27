import Link from "next/link"
import { 
  Warehouse, // Infraestructura
  Forklift,  // Maquinaria (Si lucide no lo tiene, usa Truck)
  Settings,  // Aditamentos
  Users,     // Servicios
  ArrowRight
} from "lucide-react"

export function Services() {
  const businessUnits = [
    {
      title: "Maquinaria y Elevación",
      description: "Potencia de movimiento. Venta y alquiler de Montacargas (Litio/Dual), Apiladores, Transpaletas y Elevadores.",
      icon: <Forklift className="w-8 h-8" />, // O <Truck /> si Forklift da error
      link: "/catalogo?categoria=maquinaria-elevacion",
      cta: "Ver Maquinaria"
    },
    {
      title: "Infraestructura de Carga",
      description: "Optimiza el flujo. Rampas móviles, Niveladores de muelle y Plataformas para agilizar la carga y descarga.",
      icon: <Warehouse className="w-8 h-8" />,
      link: "/catalogo?categoria=infraestructura-carga",
      cta: "Ver Infraestructura"
    },
    {
      title: "Aditamentos y Accesorios",
      description: "Versatilidad técnica. Push Pulls, Clamps (Bobinas/Cartón), Rotadores y Uñas especializadas.",
      icon: <Settings className="w-8 h-8" />,
      link: "/catalogo?categoria=aditamentos", // Asegúrate de crear esta categoría o usar la ID correcta
      cta: "Ver Aditamentos"
    },
    {
      title: "Servicios y Operaciones",
      description: "Gestión integral. Mantenimiento de flota, Personal de estiba/maquila, Capacitaciones y Software WMS.",
      icon: <Users className="w-8 h-8" />,
      link: "/servicios", // Página dedicada
      cta: "Conocer Servicios"
    }
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#ed9b19] font-bold tracking-widest uppercase text-sm">
            Nuestras Divisiones
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#232755] mt-2 mb-4">
            Soluciones Integrales 2026
          </h2>
          <p className="text-gray-600">
            Equipamiento de alto rendimiento y servicios operativos para cada etapa de tu cadena logística.
          </p>
        </div>

        {/* GRID AJUSTADO: 1 columna (móvil), 2 columnas (tablet), 4 columnas (PC grande) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {businessUnits.map((unit, index) => (
            <div 
              key={index}
              className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
            >
              <div className="w-14 h-14 bg-[#232755]/5 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#ed9b19] group-hover:text-white text-[#232755] transition-colors duration-300">
                {unit.icon}
              </div>
              
              <h3 className="text-lg font-bold text-[#232755] mb-2 group-hover:text-[#ed9b19] transition-colors">
                {unit.title}
              </h3>
              
              <p className="text-gray-500 mb-6 leading-relaxed text-sm flex-grow">
                {unit.description}
              </p>
              
              <Link 
                href={unit.link} 
                className="inline-flex items-center font-bold text-[#232755] group-hover:translate-x-2 transition-transform text-sm mt-auto"
              >
                {unit.cta} <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  )
}