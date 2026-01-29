import { createClient } from "@/utils/supabase/server"
import { ProductClient } from "./product-client"
import { RelatedProducts } from "@/components/related-products" // <--- IMPORTAR
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  
  // 1. OBTENER PRODUCTO ACTUAL
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!product) return notFound()

  // 2. OBTENER VARIANTES
  const { data: variants } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", product.id)
    .order("model_code", { ascending: true })

  // 3. OBTENER RELACIONADOS (Misma categoría, pero NO el actual)
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("id, name, slug, image_path") // Solo traemos lo necesario para la tarjeta
    .eq("category_id", product.category_id) // Misma categoría
    .neq("id", product.id) // Excluir el producto actual
    .limit(3) // Traer máximo 3

  return (
    <>
      {/* Componente Principal del Producto */}
      <ProductClient product={product} variants={variants || []} />
      
      {/* Sección de Relacionados (Se renderiza debajo) */}
      <RelatedProducts products={relatedProducts || []} />
    </>
  )
}