import { createClient } from "@/utils/supabase/server"
import Image from "next/image"
import { HeroButtons } from "./hero-buttons" // Importamos el componente que creamos arriba
import { FajaCalculator } from "@/components/faja-calculator" // <--- IMPORTAMOS
import { FajaCatalogGrid } from "@/components/faja-catalog-grid" // <--- NUEVO
import { 
  CheckCircle2, 
  Leaf, 
  ShieldCheck, 
  Timer, 
  Truck,
  Warehouse,
  Factory,
  Ruler, // Para medidas
  Repeat // Para vida útil
} from "lucide-react"

export default async function FajaPage() {
  const supabase = await createClient()

  // 1. OBTENER VIDEO DE SUPABASE
  const videoUrl = supabase.storage.from("catalog").getPublicUrl("demo-faja.mp4").data.publicUrl
  const posterUrl = supabase.storage.from("catalog").getPublicUrl("poster-faja.jpg").data.publicUrl

  const { data: variants } = await supabase
    .from("product_variants")
    .select(`
      id,
      capacity,
      price,
      technical_specs,
      products!inner(slug)
    `)
    .eq("products.slug", "faja-reutilizable-ecologica")
    .order("price", { ascending: true })

  

  return (
    <div className="bg-white">
      
      {/* --- 1. HERO SECTION --- */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#232755]/90 to-[#232755]/60 z-10" />
        <div className="absolute inset-0 z-0">
            <Image 
                src="/images/faja-hero.jpg" 
                alt="Faja Reutilizable ILP en Almacén"
                fill
                className="object-cover"
                priority
            />
        </div>

        <div className="relative z-20 container mx-auto px-4 text-center text-white pt-20">
          <div className="inline-flex items-center gap-2 bg-[#ed9b19] text-[#232755] px-4 py-2 md:px-6 md:py-2 rounded-full mb-8 animate-fade-in-up font-bold shadow-lg shadow-orange-500/20 max-w-full">
            <span className="text-xl">🏆</span>
            <span className="text-xs md:text-sm tracking-wide text-left md:text-center">Ganador Startup Perú 2024: Innovación Cambio Climático</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black mb-6 leading-tight">
            El Fin del <span className="text-green-400">Stretch Film</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
            Ahorra un <strong>84%</strong> en costos de embalaje y reduce toneladas de residuos plásticos con nuestra tecnología patentada.
          </p>

          {/* Usamos el componente cliente aquí */}
          <HeroButtons />
        </div>
      </section>

      {/* --- 2. PAÍSES (Estático, Grande y Responsive) --- */}
      <section className="py-16 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[#232755] opacity-60 text-sm font-bold uppercase tracking-widest mb-10">
            Confianza Internacional: Envíos a todo Latinoamérica
          </p>
          
          {/* Grid Flex Wrap para que se acomoden en móvil */}
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <CountryFlag code="pe" name="Perú" />
            <CountryFlag code="cl" name="Chile" />
            <CountryFlag code="ar" name="Argentina" />
            <CountryFlag code="co" name="Colombia" />
            <CountryFlag code="ec" name="Ecuador" />
            <CountryFlag code="mx" name="México" />
            <CountryFlag code="bo" name="Bolivia" />
            <CountryFlag code="br" name="Brasil" />
          </div>
        </div>
      </section>

      {/* --- 3. VIDEO DEMOSTRACIÓN --- */}
      <section id="video-demo" className="py-24 bg-white scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <span className="text-green-600 font-bold tracking-widest text-sm uppercase mb-2 block">
                Tecnología en Acción
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#232755] mb-6">
                Instalación en menos de 45 segundos
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Olvídate de operarios mareados dando vueltas al pallet. Nuestra faja se instala rápido, asegura mejor la carga y se retira en segundos sin generar ni un gramo de basura.
              </p>
              
              <div className="space-y-6">
                <FeatureRow title="Mayor Estabilidad" desc="Cintas rígidas y velcro industrial para carga segura." />
                <FeatureRow title="Cero Herramientas" desc="No necesitas máquinas ni aplicadores especiales." />
                <FeatureRow title="Vida Útil Extrema" desc="Hasta 600 usos por unidad (aprox. 3 años)." />
              </div>
            </div>

            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-100 bg-black aspect-video group">
                <video 
                  src={videoUrl}
                  controls 
                  preload="metadata"
                  className="w-full h-full object-cover"
                  poster={posterUrl} 
                >
                  Tu navegador no soporta videos.
                </video>
              </div>
              <p className="text-center text-xs text-gray-400 mt-4 italic">
                *Demostración real de resistencia y facilidad de uso.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECCIÓN COMPARATIVA CON CALCULADORA REAL */}
      <section className="py-20 bg-gray-50" id="calculadora">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
             <h2 className="text-3xl font-bold text-[#232755]">Calcula tu Retorno de Inversión</h2>
             <p className="text-gray-500">Selecciona el modelo que te interesa y mira cuánto ahorrarás.</p>
          </div>

          {/* AQUÍ RENDERIZAMOS LA CALCULADORA */}
          {variants && variants.length > 0 ? (
            <FajaCalculator variants={variants} />
          ) : (
            <p className="text-center text-red-500">Cargando datos de precios...</p>
          )}

        </div>
      </section>

      {/* SECCIÓN MODELOS (Grid Inteligente con Agrupación) */}
      <section className="py-24 bg-white" id="modelos">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-green-600 font-bold tracking-widest text-sm uppercase">Catálogo Técnico</span>
            <h2 className="text-3xl md:text-5xl font-black text-[#232755] mt-2">Modelos Disponibles</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
              Selecciona la medida exacta para tu operación. Los precios varían según las dimensiones.
            </p>
          </div>

          {/* AQUÍ ESTÁ EL CAMBIO IMPORTANTE */}
          {variants && <FajaCatalogGrid variants={variants} />}
          
        </div>
      </section>

      {/* --- 5. SOLUCIONES POR INDUSTRIA --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#232755] mb-12">Soluciones por Industria</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <IndustryCard 
              icon={<Leaf className="w-10 h-10 text-green-600" />}
              title="Industria Alimentaria"
              desc="Ideal para productos perecederos. La malla permite ventilación y evita la condensación que genera el plástico."
            />
            <IndustryCard 
              icon={<Warehouse className="w-10 h-10 text-[#ed9b19]" />}
              title="Centros de Distribución"
              desc="Perfecto para picking. Permite abrir y cerrar el pallet parcialmente sin romper el embalaje."
            />
            <IndustryCard 
              icon={<Truck className="w-10 h-10 text-blue-600" />}
              title="Transporte de Contenedores"
              desc="Evita el 'efecto dominó'. Asegura la carga para viajes largos y movimientos bruscos."
            />
          </div>
        </div>
      </section>

      {/* --- 6. INSTALACIÓN (Pasos) --- */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#232755] mb-16">Instalación en 3 Pasos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-1 bg-gray-200 -z-10" />

            <StepCard 
              number="1" 
              title="Prepara la Carga" 
              desc="Asegúrate que la mercancía esté apilada ordenadamente y sin objetos sueltos." 
            />
            <StepCard 
              number="2" 
              title="Coloca y Ajusta" 
              desc="Envuelve la carga con la faja y tensa las correas de velcro hasta que esté firme." 
            />
            <StepCard 
              number="3" 
              title="Verifica" 
              desc="Comprueba la estabilidad antes del transporte. ¡Listo en menos de 1 minuto!" 
            />
          </div>
        </div>
      </section>

      {/* --- 7. GUÍA DE MANTENIMIENTO (FONDO BLANCO PARA SEPARAR DEL FOOTER) --- */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#232755] mb-4">Guía de Mantenimiento y Cuidados</h2>
            <p className="text-gray-500">Sigue estos consejos simples para maximizar la vida útil de tus fajas.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-[#232755] mb-4 flex items-center gap-2 text-lg">
                <ShieldCheck className="w-6 h-6 text-[#ed9b19]" /> Almacenamiento
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Evita la exposición prolongada a luz solar directa cuando no estén en uso. Mantenlas en un lugar seco, lejos de humedad extrema o químicos corrosivos que puedan degradar la tela.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-[#232755] mb-4 flex items-center gap-2 text-lg">
                <Timer className="w-6 h-6 text-[#ed9b19]" /> Revisión Periódica
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Recomendamos una inspección visual rápida de las costuras y el estado del velcro cada 50 usos. Esto asegura que la tensión máxima se mantenga para proteger tus cargas.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow md:col-span-2">
              <h3 className="font-bold text-[#232755] mb-4 flex items-center gap-2 text-lg">
                <Factory className="w-6 h-6 text-[#ed9b19]" /> Capacitación del Personal
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                El sistema es intuitivo, pero ofrecemos una capacitación gratuita virtual de 15 minutos para enseñar a tu equipo la técnica correcta de tensión y cuidado, garantizando la seguridad operativa.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

// --- SUBCOMPONENTES ---

// Bandera Circular Grande
function CountryFlag({ code, name }: { code: string, name: string }) {
  return (
    <div className="flex flex-col items-center gap-4 group cursor-default">
      <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-md border-4 border-white ring-1 ring-gray-200 group-hover:scale-110 transition-transform duration-300 bg-white">
        <img 
          src={`https://flagcdn.com/w160/${code}.png`} 
          alt={`Bandera de ${name}`} 
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-sm font-bold text-[#232755] uppercase tracking-wider">
        {name}
      </span>
    </div>
  )
}

function FeatureRow({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 flex-shrink-0">
        <CheckCircle2 className="w-6 h-6 text-green-500" />
      </div>
      <div>
        <h4 className="font-bold text-[#232755]">{title}</h4>
        <p className="text-sm text-gray-500 leading-snug">{desc}</p>
      </div>
    </div>
  )
}

function IndustryCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 group">
      <div className="mb-6 bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#232755] mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

function StepCard({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 text-center relative z-10 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-[#232755] text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 border-4 border-white shadow-lg">
        {number}
      </div>
      <h3 className="font-bold text-lg text-[#232755] mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  )
}