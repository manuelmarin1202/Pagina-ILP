"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Plus, Trash2, Save, Image as ImageIcon, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

// --- TIPOS ---
type Spec = { key: string; value: string }
type Category = { id: string; name: string } // Tipo para categoría

type Variant = {
  model_code: string
  capacity: string
  image_path: string | null 
  technical_specs: Spec[]
}

export default function CreateProductPage() {
  const supabase = createClient()
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // ESTADO DEL PADRE
  const [productName, setProductName] = useState("")
  const [productDesc, setProductDesc] = useState("")
  const [categoryId, setCategoryId] = useState("") // Ahora guardamos el ID (UUID)
  const [mainImage, setMainImage] = useState<string | null>(null)
  
  // ESTADO PARA LISTA DE CATEGORÍAS
  const [categories, setCategories] = useState<Category[]>([])

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
        if (data.length > 0) setCategoryId(data[0].id) // Seleccionar la primera por defecto
      }
    }
    fetchCategories()
  }, [])

  // --- FUNCIÓN DE SUBIDA A SUPABASE ---
  const handleUpload = async (file: File, isVariant: boolean, index?: number) => {
    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      // Limpiamos el nombre para que no tenga espacios ni caracteres raros
      const cleanName = productName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')
      const fileName = `${cleanName}-${Date.now()}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('catalog')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      if (isVariant && index !== undefined) {
        updateVariant(index, "image_path", filePath)
      } else {
        setMainImage(filePath)
      }

    } catch (error: any) {
      alert("Error subiendo imagen: " + error.message)
    } finally {
      setUploading(false)
    }
  }

  // --- LOGICA DE VARIANTES (Igual) ---
  const addVariant = () => {
    setVariants([...variants, { model_code: "", capacity: "", image_path: null, technical_specs: [{ key: "", value: "" }] }])
  }
  const removeVariant = (index: number) => setVariants(variants.filter((_, i) => i !== index))
  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const newVariants = [...variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setVariants(newVariants)
  }
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

  const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // Separa la tilde de la letra (é -> e + ´)
    .replace(/[\u0300-\u036f]/g, "") // Elimina los diacríticos (tildes)
    .trim()
    .replace(/\s+/g, "-") // Espacios a guiones
    .replace(/[^\w-]+/g, "") // Elimina caracteres raros (ñ, @, etc)
    .replace(/--+/g, "-"); // Elimina guiones dobles
}

  // --- GUARDADO FINAL (ADAPTADO A TU SCHEMA) ---
  const handleSubmit = async () => {
    if (!productName || !mainImage || !categoryId) return alert("Faltan datos obligatorios")
    
    setLoading(true)
    try {
      const slug = generateSlug(productName)
      
      // 1. Crear Padre (Usando category_id)
      const { data: product, error: prodError } = await supabase
        .from("products")
        .insert({
          name: productName,
          slug: slug,
          description: productDesc,
          category_id: categoryId, // <--- CAMBIO IMPORTANTE: UUID
          image_path: mainImage,   // <--- RECUERDA CORRER EL SQL 'ALTER TABLE'
          is_featured: false
        })
        .select()
        .single()

      if (prodError) throw prodError

      // 2. Crear Variantes (Igual)
      const variantsToInsert = variants.map(v => ({
        product_id: product.id,
        model_code: v.model_code,
        capacity: v.capacity,
        technical_specs: v.technical_specs.filter(s => s.key && s.value), 
        image_path: v.image_path
      }))

      const { error: varError } = await supabase
        .from("product_variants")
        .insert(variantsToInsert)

      if (varError) throw varError

      alert("¡Producto guardado correctamente!")
      router.push("/dashboard/products")

    } catch (error: any) {
      console.error(error)
      alert("Error: " + (error.message || error.details))
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (path: string | null) => {
    if (!path) return ""
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catalog/${path}`
  }

  return (
    <div className="p-8 max-w-5xl mx-auto pb-32">
      <h1 className="text-3xl font-bold text-[#232755] mb-8">Crear Nuevo Producto</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Imagen Principal */}
        <div className="md:col-span-1">
          <label className="block text-sm font-bold text-gray-700 mb-2">Imagen Principal</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl h-64 flex flex-col items-center justify-center relative overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors">
            {mainImage ? (
              <Image src={getImageUrl(mainImage)} alt="Preview" fill className="object-cover" />
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
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], false)}
            />
            {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin text-[#232755]" /></div>}
          </div>
        </div>

        {/* Datos Generales */}
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
          
          {/* SELECTOR DE CATEGORÍA REAL (UUID) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Categoría</label>
            <select 
              className="border p-3 rounded w-full outline-none focus:border-[#ed9b19]"
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
            >
              {categories.length === 0 && <option>Cargando categorías...</option>}
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="text-xs text-red-500 mt-1">⚠️ Crea categorías en Supabase primero.</p>
            )}
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

      {/* Variantes (Igual que antes) */}
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
                    <Image src={getImageUrl(variant.image_path)} alt="Var" fill className="object-cover" />
                  ) : (
                    <span className="text-[10px] text-gray-400 text-center px-2">Foto Específica</span>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], true, vIndex)}
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
          className="bg-[#232755] text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-900 disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar Producto"}
        </button>
      </div>
    </div>
  )
}