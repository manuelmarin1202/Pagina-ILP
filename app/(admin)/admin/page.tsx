import Link from "next/link"
import { Package, Users, BarChart, FileText, Calculator, ExternalLink } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-[#232755] mb-2">Panel de Control</h1>
        <p className="text-gray-500">Bienvenido al sistema de gestión de ILP.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* TARJETA PRODUCTOS */}
        <Link href="/admin/products" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-[#ed9b19] transition-all">
          <div className="w-12 h-12 bg-blue-50 text-[#232755] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#232755] group-hover:text-white transition-colors">
            <Package size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Productos</h2>
          <p className="text-sm text-gray-500">Gestionar catálogo.</p>
        </Link>

        {/* TARJETA SERVICIOS */}
        <Link href="/admin/services" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-[#ed9b19] transition-all">
          <div className="w-12 h-12 bg-green-50 text-[#232755] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#232755] group-hover:text-white transition-colors">
            <FileText size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Servicios</h2>
          <p className="text-sm text-gray-500">Administrar servicios ofrecidos.</p>
        </Link>

        {/* TARJETA CLIENTES */}
        <Link href="/admin/clients" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-[#ed9b19] transition-all">
          <div className="w-12 h-12 bg-orange-50 text-[#ed9b19] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#ed9b19] group-hover:text-white transition-colors">
            <Users size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Clientes</h2>
          <p className="text-sm text-gray-500">Logos y nombres.</p>
        </Link>

        {/* TARJETA COTIZADOR */}
        <Link href="/admin/cotizador" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-[#ed9b19] transition-all">
          <div className="w-12 h-12 bg-pink-50 text-[#ed9b19] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#ed9b19] group-hover:text-white transition-colors">
            <Calculator size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Cotizador</h2>
          <p className="text-sm text-gray-500">Configurar precios base.</p>
        </Link>
        
        {/* TARJETA COTIZACIONES (NUEVO) */}
        <Link href="/admin/cotizaciones" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-[#ed9b19] transition-all">
          <div className="w-12 h-12 bg-purple-50 text-[#232755] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#232755] group-hover:text-white transition-colors">
            <FileText size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Cotizaciones</h2>
          <p className="text-sm text-gray-500">Ver cotizaciones realizadas.</p>
        </Link>

        {/* TARJETA WEB */}
        <Link href="/" target="_blank" className="group bg-gray-100 p-6 rounded-2xl border border-gray-200 hover:bg-white hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-white border border-gray-200 text-gray-400 rounded-xl flex items-center justify-center mb-4">
            <ExternalLink size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Ver Sitio Web</h2>
          <p className="text-sm text-gray-500">Ir a la página pública.</p>
        </Link>

      </div>
    </div>
  )
}