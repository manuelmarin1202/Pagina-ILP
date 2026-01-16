import { createClient } from "@/utils/supabase/server"

export async function Showroom() {
  const supabase = await createClient()
  
  // Asegúrate de que el nombre del archivo en Supabase coincida
  const videoUrl = supabase.storage.from("catalog").getPublicUrl("showroom-loop.mp4").data.publicUrl
  const posterUrl = supabase.storage.from("catalog").getPublicUrl("showroom-poster.jpg").data.publicUrl

  return (
    <section className="py-24 bg-white overflow-hidden relative" id="showroom">
      
      {/* Fondo decorativo geométrico (Sutil) */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50 skew-x-12 translate-x-20 z-0" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* IZQUIERDA: Video Circular */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
              
              {/* Borde giratorio decorativo (Naranja ILP) */}
              <div className="absolute inset-0 rounded-full border border-dashed border-[#ed9b19] animate-spin-slow opacity-30" />
              
              {/* MÁSCARA CIRCULAR PRINCIPAL */}
              <div className="absolute inset-4 rounded-full overflow-hidden shadow-2xl border-4 border-white bg-black z-10">
                
                {/* VIDEO 1920x1080 AJUSTADO:
                   'object-cover': Recorta los lados sobrantes y centra la acción.
                   'w-full h-full': Fuerza al video a llenar el círculo.
                */}
                <video 
                  src={videoUrl}
                  poster={posterUrl} 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  className="w-full h-full object-cover scale-105" 
                />
                
                {/* Filtro oscuro muy leve para mejorar contraste de los bordes */}
                <div className="absolute inset-0 bg-black/5 pointer-events-none" />
              </div>

              

            </div>
          </div>

          {/* DERECHA: Textos (Igual que antes) */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
             <span className="text-[#ed9b19] font-bold tracking-widest uppercase text-sm mb-2 block">
              Experiencia en Vivo
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#232755] mb-6">
              Showroom Logístico ILP
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
              No te quedes con la duda. Te invitamos a nuestra jornada de puertas abiertas para ver operar nuestras rampas y montacargas en tiempo real.
            </p>
            
             <div className="bg-gray-50 border border-gray-100 p-8 rounded-2xl inline-block w-full max-w-md shadow-sm">
              <ul className="space-y-4">
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#232755] flex items-center justify-center text-white font-bold text-lg">📅</div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 uppercase font-bold">Cuándo</p>
                    <p className="font-bold text-[#232755]">Todos los Viernes</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#232755] flex items-center justify-center text-white font-bold text-lg">⏰</div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 uppercase font-bold">Horario</p>
                    <p className="font-bold text-[#232755]">11:00 am - 3:00 pm</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#232755] flex items-center justify-center text-white font-bold text-lg">📍</div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 uppercase font-bold">Dónde</p>
                    <p className="font-bold text-[#232755] leading-tight">BSF Almacenes del Perú<br/><span className="text-sm font-normal text-gray-500">Punta Hermosa, Pabellón I, Puerta 55</span></p>
                  </div>
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <a 
                  href="https://forms.gle/tu-link-formulario" 
                  target="_blank"
                  className="block w-full bg-[#232755] hover:bg-blue-900 text-white font-bold py-3 rounded-lg transition-colors text-center shadow-md hover:shadow-lg"
                >
                  Registrar mi visita gratis
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}