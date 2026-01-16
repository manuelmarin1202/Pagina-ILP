"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, Phone } from "lucide-react" // Usamos iconos de lucide para mejor estética

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  
  const isHome = pathname === "/"
  // Si estamos en Home y arriba: transparente. Si no: azul sólido.
  const isTransparent = isHome && !isScrolled

  useEffect(() => {
    const handleScroll = () => {
      // Activamos el efecto "scrolled" un poco antes (10px) para que sea fluido
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isTransparent 
            ? "bg-transparent py-4 md:py-6" // Grande y transparente al inicio
            : "bg-[#232755]/95 backdrop-blur-md shadow-md py-3" // Compacto y sólido al bajar
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          
          {/* --- LOGO ELÁSTICO --- */}
          <Link href="/" className="relative z-50">
            <div 
              className={`relative transition-all duration-300 ease-in-out ${
                // MÓVIL: Siempre tamaño controlado (h-10 = 40px)
                // ESCRITORIO: Grande al inicio (h-16 = 64px), Pequeño al scroll (h-12 = 48px)
                isScrolled ? "h-9 w-32 md:h-12 md:w-44" : "h-10 w-36 md:h-16 md:w-60"
              }`}
            >
              <Image 
                src="/logo-ilp.png" 
                alt="ILP Soluciones"
                fill
                className="object-contain brightness-0 invert object-left" 
                priority
              />
            </div>
          </Link>

          {/* --- MENÚ DE ESCRITORIO --- */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {[
              { name: "Inicio", path: "/" },
              { name: "Faja Ecológica 🌱", path: "/faja-reutilizable", special: true },
              { name: "Catálogo", path: "/catalogo" },
              { name: "Servicios", path: "/servicios" },
            ].map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors tracking-wide ${
                  link.special 
                    ? "text-green-400 hover:text-green-300 font-bold bg-white/10 px-3 py-1.5 rounded-full" 
                    : "hover:text-[#ed9b19] " + (isTransparent ? "text-white/90" : "text-white/80")
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* --- CTA ESCRITORIO --- */}
          <div className="hidden md:block">
            <a
              href="https://wa.me/51938231707"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-bold py-2.5 px-6 rounded-full transition-all hover:scale-105 shadow-md flex items-center gap-2 ${
                 isTransparent 
                   ? "bg-white text-[#232755] hover:bg-gray-100"
                   : "bg-[#ed9b19] text-white hover:bg-yellow-600"
              }`}
            >
              <Phone className="w-4 h-4" /> Cotizar
            </a>
          </div>

          {/* --- BOTÓN MÓVIL (HAMBURGER) --- */}
          <button
            className="md:hidden text-white p-2 focus:outline-none z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menú"
          >
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </header>

      {/* --- MENÚ MÓVIL (FULL SCREEN OVERLAY) --- 
          Usamos fixed inset-0 para que cubra toda la pantalla y no empuje el contenido.
      */}
      <div 
        className={`fixed inset-0 bg-[#232755] z-40 flex flex-col items-center justify-center transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Fondo decorativo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ed9b19] rounded-full blur-[100px] opacity-10 pointer-events-none" />

        <nav className="flex flex-col items-center gap-8 text-xl font-bold text-white relative z-10">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Inicio</Link>
          <Link href="/faja-reutilizable" onClick={() => setIsMobileMenuOpen(false)} className="text-green-400">Faja Ecológica</Link>
          <Link href="/catalogo" onClick={() => setIsMobileMenuOpen(false)}>Catálogo</Link>
          <Link href="/servicios" onClick={() => setIsMobileMenuOpen(false)}>Servicios</Link>
          
          <div className="w-12 h-1 bg-white/10 rounded-full my-4" />
          
          <a
            href="https://wa.me/51938231707"
            target="_blank"
            className="bg-[#ed9b19] text-white px-8 py-3 rounded-full flex items-center gap-2"
          >
            <Phone className="w-5 h-5" /> Hablar por WhatsApp
          </a>
        </nav>
      </div>
    </>
  )
}