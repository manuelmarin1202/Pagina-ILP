import { createClient } from "@/utils/supabase/server"
import { DeleteButton } from "@/components/delete-button" // Si ya lo creaste
import Image from "next/image"
import Link from "next/link"

export default async function AdminProductsPage() {
  const supabase = await createClient()

  // Solo traemos los datos, la seguridad ya la maneja el layout y middleware
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      categories (name),
      product_images (storage_path)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Encabezado y Botón Crear */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-gray-500">Administra el catálogo y fichas técnicas.</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="bg-[#ed9b19] hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg shadow-sm flex items-center gap-2 transition-transform hover:scale-105"
        >
          <span>+</span> Agregar Nuevo Producto
        </Link>
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-bold uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Imagen</th>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4 text-center">Destacado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products?.map((product) => {
                const imgPath = product.product_images?.[0]?.storage_path
                const imgUrl = imgPath 
                  ? supabase.storage.from("catalog").getPublicUrl(imgPath).data.publicUrl 
                  : "/placeholder.jpg"

                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                        <Image src={imgUrl} alt={product.name} fill className="object-cover" sizes="50px" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {/* @ts-ignore */}
                        {product.categories?.name || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {product.is_featured ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-4 items-center h-full mt-3">
                      <Link href={`/admin/products/${product.id}`} className="text-blue-600 hover:text-blue-900 font-bold">
                        Editar
                      </Link>
                      <DeleteButton id={product.id} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {products?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No hay productos. ¡Agrega el primero!</p>
          </div>
        )}
      </div>
    </div>
  )
}