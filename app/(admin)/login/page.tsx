import { login } from "./actions"
import Image from "next/image"

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        
        {/* Encabezado */}
        <div className="text-center">
          <div className="relative w-32 h-10 mx-auto mb-4">
             {/* Aquí usamos el logo normal (a color) porque el fondo es blanco */}
             <Image 
               src="/logo-ilp.png" 
               alt="ILP Admin" 
               fill 
               className="object-contain" 
             />
          </div>
          <h2 className="text-2xl font-bold text-[#232755]">Acceso Administrativo</h2>
          <p className="text-sm text-gray-500 mt-2">Ingresa tus credenciales para gestionar el catálogo.</p>
        </div>

        {/* Formulario */}
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#ed9b19] focus:border-[#ed9b19] focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#ed9b19] focus:border-[#ed9b19] focus:z-10 sm:text-sm"
                placeholder="Contraseña"
              />
            </div>
          </div>

          {searchParams?.message && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md text-center">
              {searchParams.message}
            </div>
          )}

          <button
            formAction={login} // Conectamos con la Server Action
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-[#232755] hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#232755] transition-colors"
          >
            Ingresar al Panel
          </button>
        </form>
      </div>
    </div>
  )
}