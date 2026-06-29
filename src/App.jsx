// ─────────────────────────────────────────────────────────────────────────────
//  Casa-Estudio 1016 · App.jsx
//  Integración: sección "Diseña tu proyecto en 5 pasos"
//  insertada entre SERVICES y CTA, usando los tokens C del sitio,
//  fuentes HWYGothic / HWYGWide y arquitectura de componentes existente.
// ─────────────────────────────────────────────────────────────────────────────

import QuotationModal from "./QuotationModal";
import FlujoCaja from "./FlujoCaja";
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { slugify } from "./ProductPage.jsx";
import { createPortal } from "react-dom";
import heroImg from "./assets/Hero1.png";
import heroVideo from "./assets/HeroVideo.mp4";
import about1 from "./assets/Inicio1.jpeg";
import about2 from "./assets/Inicio2.jpeg";
import about3 from "./assets/Inicio3.jpeg";
import about4 from "./assets/Inicio5.png";
import { useW } from "./hooks/useW";
import { sendEmail } from "./utils/email";
import { getCoverageM2, calcularCubicacion } from "./utils/coverage";
import { TX } from "./utils/textures";
import { DEFAULT_PRODS, CATS, CAT_L, $$ } from "./data/products";
import {
  WZ_TIPOS, WZ_TERRENO, WZ_AGUA, WZ_ALCANTARILLADO, WZ_PRESUPUESTO,
  WZ_PROGRAMA, WZ_ESTILOS, WZ_MAT_PISO, WZ_MAT_REV_EXT, WZ_MAT_TABIQUE,
  WZ_MAT_AISLACION, WZ_MAT_INT_LIVING, WZ_MAT_INT_COCINA, WZ_MAT_INT_DORM,
  WZ_MAT_INT_BANO, WZ_MATS_INIT, WZ_INIT,
  wzLabel, buildMatsText, getMLabel, buildWizardWA, getCotNum,
} from "./data/wizardData";
import { Thumb, applyTexture } from "./components/catalog/Thumb";
import { ProductCarousel } from "./components/catalog/ProductCarousel";
import { EditText, Editable, ImgUpload } from "./components/admin/EditableComponents";
import { ProductEditor } from "./components/admin/ProductEditor";
import { SeccionDiseñaProyecto } from "./components/sections/SeccionDiseñaProyecto";
import { WizardSimple } from "./components/wizard/WizardSimple";

// ─── WIZARD: BARRA DE PROGRESO ────────────────────────────────────────────────
function WzProgressBar({ step, C }) {
  const labels = ["Tipo", "Datos", "Programa", "Estilo", "Resumen"];
  const pct = (step / 4) * 100;
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 10 }}>
        {labels.map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, flexShrink: 0,
                border: `2px solid ${i < step ? C.warm : i === step ? C.dark : "#E0D8D0"}`,
                background: i < step ? C.warm : i === step ? C.dark : "white",
                color: i < step || i === step ? "white" : "#8A7868",
                transition: "all 0.3s",
              }}>
                {i < step ? "✓" : i + 1}
              </div>
              <span style={{
                fontSize: 9, fontWeight: i === step ? 700 : 400, textAlign: "center",
                color: i === step ? C.dark : i < step ? C.warm : "#9E9890",
                letterSpacing: 0.3,
              }}>{l}</span>
            </div>
            {i < 4 && (
              <div style={{
                flex: 1, height: 2, marginTop: 14, marginLeft: 3, marginRight: 3,
                background: i < step ? C.warm : "#E0D8D0",
                transition: "background 0.4s",
              }} />
            )}
          </div>
        ))}
      </div>
      <div style={{ height: 2, background: "#E0D8D0", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: C.dark, borderRadius: 4, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

// ─── WIZARD: TARJETA SELECCIONABLE ────────────────────────────────────────────
function WzCard({ label, icon, selected, onClick, C, small }) {
  return (
    <button type="button" onClick={onClick} style={{
      position: "relative", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: small ? 5 : 8, padding: small ? "10px 6px" : "14px 8px",
      border: `2px solid ${selected ? C.warm : "#E0D8D0"}`,
      borderRadius: 10, cursor: "pointer", textAlign: "center", width: "100%",
      background: selected ? `${C.warm}12` : "white",
      transition: "all 0.18s", fontFamily: "inherit",
    }}>
      {icon && <span style={{ fontSize: small ? 18 : 22, lineHeight: 1 }}>{icon}</span>}
      <span style={{
        fontSize: small ? 11 : 12, fontWeight: 700, lineHeight: 1.3,
        color: selected ? C.dark : "#6B6560",
        fontFamily: "'HWYGothic', sans-serif",
      }}>{label}</span>
      {selected && (
        <div style={{
          position: "absolute", top: 5, right: 5,
          width: 14, height: 14, borderRadius: "50%",
          background: C.warm, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 8, color: "white", fontWeight: 800,
        }}>✓</div>
      )}
    </button>
  );
}

// ─── WIZARD: CHIP MULTI ───────────────────────────────────────────────────────
function WzChip({ label, icon, selected, onClick, C }) {
  return (
    <button type="button" onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "7px 13px",
      border: `1.5px solid ${selected ? C.warm : "#E0D8D0"}`,
      borderRadius: 7, cursor: "pointer",
      background: selected ? `${C.warm}15` : "white",
      fontSize: 12, fontWeight: 600,
      color: selected ? C.dark : "#6B6560",
      transition: "all 0.18s", fontFamily: "'HWYGothic', sans-serif",
    }}>
      {icon && <span style={{ fontSize: 13 }}>{icon}</span>}
      {label}
    </button>
  );
}

// ─── WIZARD: CAMPO DE TEXTO ───────────────────────────────────────────────────
function WzField({ label, placeholder, value, onChange, type = "text", required, C }) {
  const [focus, setFocus] = useState(false);
  return (
    <div>
      <label style={{
        display: "block", fontSize: 10, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: 0.6,
        color: "#8A7868", marginBottom: 5,
        fontFamily: "'HWYGothic', sans-serif",
      }}>
        {label} {required && <span style={{ color: C.warm }}>*</span>}
      </label>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: "100%", padding: "10px 13px",
          border: `1.5px solid ${focus ? C.warm : "#E0D8D0"}`,
          borderRadius: 8, fontSize: 13,
          fontFamily: "'HWYGothic', sans-serif",
          background: "#FAFAF8", color: "#2A3528", outline: "none",
          transition: "border-color 0.2s",
        }}
      />
    </div>
  );
}

// ─── WIZARD: ERROR INLINE ─────────────────────────────────────────────────────
function WzErr({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      fontSize: 12, color: "#b91c1c", background: "#fef2f2",
      border: "1px solid #fecaca", borderRadius: 7,
      padding: "7px 12px", marginTop: 8,
      fontFamily: "'HWYGothic', sans-serif",
    }}>
      ⚠ {msg}
    </div>
  );
}

// ─── WIZARD PASOS ─────────────────────────────────────────────────────────────
function WzPaso1({ d, setD, error, C, sm }) {
  return (
    <div>
      {/* Badge "Cabañas" */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${C.dark}10`, border: `1px solid ${C.dark}25`, borderRadius: 20, padding: "4px 12px", marginBottom: 14 }}>
        <span style={{ fontSize: 14 }}>🏕️</span>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: C.dark, fontFamily: "'HWYGothic',sans-serif" }}>Configurador de cabañas</span>
      </div>
      <h3 style={{ fontFamily: "'HWYGWide', sans-serif", fontSize: sm ? 20 : 24, fontWeight: 400, color: "#2A3528", marginBottom: 6, lineHeight: 1.2 }}>
        ¿Qué tipo de cabaña buscas?
      </h3>
      <p style={{ fontSize: 13, color: "#6B7B6A", marginBottom: 22, lineHeight: 1.7, fontFamily: "'HWYGothic', sans-serif" }}>
        Selecciona la tipología que mejor describe tu idea. Podemos adaptar cualquier diseño a tu terreno y contexto.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
        {WZ_TIPOS.map(t => (
          <WzCard key={t.id} label={t.label} icon={t.icon}
            selected={d.tipo === t.id} onClick={() => setD(p => ({ ...p, tipo: t.id }))} C={C} />
        ))}
      </div>
      <WzErr msg={error} />
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "#F5F7F3", border: "1px solid #C8D8B8", borderRadius: 8, padding: "10px 14px", marginTop: 18, fontSize: 12, color: "#4A6741", lineHeight: 1.65, fontFamily: "'HWYGothic',sans-serif" }}>
        <span style={{ flexShrink: 0, marginTop: 1 }}>💡</span>
        <span>Todos nuestros diseños de cabañas contemplan revestimientos de nuestro catálogo propio: Siding Metálico, Wall Panel Madera y PVC Mármol, disponibles en Santa Bárbara.</span>
      </div>
    </div>
  );
}

function WzPaso2({ d, setD, errors, C, sm }) {
  // Sub-label reutilizable
  const SubLabel = ({ children, required }) => (
    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#8A7868", marginBottom: 10, fontFamily: "'HWYGothic',sans-serif" }}>
      {children}{required && <span style={{ color: C.warm }}> *</span>}
    </p>
  );

  // Card de infraestructura (agua / alcantarillado)
  const InfraCard = ({ item, selected, onClick }) => (
    <button type="button" onClick={onClick} style={{
      display: "flex", flexDirection: "column", gap: 3,
      padding: "12px 11px", borderRadius: 9, textAlign: "left", width: "100%",
      border: `2px solid ${selected ? C.dark : "#E0D8D0"}`,
      background: selected ? `${C.dark}0D` : "white",
      cursor: "pointer", fontFamily: "'HWYGothic',sans-serif",
      transition: "all 0.18s", position: "relative",
    }}>
      {selected && (
        <div style={{ position: "absolute", top: 7, right: 8, width: 16, height: 16, borderRadius: "50%", background: C.warm, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "white", fontWeight: 800 }}>✓</div>
      )}
      <span style={{ fontSize: 18, lineHeight: 1, marginBottom: 2 }}>{item.icon}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: selected ? C.dark : "#2A3528", lineHeight: 1.3 }}>{item.label}</span>
      <span style={{ fontSize: 10, color: "#9A8A7A", lineHeight: 1.4 }}>{item.desc}</span>
    </button>
  );

  return (
    <div>
      <h3 style={{ fontFamily: "'HWYGWide', sans-serif", fontSize: sm ? 20 : 24, fontWeight: 400, color: "#2A3528", marginBottom: 4, lineHeight: 1.2 }}>
        Datos generales del terreno
      </h3>
      <p style={{ fontSize: 13, color: "#6B7B6A", marginBottom: 22, lineHeight: 1.7, fontFamily: "'HWYGothic',sans-serif" }}>
        Esta información es clave para dimensionar correctamente tu cabaña y sus instalaciones.
      </p>

      {/* Nombre + Ubicación */}
      <div style={{ display: "grid", gridTemplateColumns: sm ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 18 }}>
        <div>
          <WzField label="Tu nombre" placeholder="Ej: María González"
            value={d.nombre} onChange={v => setD(p => ({ ...p, nombre: v }))} required C={C} />
          <WzErr msg={errors?.nombre} />
        </div>
        <div>
          <WzField label="Comuna o ubicación" placeholder="Ej: Pucón, Los Ríos"
            value={d.ubicacion} onChange={v => setD(p => ({ ...p, ubicacion: v }))} required C={C} />
          <WzErr msg={errors?.ubicacion} />
        </div>
        <WzField label="Superficie aprox. de la cabaña (m²)" placeholder="Ej: 65"
          type="number" value={d.superficie} onChange={v => setD(p => ({ ...p, superficie: v }))} C={C} />
      </div>

      {/* Terreno */}
      <div style={{ marginBottom: 18 }}>
        <SubLabel required>¿Cuenta con terreno?</SubLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 9 }}>
          {WZ_TERRENO.map(t => (
            <button key={t.id} type="button" onClick={() => setD(p => ({ ...p, terreno: t.id }))} style={{
              padding: "11px 6px", borderRadius: 9,
              border: `2px solid ${d.terreno === t.id ? C.warm : "#E0D8D0"}`,
              background: d.terreno === t.id ? `${C.warm}12` : "white",
              color: d.terreno === t.id ? C.dark : "#6B7B6A",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              fontFamily: "'HWYGothic',sans-serif", transition: "all 0.18s",
            }}>📍 {t.label}</button>
          ))}
        </div>
        <WzErr msg={errors?.terreno} />
      </div>

      {/* ── AGUA POTABLE ── */}
      <div style={{ marginBottom: 18 }}>
        <SubLabel>Factibilidad de agua potable</SubLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 9 }}>
          {WZ_AGUA.map(a => (
            <InfraCard key={a.id} item={a}
              selected={d.agua === a.id}
              onClick={() => setD(p => ({ ...p, agua: a.id }))} />
          ))}
        </div>
      </div>

      {/* ── ALCANTARILLADO / AGUAS SERVIDAS ── */}
      <div style={{ marginBottom: 18 }}>
        <SubLabel>Sistema de aguas servidas</SubLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 9 }}>
          {WZ_ALCANTARILLADO.map(a => (
            <InfraCard key={a.id} item={a}
              selected={d.alcantarillado === a.id}
              onClick={() => setD(p => ({ ...p, alcantarillado: a.id }))} />
          ))}
        </div>
      </div>

      {/* Nota informativa */}
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "#FFF8F2", border: "1px solid #F0D8C0", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#7A5530", lineHeight: 1.65, fontFamily: "'HWYGothic',sans-serif" }}>
        <span style={{ flexShrink: 0, marginTop: 1 }}>⚠️</span>
        <span>La factibilidad de agua y alcantarillado influye directamente en el costo y viabilidad del proyecto. Si aún no lo tienes definido, te asesoramos en el proceso.</span>
      </div>

      {/* Presupuesto */}
      <div style={{ marginTop: 18 }}>
        <SubLabel>Presupuesto estimado</SubLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px,1fr))", gap: 9 }}>
          {WZ_PRESUPUESTO.map(p => (
            <button key={p.id} type="button" onClick={() => setD(prev => ({ ...prev, presupuesto: p.id }))} style={{
              display: "flex", flexDirection: "column", alignItems: "flex-start",
              gap: 2, padding: "12px 11px", borderRadius: 9,
              border: `2px solid ${d.presupuesto === p.id ? C.warm : "#E0D8D0"}`,
              background: d.presupuesto === p.id ? `${C.warm}12` : "white",
              cursor: "pointer", fontFamily: "'HWYGothic',sans-serif", transition: "all 0.18s",
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: d.presupuesto === p.id ? C.dark : "#2A3528" }}>{p.label}</span>
              <span style={{ fontSize: 11, color: "#9A8A7A" }}>{p.sub}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function WzPaso3({ d, setD, C, sm }) {
  const toggle = (id) => {
    const item = WZ_PROGRAMA.find(x => x.id === id);
    setD(prev => {
      let next = [...prev.programa];
      if (item.group === "dorm" || item.group === "baño") {
        next = next.filter(x => WZ_PROGRAMA.find(o => o.id === x)?.group !== item.group);
        if (!prev.programa.includes(id)) next.push(id);
      } else {
        next = next.includes(id) ? next.filter(x => x !== id) : [...next, id];
      }
      return { ...prev, programa: next };
    });
  };
  const subLabel = (t) => (
    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#9A8A7A", marginBottom: 9, fontFamily: "'HWYGothic', sans-serif" }}>{t}</p>
  );
  return (
    <div>
      <h3 style={{ fontFamily: "'HWYGWide', sans-serif", fontSize: sm ? 20 : 24, fontWeight: 400, color: "#2A3528", marginBottom: 4 }}>
        Programa y necesidades
      </h3>
      <p style={{ fontSize: 13, color: "#6B7B6A", marginBottom: 22, lineHeight: 1.7, fontFamily: "'HWYGothic', sans-serif" }}>
        Selecciona los espacios que necesitas. Puedes elegir múltiples opciones.
      </p>
      <div style={{ marginBottom: 16 }}>
        {subLabel("Dormitorios")}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {WZ_PROGRAMA.filter(x => x.group === "dorm").map(o => (
            <WzCard key={o.id} label={o.label} icon={o.icon}
              selected={d.programa.includes(o.id)} onClick={() => toggle(o.id)} C={C} small />
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        {subLabel("Baños")}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
          {WZ_PROGRAMA.filter(x => x.group === "baño").map(o => (
            <WzCard key={o.id} label={o.label} icon={o.icon}
              selected={d.programa.includes(o.id)} onClick={() => toggle(o.id)} C={C} small />
          ))}
        </div>
      </div>
      <div>
        {subLabel("Espacios adicionales")}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {WZ_PROGRAMA.filter(x => x.group === "extra").map(o => (
            <WzChip key={o.id} label={o.label} icon={o.icon}
              selected={d.programa.includes(o.id)} onClick={() => toggle(o.id)} C={C} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PASO 4: helpers de materialidades ───────────────────────────────────────
function MatGroup({ title, options, value, onChange, C, multi = false }) {
  // single: onChange(string) | multi: onChange([...strings])
  const isSelected = (id) => multi ? (Array.isArray(value) && value.includes(id)) : value === id;
  const handleClick = (id) => {
    if (multi) {
      const arr = Array.isArray(value) ? value : [];
      onChange(arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]);
    } else {
      onChange(value === id ? "" : id);
    }
  };
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6,
        color: "#8A7868", marginBottom: 8, fontFamily: "'HWYGothic', sans-serif" }}>{title}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {options.map(o => (
          <button key={o.id} type="button" onClick={() => handleClick(o.id)} style={{
            padding: "7px 13px", border: `1.5px solid ${isSelected(o.id) ? "#4A6741" : "#E0D8D0"}`,
            borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 600,
            background: isSelected(o.id) ? "#EEF3E8" : "white",
            color: isSelected(o.id) ? "#2A3528" : "#6B7B6A",
            fontFamily: "'HWYGothic', sans-serif", transition: "all 0.18s",
          }}>{o.label}</button>
        ))}
      </div>
    </div>
  );
}

function IntZoneGroup({ zone, label, options, value, onChange, C }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "11px 14px",
      background: "white", border: "1px solid #E8E0D4", borderRadius: 8, marginBottom: 8 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: "#4A6741", minWidth: 86,
        paddingTop: 3, fontFamily: "'HWYGothic', sans-serif", flexShrink: 0 }}>{label}</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {options.map(o => {
          const sel = value === o.id;
          return (
            <button key={o.id} type="button" onClick={() => onChange(zone, value === o.id ? "" : o.id)} style={{
              padding: "5px 11px", border: `1.5px solid ${sel ? "#4A6741" : "#E0D8D0"}`,
              borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600,
              background: sel ? "#EEF3E8" : "#FAFAF8",
              color: sel ? "#2A3528" : "#6B7B6A",
              fontFamily: "'HWYGothic', sans-serif", transition: "all 0.18s",
            }}>{o.label}</button>
          );
        })}
      </div>
    </div>
  );
}

function WzPaso4({ d, setD, error, C, sm }) {
  // Helper: setea un campo de d.mats
  const setMat = (key, val) => setD(p => ({ ...p, mats: { ...(p.mats || WZ_MATS_INIT), [key]: val } }));
  // Helper: setea zona interior
  const setInt = (zone, val) => setMat(zone, val);

  const mats = d.mats || WZ_MATS_INIT;

  const SectionTitle = ({ children }) => (
    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6,
      color: "#4A6741", marginBottom: 10, fontFamily: "'HWYGothic', sans-serif",
      borderBottom: "1.5px solid #D0E0C8", paddingBottom: 5 }}>{children}</p>
  );

  return (
    <div>
      <h3 style={{ fontFamily: "'HWYGWide', sans-serif", fontSize: sm ? 20 : 24, fontWeight: 400, color: "#2A3528", marginBottom: 4 }}>
        Estilo y materialidad
      </h3>
      <p style={{ fontSize: 13, color: "#6B7B6A", marginBottom: 22, lineHeight: 1.7, fontFamily: "'HWYGothic', sans-serif" }}>
        Define la estética y los materiales de revestimiento que prefieres.
      </p>

      {/* ── Estilo arquitectónico ── */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6,
          color: "#8A7868", marginBottom: 10, fontFamily: "'HWYGothic', sans-serif" }}>
          Estilo arquitectónico <span style={{ color: C.warm }}>*</span>
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px,1fr))", gap: 9 }}>
          {WZ_ESTILOS.map(e => (
            <WzCard key={e.id} label={e.label} icon={e.icon}
              selected={d.estilo === e.id}
              onClick={() => setD(p => ({ ...p, estilo: e.id }))} C={C} />
          ))}
        </div>
        <WzErr msg={error} />
      </div>

      {/* ── Materialidades agrupadas ── */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 7, background: "#F0F7F0",
        border: "1px solid #B8D8B0", borderRadius: 8, padding: "9px 12px", marginBottom: 18,
        fontSize: 11, color: "#3A6B3A", lineHeight: 1.6, fontFamily: "'HWYGothic', sans-serif" }}>
        🧱 Los revestimientos están disponibles en nuestro catálogo en Santa Bárbara.
      </div>

      {/* Piso */}
      <div style={{ background: "#FAFAF8", border: "1px solid #E8E0D4", borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
        <SectionTitle>Ítem piso</SectionTitle>
        <MatGroup options={WZ_MAT_PISO} value={mats.piso}
          onChange={v => setMat("piso", v)} C={C} />
      </div>

      {/* Revestimiento exterior */}
      <div style={{ background: "#FAFAF8", border: "1px solid #E8E0D4", borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
        <SectionTitle>Ítem revestimiento exterior</SectionTitle>
        <MatGroup options={WZ_MAT_REV_EXT} value={mats.revestimientoExterior}
          onChange={v => setMat("revestimientoExterior", v)} C={C} />
      </div>

      {/* Tabique / estructura de muros */}
      <div style={{ background: "#FAFAF8", border: "1px solid #E8E0D4", borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
        <SectionTitle>Ítem tabique / estructura de muros</SectionTitle>
        <MatGroup options={WZ_MAT_TABIQUE} value={mats.tabique}
          onChange={v => setMat("tabique", v)} C={C} />
      </div>

      {/* Aislación */}
      <div style={{ background: "#FAFAF8", border: "1px solid #E8E0D4", borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
        <SectionTitle>Ítem aislación</SectionTitle>
        <MatGroup options={WZ_MAT_AISLACION} value={mats.aislacion}
          onChange={v => setMat("aislacion", v)} C={C} />
      </div>

      {/* Revestimiento interior por zona */}
      <div style={{ background: "#FAFAF8", border: "1px solid #E8E0D4", borderRadius: 10, padding: "14px 16px", marginBottom: 4 }}>
        <SectionTitle>Ítem revestimiento interior por zona</SectionTitle>
        <IntZoneGroup zone="intLiving"     label="Living"      options={WZ_MAT_INT_LIVING}  value={mats.intLiving}     onChange={setInt} C={C} />
        <IntZoneGroup zone="intCocina"     label="Cocina"      options={WZ_MAT_INT_COCINA}  value={mats.intCocina}     onChange={setInt} C={C} />
        <IntZoneGroup zone="intDormitorio" label="Dormitorio"  options={WZ_MAT_INT_DORM}    value={mats.intDormitorio} onChange={setInt} C={C} />
        <IntZoneGroup zone="intBano"       label="Baño"        options={WZ_MAT_INT_BANO}    value={mats.intBano}       onChange={setInt} C={C} />
      </div>
    </div>
  );
}

// ─── COTIZACIÓN CABAÑA MODAL ─────────────────────────────────────────────────
// Genera un PDF con el mismo look de la tarjeta oscura del Paso 5:
// fondo verde, header con logo, título grande, filas label/valor,
// nota de materiales, número de cotización y condiciones.
function CabañaCotizacionModal({ data, C, waNumber, onClose }) {
  const [cotNum] = useState(() => getCotNum());

  const today     = new Date();
  const fmtDate   = (d) => d.toLocaleDateString("es-CL", { day:"2-digit", month:"2-digit", year:"numeric" });
  const validUntil = new Date(today); validUntil.setDate(validUntil.getDate() + 15);

  const prog = data.programa.map(id => wzLabel(id, WZ_PROGRAMA)).join(", ") || "No especificado";
  const mats = buildMatsText(data.mats);

  const GREEN  = C.dark || "#4A6741";
  const ORANGE = C.warm || "#F4806D";

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // ── Imprimir como PDF: abre ventana nueva con SOLO la tarjeta ───────────────
  // ── Genera y descarga el PDF ─────────────────────────────────────────────────
  // ── Genera el HTML del PDF con estilos incrustados (responsive) ─────────────
  const buildPDFHtml = () => {
    const el = document.getElementById("cab-cot-card");
    if (!el) return null;
    // Clonar el nodo para limpiar scripts/eventos
    const clone = el.cloneNode(true);
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${cotNum} · Casa-Estudio 1016</title>
  <style>
    @font-face { font-family:'HWYGothic'; src:url('/src/assets/fonts/HWYGOTH.TTF'); }
    @font-face { font-family:'HWYGWide';  src:url('/src/assets/fonts/HWYGWDE.TTF'); }
    *, *::before, *::after {
      box-sizing: border-box; margin: 0; padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      font-family: 'HWYGothic', Arial, sans-serif;
      background: #1a1a1a;
      min-height: 100vh;
      display: flex; justify-content: center; align-items: flex-start;
      padding: 20px;
    }
    /* Tarjeta principal */
    #cab-cot-card {
      width: 100%; max-width: 560px;
      border-radius: 16px; overflow: hidden;
    }
    /* Responsive: móvil */
    @media (max-width: 600px) {
      body { padding: 12px; }
      #cab-cot-card { border-radius: 12px; }
    }
    /* Print */
    @media print {
      html, body {
        background: #1a1a1a !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      @page { margin: 0; size: A5 portrait; }
      #cab-cot-card { max-width: 100%; border-radius: 0; }
    }
  </style>
</head>
<body>
  ${clone.outerHTML}
</body>
</html>`;
  };

  // ── Descarga directa del PDF (sin diálogo de impresión) ──────────────────────
  const handlePDF = () => {
    const html = buildPDFHtml();
    if (!html) return;
    // Crear blob y descargar directamente
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${cotNum}-Casa-Estudio-1016.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Abrir también en ventana para imprimir como PDF desde el navegador
    const w = window.open(url, "_blank", "width=620,height=900,noopener");
    if (w) {
      w.addEventListener("load", () => {
        setTimeout(() => {
          w.print();
          setTimeout(() => URL.revokeObjectURL(url), 3000);
        }, 500);
      });
    } else {
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }
  };

  // ── Enviar PDF por WhatsApp: descarga el archivo y abre WhatsApp ─────────────
  const handlePDFWhatsApp = () => {
    // Paso 1: descarga el archivo directamente
    const html = buildPDFHtml();
    if (html) {
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `${cotNum}-Casa-Estudio-1016.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 3000);
    }
    // Paso 2: abre WhatsApp con aviso de adjunto (300ms después)
    const msgConPDF = encodeURIComponent(
      `Hola, soy ${data.nombre || "un cliente"}. Adjunto la cotización n° ${cotNum} de cabaña descargada desde casaestudio.cl.\n\n` +
      `Tipo: ${wzLabel(data.tipo, WZ_TIPOS)}\n` +
      `Ubicación: ${data.ubicacion || "No indicada"}\n` +
      `Superficie: ${data.superficie || "A definir"} m²\n` +
      `Terreno: ${wzLabel(data.terreno, WZ_TERRENO)}\n` +
      `Agua potable: ${wzLabel(data.agua, WZ_AGUA)}\n` +
      `Aguas servidas: ${wzLabel(data.alcantarillado, WZ_ALCANTARILLADO)}\n` +
      `Programa: ${prog}\n` +
      `Estilo: ${wzLabel(data.estilo, WZ_ESTILOS)}\n` +
      `Materialidad: ${mats}\n` +
      `Presupuesto: ${wzLabel(data.presupuesto, WZ_PRESUPUESTO)}\n\n` +
      `📎 El archivo de cotización ya fue descargado. Puedes adjuntarlo a este chat. ¡Gracias!`
    );
    setTimeout(() => {
      window.open(`https://wa.me/${waNumber}?text=${msgConPDF}`, "_blank");
    }, 400);
  };

  // ── Mensaje WhatsApp ────────────────────────────────────────────────────────
  const waMsg = encodeURIComponent(
    `Hola, soy ${data.nombre || "un cliente"}. Solicito cotización n° ${cotNum} para una cabaña en Casa Estudio 1016.\n\n` +
    `Tipo: ${wzLabel(data.tipo, WZ_TIPOS)}\n` +
    `Ubicación: ${data.ubicacion || "No indicada"}\n` +
    `Superficie: ${data.superficie || "A definir"} m²\n` +
    `Terreno: ${wzLabel(data.terreno, WZ_TERRENO)}\n` +
    `Agua potable: ${wzLabel(data.agua, WZ_AGUA)}\n` +
    `Aguas servidas: ${wzLabel(data.alcantarillado, WZ_ALCANTARILLADO)}\n` +
    `Programa: ${prog}\n` +
    `Estilo: ${wzLabel(data.estilo, WZ_ESTILOS)}\n` +
    `Materialidad: ${buildMatsText(data.mats)}\n` +
    `Presupuesto: ${wzLabel(data.presupuesto, WZ_PRESUPUESTO)}\n\n` +
    `Quedo atento a contacto. ¡Gracias!`
  );

  // ── Fila de datos ────────────────────────────────────────────────────────────
  const Row = ({ label, value }) => {
    if (!value || value === "—") return null;
    return (
      <div style={{
        display: "flex", gap: 12, padding: "10px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        <span style={{
          fontSize: 10, fontWeight: 700, textTransform: "uppercase",
          letterSpacing: 0.7, color: "rgba(245,240,232,0.45)",
          minWidth: 120, flexShrink: 0, paddingTop: 1,
          fontFamily: "'HWYGothic', Arial, sans-serif",
        }}>{label}</span>
        <span style={{
          fontSize: 13, color: "#EDE5D8", lineHeight: 1.5, flex: 1,
          fontFamily: "'HWYGothic', Arial, sans-serif", fontWeight: 500,
        }}>{value}</span>
      </div>
    );
  };

  return createPortal(
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 1100, background: "rgba(10,8,6,0.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(8px)" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 560, maxHeight: "94vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 0 }}
      >
        {/* ── Toolbar (no se imprime) ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px", background: "rgba(255,255,255,0.06)",
          borderRadius: "12px 12px 0 0", backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.1)", borderBottom: "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>📄</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "white", fontFamily: "'HWYGWide', Arial, sans-serif" }}>{cotNum}</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "Arial, sans-serif" }}>· Cotización de cabaña</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {/* Enviar resumen por WhatsApp (solo texto) */}
            <a
              href={`https://wa.me/${waNumber}?text=${waMsg}`}
              target="_blank" rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#25D366", color: "white", borderRadius: 7, padding: "8px 13px", fontSize: 12, fontWeight: 700, textDecoration: "none", fontFamily: "Arial, sans-serif" }}
              title="Enviar resumen por WhatsApp"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Enviar por WhatsApp
            </a>
            {/* Enviar PDF por WhatsApp: descarga PDF y abre WA */}
            <button
              onClick={handlePDFWhatsApp}
              style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#128C7E", color: "white", border: "none", borderRadius: 7, padding: "8px 13px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Arial, sans-serif" }}
              title="Descarga el PDF y abre WhatsApp para adjuntarlo"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              📎 Enviar PDF por WhatsApp
            </button>
            {/* Descargar PDF */}
            <button
              onClick={handlePDF}
              style={{ display: "inline-flex", alignItems: "center", gap: 5, background: GREEN, color: "white", border: "none", borderRadius: 7, padding: "8px 13px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Arial, sans-serif" }}
            >
              📥 Descargar PDF
            </button>
            <button
              onClick={onClose}
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 7, padding: "8px 12px", fontSize: 16, cursor: "pointer", color: "rgba(255,255,255,0.7)", lineHeight: 1 }}
            >×</button>
          </div>
        </div>

        {/* ── TARJETA OSCURA — este div es el que se imprime ── */}
        <div
          id="cab-cot-card"
          style={{
            background: GREEN,
            borderRadius: "0 0 16px 16px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Glow decorativo */}
          <div style={{ position: "absolute", top: 0, right: 0, width: 220, height: 220, borderRadius: "50%", background: `${ORANGE}18`, filter: "blur(50px)", pointerEvents: "none" }} />

          {/* ── Header: logo + número cotización ── */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, background: ORANGE, borderRadius: 7,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, color: "white",
                fontFamily: "'HWYGWide', Arial, sans-serif", flexShrink: 0,
              }}>1016</div>
              <div>
                <div style={{ fontFamily: "'HWYGWide', Arial, sans-serif", fontSize: 15, fontWeight: 700, color: "white", lineHeight: 1 }}>
                  Casa-Estudio <span style={{ color: ORANGE }}>1016</span>
                </div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1.5, marginTop: 3 }}>
                  Cotización de cabaña · casaestudio.cl
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>N° cotización</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "white", marginTop: 2 }}>{cotNum}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                Válida hasta {fmtDate(validUntil)}
              </div>
            </div>
          </div>

          {/* ── Título del proyecto ── */}
          <div style={{ padding: "18px 20px 14px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "rgba(255,255,255,0.4)", marginBottom: 6, fontFamily: "'HWYGothic', Arial, sans-serif" }}>
              {data.nombre ? `Proyecto de ${data.nombre}` : "Proyecto de cabaña"}
            </div>
            <div style={{ fontFamily: "'HWYGWide', Arial, sans-serif", fontSize: 28, fontWeight: 700, color: "white", lineHeight: 1.1 }}>
              {wzLabel(data.tipo, WZ_TIPOS) || "Cabaña"}
              {data.superficie && (
                <em style={{ color: ORANGE, fontStyle: "italic", fontSize: "0.65em", marginLeft: 8 }}>
                  · {data.superficie} m²
                </em>
              )}
            </div>
          </div>

          {/* ── Filas de datos ── */}
          <div style={{ background: "rgba(0,0,0,0.22)", margin: "0 12px", borderRadius: 10, overflow: "hidden" }}>
            <Row label="Tipo de cabaña"  value={wzLabel(data.tipo, WZ_TIPOS)} />
            <Row label="Ubicación"       value={data.ubicacion} />
            <Row label="Terreno"         value={wzLabel(data.terreno, WZ_TERRENO)} />
            <Row label="Superficie"      value={data.superficie ? `${data.superficie} m²` : null} />
            <Row label="Agua potable"    value={wzLabel(data.agua, WZ_AGUA)} />
            <Row label="Aguas servidas"  value={wzLabel(data.alcantarillado, WZ_ALCANTARILLADO)} />
            <Row label="Programa"        value={prog} />
            <Row label="Estilo"          value={wzLabel(data.estilo, WZ_ESTILOS)} />
            {/* Materialidades desglosadas */}
            {data.mats?.piso                  && <Row label="Piso"              value={getMLabel(data.mats.piso,                  "piso")} />}
            {data.mats?.revestimientoExterior && <Row label="Rev. exterior"      value={getMLabel(data.mats.revestimientoExterior,  "revestimientoExterior")} />}
            {data.mats?.tabique               && <Row label="Tabique/Estructura" value={getMLabel(data.mats.tabique,                "tabique")} />}
            {data.mats?.aislacion             && <Row label="Aislación"          value={getMLabel(data.mats.aislacion,              "aislacion")} />}
            {data.mats?.intLiving             && <Row label="Int. Living"        value={getMLabel(data.mats.intLiving,              "intLiving")} />}
            {data.mats?.intCocina             && <Row label="Int. Cocina"        value={getMLabel(data.mats.intCocina,              "intCocina")} />}
            {data.mats?.intDormitorio         && <Row label="Int. Dormitorio"    value={getMLabel(data.mats.intDormitorio,          "intDormitorio")} />}
            {data.mats?.intBano               && <Row label="Int. Baño"          value={getMLabel(data.mats.intBano,                "intBano")} />}
            <Row label="Presupuesto"     value={wzLabel(data.presupuesto, WZ_PRESUPUESTO)} />
          </div>

          {/* ── Nota de materiales CE-1016 ── */}
          {buildMatsText(data.mats) !== "No especificado" && (
            <div style={{ margin: "12px 12px 0", padding: "10px 14px", background: `${ORANGE}20`, border: `1px solid ${ORANGE}35`, borderRadius: 8 }}>
              <p style={{ fontSize: 11, color: "#E8B090", lineHeight: 1.65, fontFamily: "'HWYGothic', Arial, sans-serif" }}>
                🧱 Los materiales de revestimiento seleccionados están disponibles en el catálogo de importación de Casa-Estudio 1016, Santa Bárbara, Biobío.
              </p>
            </div>
          )}

          {/* ── Separador y datos de emisión ── */}
          <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'HWYGothic', Arial, sans-serif", lineHeight: 1.7 }}>
              <div>Emitido el {fmtDate(today)}</div>
              <div>Arturo Prat 1016, Santa Bárbara · casaestudio.cl</div>
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: "'HWYGothic', Arial, sans-serif", textAlign: "right", lineHeight: 1.6 }}>
              <div>Cotización referencial · No vinculante</div>
              <div>Válida por 15 días · IVA incluido</div>
            </div>
          </div>
        </div>
        {/* /tarjeta */}
      </div>
    </div>,
    document.body
  );
}

// ─── PASO 5 DEL WIZARD ────────────────────────────────────────────────────────
function WzPaso5({ d, C, sm, waNumber, onCotizar }) {
  const prog = d.programa.map(id => wzLabel(id, WZ_PROGRAMA)).join(", ") || "No especificado";
  const mats = buildMatsText(d.mats);
  const waHref = buildWizardWA(d, waNumber);

  const Row = ({ label, value }) => (
    <div style={{ display: "flex", gap: 12, padding: "9px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "rgba(245,240,232,0.4)", minWidth: 110, flexShrink: 0, paddingTop: 1, fontFamily: "'HWYGothic',sans-serif" }}>{label}</span>
      <span style={{ fontSize: 12, color: "#EDE5D8", lineHeight: 1.5, flex: 1, fontFamily: "'HWYGothic',sans-serif" }}>{value || "—"}</span>
    </div>
  );

  return (
    <div>
      <h3 style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: sm ? 20 : 24, fontWeight: 400, color: "#2A3528", marginBottom: 4 }}>Resumen de tu cabaña</h3>
      <p style={{ fontSize: 13, color: "#6B7B6A", marginBottom: 18, lineHeight: 1.7, fontFamily: "'HWYGothic',sans-serif" }}>
        Todo listo. Descarga tu cotización en PDF o envíala por WhatsApp.
      </p>

      <div style={{ background: C.dark, borderRadius: 14, overflow: "hidden", marginBottom: 14, position: "relative" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: 180, height: 180, borderRadius: "50%", background: `${C.warm}20`, filter: "blur(40px)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 18px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ width: 28, height: 28, borderRadius: 5, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "white", fontFamily: "'HWYGWide',sans-serif", flexShrink: 0 }}>1016</div>
          <div>
            <div style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: 13, fontWeight: 700, color: "white", lineHeight: 1 }}>Casa-Estudio <span style={{ color: C.warm }}>1016</span></div>
            <div style={{ fontSize: 9, color: "rgba(245,240,232,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>Cotización preliminar de cabaña</div>
          </div>
        </div>
        <div style={{ padding: "14px 18px 10px", fontFamily: "'HWYGothic',sans-serif", fontSize: sm ? 22 : 26, fontWeight: 800, color: "white", lineHeight: 1.15 }}>
          {wzLabel(d.tipo, WZ_TIPOS) || "Cabaña"}
          {d.superficie && <em style={{ color: C.warm, fontStyle: "italic", fontSize: "0.75em" }}> · {d.superficie} m²</em>}
        </div>
        <div style={{ background: "rgba(0,0,0,0.2)", margin: "0 10px", borderRadius: 9, overflow: "hidden" }}>
          <Row label="Tipo"           value={wzLabel(d.tipo, WZ_TIPOS)} />
          <Row label="Ubicación"      value={d.ubicacion} />
          <Row label="Terreno"        value={wzLabel(d.terreno, WZ_TERRENO)} />
          <Row label="Superficie"     value={d.superficie ? `${d.superficie} m²` : null} />
          <Row label="Agua potable"   value={wzLabel(d.agua, WZ_AGUA)} />
          <Row label="Aguas servidas" value={wzLabel(d.alcantarillado, WZ_ALCANTARILLADO)} />
          <Row label="Programa"       value={prog} />
          <Row label="Estilo"         value={wzLabel(d.estilo, WZ_ESTILOS)} />
          {/* Materialidades desglosadas por categoría */}
          {d.mats?.piso                  && <Row label="Piso"              value={getMLabel(d.mats.piso,                 "piso")} />}
          {d.mats?.revestimientoExterior && <Row label="Rev. exterior"     value={getMLabel(d.mats.revestimientoExterior, "revestimientoExterior")} />}
          {d.mats?.tabique               && <Row label="Tabique/Estructura" value={getMLabel(d.mats.tabique,               "tabique")} />}
          {d.mats?.aislacion             && <Row label="Aislación"          value={getMLabel(d.mats.aislacion,             "aislacion")} />}
          {d.mats?.intLiving             && <Row label="Int. Living"        value={getMLabel(d.mats.intLiving,             "intLiving")} />}
          {d.mats?.intCocina             && <Row label="Int. Cocina"        value={getMLabel(d.mats.intCocina,             "intCocina")} />}
          {d.mats?.intDormitorio         && <Row label="Int. Dormitorio"    value={getMLabel(d.mats.intDormitorio,         "intDormitorio")} />}
          {d.mats?.intBano               && <Row label="Int. Baño"          value={getMLabel(d.mats.intBano,               "intBano")} />}
          <Row label="Presupuesto"    value={wzLabel(d.presupuesto, WZ_PRESUPUESTO)} />
        </div>
        {buildMatsText(d.mats) !== "No especificado" && (
          <div style={{ margin: "10px 10px 0", padding: "9px 13px", background: `${C.warm}20`, border: `1px solid ${C.warm}40`, borderRadius: 8 }}>
            <p style={{ fontSize: 11, color: "#E8B090", lineHeight: 1.6, fontFamily: "'HWYGothic',sans-serif" }}>🧱 Materiales disponibles en catálogo CE-1016, Santa Bárbara, Biobío.</p>
          </div>
        )}
        <div style={{ height: 14 }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 9 }}>
        <a href={waHref} target="_blank" rel="noreferrer"
          style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: "#25D366", color: "white", padding: "14px", borderRadius: 9, fontSize: 14, fontWeight: 700, textDecoration: "none", fontFamily: "'HWYGothic',sans-serif" }}>
          💬 Enviar solicitud por WhatsApp
        </a>
        <button type="button" onClick={onCotizar} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          padding: "12px", borderRadius: 9, border: "none",
          background: C.dark, color: "white", fontSize: 13, fontWeight: 700,
          cursor: "pointer", fontFamily: "'HWYGothic',sans-serif",
        }}>
          📄 Descargar cotización PDF
        </button>
        <button type="button" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          padding: "12px", borderRadius: 9, background: "white", color: "#2A3528",
          border: "1.5px solid #E0D8D0", fontSize: 13, fontWeight: 600,
          cursor: "pointer", fontFamily: "'HWYGothic',sans-serif",
        }}>
          ✏ Volver a editar
        </button>
      </div>
      <p style={{ textAlign: "center", fontSize: 11, color: "#9A8A7A", lineHeight: 1.7, fontFamily: "'HWYGothic',sans-serif" }}>
        Respuesta en 24–48 horas hábiles con orientación y presupuesto referencial.
      </p>
    </div>
  );
}

// ─── WIZARD MODAL ─────────────────────────────────────────────────────────────
function WizardModal({ onClose, C, waNumber, sm }) {
  const [step,           setStep]           = useState(0);
  const [data,           setData]           = useState(WZ_INIT);
  const [errors,         setErrors]         = useState({});
  const [cotizacionOpen, setCotizacionOpen] = useState(false);

  const validar = useCallback(() => {
    const e = {};
    if (step === 0 && !data.tipo)           e.tipo      = "Selecciona un tipo de cabaña para continuar.";
    if (step === 1) {
      if (!data.nombre.trim())              e.nombre    = "Por favor ingresa tu nombre.";
      if (!data.ubicacion.trim())           e.ubicacion = "Por favor indica tu ubicación.";
      if (!data.terreno)                    e.terreno   = "Indica si cuentas con terreno.";
    }
    if (step === 3 && !data.estilo)         e.estilo    = "Selecciona un estilo arquitectónico.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [step, data]);

  const next = () => { if (validar()) { setStep(s => Math.min(4, s + 1)); setErrors({}); } };
  const prev = () => { setStep(s => Math.max(0, s - 1)); setErrors({}); };

  const PASOS = [
    <WzPaso1 key="p1" d={data} setD={setData} error={errors.tipo}   C={C} sm={sm} />,
    <WzPaso2 key="p2" d={data} setD={setData} errors={errors}       C={C} sm={sm} />,
    <WzPaso3 key="p3" d={data} setD={setData}                       C={C} sm={sm} />,
    <WzPaso4 key="p4" d={data} setD={setData} error={errors.estilo} C={C} sm={sm} />,
    <WzPaso5 key="p5" d={data} C={C} sm={sm} waNumber={waNumber} onCotizar={() => setCotizacionOpen(true)} />,
  ];

  // Bloquear scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const wizardPortal = createPortal(
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 1001, background: "rgba(15,12,10,0.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: sm ? 0 : 16, backdropFilter: "blur(5px)" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#FAF8F4", width: "100%", maxWidth: 680,
          height: sm ? "100%" : "auto", maxHeight: sm ? "100%" : "92vh",
          borderRadius: sm ? 0 : 16, overflowY: "auto",
          display: "flex", flexDirection: "column",
          boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E8E0D4", display: "flex", alignItems: "center", justifyContent: "space-between", background: "white", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: C.dark, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'HWYGWide',sans-serif", fontSize: 11, fontWeight: 700, color: "white" }}>
              1016
            </div>
            <div>
              <div style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: 15, fontWeight: 700, color: "#2A3528", lineHeight: 1 }}>
                Casa-Estudio <span style={{ color: C.warm }}>1016</span>
              </div>
              <div style={{ fontSize: 9, color: "#8A7868", letterSpacing: 1, textTransform: "uppercase" }}>
                Configura tu cabaña · Paso {step + 1} de 5
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "1px solid #E0D8D0", borderRadius: 7, padding: "6px 12px", cursor: "pointer", fontSize: 13, color: "#8A7868", fontFamily: "'HWYGothic',sans-serif", display: "flex", alignItems: "center", gap: 5 }}>
            × Cerrar
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: sm ? "20px 16px" : "24px 28px" }}>
          <WzProgressBar step={step} C={C} />
          <div key={step} style={{ animation: "fadeUp 0.3s ease both" }}>
            {PASOS[step]}
          </div>
        </div>

        {/* Nav footer */}
        {step < 4 && (
          <div style={{ padding: "14px 20px", borderTop: "1px solid #E8E0D4", background: "white", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <button
              type="button" onClick={prev} disabled={step === 0}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "10px 18px", borderRadius: 8,
                border: "1.5px solid #E0D8D0", background: "white",
                fontSize: 13, fontWeight: 600, cursor: step === 0 ? "not-allowed" : "pointer",
                color: step === 0 ? "#C0BDB7" : "#2A3528", opacity: step === 0 ? 0.4 : 1,
                fontFamily: "'HWYGothic',sans-serif", transition: "all 0.18s",
              }}>
              ← Anterior
            </button>
            <span style={{ fontSize: 11, color: "#9A8A7A", fontFamily: "'HWYGothic',sans-serif" }}>
              {step + 1} / 5
            </span>
            <button
              type="button" onClick={next}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "10px 22px", borderRadius: 8, border: "none",
                background: C.dark, color: "white",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                fontFamily: "'HWYGothic',sans-serif", transition: "background 0.2s",
                boxShadow: `0 3px 12px ${C.dark}40`,
              }}
              onMouseOver={e => e.currentTarget.style.background = C.warm}
              onMouseOut={e => e.currentTarget.style.background = C.dark}
            >
              {step === 3 ? "Ver resumen" : "Continuar"} →
            </button>
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 10, color: "#B0ADA8", padding: "8px 16px 14px", fontFamily: "'HWYGothic',sans-serif" }}>
          🔒 Tu información se usa únicamente para preparar tu cotización · casaestudio.cl
        </p>
      </div>
    </div>,
    document.body
  );

  // Modal de cotización PDF — se abre sobre el wizard
  return (
    <>
      {wizardPortal}
      {cotizacionOpen && (
        <CabañaCotizacionModal
          data={data}
          C={C}
          waNumber={waNumber}
          onClose={() => setCotizacionOpen(false)}
        />
      )}
    </>
  );
}

function VisualizerModal({ prods, onClose, C, $$, waNumber }) {
  const w = useW();
  const sm = w < 640;
  const [vizSurface, setVizSurface] = useState("muro");
  const [vizFilterCat, setVizFilterCat] = useState("todos");
  const [vizSelected, setVizSelected] = useState(null);
  const [panel, setPanel] = useState("foto");
  const [vizImage, setVizImage] = useState(null);
  const [vizDragging, setVizDragging] = useState(false);
  const [wallLength, setWallLength] = useState("");
  const [wallHeight, setWallHeight] = useState("");
  const [wastePercent, setWastePercent] = useState(10);
  const [openingsM2, setOpeningsM2] = useState(0);
  const [busy, setBusy] = useState(false);
  const [resultOriginal, setResultOriginal] = useState(null);
  const [resultImg, setResultImg] = useState(null);
  const [resultTxt, setResultTxt] = useState("");
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  useEffect(() => { setVizFilterCat("todos"); setVizSelected(null); }, [vizSurface]);
  const selectedVizProduct = vizSelected || null;
  const coverage = selectedVizProduct ? getCoverageM2(selectedVizProduct) : 1;
  const cubiResult = selectedVizProduct && parseFloat(wallLength) > 0 && parseFloat(wallHeight) > 0
    ? calcularCubicacion({ largo: parseFloat(wallLength), alto: parseFloat(wallHeight), merma: parseFloat(wastePercent) || 0, descuentoVanos: parseFloat(openingsM2) || 0, coberturaM2PorUnidad: coverage, precioUnitario: selectedVizProduct.price })
    : null;
  const vizCats = vizSurface === "muro"
    ? [{ key: "todos", label: "Todos" }, { key: "muro", label: "Muros int." }, { key: "exterior", label: "Muros ext." }]
    : [{ key: "todos", label: "Todos" }, { key: "cielo", label: "Cielos" }];
  const vizFiltered = prods.filter((p) => {
    if (vizSurface === "muro" && !(p.cat === "muro" || p.cat === "exterior")) return false;
    if (vizSurface === "cielo" && p.cat !== "cielo") return false;
    if (vizFilterCat !== "todos" && p.cat !== vizFilterCat) return false;
    return true;
  });
  const handleVizFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setVizImage(e.target.result);
    reader.readAsDataURL(file);
  }, []);
  function buildWAMessage() {
    if (!selectedVizProduct || !cubiResult) return "";
    return encodeURIComponent(`Hola, quiero cotizar este revestimiento:\n\nProducto:\n${selectedVizProduct.name}\nCódigo:\n${selectedVizProduct.code}\n\nDimensiones del muro:\nLargo: ${wallLength} m\nAlto: ${wallHeight} m\n\nSuperficie:\nm² brutos: ${cubiResult.m2Bruto.toFixed(2)}\nm² netos: ${cubiResult.m2Neto.toFixed(2)}\nm² con merma: ${cubiResult.m2ConMerma.toFixed(2)}\n\nCantidad estimada:\n${cubiResult.unidades} ${selectedVizProduct.unit}\n\nPrecio unitario:\n${$$(selectedVizProduct.price)}\n\nPrecio total estimado:\n${$$(cubiResult.precioTotal)}\n\nAdjunto o envío la imagen de referencia para revisar factibilidad.`);
  }
  async function generarVisualizacionIA() {
    if (!vizImage || !selectedVizProduct) return;
    if (!(parseFloat(wallLength) > 0) || !(parseFloat(wallHeight) > 0)) return;
    setBusy(true); setResultImg(null); setResultTxt(""); setResultOriginal(vizImage);
    const imageBase64 = vizImage.includes(",") ? vizImage.split(",")[1] : vizImage;
    let productImageBase64 = null;
    if (selectedVizProduct.customImg) { productImageBase64 = selectedVizProduct.customImg.includes(",") ? selectedVizProduct.customImg.split(",")[1] : selectedVizProduct.customImg; }
    else if (selectedVizProduct.image && typeof selectedVizProduct.image === "string" && selectedVizProduct.image.startsWith("data:")) { productImageBase64 = selectedVizProduct.image.split(",")[1]; }
    try {
      const response = await fetch("/api/generate-visualization", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imageBase64, productName: selectedVizProduct.name, productDesc: selectedVizProduct.desc || "", productImageBase64, surface: vizSurface, largo: parseFloat(wallLength), alto: parseFloat(wallHeight) }) });
      const data = await response.json();
      if (response.ok && data.imageUrl) { setResultImg(data.imageUrl); setResultTxt(`✦ Visualización generada con IA — ${selectedVizProduct.name} aplicado en ${vizSurface}.`); }
      else if (data.fallback) { const fallback = await applyTexture(vizImage, selectedVizProduct.tk, vizSurface, selectedVizProduct.customImg || null); setResultImg(fallback); setResultTxt(`Simulación local (IA no disponible: ${data.error || "error"}). Visítanos en Arturo Prat 1016 para asesoría personalizada.`); }
      else { throw new Error(data.error || "Error desconocido."); }
    } catch {
      try { const fallback = await applyTexture(vizImage, selectedVizProduct.tk, vizSurface, selectedVizProduct.customImg || null); setResultImg(fallback); setResultTxt("Simulación local de textura. Backend IA en proceso de conexión."); }
      catch { setResultTxt("Error al procesar la imagen. Intenta con otra foto."); }
    }
    setBusy(false);
  }
  const inputSt = { width: "100%", padding: "9px 11px", border: "1px solid #D8CEC0", borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none", background: "#FAFAF8", color: C.text };
  const labelSt = { display: "block", fontSize: 10, fontWeight: 700, color: "#8A7868", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 };
  const cardSt = { background: "white", border: "1px solid #EDE8E0", borderRadius: 12, padding: sm ? 14 : 16 };
  const secTitle = { fontFamily: "'HWYGWide', sans-serif", fontSize: 11, fontWeight: 700, color: C.dark, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 };
  const renderCatalogo = () => (
    <div style={{ width: sm ? "100%" : 260, background: "white", borderLeft: sm ? "none" : "1px solid #EDE8E0", display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0 }}>
      <div style={{ padding: "10px 10px 6px", borderBottom: "1px solid #EDE8E0", flexShrink: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8 }}>
          {[{ k: "muro", icon: "🧱", l: "Muros" }, { k: "cielo", icon: "☁️", l: "Cielos" }].map((s) => (<button key={s.k} onClick={() => setVizSurface(s.k)} style={{ padding: "8px 4px", borderRadius: 8, border: `2px solid ${vizSurface === s.k ? C.warm : "#E0D8D0"}`, background: vizSurface === s.k ? "#FFF4F0" : "white", color: vizSurface === s.k ? C.warm : C.mid, fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{s.icon} {s.l}</button>))}
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {vizCats.map((c) => (<button key={c.key} onClick={() => setVizFilterCat(c.key)} style={{ padding: "3px 9px", border: `1px solid ${vizFilterCat === c.key ? C.warm : "#E0D8D0"}`, borderRadius: 20, fontSize: 10, fontWeight: 700, cursor: "pointer", background: vizFilterCat === c.key ? C.warm : "white", color: vizFilterCat === c.key ? "white" : "#8A7868", fontFamily: "inherit" }}>{c.label}</button>))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 8, display: "flex", flexDirection: "column", gap: 5 }}>
        {vizFiltered.length === 0 && <div style={{ textAlign: "center", padding: "30px 10px", color: "#8A7868", fontSize: 12 }}>Sin productos en esta categoría.</div>}
        {vizFiltered.map((p) => {
          const sel = vizSelected?.id === p.id;
          const cov = getCoverageM2(p);
          return (
            <div key={p.id} onClick={() => { setVizSelected(p); if (sm) setPanel("foto"); }} style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px 9px", borderRadius: 8, border: `2px solid ${sel ? C.warm : "transparent"}`, background: sel ? "#FFF4F0" : "#FAFAF8", cursor: "pointer", transition: "all .15s" }}
              onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = "#F5F0EA"; }}
              onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = "#FAFAF8"; }}>
              <div style={{ width: 44, height: 44, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
                {p.image ? <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Thumb tk={p.tk} customImg={p.customImg || null} w={44} h={44} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                <div style={{ fontSize: 9, color: "#8A7868" }}>{p.dims} · {cov.toFixed(3)} m²/ud</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: C.warmDk }}>{$$(p.price)}</div>
              </div>
              {sel && <div style={{ width: 18, height: 18, background: C.warm, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "white", fontWeight: 800, flexShrink: 0 }}>✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
  const renderMain = () => (
    <div style={{ flex: 1, overflowY: "auto", padding: sm ? 14 : 18, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={cardSt}>
        <div style={secTitle}>📷 Foto del espacio</div>
        <div onDragOver={(e) => { e.preventDefault(); setVizDragging(true); }} onDragLeave={() => setVizDragging(false)} onDrop={(e) => { e.preventDefault(); setVizDragging(false); handleVizFile(e.dataTransfer.files?.[0]); }} style={{ border: vizDragging ? `2px solid ${C.warm}` : "2px dashed #D8CEC0", background: vizDragging ? "#FFF4F0" : "#F7F3EE", borderRadius: 10, overflow: "hidden" }}>
          {!vizImage ? (
            <div style={{ padding: 24, textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🏠</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>Sube una foto del muro o espacio que quieres revestir</div>
              <div style={{ fontSize: 11, color: "#8A7868", marginBottom: 14 }}>JPG, PNG o WEBP</div>
              <label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 8, background: C.dark, color: "white", fontWeight: 700, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
                📁 Seleccionar foto<input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleVizFile(e.target.files?.[0])} />
              </label>
            </div>
          ) : (
            <div>
              <img src={vizImage} alt="Espacio cargado" style={{ width: "100%", maxHeight: 220, objectFit: "contain", display: "block" }} />
              <div style={{ display: "flex", gap: 8, padding: "10px 12px", justifyContent: "flex-end" }}>
                <label style={{ padding: "7px 12px", borderRadius: 7, background: C.dark, color: "white", fontWeight: 700, cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>Cambiar foto<input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleVizFile(e.target.files?.[0])} /></label>
                <button onClick={() => { setVizImage(null); setResultImg(null); setResultOriginal(null); }} style={{ padding: "7px 12px", borderRadius: 7, background: "white", color: C.text, border: "1px solid #D8CEC0", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 11 }}>Quitar foto</button>
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedVizProduct && (<div style={cardSt}><div style={secTitle}>🧱 Producto seleccionado</div><div style={{ display: "flex", gap: 12, alignItems: "center" }}><div style={{ width: 58, height: 58, borderRadius: 8, overflow: "hidden", flexShrink: 0, border: "1px solid #EDE8E0" }}>{selectedVizProduct.image ? <img src={selectedVizProduct.image} alt={selectedVizProduct.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Thumb tk={selectedVizProduct.tk} customImg={selectedVizProduct.customImg || null} w={58} h={58} />}</div><div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 2 }}>{selectedVizProduct.name}</div><div style={{ fontSize: 11, color: "#8A7868", marginBottom: 2 }}>Código: {selectedVizProduct.code} · {selectedVizProduct.dims}</div><div style={{ fontSize: 11, color: "#8A7868", marginBottom: 4 }}>Cobertura: <strong>{getCoverageM2(selectedVizProduct).toFixed(4)} m²/unidad</strong></div><div style={{ fontSize: 15, fontWeight: 800, color: C.dark }}>{$$(selectedVizProduct.price)} <span style={{ fontSize: 11, fontWeight: 400, color: "#8A7868" }}>{selectedVizProduct.unit}</span></div></div></div>{sm && (<button onClick={() => setPanel("catalogo")} style={{ marginTop: 10, width: "100%", padding: "8px", borderRadius: 7, border: `1px solid ${C.warm}`, background: "white", color: C.warm, fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Cambiar material →</button>)}</div>)}
      <div style={cardSt}>
        <div style={secTitle}>📐 Medidas del muro</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}>
          <div><label style={labelSt}>Largo (m)</label><input type="number" min="0" step="0.01" value={wallLength} onChange={(e) => setWallLength(e.target.value)} placeholder="ej: 4.20" style={inputSt} onFocus={(e) => e.target.style.borderColor = C.warm} onBlur={(e) => e.target.style.borderColor = "#D8CEC0"} /></div>
          <div><label style={labelSt}>Alto (m)</label><input type="number" min="0" step="0.01" value={wallHeight} onChange={(e) => setWallHeight(e.target.value)} placeholder="ej: 2.40" style={inputSt} onFocus={(e) => e.target.style.borderColor = C.warm} onBlur={(e) => e.target.style.borderColor = "#D8CEC0"} /></div>
          <div><label style={labelSt}>Merma (%)</label><input type="number" min="0" max="50" step="1" value={wastePercent} onChange={(e) => setWastePercent(e.target.value)} style={inputSt} onFocus={(e) => e.target.style.borderColor = C.warm} onBlur={(e) => e.target.style.borderColor = "#D8CEC0"} /></div>
          <div><label style={labelSt}>Descuento vanos (m²)</label><input type="number" min="0" step="0.01" value={openingsM2} onChange={(e) => setOpeningsM2(e.target.value)} placeholder="ej: 1.80" style={inputSt} onFocus={(e) => e.target.style.borderColor = C.warm} onBlur={(e) => e.target.style.borderColor = "#D8CEC0"} /></div>
        </div>
        <div style={{ fontSize: 10, color: "#A09488", lineHeight: 1.6 }}>Los vanos son superficies a descontar: puertas, ventanas, etc.</div>
      </div>
      {cubiResult && selectedVizProduct && (<div style={{ ...cardSt, background: "#F0F7F0", border: "1px solid #B8D8B0" }}><div style={{ ...secTitle, color: "#2A6A2A" }}>📦 Resumen de cubicación</div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>{[["m² brutos", cubiResult.m2Bruto.toFixed(2) + " m²"], ["m² netos", cubiResult.m2Neto.toFixed(2) + " m²"], ["m² con merma", cubiResult.m2ConMerma.toFixed(2) + " m²"], ["Cobertura/ud", getCoverageM2(selectedVizProduct).toFixed(4) + " m²"], ["Unidades a comprar", cubiResult.unidades + " " + selectedVizProduct.unit], ["Precio unitario", $$(selectedVizProduct.price)]].map(([l, v]) => (<div key={l} style={{ background: "white", borderRadius: 7, padding: "8px 10px", border: "1px solid #C8E0C0" }}><div style={{ fontSize: 9, color: "#5A8A5A", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 2 }}>{l}</div><div style={{ fontSize: 14, fontWeight: 700, color: "#1A4A1A" }}>{v}</div></div>))}</div><div style={{ background: C.dark, borderRadius: 8, padding: "11px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}><span style={{ fontSize: 12, color: "rgba(255,255,255,.7)", fontWeight: 600 }}>Total estimado</span><span style={{ fontSize: 20, fontWeight: 800, color: "white" }}>{$$(cubiResult.precioTotal)}</span></div><div style={{ fontSize: 10, color: "#5A8A5A", marginTop: 8 }}>* Referencial. No incluye instalación ni despacho.</div></div>)}
      <button disabled={!vizImage || !selectedVizProduct || !(parseFloat(wallLength) > 0) || !(parseFloat(wallHeight) > 0) || busy} onClick={generarVisualizacionIA} style={{ padding: "14px", borderRadius: 10, border: "none", background: (!vizImage || !selectedVizProduct || !(parseFloat(wallLength) > 0) || !(parseFloat(wallHeight) > 0) || busy) ? "#D8CEC0" : C.dark, color: (!vizImage || !selectedVizProduct || !(parseFloat(wallLength) > 0) || !(parseFloat(wallHeight) > 0) || busy) ? "#A09488" : "white", fontSize: 14, fontWeight: 700, cursor: (!vizImage || !selectedVizProduct || busy) ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background .2s" }}>{busy ? "⏳ Procesando visualización..." : !vizImage ? "Sube una foto para comenzar" : !selectedVizProduct ? "Elige un material del catálogo" : !(parseFloat(wallLength) > 0) || !(parseFloat(wallHeight) > 0) ? "Ingresa las medidas del muro" : "✨ Generar visualización"}</button>
      {busy && (<div style={{ display: "flex", alignItems: "center", gap: 12, background: "#F5F0EA", borderRadius: 10, padding: "14px 16px" }}><div style={{ width: 26, height: 26, border: "3px solid #E0D8D0", borderTopColor: C.dark, borderRadius: "50%", animation: "spin .7s linear infinite", flexShrink: 0 }} /><div><div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>Generando visualización...</div><div style={{ fontSize: 11, color: "#8A7868", marginTop: 2 }}>Aplicando textura a tu imagen</div></div></div>)}
      {resultImg && resultOriginal && !busy && (<div style={cardSt}><div style={secTitle}>✦ Resultado</div><div style={{ display: "grid", gridTemplateColumns: sm ? "1fr" : "1fr 1fr", gap: 10, marginBottom: 12 }}><div><div style={{ fontSize: 10, color: "#8A7868", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 5 }}>Antes</div><div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #EDE8E0" }}><img src={resultOriginal} alt="Antes" style={{ width: "100%", display: "block", maxHeight: 200, objectFit: "cover" }} /></div></div><div><div style={{ fontSize: 10, color: C.warm, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 5 }}>Después</div><div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${C.warm}`, position: "relative" }}><img src={resultImg} alt="Después" style={{ width: "100%", display: "block", maxHeight: 200, objectFit: "cover" }} /><div style={{ position: "absolute", bottom: 6, left: 6, background: "rgba(44,36,32,.85)", color: "white", fontSize: 10, padding: "3px 9px", borderRadius: 12, fontWeight: 700 }}>✦ {selectedVizProduct?.name}</div></div></div></div>{resultTxt && (<div style={{ background: "#F5EDE4", borderLeft: "3px solid #8B6B4A", padding: "10px 12px", borderRadius: "0 7px 7px 0", fontSize: 12, color: "#5A4A3C", lineHeight: 1.7, marginBottom: 12 }}>{resultTxt}</div>)}{cubiResult && selectedVizProduct && (<a href={`https://wa.me/${waNumber}?text=${buildWAMessage()}`} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#25D366", color: "white", padding: "13px", borderRadius: 9, fontSize: 14, fontWeight: 700, textDecoration: "none", fontFamily: "inherit" }}>💬 Solicitar cotización por WhatsApp</a>)}</div>)}
      {!resultImg && cubiResult && selectedVizProduct && (<a href={`https://wa.me/${waNumber}?text=${buildWAMessage()}`} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#25D366", color: "white", padding: "13px", borderRadius: 9, fontSize: 14, fontWeight: 700, textDecoration: "none", fontFamily: "inherit" }}>💬 Cotizar por WhatsApp (sin visualización)</a>)}
    </div>
  );
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,12,10,0.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: sm ? 0 : 20, backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#FAF8F4", borderRadius: sm ? 0 : 16, width: "100%", maxWidth: 940, height: sm ? "100%" : "92vh", maxHeight: sm ? "100%" : "92vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}>
        <div style={{ padding: "12px 18px", borderBottom: "1px solid #EDE8E0", display: "flex", alignItems: "center", justifyContent: "space-between", background: "white", flexShrink: 0 }}>
          <div><div style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: 16, fontWeight: 700, color: C.text }}>✦ Visualizador IA</div><div style={{ fontSize: 11, color: "#8A7868", marginTop: 1 }}>Aplica texturas reales y calcula materiales</div></div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #E0D8D0", background: "white", cursor: "pointer", fontSize: 20, color: "#8A7868", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        {sm && (<div style={{ display: "flex", borderBottom: "2px solid #EDE8E0", flexShrink: 0 }}>{[["foto", "📷 Mi espacio"], ["catalogo", "🧱 Materiales"]].map(([id, l]) => (<button key={id} onClick={() => setPanel(id)} style={{ flex: 1, padding: "11px 4px", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit", background: panel === id ? "#FAF8F4" : "white", color: panel === id ? C.dark : "#8A7868", borderBottom: `2px solid ${panel === id ? C.dark : "transparent"}`, marginBottom: -2 }}>{l}</button>))}</div>)}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {(!sm || panel === "foto") && renderMain()}
          {(!sm || panel === "catalogo") && renderCatalogo()}
        </div>
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ─────────────────────────────────────────────────────────────
export default function App() {
  const w = useW();
  const sm = w < 640;const navigate = useNavigate();
  const md = w < 900;

  const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS;
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem("ce1016_admin") === "yes");
  const [loginOpen, setLoginOpen] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);

  const tryLogin = () => {
    if (passInput === ADMIN_PASS) { sessionStorage.setItem("ce1016_admin", "yes"); setIsAdmin(true); setLoginOpen(false); setPassInput(""); setPassError(false); }
    else { setPassError(true); setPassInput(""); setTimeout(() => setPassError(false), 2000); }
  };
  const logout = () => { sessionStorage.removeItem("ce1016_admin"); setIsAdmin(false); setEditMode(false); };

  const [editMode, setEditMode] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [productEditor, setProductEditor] = useState(null);
  const [saved, setSaved] = useState(false);
  const [filterCat, setFilterCat] = useState("todos");
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [cart, setCart] = useState([]);
  const [qtyByProduct, setQtyByProduct] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ nombre: "", tel: "", email: "", msg: "" });
  const [vizOpen, setVizOpen] = useState(false);
  const [flujoCajaOpen, setFlujoCajaOpen] = useState(false);

  // ← NUEVO: estado del wizard de proyectos
  const [wizardOpen, setWizardOpen] = useState(false);

  const DEFAULT_CONTENT = {
    brandName: "Casa-Estudio", brandNum: "1016", brandSub: "Revestimientos · Santa Bárbara",
    promoText: "⭐ NO COMPRES A CIEGAS · VISUALIZA TU PROYECTO ANTES DE DECIDIR",
    heroTag: "Importadora & Comercializadora", heroTitle1: "Revestimientos", heroTitle2: "de alto estándar", heroTitle3: "para construir tu cabaña",
    heroSubtitle: "Importamos materiales decorativos de calidad premium. Diseñamos y construimos cabañas en Santa Bárbara, Biobío.",
    heroBtnPrimary: "Ver Revestimientos",
heroBtnSecondary: "Cotizar",
heroImage: heroImg,
heroVideo: heroVideo,
    stat1n: "14+", stat1l: "Productos importados", stat2n: "Santa Bárbara", stat2l: "Despacho local", stat3n: "Inauguración", stat3l: "Precios 2026", stat4n: "Cabañas +", stat4l: "Revestimientos",
    aboutTag: "Quiénes somos", aboutTitle1: "Arquitectura", aboutTitle2: "& Diseño",
    aboutBody1: "Casa-Estudio 1016 es una importadora y comercializadora de materiales decorativos de construcción, con foco en revestimientos de alto estándar.",
    aboutBody2: "Ofrecemos servicio en arquitectura y diseño para proyectos residenciales y comerciales, con productos que combinan durabilidad, estética y precio accesible.",
    aboutImg1: about1, aboutImg2: about2, aboutImg3: about3, aboutImg4: about4,
    svcTitle: "Servicios especializados",
    svc1icon: "🏛️", svc1title: "Arquitectura & Diseño", svc1desc: "Asesoría profesional para proyectos residenciales y comerciales.",
    svc2icon: "📦", svc2title: "Importación Directa", svc2desc: "Materiales de alta calidad desde el fabricante, sin intermediarios.",
    svc3icon: "🛠️", svc3title: "Asesoría Técnica", svc3desc: "Te guiamos en la elección correcta según el ambiente y presupuesto.",
    svc4icon: "🚚", svc4title: "Despacho Local", svc4desc: "Despacho en Santa Bárbara y alrededores.",
    ctaTitle1: "¿Cómo quedaría en", ctaTitle2: "tu espacio?", ctaBody: "Sube una foto y aplica cualquier revestimiento del catálogo con IA.", ctaBtn: "✦ Abrir Visualizador IA",
    contactTitle1: "Hablemos de", contactTitle2: "tu proyecto", contactBody: "Estamos en Santa Bárbara. Visítanos para una asesoría personalizada sin costo.",
    contactAddr: "Arturo Prat 1016, Santa Bárbara", contactPhone: "+56 9 7868 2990", contactPay: "VISA · Redcompra · MercadoPago", contactWaBtn: "💬 Abrir WhatsApp", waNumber: "56978682990",
    colorDark: "#4A6741", colorWarm: "#F4806D", colorAccent: "#6B8C52", colorBg: "#F5F4F2",
  };

  const [content, setContent] = useState(() => {
    try { const s = localStorage.getItem("ce1016_content"); return s ? { ...DEFAULT_CONTENT, ...JSON.parse(s) } : DEFAULT_CONTENT; }
    catch { return DEFAULT_CONTENT; }
  });

  const [prods, setProds] = useState(() => {
    try {
      const s = localStorage.getItem("ce1016_prods");
      if (s) {
        const parsed = JSON.parse(s);
        return parsed.map((p) => {
          if (!p.images || p.images.length === 0) {
            const def = DEFAULT_PRODS.find((d) => d.id === p.id);
            return { ...p, images: def?.images || (p.image ? [p.image] : []) };
          }
          return p;
        });
      }
      return DEFAULT_PRODS;
    } catch { return DEFAULT_PRODS; }
  });

  const set = (k, v) => setContent((x) => ({ ...x, [k]: v }));
  const isActive = (f) => editMode && activeField === f;
  const editClick = (f) => { if (editMode) setActiveField(f); };
  const C = { bg: content.colorBg, dark: content.colorDark, warm: content.colorWarm, warmDk: content.colorAccent, border: "#D0CECA", mid: "#6B7B6A", text: "#2A3528" };

  const getQty = (id) => qtyByProduct[id] || 1;
  const changeQty = (id, delta) => setQtyByProduct((cur) => ({ ...cur, [id]: Math.max(1, (cur[id] || 1) + delta) }));
  const addCart = (product, qty = 1) => setCart((cur) => { const ex = cur.find((i) => i.id === product.id); if (ex) return cur.map((i) => i.id === product.id ? { ...i, qty: i.qty + qty } : i); return [...cur, { ...product, qty }]; });
  const rmCart = (id) => setCart((cur) => cur.filter((i) => i.id !== id));
  const incCartQty = (id) => setCart((cur) => cur.map((i) => i.id === id ? { ...i, qty: i.qty + 1 } : i));
  const decCartQty = (id) => setCart((cur) => cur.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i));
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const buildWhatsAppMessage = (product = null) => {
    if (product) { const qty = getQty(product.id); return encodeURIComponent(`Estimados, buenas tardes.\n\nMe gustaría solicitar una cotización por el siguiente producto:\n\n1. ${product.name} | Cantidad: ${qty} | ${product.dims} | ${product.code} | ${$$(product.price * qty)}\n\nAgradecería me pudieran confirmar disponibilidad, plazo de entrega y condiciones de compra.\n\nQuedo atento(a).`); }
    if (cart && cart.length > 0) { const t = cart.map((i, n) => `${n + 1}. ${i.name} | Cantidad: ${i.qty} | ${i.dims} | ${i.code} | ${$$(i.price * i.qty)}`).join("\n"); return encodeURIComponent(`Estimados, buenas tardes.\n\nMe gustaría solicitar una cotización por los siguientes productos:\n\n${t}\n\nTotal estimado de referencia: ${$$(total)}.\n\nAgradecería me pudieran confirmar disponibilidad, plazo de entrega y condiciones de compra.\n\nQuedo atento(a).`); }
    return encodeURIComponent(`Estimados, buenas tardes.\n\nMe gustaría solicitar información y cotización de sus revestimientos.\n\nQuedo atento(a).`);
  };
  const buildServiceWhatsAppMessage = (serviceTitle) => `https://wa.me/${content.waNumber}?text=${encodeURIComponent(`Estimados, buenas tardes.\n\nMe gustaría solicitar información y cotización por su servicio de ${serviceTitle}.\n\nAgradecería me pudieran indicar alcance del servicio, modalidad de trabajo, plazos estimados y valores de referencia.\n\nQuedo atento(a).\n\nSaludos cordiales.`)}`;

  async function handleSubmit() {
    if (!form.nombre || !form.tel) return;
    setSending(true);
    await sendEmail({ nombre: form.nombre, tel: form.tel, email: form.email, mensaje: form.msg });
    window.open(`https://wa.me/${content.waNumber}?text=${encodeURIComponent(`Hola! Soy ${form.nombre}.\nTeléfono: ${form.tel}\nEmail: ${form.email}\nMensaje: ${form.msg}`)}`, "_blank");
    setSending(false); setSent(true); setForm({ nombre: "", tel: "", email: "", msg: "" });
  }

  const filtered = filterCat === "todos" ? prods : prods.filter((p) => p.cat === filterCat);
  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };
  const saveProds = (updated) => { setProds((x) => x.map((p) => p.id === updated.id ? updated : p)); setProductEditor(null); };
  const deleteProds = (id) => { setProds((x) => x.filter((p) => p.id !== id)); setProductEditor(null); };
  const addNewProd = () => { const n = { id: Date.now(), name: "Nuevo Producto", dims: "0×0cm", cat: "muro", code: "COD-NEW", price: 0, unit: "c/u", tk: "marble_gray", desc: "Descripción del producto.", images: [] }; setProds((x) => [...x, n]); setProductEditor(n); };
  const saveAndExit = () => { try { localStorage.setItem("ce1016_content", JSON.stringify(content)); localStorage.setItem("ce1016_prods", JSON.stringify(prods)); } catch (e) { console.warn("localStorage lleno", e); } setEditMode(false); setActiveField(null); setSaved(true); setTimeout(() => setSaved(false), 2800); };

  const E = (field, label, children, multiline = false, extraStyle = {}) => {
    if (!editMode) return children;
    return (
      <Editable editing={editMode} label={label} style={extraStyle} onClick={() => editClick(field)}>
        {isActive(field) ? <EditText value={content[field]} onChange={(v) => set(field, v)} editing multiline={multiline} style={children.props?.style} /> : children}
      </Editable>
    );
  };

  const EditBar = () => (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 400, background: "white", borderTop: "2px solid #F5A623", padding: sm ? "10px 12px" : "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, boxShadow: "0 -4px 24px rgba(0,0,0,0.1)", flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F5A623", animation: "pulse 1.5s ease infinite" }} />
        <span style={{ fontSize: sm ? 11 : 13, fontWeight: 700, color: "#B87A10" }}>✏️ Modo Editor activo</span>
        <span style={{ fontSize: 11, color: "#999", display: sm ? "none" : "block" }}>Haz clic en cualquier texto o imagen para editar</span>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={addNewProd} style={{ padding: "8px 14px", background: "#EEF3E8", color: "#3A6B3A", border: "1px solid #7A8B5A", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ Producto</button>
        <button onClick={() => setEditMode(false)} style={{ padding: "8px 14px", background: "white", color: "#888", border: "1px solid #E0D8D0", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancelar</button>
        <button onClick={saveAndExit} style={{ padding: "8px 18px", background: "#2C2420", color: "white", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>✓ Guardar cambios</button>
      </div>
    </div>
  );

  const ColorPanel = () => editMode && (
    <div style={{ position: "fixed", left: sm ? 0 : 16, top: "50%", transform: "translateY(-50%)", zIndex: 350, background: "white", border: "1px solid #E0D8D0", borderRadius: 12, padding: "14px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", width: sm ? "100%" : "auto", maxWidth: sm ? "100%" : 200 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>🎨 Colores</div>
      {[["colorDark", "Fondo oscuro"], ["colorWarm", "Color principal"], ["colorAccent", "Color acento"], ["colorBg", "Fondo página"]].map(([k, l]) => (
        <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, gap: 8 }}>
          <span style={{ fontSize: 11, color: "#666", flex: 1 }}>{l}</span>
          <input type="color" value={content[k]} onChange={(e) => set(k, e.target.value)} style={{ width: 32, height: 24, border: "1px solid #E0D8D0", borderRadius: 4, cursor: "pointer", padding: 1 }} />
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    document.title = "Casa-Estudio 1016 | Revestimientos Interiores y Exteriores — Región del Biobío";
    const meta = (name, value, prop = false) => { const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`; let el = document.querySelector(sel); if (!el) { el = document.createElement("meta"); prop ? el.setAttribute("property", name) : el.setAttribute("name", name); document.head.appendChild(el); } el.setAttribute("content", value); };
    meta("description", "Casa-Estudio 1016 — Importadora y comercializadora de revestimientos interiores y exteriores de alto estándar.");
    meta("keywords", "revestimientos Santa Bárbara, wall panel madera Chile, PVC mármol precio Chile, importadora revestimientos, siding metálico Chile");
    meta("author", "Casa-Estudio 1016"); meta("robots", "index, follow");
    meta("og:title", "Casa-Estudio 1016 | Revestimientos de Alto Estándar", true);
    meta("og:description", "Importadora de revestimientos interiores y exteriores. Santa Bárbara, Región del Biobío.", true);
    meta("og:url", "https://casaestudio1016.cl", true); meta("og:type", "website", true);
  }, []);

  return (
    <div style={{ fontFamily: "'HWYGothic', sans-serif", background: C.bg, color: C.text, overflowX: "hidden", paddingBottom: editMode ? 70 : 0, width: "100%" }}>
      <style>{`
        @font-face { font-family: 'HWYGothic'; src: url('/src/assets/fonts/HWYGOTH.TTF') format('truetype'); font-weight: 400; font-style: normal; }
        @font-face { font-family: 'HWYGWide'; src: url('/src/assets/fonts/HWYGWDE.TTF') format('truetype'); font-weight: 400; font-style: normal; }
        @font-face { font-family: 'HWYGNarrow'; src: url('/src/assets/fonts/HWYGNRRW.TTF') format('truetype'); font-weight: 400; font-style: normal; }
        @font-face { font-family: 'HWYGCond'; src: url('/src/assets/fonts/HWYGCOND.TTF') format('truetype'); font-weight: 400; font-style: normal; }
        @font-face { font-family: 'HWYGExpd'; src: url('/src/assets/fonts/HWYGEXPD.TTF') format('truetype'); font-weight: 400; font-style: normal; }
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'HWYGothic',sans-serif}
        ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:#8A9E87;border-radius:2px}
        html{scroll-behavior:smooth}
      `}</style>
      <ColorPanel />

      {/* ── NAV ──────────────────────────────────────────────────────────────── */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 500, background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ background: C.dark, color: "#F5D5CF", textAlign: "center", padding: "7px 16px", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>
          {E("promoText", "Promo", <span>{content.promoText}</span>)}
        </div>
        <nav style={{ background: "white", borderBottom: "1px solid #E8E0D4", padding: `0 ${sm ? 14 : 28}px`, display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, background: C.dark, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'HWYGWide',sans-serif", fontWeight: 700, color: "white", fontSize: 11 }}>{E("brandNum", "Número", <span>{content.brandNum}</span>)}</div>
            <div>
              <div style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: sm ? 14 : 16, fontWeight: 700, color: C.text, lineHeight: 1.1 }}>{E("brandName", "Marca", <span>{content.brandName}</span>)} <span style={{ color: C.warm }}>{E("brandNum", "Número", <span>{content.brandNum}</span>)}</span></div>
              {!sm && <div style={{ fontSize: 9, color: C.mid, letterSpacing: 1.5, textTransform: "uppercase" }}>{E("brandSub", "Subtítulo", <span>{content.brandSub}</span>)}</div>}
            </div>
          </div>
          {!md && (
            <div style={{ display: "flex", gap: 28 }}>
              {["inicio", "catalogo", "servicios", "diseña-tu-proyecto", "contacto"].map((id) => (
                <button key={id} onClick={() => scrollTo(id)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 500, color: C.mid, textTransform: "capitalize", letterSpacing: 0.5 }}>
                  {id === "diseña-tu-proyecto" ? "Diseña tu proyecto" : id.charAt(0).toUpperCase() + id.slice(1)}
                </button>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {isAdmin && (
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <button onClick={() => setFlujoCajaOpen(true)} style={{ padding: "7px 12px", background: "#F0F7F0", color: "#3A6B3A", border: "1px solid #7A8B5A", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>📊 Caja</button>
                <button onClick={() => { setEditMode(!editMode); setActiveField(null); }} style={{ padding: "7px 12px", background: editMode ? "#FEF3C7" : "#F5F0EA", color: editMode ? "#B87A10" : "#7A6858", border: `1px solid ${editMode ? "#F5A623" : "#E0D8D0"}`, borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{editMode ? "✏️ Editando" : "✏️ Editar"}</button>
                <button onClick={logout} title="Cerrar sesión admin" style={{ padding: "7px 10px", background: "none", border: "1px solid #E0D8D0", borderRadius: 6, fontSize: 13, cursor: "pointer", color: "#AAA" }}>🔓</button>
              </div>
            )}
            {/* ← NUEVO: botón "Diseña tu proyecto" en nav desktop */}
            {!sm && (
              <button onClick={() => setWizardOpen(true)} style={{ background: C.warm, color: "white", border: "none", borderRadius: 6, padding: "8px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.5, textTransform: "uppercase" }}>
                + Diseña tu proyecto
              </button>
            )}
            {!sm && <button onClick={() => setVizOpen(true)} style={{ background: C.dark, color: "white", border: "none", borderRadius: 6, padding: "8px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.5, textTransform: "uppercase" }}>✦ Visualizador</button>}
            <button onClick={() => setCartOpen(true)} style={{ position: "relative", background: "none", border: "1px solid #E8E0D4", borderRadius: 6, padding: "7px 12px", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, color: C.text }}>
              🛒{cartCount > 0 && <span style={{ position: "absolute", top: -6, right: -6, minWidth: 18, height: 18, background: C.warm, borderRadius: "50%", fontSize: 10, color: "white", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>{cartCount}</span>}
            </button>
            {md && <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "1px solid #E8E0D4", borderRadius: 6, padding: "7px 11px", cursor: "pointer", fontSize: 16, color: C.text }}>{menuOpen ? "×" : "☰"}</button>}
          </div>
        </nav>
        {md && menuOpen && (
          <div style={{ background: "white", borderBottom: "1px solid #E8E0D4", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
            {["inicio", "catalogo", "servicios", "contacto"].map((id) => (
              <button key={id} onClick={() => scrollTo(id)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 500, color: C.mid, padding: "8px 0", textAlign: "left", textTransform: "capitalize" }}>{id.charAt(0).toUpperCase() + id.slice(1)}</button>
            ))}
            {/* ← NUEVO: botón en menú móvil */}
            <button onClick={() => { setWizardOpen(true); setMenuOpen(false); }} style={{ background: C.warm, color: "white", border: "none", borderRadius: 6, padding: "10px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginTop: 4 }}>+ Diseña tu proyecto</button>
            <button onClick={() => { setVizOpen(true); setMenuOpen(false); }} style={{ background: C.dark, color: "white", border: "none", borderRadius: 6, padding: "10px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginTop: 4 }}>✦ Visualizador IA</button>
          </div>
        )}
      </div>
      <div style={{ height: 94 }} />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section id="inicio" style={{
        minHeight: sm ? "calc(100svh - 94px)" : "clamp(620px, 85vh, 900px)",
        background: "#1A1A1A",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
      }}>
        {/* Video / Imagen de fondo */}
        <div style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          zIndex: 0,
        }}>
          {content.heroVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={content.heroImage}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: sm ? "center center" : "center center",
                opacity: 0.55,
              }}
            >
              <source src={content.heroVideo} type="video/mp4" />
            </video>
          ) : (
            content.heroImage && (
              <img
                src={content.heroImage}
                alt=""
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center center",
                  opacity: 0.55,
                }}
              />
            )
          )}

          {/* Degradado: oscuro izquierda → transparente derecha */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: sm
              ? "linear-gradient(to bottom, rgba(20,20,20,0.35) 0%, rgba(20,20,20,0.78) 48%, rgba(15,15,15,0.94) 100%)"
              : "linear-gradient(105deg, rgba(15,15,15,0.92) 0%, rgba(20,20,20,0.80) 38%, rgba(20,20,20,0.30) 65%, rgba(20,20,20,0.05) 100%)",
          }} />

          {/* Glow sutil coral en esquina */}
          <div style={{
            position: "absolute",
            bottom: "-10%",
            left: "-5%",
            width: sm ? 320 : 480,
            height: sm ? 320 : 480,
            borderRadius: "50%",
            background: "rgba(244,128,109,0.08)",
            filter: "blur(80px)",
            pointerEvents: "none",
          }} />
        </div>

        {/* Botón editar imagen (solo modo admin) */}
        {editMode && (
          <label style={{
            position: "absolute", top: 16, right: 16, zIndex: 10,
            background: "#F5A623", color: "white", padding: "8px 16px",
            borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
          }}>
            📷 {content.heroImage ? "Cambiar fondo" : "Agregar imagen"}
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
              const f = e.target.files[0]; if (!f) return;
              const r = new FileReader(); r.onload = (ev) => set("heroImage", ev.target.result); r.readAsDataURL(f);
            }} />
          </label>
        )}
        {editMode && content.heroImage && (
          <button onClick={() => set("heroImage", null)} style={{
            position: "absolute", top: 16, right: sm ? 16 : 220, zIndex: 10,
            background: "#FEE2E2", color: "#C45A5A", border: "none",
            padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
          }}>🗑 Quitar imagen</button>
        )}
 
        {/* ── CONTENIDO PRINCIPAL ── */}
        <div style={{
          position: "relative", zIndex: 2,
          maxWidth: 1400, width: "100%", margin: "0 auto",
          padding: sm ? "80px 20px 60px" : "0 64px",
          display: "flex", flexDirection: "column",
          alignItems: sm ? "center" : "flex-start",
          textAlign: sm ? "center" : "left",
          animation: "fadeUp .9s ease both",
        }}>
 
          {/* Eyebrow tag */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "rgba(244,128,109,0.12)",
            border: "1px solid rgba(244,128,109,0.35)",
            borderRadius: 30, padding: "6px 18px", marginBottom: sm ? 20 : 28,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#F4806D", flexShrink: 0 }} />
            <span style={{
              fontSize: 10, color: "#F4806D",
              letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 700,
              fontFamily: "'HWYGothic', sans-serif",
            }}>
              {E("heroTag", "Etiqueta hero", <span>Arquitectura · Cabañas · Revestimientos</span>)}
            </span>
          </div>
 
          {/* Título principal */}
          <h1 style={{
            fontFamily: "'HWYGWide', sans-serif",
            fontSize: sm ? "clamp(28px,8.5vw,42px)" : "clamp(38px,4.5vw,68px)",
            fontWeight: 400, color: "white", lineHeight: 1.08,
            marginBottom: sm ? 18 : 24,
            maxWidth: sm ? "100%" : 680,
            letterSpacing: "-0.5px",
          }}>
            {E("heroTitle1", "Título línea 1", <span>Revestimientos premium</span>)}{" "}
            <em style={{ color: "#F4806D", fontStyle: "italic" }}>
              {E("heroTitle2", "Título línea 2", <span>transformar tu espacio</span>)}
            </em>
            <br />
            {E("heroTitle3", "Título línea 3", <span>Diseño a medida</span>)}
          </h1>
 
          {/* Subtítulo */}
          <p style={{
            fontSize: sm ? 13 : 16,
            color: "rgba(255,255,255,0.52)",
            maxWidth: sm ? "100%" : 520,
            lineHeight: 1.85,
            marginBottom: sm ? 32 : 44,
            fontWeight: 300,
            fontFamily: "'HWYGothic', sans-serif",
          }}>
            {E("heroSubtitle", "Subtítulo hero",
              <span>Creamos proyectos de cabañas, interiores y revestimientos decorativos para que puedas visualizar, cotizar y transformar tu espacio con mayor seguridad.</span>,
              true
            )}
          </p>
 
          {/* Botones CTA */}
          <div style={{
            display: "flex",
            gap: sm ? 10 : 14,
            flexDirection: sm ? "column" : "row",
            width: sm ? "100%" : "auto",
            alignItems: sm ? "stretch" : "center",
          }}>
            {/* Botón principal coral */}
            <button
              onClick={() => setWizardOpen(true)}
              style={{
                background: "#F4806D",
                color: "white", border: "none",
                borderRadius: 10,
                padding: sm ? "15px 24px" : "17px 36px",
                fontSize: sm ? 14 : 15, fontWeight: 700,
                cursor: "pointer", fontFamily: "'HWYGothic', sans-serif",
                display: "inline-flex", alignItems: "center",
                justifyContent: "center", gap: 10,
                boxShadow: "0 8px 32px rgba(244,128,109,0.35)",
                transition: "all 0.2s", whiteSpace: "nowrap",
              }}
              onMouseOver={e => { e.currentTarget.style.background = "#e8604a"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(244,128,109,0.45)"; }}
              onMouseOut={e  => { e.currentTarget.style.background = "#F4806D"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(244,128,109,0.35)"; }}
            >
              <span style={{ fontSize: 16 }}>+</span>
              {E("heroBtnPrimary", "Botón primario", <span>Quiero diseñar mi proyecto</span>)}
            </button>
 
            {/* Botón secundario blanco */}
            <button
              onClick={() => scrollTo("catalogo")}
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "white",
                border: "1.5px solid rgba(255,255,255,0.25)",
                borderRadius: 10,
                padding: sm ? "15px 24px" : "17px 36px",
                fontSize: sm ? 14 : 15, fontWeight: 500,
                cursor: "pointer", fontFamily: "'HWYGothic', sans-serif",
                display: "inline-flex", alignItems: "center",
                justifyContent: "center", gap: 8,
                transition: "all 0.2s", whiteSpace: "nowrap",
                backdropFilter: "blur(4px)",
              }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; }}
              onMouseOut={e  => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
            >
              {E("heroBtnSecondary", "Botón secundario", <span>Ver revestimientos</span>)}
            </button>
          </div>
 
          {/* Badge de confianza */}
          {!sm && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              marginTop: 28,
            }}>
              <div style={{ display: "flex", gap: -4 }}>
                {["🏕️","🧱","✦"].map((e, i) => (
                  <div key={i} style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                    border: "1.5px solid rgba(255,255,255,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, marginLeft: i > 0 ? -8 : 0,
                  }}>{e}</div>
                ))}
              </div>
              <span style={{
                fontSize: 11, color: "rgba(255,255,255,0.35)",
                fontFamily: "'HWYGothic', sans-serif",
              }}>
                Sin compromiso · Respuesta en 24–48 hrs
              </span>
            </div>
          )}
        </div>
 
        {/* ── STATS INFERIORES ── */}
        {!sm && (
          <div style={{
            position: "relative", zIndex: 2,
            maxWidth: 1400, width: "100%", margin: "0 auto",
            padding: "0 64px", paddingBottom: 52,
            marginTop: 48,
          }}>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(4,1fr)",
              borderTop: "1px solid rgba(255,255,255,0.18)",
paddingTop: 24,
paddingBottom: 24,
paddingLeft: 28,
paddingRight: 28,
background: "rgba(0,0,0,0.35)",
backdropFilter: "blur(8px)",
borderRadius: 12,
            }}>
              {[
  { n: "Diseño", l: "Personalizado" },
  { n: "Santa Bárbara", l: "Biobío" },
  { n: "Visualización", l: "3D incluida" },
  { n: "Cabañas +", l: "Interiores" },
].map((s, i) => (
  <div key={i} style={{
    paddingRight: 24, paddingLeft: i > 0 ? 24 : 0,
    borderRight: i < 3 ? "1px solid rgba(255,255,255,0.18)" : "none",
  }}>
    <div style={{
      fontFamily: "'HWYGWide', sans-serif",
      fontSize: 20, fontWeight: 700, color: "white", marginBottom: 5,
      textShadow: "0 1px 8px rgba(0,0,0,0.6)",
    }}>{s.n}</div>
    <div style={{
      fontSize: 12, color: "rgba(255,255,255,0.72)",
      fontFamily: "'HWYGothic', sans-serif",
      textShadow: "0 1px 6px rgba(0,0,0,0.5)",
    }}>{s.l}</div>
  </div>
))}
            </div>
          </div>
        )}
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────────────────── */}
      <section style={{ background: "white", padding: `${sm ? 52 : 72}px ${sm ? 20 : 32}px` }}>
        <div style={{ maxWidth: 1400, width: "100%", margin: "0 auto", display: "grid", gridTemplateColumns: md ? "1fr" : "1fr 1fr", gap: md ? 40 : 64, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "clamp(11px,0.8vw,15px)", color: C.warm, letterSpacing: 3, textTransform: "uppercase", fontWeight: 600, marginBottom: 18 }}>{E("aboutTag", "Etiqueta sección", <span>{content.aboutTag}</span>)}</div>
            <h2 style={{ fontFamily: "'HWYGothic',sans-serif", fontSize: "clamp(36px,4vw,64px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24, color: C.text }}>
              {E("aboutTitle1", "Título 1", <span>{content.aboutTitle1}</span>)}<br /><em style={{ fontStyle: "italic", color: C.warm }}>{E("aboutTitle2", "Título 2", <span>{content.aboutTitle2}</span>)}</em>
            </h2>
            <p style={{ fontSize: "clamp(16px,1.2vw,22px)", color: C.mid, lineHeight: 1.9, marginBottom: 18, fontWeight: 300 }}>{E("aboutBody1", "Párrafo 1", <span>{content.aboutBody1}</span>, true)}</p>
            <p style={{ fontSize: "clamp(16px,1.2vw,22px)", color: C.mid, lineHeight: 1.9, fontWeight: 300 }}>{E("aboutBody2", "Párrafo 2", <span>{content.aboutBody2}</span>, true)}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
  { key: "aboutImg1", label: "Cabañas", icon: "🏕️", action: () => setWizardOpen(true) },
  { key: "aboutImg2", label: "Muros interiores", icon: "🧱", action: () => { setFilterCat("muro"); document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" }); }},
  { key: "aboutImg3", label: "Revestimientos baño", icon: "🚿", action: () => { setFilterCat("muro"); document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" }); }},
  { key: "aboutImg4", label: "Fachadas exterior", icon: "🏠", action: () => { setFilterCat("exterior"); document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" }); }},
].map(({ key, label, icon, action }, i) => (
  <div
    key={i}
    onClick={!editMode ? action : undefined}
    style={{
      borderRadius: 10, overflow: "hidden", aspectRatio: "1",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      cursor: editMode ? "default" : "pointer",
      position: "relative",
    }}
    onMouseEnter={e => { if (!editMode) e.currentTarget.querySelector(".about-overlay").style.opacity = "1"; }}
    onMouseLeave={e => { if (!editMode) e.currentTarget.querySelector(".about-overlay").style.opacity = "0"; }}
  >
    {editMode ? (
      <ImgUpload onImage={(v) => set(key, v)} style={{ width: "100%", height: "100%", borderRadius: 10 }}>
        {content[key] ? <img src={content[key]} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : <div style={{ width: "100%", height: "100%", background: "#F0EBE4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, minHeight: 100 }}>📷</div>}
      </ImgUpload>
    ) : content[key] ? (
      <img src={content[key]} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }} />
    ) : (
      <Thumb tk={["marble_gray", "wood_roble", "marble_black", "ceiling_pino"][i]} w={200} h={200} />
    )}
    {/* Overlay con label */}
    {!editMode && (
      <div className="about-overlay" style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(20,20,20,0.75) 0%, rgba(20,20,20,0.1) 60%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "flex-end",
        padding: "16px 12px",
        opacity: 0, transition: "opacity 0.3s ease",
      }}>
        <span style={{ fontSize: 22, marginBottom: 6 }}>{icon}</span>
        <span style={{
          fontSize: 12, fontWeight: 700, color: "white",
          textAlign: "center", fontFamily: "'HWYGWide', sans-serif",
          textTransform: "uppercase", letterSpacing: 1,
        }}>{label}</span>
        <span style={{
          fontSize: 10, color: "rgba(255,255,255,0.7)",
          marginTop: 4, fontFamily: "'HWYGothic', sans-serif",
        }}>Ver más →</span>
      </div>
    )}
  </div>
))}
          </div>
        </div>
      </section>

      {/* ── CATÁLOGO ─────────────────────────────────────────────────────────── */}
      <section id="catalogo" style={{ padding: `${sm ? 52 : 80}px ${sm ? 16 : 32}px`, background: C.bg }}>
        <div style={{ maxWidth: 1400, width: "100%", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: sm ? "flex-start" : "flex-end", justifyContent: "space-between", marginBottom: sm ? 24 : 36, flexWrap: "wrap", gap: 16, flexDirection: sm ? "column" : "row" }}>
            <div>
              <div style={{ fontSize: 10, color: C.warm, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, marginBottom: 10 }}>Catálogo completo</div>
              <h2 style={{ fontFamily: "'HWYGothic',sans-serif", fontSize: sm ? "clamp(26px,7vw,36px)" : "clamp(28px,3vw,42px)", fontWeight: 800, lineHeight: 1.2, color: C.text }}>Nuestros <em style={{ fontStyle: "italic", color: C.warm }}>Revestimientos</em></h2>
            </div>
            <button onClick={() => setVizOpen(true)} style={{ display: "flex", alignItems: "center", gap: 7, background: C.dark, color: "white", border: "none", borderRadius: 8, padding: sm ? "11px 16px" : "12px 20px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.5, textTransform: "uppercase", alignSelf: sm ? "flex-start" : "auto" }}>✦ Visualizador IA</button>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 28, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
            {CATS.map((c) => <button key={c} onClick={() => setFilterCat(c)} style={{ flexShrink: 0, padding: "8px 18px", border: `1.5px solid ${filterCat === c ? C.warm : "#E8E0D4"}`, borderRadius: 30, fontSize: 12, fontWeight: 600, cursor: "pointer", background: filterCat === c ? C.warm : "white", color: filterCat === c ? "white" : C.mid, fontFamily: "inherit", transition: "all .15s" }}>{CAT_L[c]}</button>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: sm ? "1fr" : "1fr 1fr", gap: sm ? 14 : 24 }}>
            {filtered.map((p) => {
              const productQty = getQty(p.id);
              const carouselImgs = (p.images && p.images.length > 0) ? p.images : (p.image ? [p.image] : []);
              return (
                <div key={p.id}
                  style={{ background: "white", borderRadius: 22, overflow: "hidden", cursor: "pointer", border: `1.5px solid ${expanded === p.id ? C.warm : "#E8E0D4"}`, boxShadow: expanded === p.id ? "0 10px 30px rgba(139,107,74,0.12)" : "0 4px 18px rgba(0,0,0,0.06)", transition: "all .2s", position: "relative" }}
                  onMouseEnter={(e) => { if (expanded !== p.id) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.09)"; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = expanded === p.id ? "0 10px 30px rgba(139,107,74,0.12)" : "0 4px 18px rgba(0,0,0,0.06)"; }}>
                  {editMode && <button onClick={(e) => { e.stopPropagation(); setProductEditor(p); }} style={{ position: "absolute", top: 10, right: 10, zIndex: 10, background: "#F5A623", color: "white", border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>✏️ Editar</button>}
                  <div style={{ display: "grid", gridTemplateColumns: sm ? "1fr" : "46% 54%", minHeight: sm ? "auto" : 320 }} onClick={() => !editMode && setExpanded(expanded === p.id ? null : p.id)}>
                    <div style={{ background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", minHeight: sm ? 220 : 320, borderBottom: sm ? "1px solid #F0EAE2" : "none", borderRight: sm ? "none" : "1px solid #F0EAE2", position: "relative", overflow: "hidden" }}>
                      {carouselImgs.length > 0 ? (<div style={{ width: "100%", height: sm ? 220 : 320, position: "relative" }}><ProductCarousel images={carouselImgs} productName={p.name} /></div>) : (<div style={{ width: "100%", height: sm ? 220 : 260 }}><Thumb tk={p.tk} customImg={p.customImg || null} w={420} h={260} /></div>)}
                    </div>
                    <div style={{ padding: sm ? "18px 18px 20px" : "26px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <div style={{ fontSize: 11, color: C.warm, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>{CAT_L[p.cat] || p.cat}</div>
                      <div style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: sm ? 18 : 22, lineHeight: 1.15, fontWeight: 700, color: C.text, marginBottom: 10 }}>{p.name}</div>
                      <div style={{ fontSize: sm ? 14 : 16, color: "#5A4A3C", fontWeight: 600, marginBottom: 6 }}>{p.dims}</div>
                      <div style={{ fontSize: 14, color: "#9A8A7A", fontWeight: 600, marginBottom: 12 }}>COD: {p.code}</div>
                      <div style={{ fontSize: sm ? 13 : 14, color: C.mid, lineHeight: 1.6, marginBottom: 16 }}>{p.desc}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13, color: C.mid, fontWeight: 600 }}>Cantidad:</span>
                        <div style={{ display: "flex", alignItems: "center", border: "1px solid #E0D8D0", borderRadius: 999, overflow: "hidden", background: "white" }}>
                          <button onClick={(e) => { e.stopPropagation(); changeQty(p.id, -1); }} style={{ width: 38, height: 38, border: "none", background: "white", cursor: "pointer", fontSize: 20, fontFamily: "inherit" }}>−</button>
                          <div style={{ minWidth: 42, textAlign: "center", fontSize: 15, fontWeight: 700 }}>{productQty}</div>
                          <button onClick={(e) => { e.stopPropagation(); changeQty(p.id, 1); }} style={{ width: 38, height: 38, border: "none", background: "white", cursor: "pointer", fontSize: 20, fontFamily: "inherit" }}>+</button>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                        <div style={{ background: "#2F6E6C", color: "white", padding: sm ? "10px 14px" : "12px 16px", borderRadius: 10, fontSize: sm ? 15 : 17, fontWeight: 800, lineHeight: 1 }}>{$$(p.price)} <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.9 }}>{p.unit}</span></div>
                        <button onClick={(e) => { e.stopPropagation(); addCart(p, productQty); }} style={{ background: C.dark, color: "white", border: "none", borderRadius: 10, padding: sm ? "11px 16px" : "12px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ Carro</button>
                      </div>
                    </div>
                  </div>
                  {expanded === p.id && !editMode && (
                    <div style={{ borderTop: "1px solid #E8E0D4", padding: "16px 20px", background: "#FDF8F3" }}>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <a href={`https://wa.me/${content.waNumber}?text=${buildWhatsAppMessage(p)}`} target="_blank" rel="noreferrer" style={{ flex: 1, minWidth: 160, display: "block", textAlign: "center", background: "#25D366", color: "white", padding: "11px 8px", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>💬 WhatsApp</a>
                        <button onClick={() => navigate(`/producto/${slugify(p.name)}`)} style={{ flex: 1, minWidth: 160, background: C.dark, color: "white", border: "none", borderRadius: 10, padding: "11px 8px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>👁 Ver ficha</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SERVICIOS ────────────────────────────────────────────────────────── */}
      <section id="servicios" style={{ background: "white", padding: `${sm ? 52 : 80}px ${sm ? 16 : 32}px` }}>
        <div style={{ maxWidth: 1400, width: "100%", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: sm ? 36 : 52 }}>
            <div style={{ fontSize: 10, color: C.warm, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Lo que ofrecemos</div>
            <h2 style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: sm ? "clamp(26px,7vw,36px)" : "clamp(28px,3vw,40px)", fontWeight: 400, color: C.text }}>{E("svcTitle", "Título servicios", <span>{content.svcTitle.split(" ")[0]} <em style={{ fontStyle: "italic" }}>{content.svcTitle.split(" ").slice(1).join(" ")}</em></span>)}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${sm ? 1 : md ? 2 : 3},1fr)`, gap: sm ? 12 : 20 }}>
            {[1, 2, 3].map((i) => {
              const icon = content[`svc${i}icon`]; const title = content[`svc${i}title`]; const desc = content[`svc${i}desc`];
              return (
                <a key={i} href={buildServiceWhatsAppMessage(title)} target="_blank" rel="noreferrer" style={{ padding: sm ? "20px" : "24px 22px", border: "1px solid #E8E0D4", borderRadius: 12, background: C.bg, transition: "all .2s", textDecoration: "none", display: "block", color: "inherit" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.warm; e.currentTarget.style.background = "white"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(139,107,74,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8E0D4"; e.currentTarget.style.background = C.bg; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <div style={{ fontSize: 30, marginBottom: 12 }}>{E(`svc${i}icon`, `Ícono ${i}`, <span>{icon}</span>)}</div>
                  <h3 style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 8, color: C.text }}>{E(`svc${i}title`, `Título ${i}`, <span>{title}</span>)}</h3>
                  <p style={{ fontSize: 13, color: C.mid, lineHeight: 1.75, fontWeight: 300, marginBottom: 12 }}>{E(`svc${i}desc`, `Descripción ${i}`, <span>{desc}</span>, true)}</p>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.warmDk, textTransform: "uppercase", letterSpacing: 0.5 }}>Solicitar por WhatsApp →</div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/*  ← NUEVA SECCIÓN: "Diseña tu proyecto en 5 pasos"                    */}
      {/*  Se inserta entre SERVICES y CTA, usando el mismo fondo oscuro C.dark */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <SeccionDiseñaProyecto C={C} sm={sm} onAbrir={() => setWizardOpen(true)} />

      {/* ── CTA VISUALIZADOR ─────────────────────────────────────────────────── */}
      <section style={{ background: C.dark, padding: `${sm ? 52 : 72}px ${sm ? 20 : 32}px`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(6,1fr)", opacity: 0.07 }}>
          {Object.keys(TX).slice(0, 6).map((k, i) => <div key={i} style={{ backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(TX[k])}")`, backgroundSize: "cover" }} />)}
        </div>
        <div style={{ position: "relative", maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#C4B49A", letterSpacing: 2, textTransform: "uppercase", fontWeight: 500, marginBottom: 16 }}>Herramienta exclusiva</div>
          <h2 style={{ fontFamily: "'HWYGothic',sans-serif", fontSize: sm ? "clamp(24px,7vw,34px)" : "clamp(26px,3vw,40px)", fontWeight: 800, color: "white", lineHeight: 1.25, marginBottom: 14 }}>
            {E("ctaTitle1", "Título CTA 1", <span>{content.ctaTitle1}</span>)}<br /><em style={{ color: "#F4806D", fontStyle: "italic" }}>{E("ctaTitle2", "Título CTA 2", <span>{content.ctaTitle2}</span>)}</em>
          </h2>
          <p style={{ fontSize: sm ? 13 : 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, marginBottom: 28, fontWeight: 300, maxWidth: 400, margin: "0 auto 28px" }}>{E("ctaBody", "Texto CTA", <span>{content.ctaBody}</span>, true)}</p>
          <button onClick={() => setVizOpen(true)} style={{ background: "white", color: C.text, border: "none", borderRadius: 8, padding: sm ? "13px 24px" : "15px 32px", fontSize: sm ? 13 : 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{E("ctaBtn", "Botón CTA", <span>{content.ctaBtn}</span>)}</button>
        </div>
      </section>

      {/* ── CONTACTO ─────────────────────────────────────────────────────────── */}
      <section id="contacto" style={{ background: C.bg, padding: `${sm ? 52 : 80}px ${sm ? 16 : 32}px` }}>
        <div style={{ maxWidth: 1400, width: "100%", margin: "0 auto", display: "grid", gridTemplateColumns: md ? "1fr" : "1fr 1fr", gap: md ? 40 : 64, alignItems: "start" }}>
          <div>
            <div style={{ fontSize: 10, color: C.warm, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, marginBottom: 14 }}>Contáctanos</div>
            <h2 style={{ fontFamily: "'HWYGothic',sans-serif", fontSize: sm ? "clamp(26px,7vw,36px)" : "clamp(28px,3vw,40px)", fontWeight: 800, lineHeight: 1.2, marginBottom: 20, color: C.text }}>
              {E("contactTitle1", "Título contacto 1", <span>{content.contactTitle1}</span>)}<br /><em style={{ fontStyle: "italic", color: C.warm }}>{E("contactTitle2", "Título contacto 2", <span>{content.contactTitle2}</span>)}</em>
            </h2>
            <p style={{ fontSize: 14, color: C.mid, lineHeight: 1.85, marginBottom: 28, fontWeight: 300 }}>{E("contactBody", "Texto contacto", <span>{content.contactBody}</span>, true)}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
              {[["📍", "Dirección", "contactAddr"], ["📱", "WhatsApp", "contactPhone"], ["💳", "Medios de pago", "contactPay"]].map(([icon, label, key]) => (
                <div key={key} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 38, height: 38, background: "white", borderRadius: 8, border: "1px solid #E8E0D4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{icon}</div>
                  <div>
                    <div style={{ fontSize: 10, color: C.mid, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{E(key, label, <span>{content[key]}</span>)}</div>
                  </div>
                </div>
              ))}
            </div>
            <a href={`https://wa.me/${content.waNumber}?text=${buildWhatsAppMessage()}`} target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", background: "#25D366", color: "white", padding: "14px", borderRadius: 8, fontSize: 14, fontWeight: 700, marginBottom: 10, textDecoration: "none" }}>💬 Cotizar por WhatsApp</a>
          </div>
          <div style={{ background: "white", borderRadius: 14, padding: sm ? "20px" : "28px", border: "1px solid #E8E0D4", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 14 }}>✅</div>
                <h3 style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: 20, marginBottom: 8 }}>¡Mensaje enviado!</h3>
                <p style={{ fontSize: 14, color: C.mid }}>Te contactaremos a la brevedad.</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: 18, fontWeight: 600, marginBottom: 18, color: C.text }}>Solicitar cotización</h3>
                {[["nombre", "Nombre completo", "text"], ["tel", "Teléfono", "tel"], ["email", "Correo electrónico", "email"]].map(([f, l, t]) => (
                  <div key={f} style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: C.mid, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 5 }}>{l}</label>
                    <input type={t} value={form[f] || ""} onChange={(e) => setForm((x) => ({ ...x, [f]: e.target.value }))} style={{ width: "100%", padding: "11px 13px", border: "1px solid #E8E0D4", borderRadius: 8, fontSize: 14, fontFamily: "inherit", color: C.text, background: C.bg, outline: "none" }}
                      onFocus={(e) => { e.target.style.borderColor = C.warm; }} onBlur={(e) => { e.target.style.borderColor = "#E8E0D4"; }} />
                  </div>
                ))}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: C.mid, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 5 }}>Mensaje</label>
                  <textarea rows={3} value={form.msg} onChange={(e) => setForm((x) => ({ ...x, msg: e.target.value }))} style={{ width: "100%", padding: "11px 13px", border: "1px solid #E8E0D4", borderRadius: 8, fontSize: 14, fontFamily: "inherit", color: C.text, background: C.bg, resize: "none", outline: "none" }}
                    onFocus={(e) => { e.target.style.borderColor = C.warm; }} onBlur={(e) => { e.target.style.borderColor = "#E8E0D4"; }} />
                </div>
                <button onClick={handleSubmit} disabled={sending} style={{ width: "100%", padding: "14px", background: sending ? "#A09488" : C.dark, color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: sending ? "not-allowed" : "pointer", fontFamily: "inherit" }}>{sending ? "⏳ Enviando..." : "Enviar solicitud →"}</button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer style={{ background: C.dark, padding: `${sm ? 20 : 28}px ${sm ? 16 : 32}px`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: 15, color: "white", fontWeight: 600, marginBottom: 3 }}>{E("brandName", "Nombre marca", <span>{content.brandName}</span>)} <span style={{ color: "#C4B49A" }}>{E("brandNum", "Número", <span>{content.brandNum}</span>)}</span></div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", letterSpacing: 0.5 }}>{E("contactAddr", "Dirección", <span>{content.contactAddr}</span>)} · {E("contactPhone", "Teléfono", <span>{content.contactPhone}</span>)}</div>
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.22)" }}>© 2025 {content.brandName} {content.brandNum}</div>
      </footer>

      {/* ── CART DRAWER ──────────────────────────────────────────────────────── */}
      {cartOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)" }} onClick={() => setCartOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: sm ? "100%" : "min(360px,100vw)", background: "white", boxShadow: "-8px 0 40px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid #E8E0D4", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: 17, fontWeight: 600 }}>Mi Carro ({cartCount})</div>
              <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: C.mid }}>×</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: C.mid }}><div style={{ fontSize: 40, marginBottom: 12 }}>🛒</div><p>Tu carro está vacío</p></div>
              ) : cart.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 0", borderBottom: "1px solid #E8E0D4" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 7, overflow: "hidden", flexShrink: 0 }}>
                    {item.image ? <img src={item.image} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : <Thumb tk={item.tk} customImg={item.customImg || null} w={48} h={48} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: C.mid }}>{item.code}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                      <button onClick={() => decCartQty(item.id)} style={{ width: 26, height: 26, border: "1px solid #E8E0D4", background: "white", borderRadius: 6, cursor: "pointer" }}>−</button>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{item.qty}</span>
                      <button onClick={() => incCartQty(item.id)} style={{ width: 26, height: 26, border: "1px solid #E8E0D4", background: "white", borderRadius: 6, cursor: "pointer" }}>+</button>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: C.warmDk, marginTop: 6 }}>{$$(item.price * item.qty)}</div>
                  </div>
                  <button onClick={() => rmCart(item.id)} style={{ background: "none", border: "none", color: "#C45A5A", cursor: "pointer", fontSize: 18 }}>×</button>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div style={{ padding: 16, borderTop: "1px solid #E8E0D4", flexShrink: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Total estimado</span>
                  <span style={{ fontWeight: 800, fontSize: 16, color: C.warmDk }}>{$$(total)}</span>
                </div>
                <button onClick={() => { setCartOpen(false); setQuoteOpen(true); }} style={{ display: "block", width: "100%", textAlign: "center", background: content.colorDark || "#1E1A16", color: "white", padding: "14px", borderRadius: 8, fontSize: 14, fontWeight: 700, marginBottom: 8, cursor: "pointer", border: "none", fontFamily: "inherit" }}>📄 Ver Cotización formal</button>
                <a href={`https://wa.me/${content.waNumber}?text=${buildWhatsAppMessage()}`} target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", background: "#25D366", color: "white", padding: "12px", borderRadius: 8, fontSize: 13, fontWeight: 700, marginBottom: 10, textDecoration: "none" }}>💬 Cotizar por WhatsApp</a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODALES ──────────────────────────────────────────────────────────── */}
      {vizOpen      && <VisualizerModal prods={prods} onClose={() => setVizOpen(false)} C={C} $$={$$} waNumber={content.waNumber} />}
      {quoteOpen    && <QuotationModal cart={cart} total={total} content={content} $$={$$} onClose={() => setQuoteOpen(false)} />}
      {productEditor && <ProductEditor product={productEditor} onSave={saveProds} onDelete={deleteProds} onClose={() => setProductEditor(null)} />}
      {flujoCajaOpen && <FlujoCaja onClose={() => setFlujoCajaOpen(false)} />}

      {wizardOpen && (
        <WizardSimple
          onClose={() => setWizardOpen(false)}
          C={C}
          waNumber={content.waNumber}
          sm={sm}
        />
      )}

      {editMode && <EditBar />}

      {/* Login admin */}
      {loginOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,12,10,0.85)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(6px)" }} onClick={() => { setLoginOpen(false); setPassInput(""); setPassError(false); }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 14, width: "100%", maxWidth: 360, padding: 32, boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🔐</div>
              <h3 style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: 20, fontWeight: 600, color: "#2C2420", marginBottom: 4 }}>Acceso Administrador</h3>
              <p style={{ fontSize: 13, color: "#8A7868" }}>Casa-Estudio 1016</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#8A7868", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Contraseña</label>
              <input type="password" value={passInput} onChange={(e) => { setPassInput(e.target.value); setPassError(false); }} onKeyDown={(e) => e.key === "Enter" && tryLogin()} autoFocus placeholder="Ingresa tu contraseña"
                style={{ width: "100%", padding: "12px 14px", border: `2px solid ${passError ? "#C45A5A" : "#E0D8D0"}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", background: passError ? "#FEF2F2" : "white", color: "#2C2420" }} />
              {passError && <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, color: "#C45A5A", fontSize: 12, fontWeight: 600 }}>❌ Contraseña incorrecta.</div>}
            </div>
            <button onClick={tryLogin} style={{ width: "100%", padding: "13px", background: "#2C2420", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: 10 }}>Entrar al panel de edición</button>
            <button onClick={() => { setLoginOpen(false); setPassInput(""); setPassError(false); }} style={{ width: "100%", padding: "11px", background: "none", border: "1px solid #E0D8D0", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", color: "#8A7868", fontFamily: "inherit" }}>Cancelar</button>
          </div>
        </div>
      )}

      {!isAdmin && (
        <div onDoubleClick={() => setLoginOpen(true)} onTouchEnd={() => { const now = Date.now(); if (now - (window._lastTap || 0) < 400) setLoginOpen(true); window._lastTap = now; }} style={{ position: "fixed", bottom: 0, right: 0, width: 60, height: 60, zIndex: 100, cursor: "default", opacity: 0 }} />
      )}

      {saved && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#2C2420", color: "white", padding: "11px 24px", borderRadius: 40, fontSize: 13, fontWeight: 700, boxShadow: "0 8px 28px rgba(0,0,0,0.25)", zIndex: 9999, whiteSpace: "nowrap" }}>✓ Cambios guardados</div>
      )}
    </div>
  );
}
