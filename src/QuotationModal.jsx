// QuotationModal.jsx
// Dependencia requerida — instala con:  npm install html2pdf.js

import { useRef, useEffect, useState } from "react";
import html2pdf from "html2pdf.js";

function getNextQuoteNumber() {
  const n = parseInt(localStorage.getItem("ce1016_quote_num") || "1000", 10);
  localStorage.setItem("ce1016_quote_num", String(n + 1));
  return `COT-${String(n + 1).padStart(4, "0")}`;
}

function todayStr() {
  return new Date().toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function validUntilStr() {
  const d = new Date();
  d.setDate(d.getDate() + 15);
  return d.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function useWindowWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

export default function QuotationModal({ cart, total, content, $$, onClose }) {
  const docRef = useRef(null);
  const quoteNumber = useRef(getNextQuoteNumber()).current;
  const issued = useRef(todayStr()).current;
  const validUntil = useRef(validUntilStr()).current;
  const [downloading, setDownloading] = useState(false);

  const w = useWindowWidth();
  const sm = w < 640;
  const md = w < 900;

  const C = {
    dark: content.colorDark || "#1E1A16",
    warm: content.colorWarm || "#8B6B4A",
    accent: content.colorAccent || "#5A3A1A",
    text: "#2C2420",
  };

  async function handleDownloadPDF() {
    if (!docRef.current) return;
    setDownloading(true);
    const opt = {
      margin:      [8, 8, 8, 8],
      filename:    `Cotizacion-${quoteNumber}.pdf`,
      image:       { type: "jpeg", quality: 0.97 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:       { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak:   { mode: "avoid-all" },
    };
    await html2pdf().set(opt).from(docRef.current).save();
    setDownloading(false);
  }

  function handleWhatsApp() {
    const items = cart
      .map((item, i) => `${i + 1}. ${item.name} x${item.qty} — ${$$(item.price * item.qty)}`)
      .join("\n");
    const msg = encodeURIComponent(
      `*Cotización ${quoteNumber}*\n` +
      `*${content.brandName} ${content.brandNum}*\n` +
      `📍 ${content.contactAddr}\n` +
      `📱 ${content.contactPhone}\n\n` +
      `*Detalle:*\n${items}\n\n` +
      `*Total: ${$$(total)}*\n\n` +
      `Válida hasta: ${validUntil}\n` +
      `Valores incluyen IVA. Sujeto a disponibilidad de stock.`
    );
    window.open(`https://wa.me/${content.waNumber}?text=${msg}`, "_blank");
  }

  const fs = {
    brand:   sm ? 14 : md ? 16 : 20,
    title:   sm ? 20 : md ? 26 : 34,
    label:   sm ? 9  : 10,
    metaVal: sm ? 11 : 13,
    body:    sm ? 12 : 13,
    th:      sm ? 10 : 11,
    td:      sm ? 11 : 13,
    totalLbl:sm ? 13 : 15,
    totalVal:sm ? 16 : 20,
    notes:   sm ? 11 : 12,
    footer:  sm ? 10 : 11,
  };
  const pad = sm ? "16px" : md ? "22px" : "32px";
  const padSm = sm ? "12px 16px" : md ? "14px 22px" : "18px 32px";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(10,8,6,0.85)",
        zIndex: 900,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: sm ? "0" : "20px 16px",
        overflowY: "auto",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 760,
          display: "flex",
          flexDirection: "column",
          minHeight: sm ? "100dvh" : "auto",
        }}
      >
        {/* Action bar */}
        <div style={{
          background: "white",
          borderRadius: sm ? 0 : "14px 14px 0 0",
          padding: sm ? "12px 16px" : "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap",
          borderBottom: "1px solid #E8E0D4",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}>
          <div style={{ fontFamily: "Georgia,serif", fontSize: sm ? 13 : 15, fontWeight: 700, color: C.dark }}>
            📄 {quoteNumber}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleWhatsApp} style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: sm ? "8px 12px" : "9px 16px",
              background: "#25D366", color: "white",
              border: "none", borderRadius: 8,
              fontSize: sm ? 12 : 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
            }}>
              💬 {sm ? "WhatsApp" : "Enviar por WhatsApp"}
            </button>
            <button onClick={handleDownloadPDF} disabled={downloading} style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: sm ? "8px 12px" : "9px 16px",
              background: downloading ? "#A09488" : C.dark,
              color: "white", border: "none", borderRadius: 8,
              fontSize: sm ? 12 : 13, fontWeight: 700,
              cursor: downloading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
            }}>
              {downloading ? "⏳..." : `⬇️ ${sm ? "PDF" : "Descargar PDF"}`}
            </button>
            <button onClick={onClose} style={{
              width: 34, height: 34, borderRadius: "50%",
              border: "1px solid #E0D8D0", background: "white",
              cursor: "pointer", fontSize: 20, color: "#888",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>×</button>
          </div>
        </div>

        {/* Document */}
        <div ref={docRef} style={{ background: "white", overflow: "hidden", boxShadow: sm ? "none" : "0 24px 60px rgba(0,0,0,0.3)" }}>

          {/* Header */}
          <div style={{
            background: C.dark,
            padding: sm ? "18px 16px" : md ? "22px 22px" : "28px 32px",
            display: "flex", alignItems: "center",
            justifyContent: "space-between", flexWrap: "wrap", gap: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: sm ? 10 : 14 }}>
              <div style={{
                width: sm ? 38 : 48, height: sm ? 38 : 48,
                background: C.warm, borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Georgia,serif", fontWeight: 700,
                color: "white", fontSize: sm ? 13 : 16, flexShrink: 0,
              }}>
                {content.brandNum}
              </div>
              <div>
                <div style={{ fontFamily: "Georgia,serif", fontSize: fs.brand, fontWeight: 700, color: "white", lineHeight: 1.1 }}>
                  {content.brandName} <span style={{ color: "#C4B49A" }}>{content.brandNum}</span>
                </div>
                <div style={{ fontSize: sm ? 9 : 10, color: "rgba(196,180,154,0.6)", letterSpacing: 1.2, textTransform: "uppercase", marginTop: 3 }}>
                  {content.brandSub || "Revestimientos"}
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "Georgia,serif", fontSize: fs.title, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: sm ? 1 : 2 }}>
                COTIZACIÓN
              </div>
              <div style={{ fontSize: sm ? 11 : 13, color: "#C4B49A", marginTop: 3 }}>#{quoteNumber}</div>
            </div>
          </div>

          {/* Accent stripe */}
          <div style={{ height: 4, background: `linear-gradient(90deg, ${C.warm}, ${C.accent}, ${C.dark})` }} />

          {/* Meta */}
          <div style={{
            background: "#F8F4EF",
            padding: padSm,
            display: "grid",
            gridTemplateColumns: sm ? "1fr 1fr" : "repeat(4,1fr)",
            gap: sm ? "10px 14px" : 16,
            borderBottom: "1px solid #E8E0D4",
          }}>
            {[
              ["Fecha emisión", issued],
              ["Válida hasta", validUntil],
              ["Condición pago", "Al contado"],
              ["Medios de pago", content.contactPay || "VISA · Redcompra"],
            ].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize: fs.label, color: "#8A7868", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: fs.metaVal, fontWeight: 600, color: C.text }}>{val}</div>
              </div>
            ))}
          </div>

          {/* From / note */}
          <div style={{
            padding: `${sm ? 14 : 22}px ${pad}`,
            display: "grid",
            gridTemplateColumns: sm ? "1fr" : "1fr 1fr",
            gap: sm ? 12 : 20,
            borderBottom: "1px solid #E8E0D4",
          }}>
            <div>
              <div style={{ fontSize: fs.label, color: C.warm, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Emitido por</div>
              <div style={{ fontWeight: 700, fontSize: fs.body, color: C.text, marginBottom: 4 }}>{content.brandName} {content.brandNum}</div>
              <div style={{ fontSize: fs.body, color: "#5A4A3C", lineHeight: 1.8 }}>
                {content.contactAddr}<br />{content.contactPhone}
              </div>
            </div>
            <div style={{ background: "#F8F4EF", borderRadius: 10, padding: sm ? "12px" : "14px 16px", border: "1px solid #E8E0D4" }}>
              <div style={{ fontSize: fs.label, color: C.warm, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Estimado cliente</div>
              <div style={{ fontSize: fs.body, color: "#5A4A3C", lineHeight: 1.8 }}>
                Esta cotización ha sido preparada para usted. Para confirmar su pedido contáctenos por WhatsApp o visítenos en tienda.
              </div>
            </div>
          </div>

          {/* Items — desktop tabla */}
          {!sm && (
            <div style={{ padding: `0 ${pad}` }}>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
                <thead>
                  <tr style={{ background: C.dark }}>
                    {["Descripción", "Código", "Dimensiones", "Cant.", "P. Unit.", "Total"].map((h, i) => (
                      <th key={h} style={{
                        padding: md ? "10px 8px" : "12px 10px",
                        fontSize: fs.th, fontWeight: 700, color: "white",
                        textTransform: "uppercase", letterSpacing: 0.5,
                        textAlign: i === 0 ? "left" : i >= 3 ? "right" : "center",
                        borderRight: i < 5 ? "1px solid rgba(255,255,255,0.08)" : "none",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, i) => (
                    <tr key={item.id} style={{ background: i % 2 === 0 ? "white" : "#FAF8F4", borderBottom: "1px solid #EDE8E0" }}>
                      <td style={{ padding: "12px 10px", fontSize: fs.td, fontWeight: 600, color: C.text }}>{item.name}</td>
                      <td style={{ padding: "12px 10px", fontSize: fs.th, color: "#8A7868", textAlign: "center", fontFamily: "monospace" }}>{item.code}</td>
                      <td style={{ padding: "12px 10px", fontSize: fs.td, color: "#5A4A3C", textAlign: "center" }}>{item.dims}</td>
                      <td style={{ padding: "12px 10px", fontSize: fs.td, fontWeight: 700, color: C.text, textAlign: "right" }}>{item.qty}</td>
                      <td style={{ padding: "12px 10px", fontSize: fs.td, color: "#5A4A3C", textAlign: "right" }}>{$$(item.price)}</td>
                      <td style={{ padding: "12px 10px", fontSize: fs.td, fontWeight: 700, color: C.text, textAlign: "right" }}>{$$(item.price * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Items — mobile cards */}
          {sm && (
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: fs.label, color: C.warm, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Productos</div>
              {cart.map((item, i) => (
                <div key={item.id} style={{
                  background: i % 2 === 0 ? "white" : "#FAF8F4",
                  border: "1px solid #EDE8E0", borderRadius: 8,
                  padding: "11px 13px",
                  display: "grid", gridTemplateColumns: "1fr auto", gap: "3px 10px",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text, gridColumn: "1 / -1", marginBottom: 2 }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: "#8A7868" }}>Cód: {item.code} · {item.dims}</div>
                  <div style={{ fontSize: 11, color: "#8A7868", textAlign: "right" }}>×{item.qty}</div>
                  <div style={{ fontSize: 12, color: "#5A4A3C" }}>Unit: {$$(item.price)}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: C.accent, textAlign: "right" }}>{$$(item.price * item.qty)}</div>
                </div>
              ))}
            </div>
          )}

          {/* Totals */}
          <div style={{ padding: `8px ${pad} ${sm ? 14 : 22}px`, display: "flex", justifyContent: sm ? "stretch" : "flex-end" }}>
            <div style={{ width: sm ? "100%" : 280 }}>
              {[["Subtotal", $$(total)], ["IVA (19%)", "Incluido"]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", borderBottom: "1px solid #E8E0D4", fontSize: fs.body, color: "#5A4A3C" }}>
                  <span>{l}</span><span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: sm ? "12px" : "13px 14px", background: C.dark, borderRadius: "0 0 8px 8px", marginTop: 4 }}>
                <span style={{ fontSize: fs.totalLbl, fontWeight: 700, color: "white" }}>TOTAL</span>
                <span style={{ fontSize: fs.totalVal, fontWeight: 800, color: "#C4B49A" }}>{$$(total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div style={{ margin: `0 ${pad} ${sm ? 14 : 22}px`, padding: sm ? "12px 13px" : "14px 16px", background: "#F8F4EF", borderRadius: 10, border: "1px solid #E8E0D4" }}>
            <div style={{ fontSize: fs.label, fontWeight: 700, color: C.warm, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Notas y condiciones</div>
            <div style={{ fontSize: fs.notes, color: "#5A4A3C", lineHeight: 1.85 }}>
              • Cotización válida por 15 días desde la fecha de emisión.<br />
              • Precios sujetos a disponibilidad de stock al momento de la compra.<br />
              • Retiro en bodega previa coordinación, una vez realizada la transferencia. Horario de entrega: 09:00 a 17:00 hrs.
            </div>
          </div>

          {/* Footer */}
          <div style={{ background: C.dark, padding: sm ? "12px 16px" : "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
            <div style={{ fontSize: fs.footer, color: "rgba(196,180,154,0.6)" }}>{content.brandName} {content.brandNum} · {content.contactAddr}</div>
            <div style={{ fontSize: fs.footer, color: "rgba(196,180,154,0.6)" }}>{content.contactPhone}</div>
          </div>
        </div>

        {/* Bottom sticky buttons (mobile) */}
        <div style={{
          display: "flex", gap: 10,
          padding: sm ? "12px 16px" : "12px 0",
          background: sm ? "white" : "transparent",
          position: sm ? "sticky" : "static",
          bottom: 0,
          borderTop: sm ? "1px solid #E8E0D4" : "none",
        }}>
          <button onClick={handleWhatsApp} style={{ flex: 1, padding: "13px", background: "#25D366", color: "white", border: "none", borderRadius: 10, fontSize: sm ? 13 : 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            💬 Enviar por WhatsApp
          </button>
          <button onClick={handleDownloadPDF} disabled={downloading} style={{ flex: 1, padding: "13px", background: downloading ? "#A09488" : C.dark, color: "white", border: "none", borderRadius: 10, fontSize: sm ? 13 : 14, fontWeight: 700, cursor: downloading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            {downloading ? "⏳ Generando..." : "⬇️ Descargar PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
