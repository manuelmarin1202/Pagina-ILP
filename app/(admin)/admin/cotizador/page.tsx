"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { QuotationDocument } from "@/components/pdf/QuotationDocument"
import { Plus, Trash2, FileDown, Search, ChevronDown, ChevronUp } from "lucide-react"

const STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catalog/`

export default function CotizadorPage() {
  const supabase = createClient()
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null)
  
  // CONFIGURACIÓN GLOBAL
  const [currency, setCurrency] = useState<'USD' | 'PEN'>('USD')

  // DATOS COTIZACIÓN
  const [client, setClient] = useState({ name: "", ruc: "", address: "", contact: "" })
  const [reference, setReference] = useState("")
  const [introText, setIntroText] = useState("De acuerdo a su solicitud, nos permitimos presentar respetuosamente nuestra propuesta de servicios para el proyecto referenciado en el asunto.")
  const [items, setItems] = useState<any[]>([])
  const [terms, setTerms] = useState("La tarifa incluye la entrega en Av. Los Forestales – Mz F - Villa El Salvador, Lima - Perú.\nTiempo de entrega: Inmediata.\nGarantía: 12 meses.\nForma de pago: Crédito de 30 días.")

  useEffect(() => {
    const fetchProducts = async () => {
      // CORRECCIÓN CRÍTICA: Pedimos product_gallery(*) para tener el variant_id
      const { data } = await supabase
        .from("products")
        .select(`
          id, name, description, image_path, youtube_url,
          product_variants(*),
          product_gallery(*) 
        `)
      setProducts(data || [])
    }
    fetchProducts()
  }, [])

  // AGREGAR VARIANTE ESPECÍFICA
  // DENTRO DE: app/(admin)/admin/cotizador/page.tsx

  const addVariantToQuote = (product: any, variant: any) => {
    
    // --- CORRECCIÓN DEL FILTRO DE GALERÍA ---
    const rawGallery = product.product_gallery || [];
    
    const filteredGallery = rawGallery
      .filter((g: any) => {
         // CASO 1: La foto es específica de ESTA variante (IDs coinciden)
         if (g.variant_id === variant.id) return true;
         
         // CASO 2: La foto es general (variant_id es null, undefined o string vacío)
         if (!g.variant_id) return true;

         // CASO 3: Si tiene otro ID diferente, LA DESCARTAMOS
         return false;
      })
      .map((g: any) => `${STORAGE_URL}${g.image_path}`);

    // Debugging (Opcional: puedes ver esto en la consola del navegador para verificar)
    console.log(`Variante: ${variant.model_code}`, filteredGallery);

    const newItem = {
      id: crypto.randomUUID(),
      title: product.name,
      model: variant.model_code,
      description: product.description?.substring(0, 100) || "",
      // Si la variante tiene foto, úsala. Si no, la del padre.
      image: variant.image_path 
        ? `${STORAGE_URL}${variant.image_path}` 
        : (product.image_path ? `${STORAGE_URL}${product.image_path}` : null),
      quantity: 1,
      price: 0,
      type: 'venta',
      months: 1,
      specs: variant.technical_specs || [],
      
      gallery: filteredGallery, // <--- Aquí va la lista ya limpia
      
      youtube: product.youtube_url
    }
    setItems([...items, newItem])
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index)) 
  }

  const calculateTotal = () => {
    return items.reduce((acc, item) => {
      const sub = item.type === 'alquiler' 
        ? item.price * item.quantity * (item.months || 1)
        : item.price * item.quantity
      return acc + sub
    }, 0)
  }

  const quotationData = {
    id: `COT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
    date: new Date().toLocaleDateString("es-PE"),
    currency,
    client,
    items,
    terms,
    reference,
    introText
  }

  return (
    <div className="container mx-auto p-6 pb-32">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#232755]">Cotizador Pro</h1>
        
        {/* SELECTOR DE MONEDA */}
        <div className="flex bg-white rounded-lg border overflow-hidden">
          <button 
            onClick={() => setCurrency('USD')} 
            className={`px-4 py-2 font-bold ${currency === 'USD' ? 'bg-[#232755] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            USD ($)
          </button>
          <button 
            onClick={() => setCurrency('PEN')} 
            className={`px-4 py-2 font-bold ${currency === 'PEN' ? 'bg-[#232755] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            SOLES (S/)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA: BUSCADOR DE PRODUCTOS (4 cols) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-xl shadow-sm border h-[600px] flex flex-col">
          <h2 className="font-bold mb-4 text-[#232755]">Catálogo</h2>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <input 
              className="w-full border p-2 pl-10 rounded-lg text-sm" 
              placeholder="Buscar equipo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-2">
            {products
              .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
              .map(product => (
              <div key={product.id} className="border rounded-lg overflow-hidden">
                {/* CABECERA PRODUCTO */}
                <div 
                  className="p-3 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100"
                  onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       {product.image_path && <img src={`${STORAGE_URL}${product.image_path}`} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <span className="font-bold text-xs text-[#232755] w-32 truncate">{product.name}</span>
                  </div>
                  {expandedProduct === product.id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </div>

                {/* LISTA DE VARIANTES (Solo si está expandido) */}
                {expandedProduct === product.id && (
                  <div className="bg-white p-2 border-t">
                    <p className="text-[10px] text-gray-400 mb-2 uppercase font-bold">Selecciona Modelo:</p>
                    {product.product_variants && product.product_variants.length > 0 ? (
                      <div className="space-y-1">
                        {product.product_variants.map((v: any) => (
                          <button 
                            key={v.id}
                            onClick={() => addVariantToQuote(product, v)}
                            className="w-full text-left text-xs p-2 hover:bg-[#ed9b19]/10 text-gray-700 hover:text-[#ed9b19] rounded flex justify-between items-center group"
                          >
                            <span>{v.model_code} <span className="text-gray-400 text-[10px]">({v.capacity})</span></span>
                            <Plus size={14} className="opacity-0 group-hover:opacity-100" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-red-400 p-2">Sin modelos registrados</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: ARMADO DE COTIZACIÓN (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
            <h2 className="font-bold mb-4 text-[#232755]">Datos de Portada</h2>
            <input 
              className="w-full border p-2 rounded mb-2 text-sm" 
              placeholder="Referencia (Ej: ALQUILER DE MONTACARGAS...)" 
              value={reference} 
              onChange={e => setReference(e.target.value)} 
            />
            <textarea 
              className="w-full border p-2 rounded text-sm h-20" 
              placeholder="Texto de introducción (Saludo)..." 
              value={introText} 
              onChange={e => setIntroText(e.target.value)} 
            />
          </div>
          {/* CLIENTE */}
          <div className="bg-white p-6 rounded-xl shadow-sm border grid grid-cols-2 gap-4">
            
            <input className="border p-2 rounded text-sm" placeholder="Razón Social" value={client.name} onChange={e => setClient({...client, name: e.target.value})} />
            <input className="border p-2 rounded text-sm" placeholder="RUC" value={client.ruc} onChange={e => setClient({...client, ruc: e.target.value})} />
            <input className="border p-2 rounded text-sm" placeholder="Dirección" value={client.address} onChange={e => setClient({...client, address: e.target.value})} />
            <input className="border p-2 rounded text-sm" placeholder="Contacto" value={client.contact} onChange={e => setClient({...client, contact: e.target.value})} />
          </div>

          {/* LISTA DE ITEMS */}
          <div className="bg-white p-6 rounded-xl shadow-sm border min-h-[300px]">
            <h2 className="font-bold mb-4 text-[#232755]">Items a Cotizar</h2>
            
            {items.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed rounded-lg bg-gray-50">
                <p className="text-gray-400">Selecciona modelos del panel izquierdo</p>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-4 relative bg-gray-50/50">
                    <button onClick={() => removeItem(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-600">
                      <Trash2 size={18}/>
                    </button>

                    <div className="flex gap-4 mb-4">
                      {/* Imagen */}
                      <div className="w-16 h-16 bg-white border rounded-md overflow-hidden shrink-0">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                         {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                      </div>
                      
                      {/* Textos */}
                      <div className="flex-1">
                        <h3 className="font-bold text-[#232755]">{item.title}</h3>
                        <p className="text-xs font-bold text-[#ed9b19] mb-1">Modelo: {item.model}</p>
                        
                        {/* Toggle Specs */}
                        <div className="text-[10px] text-gray-500 bg-white p-2 rounded border inline-block">
                          {item.specs.length} especificaciones cargadas (Se verán en PDF)
                        </div>
                      </div>
                    </div>

                    {/* CONTROLES DE PRECIO Y TIPO */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end bg-white p-3 rounded border">
                      
                      {/* 1. TIPO DE TRANSACCIÓN */}
                      <div className="md:col-span-1">
                        <label className="text-[10px] font-bold block mb-1">Operación</label>
                        <select 
                          className="w-full border p-1.5 rounded text-sm"
                          value={item.type}
                          onChange={e => updateItem(index, 'type', e.target.value)}
                        >
                          <option value="venta">VENTA</option>
                          <option value="alquiler">ALQUILER</option>
                        </select>
                      </div>

                      {/* 2. CANTIDAD */}
                      <div className="md:col-span-1">
                        <label className="text-[10px] font-bold block mb-1">Cantidad</label>
                        <input type="number" min="1" className="w-full border p-1.5 rounded text-sm" value={item.quantity} onChange={e => updateItem(index, 'quantity', Number(e.target.value))} />
                      </div>

                      {/* 3. PRECIO UNITARIO */}
                      <div className="md:col-span-1">
                        <label className="text-[10px] font-bold block mb-1">
                          {item.type === 'venta' ? 'Precio Unit.' : 'Renta Mensual'}
                        </label>
                        <input type="number" className="w-full border p-1.5 rounded text-sm" value={item.price} onChange={e => updateItem(index, 'price', Number(e.target.value))} />
                      </div>

                      {/* 4. MESES (Solo si es alquiler) */}
                      <div className="md:col-span-1">
                         {item.type === 'alquiler' ? (
                           <>
                            <label className="text-[10px] font-bold block mb-1">Meses</label>
                            <input type="number" min="1" className="w-full border p-1.5 rounded text-sm bg-yellow-50" value={item.months} onChange={e => updateItem(index, 'months', Number(e.target.value))} />
                           </>
                         ) : <div className="h-8 bg-gray-100 rounded opacity-20"></div>}
                      </div>

                      {/* 5. SUBTOTAL */}
                      <div className="md:col-span-1 text-right">
                        <span className="text-xs text-gray-400 block">Subtotal</span>
                        <span className="font-bold text-[#232755]">
                           {currency === 'USD' ? '$' : 'S/'} 
                           {(item.type === 'alquiler' 
                             ? item.price * item.quantity * item.months 
                             : item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                    </div>
                  </div>
                ))}

                {/* TOTALES GLOBALES */}
                <div className="flex justify-end pt-4 border-t mt-4">
                  <div className="text-right">
                    <p className="text-gray-500 text-sm">Subtotal: {calculateTotal().toFixed(2)}</p>
                    <p className="text-gray-500 text-sm">IGV (18%): {(calculateTotal() * 0.18).toFixed(2)}</p>
                    <p className="text-2xl font-black text-[#232755] mt-1">
                      TOTAL: {currency === 'USD' ? '$' : 'S/'} {(calculateTotal() * 1.18).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* FOOTER ACCIONES */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] px-8">
        <div className="text-xs text-gray-400">
           {items.length} items en cotización • Moneda: {currency}
        </div>
        
        {items.length > 0 && client.name ? (
          <PDFDownloadLink 
            document={<QuotationDocument data={quotationData} />} 
            fileName={`COT-${client.name.replace(/ /g, '_')}-${new Date().toLocaleDateString()}.pdf`}
          >
             {/* @ts-ignore */}
            {({ blob, url, loading, error }) => (
              <button 
                disabled={loading}
                className="bg-[#232755] hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
              >
                {loading ? "Generando..." : <><FileDown size={20} /> Descargar PDF</>}
              </button>
            )}
          </PDFDownloadLink>
        ) : (
          <button disabled className="bg-gray-200 text-gray-400 font-bold py-3 px-8 rounded-lg cursor-not-allowed">
            Completa Cliente e Items
          </button>
        )}
      </div>
    </div>
  )
}