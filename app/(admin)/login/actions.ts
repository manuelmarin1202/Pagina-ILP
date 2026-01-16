"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // CORRECCIÓN: En lugar de 'return { error: ... }', 
    // redirigimos con un parámetro en la URL.
    // Esto satisface a TypeScript (porque redirect lanza un error interno tipo 'never')
    // y alimenta la lógica de tu page.tsx.
    return redirect("/login?message=Credenciales incorrectas. Intenta de nuevo.")
  }

  return redirect("/admin")
}