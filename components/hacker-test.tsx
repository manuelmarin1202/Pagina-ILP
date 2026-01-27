"use client"

import { createClient } from "@/utils/supabase/client"
import { useState } from "react"

export default function HackerTest() {
  const [result, setResult] = useState<string>("Esperando ataque...")

  const runHack = async () => {
    const supabase = createClient()
    
    // INTENTO DE HACKEO: Leer todos los perfiles sin filtro
    const { data, error } = await supabase.from('profiles').select('*')

    if (error) {
      setResult("❌ Error de BD: " + error.message)
    } else {
      console.log("DATOS ROBADOS:", data) // Míralo en la consola F12
      
      if (data && data.length > 1) {
        setResult(`⚠️ PELIGRO CRÍTICO: Pude descargar ${data.length} perfiles. El RLS está fallando.`)
      } else {
        setResult(`✅ SISTEMA SEGURO: Solo pude ver ${data.length} perfil (el mío).`)
      }
    }
  }

  return (
    <div className="p-4 bg-black text-green-400 font-mono rounded-lg my-4 border border-green-700">
      <h3 className="font-bold">CONSOLE HACK TEST</h3>
      <p className="text-xs mb-2">Simula una inyección JS para leer toda la tabla profiles.</p>
      <button 
        onClick={runHack}
        className="bg-green-900 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        EJECUTAR ROBO DE DATOS
      </button>
      <div className="mt-4 p-2 border border-green-900 bg-black/50 text-sm">
        {result}
      </div>
    </div>
  )
}