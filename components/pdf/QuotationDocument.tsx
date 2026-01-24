/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Link } from '@react-pdf/renderer';

// Colores Corporativos
const COL_DARK = '#232755';
const COL_GOLD = '#ed9b19';
const COL_RED = '#FF0000'; 

const styles = StyleSheet.create({
  page: { padding: 30, paddingTop: 30, paddingBottom: 50, fontFamily: 'Helvetica', fontSize: 10, color: '#333' },
  
  // --- HEADER GLOBAL ---
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerLogo: { width: 40, height: 40, objectFit: 'contain' }, 
  headerTitleBlock: { flexDirection: 'column' },
  headerTitle: { fontSize: 10, color: COL_DARK, fontWeight: 'bold' },
  headerSlogan: { fontSize: 6, color: COL_GOLD, letterSpacing: 1, textTransform: 'uppercase' },
  headerRight: { alignItems: 'flex-end' },
  headerDocNum: { fontSize: 9, fontWeight: 'bold', color: '#666' },

  // --- PORTADA ---
  recipientBox: { marginTop: 20, marginBottom: 20 },
  recipientLabel: { fontSize: 10, fontWeight: 'bold', marginBottom: 2 },
  recipientText: { fontSize: 11, marginBottom: 1 },
  
  refBox: { marginTop: 10, marginBottom: 20 },
  refLabel: { fontSize: 10, fontWeight: 'bold', textDecoration: 'underline' },
  refText: { fontSize: 11, marginTop: 4, lineHeight: 1.4 },

  bodyText: { fontSize: 11, lineHeight: 1.6, textAlign: 'justify', marginBottom: 10 },
  
  signatureBox: { marginTop: 50 },
  sigName: { fontSize: 11, fontWeight: 'bold', color: COL_DARK },
  sigRole: { fontSize: 9, color: '#666' },

  // --- TABLA ECONÓMICA ---
  tableHeader: { flexDirection: 'row', backgroundColor: COL_DARK, color: 'white', padding: 6, alignItems: 'center', marginTop: 10 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#eee', padding: 8, alignItems: 'center' },
  colDesc: { width: '55%' },
  colQty: { width: '10%', textAlign: 'center' },
  colPrice: { width: '15%', textAlign: 'right' },
  colTotal: { width: '20%', textAlign: 'right' },
  
  // --- BLOQUE PAGO ---
  paymentBox: { marginTop: 15, padding: 10, backgroundColor: '#f5f7fa', borderRadius: 4, borderLeftWidth: 3, borderLeftColor: COL_DARK },
  paymentTitle: { fontSize: 9, fontWeight: 'bold', color: COL_DARK, marginBottom: 4 },
  paymentText: { fontSize: 9, marginBottom: 2 },

  // --- TÉCNICOS ---
  techTitle: { fontSize: 12, fontWeight: 'bold', color: COL_DARK, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: COL_GOLD, paddingBottom: 4, marginTop: 10 },
  
  // IMAGEN PRINCIPAL DEL PRODUCTO
  mainImageContainer: { height: 200, marginBottom: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: 4 },
  mainImage: { height: '100%', objectFit: 'contain' },
  
  // SPECS MEJORADOS (Más separación)
  specRow: { flexDirection: 'row', marginBottom: 4, borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0', paddingBottom: 3 },
  specKey: { width: '35%', fontSize: 8, fontWeight: 'bold', color: '#555', paddingRight: 8 }, 
  specValue: { width: '65%', fontSize: 8, color: '#000' },

  // GALERÍA MEJORADA (MÁS GRANDE)
  gallerySection: { marginTop: 20 },
  galleryTitle: { fontSize: 10, fontWeight: 'bold', marginBottom: 8, color: '#232755', textTransform: 'uppercase' },
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  // CAMBIO CLAVE: width 48% para que sean 2 columnas grandes, height 150
  galleryItem: { width: '48%', height: 150, backgroundColor: '#fff', borderRadius: 4, border: '1px solid #eee', padding: 5, marginBottom: 5 },
  galleryImg: { width: '100%', height: '100%', objectFit: 'contain' },

  // Video
  videoButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ff0000', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, alignSelf: 'center', marginTop: 10, marginBottom: 20 },
  videoText: { color: 'white', fontSize: 10, fontWeight: 'bold' },

  // Footer
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  footerText: { fontSize: 7, color: '#999', textAlign: 'center' },
});

interface QuotationData {
  id: string
  date: string
  currency: 'USD' | 'PEN'
  client: { name: string; ruc: string; address: string; contact: string }
  reference: string
  introText: string
  items: Array<{
    title: string
    model: string
    description: string
    image: string | null
    quantity: number
    price: number
    type: 'venta' | 'alquiler'
    months?: number
    specs: Array<{ key: string; value: string }>
    gallery: string[] 
    youtube?: string
  }>
  terms: string
}

const Header = ({ id }: { id: string }) => (
  <View style={styles.headerContainer}>
    <View style={styles.headerLeft}>
      <Image src="https://akutexkthhotpsztnlue.supabase.co/storage/v1/object/public/catalog/logo-ilp.png" style={styles.headerLogo} /> 
      <View style={styles.headerTitleBlock}>
        <Text style={styles.headerTitle}>ILP SOLUCIONES LOGISTICA S.A.C.</Text>
        <Text style={styles.headerSlogan}>AL SERVICIO DE LA CADENA DE SUMINISTRO</Text>
      </View>
    </View>
    <View style={styles.headerRight}>
      <Text style={styles.headerDocNum}>COTIZACIÓN N° {id}</Text>
    </View>
  </View>
);

// HELPER FECHA ROBUSTO
const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    // Si viene con barras (20/1/2026)
    if (dateString.includes('/')) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
            return `${parts[0]} de ${months[parseInt(parts[1]) - 1]} de ${parts[2]}`;
        }
    }
    // Si viene con guiones (2026-01-20)
    if (dateString.includes('-')) {
        const parts = dateString.split('-');
        // Asumiendo YYYY-MM-DD
        if (parts[0].length === 4) {
             return `${parts[2]} de ${months[parseInt(parts[1]) - 1]} de ${parts[0]}`;
        }
    }
    return dateString;
};

export const QuotationDocument = ({ data }: { data: QuotationData }) => {
  const symbol = data.currency === 'USD' ? '$' : 'S/';
  const calculateTotal = (item: any) => item.type === 'alquiler' ? item.price * item.quantity * (item.months || 1) : item.price * item.quantity;
  const totalAmount = data.items.reduce((acc, i) => acc + calculateTotal(i), 0);
  const igvAmount = totalAmount * 0.18;
  const grandTotal = totalAmount + igvAmount;

  return (
    <Document>
      {/* PÁGINA 1 */}
      <Page size="A4" style={styles.page}>
        <Header id={data.id} />
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
          <Text style={{ fontSize: 10 }}>Lima, {formatDate(data.date)}</Text>
        </View>
        <View style={styles.recipientBox}>
          <Text style={styles.recipientLabel}>Señores:</Text>
          <Text style={[styles.recipientText, { fontSize: 12, fontWeight: 'bold' }]}>{data.client.name.toUpperCase()}</Text>
          <Text style={styles.recipientText}>RUC: {data.client.ruc}</Text>
          {data.client.address && <Text style={styles.recipientText}>Dirección: {data.client.address}</Text>} 
          <Text style={styles.recipientText}>Atención: {data.client.contact}</Text>
        </View>
        <View style={styles.refBox}>
          <Text style={styles.refLabel}>Referencia:</Text>
          <Text style={styles.refText}>{data.reference.toUpperCase()}</Text>
        </View>
        <Text style={styles.bodyText}>{data.introText || "De acuerdo a su solicitud..."}</Text>
        <Text style={styles.bodyText}>Agradecemos su amable atención y quedamos atentos a sus comentarios.</Text>
        <View style={styles.signatureBox}>
          <Text style={styles.bodyText}>Atentamente,</Text>
          <Text style={styles.sigName}>Ing. Manuel Marín Leonardo</Text>
          <Text style={styles.sigRole}>Gerente Comercial</Text>
          <Text style={styles.sigRole}>938 231 707</Text>
          <Text style={styles.sigRole}>ILP Soluciones Logística S.A.C.</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Calle Sibelius # 148 Oficina 102 - San Borja | Panamericana Sur Km 38 BSF</Text>
          <Text style={styles.footerText}>Cel: 938 231 707| www.ilpsolucioneslogistica.com.pe</Text>
        </View>
      </Page>

      {/* PÁGINA 2 */}
      <Page size="A4" style={styles.page}>
        <Header id={data.id} />
        <Text style={styles.techTitle}>RESUMEN ECONÓMICO</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.colDesc}>Descripción</Text>
          <Text style={styles.colQty}>Cant.</Text>
          <Text style={styles.colPrice}>P. Unit</Text>
          <Text style={styles.colTotal}>Total</Text>
        </View>
        {data.items.map((item, idx) => (
          <View key={idx} style={styles.tableRow}>
            <View style={styles.colDesc}>
              <Text style={{fontWeight: 'bold', fontSize: 10}}>{item.title}</Text>
              <Text style={{fontSize: 8, color: '#666'}}>Modelo: {item.model}</Text>
              {item.type === 'alquiler' && <Text style={{fontSize: 8, fontStyle: 'italic'}}>(Alquiler por {item.months} meses)</Text>}
            </View>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colPrice}>{symbol} {item.price.toFixed(2)}</Text>
            <Text style={styles.colTotal}>{symbol} {calculateTotal(item).toFixed(2)}</Text>
          </View>
        ))}
        <View style={{ alignItems: 'flex-end', marginTop: 15, paddingRight: 10 }}>
          <Text style={{ fontSize: 9, color: '#666', marginBottom: 2 }}>Subtotal: {symbol} {totalAmount.toFixed(2)}</Text>
          <Text style={{ fontSize: 9, color: '#666', marginBottom: 4 }}>IGV (18%): {symbol} {igvAmount.toFixed(2)}</Text>
          <View style={{ borderTopWidth: 1, borderTopColor: COL_DARK, paddingTop: 4, width: 150, alignItems: 'flex-end' }}>
             <Text style={{ fontSize: 11, fontWeight: 'bold', color: COL_DARK }}>TOTAL: {symbol} {grandTotal.toFixed(2)}</Text>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 5 }}>CONSIDERACIONES COMERCIALES:</Text>
          <Text style={{ fontSize: 9, lineHeight: 1.5, color: '#444' }}>{data.terms}</Text>
        </View>
        <View style={styles.paymentBox}>
          <Text style={styles.paymentTitle}>GIRAR LA OC A NOMBRE DE:</Text>
          <Text style={styles.paymentText}>RAZÓN SOCIAL: ILP SOLUCIONES LOGISTICA SAC</Text>
          <Text style={styles.paymentText}>RUC: 20608693468</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Cotización N° {data.id} - Pág. 2</Text>
        </View>
      </Page>

      {/* PÁGINAS TÉCNICAS */}
      {data.items.map((item, idx) => (
        <Page key={idx} size="A4" style={styles.page}>
          <Header id={data.id} />
          <Text style={styles.techTitle}>ESPECIFICACIONES TÉCNICAS - ITEM {idx + 1}</Text>
          <Text style={{fontSize: 12, fontWeight: 'bold', marginBottom: 2}}>{item.title}</Text>
          <Text style={{fontSize: 10, color: COL_GOLD, marginBottom: 10}}>MODELO: {item.model}</Text>

          <View style={styles.mainImageContainer}>
             {item.image ? <Image src={item.image} style={styles.mainImage} /> : <Text>Sin Imagen</Text>}
          </View>

          {item.youtube && (
            <Link src={item.youtube} style={{ textDecoration: 'none' }}>
               <View style={styles.videoButton}>
                 <Text style={styles.videoText}>VER VIDEO DEMOSTRATIVO</Text>
               </View>
            </Link>
          )}

          {/* TABLA SPECS MEJORADA */}
          <View style={{ flexDirection: 'row', gap: 20, marginTop: 10 }}>
             <View style={{ flex: 1 }}>
               {item.specs.slice(0, Math.ceil(item.specs.length / 2)).map((s, i) => (
                 <View key={i} style={styles.specRow}>
                    <Text style={styles.specKey}>{s.key}:</Text>
                    <Text style={styles.specValue}>{s.value}</Text>
                 </View>
               ))}
             </View>
             <View style={{ flex: 1 }}>
               {item.specs.slice(Math.ceil(item.specs.length / 2)).map((s, i) => (
                 <View key={i} style={styles.specRow}>
                    <Text style={styles.specKey}>{s.key}:</Text>
                    <Text style={styles.specValue}>{s.value}</Text>
                 </View>
               ))}
             </View>
          </View>

          {/* GALERÍA MÁS GRANDE (2 COLUMNAS) */}
          {item.gallery && item.gallery.length > 0 && (
            <View style={styles.gallerySection}>
              <Text style={styles.galleryTitle}>DIMENSIONES Y DETALLES:</Text>
              <View style={styles.galleryGrid}>
                {item.gallery.map((imgUrl, gIdx) => (
                  <View key={gIdx} style={styles.galleryItem}>
                    <Image src={imgUrl} style={styles.galleryImg} />
                  </View>
                ))}
              </View>
            </View>
          )}
           <View style={styles.footer}>
            <Text style={styles.footerText}>Cotización N° {data.id} - Ficha Técnica</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};