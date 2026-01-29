"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { FileText, Phone, ArrowRight, Home } from "lucide-react" // Agregué el icono Home por si te gusta

// URL BASE DEL STORAGE (Ajústala si tu proyecto es diferente, pero suele ser esta)
const STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catalog/`

export function ProductClient({ product, variants }: { product: any, variants: any[] }) {
  const [selectedVariant, setSelectedVariant] = useState(variants[0])

  // Lógica Robusta de Imagen:
  // 1. Si la variante seleccionada tiene imagen propia -> Úsala.
  // 2. Si no, usa la imagen principal del producto.
  // 3. Concatenamos con la URL base de Supabase.
  const imagePath = selectedVariant?.image_path || product.image_path
  const fullImageUrl = imagePath ? `${STORAGE_URL}${imagePath}` : "/images/placeholder.jpg"

  const specs = selectedVariant?.technical_specs || []

  return (
    <div className="bg-white pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-4">
        
        {/* --- BREADCRUMB (MIGA DE PAN) MEJORADO --- */}
        <nav className="mb-8 text-sm text-gray-500 flex items-center gap-2">
          
          {/* Enlace al Catálogo General */}
          <Link 
            href="/catalogo" 
            className="hover:text-[#ed9b19] hover:underline transition-colors flex items-center gap-1"
          >
            <Home size={14} /> Catálogo
          </Link>
          
          <ArrowRight size={12} className="text-gray-300" />
          
          {/* (Opcional) Si tu producto tiene el nombre de la categoría disponible, podrías ponerlo aquí */}
          {/* <Link href={`/catalogo?categoria=${product.category_slug}`} className="hover:text-[#ed9b19]">
              {product.category_name}
            </Link> 
            <ArrowRight size={12} className="text-gray-300" />
          */}

          {/* Producto Actual (No es link porque ya estás aquí) */}
          <span className="text-[#232755] font-bold truncate max-w-[200px] md:max-w-none">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* --- COLUMNA IZQUIERDA: VISOR DE IMAGEN --- */}
          <div>
            <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden mb-6 border border-gray-100 shadow-sm group">
              {/* LA IMAGEN CORREGIDA */}
              <Image 
                src={fullImageUrl} 
                alt={`${product.name} - ${selectedVariant?.model_code || ''}`}
                fill
                className="object-contain p-8 transition-all duration-500 group-hover:scale-105"
                priority
              />
            </div>
          </div>

          {/* --- COLUMNA DERECHA: INFO Y COMPRA --- */}
          <div>
            <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-[#232755] font-bold text-xs uppercase tracking-wider mb-4 border border-blue-100">
              {product.category}
            </span>
            
            <h1 className="text-4xl md:text-5xl font-black text-[#232755] mb-4 leading-tight">
              {product.name}
            </h1>
            
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* --- SELECTOR DE MODELOS --- */}
            {variants.length > 0 && (
              <div className="bg-white border-2 border-gray-100 p-6 rounded-2xl mb-8 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-[#232755]">Selecciona un Modelo:</h3>
                  {selectedVariant?.datasheet_path && (
                    <a 
                      href={`${STORAGE_URL}${selectedVariant.datasheet_path}`} 
                      target="_blank"
                      className="text-xs font-bold text-red-600 flex items-center gap-1 hover:underline"
                    >
                      <FileText size={14} /> Ficha Técnica
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border-2 ${
                        selectedVariant.id === variant.id
                          ? "bg-[#232755] text-white border-[#232755] shadow-md transform scale-105"
                          : "bg-gray-50 text-gray-500 border-transparent hover:border-gray-300"
                      }`}
                    >
                      {variant.capacity || variant.model_code}
                    </button>
                  ))}
                </div>

                {/* --- FICHA TÉCNICA DINÁMICA --- */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <div className="flex items-baseline gap-2 mb-4 border-b border-gray-200 pb-2">
                    <span className="text-xs text-gray-400 uppercase font-bold">Modelo:</span>
                    <span className="text-xl font-black text-[#232755]">{selectedVariant.model_code}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                    {Array.isArray(specs) && specs.map((spec: any, idx: number) => (
                      <div key={idx} className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase font-bold">{spec.key}</span>
                        <span className="text-sm font-medium text-gray-700">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* --- CTA WHATSAPP --- */}
            <a 
              href={`https://wa.me/51938231707?text=Hola, estoy interesado en el equipo: ${product.name} (Modelo: ${selectedVariant?.model_code})`}
              target="_blank"
              className="group w-full bg-[#ed9b19] hover:bg-yellow-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-3 text-lg"
            >
              <Phone className="w-6 h-6 transition-transform group-hover:rotate-12" /> 
              <span>Cotizar este Modelo</span>
            </a>
            
            

          </div>
        </div>
      </div>
    </div>
  )
}