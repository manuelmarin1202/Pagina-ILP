"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function addClient(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get("name") as string
  const imageFile = formData.get("image") as File

  if (!imageFile || imageFile.size === 0) return

  // Subir logo
  const fileExt = imageFile.name.split(".").pop()
  const fileName = `client-${Date.now()}.${fileExt}`
  const filePath = `clients/${fileName}` // Guardamos en carpeta clients/

  await supabase.storage.from("catalog").upload(filePath, imageFile)

  // Guardar en BD
  await supabase.from("clients").insert({
    name,
    logo_path: filePath
  })

  revalidatePath("/admin/clients")
  revalidatePath("/") // Para que se actualice el home
}

export async function deleteClient(id: string, path: string) {
  const supabase = await createClient()
  await supabase.storage.from("catalog").remove([path])
  await supabase.from("clients").delete().eq("id", id)
  
  revalidatePath("/admin/clients")
  revalidatePath("/")
}