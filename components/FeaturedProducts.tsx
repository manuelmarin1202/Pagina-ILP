import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catalog/`

export async function FeaturedProducts() {
  const supabase = await createClient()

  // Traemos los últimos 3 productos (o podrías filtrar por .eq('is_featured', true))
  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .limit(3)
    .order("created_at", { ascending: false })

  if (!products || products.length === 0) return null

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black text-[#232755]">Últimos Ingresos</h2>
            <p className="text-gray-500 mt-2">Tecnología reciente añadida a nuestro catálogo.</p>
          </div>
          <Link href="/catalogo" className="hidden md:flex items-center gap-2 text-[#ed9b19] font-bold hover:underline">
            Ver todo el catálogo <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link 
              key={product.id} 
              href={`/catalogo/${product.slug}`}
              className="group block"
            >
              <div className="bg-gray-50 rounded-2xl p-6 relative overflow-hidden mb-4 border border-gray-100 transition-all group-hover:shadow-lg">
                <div className="aspect-[4/3] relative">
                  {product.image_path ? (
                    <Image 
                      src={`${STORAGE_URL}${product.image_path}`} 
                      alt={product.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">Sin Imagen</div>
                  )}
                </div>
                {/* Badge Categoría */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[#232755] text-xs font-bold px-3 py-1 rounded-full">
                   {/* @ts-ignore */}
                   {product.categories?.name || "Equipo"}
                </div>
              </div>
              
              <h3 className="font-bold text-lg text-[#232755] group-hover:text-[#ed9b19] transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                {product.description}
              </p>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link href="/catalogo" className="inline-flex items-center gap-2 text-[#ed9b19] font-bold">
            Ver todo el catálogo <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}