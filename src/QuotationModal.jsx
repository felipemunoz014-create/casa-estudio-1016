// ─── QuotationModal.jsx ───────────────────────────────────────────────────────
// Agrega este componente a tu proyecto y úsalo así desde App.jsx:
//
//   import QuotationModal from "./QuotationModal";
//
//   // En el estado de App:
//   const [quoteOpen, setQuoteOpen] = useState(false);
//
//   // Reemplaza el botón "Cotizar por WhatsApp" del carro por:
//   <button onClick={() => setQuoteOpen(true)} style={{...}}>📄 Ver Cotización</button>
//
//   // Al final del return de App, junto a los otros modals:
//   {quoteOpen && (
//     <QuotationModal
//       cart={cart}
//       total={total}
//       content={content}        // el estado content de App
//       $$={$$}
//       onClose={() => setQuoteOpen(false)}
//     />
//   )}

import { useRef } from "react";

// Número correlativo guardado en localStorage
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

export default function QuotationModal({ cart, total, content, $$, onClose }) {
  const quoteRef = useRef(null);
  const quoteNumber = useRef(getNextQuoteNumber()).current;
  const issued = useRef(todayStr()).current;
  const validUntil = useRef(validUntilStr()).current;

  // ── Descargar como PDF usando print ──────────────────────────────────────
  function handlePrint() {
    const printContent = quoteRef.current.innerHTML;
    const win = window.open("", "_blank", "width=900,height=700");
    win.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8"/>
        <title>Cotización ${quoteNumber} — ${content.brandName} ${content.brandNum}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Segoe UI', Arial, sans-serif; background: white; color: #1a1a1a; }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            @page { margin: 0; size: A4; }
          }
        </style>
      </head>
      <body>${printContent}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  }

  // ── Mensaje WhatsApp ──────────────────────────────────────────────────────
  function handleWhatsApp() {
    const items = cart.map((item, i) =>
      `${i + 1}. ${item.name} (${item.dims}) x${item.qty} — ${$$(item.price * item.qty)}`
    ).join("\n");

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

  const C = {
    dark: content.colorDark || "#1E1A16",
    warm: content.colorWarm || "#8B6B4A",
    accent: content.colorAccent || "#5A3A1A",
  };

  return (
    <>
      {/* ── Print styles ── */}
      <style>{`
        @media print { .no-print { display: none !important; } }
      `}</style>

      {/* ── Overlay ── */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(10,8,6,0.82)", zIndex: 900, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px 16px", overflowY: "auto", backdropFilter: "blur(4px)" }}
      >
        <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 720, display: "flex", flexDirection: "column", gap: 0 }}>

          {/* ── Action bar (no se imprime) ── */}
          <div className="no-print" style={{ background: "white", borderRadius: "14px 14px 0 0", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", borderBottom: "1px solid #E8E0D4" }}>
            <div style={{ fontFamily: "Georgia,serif", fontSize: 15, fontWeight: 700, color: C.dark }}>📄 Cotización {quoteNumber}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={handleWhatsApp}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#25D366", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                💬 Enviar por WhatsApp
              </button>
              <button onClick={handlePrint}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: C.dark, color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                ⬇️ Descargar PDF
              </button>
              <button onClick={onClose}
                style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #E0D8D0", background: "white", cursor: "pointer", fontSize: 20, color: "#888", display: "flex", alignItems: "center", justifyContent: "center" }}>
                ×
              </button>
            </div>
          </div>

          {/* ── Quote document ── */}
          <div ref={quoteRef} style={{ background: "white", borderRadius: "0 0 14px 14px", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.35)" }}>

            {/* Header band */}
            <div style={{ background: C.dark, padding: "28px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              {/* Brand */}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 52, height: 52, background: C.warm, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontWeight: 700, color: "white", fontSize: 18, flexShrink: 0 }}>
                  {content.brandNum}
                </div>
                <div>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 20, fontWeight: 700, color: "white", lineHeight: 1.1 }}>
                    {content.brandName} <span style={{ color: "#C4B49A" }}>{content.brandNum}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(196,180,154,0.7)", letterSpacing: 1.5, textTransform: "uppercase", marginTop: 3 }}>
                    {content.brandSub || "Revestimientos"}
                  </div>
                </div>
              </div>

              {/* COTIZACIÓN title */}
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "Georgia,serif", fontSize: 32, fontWeight: 700, color: "white", letterSpacing: 2, textTransform: "uppercase" }}>
                  COTIZACIÓN
                </div>
                <div style={{ fontSize: 13, color: "#C4B49A", marginTop: 4 }}>#{quoteNumber}</div>
              </div>
            </div>

            {/* Accent stripe */}
            <div style={{ height: 5, background: `linear-gradient(90deg, ${C.warm}, ${C.accent}, ${C.dark})` }} />

            {/* Meta info row */}
            <div style={{ background: "#F8F4EF", padding: "18px 36px", display: "flex", gap: 32, flexWrap: "wrap", borderBottom: "1px solid #E8E0D4" }}>
              {[
                ["Fecha de emisión", issued],
                ["Válida hasta", validUntil],
                ["Condición de pago", "Pago al contado"],
                ["Medios de pago", content.contactPay || "VISA · Redcompra · MercadoPago"],
              ].map(([label, val]) => (
                <div key={label}>
                  <div style={{ fontSize: 9, color: "#8A7868", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#2C2420" }}>{val}</div>
                </div>
              ))}
            </div>

            {/* From / To */}
            <div style={{ padding: "24px 36px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, borderBottom: "1px solid #E8E0D4" }}>
              <div>
                <div style={{ fontSize: 10, color: C.warm, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Emitido por</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#2C2420", marginBottom: 4 }}>{content.brandName} {content.brandNum}</div>
                <div style={{ fontSize: 13, color: "#5A4A3C", lineHeight: 1.8 }}>
                  {content.contactAddr}<br />
                  {content.contactPhone}<br />
                  {content.brandSub || ""}
                </div>
              </div>
              <div style={{ background: "#F8F4EF", borderRadius: 10, padding: "16px 18px", border: "1px solid #E8E0D4" }}>
                <div style={{ fontSize: 10, color: C.warm, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Estimado cliente</div>
                <div style={{ fontSize: 13, color: "#5A4A3C", lineHeight: 1.9 }}>
                  Esta cotización ha sido preparada especialmente para usted.<br />
                  Para confirmar su pedido o resolver dudas, contáctenos a través de WhatsApp o visítenos en nuestra tienda.
                </div>
              </div>
            </div>

            {/* Items table */}
            <div style={{ padding: "0 36px 8px" }}>
              {/* Table header */}
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
                <thead>
                  <tr style={{ background: C.dark }}>
                    {["Descripción", "Código", "Dimensiones", "Cant.", "P. Unit.", "Total"].map((h, i) => (
                      <th key={h} style={{
                        padding: "12px 10px",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "white",
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                        textAlign: i === 0 ? "left" : i >= 3 ? "right" : "center",
                        borderRight: i < 5 ? "1px solid rgba(255,255,255,0.08)" : "none",
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, i) => (
                    <tr key={item.id} style={{ background: i % 2 === 0 ? "white" : "#FAF8F4", borderBottom: "1px solid #EDE8E0" }}>
                      <td style={{ padding: "13px 10px", fontSize: 13, fontWeight: 600, color: "#2C2420" }}>{item.name}</td>
                      <td style={{ padding: "13px 10px", fontSize: 11, color: "#8A7868", textAlign: "center", fontFamily: "monospace" }}>{item.code}</td>
                      <td style={{ padding: "13px 10px", fontSize: 12, color: "#5A4A3C", textAlign: "center" }}>{item.dims}</td>
                      <td style={{ padding: "13px 10px", fontSize: 13, fontWeight: 700, color: "#2C2420", textAlign: "right" }}>{item.qty}</td>
                      <td style={{ padding: "13px 10px", fontSize: 13, color: "#5A4A3C", textAlign: "right" }}>{$$(item.price)}</td>
                      <td style={{ padding: "13px 10px", fontSize: 13, fontWeight: 700, color: "#2C2420", textAlign: "right" }}>{$$(item.price * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div style={{ padding: "8px 36px 28px", display: "flex", justifyContent: "flex-end" }}>
              <div style={{ minWidth: 260 }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 14px", borderBottom: "1px solid #E8E0D4", fontSize: 13, color: "#5A4A3C" }}>
                  <span>Subtotal</span><span style={{ fontWeight: 600 }}>{$$(total)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 14px", borderBottom: "1px solid #E8E0D4", fontSize: 13, color: "#5A4A3C" }}>
                  <span>IVA (19%)</span><span style={{ fontWeight: 600 }}>Incluido</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "13px 14px", background: C.dark, borderRadius: "0 0 8px 8px", marginTop: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "white" }}>TOTAL</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#C4B49A" }}>{$$(total)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div style={{ margin: "0 36px 28px", padding: "16px 18px", background: "#F8F4EF", borderRadius: 10, border: "1px solid #E8E0D4" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.warm, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Notas y condiciones</div>
              <div style={{ fontSize: 12, color: "#5A4A3C", lineHeight: 1.8 }}>
                • Cotización válida por 15 días desde la fecha de emisión.<br />
                • Precios sujetos a disponibilidad de stock al momento de la compra.<br />
                • Despacho a coordinar según región. Consultar tarifas de envío.<br />
                • Se requiere un 50% de adelanto para confirmar el pedido.
              </div>
            </div>

            {/* Footer */}
            <div style={{ background: C.dark, padding: "16px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontSize: 11, color: "rgba(196,180,154,0.7)" }}>
                {content.brandName} {content.brandNum} · {content.contactAddr}
              </div>
              <div style={{ fontSize: 11, color: "rgba(196,180,154,0.7)" }}>
                {content.contactPhone}
              </div>
            </div>
          </div>

          {/* Bottom action bar (no se imprime) */}
          <div className="no-print" style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <button onClick={handleWhatsApp}
              style={{ flex: 1, minWidth: 180, padding: "13px", background: "#25D366", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              💬 Enviar por WhatsApp
            </button>
            <button onClick={handlePrint}
              style={{ flex: 1, minWidth: 180, padding: "13px", background: C.dark, color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              ⬇️ Descargar PDF
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
