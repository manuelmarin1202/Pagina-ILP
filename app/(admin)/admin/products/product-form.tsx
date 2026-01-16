"use client"

import { useState } from "react"
import { createProduct, updateProduct } from "./actions"
import Image from "next/image"

export function ProductForm({ categories, initialData }: { categories: any[], initialData?: any }) {
  const [loading, setLoading] = useState(false)

  // 1. PREPARAR LAS ESPECIFICACIONES (JSON -> ARRAY)
  // Si estamos editando, convertimos el objeto JSON { "Peso": "10kg" } 
  // en un array para el formulario [{ key: "Peso", value: "10kg" }]
  const initialSpecs = initialData?.specs 
    ? Object.entries(initialData.specs).map(([key, value]) => ({ key, value: value as string }))
    : [{ key: "", value: "" }]

  const [specs, setSpecs] = useState(initialSpecs)

  // 2. PREPARAR LA IMAGEN
  // Si estamos editando, mostramos la imagen que viene de la BD
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.imageUrl || null
  )

  // --- MANEJADORES DE ESTADO ---

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const addSpec = () => setSpecs([...specs, { key: "", value: "" }])

  const updateSpec = (index: number, field: "key" | "value", text: string) => {
    const newSpecs = [...specs]
    newSpecs[index][field] = text
    setSpecs(newSpecs)
  }

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index))
  }

  // --- ENVÍO DEL FORMULARIO ---

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    // Convertir el array de specs de vuelta a objeto JSON para guardarlo en Supabase
    const specsObject = specs.reduce((acc, curr) => {
      if (curr.key) acc[curr.key] = curr.value
      return acc
    }, {} as Record<string, string>)
    
    formData.set("specs", JSON.stringify(specsObject))

    try {
      if (initialData) {
        // MODO EDICIÓN: Pasamos el ID para actualizar
        await updateProduct(initialData.id, formData)
      } else {
        // MODO CREACIÓN: Creamos uno nuevo
        await createProduct(formData)
      }
    } catch (error) {
      alert("Ocurrió un error al guardar. Revisa la consola.")
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      
      {/* 1. INFORMACIÓN BÁSICA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Producto</label>
          <input 
            name="name" 
            required 
            placeholder="Ej: Rampa Móvil 10T" 
            defaultValue={initialData?.name} // <--- VITAL PARA EDICIÓN
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#232755] outline-none" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Slug (URL)</label>
          <input 
            name="slug" 
            required 
            placeholder="Ej: rampa-movil-10t" 
            defaultValue={initialData?.slug} // <--- VITAL PARA EDICIÓN
            className="w-full p-3 border rounded-lg bg-gray-50 text-gray-600 outline-none" 
          />
          <p className="text-xs text-gray-400 mt-1">Debe ser único y sin espacios (usa guiones).</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Categoría</label>
          <select 
            name="category_id" 
            required 
            defaultValue={initialData?.category_id || ""} // <--- VITAL PARA EDICIÓN
            className="w-full p-3 border rounded-lg bg-white outline-none"
          >
            <option value="">Selecciona una categoría...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center pt-8">
          <input 
            type="checkbox" 
            name="is_featured" 
            id="is_featured" 
            defaultChecked={initialData?.is_featured} // <--- VITAL PARA EDICIÓN
            className="w-5 h-5 accent-[#ed9b19] rounded cursor-pointer" 
          />
          <label htmlFor="is_featured" className="ml-2 text-sm font-bold text-gray-700 cursor-pointer">¿Producto Destacado?</label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Descripción Corta</label>
        <textarea 
          name="description" 
          rows={3} 
          className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#232755]" 
          placeholder="Resumen para SEO..."
          defaultValue={initialData?.description} // <--- VITAL PARA EDICIÓN
        ></textarea>
      </div>

      {/* 2. ESPECIFICACIONES TÉCNICAS (DINÁMICO) */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#232755]">Especificaciones Técnicas</h3>
          <button type="button" onClick={addSpec} className="text-sm text-[#ed9b19] font-bold hover:underline">+ Agregar Campo</button>
        </div>
        
        <div className="space-y-3">
          {specs.map((spec, index) => (
            <div key={index} className="flex gap-4">
              <input 
                placeholder="Característica (Ej: Capacidad)" 
                value={spec.key}
                onChange={(e) => updateSpec(index, "key", e.target.value)}
                className="flex-1 p-2 border rounded focus:border-[#ed9b19] outline-none"
              />
              <input 
                placeholder="Valor (Ej: 10 Toneladas)" 
                value={spec.value}
                onChange={(e) => updateSpec(index, "value", e.target.value)}
                className="flex-1 p-2 border rounded focus:border-[#ed9b19] outline-none"
              />
              <button type="button" onClick={() => removeSpec(index)} className="text-red-500 hover:text-red-700 px-2 font-bold">✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. IMAGEN */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Imagen Principal</label>
        <input 
          type="file" 
          name="image" 
          accept="image/*" 
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />
        
        {previewUrl && (
            <div className="mt-4 relative w-40 h-40 border rounded-lg overflow-hidden bg-gray-100">
                <Image 
                src={previewUrl} 
                alt="Preview" 
                fill 
                className="object-cover" 
                // Como el contenedor es pequeño (w-40), le decimos que la imagen es pequeña
                sizes="160px" 
                />
            </div>
        )}
      </div>

      {/* BOTÓN SUBMIT */}
      <div className="pt-4">
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#232755] hover:bg-blue-900 text-white font-bold py-4 rounded-lg transition-colors disabled:opacity-50 shadow-md"
        >
          {loading ? "Guardando..." : (initialData ? "Actualizar Producto" : "Crear Producto")}
        </button>
      </div>
    </form>
  )
}