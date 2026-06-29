import { useState } from "react";
import { Thumb } from "../catalog/Thumb";
import { TX } from "../../utils/textures";
import { CAT_L } from "../../data/products";

export function ProductEditor({ product, onSave, onDelete, onClose }) {
  const [p, setP] = useState({ ...product });
  const set = (k, v) => setP((x) => ({ ...x, [k]: v }));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 12, width: "100%", maxWidth: 480, maxHeight: "90vh", overflow: "auto", padding: 24, boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: 18, fontWeight: 600 }}>Editar Producto</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#888" }}>×</button>
        </div>
        {[["name", "Nombre", "text"], ["code", "Código", "text"], ["dims", "Dimensiones", "text"], ["price", "Precio", "number"], ["unit", "Unidad (c/u, set)", "text"]].map(([k, l, t]) => (
          <div key={k} style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{l}</label>
            <input type={t} value={p[k] || ""} onChange={(e) => set(k, t === "number" ? Number(e.target.value) : e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #E0D8D0", borderRadius: 7, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
          </div>
        ))}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Categoría</label>
          <select value={p.cat || "muro"} onChange={(e) => set("cat", e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #E0D8D0", borderRadius: 7, fontSize: 14, fontFamily: "inherit", outline: "none", background: "white" }}>
            {["muro", "cielo", "exterior", "accesorio"].map((c) => <option key={c} value={c}>{CAT_L[c]}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Imagen / Textura del producto</label>
          <div style={{ width: "100%", height: 110, borderRadius: 8, overflow: "hidden", marginBottom: 10, border: "1px solid #E0D8D0", position: "relative" }}>
            <Thumb tk={p.tk} customImg={p.customImg || null} w={440} h={110} />
            {p.customImg && <button onClick={() => set("customImg", null)} style={{ position: "absolute", top: 6, right: 6, background: "rgba(196,90,90,0.9)", color: "white", border: "none", borderRadius: 5, padding: "3px 8px", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>× Quitar foto</button>}
          </div>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "11px", background: "#FFF8F0", border: "2px dashed #F5A623", borderRadius: 8, cursor: "pointer", marginBottom: 10, fontSize: 13, fontWeight: 700, color: "#B87A10" }}>
            📷 {p.customImg ? "Cambiar foto del producto" : "Subir foto del revestimiento"}
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = (ev) => set("customImg", ev.target.result); r.readAsDataURL(f); }} />
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ flex: 1, height: 1, background: "#E0D8D0" }} /><span style={{ fontSize: 11, color: "#AAA", fontWeight: 600 }}>O elige una textura generada</span><div style={{ flex: 1, height: 1, background: "#E0D8D0" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 5 }}>
            {Object.keys(TX).map((k) => (<div key={k} onClick={() => { set("tk", k); set("customImg", null); }} style={{ borderRadius: 6, overflow: "hidden", cursor: "pointer", border: `2px solid ${!p.customImg && p.tk === k ? "#F5A623" : "transparent"}`, height: 44, opacity: p.customImg ? 0.4 : 1, transition: "opacity .15s" }} title={k}><Thumb tk={k} w={80} h={44} /></div>))}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Descripción</label>
          <textarea value={p.desc || ""} onChange={(e) => set("desc", e.target.value)} rows={3} style={{ width: "100%", padding: "9px 12px", border: "1px solid #E0D8D0", borderRadius: 7, fontSize: 13, fontFamily: "inherit", resize: "none", outline: "none" }} />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => onSave(p)} style={{ flex: 1, padding: "12px", background: "#2C2420", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>✓ Guardar</button>
          <button onClick={() => onDelete(p.id)} style={{ padding: "12px 16px", background: "#FEE2E2", color: "#C45A5A", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>🗑</button>
        </div>
      </div>
    </div>
  );
}
