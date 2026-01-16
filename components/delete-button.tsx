"use client"

import { useState } from "react"
import { deleteProduct } from "@/app/(admin)/admin/products/actions"

export function DeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    // Confirmación simple del navegador
    if (!confirm("¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.")) return

    setLoading(true)
    try {
      await deleteProduct(id)
      // No necesitamos hacer nada más, la Server Action recarga la página
    } catch (error) {
      alert("Error al eliminar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={loading}
      className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
    >
      {loading ? "..." : "Borrar"}
    </button>
  )
}