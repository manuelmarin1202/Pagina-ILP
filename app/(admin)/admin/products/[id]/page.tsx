"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Plus, Trash2, Save, Image as ImageIcon, Loader2, ArrowLeft, UploadCloud } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

const STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catalog/`

type Category = { id: string; name: string }
type Variant = {
  id?: string
  model_code: string
  capacity: string
  image_path: string | null 
  technical_specs: { key: string; value: string }[]
}
type GalleryItem = {
  id?: string
  image_path: string
  description: string
  variant_id?: string | null // <--- NUEVO: Puede ser null (General) o ID de variante
  isNew?: boolean
}

export default function EditProductPage() {
  const supabase = createClient()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // ESTADO PRODUCTO
  const [productName, setProductName] = useState("")
  const [productDesc, setProductDesc] = useState("")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [mainImage, setMainImage] = useState<string | null>(null)
  
  // AUXILIARES
  const [categories, setCategories] = useState<Category[]>([])
  const [variants, setVariants] = useState<Variant[]>([])
  const [deletedVariantIds, setDeletedVariantIds] = useState<string[]>([])
  
  // GALERÍA
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [deletedGalleryIds, setDeletedGalleryIds] = useState<string[]>([])

  // --- 1. CARGAR DATOS ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: cats } = await supabase.from("categories").select("id, name")
        if (cats) setCategories(cats)

        const { data: product, error } = await supabase
          .from("products")
          .select(`*, product_variants(*), product_gallery(*)`)
          .eq("id", productId)
          .single()

        if (error) throw error

        setProductName(product.name)
        setProductDesc(product.description || "")
        setYoutubeUrl(product.youtube_url || "")
        setCategoryId(product.category_id || "")
        setMainImage(product.image_path)

        // Variantes
        const formattedVariants = product.product_variants.map((v: any) => ({
          id: v.id,
          model_code: v.model_code,
          capacity: v.capacity,
          image_path: v.image_path,
          technical_specs: Array.isArray(v.technical_specs) ? v.technical_specs : []
        }))
        setVariants(formattedVariants)

        // Galería
        if (product.product_gallery) {
          setGallery(product.product_gallery)
        }

      } catch (error: any) {
        alert("Error: " + error.message)
      } finally {
        setLoading(false)
      }
    }

    if (productId) fetchData()
  }, [productId, supabase])

  // --- 2. SUBIDA DE IMÁGENES ---
  const handleUpload = async (file: File, type: 'main' | 'variant' | 'gallery', index?: number) => {
    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const cleanName = productName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')
      const folder = type === 'gallery' ? 'gallery' : 'products'
      const fileName = `${folder}/${cleanName}-${Date.now()}.${fileExt}`

      const { error } = await supabase.storage.from('catalog').upload(fileName, file)
      if (error) throw error

      if (type === 'main') {
        setMainImage(fileName)
      } else if (type === 'variant' && index !== undefined) {
        const newVars = [...variants]
        newVars[index].image_path = fileName
        setVariants(newVars)
      } else if (type === 'gallery') {
        // Por defecto se sube como "General" (variant_id: null)
        setGallery([...gallery, { image_path: fileName, description: "", variant_id: null, isNew: true }])
      }

    } catch (e: any) { alert(e.message) } 
    finally { setUploading(false) }
  }

  // --- 3. GESTIÓN GALERÍA ---
  const removeGalleryItem = (index: number) => {
    const item = gallery[index]
    if (item.id) setDeletedGalleryIds([...deletedGalleryIds, item.id])
    setGallery(gallery.filter((_, i) => i !== index))
  }

  const updateGalleryItem = (index: number, field: keyof GalleryItem, val: any) => {
    const newGallery = [...gallery]
    // @ts-ignore
    newGallery[index][field] = val
    setGallery(newGallery)
  }

  // --- 4. GESTIÓN VARIANTES ---
  const addVariant = () => setVariants([...variants, { model_code: "", capacity: "", image_path: null, technical_specs: [] }])
  const removeVariant = (index: number) => {
    if (variants[index].id) setDeletedVariantIds([...deletedVariantIds, variants[index].id!])
    setVariants(variants.filter((_, i) => i !== index))
  }
  const updateVariant = (i: number, f: keyof Variant, v: any) => {
    const n = [...variants]; n[i] = { ...n[i], [f]: v }; setVariants(n)
  }
  
  // (Helpers de Specs simplificados para ahorrar espacio, usa los mismos de antes)
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
  
  // --- 5. GUARDAR TODO ---
  const handleSubmit = async () => {
    if (!productName || !categoryId) return alert("Falta Nombre o Categoría")
    setSaving(true)

    try {
      // A. Update Producto
      await supabase.from("products").update({
        name: productName,
        description: productDesc,
        youtube_url: youtubeUrl,
        category_id: categoryId,
        image_path: mainImage
      }).eq("id", productId)

      // B. Procesar Variantes
      for (const v of variants) {
        const vData = { 
          product_id: productId, 
          model_code: v.model_code, 
          capacity: v.capacity, 
          image_path: v.image_path, 
          technical_specs: v.technical_specs 
        }
        if (v.id) await supabase.from("product_variants").update(vData).eq("id", v.id)
        else await supabase.from("product_variants").insert(vData)
      }
      if (deletedVariantIds.length) await supabase.from("product_variants").delete().in("id", deletedVariantIds)

      // C. PROCESAR GALERÍA
      // 1. Insertar Nuevas
      const newGalleryItems = gallery.filter(g => g.isNew).map(g => ({
        product_id: productId,
        image_path: g.image_path,
        description: g.description,
        variant_id: g.variant_id === "GENERAL" ? null : g.variant_id // Convertimos el string "GENERAL" a null
      }))
      if (newGalleryItems.length) await supabase.from("product_gallery").insert(newGalleryItems)

      // 2. Actualizar Existentes (Descripción o cambio de asignación)
      const existingGalleryItems = gallery.filter(g => !g.isNew)
      for (const g of existingGalleryItems) {
        await supabase.from("product_gallery").update({ 
          description: g.description,
          variant_id: g.variant_id === "GENERAL" ? null : g.variant_id 
        }).eq("id", g.id)
      }

      // 3. Borrar
      if (deletedGalleryIds.length) await supabase.from("product_gallery").delete().in("id", deletedGalleryIds)

      alert("¡Guardado correctamente!")
      // Recargar la página para refrescar IDs
      window.location.reload()

    } catch (e: any) { alert(e.message) }
    finally { setSaving(false) }
  }

  if (loading) return <div>Cargando...</div>

  return (
    <div className="p-8 max-w-5xl mx-auto pb-32">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 bg-white rounded-full border"><ArrowLeft size={20}/></Link>
        <h1 className="text-3xl font-bold text-[#232755]">Editar Producto</h1>
      </div>

      {/* DATOS PRINCIPALES (Igual que antes) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <label className="font-bold block mb-2">Imagen Principal</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl h-64 flex flex-col items-center justify-center relative bg-gray-50 overflow-hidden">
            {mainImage ? <Image src={`${STORAGE_URL}${mainImage}`} alt="" fill className="object-cover"/> : <ImageIcon className="text-gray-300 w-10 h-10"/>}
            <input type="file" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'main')} className="absolute inset-0 opacity-0 cursor-pointer" />
            {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin"/></div>}
          </div>
        </div>
        <div className="md:col-span-2 space-y-4">
          <input className="border p-3 rounded w-full font-bold" value={productName} onChange={e => setProductName(e.target.value)} placeholder="Nombre" />
          <select className="border p-3 rounded w-full" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input className="border p-3 rounded w-full text-sm" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} placeholder="URL Video YouTube" />
          <textarea className="border p-3 rounded w-full h-24" value={productDesc} onChange={e => setProductDesc(e.target.value)} placeholder="Descripción" />
        </div>
      </div>

      {/* --- SECCIÓN GALERÍA MEJORADA --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
        <h2 className="font-bold text-xl text-[#232755] mb-4 flex items-center gap-2">
           <ImageIcon size={20} className="text-[#ed9b19]"/> Galería Técnica & Planos
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map((item, idx) => (
            <div key={idx} className="relative group border rounded-lg p-2 bg-gray-50 flex flex-col gap-2">
              <button onClick={() => removeGalleryItem(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full z-10 hover:bg-red-600">
                <Trash2 size={12} />
              </button>
              
              <div className="relative h-24 w-full bg-white rounded border overflow-hidden">
                <Image src={`${STORAGE_URL}${item.image_path}`} alt="" fill className="object-contain" />
              </div>
              
              {/* INPUT DESCRIPCIÓN */}
              <input 
                className="w-full text-[10px] border p-1 rounded text-center" 
                placeholder="Ej: Plano Carga"
                value={item.description || ""}
                onChange={e => updateGalleryItem(idx, 'description', e.target.value)}
              />

              {/* SELECTOR DE VARIANTE (AQUÍ ESTÁ LA MAGIA) */}
              <select
                className="w-full text-[10px] border p-1 rounded bg-white font-bold text-[#232755]"
                value={item.variant_id || "GENERAL"}
                onChange={(e) => updateGalleryItem(idx, 'variant_id', e.target.value)}
              >
                <option value="GENERAL">Para Todo el Producto</option>
                {variants.map((v) => (
                  // Solo mostramos variantes que ya tienen ID (guardadas)
                  v.id && <option key={v.id} value={v.id}>Solo {v.model_code}</option>
                ))}
              </select>

            </div>
          ))}

          {/* Botón Subir */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-48 cursor-pointer hover:bg-gray-50 relative">
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

      {/* --- SECCIÓN VARIANTES (Igual) --- */}
      <h2 className="font-bold text-xl text-[#232755] mb-4">Modelos / Capacidades</h2>
      <div className="space-y-6">
        {variants.map((variant, vIndex) => (
          <div key={vIndex} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
             <button onClick={() => removeVariant(vIndex)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><Trash2 size={20} /></button>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="md:col-span-1">
                 <div className="border border-dashed border-gray-300 rounded-lg h-32 relative bg-gray-50 overflow-hidden flex items-center justify-center">
                   {variant.image_path ? <Image src={`${STORAGE_URL}${variant.image_path}`} alt="" fill className="object-cover"/> : <span className="text-[10px] text-gray-400">Foto Modelo</span>}
                   <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'variant', vIndex)} />
                 </div>
               </div>
               <div className="md:col-span-3 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                   <input className="border p-2 rounded text-sm font-bold" placeholder="Modelo" value={variant.model_code} onChange={e => updateVariant(vIndex, "model_code", e.target.value)} />
                   <input className="border p-2 rounded text-sm" placeholder="Capacidad" value={variant.capacity} onChange={e => updateVariant(vIndex, "capacity", e.target.value)} />
                 </div>
                 <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {variant.technical_specs.map((spec, sIndex) => (
                      <div key={sIndex} className="flex gap-2 mb-2">
                        <input className="border p-1.5 rounded w-1/3 text-xs" value={spec.key} onChange={e => updateSpec(vIndex, sIndex, "key", e.target.value)} />
                        <input className="border p-1.5 rounded w-2/3 text-xs" value={spec.value} onChange={e => updateSpec(vIndex, sIndex, "value", e.target.value)} />
                      </div>
                    ))}
                    <button onClick={() => addSpec(vIndex)} className="text-xs text-[#ed9b19] font-bold"><Plus size={14} /> Agregar Spec</button>
                 </div>
               </div>
             </div>
          </div>
        ))}
        <button onClick={addVariant} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold">+ Agregar Modelo</button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end gap-4 z-20 shadow-lg">
        <button onClick={handleSubmit} disabled={saving} className="bg-[#232755] text-white px-8 py-3 rounded-lg font-bold">
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </div>
  )
}