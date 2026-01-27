import { login } from "./actions"
import Image from "next/image"

// 1. Convertimos la función en 'async'
export default async function LoginPage({
  searchParams,
}: {
  // 2. Definimos el tipo como una Promesa
  searchParams: Promise<{ message?: string }>
}) {
  // 3. Esperamos (await) a que los parámetros estén listos antes de usarlos
  const { message } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        
        {/* Logo */}
        <div className="flex justify-center">
          <div className="relative w-32 h-12">
            <Image 
              src="/logo-ilp.png" 
              alt="ILP Soluciones" 
              fill 
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-[#232755]">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Acceso administrativo y operativo
          </p>
        </div>

        {/* Formulario */}
        <form className="mt-8 space-y-6" action={login}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#ed9b19] focus:border-[#ed9b19] focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#ed9b19] focus:border-[#ed9b19] focus:z-10 sm:text-sm"
                placeholder="Contraseña"
              />
            </div>
          </div>

          {/* MENS AJE DE ERROR (Aquí estaba el fallo) */}
          {message && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md text-center border border-red-200">
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#232755] hover:bg-[#1a1d40] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed9b19] transition-colors"
            >
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}