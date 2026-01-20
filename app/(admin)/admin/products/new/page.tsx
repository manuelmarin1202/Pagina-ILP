"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Plus, Trash2, Save, Image as ImageIcon, Loader2, UploadCloud } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

// --- TIPOS ---
type Spec = { key: string; value: string }
type Category = { id: string; name: string }

type Variant = {
  model_code: string
  capacity: string
  image_path: string | null 
  technical_specs: Spec[]
}

type GalleryItem = {
  image_path: string
  description: string
  // En "Nuevo", usaremos el índice del array de variantes para vincular
  // -1 significa "General" (Para todos)
  // 0, 1, 2... significa el índice del array 'variants'
  temp_variant_index: number 
}

const STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catalog/`

export default function CreateProductPage() {
  const supabase = createClient()
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // ESTADO DEL PADRE
  const [productName, setProductName] = useState("")
  const [productDesc, setProductDesc] = useState("")
  const [youtubeUrl, setYoutubeUrl] = useState("") // <--- NUEVO
  const [categoryId, setCategoryId] = useState("")
  const [mainImage, setMainImage] = useState<string | null>(null)
  
  // ESTADO DE AUXILIARES
  const [categories, setCategories] = useState<Category[]>([])
  
  // ESTADO DE GALERÍA (NUEVO)
  const [gallery, setGallery] = useState<GalleryItem[]>([])

  // ESTADO DE LOS HIJOS (VARIANTES)
  const [variants, setVariants] = useState<Variant[]>([
    { model_code: "", capacity: "", image_path: null, technical_specs: [{ key: "", value: "" }] }
  ])

  // --- 1. CARGAR CATEGORÍAS AL INICIAR ---
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("id, name")
      if (data) {
        setCategories(data)
        if (data.length > 0) setCategoryId(data[0].id)
      }
    }
    fetchCategories()
  }, [supabase])

  // --- SUBIDA DE IMÁGENES (UNIFICADA) ---
  const handleUpload = async (file: File, type: 'main' | 'variant' | 'gallery', index?: number) => {
    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const cleanName = productName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-') || 'nuevo-producto'
      const folder = type === 'gallery' ? 'gallery' : 'products'
      const fileName = `${folder}/${cleanName}-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('catalog')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      if (type === 'main') {
        setMainImage(fileName)
      } else if (type === 'variant' && index !== undefined) {
        updateVariant(index, "image_path", fileName)
      } else if (type === 'gallery') {
        // Por defecto, asignamos como "General" (-1)
        setGallery([...gallery, { image_path: fileName, description: "", temp_variant_index: -1 }])
      }

    } catch (error: any) {
      alert("Error subiendo imagen: " + error.message)
    } finally {
      setUploading(false)
    }
  }

  // --- LOGICA DE VARIANTES ---
  const addVariant = () => {
    setVariants([...variants, { model_code: "", capacity: "", image_path: null, technical_specs: [{ key: "", value: "" }] }])
  }
  const removeVariant = (index: number) => {
    // Si borramos una variante, tenemos que actualizar la galería para que no apunte a índices rotos
    const newVariants = variants.filter((_, i) => i !== index)
    
    // Si alguna foto apuntaba a la variante borrada, la pasamos a General (-1)
    // Si apuntaba a una variante posterior, restamos 1 a su índice
    const newGallery = gallery.map(g => {
        if (g.temp_variant_index === index) return { ...g, temp_variant_index: -1 }
        if (g.temp_variant_index > index) return { ...g, temp_variant_index: g.temp_variant_index - 1 }
        return g
    })
    
    setVariants(newVariants)
    setGallery(newGallery)
  }
  
  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const newVariants = [...variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setVariants(newVariants)
  }
  
  // Specs helpers
  const addSpec = (vIndex: number) => {
    const newVariants = [...variants]
    newVariants[vIndex].technical_specs.push({ key: "", value: "" })
    setVariants(newVariants)
  }
  const updateSpec = (vIndex: number, sIndex: number, field: "key" | "value", value: string) => {
    const newVariants = [...variants]
    newVariants[vIndex].technical_specs[sIndex][field] = value
    setVariants(newVariants)
  }

  // --- LOGICA DE GALERÍA ---
  const removeGalleryItem = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index))
  }
  
  const updateGalleryItem = (index: number, field: keyof GalleryItem, val: any) => {
    const newGallery = [...gallery]
    // @ts-ignore
    newGallery[index][field] = val
    setGallery(newGallery)
  }

  const generateSlug = (text: string) => {
    return text.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-");
  }

  // --- GUARDADO FINAL ---
  const handleSubmit = async () => {
    if (!productName || !mainImage || !categoryId) return alert("Faltan datos obligatorios")
    
    setLoading(true)
    try {
      const slug = generateSlug(productName)
      
      // 1. Crear Padre
      const { data: product, error: prodError } = await supabase
        .from("products")
        .insert({
          name: productName,
          slug: slug,
          description: productDesc,
          category_id: categoryId,
          image_path: mainImage,
          youtube_url: youtubeUrl,
          is_featured: false
        })
        .select()
        .single()

      if (prodError) throw prodError

      // 2. Crear Variantes y guardar sus IDs retornados
      // Necesitamos los IDs para vincular la galería después
      const { data: insertedVariants, error: varError } = await supabase
        .from("product_variants")
        .insert(variants.map(v => ({
          product_id: product.id,
          model_code: v.model_code,
          capacity: v.capacity,
          technical_specs: v.technical_specs.filter(s => s.key && s.value), 
          image_path: v.image_path
        })))
        .select("id") // Importante: Pedimos que nos devuelva los IDs

      if (varError) throw varError

      // 3. Crear Galería (Mapeando índices temporales a IDs reales)
      if (gallery.length > 0 && insertedVariants) {
        const galleryToInsert = gallery.map(g => {
            // Lógica de mapeo:
            // Si es -1, es null (General)
            // Si es 0, es el ID de insertedVariants[0]
            let realVariantId = null
            if (g.temp_variant_index >= 0 && insertedVariants[g.temp_variant_index]) {
                realVariantId = insertedVariants[g.temp_variant_index].id
            }

            return {
                product_id: product.id,
                image_path: g.image_path,
                description: g.description,
                variant_id: realVariantId
            }
        })

        const { error: gallError } = await supabase
          .from("product_gallery")
          .insert(galleryToInsert)

        if (gallError) throw gallError
      }

      alert("¡Producto creado exitosamente!")
      router.push("/admin/products")

    } catch (error: any) {
      console.error(error)
      alert("Error: " + (error.message || error.details))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto pb-32">
      <h1 className="text-3xl font-bold text-[#232755] mb-8">Crear Nuevo Producto</h1>

      {/* SECCIÓN 1: DATOS GENERALES */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Imagen Principal */}
        <div className="md:col-span-1">
          <label className="block text-sm font-bold text-gray-700 mb-2">Imagen Principal</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl h-64 flex flex-col items-center justify-center relative overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors">
            {mainImage ? (
              <Image src={`${STORAGE_URL}${mainImage}`} alt="Preview" fill className="object-cover" />
            ) : (
              <div className="text-center p-4">
                <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <span className="text-xs text-gray-400">Subir Imagen</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'main')}
            />
            {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin text-[#232755]" /></div>}
          </div>
        </div>

        {/* Formulario Texto */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre</label>
            <input 
              className="border p-3 rounded w-full outline-none focus:border-[#ed9b19]" 
              placeholder="Ej: Montacargas 3.5T" 
              value={productName}
              onChange={e => setProductName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Categoría</label>
            <select 
              className="border p-3 rounded w-full outline-none focus:border-[#ed9b19]"
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
            >
              {categories.length === 0 && <option>Cargando...</option>}
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Video YouTube (Opcional)</label>
            <input 
              className="border p-3 rounded w-full outline-none focus:border-[#ed9b19]" 
              placeholder="https://youtube.com/watch?v=..." 
              value={youtubeUrl}
              onChange={e => setYoutubeUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
            <textarea 
              className="border p-3 rounded w-full h-24 resize-none outline-none focus:border-[#ed9b19]" 
              placeholder="Descripción comercial..."
              value={productDesc}
              onChange={e => setProductDesc(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: GALERÍA TÉCNICA (NUEVO) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="font-bold text-xl text-[#232755] mb-4 flex items-center gap-2">
           <ImageIcon size={20} className="text-[#ed9b19]"/> Galería Técnica & Planos
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Sube planos o vistas adicionales. Puedes asignarlas a un modelo específico de la lista de abajo.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map((item, idx) => (
            <div key={idx} className="relative group border rounded-lg p-2 bg-gray-50 flex flex-col gap-2">
              <button onClick={() => removeGalleryItem(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full z-10 hover:bg-red-600">
                <Trash2 size={12} />
              </button>
              
              <div className="relative h-24 w-full bg-white rounded border overflow-hidden">
                <Image src={`${STORAGE_URL}${item.image_path}`} alt="" fill className="object-contain" />
              </div>
              
              <input 
                className="w-full text-[10px] border p-1 rounded text-center" 
                placeholder="Descripción (Ej: Plano)"
                value={item.description}
                onChange={e => updateGalleryItem(idx, 'description', e.target.value)}
              />

              {/* SELECTOR INTELIGENTE: APUNTA A LOS MODELOS DE ABAJO */}
              <select
                className="w-full text-[10px] border p-1 rounded bg-white font-bold text-[#232755]"
                value={item.temp_variant_index}
                onChange={(e) => updateGalleryItem(idx, 'temp_variant_index', Number(e.target.value))}
              >
                <option value={-1}>Para Todo el Producto</option>
                {variants.map((v, vIdx) => (
                  <option key={vIdx} value={vIdx}>
                    Solo {v.model_code || `Modelo #${vIdx + 1}`}
                  </option>
                ))}
              </select>

            </div>
          ))}

          {/* Botón Subir Galería */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-48 cursor-pointer hover:bg-gray-50 hover:border-[#ed9b19] transition-colors relative">
            <UploadCloud className="text-gray-400 mb-2" />
            <span className="text-xs font-bold text-gray-500 text-center px-2">Subir Foto o Plano</span>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'gallery')}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: VARIANTES */}
      <h2 className="font-bold text-xl text-[#232755] mb-4 flex items-center gap-2">
        <div className="w-8 h-1 bg-[#ed9b19] rounded-full" /> Modelos / Capacidades
      </h2>

      <div className="space-y-6">
        {variants.map((variant, vIndex) => (
          <div key={vIndex} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
            <button onClick={() => removeVariant(vIndex)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
              <Trash2 size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Imagen Variante */}
              <div className="md:col-span-1">
                <div className="border border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center relative bg-gray-50 overflow-hidden">
                  {variant.image_path ? (
                    <Image src={`${STORAGE_URL}${variant.image_path}`} alt="Var" fill className="object-cover" />
                  ) : (
                    <span className="text-[10px] text-gray-400 text-center px-2">Foto Específica</span>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'variant', vIndex)}
                  />
                </div>
              </div>

              {/* Datos Variante */}
              <div className="md:col-span-3 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    className="border p-2 rounded text-sm font-bold" 
                    placeholder="Modelo (Ej: CPD25)"
                    value={variant.model_code}
                    onChange={e => updateVariant(vIndex, "model_code", e.target.value)}
                  />
                  <input 
                    className="border p-2 rounded text-sm" 
                    placeholder="Capacidad (Ej: 2.5 Ton)"
                    value={variant.capacity}
                    onChange={e => updateVariant(vIndex, "capacity", e.target.value)}
                  />
                </div>

                {/* Specs */}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {variant.technical_specs.map((spec, sIndex) => (
                    <div key={sIndex} className="flex gap-2 mb-2">
                      <input 
                        className="border p-1.5 rounded w-1/3 text-xs" 
                        placeholder="Caract."
                        value={spec.key}
                        onChange={e => updateSpec(vIndex, sIndex, "key", e.target.value)}
                      />
                      <input 
                        className="border p-1.5 rounded w-2/3 text-xs font-medium" 
                        placeholder="Valor"
                        value={spec.value}
                        onChange={e => updateSpec(vIndex, sIndex, "value", e.target.value)}
                      />
                    </div>
                  ))}
                  <button onClick={() => addSpec(vIndex)} className="text-xs text-[#ed9b19] font-bold flex items-center gap-1">
                    <Plus size={14} /> Agregar Spec
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <button onClick={addVariant} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-[#232755] hover:text-[#232755] transition-colors">
          + Agregar Modelo
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-end gap-4 shadow-lg z-20">
        <button 
          onClick={handleSubmit}
          disabled={loading || uploading}
          className="bg-[#232755] text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-900 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
          {loading ? "Guardando..." : "Crear Producto"}
        </button>
      </div>
    </div>
  )
}