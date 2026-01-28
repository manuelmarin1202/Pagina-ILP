import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, PackageOpen, FilterX, Search } from "lucide-react"

// URL BASE
const STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catalog/`

// Definimos los props para Next.js 15 (searchParams es una Promesa)
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CatalogPage({ searchParams }: Props) {
  const supabase = await createClient()

  // 1. LEER EL FILTRO DE LA URL
  const { categoria } = await searchParams
  const categorySlug = typeof categoria === 'string' ? categoria : null

  // 2. CONSTRUIR LA CONSULTA
  // Usamos 'let' porque vamos a modificar la consulta según si hay filtro o no.
  // Nota: 'categories!inner(*)' hace un INNER JOIN. Esto significa:
  // "Tráeme los productos PERO SOLO si coinciden con el filtro de categoría que pondré abajo".
  let query = supabase
    .from("products")
    .select(`
      *,
      categories!inner (
        name,
        slug
      )
    `)
    .order("created_at", { ascending: false })

  // 3. APLICAR FILTRO SI EXISTE
  if (categorySlug) {
    query = query.eq('categories.slug', categorySlug)
  }

  const { data: products, error } = await query

  // --- OBTENER EL NOMBRE DE LA CATEGORÍA ACTUAL PARA EL TÍTULO ---
  // (Cosmético: para que el título diga "Catálogo de Maquinaria" en vez de genérico)
  let currentCategoryName = "Catálogo General"
  if (categorySlug && products && products.length > 0) {
    // Tomamos el nombre de la categoría del primer producto encontrado
    // @ts-ignore (Supabase a veces se queja de los tipos en joins complejos, esto lo soluciona rápido)
    currentCategoryName = products[0].categories?.name || categorySlug
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        
        {/* CABECERA DINÁMICA */}
        <div className="text-center mb-10">
          <span className="text-[#ed9b19] font-bold tracking-widest uppercase text-sm">
            Nuestra Flota 2026
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-[#232755] mt-2 capitalize">
            {currentCategoryName}
          </h1>
          
          {/* BOTÓN PARA QUITAR FILTROS */}
          {categorySlug && (
            <div className="mt-4">
              <Link 
                href="/catalogo" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-bold hover:bg-red-100 transition-colors"
              >
                <FilterX size={16} />
                Borrar Filtros (Ver todo)
              </Link>
            </div>
          )}
        </div>

        {/* MENÚ RÁPIDO DE CATEGORÍAS (Opcional, ayuda a navegar sin volver al home) */}
        {!categorySlug && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <CategoryPill slug="maquinaria-elevacion" label="Maquinaria" />
            <CategoryPill slug="infraestructura-carga" label="Infraestructura" />
            <CategoryPill slug="aditamentos" label="Aditamentos" />
            <CategoryPill slug="equipos-almacen-eco" label="Equipos de almacén y Eco-Logística" />
            <CategoryPill slug="merchandising" label="Merchandising" />
          </div>
        )}

        {/* GRID DE PRODUCTOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products?.map((product) => {
            const imageUrl = product.image_path 
              ? `${STORAGE_URL}${product.image_path}` 
              : null
            const isFaja = product.slug.includes('faja') || product.name.toLowerCase().includes('faja')
            // @ts-ignore
            const catName = product.categories?.name || "Equipo"
            const productLink = isFaja ? '/faja-reutilizable' : `/catalogo/${product.slug}`
            return (
              <Link 
                key={product.id} 
                href={productLink}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
              >
                {/* Imagen */}
                <div className="relative h-64 bg-gray-100 overflow-hidden">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-100">
                      <PackageOpen size={48} strokeWidth={1} />
                    </div>
                  )}
                  
                  {/* Badge de Categoría */}
                  <div className="absolute top-4 left-4 bg-[#232755]/90 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm shadow-md uppercase tracking-wider">
                    {catName}
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-[#232755] mb-2 group-hover:text-[#ed9b19] transition-colors leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center text-[#ed9b19] font-bold text-sm mt-auto group/btn">
                    Ver Detalles
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* ESTADO VACÍO (Importante si el filtro no encuentra nada) */}
        {(!products || products.length === 0) && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No encontramos equipos en esta categoría</h3>
            <p className="text-gray-500 mt-1 mb-6">Prueba seleccionando otra división o ver todo el catálogo.</p>
            <Link href="/catalogo" className="inline-block px-6 py-3 bg-[#232755] text-white rounded-lg font-bold hover:bg-opacity-90">
              Ver Todo el Catálogo
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}

// Subcomponente para los botones de filtro rápido
function CategoryPill({ slug, label }: { slug: string, label: string }) {
  return (
    <Link 
      href={`/catalogo?categoria=${slug}`}
      className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-[#ed9b19] hover:text-[#ed9b19] transition-all font-medium"
    >
      {label}
    </Link>
  )
}