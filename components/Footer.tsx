import Link from "next/link"
import Image from "next/image"
import { 
  MapPin, 
  Warehouse, // Icono genérico de Lucide
  ArrowRight,
  Mail,
  Phone
} from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  // Datos reales
  const mapLinkOficina = "https://maps.app.goo.gl/gu4ZFghvbh7B4ahCA"
  const mapLinkAlmacen = "https://maps.app.goo.gl/gu4ZFghvbh7B4ahCA"
  const whatsappNumber = "51938231707"
  const whatsappMessage = "Hola ILP, quisiera una cotización."
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <footer className="bg-[#1a1d40] text-gray-300 pt-16 pb-8 mt-auto border-t-[6px] border-[#ed9b19]">
      <div className="container mx-auto px-4">
        
        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
          
          {/* 1. IDENTIDAD (4 columnas) */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link href="/" className="relative w-56 h-30 mb-6 hover:opacity-90 transition-opacity">
              <Image 
                src="/logo-ilp.png" 
                alt="ILP Soluciones Logística"
                fill
                className="object-contain brightness-0 invert" 
              />
            </Link>
            
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Más de 4 años elevando el estándar de la logística en Perú. Almacenamiento, transporte y gestión de activos con precisión y seguridad.
            </p>

            {/* REDES SOCIALES (SVG Puros para evitar errores) */}
            <div className="flex gap-4">
              <SocialIcon 
                href="https://www.facebook.com/ingenierialogistica.peru?locale=es_LA" 
                label="Facebook"
                path="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" 
              />
              <SocialIcon 
                href="https://www.linkedin.com/in/manuelmarinleonardo/" 
                label="LinkedIn"
                path="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M2 4a2 2 0 1 1 2 2 2 2 0 0 1-2-2z" 
              />
              <SocialIcon 
                href="https://www.youtube.com/@solucioneslogisticas1974" 
                label="YouTube"
                path="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z M9.75 15.02V8.5l5.75 3.26z" 
              />
            </div>
          </div>

          {/* 2. NAVEGACIÓN (3 columnas) */}
          <div className="lg:col-span-3 lg:pl-10 text-center lg:text-left">
            <h4 className="text-white font-bold text-lg mb-6">Navegación</h4>
            <ul className="space-y-3 text-sm">
              
              <FooterLink href="/faja-reutilizable" text="Faja Reutilizable" />
              <FooterLink href="/catalogo" text="Catálogo de Equipos" />
              <FooterLink href="/servicios" text="Servicios Logísticos" />
              <FooterLink href="/nosotros" text="Nosotros" />
              
              {/* Enlace a WhatsApp directo */}
              <li>
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center lg:justify-start gap-2 text-[#ed9b19] font-bold hover:text-white transition-colors group"
                >
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  Solicitar Cotización
                </a>
              </li>
              
              {/* Enlace discreto a Admin */}
              <li className="pt-4">
                <Link href="/login" className="text-xs text-gray-500 hover:text-gray-300 flex items-center justify-center lg:justify-start gap-2">
                  🔐 Acceso Corporativo
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. SEDES (5 columnas) */}
          <div className="lg:col-span-5">
            <h4 className="text-white font-bold text-lg mb-6 text-center lg:text-left">
              Nuestras Sedes
            </h4>
            
            <div className="flex flex-col gap-4">
              
              {/* OFICINA (Con datos de contacto integrados) */}
              <div className="group bg-white/5 p-5 rounded-xl border border-white/10 hover:border-[#ed9b19] transition-all">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Icono */}
                  <div className="hidden md:flex flex-shrink-0 w-10 h-10 bg-[#ed9b19]/10 items-center justify-center rounded-lg text-[#ed9b19] group-hover:bg-[#ed9b19] group-hover:text-[#232755] transition-colors">
                    <MapPin size={20} />
                  </div>
                  
                  {/* Contenido */}
                  <div className="flex-1 text-center md:text-left">
                    <h5 className="text-white font-bold mb-1">Oficina Administrativa</h5>
                    <a 
                      href={mapLinkOficina} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-[#ed9b19] transition-colors block mb-3"
                    >
                      Calle Sibelius 148 Of. 102, San Borja, Lima
                    </a>

                    {/* Contacto Integrado aquí (Más limpio) */}
                    <div className="flex flex-col md:flex-row gap-4 pt-3 border-t border-white/10 text-sm">
                      <a href="mailto:ventas@ilpsolucioneslogistica.com.pe" className="flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-white">
                        <Mail size={14} className="text-[#ed9b19]" />
                        ventas@ilpsolucioneslogistica.com.pe
                      </a>
                      <a href={`tel:+${whatsappNumber}`} className="flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-white">
                        <Phone size={14} className="text-[#ed9b19]" />
                        +51 938 231 707
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* ALMACÉN */}
              <a 
                href={mapLinkAlmacen}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/5 p-4 rounded-xl border border-white/10 hover:border-[#ed9b19] hover:bg-white/10 transition-all flex flex-col md:flex-row gap-4 items-center md:items-start"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-[#ed9b19]/10 flex items-center justify-center rounded-lg text-[#ed9b19] group-hover:bg-[#ed9b19] group-hover:text-[#232755] transition-colors">
                  <Warehouse size={20} />
                </div>
                <div className="text-center md:text-left">
                  <h5 className="text-white font-bold mb-1">Centro de Operaciones</h5>
                  <p className="text-sm text-gray-400 group-hover:text-white transition-colors">
                    BSF Almacenes del Perú, Panamericana Sur Km. 38<br/>
                    Pabellón I, Puerta 55, Punta Hermosa
                  </p>
                </div>
              </a>

            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {currentYear} ILP Soluciones Logística S.A.C.</p>
          <div className="flex gap-6">
             {/* Estos links funcionarán cuando crees las páginas, por ahora van al home o puedes crear la carpeta */}
            <Link href="/privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link>
            <Link href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

// --- SUBCOMPONENTES ---

// Componente para iconos SVG puros (Sin librerías externas)
function SocialIcon({ href, path, label }: { href: string, path: string, label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#ed9b19] hover:text-[#232755] transition-all hover:-translate-y-1"
    >
      <svg 
        viewBox="0 0 24 24" 
        width="20" 
        height="20" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d={path} />
      </svg>
    </a>
  )
}

function FooterLink({ href, text }: { href: string, text: string }) {
  return (
    <li>
      <Link 
        href={href} 
        className="flex items-center justify-center lg:justify-start gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#ed9b19]" />
        {text}
      </Link>
    </li>
  )
}