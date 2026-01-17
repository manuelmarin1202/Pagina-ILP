import { createClient } from "@/utils/supabase/server"
import { DeleteButton } from "@/components/delete-button" // Reúsalo
import Image from "next/image"
import Link from "next/link"
import { Wrench } from "lucide-react"

const STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catalog/`

export default async function AdminServicesPage() {
  const supabase = await createClient()

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#232755]">Servicios</h1>
          <p className="text-gray-500">Alquiler, mantenimiento y capacitaciones.</p>
        </div>
        <Link 
          href="/admin/services/new"
          className="bg-[#ed9b19] hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2"
        >
          + Nuevo Servicio
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-900 font-bold uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Imagen</th>
              <th className="px-6 py-4">Título</th>
              <th className="px-6 py-4">Descripción Corta</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services?.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border bg-gray-100">
                    {service.image_path ? (
                      <Image src={`${STORAGE_URL}${service.image_path}`} alt={service.title} fill className="object-cover" />
                    ) : (
                      <Wrench className="p-2 w-full h-full text-gray-400" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-[#232755]">{service.title}</td>
                <td className="px-6 py-4 text-gray-500 truncate max-w-xs">{service.short_description}</td>
                <td className="px-6 py-4 text-right flex justify-end gap-4 items-center mt-3">
                  <Link href={`/admin/services/${service.id}`} className="text-blue-600 font-bold hover:underline">Editar</Link>
                  {/* Asegúrate de que tu DeleteButton acepte la prop 'table="services"' si lo hiciste dinámico, o crea uno para servicios */}
                  <DeleteButton id={service.id} table="services" /> 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {services?.length === 0 && <div className="p-8 text-center text-gray-400">No hay servicios registrados.</div>}
      </div>
    </div>
  )
}