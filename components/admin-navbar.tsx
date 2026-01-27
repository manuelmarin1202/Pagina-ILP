"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, LogOut } from "lucide-react" // Asegúrate de tener lucide-react instalado

// Recibimos la acción de cerrar sesión como prop o la importamos si es server action pura
import { signOut } from "@/app/(admin)/login/actions" // Ajusta la ruta a tus actions reales

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Productos" },
  { href: "/admin/services", label: "Servicios" },
  { href: "/admin/clients", label: "Clientes" },
  { href: "/admin/cotizador", label: "Cotizador" },
  { href: "/admin/cotizaciones", label: "Cotizaciones" },
]

export default function AdminNavbar({ userEmail }: { userEmail: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/admin" && pathname === "/admin") return true
    if (path !== "/admin" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav className="bg-[#232755] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO */}
          <div className="flex-shrink-0">
            <Link href="/admin">
              <div className="relative w-24 h-8">
                <Image 
                  src="/logo-ilp.png" // Asegúrate que esta ruta sea correcta
                  alt="ILP" 
                  fill 
                  className="object-contain brightness-0 invert" 
                />
              </div>
            </Link>
          </div>

          {/* DESKTOP MENU (Hidden on mobile) */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-[#ed9b19] text-white"
                      : "hover:bg-white/10 text-gray-300"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* USER & LOGOUT (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-xs text-gray-300">{userEmail}</span>
            <form action={signOut}>
              <button className="p-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <LogOut size={14} />
                Salir
              </button>
            </form>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU (Slide down) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1a1d40] border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.href)
                    ? "bg-[#ed9b19] text-white"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Logout */}
            <div className="border-t border-gray-600 mt-4 pt-4 pb-2">
              <div className="flex items-center px-3 mb-3">
                <div className="text-sm font-medium text-gray-400">{userEmail}</div>
              </div>
              <form action={signOut} className="px-3">
                <button className="w-full text-left flex items-center gap-2 text-red-400 hover:text-red-300 font-medium">
                  <LogOut size={16} />
                  Cerrar Sesión
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}