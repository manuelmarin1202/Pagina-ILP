import Image from "next/image"
import Link from "next/link"
import { Database } from "@/types/supabase"

// Extendemos el tipo base de la tabla 'products' para añadirle la imagen
// que vendrá de la relación con la otra tabla.
type Product = Database['public']['Tables']['products']['Row'] & {
  main_image?: string | null
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  // Aseguramos que specs sea un objeto leíble
  const specs = (product.specs as Record<string, string>) || {}

  return (
    <div className="group relative border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all h-full flex flex-col">
      {/* IMAGEN */}
      <div className="aspect-square relative bg-gray-100">
        <Image
          src={product.main_image || "/placeholder.jpg"} 
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          // AGREGA ESTA LÍNEA (sizes):
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {product.is_featured && (
          <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
            Destacado
          </span>
        )}
      </div>

      {/* INFO */}
      <div className="p-4 flex flex-col grow">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {product.name}
        </h3>
        
        <div className="text-sm text-gray-600 space-y-1 mb-4 grow">
          {Object.entries(specs).slice(0, 3).map(([key, value]) => (
            <div key={key} className="flex justify-between border-b border-gray-100 py-1 last:border-0">
              <span className="capitalize font-medium text-gray-500">{key}:</span>
              <span className="font-semibold text-gray-800">{value}</span>
            </div>
          ))}
        </div>

        <Link 
          href={`/catalogo/${product.slug}`}
          className="mt-auto block w-full text-center bg-gray-900 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Ver Ficha Técnica
        </Link>
      </div>
    </div>
  )
}