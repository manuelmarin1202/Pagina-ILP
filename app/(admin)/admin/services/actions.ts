"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteService(id: string) {
  const supabase = await createClient()

  // 1. Obtener el servicio para saber qué imagen borrar
  const { data: service } = await supabase
    .from("services")
    .select("image_path")
    .eq("id", id)
    .single()

  if (service?.image_path) {
    // 2. Borrar la imagen del Storage
    await supabase.storage.from("catalog").remove([service.image_path])
  }

  // 3. Borrar el registro de la BD
  const { error } = await supabase.from("services").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  // 4. Recargar la página de servicios
  revalidatePath("/admin/services")
}