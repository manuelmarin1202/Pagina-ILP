"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { FileText, Calendar, DollarSign, User, ExternalLink, Search, Loader2 } from "lucide-react"
import Link from "next/link"

export default function HistorialCotizacionesPage() {
  const supabase = createClient()
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchQuotes()
  }, [])

  const fetchQuotes = async () => {
    setLoading(true)
    // Traemos todo ordenado por FECHA (created_at) descendente (lo más nuevo arriba)
    const { data, error } = await supabase
      .from('quotations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) console.error(error)
    else setQuotes(data || [])
    setLoading(false)
  }

  // Filtrado simple por cliente o numero
  const filteredQuotes = quotes.filter(q => 
    q.client_name.toLowerCase().includes(search.toLowerCase()) ||
    q.quotation_number.toLowerCase().includes(search.toLowerCase())
  )

  // Formateador de moneda
  const formatMoney = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: currency }).format(amount)
  }

  // Formateador de fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="p-8 max-w-7xl mx-auto pb-32">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#232755]">Historial de Cotizaciones</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona y revisa todas las propuestas enviadas.</p>
        </div>
        <Link href="/admin/cotizador">
          <button className="bg-[#ed9b19] text-white px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-colors shadow-sm">
            + Nueva Cotización
          </button>
        </Link>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          <input 
            className="w-full border p-2 pl-10 rounded-lg text-sm outline-none focus:border-[#232755]" 
            placeholder="Buscar por Cliente o N° Cotización..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLA DE RESULTADOS */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#232755]" /></div>
        ) : filteredQuotes.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No se encontraron cotizaciones.</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-bold border-b">
              <tr>
                <th className="p-4">N° Cotización</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Fecha</th>
                <th className="p-4 text-right">Total (Inc. IGV)</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredQuotes.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-[#232755] flex items-center gap-2">
                    <FileText size={16} className="text-gray-400"/> {q.quotation_number}
                  </td>
                  <td className="p-4">
                    <div className="font-bold">{q.client_name}</div>
                    <div className="text-xs text-gray-400">{q.client_ruc || "Sin RUC"}</div>
                  </td>
                  <td className="p-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14}/> {formatDate(q.created_at)}
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-[#232755]">
                    {formatMoney(q.total_amount, q.currency)}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold 
                      ${q.status === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-700' : 
                        q.status === 'ACEPTADA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <a 
                      href={q.pdf_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#232755] hover:text-[#ed9b19] font-bold text-xs border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 transition-all"
                    >
                      <ExternalLink size={12} /> Ver PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}