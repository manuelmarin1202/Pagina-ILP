import { createClient } from "@/utils/supabase/server"
import { signOut } from "./actions" // Asegúrate de que esta acción exista (la creamos antes)
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Verificamos sesión aquí (Protección extra)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* --- NAVBAR COMPARTIDO --- */}
      <nav className="bg-[#232755] text-white px-6 py-4 flex flex-col md:flex-row justify-between items-center shadow-md sticky top-0 z-50">
        
        {/* Logo y Título */}
        <div className="flex items-center gap-6 mb-4 md:mb-0">
           
           <Link href="/admin">
            <div className="relative w-24 h-8">
              <Image src="/logo-ilp.png" alt="ILP" fill className="object-contain brightness-0 invert" />
            </div>
           </Link>
           {/* MENÚ DE NAVEGACIÓN (Pestañas) */}
           <div className="flex gap-1 bg-black/20 p-1 rounded-lg">
             <Link 
               href="/admin/products" 
               className="px-4 py-1.5 rounded-md text-sm font-medium hover:bg-white/10 transition-colors focus:bg-[#ed9b19]"
             >
               Productos
             </Link>
             <Link 
               href="/admin/services" 
               className="px-4 py-1.5 rounded-md text-sm font-medium hover:bg-white/10 transition-colors focus:bg-[#ed9b19]"
             >
               Servicios
             </Link>
             <Link 
               href="/admin/clients" 
               className="px-4 py-1.5 rounded-md text-sm font-medium hover:bg-white/10 transition-colors focus:bg-[#ed9b19]"
             >
               Clientes
             </Link>
             
           </div>
        </div>
        
        {/* Usuario y Salir */}
        <div className="flex items-center gap-4">
          <span className="text-xs opacity-70 hidden md:inline">{user.email}</span>
          <form action={signOut}>
            <button className="text-xs bg-red-600 hover:bg-red-700 px-3 py-2 rounded font-bold transition-colors uppercase tracking-wider">
              Cerrar Sesión
            </button>
          </form>
        </div>
      </nav>

      {/* AQUÍ SE RENDERIZA LA PÁGINA (Productos o Clientes) */}
      <main>
        {children}
      </main>
    </div>
  )
}