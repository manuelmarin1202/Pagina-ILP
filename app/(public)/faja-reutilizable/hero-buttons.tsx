"use client"

import Link from "next/link"
import { Play } from "lucide-react"

export function HeroButtons() {
  const scrollToVideo = () => {
    const section = document.getElementById('video-demo')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {/* Botón de WhatsApp (Enlace externo normal) */}
      <Link 
        href="https://wa.me/51938231707?text=Hola,%20quiero%20una%20cotización%20de%20Fajas"
        target="_blank"
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-full transition-all hover:scale-105 shadow-xl shadow-green-500/30 text-lg flex items-center justify-center text-center"
      >
        Cotizar para mi Empresa
      </Link>

      {/* Botón de Scroll (JavaScript puro) */}
      <button 
        onClick={scrollToVideo}
        className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-4 px-8 rounded-full backdrop-blur-md transition-all flex items-center gap-2 justify-center cursor-pointer"
      >
        <Play className="w-5 h-5 fill-current" /> Ver Funcionamiento
      </button>
    </div>
  )
}