import { createClient } from "@/utils/supabase/server"
import Image from "next/image"

export async function Clients() {
  const supabase = await createClient()
  
  // Traemos los clientes ordenados
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("display_order", { ascending: true })

  if (!clients || clients.length === 0) return null

  return (
    <section className="py-10 bg-white border-b border-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 mb-8 text-center">
        <h3 className="text-sm font-bold text-[#ed9b19] uppercase tracking-widest mb-2">
          Confianza Industrial
        </h3>
        <p className="text-gray-400 text-sm">
          Más de {clients.length} empresas confían en nuestra logística
        </p>
      </div>

      {/* SOLUCIÓN DEL LOOP INFINITO:
         Usamos 'flex' en el padre para poner los dos vagones en línea.
         Cada vagón (div) tiene 'animate-scroll' y 'min-w-full'.
      */}
      <div className="relative w-full flex overflow-hidden mask-linear-fade group">
        
        {/* VAGÓN 1: Se mueve hacia la izquierda */}
        <div className="flex animate-scroll whitespace-nowrap min-w-full shrink-0 items-center justify-around gap-16 px-8">
          {clients.map((client) => (
            <div key={client.id} className="relative w-32 h-16 flex-shrink-0 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100 cursor-pointer">
               <Image 
                 src={supabase.storage.from("catalog").getPublicUrl(client.logo_path).data.publicUrl}
                 alt={client.name}
                 fill
                 className="object-contain"
                 sizes="128px"
               />
            </div>
          ))}
        </div>

        {/* VAGÓN 2: Idéntico al 1, le sigue inmediatamente */}
        <div className="flex animate-scroll whitespace-nowrap min-w-full shrink-0 items-center justify-around gap-16 px-8">
          {clients.map((client) => (
            <div key={`${client.id}-clone`} className="relative w-32 h-16 shrink-0 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100 cursor-pointer">
               <Image 
                 src={supabase.storage.from("catalog").getPublicUrl(client.logo_path).data.publicUrl}
                 alt={client.name}
                 fill
                 className="object-contain"
                 sizes="128px"
               />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}