import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Wrench } from "lucide-react"

const STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catalog/`

export default async function ServicesPage() {
  const supabase = await createClient()
  const { data: services } = await supabase.from("services").select("*").order("created_at", { ascending: true })

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-16">
          <span className="text-[#ed9b19] font-bold tracking-widest uppercase text-sm">Nuestros Servicios</span>
          <h1 className="text-4xl md:text-5xl font-black text-[#232755] mt-2">Soluciones Integrales</h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Más allá de la venta, somos tu socio estratégico en el mantenimiento y gestión de tu flota.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service) => (
            <Link 
              key={service.id} 
              href={`/servicios/${service.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
            >
              <div className="relative h-56 bg-gray-200 overflow-hidden">
                {service.image_path ? (
                  <Image src={`${STORAGE_URL}${service.image_path}`} alt={service.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400"><Wrench size={40}/></div>
                )}
                <div className="absolute inset-0 bg-[#232755]/20 group-hover:bg-[#232755]/0 transition-colors" />
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-[#232755] mb-3 group-hover:text-[#ed9b19] transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-500 mb-6 line-clamp-3 leading-relaxed">
                  {service.short_description}
                </p>
                <div className="mt-auto flex items-center text-[#ed9b19] font-bold text-sm">
                  Más Información <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}