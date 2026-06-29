import { useState } from "react";
import { MODELOS_CABANAS } from "../../data/wizardData";

const PASOS_WIZARD = [
  { n: 1, t: "Tipo de cabaña",           d: "1 piso, 2 pisos, modular, refugio, conjunto…",  e: "🏕️" },
  { n: 2, t: "Terreno e infraestructura", d: "Agua potable, aguas servidas, superficie.",       e: "💧" },
  { n: 3, t: "Programa interior",         d: "Dormitorios, baños, living, terraza y más.",      e: "🛏" },
  { n: 4, t: "Estilo y materiales",       d: "Estética arquitectónica y revestimientos.",        e: "🎨" },
  { n: 5, t: "Resumen y envío",           d: "Recibe tu propuesta por WhatsApp en 24–48 hrs.",  e: "💬" },
];

function ModeloCabanaCard({ modelo, C, sm, onCotizar }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white",
        border: `2px solid ${hovered ? modelo.tagColor : "#E8E0D4"}`,
        borderRadius: 16, overflow: "hidden", transition: "all 0.22s",
        boxShadow: hovered ? `0 16px 48px ${modelo.tagColor}22` : "0 2px 12px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Imagen / placeholder */}
      <div style={{ width: "100%", aspectRatio: "16/9", overflow: "hidden", position: "relative", flexShrink: 0 }}>
        {modelo.img ? (
          <img src={modelo.img} alt={modelo.nombre} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, background: `linear-gradient(135deg, ${modelo.tagColor}18 0%, ${modelo.tagColor}35 100%)` }}>
            <span style={{ fontSize: 44 }}>{modelo.emoji}</span>
            <span style={{ fontSize: 9, color: modelo.tagColor, opacity: 0.6, fontFamily: "'HWYGothic',sans-serif", textTransform: "uppercase", letterSpacing: 2, fontWeight: 700 }}>Foto próximamente</span>
          </div>
        )}
        {/* Badge de nivel */}
        <div style={{ position: "absolute", top: 12, left: 12, background: modelo.tagColor, borderRadius: 20, padding: "4px 12px" }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: "white", fontFamily: "'HWYGothic',sans-serif", letterSpacing: 1, textTransform: "uppercase" }}>{modelo.tag}</span>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ padding: sm ? "18px 18px 20px" : "22px 22px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Nombre + precio */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
          <div style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: sm ? 20 : 22, fontWeight: 700, color: C.text, lineHeight: 1 }}>
            {modelo.nombre}
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: sm ? 15 : 17, fontWeight: 800, color: modelo.tagColor, fontFamily: "'HWYGWide',sans-serif", lineHeight: 1 }}>
              {modelo.precioDesde}
            </div>
          </div>
        </div>

        {/* Nivel de terminaciones */}
        <div style={{ fontSize: 11, color: modelo.tagColor, fontWeight: 700, fontFamily: "'HWYGothic',sans-serif", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid #EDE8E0" }}>
          {modelo.nivel}
        </div>

        {/* Puntos clave */}
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          {modelo.puntos.map((p, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: sm ? 12 : 13, color: "#4A4A4A", fontFamily: "'HWYGothic',sans-serif", lineHeight: 1.45 }}>
              <span style={{ color: modelo.tagColor, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>✓</span>
              {p}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={onCotizar}
          style={{
            width: "100%", padding: sm ? "13px 16px" : "14px 16px",
            background: hovered ? modelo.tagColor : "white",
            color: hovered ? "white" : modelo.tagColor,
            border: `2px solid ${modelo.tagColor}`,
            borderRadius: 10, fontSize: sm ? 13 : 14, fontWeight: 700,
            cursor: "pointer", fontFamily: "'HWYGothic',sans-serif",
            transition: "all 0.18s", letterSpacing: 0.3,
          }}
          onMouseOver={e => { e.currentTarget.style.background = modelo.tagColor; e.currentTarget.style.color = "white"; }}
          onMouseOut={e => { e.currentTarget.style.background = hovered ? modelo.tagColor : "white"; e.currentTarget.style.color = hovered ? "white" : modelo.tagColor; }}
        >
          {modelo.cta}
        </button>
      </div>
    </div>
  );
}

export function SeccionDiseñaProyecto({ C, sm, onAbrir }) {
  return (
    <section id="diseña-tu-proyecto" style={{ background: C.dark, position: "relative", overflow: "hidden" }}>
      {/* Franja superior: texto + CTA */}
      <div style={{ padding: sm ? "52px 20px 40px" : "72px 32px 56px", borderBottom: "1px solid rgba(255,255,255,0.07)", position: "relative" }}>
        <div style={{ position: "absolute", top: -80, right: "10%", width: 500, height: 500, borderRadius: "50%", background: `${C.warm}18`, filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1400, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "5px 16px", marginBottom: 24 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.warm }} />
            <span style={{ fontSize: 10, color: "rgba(196,180,154,0.8)", letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 600, fontFamily: "'HWYGothic',sans-serif" }}>Herramienta exclusiva · Casa-Estudio 1016</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: sm ? "1fr" : "1fr auto", gap: sm ? 28 : 48, alignItems: "flex-end" }}>
            <div>
              <h2 style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: sm ? "clamp(30px,8vw,44px)" : "clamp(36px,4vw,58px)", fontWeight: 400, color: "white", lineHeight: 1.1, marginBottom: 16 }}>
                Diseña tu <em style={{ fontStyle: "italic", color: C.warm }}>cabaña</em>{" "}en 5 pasos
              </h2>
              <p style={{ fontSize: sm ? 14 : 16, color: "rgba(255,255,255,0.48)", lineHeight: 1.8, maxWidth: 560, fontFamily: "'HWYGothic',sans-serif", fontWeight: 300 }}>
                Configura tu cabaña paso a paso: tipología, terreno, infraestructura, programa, estilo y materialidad. Recibe una orientación inicial para cotizar. Sin compromiso, solo 3 minutos.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: sm ? "flex-start" : "flex-end", gap: 12, flexShrink: 0 }}>
              <button onClick={onAbrir} style={{ background: "white", color: C.dark, border: "none", borderRadius: 8, padding: "16px 36px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'HWYGothic',sans-serif", display: "inline-flex", alignItems: "center", gap: 10, whiteSpace: "nowrap", transition: "all 0.2s", boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}
                onMouseOver={e => { e.currentTarget.style.background = C.warm; e.currentTarget.style.color = "white"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseOut={e  => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = C.dark; e.currentTarget.style.transform = "translateY(0)"; }}>
                <span style={{ fontSize: 18 }}>+</span> Comenzar diseño
              </button>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "'HWYGothic',sans-serif", textAlign: sm ? "left" : "right" }}>Sin compromiso · Respuesta en 24–48 hrs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Franja intermedia: pasos */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: sm ? "0 20px 52px" : "0 32px 60px" }}>
        {!sm && (
          <div style={{ position: "relative", display: "flex", alignItems: "flex-start", paddingTop: 40 }}>
            <div style={{ position: "absolute", top: 59, left: 28, right: 28, height: 1, background: "rgba(255,255,255,0.1)" }} />
            {PASOS_WIZARD.map((p, i) => (
              <div key={p.n} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", cursor: "pointer" }} onClick={onAbrir}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: i === 4 ? C.warm : "rgba(255,255,255,0.08)", border: `1.5px solid ${i === 4 ? C.warm : "rgba(255,255,255,0.2)"}`, fontSize: 15, fontWeight: 800, color: "white", fontFamily: "'HWYGWide',sans-serif", marginBottom: 20, zIndex: 1, transition: "all 0.2s", boxShadow: i === 4 ? `0 0 0 6px ${C.warm}25` : "none" }}>{p.n}</div>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderTop: `2px solid ${i === 4 ? C.warm : "rgba(255,255,255,0.15)"}`, borderRadius: 10, padding: "20px 16px", width: "calc(100% - 16px)", textAlign: "center", transition: "all 0.2s" }}
                  onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderTopColor = C.warm; }}
                  onMouseOut={e  => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderTopColor = i === 4 ? C.warm : "rgba(255,255,255,0.15)"; }}>
                  <div style={{ fontSize: 26, marginBottom: 10, lineHeight: 1 }}>{p.e}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 8, fontFamily: "'HWYGWide',sans-serif", lineHeight: 1.3 }}>{p.t}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'HWYGothic',sans-serif", lineHeight: 1.65 }}>{p.d}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {sm && (
          <div style={{ display: "flex", flexDirection: "column", gap: 0, paddingTop: 36 }}>
            {PASOS_WIZARD.map((p, i) => (
              <div key={p.n} onClick={onAbrir} style={{ display: "flex", gap: 16, alignItems: "flex-start", cursor: "pointer", paddingBottom: i < 4 ? 24 : 0, position: "relative" }}>
                {i < 4 && <div style={{ position: "absolute", left: 18, top: 44, bottom: 0, width: 1, background: "rgba(255,255,255,0.1)" }} />}
                <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: i === 4 ? C.warm : "rgba(255,255,255,0.08)", border: `1.5px solid ${i === 4 ? C.warm : "rgba(255,255,255,0.2)"}`, fontSize: 13, fontWeight: 800, color: "white", fontFamily: "'HWYGWide',sans-serif", zIndex: 1 }}>{p.n}</div>
                <div style={{ flex: 1, paddingTop: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><span style={{ fontSize: 16 }}>{p.e}</span><span style={{ fontSize: 13, fontWeight: 700, color: "white", fontFamily: "'HWYGWide',sans-serif" }}>{p.t}</span></div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'HWYGothic',sans-serif", lineHeight: 1.6 }}>{p.d}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Galería de modelos */}
      <div style={{ background: "white", padding: sm ? "40px 20px 48px" : "56px 32px 64px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ marginBottom: sm ? 28 : 40 }}>
            <div style={{ fontSize: 10, color: C.warm, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 700, fontFamily: "'HWYGothic',sans-serif", marginBottom: 10 }}>Modelos disponibles</div>
            <h3 style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: sm ? "clamp(22px,6vw,30px)" : "clamp(24px,2.5vw,36px)", fontWeight: 400, color: C.text, lineHeight: 1.15 }}>
              Conoce nuestros <em style={{ fontStyle: "italic", color: C.warm }}>modelos de cabañas</em>
            </h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: sm ? "1fr" : "repeat(3, 1fr)", gap: sm ? 20 : 28 }}>
            {MODELOS_CABANAS.map((m) => (
              <ModeloCabanaCard key={m.id} modelo={m} C={C} sm={sm} onCotizar={onAbrir} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
