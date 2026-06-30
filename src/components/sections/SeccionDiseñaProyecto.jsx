import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MODELOS_CABANAS } from "../../data/wizardData";

// ─── LIGHTBOX ─────────────────────────────────────────────────────────────────
function Lightbox({ media, startIdx, onClose }) {
  const [idx, setIdx] = useState(startIdx);
  const videoRef = useRef(null);
  const current = media[idx];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    if (current.type === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [idx, current.type]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx(i => (i + 1) % media.length);
      if (e.key === "ArrowLeft")  setIdx(i => (i - 1 + media.length) % media.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [media.length, onClose]);

  const prev = (e) => { e.stopPropagation(); setIdx(i => (i - 1 + media.length) % media.length); };
  const next = (e) => { e.stopPropagation(); setIdx(i => (i + 1) % media.length); };

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 3000,
        background: "rgba(0,0,0,0.95)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: 16, right: 16, zIndex: 10,
          width: 40, height: 40, borderRadius: "50%",
          background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
          color: "white", fontSize: 20, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.15s",
        }}
        onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.22)"; }}
        onMouseOut={e  => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
      >✕</button>

      {/* Contador */}
      <div style={{
        position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)",
        fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "'HWYGothic',sans-serif", letterSpacing: 1,
      }}>
        {idx + 1} / {media.length}
      </div>

      {/* Media */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: "92vw", maxHeight: "88vh",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {current.type === "image" ? (
          <img
            key={idx}
            src={current.src}
            alt={`slide ${idx + 1}`}
            style={{
              maxWidth: "100%", maxHeight: "88vh",
              objectFit: "contain", borderRadius: 6,
              animation: "fadeIn 0.2s ease",
              userSelect: "none",
            }}
          />
        ) : (
          <video
            key={idx}
            ref={videoRef}
            src={current.src}
            controls
            autoPlay
            loop
            playsInline
            style={{
              maxWidth: "100%", maxHeight: "88vh",
              borderRadius: 6, outline: "none",
              animation: "fadeIn 0.2s ease",
            }}
          />
        )}
      </div>

      {/* Flecha izquierda */}
      {media.length > 1 && (
        <button
          onClick={prev}
          style={{
            position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
            width: 44, height: 44, borderRadius: "50%",
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            color: "white", fontSize: 22, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.15s",
          }}
          onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.22)"; }}
          onMouseOut={e  => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
        >‹</button>
      )}

      {/* Flecha derecha */}
      {media.length > 1 && (
        <button
          onClick={next}
          style={{
            position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
            width: 44, height: 44, borderRadius: "50%",
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            color: "white", fontSize: 22, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.15s",
          }}
          onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.22)"; }}
          onMouseOut={e  => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
        >›</button>
      )}

      {/* Puntos */}
      {media.length > 1 && (
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
          {media.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setIdx(i); }}
              style={{
                width: i === idx ? 24 : 8, height: 8, borderRadius: 4, border: "none", cursor: "pointer",
                background: i === idx ? "white" : "rgba(255,255,255,0.35)",
                transition: "all 0.25s", padding: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* Hint teclado */}
      <div style={{
        position: "absolute", bottom: 20, right: 20,
        fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "'HWYGothic',sans-serif",
      }}>
        ← → para navegar · Esc para cerrar
      </div>
    </div>,
    document.body
  );
}

// ─── CARRUSEL DE MEDIA ────────────────────────────────────────────────────────
function MediaCarousel({ media, tagColor, tag, nombre }) {
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const videoRef = useRef(null);
  const current = media[idx];

  useEffect(() => {
    if (current.type === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [idx, current.type]);

  const prev = (e) => { e.stopPropagation(); setIdx(i => (i - 1 + media.length) % media.length); };
  const next = (e) => { e.stopPropagation(); setIdx(i => (i + 1) % media.length); };

  return (
    <>
    {lightbox && <Lightbox media={media} startIdx={idx} onClose={() => setLightbox(false)} />}
    <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", background: "#111" }}>
      {/* Slide — click abre lightbox */}
      <div onClick={() => setLightbox(true)} style={{ width: "100%", height: "100%", cursor: "zoom-in" }}>
      {current.type === "image" ? (
        <img
          key={idx}
          src={current.src}
          alt={`${nombre} ${idx + 1}`}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", animation: "fadeIn 0.3s ease" }}
        />
      ) : (
        <video
          key={idx}
          ref={videoRef}
          src={current.src}
          muted
          loop
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", animation: "fadeIn 0.3s ease" }}
        />
      )}
      </div>

      {/* Overlay gradiente para flechas */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.18) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.18) 100%)", pointerEvents: "none" }} />

      {/* Flecha izquierda */}
      <button
        onClick={prev}
        style={{
          position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
          width: 32, height: 32, borderRadius: "50%",
          background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)", transition: "all 0.15s",
          fontSize: 14, color: "#2A3528", fontWeight: 700,
        }}
        onMouseOver={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.transform = "translateY(-50%) scale(1.08)"; }}
        onMouseOut={e  => { e.currentTarget.style.background = "rgba(255,255,255,0.9)"; e.currentTarget.style.transform = "translateY(-50%) scale(1)"; }}
      >‹</button>

      {/* Flecha derecha */}
      <button
        onClick={next}
        style={{
          position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
          width: 32, height: 32, borderRadius: "50%",
          background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)", transition: "all 0.15s",
          fontSize: 14, color: "#2A3528", fontWeight: 700,
        }}
        onMouseOver={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.transform = "translateY(-50%) scale(1.08)"; }}
        onMouseOut={e  => { e.currentTarget.style.background = "rgba(255,255,255,0.9)"; e.currentTarget.style.transform = "translateY(-50%) scale(1)"; }}
      >›</button>

      {/* Badge nivel */}
      <div style={{ position: "absolute", top: 12, left: 12, background: tagColor, borderRadius: 20, padding: "4px 12px" }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: "white", fontFamily: "'HWYGothic',sans-serif", letterSpacing: 1, textTransform: "uppercase" }}>{tag}</span>
      </div>

      {/* Indicador de video */}
      {current.type === "video" && (
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: "rgba(0,0,0,0.55)", borderRadius: 6, padding: "3px 9px",
          fontSize: 10, color: "white", fontFamily: "'HWYGothic',sans-serif", fontWeight: 600, letterSpacing: 0.5,
        }}>
          VIDEO
        </div>
      )}

      {/* Puntos indicadores */}
      <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
        {media.map((_, i) => (
          <button
            key={i}
            onClick={e => { e.stopPropagation(); setIdx(i); }}
            style={{
              width: i === idx ? 20 : 7, height: 7,
              borderRadius: 4, border: "none", cursor: "pointer",
              background: i === idx ? "white" : "rgba(255,255,255,0.45)",
              transition: "all 0.25s", padding: 0,
            }}
          />
        ))}
      </div>
    </div>
    </>
  );
}

const PASOS_WIZARD = [
  { n: 1, t: "Tipo de cabaña",           d: "1 piso, 2 pisos, modular, refugio, conjunto." },
  { n: 2, t: "Terreno e infraestructura", d: "Agua potable, aguas servidas, superficie." },
  { n: 3, t: "Programa interior",         d: "Dormitorios, baños, living, terraza y más." },
  { n: 4, t: "Estilo y materiales",       d: "Estética arquitectónica y revestimientos." },
  { n: 5, t: "Resumen y envío",           d: "Recibe tu propuesta por WhatsApp en 24–48 hrs." },
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
      {/* Carrusel */}
      <div style={{ flexShrink: 0 }}>
        {modelo.media?.length ? (
          <MediaCarousel media={modelo.media} tagColor={modelo.tagColor} tag={modelo.tag} nombre={modelo.nombre} />
        ) : (
          <div style={{ width: "100%", aspectRatio: "16/9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, background: `linear-gradient(135deg, ${modelo.tagColor}12 0%, ${modelo.tagColor}28 100%)`, position: "relative" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: modelo.tagColor, fontFamily: "'HWYGWide',sans-serif", letterSpacing: 1, textTransform: "uppercase" }}>{modelo.nombre}</div>
            <div style={{ fontSize: 9, color: modelo.tagColor, opacity: 0.5, fontFamily: "'HWYGothic',sans-serif", textTransform: "uppercase", letterSpacing: 2, fontWeight: 600 }}>Imagen próximamente</div>
            <div style={{ position: "absolute", top: 12, left: 12, background: modelo.tagColor, borderRadius: 20, padding: "4px 12px" }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: "white", fontFamily: "'HWYGothic',sans-serif", letterSpacing: 1, textTransform: "uppercase" }}>{modelo.tag}</span>
            </div>
          </div>
        )}
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
                Comenzar diseño
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
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><span style={{ fontSize: 13, fontWeight: 700, color: "white", fontFamily: "'HWYGWide',sans-serif" }}>{p.t}</span></div>
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
