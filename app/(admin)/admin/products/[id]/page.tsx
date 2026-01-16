import { createClient } from "@/utils/supabase/server"
import { ProductForm } from "../product-form"
import Link from "next/link"
import { notFound } from "next/navigation"

// 1. CAMBIO IMPORTANTE: params ahora es una PROMESA
type Props = {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const supabase = await createClient()

  // 2. CAMBIO IMPORTANTE: "Desempaquetamos" el ID con await
  const { id } = await params

  // 3. Obtener Categorías
  const { data: categories } = await supabase.from("categories").select("*")

  // 4. Obtener el Producto a Editar usando el ID ya procesado
  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      product_images (storage_path)
    `)
    .eq("id", id) // <--- Usamos 'id', no 'params.id'
    .single()

  if (error || !product) {
    return notFound()
  }

  // 5. Preparar la URL de la imagen si existe
  let imageUrl = null
  if (product.product_images?.[0]) {
    const { data } = supabase.storage
      .from("catalog")
      .getPublicUrl(product.product_images[0].storage_path)
    imageUrl = data.publicUrl
  }

  // Combinamos todo para pasárselo al form
  const initialData = {
    ...product,
    imageUrl
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="text-gray-500 hover:text-[#232755]">
          ← Volver al panel
        </Link>
        <h1 className="text-3xl font-bold text-[#232755]">Editar Producto</h1>
      </div>

      <ProductForm 
        categories={categories || []} 
        initialData={initialData} 
      />
    </div>
  )
}