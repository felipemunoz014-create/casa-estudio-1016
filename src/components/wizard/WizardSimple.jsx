import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

// ─── PREGUNTAS ────────────────────────────────────────────────────────────────
const PREGUNTAS = [
  {
    id: "uso",
    titulo: "¿Para qué usarás tu cabaña?",
    subtitulo: "Elige la opción que mejor te describe",
    opciones: [
      { id: "vivir",    emoji: "🏡", label: "Para vivir",           sub: "Vivienda principal" },
      { id: "arrendar", emoji: "💰", label: "Para arrendar",        sub: "Negocio o inversión" },
      { id: "vacacion", emoji: "🏝️", label: "Para vacacionar",      sub: "Casa de campo / playa" },
      { id: "mixto",    emoji: "🔀", label: "Uso mixto",            sub: "Vivir y arrendar" },
    ],
  },
  {
    id: "dormitorios",
    titulo: "¿Cuántos dormitorios necesitas?",
    subtitulo: "Puedes ajustarlo más adelante",
    opciones: [
      { id: "d1", emoji: "🛏️", label: "1 dormitorio",  sub: "Perfecto para pareja" },
      { id: "d2", emoji: "🛏️", label: "2 dormitorios", sub: "Ideal para familia pequeña" },
      { id: "d3", emoji: "🛏️", label: "3 dormitorios", sub: "Para familia grande" },
      { id: "d4", emoji: "🛏️", label: "4 o más",       sub: "Proyecto amplio" },
    ],
  },
  {
    id: "terreno",
    titulo: "¿Ya tienes terreno?",
    subtitulo: "Esto nos ayuda a planificar contigo",
    opciones: [
      { id: "si",       emoji: "✅", label: "Sí, ya tengo",       sub: "Listo para construir" },
      { id: "buscando", emoji: "🔍", label: "Estoy buscando",     sub: "Aún no lo defino" },
      { id: "no",       emoji: "❌", label: "Todavía no",         sub: "Puedo ayudarte a encontrar" },
    ],
  },
  {
    id: "presupuesto",
    titulo: "¿Cuál es tu presupuesto aproximado?",
    subtitulo: "Sin compromiso, solo para orientarte mejor",
    opciones: [
      { id: "bajo",      emoji: "💚", label: "Hasta $20M",    sub: "Solución económica" },
      { id: "medio",     emoji: "💛", label: "$20M – $60M",   sub: "Proyecto estándar" },
      { id: "alto",      emoji: "🟠", label: "Más de $60M",   sub: "Proyecto premium" },
      { id: "no_sé",     emoji: "❓", label: "No lo sé aún",  sub: "Quiero orientación" },
    ],
  },
  {
    id: "estilo",
    titulo: "¿Qué estilo te gusta más?",
    subtitulo: "Solo una preferencia general",
    opciones: [
      { id: "natural",   emoji: "🌲", label: "Natural / Bosque", sub: "Madera, tonos tierra" },
      { id: "moderno",   emoji: "◻️", label: "Moderno",          sub: "Líneas limpias, minimalista" },
      { id: "rustico",   emoji: "🪵", label: "Rústico",          sub: "Clásico y acogedor" },
      { id: "sinpref",   emoji: "😊", label: "Sin preferencia",  sub: "Me lo recomiendas tú" },
    ],
  },
  {
    id: "plazo",
    titulo: "¿Cuándo quieres empezar?",
    subtitulo: "Para coordinar contigo",
    opciones: [
      { id: "ahora",    emoji: "⚡", label: "Lo antes posible", sub: "Estoy listo/a" },
      { id: "3meses",   emoji: "📅", label: "En 3-6 meses",     sub: "Planificando" },
      { id: "6meses",   emoji: "🗓️", label: "En más de 6 meses",sub: "Tomándome mi tiempo" },
      { id: "explorando",emoji: "👀", label: "Solo explorando", sub: "Quiero información" },
    ],
  },
];

// ─── LABELS PARA EL RESUMEN ───────────────────────────────────────────────────
function getLabel(pregId, opcId) {
  const preg = PREGUNTAS.find(p => p.id === pregId);
  if (!preg) return opcId;
  return preg.opciones.find(o => o.id === opcId)?.label ?? opcId;
}

// ─── TARJETA DE OPCIÓN ────────────────────────────────────────────────────────
function OpcionCard({ opcion, selected, onClick, sm }) {
  const [hover, setHover] = useState(false);
  const active = selected || hover;
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: 8,
        padding: sm ? "18px 12px" : "22px 16px",
        border: `2px solid ${selected ? "#4A6741" : hover ? "#C8B89A" : "#E8E0D4"}`,
        borderRadius: 14,
        background: selected ? "#4A6741" : hover ? "#FDF8F0" : "white",
        cursor: "pointer",
        transition: "all 0.15s ease",
        transform: active && !selected ? "translateY(-2px)" : "none",
        boxShadow: selected
          ? "0 6px 24px rgba(74,103,65,0.25)"
          : hover ? "0 4px 16px rgba(0,0,0,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {selected && (
        <div style={{
          position: "absolute", top: 8, right: 8,
          width: 20, height: 20, borderRadius: "50%",
          background: "rgba(255,255,255,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, color: "white", fontWeight: 800,
        }}>✓</div>
      )}
      <span style={{ fontSize: sm ? 30 : 36, lineHeight: 1, filter: "saturate(1.2)" }}>
        {opcion.emoji}
      </span>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: sm ? 13 : 14, fontWeight: 700, lineHeight: 1.2,
          color: selected ? "white" : "#2A3528",
          fontFamily: "'HWYGothic', sans-serif",
          marginBottom: 3,
        }}>
          {opcion.label}
        </div>
        <div style={{
          fontSize: sm ? 10 : 11, color: selected ? "rgba(255,255,255,0.75)" : "#9A8A7A",
          fontFamily: "'HWYGothic', sans-serif", lineHeight: 1.3,
        }}>
          {opcion.sub}
        </div>
      </div>
    </button>
  );
}

// ─── PANTALLA DE PREGUNTA ─────────────────────────────────────────────────────
function PantallaPregunta({ pregunta, valor, onSelect, sm }) {
  const cols = pregunta.opciones.length === 3 ? 3 : 2;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: sm ? "8px 0 24px" : "16px 0 32px" }}>
      <div style={{ textAlign: "center", marginBottom: sm ? 24 : 32, maxWidth: 420 }}>
        <h2 style={{
          fontFamily: "'HWYGWide', sans-serif",
          fontSize: sm ? "clamp(18px,5vw,22px)" : "clamp(20px,2.5vw,26px)",
          fontWeight: 600, color: "#2A3528", lineHeight: 1.25, marginBottom: 8,
        }}>
          {pregunta.titulo}
        </h2>
        <p style={{
          fontSize: sm ? 12 : 13, color: "#8A7868",
          fontFamily: "'HWYGothic', sans-serif",
        }}>
          {pregunta.subtitulo}
        </p>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: sm
          ? (cols === 3 ? "repeat(3, 1fr)" : "repeat(2, 1fr)")
          : `repeat(${cols}, 1fr)`,
        gap: sm ? 10 : 14,
        width: "100%",
        maxWidth: cols === 3 ? 480 : 440,
      }}>
        {pregunta.opciones.map(op => (
          <OpcionCard
            key={op.id}
            opcion={op}
            selected={valor === op.id}
            onClick={() => onSelect(op.id)}
            sm={sm}
          />
        ))}
      </div>
    </div>
  );
}

// ─── PANTALLA FINAL: DATOS DE CONTACTO ───────────────────────────────────────
function PantallaContacto({ nombre, setNombre, telefono, setTelefono, sm, onEnviar, cargando }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: sm ? "8px 0 24px" : "16px 0 32px" }}>
      <div style={{ textAlign: "center", marginBottom: sm ? 24 : 32, maxWidth: 420 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
        <h2 style={{
          fontFamily: "'HWYGWide', sans-serif",
          fontSize: sm ? "clamp(18px,5vw,22px)" : "clamp(20px,2.5vw,26px)",
          fontWeight: 600, color: "#2A3528", lineHeight: 1.25, marginBottom: 8,
        }}>
          ¡Ya casi está!
        </h2>
        <p style={{ fontSize: sm ? 12 : 13, color: "#8A7868", fontFamily: "'HWYGothic', sans-serif" }}>
          Déjanos tu nombre y WhatsApp para enviarte la orientación de tu cabaña.
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#8A7868", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 7, fontFamily: "'HWYGothic', sans-serif" }}>
            Tu nombre
          </label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="¿Cómo te llamas?"
            autoFocus
            style={{
              width: "100%", padding: "14px 16px",
              border: "2px solid #E0D8D0", borderRadius: 10,
              fontSize: 16, fontFamily: "'HWYGothic', sans-serif",
              color: "#2A3528", outline: "none",
              transition: "border-color 0.15s",
              boxSizing: "border-box",
            }}
            onFocus={e => { e.target.style.borderColor = "#4A6741"; }}
            onBlur={e => { e.target.style.borderColor = "#E0D8D0"; }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#8A7868", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 7, fontFamily: "'HWYGothic', sans-serif" }}>
            Tu WhatsApp
          </label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18, pointerEvents: "none" }}>📱</span>
            <input
              type="tel"
              value={telefono}
              onChange={e => setTelefono(e.target.value.replace(/[^0-9+\s()-]/g, ""))}
              placeholder="+56 9 XXXX XXXX"
              style={{
                width: "100%", padding: "14px 16px 14px 44px",
                border: "2px solid #E0D8D0", borderRadius: 10,
                fontSize: 16, fontFamily: "'HWYGothic', sans-serif",
                color: "#2A3528", outline: "none",
                transition: "border-color 0.15s",
                boxSizing: "border-box",
              }}
              onFocus={e => { e.target.style.borderColor = "#4A6741"; }}
              onBlur={e => { e.target.style.borderColor = "#E0D8D0"; }}
            />
          </div>
        </div>

        <div style={{ background: "#F5F8F4", border: "1px solid #D8E8D4", borderRadius: 10, padding: "12px 14px", fontSize: 11, color: "#5A7058", fontFamily: "'HWYGothic', sans-serif", lineHeight: 1.6 }}>
          🔒 Tu información es privada. Te contactaremos solo para tu cotización, sin spam.
        </div>

        <button
          type="button"
          onClick={onEnviar}
          disabled={!nombre.trim() || !telefono.trim() || cargando}
          style={{
            padding: "16px", borderRadius: 10, border: "none",
            background: (!nombre.trim() || !telefono.trim()) ? "#C0C0C0" : "#25D366",
            color: "white", fontSize: 15, fontWeight: 700,
            cursor: (!nombre.trim() || !telefono.trim()) ? "not-allowed" : "pointer",
            fontFamily: "'HWYGothic', sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            transition: "all 0.2s",
            boxShadow: (!nombre.trim() || !telefono.trim()) ? "none" : "0 4px 16px rgba(37,211,102,0.35)",
          }}
        >
          <span style={{ fontSize: 20 }}>💬</span>
          {cargando ? "Enviando..." : "Recibir orientación por WhatsApp"}
        </button>
      </div>
    </div>
  );
}

// ─── BARRA DE PROGRESO ────────────────────────────────────────────────────────
function BarraProgreso({ paso, total, C }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: "#8A7868", fontFamily: "'HWYGothic', sans-serif", fontWeight: 600 }}>
          Pregunta {paso} de {total}
        </span>
        <span style={{ fontSize: 11, color: "#8A7868", fontFamily: "'HWYGothic', sans-serif" }}>
          {Math.round(((paso - 1) / total) * 100)}% completado
        </span>
      </div>
      <div style={{ height: 6, background: "#EDE8E0", borderRadius: 6, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${((paso - 1) / total) * 100}%`,
          background: `linear-gradient(90deg, #4A6741, #6B9A5E)`,
          borderRadius: 6,
          transition: "width 0.4s ease",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            width: i === paso - 1 ? 20 : 7,
            height: 7, borderRadius: 4,
            background: i < paso - 1 ? "#4A6741" : i === paso - 1 ? "#6B9A5E" : "#DDD8D0",
            transition: "all 0.3s ease",
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── WIZARD SIMPLE (modal principal) ─────────────────────────────────────────
export function WizardSimple({ onClose, C, waNumber, sm }) {
  const TOTAL = PREGUNTAS.length + 1; // preguntas + pantalla de contacto
  const [paso, setPaso]         = useState(1);
  const [respuestas, setResp]   = useState({});
  const [nombre, setNombre]     = useState("");
  const [telefono, setTelefono] = useState("");
  const [cargando, setCargando] = useState(false);
  const [avanzando, setAvanzando] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const seleccionar = (pregId, opcId) => {
    setResp(r => ({ ...r, [pregId]: opcId }));
    // Auto-avanzar con pequeño delay para feedback visual
    if (!avanzando) {
      setAvanzando(true);
      setTimeout(() => {
        setPaso(p => Math.min(p + 1, TOTAL));
        setAvanzando(false);
      }, 350);
    }
  };

  const anterior = () => setPaso(p => Math.max(1, p - 1));

  const buildMensajeWA = () => {
    const lineas = PREGUNTAS.map(p => {
      const val = respuestas[p.id];
      const label = val ? getLabel(p.id, val) : "No respondida";
      return `• ${p.titulo.replace("¿", "").replace("?", "")}: *${label}*`;
    });
    return encodeURIComponent(
      `¡Hola! Soy *${nombre}* y completé el configurador de cabañas en Casa-Estudio 1016.\n\n` +
      `Mis respuestas:\n${lineas.join("\n")}\n\n` +
      `Mi WhatsApp: ${telefono}\n\n` +
      `Quedo atento/a a su orientación. ¡Gracias! 🏕️`
    );
  };

  const enviar = () => {
    if (!nombre.trim() || !telefono.trim()) return;
    setCargando(true);
    const url = `https://wa.me/${waNumber}?text=${buildMensajeWA()}`;
    window.open(url, "_blank");
    setTimeout(() => { setCargando(false); onClose(); }, 800);
  };

  const preguntaActual = paso <= PREGUNTAS.length ? PREGUNTAS[paso - 1] : null;
  const esContacto = paso === TOTAL;
  const puedeRetroceder = paso > 1;

  const contenido = (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(15,12,10,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: sm ? 0 : 16,
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#FAF8F4",
          width: "100%", maxWidth: 600,
          height: sm ? "100%" : "auto",
          maxHeight: sm ? "100%" : "90vh",
          borderRadius: sm ? 0 : 20,
          display: "flex", flexDirection: "column",
          boxShadow: "0 40px 100px rgba(0,0,0,0.4)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "14px 20px",
          borderBottom: "1px solid #EDE8E0",
          background: "white",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, background: "#2A3528",
              borderRadius: 6, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 10, fontWeight: 800,
              color: "white", fontFamily: "'HWYGWide', sans-serif",
            }}>1016</div>
            <div>
              <div style={{ fontFamily: "'HWYGWide', sans-serif", fontSize: 14, fontWeight: 700, color: "#2A3528" }}>
                Diseña tu cabaña
              </div>
              <div style={{ fontSize: 10, color: "#9A8A7A", letterSpacing: 0.5, fontFamily: "'HWYGothic', sans-serif" }}>
                Rápido · Sin formularios complicados
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "1px solid #E0D8D0",
              borderRadius: 8, padding: "6px 12px", cursor: "pointer",
              fontSize: 12, color: "#8A7868", fontFamily: "'HWYGothic', sans-serif",
            }}
          >
            × Cerrar
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: sm ? "20px 16px" : "28px 32px" }}>
          <BarraProgreso paso={paso} total={TOTAL} C={C} />

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
                sm={sm}
                onEnviar={enviar}
                cargando={cargando}
              />
            )}
          </div>
        </div>

        {/* Footer navegación */}
        <div style={{
          padding: "12px 20px",
          borderTop: "1px solid #EDE8E0",
          background: "white",
          display: "flex", alignItems: "center",
          justifyContent: puedeRetroceder ? "space-between" : "flex-end",
          flexShrink: 0,
          gap: 12,
        }}>
          {puedeRetroceder && (
            <button
              type="button"
              onClick={anterior}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "9px 16px", borderRadius: 8,
                border: "1.5px solid #E0D8D0", background: "white",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                color: "#6A5A4A", fontFamily: "'HWYGothic', sans-serif",
              }}
            >
              ← Anterior
            </button>
          )}
          {!esContacto && (
            <button
              type="button"
              onClick={() => setPaso(p => Math.min(p + 1, TOTAL))}
              disabled={!respuestas[preguntaActual?.id]}
              style={{
                padding: "9px 20px", borderRadius: 8,
                border: "none",
                background: respuestas[preguntaActual?.id] ? "#4A6741" : "#DDD8D0",
                color: respuestas[preguntaActual?.id] ? "white" : "#9A8A7A",
                fontSize: 13, fontWeight: 700, cursor: respuestas[preguntaActual?.id] ? "pointer" : "not-allowed",
                fontFamily: "'HWYGothic', sans-serif",
                transition: "all 0.15s",
              }}
            >
              Siguiente →
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(contenido, document.body);
}
