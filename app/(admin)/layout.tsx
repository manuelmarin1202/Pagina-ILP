// app/(admin)/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css"; // Asegúrate de importar los estilos globales si los necesitas

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  )
}