import Link from "next/link"

export function Hero() {
  return (
    // CAMBIO 1: 'min-h-[85vh] h-auto' permite que crezca si el texto baja
    <section className="relative w-full min-h-[85vh] h-auto flex items-center justify-center bg-[#232755] text-white overflow-hidden">
      
      {/* FONDO */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#232755] via-[#232755]/90 to-transparent z-10" />
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop')" }}
      />

      {/* CONTENIDO */}
      {/* CAMBIO 2: 'pt-40' para bajarlo del navbar y 'pb-24' para que no se corte abajo */}
      <div className="relative z-20 container mx-auto px-4 flex flex-col justify-center h-full pt-40 pb-24">
        <div className="max-w-3xl animate-fade-in-up">
          <span className="inline-block py-1 px-3 rounded-full bg-[#ed9b19]/20 border border-[#ed9b19] text-[#ed9b19] text-sm font-bold tracking-wide mb-6">
            LÍDERES EN LOGÍSTICA INDUSTRIAL
          </span>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
            Soluciones Integrales de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ed9b19] to-yellow-200">
              Carga y Descarga
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
            Optimizamos tu operación con rampas móviles, montacargas de alto rendimiento y servicios de maquila especializada. Distribuidores oficiales de <strong>PlusForce</strong>.
          </p>
          
          
        </div>
      </div>
    </section>
  )
}