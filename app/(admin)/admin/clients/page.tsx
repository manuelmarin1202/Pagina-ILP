import { createClient } from "@/utils/supabase/server"
import { addClient, deleteClient } from "./actions"
import Image from "next/image"

export default async function AdminClientsPage() {
  const supabase = await createClient()
  const { data: clients } = await supabase.from("clients").select("*").order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-[#232755]">Gestión de Clientes ({clients?.length})</h1>

      {/* FORMULARIO RÁPIDO */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-sm font-bold mb-4">Agregar Nuevo Cliente</h2>
        <form action={addClient} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-xs text-gray-500">Nombre Empresa</label>
            <input name="name" required className="w-full border p-2 rounded" placeholder="Ej: Maersk" />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500">Logo (PNG/SVG)</label>
            <input type="file" name="image" required accept="image/*" className="w-full text-sm" />
          </div>
          <button className="bg-[#232755] text-white px-4 py-2 rounded font-bold hover:bg-blue-900">
            Subir Logo
          </button>
        </form>
      </div>

      {/* LISTA DE LOGOS */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {clients?.map((client) => {
            const url = supabase.storage.from("catalog").getPublicUrl(client.logo_path).data.publicUrl
            return (
              <div key={client.id} className="border rounded p-4 flex flex-col items-center gap-2 relative group bg-white">
                <div className="relative w-full h-16">
                  <Image src={url} alt={client.name} fill className="object-contain" sizes="150px" />
                </div>
                <p className="text-xs font-bold text-center">{client.name}</p>
                
                {/* Botón borrar (Server Action en línea) */}
                <form action={deleteClient.bind(null, client.id, client.logo_path)}>
                  <button className="text-red-500 text-xs hover:underline">Eliminar</button>
                </form>
              </div>
            )
        })}
      </div>
    </div>
  )
}