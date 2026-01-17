import { Hero } from "@/components/Hero"
import { Clients } from "@/components/Clients"
import { Services } from "@/components/Services" // La versión nueva con iconos
import { FeaturedProducts } from "@/components/FeaturedProducts" // El componente nuevo
import { Showroom } from "@/components/Showroom"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* 1. PORTADA */}
      <Hero /> 
      
      {/* 2. VALIDACIÓN SOCIAL (Carrusel) */}
      <Clients />
      
      {/* 3. CATEGORÍAS DE NEGOCIO (Estático) */}
      <Services />

      {/* 4. PRODUCTOS DESTACADOS (Dinámico desde BD) */}
      <FeaturedProducts />
      
      {/* 5. EXPERIENCIA Y CIERRE */}
      <Showroom />
    </main>
  )
}