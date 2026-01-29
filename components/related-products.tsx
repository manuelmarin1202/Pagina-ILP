import Link from "next/link"
import Image from "next/image"
import { ArrowRight, PackageOpen } from "lucide-react"

const STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catalog/`

export function RelatedProducts({ products }: { products: any[] }) {
  if (!products || products.length === 0) return null

  return (
    <div className="bg-gray-50 py-16 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-black text-[#232755] mb-8 text-center">
          También te podría interesar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => {
            const imageUrl = product.image_path 
              ? `${STORAGE_URL}${product.image_path}` 
              : null
            
            return (
              <Link 
                key={product.id} 
                href={`/catalogo/${product.slug}`}
                className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col"
              >
                {/* Imagen Pequeña */}
                <div className="relative h-40 bg-gray-50 rounded-lg overflow-hidden mb-4">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">
                      <PackageOpen size={32} />
                    </div>
                  )}
                </div>

                {/* Texto */}
                <h3 className="font-bold text-[#232755] mb-1 line-clamp-2 leading-tight group-hover:text-[#ed9b19] transition-colors">
                  {product.name}
                </h3>
                
                {/* Botón sutil */}
                <div className="mt-auto pt-3 flex items-center text-xs font-bold text-gray-400 group-hover:text-[#ed9b19] transition-colors">
                  Ver equipo <ArrowRight size={12} className="ml-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}