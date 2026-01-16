import { createClient } from "@/utils/supabase/server"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface ProductPageProps {
  params: {
    slug: string
  }
}

// 1. GENERACIÓN DE METADATOS SEO (Dynamic Metadata)
// Esto hace que Google vea "Rampa Móvil 10T | ILP" en lugar de un título genérico
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const supabase = await createClient()
  const { data: product } = await supabase
    .from("products")
    .select("name, description")
    .eq("slug", params.slug)
    .single()

  if (!product) return { title: "Producto no encontrado" }

  return {
    title: `${product.name} | ILP Soluciones Logística`,
    description: product.description || `Ficha técnica y especificaciones de ${product.name}`,
  }
}

// 2. PÁGINA DEL PRODUCTO (Server Component)
export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = await createClient()

  // Consultamos el producto + todas sus imágenes
  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      product_images (
        storage_path,
        alt_text
      )
    `)
    .eq("slug", params.slug)
    .single()

  if (error || !product) {
    notFound() // Muestra la página 404 de Next.js automáticamente
  }

  // Preparamos las especificaciones (Casteo seguro de JSONB)
  const specs = (product.specs as Record<string, string>) || {}
  
  // Preparamos la imagen principal
  const images = product.product_images as unknown as { storage_path: string; alt_text: string }[]
  const mainImage = images?.[0] 
    ? supabase.storage.from("catalog").getPublicUrl(images[0].storage_path).data.publicUrl 
    : "/placeholder.jpg"

  return (
    <div className="container mx-auto px-4 py-12">
      {/* MIGA DE PAN (Breadcrumbs) */}
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">Inicio</Link> 
        <span className="mx-2">/</span>
        <Link href="/catalogo" className="hover:text-blue-600">Catálogo</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* COLUMNA IZQUIERDA: IMAGEN */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover"
              priority // Prioridad alta de carga para SEO (LCP)
            />
          </div>
          {/* Aquí podrías agregar una galería pequeña abajo si tienes más fotos */}
        </div>

        {/* COLUMNA DERECHA: INFO TÉCNICA */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            {product.name}
          </h1>
          
          <div className="prose prose-blue text-gray-600 mb-8">
            <p>{product.description}</p>
          </div>

          {/* TABLA DE ESPECIFICACIONES (Renderizado dinámico del JSON) */}
          {Object.keys(specs).length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Especificaciones Técnicas</h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                    <dt className="text-sm font-medium text-gray-500 capitalize">{key.replace(/_/g, " ")}</dt>
                    <dd className="mt-1 text-sm font-bold text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* ACCIONES (CTA) */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={`https://wa.me/51938231707?text=Hola,%20estoy%20interesado%20en%20el%20producto:%20${encodeURIComponent(product.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
            >
              {/* Icono de WhatsApp SVG */}
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              Cotizar por WhatsApp
            </a>
            <a
              href="mailto:ventas@ilpsolucioneslogistica.com.pe"
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 px-6 rounded-lg text-center transition-colors border border-gray-300"
            >
              Enviar Correo
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}