"use client"

import { useState, useMemo } from "react"
import { Calculator, TrendingDown, Leaf, AlertCircle } from "lucide-react"

interface Variant {
  id: string
  capacity: string // Nombre visible (Ej: Faja 12m)
  price: number
  technical_specs: { key: string; value: string }[]
}

export function FajaCalculator({ variants }: { variants: Variant[] }) {
  // Estados del usuario
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id || "")
  const [palletsPerMonth, setPalletsPerMonth] = useState(100)
  
  // Constantes de mercado (Stretch Film)
  const FILM_COST_PER_PALLET = 2.10 // Dato del estudio
  const FILM_WASTE_KG = 0.4 // Kg de plástico por pallet (aprox)

  // Cálculos en tiempo real
  const calculations = useMemo(() => {
    const variant = variants.find(v => v.id === selectedVariantId)
    if (!variant) return null

    // Extraer vida útil de los specs (string "600" -> number 600)
    const lifespanSpec = variant.technical_specs.find(s => s.key === "Vida Útil")
    const lifespan = lifespanSpec ? parseInt(lifespanSpec.value) : 600
    
    // Costo Mensual usando STRETCH FILM
    const monthlyCostFilm = palletsPerMonth * FILM_COST_PER_PALLET
    
    // Costo Mensual usando FAJA ILP
    // Fórmula: (Precio Faja / Vida Útil) * Pallets Movidos
    const costPerUseFaja = variant.price / lifespan
    const monthlyCostFaja = palletsPerMonth * costPerUseFaja

    // Ahorro
    const monthlySavings = monthlyCostFilm - monthlyCostFaja
    const yearlySavings = monthlySavings * 12
    const plasticSaved = palletsPerMonth * FILM_WASTE_KG * 12 // Kg al año

    return {
      variant,
      lifespan,
      monthlyCostFilm,
      monthlyCostFaja,
      monthlySavings,
      yearlySavings,
      plasticSaved
    }
  }, [selectedVariantId, palletsPerMonth, variants])

  if (!calculations) return null

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-[#232755] p-6 text-white flex items-center gap-3">
        <Calculator className="text-[#ed9b19]" />
        <h3 className="font-bold text-xl">Calculadora de Ahorro Real</h3>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* COLUMNA 1: CONTROLES */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Selecciona tu Modelo:</label>
            <select 
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ed9b19] outline-none transition-all font-medium text-[#232755]"
            >
              {variants.map(v => (
                <option key={v.id} value={v.id}>
                  {v.capacity} - S/ {v.price} (Vida útil: {v.technical_specs.find(s=>s.key==="Vida Útil")?.value} usos)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Pallets despachados por mes: <span className="text-[#ed9b19] text-lg">{palletsPerMonth}</span>
            </label>
            <input 
              type="range" 
              min="50" 
              max="2000" 
              step="50"
              value={palletsPerMonth}
              onChange={(e) => setPalletsPerMonth(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#232755]"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>50 pallets</span>
              <span>2,000 pallets</span>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              *Comparativa basada en costo promedio de mercado del Stretch Film (S/ 2.10 x pallet) vs el costo amortizado de la faja ILP seleccionada.
            </p>
          </div>
        </div>

        {/* COLUMNA 2: RESULTADOS */}
        <div className="bg-gray-50 rounded-2xl p-6 flex flex-col justify-center space-y-6">
          
          {/* Gasto Actual */}
          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <span className="text-gray-500 font-medium">Gasto actual (Plástico):</span>
            <span className="text-xl font-bold text-red-400">S/ {calculations.monthlyCostFilm.toFixed(2)} / mes</span>
          </div>

          {/* Gasto ILP */}
          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <span className="text-gray-500 font-medium">Inversión amortizada ILP:</span>
            <span className="text-xl font-bold text-[#232755]">S/ {calculations.monthlyCostFaja.toFixed(2)} / mes</span>
          </div>

          {/* AHORRO ANUAL (El dato impactante) */}
          <div className="bg-green-100 p-5 rounded-xl text-center border border-green-200">
            <p className="text-green-700 text-sm font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-2">
              <TrendingDown size={18} /> Tu Ahorro Anual Proyectado
            </p>
            <p className="text-4xl md:text-5xl font-black text-green-600">
              S/ {calculations.yearlySavings.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* IMPACTO ECOLÓGICO */}
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <Leaf className="w-4 h-4 text-green-500" />
            <span>Evitarás <strong>{calculations.plasticSaved.toFixed(0)} kg</strong> de basura plástica al año.</span>
          </div>

        </div>
      </div>
    </div>
  )
}