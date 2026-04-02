import { useState, useEffect } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => `$${Number(n || 0).toLocaleString("es-CL")}`;
const fmtDate = (d) => new Date(d).toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" });
const today = () => new Date().toISOString().split("T")[0];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const STORAGE_KEY = "ce1016_flujo";
const CATS_INGRESO = ["Venta productos", "Anticipo cliente", "Otro ingreso"];
const CATS_GASTO = ["Compra mercadería", "Arriendo / bodega", "Marketing", "Transporte / flete", "Servicios básicos", "Otro gasto"];
const CATS_SUELDO = ["Sueldo base", "Comisión", "Bono", "Finiquito"];

function loadData() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : { movimientos: [], inventario: [], sueldos: [], costosFijos: [] }; }
  catch { return { movimientos: [], inventario: [], sueldos: [], costosFijos: [] }; }
}
function saveData(d) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch (e) { console.warn(e); } }

// ─── Export Excel ─────────────────────────────────────────────────────────────
async function exportExcel(data) {
  if (!window.XLSX) {
    await new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  const XLSX = window.XLSX;
  const wb = XLSX.utils.book_new();
  const ingresos = data.movimientos.filter((m) => m.tipo === "ingreso").reduce((s, m) => s + m.monto, 0);
  const gastos = data.movimientos.filter((m) => m.tipo === "gasto").reduce((s, m) => s + m.monto, 0);
  const sueldosTotal = data.sueldos.reduce((s, p) => s + p.monto, 0);

  // Hoja Resumen
  const ws0 = XLSX.utils.aoa_to_sheet([
    ["RESUMEN GENERAL — Casa-Estudio 1016"],
    [`Generado el ${new Date().toLocaleDateString("es-CL")}`],
    [],
    ["CONCEPTO", "MONTO ($)"],
    ["Total Ingresos", ingresos],
    ["Total Gastos Operativos", gastos],
    ["Total Sueldos", sueldosTotal],
    ["SALDO NETO", ingresos - gastos - sueldosTotal],
    [],
    ["Valor Inventario (costo)", data.inventario.reduce((s, i) => s + i.costoUnit * i.stock, 0)],
    ["Valor Inventario (venta)", data.inventario.reduce((s, i) => s + i.precioVenta * i.stock, 0)],
    ["Costos Fijos Mensuales", data.costosFijos.reduce((s, c) => { const f = { Mensual: 1, Bimestral: 0.5, Trimestral: 1/3, Anual: 1/12 }; return s + Math.round(c.monto * (f[c.frecuencia] || 1)); }, 0)],
  ]);
  ws0["!cols"] = [{ wch: 30 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, ws0, "Resumen");

  // Hoja Movimientos
  const ws1 = XLSX.utils.aoa_to_sheet([
    ["Fecha", "Tipo", "Categoría", "Descripción", "Método de pago", "Comprobante", "Monto ($)"],
    ...data.movimientos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map((m) => [
      fmtDate(m.fecha), m.tipo === "ingreso" ? "Ingreso" : "Gasto",
      m.categoria, m.descripcion, m.metodoPago, m.comprobante || "-",
      m.tipo === "ingreso" ? m.monto : -m.monto,
    ]),
    [], ["", "", "", "", "", "TOTAL INGRESOS", ingresos],
    ["", "", "", "", "", "TOTAL GASTOS", -gastos],
    ["", "", "", "", "", "SALDO", ingresos - gastos],
  ]);
  ws1["!cols"] = [{ wch: 12 }, { wch: 10 }, { wch: 22 }, { wch: 30 }, { wch: 18 }, { wch: 14 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, ws1, "Movimientos");

  // Hoja Inventario
  const ws2 = XLSX.utils.aoa_to_sheet([
    ["Producto", "Código", "Stock", "Unidad", "Costo unit. ($)", "Precio venta ($)", "Valor costo ($)", "Margen (%)"],
    ...data.inventario.map((i) => [
      i.nombre, i.codigo, i.stock, i.unidad, i.costoUnit, i.precioVenta,
      i.costoUnit * i.stock,
      i.costoUnit > 0 ? Number((((i.precioVenta - i.costoUnit) / i.costoUnit) * 100).toFixed(1)) : 0,
    ]),
    [], ["", "", "", "", "TOTAL COSTO", "", data.inventario.reduce((s, i) => s + i.costoUnit * i.stock, 0), ""],
  ]);
  ws2["!cols"] = [{ wch: 26 }, { wch: 14 }, { wch: 8 }, { wch: 10 }, { wch: 16 }, { wch: 16 }, { wch: 18 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, ws2, "Inventario");

  // Hoja Sueldos
  const ws3 = XLSX.utils.aoa_to_sheet([
    ["Fecha", "Colaborador", "Tipo de pago", "Monto ($)", "Observación"],
    ...data.sueldos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map((p) => [fmtDate(p.fecha), p.nombre, p.categoria, p.monto, p.observacion || "-"]),
    [], ["", "", "TOTAL SUELDOS", sueldosTotal, ""],
  ]);
  ws3["!cols"] = [{ wch: 12 }, { wch: 22 }, { wch: 18 }, { wch: 14 }, { wch: 28 }];
  XLSX.utils.book_append_sheet(wb, ws3, "Sueldos");

  // Hoja Costos Fijos
  const ws4 = XLSX.utils.aoa_to_sheet([
    ["Nombre", "Monto ($)", "Frecuencia", "Próximo vencimiento", "Equiv. mensual ($)"],
    ...data.costosFijos.map((c) => { const f = { Mensual: 1, Bimestral: 0.5, Trimestral: 1/3, Anual: 1/12 }; return [c.nombre, c.monto, c.frecuencia, fmtDate(c.proximoPago), Math.round(c.monto * (f[c.frecuencia] || 1))]; }),
    [], ["TOTAL MENSUAL", "", "", "", data.costosFijos.reduce((s, c) => { const f = { Mensual: 1, Bimestral: 0.5, Trimestral: 1/3, Anual: 1/12 }; return s + Math.round(c.monto * (f[c.frecuencia] || 1)); }, 0)],
  ]);
  ws4["!cols"] = [{ wch: 26 }, { wch: 12 }, { wch: 14 }, { wch: 20 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, ws4, "Costos Fijos");

  XLSX.writeFile(wb, `FlujoCaja_CasaEstudio_${today()}.xlsx`);
}

// ─── Export PDF ───────────────────────────────────────────────────────────────
function exportPDF(data) {
  const ingresos = data.movimientos.filter((m) => m.tipo === "ingreso").reduce((s, m) => s + m.monto, 0);
  const gastos = data.movimientos.filter((m) => m.tipo === "gasto").reduce((s, m) => s + m.monto, 0);
  const sueldosTotal = data.sueldos.reduce((s, p) => s + p.monto, 0);
  const saldo = ingresos - gastos - sueldosTotal;
  const valorInv = data.inventario.reduce((s, i) => s + i.costoUnit * i.stock, 0);

  const tbl = (cols, rows, totales = []) => `
    <table>
      <thead><tr>${cols.map((c) => `<th>${c}</th>`).join("")}</tr></thead>
      <tbody>
        ${rows.map((r) => `<tr>${r.map((c) => `<td>${c ?? "-"}</td>`).join("")}</tr>`).join("")}
        ${totales.map((t) => `<tr class="tot">${t.map((c) => `<td>${c ?? ""}</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table>`;

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Flujo de Caja — Casa-Estudio 1016</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Georgia,serif;color:#2C2420;font-size:10.5pt;background:white;padding:20pt}
  .hdr{border-bottom:3pt solid #1E1A16;padding-bottom:12pt;margin-bottom:16pt;display:flex;justify-content:space-between;align-items:flex-end}
  .hdr h1{font-size:20pt;font-weight:700;color:#1E1A16}
  .hdr .sub{font-size:8.5pt;color:#8A7868;margin-top:3pt;font-family:sans-serif}
  .hdr .fecha{font-size:8.5pt;color:#8A7868;font-family:sans-serif}
  .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:8pt;margin-bottom:20pt}
  .kpi{background:#F8F4EF;border:1pt solid #E8E0D4;border-radius:5pt;padding:9pt 11pt}
  .kpi .lbl{font-size:7pt;color:#8A7868;text-transform:uppercase;letter-spacing:1pt;font-family:sans-serif;margin-bottom:3pt}
  .kpi .val{font-size:14pt;font-weight:700}
  .verde .val{color:#1E6B5A}.rojo .val{color:#C45A5A}.cafe .val{color:#8B6B4A}
  h2{font-size:12pt;color:#1E1A16;margin:16pt 0 7pt;border-left:3pt solid #8B6B4A;padding-left:7pt}
  table{width:100%;border-collapse:collapse;font-size:8.5pt;font-family:sans-serif;margin-bottom:3pt}
  th{background:#1E1A16;color:white;padding:5pt 7pt;text-align:left;font-size:7.5pt;text-transform:uppercase;letter-spacing:.4pt}
  td{padding:4.5pt 7pt;border-bottom:.5pt solid #F0EAE2}
  tr:nth-child(even) td{background:#FDFAF7}
  .tot td{background:#F5EDE4;font-weight:700;color:#1E1A16;border-top:1pt solid #C4B49A}
  .bi{background:#E8F5F0;color:#1E6B5A;padding:1.5pt 5pt;border-radius:8pt;font-size:7.5pt;font-weight:700}
  .bg{background:#FEE8E8;color:#C45A5A;padding:1.5pt 5pt;border-radius:8pt;font-size:7.5pt;font-weight:700}
  .ftr{margin-top:24pt;border-top:1pt solid #E8E0D4;padding-top:8pt;font-size:7.5pt;color:#AAA;font-family:sans-serif;display:flex;justify-content:space-between}
  @media print{body{padding:0}@page{margin:16mm 12mm;size:A4}}
</style></head><body>
<div class="hdr">
  <div><h1>Casa-Estudio 1016</h1><div class="sub">Revestimientos · Santa Bárbara</div><div class="sub">Flujo de Caja — Informe contable</div></div>
  <div class="fecha">Generado el ${new Date().toLocaleDateString("es-CL", { day: "2-digit", month: "long", year: "numeric" })}</div>
</div>
<div class="kpis">
  <div class="kpi verde"><div class="lbl">Total Ingresos</div><div class="val">${fmt(ingresos)}</div></div>
  <div class="kpi rojo"><div class="lbl">Total Gastos + Sueldos</div><div class="val">${fmt(gastos + sueldosTotal)}</div></div>
  <div class="kpi ${saldo >= 0 ? "verde" : "rojo"}"><div class="lbl">Saldo Neto</div><div class="val">${fmt(saldo)}</div></div>
  <div class="kpi cafe"><div class="lbl">Valor Inventario</div><div class="val">${fmt(valorInv)}</div></div>
</div>

<h2>Movimientos de Caja</h2>
${tbl(
  ["Fecha", "Tipo", "Categoría", "Descripción", "Método", "Monto"],
  data.movimientos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map((m) => [
    fmtDate(m.fecha),
    `<span class="${m.tipo === "ingreso" ? "bi" : "bg"}">${m.tipo === "ingreso" ? "↑ Ingreso" : "↓ Gasto"}</span>`,
    m.categoria, m.descripcion, m.metodoPago,
    `<strong style="color:${m.tipo === "ingreso" ? "#1E6B5A" : "#C45A5A"}">${m.tipo === "ingreso" ? "+" : "-"}${fmt(m.monto)}</strong>`,
  ]),
  [["", "", "", "", "TOTAL INGRESOS", `<strong style="color:#1E6B5A">+${fmt(ingresos)}</strong>`],
   ["", "", "", "", "TOTAL GASTOS", `<strong style="color:#C45A5A">-${fmt(gastos)}</strong>`],
   ["", "", "", "", "SALDO CAJA", `<strong style="color:${ingresos-gastos >= 0 ? "#1E6B5A" : "#C45A5A"}">${fmt(ingresos-gastos)}</strong>`]]
)}

<h2>Inventario de Productos</h2>
${tbl(
  ["Producto", "Código", "Stock", "Costo unit.", "Precio venta", "Valor costo total", "Margen"],
  data.inventario.map((i) => {
    const mg = i.costoUnit > 0 ? (((i.precioVenta - i.costoUnit) / i.costoUnit) * 100).toFixed(0) : 0;
    return [i.nombre, i.codigo || "-", `${i.stock} ${i.unidad}`, fmt(i.costoUnit), fmt(i.precioVenta), fmt(i.costoUnit * i.stock), `${mg}%`];
  }),
  [["", "", "", "", "", `<strong>${fmt(valorInv)}</strong>`, ""]]
)}

<h2>Sueldos y Pagos de Personal</h2>
${tbl(
  ["Fecha", "Colaborador", "Tipo", "Monto", "Observación"],
  data.sueldos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map((p) => [
    fmtDate(p.fecha), p.nombre, p.categoria,
    `<strong style="color:#C45A5A">-${fmt(p.monto)}</strong>`, p.observacion || "-",
  ]),
  [["", "", "TOTAL SUELDOS", `<strong style="color:#C45A5A">-${fmt(sueldosTotal)}</strong>`, ""]]
)}

<h2>Costos Fijos</h2>
${tbl(
  ["Nombre", "Monto", "Frecuencia", "Próx. vencimiento", "Equiv. mensual"],
  data.costosFijos.map((c) => {
    const f = { Mensual: 1, Bimestral: 0.5, Trimestral: 1/3, Anual: 1/12 };
    const diff = (new Date(c.proximoPago) - new Date()) / (1000*60*60*24);
    return [c.nombre, fmt(c.monto), c.frecuencia, `<span style="color:${diff>=0&&diff<=7?"#C45A5A":"#2C2420"}">${fmtDate(c.proximoPago)}${diff>=0&&diff<=7?" ⚠":""}</span>`, fmt(Math.round(c.monto*(f[c.frecuencia]||1)))];
  }),
  [["TOTAL MENSUAL", "", "", "", `<strong>${fmt(Math.round(data.costosFijos.reduce((s,c)=>{const f={Mensual:1,Bimestral:.5,Trimestral:1/3,Anual:1/12};return s+c.monto*(f[c.frecuencia]||1);},0)))}</strong>`]]
)}

<div class="ftr">
  <span>Casa-Estudio 1016 · Arturo Prat 1016, Santa Bárbara</span>
  <span>Documento de uso interno — generado automáticamente</span>
</div>
</body></html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 700);
}

// ─── UI helpers ───────────────────────────────────────────────────────────────
function StatCard({ label, value, color, sub }) {
  return (
    <div style={{ background: "white", border: "1px solid #E8E0D4", borderRadius: 14, padding: "16px 18px", minWidth: 0 }}>
      <div style={{ fontSize: 11, color: "#8A7868", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "Georgia,serif", fontSize: "clamp(17px,2.5vw,24px)", fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#AAA", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function FormModal({ title, onClose, children }) {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 199999, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(4px)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 16, width: "100%", maxWidth: 460, maxHeight: "90vh", overflow: "auto", padding: "24px", boxShadow: "0 24px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontFamily: "Georgia,serif", fontSize: 17, fontWeight: 600, color: "#2C2420" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#888" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return <div style={{ marginBottom: 14 }}><label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#8A7868", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 5 }}>{label}</label>{children}</div>;
}

const IS = { width: "100%", padding: "10px 12px", border: "1px solid #E0D8D0", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", color: "#2C2420", background: "#FDFAF7", boxSizing: "border-box" };
const SS = { ...IS, appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238A7868' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 32 };
const Btn = ({ children, onClick, disabled, color = "#1E1A16" }) => <button onClick={onClick} disabled={disabled} style={{ width: "100%", padding: "12px", background: disabled ? "#C4B49A" : color, color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit", marginTop: 4 }}>{children}</button>;

const TH = (headers) => <thead><tr style={{ background: "#F5F0EA" }}>{headers.map((h) => <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#8A7868", textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{h}</th>)}</tr></thead>;
const DeleteBtn = ({ onClick }) => <button onClick={onClick} style={{ background: "none", border: "none", color: "#E0D0C8", cursor: "pointer", fontSize: 16, fontWeight: 700 }} onMouseEnter={(e) => e.currentTarget.style.color = "#C45A5A"} onMouseLeave={(e) => e.currentTarget.style.color = "#E0D0C8"}>×</button>;
const EditBtn = ({ onClick }) => <button onClick={onClick} style={{ background: "none", border: "1px solid #E0D8D0", color: "#8A7868", cursor: "pointer", fontSize: 11, borderRadius: 6, padding: "3px 7px", fontFamily: "inherit" }}>✏</button>;
const TableWrap = ({ children }) => <div style={{ background: "white", border: "1px solid #E8E0D4", borderRadius: 12, overflow: "hidden" }}><div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>{children}</table></div></div>;
const TR = ({ children, ...props }) => <tr style={{ borderTop: "1px solid #F0EAE2" }} onMouseEnter={(e) => e.currentTarget.style.background = "#FDFAF7"} onMouseLeave={(e) => e.currentTarget.style.background = "white"} {...props}>{children}</tr>;
const TD = ({ children, style }) => <td style={{ padding: "10px 12px", ...style }}>{children}</td>;
const Empty = ({ cols, msg }) => <tr><td colSpan={cols} style={{ padding: "32px", textAlign: "center", color: "#C4B49A" }}>{msg}</td></tr>;

// ─── Formularios ──────────────────────────────────────────────────────────────
function MovimientoForm({ tipo, onSave, onClose }) {
  const cats = tipo === "ingreso" ? CATS_INGRESO : CATS_GASTO;
  const [f, setF] = useState({ fecha: today(), categoria: cats[0], descripcion: "", monto: "", metodoPago: "Efectivo", comprobante: "" });
  const s = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const ok = f.monto && Number(f.monto) > 0 && f.descripcion;
  return (
    <FormModal title={tipo === "ingreso" ? "➕ Nuevo Ingreso" : "➖ Nuevo Gasto"} onClose={onClose}>
      <Field label="Fecha"><input type="date" value={f.fecha} onChange={(e) => s("fecha", e.target.value)} style={IS} /></Field>
      <Field label="Categoría"><select value={f.categoria} onChange={(e) => s("categoria", e.target.value)} style={SS}>{cats.map((c) => <option key={c}>{c}</option>)}</select></Field>
      <Field label="Descripción"><input type="text" value={f.descripcion} onChange={(e) => s("descripcion", e.target.value)} placeholder="Ej: Venta 3 Wall Panel Caoba" style={IS} /></Field>
      <Field label="Monto ($)"><input type="number" value={f.monto} onChange={(e) => s("monto", e.target.value)} placeholder="0" style={IS} /></Field>
      <Field label="Método de pago"><select value={f.metodoPago} onChange={(e) => s("metodoPago", e.target.value)} style={SS}>{["Efectivo", "Transferencia", "Tarjeta débito", "Tarjeta crédito", "MercadoPago", "Otro"].map((m) => <option key={m}>{m}</option>)}</select></Field>
      <Field label="N° Comprobante (opcional)"><input type="text" value={f.comprobante} onChange={(e) => s("comprobante", e.target.value)} placeholder="Ej: 0042" style={IS} /></Field>
      <Btn onClick={() => { if (ok) { onSave({ ...f, tipo, id: uid(), monto: Number(f.monto) }); onClose(); } }} disabled={!ok} color={tipo === "ingreso" ? "#1E6B5A" : "#C45A5A"}>Guardar {tipo === "ingreso" ? "ingreso" : "gasto"}</Btn>
    </FormModal>
  );
}

function InventarioForm({ item, onSave, onClose }) {
  const [f, setF] = useState(item || { nombre: "", codigo: "", stock: "", costoUnit: "", precioVenta: "", unidad: "unidad" });
  const s = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const ok = f.nombre && f.stock !== "" && f.costoUnit !== "";
  return (
    <FormModal title={item ? "✏️ Editar Producto" : "📦 Agregar Producto"} onClose={onClose}>
      <Field label="Nombre del producto"><input type="text" value={f.nombre} onChange={(e) => s("nombre", e.target.value)} placeholder="Ej: PVC Mármol Gris" style={IS} /></Field>
      <Field label="Código / SKU"><input type="text" value={f.codigo} onChange={(e) => s("codigo", e.target.value)} placeholder="Ej: KL8235" style={IS} /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Stock actual"><input type="number" value={f.stock} onChange={(e) => s("stock", e.target.value)} placeholder="0" style={IS} /></Field>
        <Field label="Unidad"><select value={f.unidad} onChange={(e) => s("unidad", e.target.value)} style={SS}>{["unidad", "plancha", "metro", "set", "caja"].map((u) => <option key={u}>{u}</option>)}</select></Field>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Costo unitario ($)"><input type="number" value={f.costoUnit} onChange={(e) => s("costoUnit", e.target.value)} placeholder="0" style={IS} /></Field>
        <Field label="Precio venta ($)"><input type="number" value={f.precioVenta} onChange={(e) => s("precioVenta", e.target.value)} placeholder="0" style={IS} /></Field>
      </div>
      <Btn onClick={() => { if (ok) { onSave({ ...f, id: f.id || uid(), stock: Number(f.stock), costoUnit: Number(f.costoUnit), precioVenta: Number(f.precioVenta) }); onClose(); } }} disabled={!ok}>{item ? "Guardar cambios" : "Agregar producto"}</Btn>
    </FormModal>
  );
}

function SueldoForm({ onSave, onClose }) {
  const [f, setF] = useState({ fecha: today(), nombre: "", categoria: CATS_SUELDO[0], monto: "", observacion: "" });
  const s = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const ok = f.nombre && f.monto && Number(f.monto) > 0;
  return (
    <FormModal title="👤 Registrar Pago" onClose={onClose}>
      <Field label="Fecha"><input type="date" value={f.fecha} onChange={(e) => s("fecha", e.target.value)} style={IS} /></Field>
      <Field label="Nombre colaborador"><input type="text" value={f.nombre} onChange={(e) => s("nombre", e.target.value)} placeholder="Ej: María González" style={IS} /></Field>
      <Field label="Tipo de pago"><select value={f.categoria} onChange={(e) => s("categoria", e.target.value)} style={SS}>{CATS_SUELDO.map((c) => <option key={c}>{c}</option>)}</select></Field>
      <Field label="Monto ($)"><input type="number" value={f.monto} onChange={(e) => s("monto", e.target.value)} placeholder="0" style={IS} /></Field>
      <Field label="Observación (opcional)"><input type="text" value={f.observacion} onChange={(e) => s("observacion", e.target.value)} placeholder="Ej: Mes de marzo" style={IS} /></Field>
      <Btn onClick={() => { if (ok) { onSave({ ...f, id: uid(), monto: Number(f.monto) }); onClose(); } }} disabled={!ok}>Guardar pago</Btn>
    </FormModal>
  );
}

function CostoFijoForm({ item, onSave, onClose }) {
  const [f, setF] = useState(item || { nombre: "", monto: "", frecuencia: "Mensual", proximoPago: today() });
  const s = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const ok = f.nombre && f.monto && Number(f.monto) > 0;
  return (
    <FormModal title={item ? "✏️ Editar Costo Fijo" : "📌 Nuevo Costo Fijo"} onClose={onClose}>
      <Field label="Nombre"><input type="text" value={f.nombre} onChange={(e) => s("nombre", e.target.value)} placeholder="Ej: Arriendo bodega" style={IS} /></Field>
      <Field label="Monto ($)"><input type="number" value={f.monto} onChange={(e) => s("monto", e.target.value)} placeholder="0" style={IS} /></Field>
      <Field label="Frecuencia"><select value={f.frecuencia} onChange={(e) => s("frecuencia", e.target.value)} style={SS}>{["Mensual", "Bimestral", "Trimestral", "Anual"].map((fr) => <option key={fr}>{fr}</option>)}</select></Field>
      <Field label="Próximo vencimiento"><input type="date" value={f.proximoPago} onChange={(e) => s("proximoPago", e.target.value)} style={IS} /></Field>
      <Btn onClick={() => { if (ok) { onSave({ ...f, id: f.id || uid(), monto: Number(f.monto) }); onClose(); } }} disabled={!ok}>{item ? "Guardar cambios" : "Agregar costo"}</Btn>
    </FormModal>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function TabMovimientos({ data, onAdd, onDelete }) {
  const [form, setForm] = useState(null);
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const movs = [...data.movimientos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const filtrados = movs.filter((m) => {
    if (filtro !== "todos" && m.tipo !== filtro) return false;
    if (busqueda && !m.descripcion.toLowerCase().includes(busqueda.toLowerCase()) && !m.categoria.toLowerCase().includes(busqueda.toLowerCase())) return false;
    return true;
  });
  const totalIngresos = movs.filter((m) => m.tipo === "ingreso").reduce((s, m) => s + m.monto, 0);
  const totalGastos = movs.filter((m) => m.tipo === "gasto").reduce((s, m) => s + m.monto, 0);
  const saldo = totalIngresos - totalGastos;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        <StatCard label="Total Ingresos" value={fmt(totalIngresos)} color="#1E6B5A" />
        <StatCard label="Total Gastos" value={fmt(totalGastos)} color="#C45A5A" />
        <StatCard label="Saldo" value={fmt(saldo)} color={saldo >= 0 ? "#1E6B5A" : "#C45A5A"} sub={saldo >= 0 ? "Positivo ✓" : "Negativo ⚠"} />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={() => setForm("ingreso")} style={{ padding: "9px 16px", background: "#1E6B5A", color: "white", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>➕ Ingreso</button>
        <button onClick={() => setForm("gasto")} style={{ padding: "9px 16px", background: "#C45A5A", color: "white", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>➖ Gasto</button>
        <div style={{ flex: 1, minWidth: 140 }}><input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar..." style={{ ...IS, fontSize: 12 }} /></div>
        <div style={{ display: "flex", gap: 4 }}>
          {["todos", "ingreso", "gasto"].map((f) => <button key={f} onClick={() => setFiltro(f)} style={{ padding: "8px 12px", background: filtro === f ? "#1E1A16" : "white", color: filtro === f ? "white" : "#8A7868", border: "1px solid #E0D8D0", borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{f === "todos" ? "Todos" : f === "ingreso" ? "Ingresos" : "Gastos"}</button>)}
        </div>
      </div>
      <TableWrap>
        {TH(["Fecha", "Tipo", "Categoría", "Descripción", "Método", "Monto", ""])}
        <tbody>
          {filtrados.length === 0 && <Empty cols={7} msg="Sin movimientos registrados" />}
          {filtrados.map((m) => (
            <TR key={m.id}>
              <TD style={{ color: "#7A6858", whiteSpace: "nowrap" }}>{fmtDate(m.fecha)}</TD>
              <TD><span style={{ background: m.tipo === "ingreso" ? "#E8F5F0" : "#FEE8E8", color: m.tipo === "ingreso" ? "#1E6B5A" : "#C45A5A", padding: "3px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700 }}>{m.tipo === "ingreso" ? "↑ Ingreso" : "↓ Gasto"}</span></TD>
              <TD style={{ color: "#5A4A3C", whiteSpace: "nowrap" }}>{m.categoria}</TD>
              <TD style={{ color: "#2C2420" }}>{m.descripcion}{m.comprobante && <span style={{ fontSize: 10, color: "#AAA", marginLeft: 6 }}>#{m.comprobante}</span>}</TD>
              <TD style={{ color: "#7A6858", whiteSpace: "nowrap" }}>{m.metodoPago}</TD>
              <TD style={{ fontWeight: 700, color: m.tipo === "ingreso" ? "#1E6B5A" : "#C45A5A", whiteSpace: "nowrap" }}>{m.tipo === "ingreso" ? "+" : "-"}{fmt(m.monto)}</TD>
              <TD><DeleteBtn onClick={() => onDelete("movimientos", m.id)} /></TD>
            </TR>
          ))}
        </tbody>
      </TableWrap>
      {form && <MovimientoForm tipo={form} onSave={(mov) => { onAdd("movimientos", mov); setForm(null); }} onClose={() => setForm(null)} />}
    </div>
  );
}

function TabInventario({ data, onAdd, onUpdate, onDelete }) {
  const [form, setForm] = useState(null);
  const totalCosto = data.inventario.reduce((s, i) => s + i.costoUnit * i.stock, 0);
  const totalVenta = data.inventario.reduce((s, i) => s + i.precioVenta * i.stock, 0);
  const margen = totalCosto > 0 ? (((totalVenta - totalCosto) / totalCosto) * 100).toFixed(1) : 0;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        <StatCard label="Valor en costo" value={fmt(totalCosto)} color="#2C2420" sub={`${data.inventario.length} productos`} />
        <StatCard label="Valor a precio venta" value={fmt(totalVenta)} color="#1E6B5A" />
        <StatCard label="Margen potencial" value={`${margen}%`} color="#8B6B4A" />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button onClick={() => setForm("nuevo")} style={{ padding: "9px 16px", background: "#1E1A16", color: "white", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>📦 Agregar producto</button>
      </div>
      <TableWrap>
        {TH(["Producto", "Código", "Stock", "Costo unit.", "Precio venta", "Valor total", "Margen", ""])}
        <tbody>
          {data.inventario.length === 0 && <Empty cols={8} msg="Sin productos en inventario" />}
          {data.inventario.map((item) => {
            const mg = item.costoUnit > 0 ? (((item.precioVenta - item.costoUnit) / item.costoUnit) * 100).toFixed(0) : 0;
            const alerta = item.stock <= 3;
            return (
              <TR key={item.id}>
                <TD style={{ fontWeight: 600, color: "#2C2420" }}>{item.nombre}</TD>
                <TD style={{ color: "#8A7868", fontSize: 12 }}>{item.codigo}</TD>
                <TD><span style={{ background: alerta ? "#FEE8E8" : "#F0F7F0", color: alerta ? "#C45A5A" : "#1E6B5A", padding: "3px 8px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{item.stock} {item.unidad}{alerta ? " ⚠" : ""}</span></TD>
                <TD style={{ color: "#5A4A3C" }}>{fmt(item.costoUnit)}</TD>
                <TD style={{ color: "#1E6B5A", fontWeight: 600 }}>{fmt(item.precioVenta)}</TD>
                <TD style={{ fontWeight: 600 }}>{fmt(item.costoUnit * item.stock)}</TD>
                <TD><span style={{ background: "#F5EDE4", color: "#8B6B4A", padding: "3px 8px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{mg}%</span></TD>
                <TD><div style={{ display: "flex", gap: 6 }}><EditBtn onClick={() => setForm(item)} /><DeleteBtn onClick={() => onDelete("inventario", item.id)} /></div></TD>
              </TR>
            );
          })}
        </tbody>
      </TableWrap>
      {form === "nuevo" && <InventarioForm onSave={(item) => { onAdd("inventario", item); setForm(null); }} onClose={() => setForm(null)} />}
      {form && form !== "nuevo" && <InventarioForm item={form} onSave={(item) => { onUpdate("inventario", item); setForm(null); }} onClose={() => setForm(null)} />}
    </div>
  );
}

function TabSueldos({ data, onAdd, onDelete }) {
  const [form, setForm] = useState(false);
  const total = data.sueldos.reduce((s, p) => s + p.monto, 0);
  const mesActual = data.sueldos.filter((p) => { const d = new Date(p.fecha); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); }).reduce((s, p) => s + p.monto, 0);
  const porCol = data.sueldos.reduce((acc, p) => { acc[p.nombre] = (acc[p.nombre] || 0) + p.monto; return acc; }, {});
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        <StatCard label="Total pagado" value={fmt(total)} color="#2C2420" />
        <StatCard label="Colaboradores" value={Object.keys(porCol).length} color="#8B6B4A" />
        <StatCard label="Mes actual" value={fmt(mesActual)} color="#1E6B5A" />
      </div>
      {Object.keys(porCol).length > 0 && <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>{Object.entries(porCol).map(([n, m]) => <div key={n} style={{ background: "white", border: "1px solid #E8E0D4", borderRadius: 10, padding: "8px 14px", fontSize: 12 }}><span style={{ fontWeight: 700 }}>{n}</span><span style={{ color: "#8A7868", marginLeft: 8 }}>{fmt(m)}</span></div>)}</div>}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button onClick={() => setForm(true)} style={{ padding: "9px 16px", background: "#1E1A16", color: "white", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>👤 Registrar pago</button>
      </div>
      <TableWrap>
        {TH(["Fecha", "Colaborador", "Tipo", "Monto", "Observación", ""])}
        <tbody>
          {data.sueldos.length === 0 && <Empty cols={6} msg="Sin pagos registrados" />}
          {[...data.sueldos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map((p) => (
            <TR key={p.id}>
              <TD style={{ color: "#7A6858", whiteSpace: "nowrap" }}>{fmtDate(p.fecha)}</TD>
              <TD style={{ fontWeight: 600 }}>{p.nombre}</TD>
              <TD style={{ color: "#5A4A3C" }}>{p.categoria}</TD>
              <TD style={{ fontWeight: 700, color: "#C45A5A" }}>-{fmt(p.monto)}</TD>
              <TD style={{ color: "#8A7868", fontSize: 12 }}>{p.observacion || "-"}</TD>
              <TD><DeleteBtn onClick={() => onDelete("sueldos", p.id)} /></TD>
            </TR>
          ))}
        </tbody>
      </TableWrap>
      {form && <SueldoForm onSave={(p) => { onAdd("sueldos", p); setForm(false); }} onClose={() => setForm(false)} />}
    </div>
  );
}

function TabCostosFijos({ data, onAdd, onUpdate, onDelete }) {
  const [form, setForm] = useState(null);
  const hoy = new Date();
  const totalMensual = data.costosFijos.reduce((s, c) => { const f = { Mensual: 1, Bimestral: 0.5, Trimestral: 1/3, Anual: 1/12 }; return s + c.monto * (f[c.frecuencia] || 1); }, 0);
  const proximos = data.costosFijos.filter((c) => { const d = (new Date(c.proximoPago) - hoy) / (1000*60*60*24); return d >= 0 && d <= 7; });
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        <StatCard label="Costo fijo mensual" value={fmt(Math.round(totalMensual))} color="#C45A5A" />
        <StatCard label="Total registrados" value={data.costosFijos.length} color="#8B6B4A" sub="costos activos" />
        <StatCard label="Vencen esta semana" value={proximos.length} color={proximos.length > 0 ? "#C45A5A" : "#1E6B5A"} sub={proximos.length > 0 ? "¡Revisar!" : "Todo al día ✓"} />
      </div>
      {proximos.length > 0 && <div style={{ background: "#FFF5F5", border: "1px solid #F5C4C4", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#C45A5A" }}>⚠ <strong>Vencen pronto:</strong> {proximos.map((c) => c.nombre).join(", ")}</div>}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button onClick={() => setForm("nuevo")} style={{ padding: "9px 16px", background: "#1E1A16", color: "white", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>📌 Nuevo costo fijo</button>
      </div>
      <TableWrap>
        {TH(["Nombre", "Monto", "Frecuencia", "Próximo pago", "Mensual equiv.", ""])}
        <tbody>
          {data.costosFijos.length === 0 && <Empty cols={6} msg="Sin costos fijos registrados" />}
          {data.costosFijos.map((c) => {
            const f = { Mensual: 1, Bimestral: 0.5, Trimestral: 1/3, Anual: 1/12 };
            const diff = (new Date(c.proximoPago) - hoy) / (1000*60*60*24);
            const urgente = diff >= 0 && diff <= 7;
            return (
              <TR key={c.id}>
                <TD style={{ fontWeight: 600 }}>{c.nombre}</TD>
                <TD style={{ fontWeight: 700, color: "#C45A5A" }}>{fmt(c.monto)}</TD>
                <TD style={{ color: "#7A6858" }}>{c.frecuencia}</TD>
                <TD style={{ color: urgente ? "#C45A5A" : "#5A4A3C", fontWeight: urgente ? 700 : 400 }}>{fmtDate(c.proximoPago)}{urgente ? " ⚠" : ""}</TD>
                <TD style={{ color: "#8A7868" }}>{fmt(Math.round(c.monto * (f[c.frecuencia] || 1)))}/mes</TD>
                <TD><div style={{ display: "flex", gap: 6 }}><EditBtn onClick={() => setForm(c)} /><DeleteBtn onClick={() => onDelete("costosFijos", c.id)} /></div></TD>
              </TR>
            );
          })}
        </tbody>
      </TableWrap>
      {form === "nuevo" && <CostoFijoForm onSave={(c) => { onAdd("costosFijos", c); setForm(null); }} onClose={() => setForm(null)} />}
      {form && form !== "nuevo" && <CostoFijoForm item={form} onSave={(c) => { onUpdate("costosFijos", c); setForm(null); }} onClose={() => setForm(null)} />}
    </div>
  );
}

function TabResumen({ data }) {
  const ingresos = data.movimientos.filter((m) => m.tipo === "ingreso").reduce((s, m) => s + m.monto, 0);
  const gastos = data.movimientos.filter((m) => m.tipo === "gasto").reduce((s, m) => s + m.monto, 0);
  const sueldos = data.sueldos.reduce((s, p) => s + p.monto, 0);
  const saldo = ingresos - gastos - sueldos;
  const valorInv = data.inventario.reduce((s, i) => s + i.costoUnit * i.stock, 0);
  const costosFijosM = data.costosFijos.reduce((s, c) => { const f = { Mensual: 1, Bimestral: 0.5, Trimestral: 1/3, Anual: 1/12 }; return s + c.monto * (f[c.frecuencia] || 1); }, 0);
  const now = new Date();
  const meses = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const label = d.toLocaleDateString("es-CL", { month: "short", year: "2-digit" });
    const ing = data.movimientos.filter((m) => { const md = new Date(m.fecha); return m.tipo === "ingreso" && md.getMonth() === d.getMonth() && md.getFullYear() === d.getFullYear(); }).reduce((s, m) => s + m.monto, 0);
    const gst = data.movimientos.filter((m) => { const md = new Date(m.fecha); return m.tipo === "gasto" && md.getMonth() === d.getMonth() && md.getFullYear() === d.getFullYear(); }).reduce((s, m) => s + m.monto, 0);
    return { label, ing, gst };
  });
  const maxVal = Math.max(...meses.map((m) => Math.max(m.ing, m.gst)), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12 }}>
        <StatCard label="Ingresos totales" value={fmt(ingresos)} color="#1E6B5A" />
        <StatCard label="Gastos operativos" value={fmt(gastos)} color="#C45A5A" />
        <StatCard label="Sueldos pagados" value={fmt(sueldos)} color="#C45A5A" />
        <StatCard label="Saldo neto" value={fmt(saldo)} color={saldo >= 0 ? "#1E6B5A" : "#C45A5A"} sub={saldo >= 0 ? "Rentable ✓" : "Déficit ⚠"} />
        <StatCard label="Valor inventario" value={fmt(valorInv)} color="#8B6B4A" />
        <StatCard label="Costos fijos/mes" value={fmt(Math.round(costosFijosM))} color="#5A4A7A" />
      </div>
      <div style={{ background: "white", border: "1px solid #E8E0D4", borderRadius: 14, padding: "20px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#8A7868", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Ingresos vs Gastos — Últimos 6 meses</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 140 }}>
          {meses.map((m) => (
            <div key={m.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: "100%", display: "flex", gap: 2, alignItems: "flex-end", height: 110 }}>
                <div style={{ flex: 1, background: "#D4EFE5", borderRadius: "4px 4px 0 0", height: `${(m.ing / maxVal) * 100}%`, minHeight: m.ing > 0 ? 4 : 0 }} title={fmt(m.ing)} />
                <div style={{ flex: 1, background: "#FAD4D4", borderRadius: "4px 4px 0 0", height: `${(m.gst / maxVal) * 100}%`, minHeight: m.gst > 0 ? 4 : 0 }} title={fmt(m.gst)} />
              </div>
              <div style={{ fontSize: 10, color: "#8A7868", fontWeight: 600 }}>{m.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 10, justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}><div style={{ width: 12, height: 12, background: "#D4EFE5", borderRadius: 2 }} />Ingresos</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}><div style={{ width: 12, height: 12, background: "#FAD4D4", borderRadius: 2 }} />Gastos</div>
        </div>
      </div>
      {data.movimientos.filter((m) => m.tipo === "gasto").length > 0 && (
        <div style={{ background: "white", border: "1px solid #E8E0D4", borderRadius: 14, padding: "20px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#8A7868", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Gastos por categoría</div>
          {Object.entries(data.movimientos.filter((m) => m.tipo === "gasto").reduce((acc, m) => { acc[m.categoria] = (acc[m.categoria] || 0) + m.monto; return acc; }, {})).sort((a, b) => b[1] - a[1]).map(([cat, monto]) => {
            const pct = ((monto / gastos) * 100).toFixed(0);
            return (
              <div key={cat} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 500 }}>{cat}</span>
                  <span style={{ color: "#C45A5A", fontWeight: 700 }}>{fmt(monto)} <span style={{ color: "#AAA", fontWeight: 400 }}>({pct}%)</span></span>
                </div>
                <div style={{ height: 6, background: "#F0EAE2", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: "#E8B4A0", borderRadius: 3 }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Principal ────────────────────────────────────────────────────────────────
export default function FlujoCaja({ onClose }) {
  const [data, setData] = useState(loadData);
  const [tab, setTab] = useState("resumen");
  const [exportando, setExportando] = useState(false);
  const sm = typeof window !== "undefined" ? window.innerWidth < 640 : false;

  useEffect(() => { saveData(data); }, [data]);
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  const onAdd = (col, item) => setData((d) => ({ ...d, [col]: [...d[col], item] }));
  const onUpdate = (col, item) => setData((d) => ({ ...d, [col]: d[col].map((x) => x.id === item.id ? item : x) }));
  const onDelete = (col, id) => { if (!window.confirm("¿Eliminar este registro?")) return; setData((d) => ({ ...d, [col]: d[col].filter((x) => x.id !== id) })); };

  const handleExcel = async () => {
    setExportando(true);
    try { await exportExcel(data); } catch { alert("Error al generar Excel. Intenta de nuevo."); }
    setExportando(false);
  };

  const TABS = [
    { id: "resumen", label: "📊 Resumen" },
    { id: "movimientos", label: "💸 Movimientos" },
    { id: "inventario", label: "📦 Inventario" },
    { id: "sueldos", label: "👤 Sueldos" },
    { id: "costos", label: "📌 Costos fijos" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99990, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "stretch", justifyContent: "flex-end" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#F8F4EF", width: "100%", maxWidth: 980, height: "100%", display: "flex", flexDirection: "column", boxShadow: "-12px 0 60px rgba(0,0,0,0.2)", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ background: "#1E1A16", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "Georgia,serif", fontSize: 17, fontWeight: 600, color: "white" }}>📊 Flujo de Caja</div>
            <div style={{ fontSize: 10, color: "rgba(196,180,154,0.65)", marginTop: 2, letterSpacing: 0.5 }}>Casa-Estudio 1016 · Solo administrador · Guardado automático ✓</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={handleExcel} disabled={exportando} style={{ padding: "8px 14px", background: exportando ? "#2A4A2A" : "#1D6B3A", color: "white", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: exportando ? "not-allowed" : "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
              {exportando ? "⏳ Generando..." : "⬇ Exportar Excel"}
            </button>
            <button onClick={() => exportPDF(data)} style={{ padding: "8px 14px", background: "#8B1A1A", color: "white", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
              🖨 Exportar PDF
            </button>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", fontSize: 20, cursor: "pointer", width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>
          </div>
        </div>

        {/* Aviso guardado */}
        <div style={{ background: "#F0F7F0", borderBottom: "1px solid #C8E6C4", padding: "7px 20px", fontSize: 11, color: "#3A6B3A", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          ✅ <strong>Guardado automático activo.</strong> Los datos se guardan en este navegador. Usa <strong>Excel o PDF</strong> como respaldo externo periódicamente.
        </div>

        {/* Tabs */}
        <div style={{ background: "white", borderBottom: "1px solid #E8E0D4", display: "flex", overflowX: "auto", flexShrink: 0, scrollbarWidth: "none" }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flexShrink: 0, padding: sm ? "12px 14px" : "13px 20px", border: "none", background: "none", fontSize: sm ? 11 : 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", color: tab === t.id ? "#1E1A16" : "#8A7868", borderBottom: `2px solid ${tab === t.id ? "#1E1A16" : "transparent"}`, transition: "all .15s", whiteSpace: "nowrap" }}>{t.label}</button>
          ))}
        </div>

        {/* Contenido */}
        <div style={{ flex: 1, overflowY: "auto", padding: sm ? "16px" : "24px" }}>
          {tab === "resumen" && <TabResumen data={data} />}
          {tab === "movimientos" && <TabMovimientos data={data} onAdd={onAdd} onDelete={onDelete} />}
          {tab === "inventario" && <TabInventario data={data} onAdd={onAdd} onUpdate={onUpdate} onDelete={onDelete} />}
          {tab === "sueldos" && <TabSueldos data={data} onAdd={onAdd} onDelete={onDelete} />}
          {tab === "costos" && <TabCostosFijos data={data} onAdd={onAdd} onUpdate={onUpdate} onDelete={onDelete} />}
        </div>
      </div>
    </div>
  );
}
