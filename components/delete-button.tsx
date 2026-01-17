"use client"

import { useState } from "react"
// Importamos AMBAS acciones
import { deleteProduct } from "@/app/(admin)/admin/products/actions"
import { deleteService } from "@/app/(admin)/admin/services/actions"

// Definimos qué tablas soporta el botón
type TableType = "products" | "services" | "clients"

export function DeleteButton({ id, table }: { id: string, table: TableType }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar este ítem? Esta acción no se puede deshacer.")) return

    setLoading(true)
    try {
      // DECIDIMOS QUÉ BORRAR SEGÚN LA PROP 'table'
      if (table === "products") {
        await deleteProduct(id)
      } else if (table === "services") {
        await deleteService(id)
      } 
      // Aquí agregarás: else if (table === "clients") ...
      
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
      className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50 text-sm flex items-center gap-1"
    >
      <TrashIcon />
      {loading ? "..." : "Borrar"}
    </button>
  )
}

// Icono simple para decorar
function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    </svg>
  )
}