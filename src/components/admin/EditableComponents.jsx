import { useRef, useEffect } from "react";

export function EditText({ value, onChange, editing, tag = "span", style = {}, multiline = false, placeholder = "Haz clic para editar" }) {
  const ref = useRef();
  const Tag = tag;
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);
  if (!editing) return <Tag style={style}>{value}</Tag>;
  if (multiline) return <textarea ref={ref} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ ...style, background: "rgba(255,255,200,0.9)", border: "2px solid #F5A623", borderRadius: 4, padding: "4px 8px", resize: "vertical", width: "100%", fontFamily: "inherit", outline: "none", minHeight: 80 }} />;
  return <input ref={ref} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ ...style, background: "rgba(255,255,200,0.9)", border: "2px solid #F5A623", borderRadius: 4, padding: "4px 8px", width: "100%", fontFamily: "inherit", outline: "none" }} />;
}

export function Editable({ editing, label, children, style = {}, onClick }) {
  if (!editing) return <div style={style}>{children}</div>;
  return (
    <div onClick={onClick} style={{ ...style, position: "relative", outline: "2px dashed rgba(245,166,35,0.6)", outlineOffset: 2, borderRadius: 4, cursor: "pointer" }}
      onMouseEnter={(e) => { e.currentTarget.style.outline = "2px solid #F5A623"; }}
      onMouseLeave={(e) => { e.currentTarget.style.outline = "2px dashed rgba(245,166,35,0.6)"; }}>
      <div style={{ position: "absolute", top: -18, left: 0, background: "#F5A623", color: "white", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: "3px 3px 3px 0", whiteSpace: "nowrap", zIndex: 10, letterSpacing: 0.5 }}>✏️ {label}</div>
      {children}
    </div>
  );
}

export function ImgUpload({ onImage, children, style = {} }) {
  return (
    <label style={{ ...style, cursor: "pointer", display: "block", position: "relative" }}>
      {children}
      <div style={{ position: "absolute", inset: 0, background: "rgba(245,166,35,0.15)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "inherit" }}>
        <div style={{ background: "#F5A623", color: "white", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>📷 Cambiar imagen</div>
      </div>
      <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = (ev) => onImage(ev.target.result); r.readAsDataURL(f); }} />
    </label>
  );
}
