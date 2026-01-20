import { createClient } from "@/utils/supabase/server"
import Image from "next/image"
import { notFound } from "next/navigation"
import { CheckCircle2, Phone } from "lucide-react"

const STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catalog/`

type Props = { params: Promise<{ slug: string }> }

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: service } = await supabase.from("services").select("*").eq("slug", slug).single()
  
  if (!service) return notFound()

  // Parsear Features (JSON)
  const features = Array.isArray(service.features) ? service.features : []

  return (
    <div className="bg-white pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* HERO SECTION DEL SERVICIO */}
        <div className="relative h-[400px] rounded-3xl overflow-hidden mb-12 shadow-2xl">
          {service.image_path && (
            <Image 
              src={`${STORAGE_URL}${service.image_path}`} 
              alt={service.title} 
              fill 
              className="object-cover"
              priority 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#232755] via-[#232755]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white max-w-3xl">
            <span className="bg-[#ed9b19] text-[#232755] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
              Servicio Especializado
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-4">{service.title}</h1>
            <p className="text-xl text-gray-200">{service.short_description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* COLUMNA IZQUIERDA: CONTENIDO */}
          <div className="lg:col-span-2 space-y-8">
            <div className="prose prose-lg text-gray-600 max-w-none">
              <h3 className="text-[#232755] font-bold text-2xl mb-4">Descripción del Servicio</h3>
              {/* Renderizado simple de texto con saltos de línea */}
              {service.full_content?.split('\n').map((paragraph: string, i: number) => (
                <p key={i} className="mb-4 leading-relaxed">{paragraph}</p>
              ))}
            </div>

            {/* GRILLA DE BENEFICIOS */}
            {features.length > 0 && (
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 mt-8">
                <h3 className="text-[#232755] font-bold text-xl mb-6">¿Qué incluye este servicio?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feat: string, idx: number) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                      <span className="text-gray-700 font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: CTA FLOTANTE */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-[#232755] text-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold mb-4">¿Interesado?</h3>
              <p className="text-blue-200 mb-8 leading-relaxed">
                Nuestros especialistas están listos para brindarte una cotización o visita técnica personalizada.
              </p>
              
              <a 
                href={`https://wa.me/51938231707?text=Hola, me interesa información sobre el servicio de: ${service.title}`}
                target="_blank"
                className="block w-full bg-[#ed9b19] hover:bg-yellow-600 text-white font-bold py-4 rounded-xl text-center transition-colors mb-4 flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" /> Cotizar por WhatsApp
              </a>
              
              
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}