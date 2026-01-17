import { createClient } from "@/utils/supabase/server"
import { ProductClient } from "./product-client"
import { notFound } from "next/navigation"

// Definimos el tipo como una Promesa
type Props = {
  params: Promise<{ slug: string }>
}

export default async function ProductDetailPage({ params }: Props) {
  // 1. DESEMPAQUETAMOS LA PROMESA (ESTO ARREGLA EL ERROR)
  const { slug } = await params

  const supabase = await createClient()
  
  // 2. Obtener Padre (Usando la variable 'slug' ya limpia)
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!product) return notFound()

  // 3. Obtener Hijos (Variantes)
  const { data: variants } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", product.id)
    .order("model_code", { ascending: true })

  return <ProductClient product={product} variants={variants || []} />
}