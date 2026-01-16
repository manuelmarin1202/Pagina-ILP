"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  // 1. Recolectar datos básicos
  const name = formData.get("name") as string
  const slug = formData.get("slug") as string
  const category_id = formData.get("category_id") as string
  const description = formData.get("description") as string
  const is_featured = formData.get("is_featured") === "on"
  
  // 2. Procesar especificaciones (Vienen como JSON string desde el cliente)
  const specsRaw = formData.get("specs") as string
  const specs = JSON.parse(specsRaw || "{}")

  // 3. Subir Imagen (Si existe)
  const imageFile = formData.get("image") as File
  let imagePath = ""

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop()
    const fileName = `${slug}-${Date.now()}.${fileExt}`
    const filePath = `products/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("catalog")
      .upload(filePath, imageFile)

    if (uploadError) {
      console.error("Error subiendo imagen:", uploadError)
      throw new Error("Error al subir la imagen")
    }
    imagePath = filePath
  }

  // 4. Insertar Producto en DB
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      category_id,
      description,
      specs,
      is_featured,
    })
    .select()
    .single()

  if (productError) {
    console.error("Error creando producto:", productError)
    throw new Error("Error al guardar en base de datos")
  }

  // 5. Insertar Referencia de Imagen en DB
  if (imagePath) {
    await supabase.from("product_images").insert({
      product_id: product.id,
      storage_path: imagePath,
      alt_text: name,
      display_order: 1,
    })
  }

  // 6. Redirigir al dashboard
  redirect("/admin")
}

export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await createClient()
  
  // Recolectar datos
  const name = formData.get("name") as string
  const slug = formData.get("slug") as string
  const category_id = formData.get("category_id") as string
  const description = formData.get("description") as string
  const is_featured = formData.get("is_featured") === "on"
  const specsRaw = formData.get("specs") as string
  const specs = JSON.parse(specsRaw || "{}")

  // 1. Actualizar datos básicos
  const { error } = await supabase
    .from("products")
    .update({ name, slug, category_id, description, specs, is_featured })
    .eq("id", productId)

  if (error) throw new Error("Error actualizando producto")

  // 2. Manejar Imagen NUEVA (Solo si el usuario subió una)
  const imageFile = formData.get("image") as File
  if (imageFile && imageFile.size > 0) {
    // a. Subir nueva imagen
    const fileExt = imageFile.name.split(".").pop()
    const fileName = `${slug}-${Date.now()}.${fileExt}`
    const filePath = `products/${fileName}`
    
    await supabase.storage.from("catalog").upload(filePath, imageFile)

    // b. Actualizar referencia en BD (borramos la anterior y ponemos la nueva para simplificar)
    await supabase.from("product_images").delete().eq("product_id", productId)
    await supabase.from("product_images").insert({
      product_id: productId,
      storage_path: filePath,
      alt_text: name,
      display_order: 1
    })
  }

  revalidatePath("/admin")
  redirect("/admin")
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient()

  // 1. (Opcional) Borrar la imagen del Storage para no dejar basura
  // Primero obtenemos la ruta de la imagen
  const { data: images } = await supabase
    .from("product_images")
    .select("storage_path")
    .eq("product_id", productId)
  
  if (images && images.length > 0) {
    const paths = images.map(img => img.storage_path)
    await supabase.storage.from("catalog").remove(paths)
  }

  // 2. Borrar el producto de la BD (Por el "Cascade Delete", se borran las imágenes de la tabla product_images solas)
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)

  if (error) {
    throw new Error("Error al eliminar el producto")
  }

  // 3. Recargar la página del admin para que desaparezca de la lista
  revalidatePath("/admin")
}