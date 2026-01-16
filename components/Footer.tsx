import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail, Linkedin, Youtube } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#232755] text-white pt-16 pb-8 mt-auto border-t-4 border-[#ed9b19]">
      <div className="container mx-auto px-4">
        
        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 mb-12 text-center md:text-left">
          
          {/* 1. IDENTIDAD */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="block relative w-40 h-16 mb-4">
              <Image 
                src="/logo-ilp.png" 
                alt="ILP"
                fill
                className="object-contain brightness-0 invert" 
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Soluciones logísticas integrales. Elevando el estándar de almacenamiento y transporte en Perú desde 2020.
            </p>
            <div className="flex gap-4">
              <SocialIcon href="https://linkedin.com" icon={<Linkedin className="w-5 h-5" />} label="LinkedIn" />
              <SocialIcon href="https://youtube.com" icon={<Youtube className="w-5 h-5" />} label="YouTube" />
            </div>
          </div>

          {/* 2. LINKS RÁPIDOS */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white border-b border-white/10 pb-2 inline-block md:block">Navegación</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/" className="hover:text-[#ed9b19] transition-colors">Inicio</Link></li>
              <li><Link href="/catalogo" className="hover:text-[#ed9b19] transition-colors">Catálogo de Productos</Link></li>
              <li><Link href="/faja-reutilizable" className="text-green-400 hover:text-green-300 font-bold transition-colors">Faja Ecológica</Link></li>
              <li><Link href="/servicios" className="hover:text-[#ed9b19] transition-colors">Mantenimiento y Alquiler</Link></li>
            </ul>
          </div>

          {/* 3. CONTACTO (Compacto) */}
          <div className="md:col-span-2 lg:col-span-2">
            <h4 className="text-lg font-bold mb-6 text-white border-b border-white/10 pb-2 inline-block md:block">Nuestras Sedes</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
              {/* Oficina */}
              <div className="bg-white/5 p-4 rounded-lg">
                <h5 className="font-bold text-[#ed9b19] mb-2 flex items-center justify-center md:justify-start gap-2">
                  <MapPin className="w-4 h-4" /> Oficina San Borja
                </h5>
                <p>Calle Sibelius 148 Of. 102</p>
                <p>San Borja, Lima - Perú</p>
                <a href="tel:+51938231707" className="mt-3 block hover:text-white font-medium flex items-center justify-center md:justify-start gap-2">
                  <Phone className="w-4 h-4" /> +51 938 231 707
                </a>
              </div>

              {/* Almacén */}
              <div className="bg-white/5 p-4 rounded-lg">
                <h5 className="font-bold text-[#ed9b19] mb-2 flex items-center justify-center md:justify-start gap-2">
                  <WarehouseIcon /> Almacén BSF
                </h5>
                <p>Panamericana Sur Km. 38</p>
                <p>Pabellón I, Puerta 55</p>
                <p>Punta Hermosa</p>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {currentYear} ILP Soluciones Logística S.A.C. - RUC: 20601234567</p>
          
        </div>
      </div>
    </footer>
  )
}

// Subcomponente simple para iconos sociales
function SocialIcon({ href, icon, label }: { href: string, icon: any, label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      aria-label={label}
      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ed9b19] hover:text-[#232755] transition-all hover:scale-110"
    >
      {icon}
    </a>
  )
}

function WarehouseIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 21v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8" />
      <path d="M13 10V3L2 12h3v9" />
      <path d="M22 21v-9h-9" />
    </svg>
  )
}