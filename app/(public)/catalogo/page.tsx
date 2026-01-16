import { createClient } from "@/utils/supabase/server"
import { ProductCard } from "@/components/product-card"

export default async function CatalogoPage() {
  const supabase = await createClient() // Await aquí también

  // CONSULTA MAESTRA:
  // Traemos los productos Y la primera imagen asociada (limit(1))
  const { data: rawProducts, error } = await supabase
    .from("products")
    .select(`
      *,
      product_images (
        storage_path
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error:", error)
    return <div>Error cargando catálogo</div>
  }

  // Transformamos los datos para que encajen en nuestro tipo 'Product'
  // Sacamos la URL pública de la imagen si existe
  const products = rawProducts?.map((p) => {
    // TypeScript a veces se queja con los Joins complejos, forzamos el tipo aquí
    const images = p.product_images as unknown as { storage_path: string }[]
    const firstImage = images?.[0]
    
    // Construimos la URL pública final
    const imageUrl = firstImage 
      ? supabase.storage.from("catalog").getPublicUrl(firstImage.storage_path).data.publicUrl
      : null

    return {
      ...p,
      main_image: imageUrl
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Catálogo ILP 2025</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}