"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Plus, Trash2, Save, Image as ImageIcon, Loader2, ArrowLeft } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

// URL BASE
const STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catalog/`

export default function EditServicePage() {
  const supabase = createClient()
  const router = useRouter()
  const params = useParams()
  const serviceId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // ESTADOS DEL FORMULARIO
  const [title, setTitle] = useState("")
  const [shortDesc, setShortDesc] = useState("")
  const [fullContent, setFullContent] = useState("")
  const [imagePath, setImagePath] = useState<string | null>(null)
  
  // FEATURES (Lista de beneficios)
  const [features, setFeatures] = useState<string[]>([""])

  // --- 1. CARGAR DATOS AL INICIAR ---
  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("id", serviceId)
          .single()

        if (error) throw error

        // Rellenar estados
        setTitle(data.title)
        setShortDesc(data.short_description || "")
        setFullContent(data.full_content || "")
        setImagePath(data.image_path)
        
        // Si features es null o no es array, poner array vacío
        const featArray = Array.isArray(data.features) ? data.features : [""]
        setFeatures(featArray.length > 0 ? featArray : [""])

      } catch (error: any) {
        alert("Error cargando servicio: " + error.message)
        router.push("/admin/services")
      } finally {
        setLoading(false)
      }
    }

    if (serviceId) fetchService()
  }, [serviceId, supabase, router])

  // --- 2. SUBIDA DE IMAGEN ---
  const handleUpload = async (file: File) => {
    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const cleanName = title.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')
      const fileName = `${cleanName}-${Date.now()}.${fileExt}`
      const filePath = `services/${fileName}`

      const { error } = await supabase.storage.from('catalog').upload(filePath, file)
      
      if (error) throw error
      setImagePath(filePath)
    } catch (e: any) { 
      alert("Error subiendo imagen: " + e.message) 
    } finally { 
      setUploading(false) 
    }
  }

  // --- 3. GESTIÓN DE FEATURES ---
  const addFeature = () => setFeatures([...features, ""])
  
  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index)
    // Asegurarnos que siempre haya al menos un input aunque esté vacío
    setFeatures(newFeatures.length ? newFeatures : [""]) 
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = value
    setFeatures(newFeatures)
  }

  // --- 4. GUARDAR CAMBIOS (UPDATE) ---
  const handleSubmit = async () => {
    if (!title || !imagePath) return alert("Título e imagen obligatorios")
    setSaving(true)

    try {
      // Regeneramos slug por si cambió el título (Opcional: puedes quitar esto si no quieres que cambie la URL)
      const slug = title.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-")
      
      const { error } = await supabase
        .from("services")
        .update({
          title,
          slug,
          short_description: shortDesc,
          full_content: fullContent,
          image_path: imagePath,
          features: features.filter(f => f.trim() !== "") // Limpiamos vacíos
        })
        .eq("id", serviceId)

      if (error) throw error
      
      alert("¡Servicio actualizado correctamente!")
      router.push("/admin/services")

    } catch (e: any) { 
      alert("Error guardando: " + e.message) 
    } finally { 
      setSaving(false) 
    }
  }

  // Helper para preview
  const getImageUrl = (path: string) => `${STORAGE_URL}${path}`

  if (loading) return <div className="p-12 text-center text-gray-500">Cargando datos del servicio...</div>

  return (
    <div className="max-w-4xl mx-auto p-8 pb-32">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/services" className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h1 className="text-3xl font-bold text-[#232755]">Editar Servicio</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* COLUMNA 1: IMAGEN */}
        <div className="md:col-span-1">
          <label className="font-bold block mb-2 text-gray-700">Imagen Portada</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl h-64 flex flex-col items-center justify-center relative bg-gray-50 overflow-hidden hover:bg-gray-100 transition-colors">
            {imagePath ? (
              <Image src={getImageUrl(imagePath)} alt="Preview" fill className="object-cover" />
            ) : (
              <div className="text-center text-gray-400">
                <ImageIcon className="mx-auto mb-2 w-8 h-8"/>
                <span className="text-xs">Cambiar Foto</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} 
              className="absolute inset-0 opacity-0 cursor-pointer" 
            />
            {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin text-[#232755]"/></div>}
          </div>
        </div>

        {/* COLUMNA 2: DATOS BÁSICOS */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="font-bold block mb-1 text-sm text-gray-700">Título</label>
            <input 
              className="border p-3 rounded w-full font-bold text-lg outline-none focus:border-[#ed9b19]" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
            />
          </div>
          <div>
            <label className="font-bold block mb-1 text-sm text-gray-700">Descripción Corta (Tarjeta)</label>
            <textarea 
              className="border p-3 rounded w-full h-24 outline-none focus:border-[#ed9b19] resize-none" 
              value={shortDesc} 
              onChange={e => setShortDesc(e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* CONTENIDO LARGO */}
      <div className="mt-8">
        <label className="font-bold block mb-2 text-gray-700">Descripción Detallada (Página de Detalle)</label>
        <textarea 
          className="border p-4 rounded w-full h-48 outline-none focus:border-[#ed9b19]" 
          value={fullContent} 
          onChange={e => setFullContent(e.target.value)} 
        />
        <p className="text-xs text-gray-400 mt-2 text-right">Se respetan los saltos de línea.</p>
      </div>

      {/* FEATURES (BENEFICIOS) */}
      <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-[#232755] mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-[#ed9b19] rounded-full" /> Beneficios Clave
        </h3>
        
        <div className="space-y-3">
          {features.map((feat, index) => (
            <div key={index} className="flex gap-2">
              <div className="w-8 flex items-center justify-center text-[#ed9b19] font-bold mt-2">•</div>
              <input 
                className="border p-2 rounded w-full focus:border-[#ed9b19] outline-none" 
                placeholder="Ej: Atención 24/7" 
                value={feat} 
                onChange={e => updateFeature(index, e.target.value)} 
              />
              <button 
                onClick={() => removeFeature(index)} 
                className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                title="Eliminar beneficio"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
        
        <button 
          onClick={addFeature} 
          className="text-sm font-bold text-[#ed9b19] flex items-center gap-1 mt-4 hover:underline"
        >
          <Plus size={16} /> Agregar Beneficio
        </button>
      </div>

      {/* FOOTER ACCIONES */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-end z-20 shadow-lg">
        <button 
          onClick={handleSubmit} 
          disabled={saving || uploading} 
          className="bg-[#232755] text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-900 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
          Guardar Cambios
        </button>
      </div>
    </div>
  )
}