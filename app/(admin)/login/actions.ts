"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = await createClient()

  // 1. Iniciar Sesión
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect("/login?message=Credenciales incorrectas. Intenta de nuevo.")
  }

  // 2. VERIFICACIÓN DE ROL (Mejora Crítica)
  // Antes de redirigir, preguntamos: "¿Quién es este usuario?"
  if (data.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    // 3. Redirección basada en Rol
    if (profile?.role === 'admin') {
      return redirect("/admin") // El jefe va al panel
    } else {
      // Si es operario, quizás no debería entrar al admin panel.
      // Lo mandamos al home o a una página de "Descarga la App"
      return redirect("/") 
    }
  }

  // Fallback por seguridad
  return redirect("/")
}

// --- NUEVA ACCIÓN PARA CERRAR SESIÓN ---
// Esta es la que usa tu botón "Salir" en el Navbar
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect("/login")
}