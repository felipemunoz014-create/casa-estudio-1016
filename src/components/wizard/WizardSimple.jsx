import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const DARK   = "#2A3528";
const ACCENT = "#4A6741";
const BORDER = "#E0D8D0";
const MUTED  = "#8A7868";

// ─── PREGUNTAS ────────────────────────────────────────────────────────────────
const PREGUNTAS = [
  {
    id: "uso",
    titulo: "¿Para qué usarás tu cabaña?",
    subtitulo: "Elige la opción que mejor te describe",
    opciones: [
      { id: "vivir",    label: "Para vivir",      sub: "Vivienda principal" },
      { id: "arrendar", label: "Para arrendar",   sub: "Negocio o inversión" },
      { id: "vacacion", label: "Para vacacionar", sub: "Casa de campo o playa" },
      { id: "mixto",    label: "Uso mixto",       sub: "Vivir y arrendar" },
    ],
  },
  {
    id: "dormitorios",
    titulo: "¿Cuántos dormitorios necesitas?",
    subtitulo: "Puedes ajustarlo más adelante",
    opciones: [
      { id: "d1", label: "1 dormitorio",  sub: "Ideal para pareja" },
      { id: "d2", label: "2 dormitorios", sub: "Familia pequeña" },
      { id: "d3", label: "3 dormitorios", sub: "Familia grande" },
      { id: "d4", label: "4 o más",       sub: "Proyecto amplio" },
    ],
  },
  {
    id: "terreno",
    titulo: "¿Ya tienes terreno?",
    subtitulo: "Esto nos ayuda a planificar contigo",
    opciones: [
      { id: "si",       label: "Sí, ya tengo",    sub: "Listo para construir" },
      { id: "buscando", label: "Estoy buscando",  sub: "Aún no lo defino" },
      { id: "no",       label: "Todavía no",      sub: "Quiero orientación" },
    ],
  },
  {
    id: "presupuesto",
    titulo: "¿Cuál es tu presupuesto aproximado?",
    subtitulo: "Sin compromiso — solo para orientarte con la solución más adecuada",
    tipo: "presupuesto",
    opciones: [
      { id: "bajo",  rango: "Hasta $20M",  tier: "Esencial",   sub: "Construcción funcional y bien terminada" },
      { id: "medio", rango: "$20M – $60M", tier: "Estándar",   sub: "Mayor confort, materiales de calidad" },
      { id: "alto",  rango: "Más de $60M", tier: "Premium",    sub: "Alto estándar, diseño personalizado" },
      { id: "nd",    rango: "A definir",   tier: "Orientarme", sub: "Quiero que me recomienden según mi proyecto" },
    ],
  },
  {
    id: "estilo",
    titulo: "¿Qué estilo te gusta más?",
    subtitulo: "Solo una preferencia general",
    opciones: [
      { id: "natural",  label: "Natural",          sub: "Madera, tonos tierra" },
      { id: "moderno",  label: "Moderno",           sub: "Líneas limpias, minimalista" },
      { id: "rustico",  label: "Rústico",           sub: "Clásico y acogedor" },
      { id: "sinpref",  label: "Sin preferencia",   sub: "Me lo recomiendas tú" },
    ],
  },
  {
    id: "plazo",
    titulo: "¿Cuándo quieres empezar?",
    subtitulo: "Para coordinar contigo",
    opciones: [
      { id: "ahora",      label: "Lo antes posible",    sub: "Estoy listo/a" },
      { id: "3meses",     label: "En 3 a 6 meses",      sub: "Planificando" },
      { id: "6meses",     label: "En más de 6 meses",   sub: "Con tiempo" },
      { id: "explorando", label: "Solo explorando",      sub: "Quiero información" },
    ],
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getLabel(pregId, opcId) {
  const preg = PREGUNTAS.find(p => p.id === pregId);
  if (!preg) return opcId;
  const opc = preg.opciones.find(o => o.id === opcId);
  if (!opc) return opcId;
  return opc.label ?? opc.rango ?? opcId;
}

// ─── TARJETA ESTÁNDAR ────────────────────────────────────────────────────────
function OpcionCard({ opcion, selected, onClick, sm }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", flexDirection: "column",
        alignItems: "flex-start", justifyContent: "center",
        gap: 5, padding: sm ? "16px 14px" : "20px 18px",
        border: `1.5px solid ${selected ? ACCENT : hover ? "#B8A88A" : BORDER}`,
        borderRadius: 10,
        background: selected ? ACCENT : hover ? "#FDFAF6" : "white",
        cursor: "pointer", transition: "all 0.15s ease",
        boxShadow: selected
          ? "0 4px 20px rgba(74,103,65,0.2)"
          : hover ? "0 3px 12px rgba(0,0,0,0.07)" : "0 1px 3px rgba(0,0,0,0.04)",
        position: "relative", textAlign: "left",
      }}
    >
      {selected && (
        <div style={{
          position: "absolute", top: 9, right: 9,
          width: 18, height: 18, borderRadius: "50%",
          background: "rgba(255,255,255,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, color: "white", fontWeight: 800,
        }}>✓</div>
      )}
      <div style={{
        fontSize: sm ? 13 : 14, fontWeight: 700,
        color: selected ? "white" : DARK,
        fontFamily: "'HWYGothic', sans-serif", lineHeight: 1.2,
      }}>
        {opcion.label}
      </div>
      <div style={{
        fontSize: sm ? 10 : 11,
        color: selected ? "rgba(255,255,255,0.65)" : MUTED,
        fontFamily: "'HWYGothic', sans-serif", lineHeight: 1.3,
      }}>
        {opcion.sub}
      </div>
    </button>
  );
}

// ─── TARJETA PRESUPUESTO ─────────────────────────────────────────────────────
function PresupuestoCard({ opcion, selected, onClick, sm }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", flexDirection: "column",
        alignItems: "flex-start", justifyContent: "space-between",
        padding: sm ? "16px 14px" : "20px 18px",
        border: `1.5px solid ${selected ? DARK : hover ? "#B8A88A" : BORDER}`,
        borderRadius: 10,
        background: selected ? DARK : hover ? "#FDFAF6" : "white",
        cursor: "pointer", transition: "all 0.15s ease",
        boxShadow: selected
          ? "0 4px 20px rgba(42,53,40,0.18)"
          : hover ? "0 3px 12px rgba(0,0,0,0.07)" : "0 1px 3px rgba(0,0,0,0.04)",
        textAlign: "left", minHeight: sm ? 88 : 105, position: "relative",
      }}
    >
      {selected && (
        <div style={{
          position: "absolute", top: 9, right: 9,
          width: 18, height: 18, borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, color: "white", fontWeight: 800,
        }}>✓</div>
      )}
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase",
        color: selected ? "rgba(255,255,255,0.45)" : "#A89878",
        fontFamily: "'HWYGothic', sans-serif", marginBottom: 5,
      }}>
        {opcion.tier}
      </div>
      <div style={{
        fontSize: sm ? 17 : 19, fontWeight: 800, lineHeight: 1.1,
        color: selected ? "white" : DARK,
        fontFamily: "'HWYGWide', sans-serif", marginBottom: 7,
      }}>
        {opcion.rango}
      </div>
      <div style={{
        fontSize: sm ? 10 : 11, lineHeight: 1.5,
        color: selected ? "rgba(255,255,255,0.55)" : MUTED,
        fontFamily: "'HWYGothic', sans-serif",
      }}>
        {opcion.sub}
      </div>
    </button>
  );
}

// ─── ENCABEZADO DE PREGUNTA ───────────────────────────────────────────────────
function PreguntaHeader({ titulo, subtitulo, sm }) {
  return (
    <div style={{ textAlign: "center", marginBottom: sm ? 24 : 32, maxWidth: 460 }}>
      <h2 style={{
        fontFamily: "'HWYGWide', sans-serif",
        fontSize: sm ? "clamp(18px,5vw,22px)" : "clamp(20px,2.5vw,26px)",
        fontWeight: 600, color: DARK, lineHeight: 1.25, marginBottom: 8,
      }}>
        {titulo}
      </h2>
      <p style={{ fontSize: sm ? 12 : 13, color: MUTED, fontFamily: "'HWYGothic', sans-serif" }}>
        {subtitulo}
      </p>
    </div>
  );
}

// ─── PANTALLA DE PREGUNTA ────────────────────────────────────────────────────
function PantallaPregunta({ pregunta, valor, onSelect, sm }) {
  const esPresupuesto = pregunta.tipo === "presupuesto";
  const cols = pregunta.opciones.length === 3 ? 3 : 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: sm ? "8px 0 24px" : "16px 0 32px" }}>
      <PreguntaHeader titulo={pregunta.titulo} subtitulo={pregunta.subtitulo} sm={sm} />

      <div style={{
        display: "grid",
        gridTemplateColumns: sm
          ? (cols === 3 ? "repeat(3, 1fr)" : "repeat(2, 1fr)")
          : `repeat(${cols}, 1fr)`,
        gap: sm ? 9 : 12,
        width: "100%",
        maxWidth: esPresupuesto ? 480 : cols === 3 ? 460 : 420,
      }}>
        {pregunta.opciones.map(op =>
          esPresupuesto
            ? <PresupuestoCard key={op.id} opcion={op} selected={valor === op.id} onClick={() => onSelect(op.id)} sm={sm} />
            : <OpcionCard      key={op.id} opcion={op} selected={valor === op.id} onClick={() => onSelect(op.id)} sm={sm} />
        )}
      </div>

      {esPresupuesto && (
        <p style={{ marginTop: 16, fontSize: 11, color: "#B0A898", fontFamily: "'HWYGothic', sans-serif", textAlign: "center" }}>
          Tu información es confidencial y solo se usa para orientarte mejor.
        </p>
      )}
    </div>
  );
}

// ─── PANTALLA FINAL: DATOS DE CONTACTO ───────────────────────────────────────
function PantallaContacto({ nombre, setNombre, telefono, setTelefono, sm, onEnviar, cargando }) {
  const listo = nombre.trim() && telefono.trim();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: sm ? "8px 0 24px" : "16px 0 32px" }}>
      <div style={{ textAlign: "center", marginBottom: sm ? 24 : 32, maxWidth: 420 }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%", background: "#EDF2EB",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 style={{
          fontFamily: "'HWYGWide', sans-serif",
          fontSize: sm ? "clamp(18px,5vw,22px)" : "clamp(20px,2.5vw,26px)",
          fontWeight: 600, color: DARK, lineHeight: 1.25, marginBottom: 8,
        }}>
          Un último paso
        </h2>
        <p style={{ fontSize: sm ? 12 : 13, color: MUTED, fontFamily: "'HWYGothic', sans-serif" }}>
          Déjanos tu nombre y número de WhatsApp para enviarte la orientación de tu proyecto.
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 7, fontFamily: "'HWYGothic', sans-serif" }}>
            Nombre
          </label>
          <input
            type="text" value={nombre} onChange={e => setNombre(e.target.value)}
            placeholder="Tu nombre" autoFocus
            style={{
              width: "100%", padding: "13px 14px",
              border: `1.5px solid ${BORDER}`, borderRadius: 9,
              fontSize: 15, fontFamily: "'HWYGothic', sans-serif",
              color: DARK, outline: "none", transition: "border-color 0.15s",
              boxSizing: "border-box",
            }}
            onFocus={e => { e.target.style.borderColor = ACCENT; }}
            onBlur={e  => { e.target.style.borderColor = BORDER; }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 7, fontFamily: "'HWYGothic', sans-serif" }}>
            WhatsApp
          </label>
          <input
            type="tel" value={telefono}
            onChange={e => setTelefono(e.target.value.replace(/[^0-9+\s()-]/g, ""))}
            placeholder="+56 9 XXXX XXXX"
            style={{
              width: "100%", padding: "13px 14px",
              border: `1.5px solid ${BORDER}`, borderRadius: 9,
              fontSize: 15, fontFamily: "'HWYGothic', sans-serif",
              color: DARK, outline: "none", transition: "border-color 0.15s",
              boxSizing: "border-box",
            }}
            onFocus={e => { e.target.style.borderColor = ACCENT; }}
            onBlur={e  => { e.target.style.borderColor = BORDER; }}
          />
        </div>

        <div style={{
          background: "#F7F5F2", border: `1px solid ${BORDER}`,
          borderRadius: 9, padding: "11px 14px",
          fontSize: 11, color: MUTED, fontFamily: "'HWYGothic', sans-serif", lineHeight: 1.6,
        }}>
          Tu información es privada. Te contactaremos solo para tu cotización.
        </div>

        <button
          type="button" onClick={onEnviar}
          disabled={!listo || cargando}
          style={{
            padding: "15px", borderRadius: 9, border: "none",
            background: listo ? DARK : "#C8C4BC",
            color: "white", fontSize: 14, fontWeight: 700,
            cursor: listo ? "pointer" : "not-allowed",
            fontFamily: "'HWYGothic', sans-serif",
            transition: "all 0.2s", letterSpacing: 0.3,
            boxShadow: listo ? "0 4px 16px rgba(42,53,40,0.25)" : "none",
          }}
        >
          {cargando ? "Enviando..." : "Enviar por WhatsApp"}
        </button>
      </div>
    </div>
  );
}

// ─── BARRA DE PROGRESO ────────────────────────────────────────────────────────
function BarraProgreso({ paso, total }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: MUTED, fontFamily: "'HWYGothic', sans-serif", fontWeight: 600 }}>
          Paso {paso} de {total}
        </span>
        <span style={{ fontSize: 11, color: MUTED, fontFamily: "'HWYGothic', sans-serif" }}>
          {Math.round(((paso - 1) / total) * 100)}%
        </span>
      </div>
      <div style={{ height: 3, background: "#EDE8E0", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${((paso - 1) / total) * 100}%`,
          background: ACCENT,
          borderRadius: 3, transition: "width 0.4s ease",
        }} />
      </div>
    </div>
  );
}

// ─── WIZARD SIMPLE ────────────────────────────────────────────────────────────
export function WizardSimple({ onClose, C, waNumber, sm }) {
  const TOTAL = PREGUNTAS.length + 1;
  const [paso, setPaso]           = useState(1);
  const [respuestas, setResp]     = useState({});
  const [nombre, setNombre]       = useState("");
  const [telefono, setTelefono]   = useState("");
  const [cargando, setCargando]   = useState(false);
  const [avanzando, setAvanzando] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const seleccionar = (pregId, opcId) => {
    setResp(r => ({ ...r, [pregId]: opcId }));
    if (!avanzando) {
      setAvanzando(true);
      setTimeout(() => { setPaso(p => Math.min(p + 1, TOTAL)); setAvanzando(false); }, 350);
    }
  };

  const buildMensajeWA = () => {
    const r = respuestas;
    const msg =
`Hola, Casa-Estudio 1016.

Soy *${nombre}* y completé el configurador de cabañas en su sitio web. Me gustaría recibir una orientación y cotización para mi proyecto.

━━━━━━━━━━━━━━━━━━━━
*RESUMEN DE MI PROYECTO*
━━━━━━━━━━━━━━━━━━━━

*Uso de la cabaña:* ${getLabel("uso", r.uso) || "—"}
*Dormitorios:* ${getLabel("dormitorios", r.dormitorios) || "—"}
*Terreno:* ${getLabel("terreno", r.terreno) || "—"}
*Presupuesto estimado:* ${getLabel("presupuesto", r.presupuesto) || "—"}
*Estilo preferido:* ${getLabel("estilo", r.estilo) || "—"}
*Cuándo quiero empezar:* ${getLabel("plazo", r.plazo) || "—"}

━━━━━━━━━━━━━━━━━━━━

*WhatsApp:* ${telefono}

Quedo a la espera de su orientación. Muchas gracias.`;
    return encodeURIComponent(msg);
  };

  const enviar = () => {
    if (!nombre.trim() || !telefono.trim()) return;
    setCargando(true);
    window.open(`https://wa.me/${waNumber}?text=${buildMensajeWA()}`, "_blank");
    setTimeout(() => { setCargando(false); onClose(); }, 800);
  };

  const preguntaActual = paso <= PREGUNTAS.length ? PREGUNTAS[paso - 1] : null;
  const esContacto     = paso === TOTAL;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(10,10,10,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: sm ? 0 : 16, backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#FAFAF8", width: "100%", maxWidth: 580,
          height: sm ? "100%" : "auto",
          maxHeight: sm ? "100%" : "90vh",
          borderRadius: sm ? 0 : 16,
          display: "flex", flexDirection: "column",
          boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "14px 20px", borderBottom: `1px solid ${BORDER}`,
          background: "white",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 30, height: 30, background: DARK, borderRadius: 5,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, fontWeight: 800, color: "white", fontFamily: "'HWYGWide', sans-serif",
            }}>1016</div>
            <div>
              <div style={{ fontFamily: "'HWYGWide', sans-serif", fontSize: 13, fontWeight: 700, color: DARK }}>
                Diseña tu cabaña
              </div>
              <div style={{ fontSize: 10, color: MUTED, letterSpacing: 0.3, fontFamily: "'HWYGothic', sans-serif" }}>
                Rápido · Sin formularios complicados
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none", border: `1px solid ${BORDER}`, borderRadius: 7,
              padding: "6px 12px", cursor: "pointer",
              fontSize: 12, color: MUTED, fontFamily: "'HWYGothic', sans-serif",
            }}
          >
            Cerrar
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: sm ? "20px 16px" : "28px 32px" }}>
          <BarraProgreso paso={paso} total={TOTAL} />
          <div key={paso} style={{ animation: "fadeUp 0.25s ease both" }}>
            {preguntaActual && (
              <PantallaPregunta
                pregunta={preguntaActual}
                valor={respuestas[preguntaActual.id]}
                onSelect={opcId => seleccionar(preguntaActual.id, opcId)}
                sm={sm}
              />
            )}
            {esContacto && (
              <PantallaContacto
                nombre={nombre} setNombre={setNombre}
                telefono={telefono} setTelefono={setTelefono}
                sm={sm} onEnviar={enviar} cargando={cargando}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "12px 20px", borderTop: `1px solid ${BORDER}`, background: "white",
          display: "flex", alignItems: "center",
          justifyContent: paso > 1 ? "space-between" : "flex-end",
          flexShrink: 0, gap: 12,
        }}>
          {paso > 1 && (
            <button
              type="button"
              onClick={() => setPaso(p => Math.max(1, p - 1))}
              style={{
                padding: "9px 16px", borderRadius: 8,
                border: `1.5px solid ${BORDER}`, background: "white",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                color: "#6A5A4A", fontFamily: "'HWYGothic', sans-serif",
                letterSpacing: 0.2,
              }}
            >
              Anterior
            </button>
          )}
          {!esContacto && (
            <button
              type="button"
              onClick={() => setPaso(p => Math.min(p + 1, TOTAL))}
              disabled={!respuestas[preguntaActual?.id]}
              style={{
                padding: "9px 20px", borderRadius: 8, border: "none",
                background: respuestas[preguntaActual?.id] ? ACCENT : "#DDD8D0",
                color: respuestas[preguntaActual?.id] ? "white" : "#9A8A7A",
                fontSize: 12, fontWeight: 700,
                cursor: respuestas[preguntaActual?.id] ? "pointer" : "not-allowed",
                fontFamily: "'HWYGothic', sans-serif", letterSpacing: 0.3,
                transition: "all 0.15s",
              }}
            >
              Siguiente
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
