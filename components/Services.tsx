import Link from "next/link"
import { PackageOpen, Truck, Users, ArrowRight } from "lucide-react"

export function Services() {
  const businessUnits = [
    {
      title: "Equipos de Carga",
      description: "Rampas móviles, niveladoras y muelles para optimizar tiempos. Infraestructura sin obras civiles.",
      icon: <PackageOpen className="w-8 h-8" />,
      link: "/catalogo",
      cta: "Ver Catálogo"
    },
    {
      title: "Maquinaria Pesada",
      description: "Venta y alquiler de Montacargas (Dual/Eléctrico), Apiladores y Transpaletas de alto rendimiento.",
      icon: <Truck className="w-8 h-8" />, // Representa movimiento pesado
      link: "/catalogo",
      cta: "Ver Maquinaria"
    },
    {
      title: "Servicios Operativos",
      description: "Tercerización de procesos: Estiba, desestiba, maquila y mantenimiento de flota in-house.",
      icon: <Users className="w-8 h-8" />,
      link: "/servicios",
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
            Soluciones 360° para tu Almacén
          </h2>
          <p className="text-gray-600">
            Integramos venta de equipos, infraestructura y gestión de personal para que tú solo te preocupes por vender.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {businessUnits.map((unit, index) => (
            <div 
              key={index}
              className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-[#232755]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#ed9b19] group-hover:text-white text-[#232755] transition-colors duration-300">
                {unit.icon}
              </div>
              
              <h3 className="text-xl font-bold text-[#232755] mb-3 group-hover:text-[#ed9b19] transition-colors">
                {unit.title}
              </h3>
              
              <p className="text-gray-500 mb-8 leading-relaxed text-sm">
                {unit.description}
              </p>
              
              <Link 
                href={unit.link} 
                className="inline-flex items-center font-bold text-[#232755] group-hover:translate-x-2 transition-transform text-sm"
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