import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { signOut } from "@/app/(admin)/login/actions" // Asegúrate de importar tu acción de cerrar sesión
import { ShieldAlert, LogOut } from "lucide-react"
import AdminNavbar from "@/components/admin-navbar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // 1. Verificamos si hay usuario
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect("/login")
  }

  // 2. Verificamos el ROL en la base de datos
  // Usamos maybeSingle() por si el perfil no existe aún
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  const userRole = profile?.role || "sin-rol"

  // 3. EL CAMBIO CLAVE: Si no es admin, NO redirigimos.
  // Mostramos una pantalla de bloqueo (403 Forbidden)
  if (userRole !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border-t-4 border-red-500">
          
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-red-600" />
          </div>

          <h1 className="text-2xl font-black text-[#232755] mb-2">
            Acceso Restringido
          </h1>
          
          <p className="text-gray-500 mb-6">
            Hola <strong>{user.email}</strong>. Tu cuenta tiene el rol de <span className="font-bold text-red-500 uppercase">{userRole}</span>, pero esta sección es exclusiva para <strong>ADMINISTRADORES</strong>.
          </p>

          <div className="space-y-3">
            {/* Botón para Cerrar Sesión y probar otra cuenta */}
            <form action={signOut}>
              <button className="w-full flex items-center justify-center gap-2 bg-[#232755] text-white py-3 px-4 rounded-xl font-bold hover:bg-[#1a1d40] transition-colors">
                <LogOut size={18} />
                Cerrar Sesión y Cambiar Cuenta
              </button>
            </form>

            <a 
              href="/" 
              className="block w-full text-gray-500 py-2 text-sm hover:text-[#232755] underline"
            >
              Volver a la Página Principal
            </a>
          </div>
        </div>
      </div>
    )
  }

  // 4. Si es Admin, renderizamos el panel normalmente
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 2. AQUÍ VA TU NAVBAR RECUPERADO */}
      <AdminNavbar userEmail={user.email || "Admin"} />

      {/* 3. El contenido de las páginas (Dashboard, Products, etc.) se renderiza aquí */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}