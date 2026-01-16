import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Clients } from "@/components/Clients";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. SEO GLOBAL: Esto es lo que Google mostrará por defecto
export const metadata: Metadata = {
  title: {
    template: "%s | ILP Soluciones Logística",
    default: "ILP Soluciones Logística S.A.C. | Equipos de Carga y Descarga",
  },
  description: "Especialistas en rampas móviles, montacargas, equipos de almacén y servicios logísticos en Perú. Distribuidores autorizados PlusForce.",
  keywords: ["rampas moviles", "montacargas", "logistica peru", "ilp soluciones", "almacenes"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 2. IDIOMA: Cambiado a español 'es'
    <html lang="es" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        {/* Navbar fijo arriba */}
        <Navbar />
        
        {/* El contenido necesita un pt-20 si el navbar es fijo siempre, 
            pero como el nuestro es transparente en Home, lo controlamos en cada página */}
        <div className="flex flex-col min-h-screen">
          {children}
        </div>
        
        {/* Footer al final */}
        <Footer />
      </body>
    </html>
  );
}