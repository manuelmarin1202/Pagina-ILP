import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, PackageOpen } from "lucide-react"

// URL BASE (Para no repetir código y evitar errores de tipeo)
// Asegúrate de que coincida con tu proyecto
const STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catalog/`

export default async function CatalogPage() {
  const supabase = await createClient()

  // --- CONSULTA CORREGIDA ---
  // ANTES (Causaba el error): .select('*, product_images(*)')
  // AHORA (Correcto): .select('*') -> Porque la foto ya está en la columna 'image_path'
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        
        {/* Cabecera */}
        <div className="text-center mb-16">
          <span className="text-[#ed9b19] font-bold tracking-widest uppercase text-sm">
            Nuestra Flota
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[#232755] mt-2">
            Catálogo de Equipos
          </h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Soluciones de ingeniería para cada etapa de tu cadena logística.
          </p>
        </div>

        {/* GRID DE FAMILIAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products?.map((product) => {
            // Construimos la URL de la imagen de forma segura
            const imageUrl = product.image_path 
              ? `${STORAGE_URL}${product.image_path}` 
              : null

            return (
              <Link 
                key={product.id} 
                href={`/catalogo/${product.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
              >
                {/* Imagen del Producto Padre */}
                <div className="relative h-64 bg-gray-100 overflow-hidden">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-100">
                      <PackageOpen size={48} strokeWidth={1} />
                      <span className="text-xs mt-2 font-medium">Sin imagen</span>
                    </div>
                  )}
                  
                  {/* Badge de Categoría */}
                  <div className="absolute top-4 left-4 bg-[#232755]/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm shadow-md">
                    {/* Si usas la relación de categorías, podrías necesitar un .select('*, categories(name)') */}
                    {/* Por ahora mostramos un texto estático o si guardaste el nombre en alguna parte */}
                    Equipo ILP
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-[#232755] mb-2 group-hover:text-[#ed9b19] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center text-[#ed9b19] font-bold text-sm mt-auto group/btn">
                    Ver Modelos y Specs 
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Estado vacío */}
        {(!products || products.length === 0) && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <PackageOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No hay productos aún</h3>
            <p className="text-gray-500 mt-1">Ingresa al panel administrativo para agregar equipos.</p>
          </div>
        )}

      </div>
    </div>
  )
}