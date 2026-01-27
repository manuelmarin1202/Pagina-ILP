"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, Phone, FileDown } from "lucide-react" 

// URL DEL PDF EN STORAGE (Ajusta la ruta si está en una subcarpeta)
const PDF_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catalog/catalogo-ilp-2026.pdf`

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  
  const isHome = pathname === "/"
  const isTransparent = isHome && !isScrolled

  useEffect(() => {
    const handleScroll = () => {
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
            ? "bg-transparent py-4 md:py-6" 
            : "bg-[#232755]/95 backdrop-blur-md shadow-md py-3"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center">
          
          {/* --- COLUMNA 1: LOGO (flex-1 para empujar) --- */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="relative z-50">
              <div 
                className={`relative transition-all duration-300 ease-in-out ${
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
          </div>

          {/* --- COLUMNA 2: MENÚ (Centrado absoluto gracias a los flex-1 de los lados) --- */}
          {/* Quitamos 'Inicio' para limpiar el menú */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 flex-none">
            {[
              { name: "Faja Reutilizable", path: "/faja-reutilizable", special: false},
              { name: "Equipos", path: "/catalogo" },
              { name: "Servicios", path: "/servicios" },
              { name: "Nosotros", path: "/nosotros" },
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

          {/* --- COLUMNA 3: CTA + PDF (flex-1 para empujar al final) --- */}
          <div className="flex-1 flex justify-end items-center gap-3">
            
            {/* Botón PDF (Solo icono en escritorio) */}
            <a 
              href={PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden md:flex items-center justify-center w-10 h-10 rounded-full border transition-all hover:scale-105 group ${
                isTransparent 
                  ? "border-white/30 text-white hover:bg-white hover:text-[#232755]" 
                  : "border-white/20 text-white/80 hover:bg-[#ed9b19] hover:text-white hover:border-[#ed9b19]"
              }`}
              title="Descargar Catálogo 2026 PDF"
            >
              <FileDown className="w-5 h-5" />
            </a>

            {/* Botón Cotizar */}
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

            {/* Hamburger Móvil */}
            <button
              className="md:hidden text-white p-2 focus:outline-none z-50 ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menú"
            >
              {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>

        </div>
      </header>

      {/* --- MENÚ MÓVIL --- */}
      <div 
        className={`fixed inset-0 bg-[#232755] z-40 flex flex-col items-center justify-center transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ed9b19] rounded-full blur-[100px] opacity-10 pointer-events-none" />

        <nav className="flex flex-col items-center gap-6 text-xl font-bold text-white relative z-10">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Inicio</Link>
          <Link href="/faja-reutilizable" onClick={() => setIsMobileMenuOpen(false)} className="text-green-400">Faja Ecológica</Link>
          <Link href="/catalogo" onClick={() => setIsMobileMenuOpen(false)}>Catálogo Web</Link>
          <Link href="/servicios" onClick={() => setIsMobileMenuOpen(false)}>Servicios</Link>
          <Link href="/nosotros" onClick={() => setIsMobileMenuOpen(false)}>Nosotros</Link>
          
          <div className="w-16 h-1 bg-white/10 rounded-full my-4" />
          
          {/* PDF en Móvil (Botón con texto) */}
          <a
             href={PDF_URL}
             target="_blank"
             className="text-gray-300 text-sm flex items-center gap-2 border border-white/20 px-6 py-2 rounded-full hover:bg-white/10"
          >
            <FileDown className="w-4 h-4" /> Descargar PDF 2026
          </a>

          <a
            href="https://wa.me/51938231707"
            target="_blank"
            className="bg-[#ed9b19] text-white px-8 py-3 rounded-full flex items-center gap-2 mt-2 shadow-lg"
          >
            <Phone className="w-5 h-5" /> Hablar por WhatsApp
          </a>
        </nav>
      </div>
    </>
  )
}