"use client"

import { useState } from "react"
import { Ruler, Repeat, Factory, CheckCircle2, Phone } from "lucide-react"

interface Variant {
  id: string
  capacity: string
  price: number
  technical_specs: { key: string; value: string }[]
}

export function FajaCatalogGrid({ variants }: { variants: Variant[] }) {
  // 1. Agrupar las variantes por "Grupo" (Faja, Cinturón, Cobertor)
  // Usamos un objeto donde la llave es el nombre del grupo y el valor es un array de variantes
  const groupedVariants = variants.reduce((acc, variant) => {
    const groupName = variant.technical_specs.find(s => s.key === "Grupo")?.value || "Otros"
    if (!acc[groupName]) acc[groupName] = []
    acc[groupName].push(variant)
    return acc
  }, {} as Record<string, Variant[]>)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {Object.entries(groupedVariants).map(([groupName, groupItems]) => (
        <FajaCard key={groupName} groupName={groupName} variants={groupItems} />
      ))}
    </div>
  )
}

// Subcomponente de Tarjeta individual que maneja su propio estado de precio
function FajaCard({ groupName, variants }: { groupName: string, variants: Variant[] }) {
  // Por defecto seleccionamos la primera variante del grupo (la más pequeña/barata)
  const [selectedVariant, setSelectedVariant] = useState(variants[0])

  // Extraer specs para mostrar
  const vidaUtil = selectedVariant.technical_specs.find(s => s.key === "Vida Útil")?.value
  const tipoCarga = selectedVariant.technical_specs.find(s => s.key === "Tipo Carga")?.value
  const componentes = selectedVariant.technical_specs.find(s => s.key === "Componentes")?.value

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
      {/* Header Card */}
      <div className="bg-[#232755] p-6 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-[#ed9b19] rounded-full blur-2xl opacity-20" />
        <h3 className="text-2xl font-bold mb-1">{groupName}</h3>
        <p className="text-xs text-gray-300 uppercase tracking-wider">{tipoCarga}</p>
      </div>

      {/* Body Card */}
      <div className="p-8 flex-1 flex flex-col">
        
        {/* Precio Dinámico */}
        <div className="text-center mb-6 pb-6 border-b border-gray-100 min-h-[100px] flex flex-col justify-center">
          <p className="text-gray-400 text-xs uppercase font-bold mb-1">Precio Unitario</p>
          <div className="flex items-center justify-center gap-1 text-[#232755]">
            <span className="text-2xl font-bold">S/</span>
            {/* key={selectedVariant.id} hace una pequeña animación cuando cambia el número */}
            <span key={selectedVariant.id} className="text-5xl font-black animate-in fade-in zoom-in duration-300">
              {selectedVariant.price}
            </span>
            <span className="text-sm text-gray-400 self-end mb-2">.00 + IGV</span>
          </div>
          <p className="text-xs text-green-600 mt-2 font-medium bg-green-50 inline-block mx-auto px-2 py-1 rounded-md">
            Costo por uso: S/ {(selectedVariant.price / Number(vidaUtil)).toFixed(2)}
          </p>
        </div>

        {/* Selector de Medidas (Pills) */}
        <div className="mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-1">
            <Ruler size={14} /> Selecciona Medida:
          </p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
               // Extraemos solo la medida numérica para el botón (ej: "12.00 x 0.47 m")
               const medida = v.technical_specs.find(s => s.key === "Medidas")?.value || "Estándar"
               const isSelected = selectedVariant.id === v.id
               
               return (
                 <button
                   key={v.id}
                   onClick={() => setSelectedVariant(v)}
                   className={`px-3 py-2 text-xs rounded-lg border transition-all duration-200 font-medium ${
                     isSelected 
                       ? "bg-[#232755] text-white border-[#232755] shadow-md transform scale-105" 
                       : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#ed9b19] hover:text-[#232755]"
                   }`}
                 >
                   {medida}
                 </button>
               )
            })}
          </div>
        </div>

        {/* Specs List */}
        <ul className="space-y-4 mb-8 flex-1">
          <li className="flex items-center gap-3">
            <Repeat className="w-5 h-5 text-green-500 shrink-0" />
            <div>
              <span className="font-bold text-[#232755] text-sm">Vida Útil:</span>
              <span className="text-gray-600 text-sm ml-2">{vidaUtil} usos</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Factory className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
            <div>
              <span className="font-bold text-[#232755] block text-sm">Materiales:</span>
              <span className="text-xs text-gray-500 leading-tight block mt-1">{componentes}</span>
            </div>
          </li>
        </ul>

        {/* CTA */}
        <a 
          href={`https://wa.me/51938231707?text=Hola, me interesa el modelo *${selectedVariant.capacity}* de precio S/${selectedVariant.price}`}
          target="_blank"
          className="w-full flex items-center justify-center gap-2 bg-[#ed9b19] hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-orange-500/20"
        >
          <Phone size={18} /> Cotizar {selectedVariant.capacity}
        </a>
      </div>
    </div>
  )
}