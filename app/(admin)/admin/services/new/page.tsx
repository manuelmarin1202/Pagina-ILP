"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Plus, Trash2, Save, Image as ImageIcon, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function NewServicePage() {
  const supabase = createClient()
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // ESTADOS
  const [title, setTitle] = useState("")
  const [shortDesc, setShortDesc] = useState("")
  const [fullContent, setFullContent] = useState("")
  const [imagePath, setImagePath] = useState<string | null>(null)
  
  // FEATURES (Lista de strings)
  const [features, setFeatures] = useState<string[]>([""])

  // SUBIDA DE IMAGEN (A carpeta services/)
  const handleUpload = async (file: File) => {
    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const cleanName = title.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')
      const fileName = `${cleanName}-${Date.now()}.${fileExt}`
      const filePath = `services/${fileName}` // <--- CARPETA SERVICES

      const { error } = await supabase.storage.from('catalog').upload(filePath, file)
      if (error) throw error
      setImagePath(filePath)
    } catch (e: any) { alert(e.message) } 
    finally { setUploading(false) }
  }

  // GESTIÓN DE FEATURES
  const addFeature = () => setFeatures([...features, ""])
  const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index))
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = value
    setFeatures(newFeatures)
  }

  // GUARDAR
  const handleSubmit = async () => {
    if (!title || !imagePath) return alert("Título e imagen obligatorios")
    setLoading(true)

    try {
      const slug = title.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-")
      
      const { error } = await supabase.from("services").insert({
        title,
        slug,
        short_description: shortDesc,
        full_content: fullContent,
        image_path: imagePath,
        features: features.filter(f => f.trim() !== "") // Guardar solo los que tienen texto
      })

      if (error) throw error
      router.push("/admin/services")
    } catch (e: any) { alert(e.message) }
    finally { setLoading(false) }
  }

  const getImageUrl = (path: string) => `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catalog/${path}`

  return (
    <div className="max-w-4xl mx-auto p-8 pb-32">
      <h1 className="text-3xl font-bold text-[#232755] mb-8">Nuevo Servicio</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* IMAGEN */}
        <div className="md:col-span-1">
          <label className="font-bold block mb-2">Imagen Portada</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl h-64 flex flex-col items-center justify-center relative bg-gray-50 overflow-hidden">
            {imagePath ? (
              <Image src={getImageUrl(imagePath)} alt="Preview" fill className="object-cover" />
            ) : (
              <div className="text-center text-gray-400"><ImageIcon className="mx-auto mb-2"/>Subir Foto</div>
            )}
            <input type="file" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
            {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin"/></div>}
          </div>
        </div>

        {/* DATOS */}
        <div className="md:col-span-2 space-y-4">
          <input className="border p-3 rounded w-full font-bold text-lg" placeholder="Título (Ej: Alquiler de Montacargas)" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea className="border p-3 rounded w-full h-24" placeholder="Descripción Corta (Para la tarjeta)" value={shortDesc} onChange={e => setShortDesc(e.target.value)} />
        </div>
      </div>

      {/* CONTENIDO LARGO */}
      <div className="mt-8">
        <label className="font-bold block mb-2">Descripción Detallada</label>
        <textarea className="border p-4 rounded w-full h-48" placeholder="Explica en qué consiste el servicio, metodologías, etc." value={fullContent} onChange={e => setFullContent(e.target.value)} />
      </div>

      {/* FEATURES */}
      <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-[#232755] mb-4">Beneficios Clave (Bullet Points)</h3>
        {features.map((feat, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <div className="w-8 flex items-center justify-center text-[#ed9b19] font-bold">•</div>
            <input className="border p-2 rounded w-full" placeholder="Ej: Atención 24/7" value={feat} onChange={e => updateFeature(index, e.target.value)} />
            <button onClick={() => removeFeature(index)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
          </div>
        ))}
        <button onClick={addFeature} className="text-sm font-bold text-[#ed9b19] flex items-center gap-1 mt-2">+ Agregar Beneficio</button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end z-20">
        <button onClick={handleSubmit} disabled={loading} className="bg-[#232755] text-white px-8 py-3 rounded-lg font-bold">
          {loading ? "Guardando..." : "Crear Servicio"}
        </button>
      </div>
    </div>
  )
}