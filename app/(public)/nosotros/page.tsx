import Image from "next/image"
import Link from "next/link"
import { Target, Users, Lightbulb, TrendingUp, MapPin, Wrench } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="bg-white">
      
      {/* 1. HERO: LA ESENCIA 
         NOTA TÉCNICA: Agregamos 'pt-32' para que el Navbar fijo no tape el título en Desktop,
         y ajustamos la altura para que se vea bien la foto del equipo.
      */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[#232755]/85 z-10" />
        <div className="absolute inset-0 z-0">
            {/* FOTO 1: TU FOTO DE TODO EL PERSONAL (Gerencia + Operarios + Maquila) */}
            <Image 
                src="/images/equipo-ilp-completo.jpeg" 
                alt="Equipo completo de ILP Soluciones"
                fill
                className="object-cover"
                priority
            />
        </div>
        
        <div className="relative z-20 container mx-auto px-4 text-center">
          <span className="text-[#ed9b19] font-bold tracking-widest uppercase text-sm mb-4 block animate-fade-in-up">
            Nuestra Identidad
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight max-w-5xl mx-auto">
            Solidez Operativa & <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ed9b19] to-yellow-200">
              Evolución Logística
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Somos el equilibrio entre la maquinaria que mueve tu negocio hoy y la innovación que lo hará sostenible mañana.
          </p>
        </div>
      </section>

      {/* 2. LA HISTORIA (TIMELINE) - ARREGLADO PARA MÓVIL */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            
            {/* COLUMNA IZQUIERDA: Texto Intro (Ahora fluye normal en móvil) */}
            <div className="w-full lg:w-1/3 lg:sticky lg:top-32">
              <h2 className="text-3xl font-bold text-[#232755] mb-6">De la Tradición a la Innovación</h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                ILP nació en el terreno, entendiendo los "fierros" y la mecánica. Esa experiencia nos dio la autoridad para identificar problemas reales y crear soluciones propias.
              </p>
              
              {/* Cita de Gerencia - Diseño mejorado */}
              <div className="p-6 bg-white rounded-xl border-l-4 border-[#ed9b19] shadow-md relative">
                <span className="absolute top-4 right-4 text-6xl text-gray-100 font-serif leading-none -z-10">”</span>
                <p className="text-[#232755] font-medium italic relative z-10">
                  "No dejamos de vender potencia, simplemente le agregamos inteligencia y conciencia ambiental a la ecuación."
                </p>
                <div className="mt-4 flex items-center gap-3">
                   <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                      {/* Opcional: Foto pequeña del gerente o logo */}
                      <Image src="/logo-ilp.png" alt="Gerencia" width={40} height={40} className="object-cover" />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-gray-900">Gerencia General</p>
                      <p className="text-xs text-gray-500">ILP Soluciones</p>
                   </div>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: Línea de Tiempo */}
            <div className="w-full lg:w-2/3 border-l-2 border-gray-200 pl-6 md:pl-12 space-y-12 py-4">
              
              <TimelineItem 
                year="2020"
                title="El Origen Técnico"
                desc="Fundación de ILP con un enfoque 100% operativo: Mantenimiento, venta y alquiler de equipos de movimiento de carga."
                icon={<Wrench className="w-5 h-5 text-white" />}
              />
              
              <TimelineItem 
                year="2021"
                title="Consolidación en BSF"
                desc="Mudanza estratégica al clúster logístico más importante del país (Punta Hermosa), gestionando operaciones de alto volumen."
                icon={<MapPin className="w-5 h-5 text-white" />}
              />

              <TimelineItem 
                year="2023"
                title="Ingeniería Propia"
                desc="Nuestro equipo detecta el desperdicio masivo de plástico en los clientes. Nace el proyecto de la Faja Reutilizable."
                icon={<Lightbulb className="w-5 h-5 text-white" />}
              />

              <TimelineItem 
                year="2024"
                title="Reconocimiento Startup Perú"
                desc="Validación nacional. Ganamos el concurso de 'Emprendimientos Innovadores frente al Cambio Climático' de ProInnóvate."
                highlight
                icon={<Target className="w-5 h-5 text-white" />}
              />

              <TimelineItem 
                year="Hoy"
                title="Soluciones Integrales"
                desc="Ofrecemos el paquete completo: Maquinaria tradicional potente + Soluciones de embalaje sostenible."
                icon={<TrendingUp className="w-5 h-5 text-white" />}
              />

            </div>
          </div>
        </div>
      </section>

      {/* 3. NUESTRO EQUIPO (FOTOS REALES) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#232755]">El Motor de ILP</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              Un equipo directivo y técnico que combina experiencia en ingeniería con una visión moderna de la logística.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Foto Grande: Operaciones */}
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl group">
              {/* FOTO 2: TU FOTO DEL GRUPO DE OPERACIONES EN EL ALMACÉN (DETRÁS DE CÁMARA) */}
              <Image 
                src="/images/equipo-operaciones.jpeg" 
                alt="Equipo de Operaciones ILP"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Equipo Central & Ingeniería</h3>
                <p className="text-gray-300">
                  El núcleo que planifica, diseña y asegura la calidad de cada solución que entregamos.
                </p>
              </div>
            </div>

            {/* Grid de Valores / Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:border-[#232755]/20 transition-colors">
                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-[#232755]">
                   <Users className="w-6 h-6" />
                 </div>
                 <h4 className="font-bold text-[#232755] mb-2">Trato Humano</h4>
                 <p className="text-sm text-gray-600">Somos una empresa familiar profesionalizada. Hablas con personas, no con bots.</p>
               </div>

               <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:border-[#232755]/20 transition-colors">
                 <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 text-[#ed9b19]">
                   <Wrench className="w-6 h-6" />
                 </div>
                 <h4 className="font-bold text-[#232755] mb-2">Soporte Real</h4>
                 <p className="text-sm text-gray-600">Taller propio en BSF. Si un equipo falla, estamos ahí para solucionarlo.</p>
               </div>

               <div className="bg-[#232755] p-8 rounded-xl text-white col-span-1 sm:col-span-2 flex flex-col justify-center text-center sm:text-left">
                 <h3 className="text-xl font-bold mb-2">¿Quieres formar parte?</h3>
                 <p className="text-blue-200 text-sm mb-6">
                   Siempre buscamos talento con ganas de innovar en logística.
                 </p>
                 <Link 
                   href="https://www.linkedin.com/in/manuelmarinleonardo/" 
                   target="_blank"
                   className="inline-block bg-[#ed9b19] hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors self-center sm:self-start"
                 >
                   Ver en LinkedIn
                 </Link>
               </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

// --- COMPONENTES ---

function TimelineItem({ year, title, desc, highlight = false, icon }: { year: string, title: string, desc: string, highlight?: boolean, icon: any }) {
  return (
    <div className="relative pl-8 md:pl-12 group">
      {/* Icono en el punto */}
      <div className={`absolute -left-[22px] md:-left-[22px] top-0 w-11 h-11 rounded-full flex items-center justify-center border-4 border-gray-50 z-10 transition-transform group-hover:scale-110 ${highlight ? 'bg-green-500 shadow-lg shadow-green-500/30' : 'bg-[#232755]'}`}>
        {icon}
      </div>
      
      <div className={`p-6 rounded-xl border transition-all ${highlight ? 'bg-white border-green-200 shadow-md' : 'bg-transparent border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm'}`}>
        <span className={`text-sm font-bold tracking-wider mb-1 block ${highlight ? 'text-green-600' : 'text-gray-400'}`}>
          {year}
        </span>
        <h3 className="text-xl font-bold text-[#232755] mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}