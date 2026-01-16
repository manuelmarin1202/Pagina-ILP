import { createClient } from "@/utils/supabase/server"
import { ProductForm } from "../product-form" // Asegúrate de la ruta relativa correcta
import Link from "next/link"

export default async function NewProductPage() {
  const supabase = await createClient()

  // Traer categorías para el dropdown
  const { data: categories } = await supabase.from("categories").select("*")

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="text-gray-500 hover:text-[#232755]">
          ← Volver
        </Link>
        <h1 className="text-3xl font-bold text-[#232755]">Nuevo Producto</h1>
      </div>

      <ProductForm categories={categories || []} />
    </div>
  )
}