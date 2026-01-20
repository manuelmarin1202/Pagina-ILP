import Link from "next/link"
import { Package, Users, BarChart } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-black text-ilp-blue mb-2">Panel de Control</h1>
      <p className="text-gray-500 mb-12">Bienvenido al sistema de gestión de ILP Soluciones.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* TARJETA PRODUCTOS */}
        <Link href="/admin/products" className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-[#ed9b19] transition-all">
          <div className="w-14 h-14 bg-blue-50 text-[#232755] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#232755] group-hover:text-white transition-colors">
            <Package size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Productos</h2>
          <p className="text-gray-500">Gestionar catálogo, precios y fichas técnicas.</p>
        </Link>

        {/* TARJETA SERVICIOS */}
        <Link href="/admin/services" className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-[#ed9b19] transition-all">
          <div className="w-14 h-14 bg-green-50 text-[#232755] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#232755] group-hover:text-white transition-colors">
            <Package size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Servicios</h2>
          <p className="text-gray-500">Administrar servicios y sus características.</p>
        </Link>

        {/* TARJETA CLIENTES */}
        <Link href="/admin/clients" className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-[#ed9b19] transition-all">
          <div className="w-14 h-14 bg-orange-50 text-[#ed9b19] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#ed9b19] group-hover:text-white transition-colors">
            <Users size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Clientes</h2>
          <p className="text-gray-500">Administrar logos y testimonios destacados.</p>
        </Link>

        {/* TARJETA WEB (Ir al sitio) */}
        <Link href="/" target="_blank" className="group bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:bg-white hover:shadow-lg transition-all">
          <div className="w-14 h-14 bg-white border border-gray-200 text-gray-400 rounded-xl flex items-center justify-center mb-6">
            <BarChart size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ver Sitio Web</h2>
          <p className="text-gray-500">Ir a la página pública en vivo.</p>
        </Link>

      </div>
    </div>
  )
}