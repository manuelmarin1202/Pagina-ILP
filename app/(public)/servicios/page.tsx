import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowRight, 
  Wrench, 
  Truck, 
  Users, 
  Forklift, 
  Monitor, 
  GraduationCap, 
  Warehouse 
} from "lucide-react"

const STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catalog/`

// 1. DICCIONARIO DE ICONOS
// Mapeamos el texto de la base de datos (truck, users...) al componente de Lucide
const iconMap: Record<string, any> = {
  'wrench': Wrench,
  'truck': Truck,
  'users': Users,
  'forklift': Forklift,
  'monitor': Monitor,
  'graduation-cap': GraduationCap,
  'warehouse': Warehouse,
  'package-open': Warehouse // Fallback para estiba si no quieres otro icono
}

export default async function ServicesPage() {
  const supabase = await createClient()
  
  // Obtenemos los servicios
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: true })

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#ed9b19] font-bold tracking-widest uppercase text-sm">
            Nuestros Servicios
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[#232755] mt-2">
            Soluciones Integrales
          </h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Más allá de la venta, somos tu socio estratégico en el mantenimiento, gestión y operación de tu almacén.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service) => {
            
            // 2. SELECCIÓN DINÁMICA DE ICONO
            // Si la base de datos tiene 'truck', usa Truck. Si no existe, usa Wrench por defecto.
            const IconComponent = iconMap[service.icon_key] || Wrench

            return (
              <Link 
                key={service.id} 
                href={`/servicios/${service.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
              >
                {/* Imagen o Placeholder con Icono Correcto */}
                <div className="relative h-56 bg-gray-100 overflow-hidden border-b border-gray-100">
                  {service.image_path ? (
                    <Image 
                      src={`${STORAGE_URL}${service.image_path}`} 
                      alt={service.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-[#ed9b19] transition-colors bg-gray-50">
                      <IconComponent size={48} strokeWidth={1.5} />
                      <span className="text-xs mt-3 uppercase tracking-wider font-medium opacity-60">
                        Servicio ILP
                      </span>
                    </div>
                  )}
                  {/* Overlay oscuro suave al hover */}
                  <div className="absolute inset-0 bg-[#232755]/0 group-hover:bg-[#232755]/10 transition-colors" />
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-[#232755] mb-3 group-hover:text-[#ed9b19] transition-colors leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 mb-6 line-clamp-3 leading-relaxed text-sm">
                    {service.short_description}
                  </p>
                  
                  <div className="mt-auto flex items-center text-[#ed9b19] font-bold text-sm">
                    Más Información 
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}