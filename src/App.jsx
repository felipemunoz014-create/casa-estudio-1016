import QuotationModal from "./QuotationModal";
import FlujoCaja from "./FlujoCaja";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import heroImg from "./assets/Hero1.png";
import about1 from "./assets/Inicio1.jpeg";
import about2 from "./assets/Inicio2.jpeg";
import about3 from "./assets/Inicio3.jpeg";
import about4 from "./assets/Inicio5.png";
import marmolBlanco from "./assets/Marmol blanco.png";
import marmolGris from "./assets/Marmol Gris.png";
import marmolNegro from "./assets/Marmol Negro.png";
import wallCaoba from "./assets/Wall panel Caoba.png";
import wallMarmol from "./assets/wall-panel-marmol.png";
import wallRoble from "./assets/wall-panel-roble.png";
import cieloPvcPino from "./assets/cielo pvc pino.png";
import cieloPvcPinoTextura from "./assets/cielo pvc pino textura.png";
import cieloPvcPinoliving from "./assets/cielo pvc pino living.png";
import sidingMetalCastano from "./assets/siding metal castaño.png";
import sidingMetalCedro from "./assets/siding metal cedro.png";
import clipsWallPanel from "./assets/Clips wall panel.jpg";
import perfilPvcH from "./assets/Perfil PVC H.jpg";
import perfilPvcCornisa from "./assets/Perfil PVC CORNISA.jpg";
import perfilHSiding from "./assets/Perfil H siding.jpg";
import perfilTerminoSiding from "./assets/perfil termino siding.jpg";
import perfilEsquineroSiding from "./assets/perfil esquinero siding.jpg";
import perfilEsquineroInteriorSiding from "./assets/perfil esquinero interior siding.jpg";
import perfilWInteriorPvcUv from "./assets/perfil W interior PVC UV.jpg";
import perfilHPvcUv from "./assets/perfil-h-pvc-uv.jpg";
import wallCaobaLiving from "./assets/Wall-panel-Caoba-living.png";
import wallCaobaTextura from "./assets/Wall-panel-Caoba-textura.png";
import wallMarmolTextura from "./assets/wpmt.png";
import wallMarmolLiving from "./assets/wpml.png";
import wallRobleTextura from "./assets/wall-panel-roble-textura.png";
import wallRoblelLiving from "./assets/wall-panel-roble-living.png";
import sidingMetalCedroTextura from "./assets/siding metal cedro textura.png";
import sidingMetalCedroExterior from "./assets/siding metal cedro exterior.png";
import sidingMetalCastanoTextura from "./assets/siding metal castaño textura.png";
import sidingMetalCastanoExterior from "./assets/siding metal castaño exterior.png";

const EJS = {
  serviceId: "service_aycesln",
  templateId: "template_zkd4qaq",
  publicKey: "HNVJqgrwRpicOZjCJ",
};

async function sendEmail(fields) {
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: EJS.serviceId,
      template_id: EJS.templateId,
      user_id: EJS.publicKey,
      template_params: fields,
    }),
  });
  return res.ok;
}

function useW() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 375);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

const TX = {
  marble_gray: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#9BA5A8"/><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#B8C2C5"/><stop offset="40%" stop-color="#8A9599"/><stop offset="100%" stop-color="#7A8588"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/><path d="M0,80 Q100,60 200,100 T400,80" stroke="rgba(255,255,255,0.4)" stroke-width="2" fill="none"/><path d="M50,0 Q80,100 60,200 T80,400" stroke="rgba(255,255,255,0.35)" stroke-width="2" fill="none"/><path d="M200,0 Q230,150 210,250 T230,400" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" fill="none"/></svg>`,
  marble_white: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#E8E4DC"/><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#F0EDE8"/><stop offset="50%" stop-color="#E0DBD2"/><stop offset="100%" stop-color="#EAE6DE"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/><path d="M0,100 Q100,80 200,120 T400,100" stroke="rgba(160,150,140,0.5)" stroke-width="1.5" fill="none"/><path d="M80,0 Q100,100 90,200 T100,400" stroke="rgba(160,150,140,0.4)" stroke-width="1.5" fill="none"/></svg>`,
  marble_black: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#1A1A1A"/><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#252525"/><stop offset="50%" stop-color="#111"/><stop offset="100%" stop-color="#1E1E1E"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/><path d="M0,80 Q100,60 200,100 T400,80" stroke="rgba(255,255,255,0.25)" stroke-width="2.5" fill="none"/><path d="M100,0 Q120,150 110,300 T120,400" stroke="rgba(255,255,255,0.3)" stroke-width="2" fill="none"/></svg>`,
  wood_caoba: `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400"><rect width="300" height="400" fill="#5A2D0C"/><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#6B3515"/><stop offset="50%" stop-color="#7A4020"/><stop offset="100%" stop-color="#5A2D0C"/></linearGradient></defs><rect width="300" height="400" fill="url(#g)"/>${Array.from({ length: 28 }, (_, i) => `<line x1="0" y1="${i * 15}" x2="300" y2="${i * 15 + 3}" stroke="rgba(0,0,0,0.2)" stroke-width="1.5"/>`).join("")}</svg>`,
  wood_roble: `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400"><rect width="300" height="400" fill="#B8784A"/><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#C4855A"/><stop offset="50%" stop-color="#A86A35"/><stop offset="100%" stop-color="#B87840"/></linearGradient></defs><rect width="300" height="400" fill="url(#g)"/>${Array.from({ length: 28 }, (_, i) => `<line x1="0" y1="${i * 15}" x2="300" y2="${i * 15 + 2}" stroke="rgba(80,40,10,0.25)" stroke-width="1.2"/>`).join("")}</svg>`,
  panel_marble: `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400"><rect width="300" height="400" fill="#A8B8BC"/><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#B8C8CC"/><stop offset="100%" stop-color="#A8B8BC"/></linearGradient></defs><rect width="300" height="400" fill="url(#g)"/><path d="M0,60 Q80,45 160,65 T300,55" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" fill="none"/></svg>`,
  ceiling_pino: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="#C8A060"/>${Array.from({ length: 16 }, (_, i) => `<rect x="${i * 25}" y="0" width="24" height="200" fill="rgba(${i % 2 === 0 ? "180,130,60" : "200,155,80"},0.3)"/>`).join("")}</svg>`,
  siding_c: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#4A2D10"/>${Array.from({ length: 10 }, (_, i) => `<rect x="0" y="${i * 30}" width="400" height="28" fill="rgba(${70 + i * 3},${40 + i * 2},${15 + i},0.8)"/><rect x="0" y="${i * 30 + 28}" width="400" height="2" fill="rgba(0,0,0,0.4)"/>`).join("")}</svg>`,
  siding_r: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#6B4020"/>${Array.from({ length: 10 }, (_, i) => `<rect x="0" y="${i * 30}" width="400" height="28" fill="rgba(${100 + i * 3},${60 + i * 2},${25 + i},0.8)"/><rect x="0" y="${i * 30 + 28}" width="400" height="2" fill="rgba(0,0,0,0.35)"/>`).join("")}</svg>`,
  gold: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#D4B850"/><stop offset="50%" stop-color="#A88020"/><stop offset="100%" stop-color="#C8A840"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/></svg>`,
  silver: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#D0D0D0"/><stop offset="50%" stop-color="#909090"/><stop offset="100%" stop-color="#B8B8B8"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/></svg>`,
};

const DEFAULT_PRODS = [
  { id: 1, name: "PVC Mármol Gris", dims: "122×244cm", cat: "muro", code: "KL8235", price: 18700, unit: "c/u", tk: "marble_gray", image: marmolGris, images: [marmolGris, marmolGris, marmolGris], desc: "Elegancia mineral con venas sutiles." },
  { id: 2, name: "PVC Mármol Blanco", dims: "122×244cm", cat: "muro", code: "KL8263", price: 18700, unit: "c/u", tk: "marble_white", image: marmolBlanco, images: [marmolBlanco, marmolBlanco, marmolBlanco], desc: "Pureza y luminosidad. Amplía cualquier espacio." },
  { id: 3, name: "PVC Mármol Negro", dims: "122×244cm", cat: "muro", code: "KL8264", price: 18700, unit: "c/u", tk: "marble_black", image: marmolNegro, images: [marmolNegro, marmolNegro, marmolNegro], desc: "Sofisticación absoluta. Contraste dramático." },
  { id: 4, name: "Wall Panel Caoba 24mm", dims: "16×290cm", cat: "muro", code: "PY-60023-21", price: 6500, unit: "c/u", tk: "wood_caoba", image: wallCaoba, images: [wallCaobaTextura, wallCaoba, wallCaobaLiving], desc: "Calidez profunda. Textura acanalada contemporánea." },
  { id: 5, name: "Wall Panel Roble 24mm", dims: "16×290cm", cat: "muro", code: "PY-80450I-9", price: 6500, unit: "c/u", tk: "wood_roble", image: wallRoble, images: [wallRobleTextura, wallRoble, wallRoblelLiving], desc: "Tono natural cálido. Armonía nórdica." },
  { id: 6, name: "Wall Panel Mármol 24mm", dims: "16×290cm", cat: "muro", code: "PY-80401-2", price: 6500, unit: "c/u", tk: "panel_marble", image: wallMarmol, images: [wallMarmolTextura, wallMarmol, wallMarmolLiving], desc: "Mármol en formato panel acanalado." },
  { id: 7, name: "Placa Cielo PVC Pino", dims: "25×580cm", cat: "cielo", code: "DS059", price: 12500, unit: "c/u", tk: "ceiling_pino", image: cieloPvcPino, images: [cieloPvcPinoTextura, cieloPvcPino, cieloPvcPinoliving], desc: "Calidez en el cielo con veta natural." },
  { id: 8, name: "Siding Metal Castaño", dims: "38.3×580cm", cat: "exterior", code: "WG-02", price: 26500, unit: "c/u", tk: "siding_c", image: sidingMetalCastano, images: [sidingMetalCastanoTextura, sidingMetalCastano, sidingMetalCastanoExterior], desc: "Alta densidad. 2.2m² por unidad." },
  { id: 9, name: "Siding Metal Cedro", dims: "38.3×580cm", cat: "exterior", code: "WG-08", price: 26500, unit: "c/u", tk: "siding_r", image: sidingMetalCedro, images: [sidingMetalCedroTextura, sidingMetalCedro, sidingMetalCedroExterior], desc: "Cedro para exteriores. Normativa térmica." },
  { id: 10, name: "Perfil PVC H Cielo", dims: "1×4×580cm", cat: "accesorio", code: "DS059-H", price: 14500, unit: "c/u", tk: "gold", image: perfilPvcH, images: [perfilPvcH, perfilPvcH, perfilPvcH], desc: "Unión entre placas de cielo PVC." },
  { id: 11, name: "Perfil Cornisa 3×3", dims: "3×3×580cm", cat: "accesorio", code: "DS059-P", price: 14500, unit: "c/u", tk: "gold", image: perfilPvcCornisa, images: [perfilPvcCornisa, perfilPvcCornisa, perfilPvcCornisa], desc: "Encuentro elegante muro-cielo." },
  { id: 12, name: "100 Clips de Montaje", dims: "33×45mm", cat: "accesorio", code: "CLIPS", price: 6000, unit: "set", tk: "silver", image: clipsWallPanel, images: [clipsWallPanel, clipsWallPanel, clipsWallPanel], desc: "Fijación oculta para Wall Panel." },
  { id: 13, name: "Perfil H Aluminio", dims: "1.8×250cm", cat: "accesorio", code: "SILVER-H-JOINT", price: 3600, unit: "c/u", tk: "silver", image: perfilHPvcUv, images: [perfilHPvcUv, perfilHPvcUv, perfilHPvcUv], desc: "Unión de alto acabado para mármol PVC." },
  { id: 14, name: "Perfil Interior Aluminio", dims: "2×250cm", cat: "accesorio", code: "SILVER-INSIDE", price: 3600, unit: "c/u", tk: "silver", image: perfilWInteriorPvcUv, images: [perfilWInteriorPvcUv, perfilWInteriorPvcUv, perfilWInteriorPvcUv], desc: "Perfil interior para terminaciones." },
  { id: 15, name: "Perfil H Siding", dims: "20×50×3000mm", cat: "accesorio", code: "CENTER-JOINT", price: 7500, unit: "c/u", tk: "siding_r", image: perfilHSiding, images: [perfilHSiding, perfilHSiding, perfilHSiding], desc: "Perfil conector para unión de siding exterior." },
  { id: 16, name: "Perfil Término Siding", dims: "20×40×3000mm", cat: "accesorio", code: "STARTING-CLOSING", price: 7500, unit: "c/u", tk: "siding_r", image: perfilTerminoSiding, images: [perfilTerminoSiding, perfilTerminoSiding, perfilTerminoSiding], desc: "Perfil de inicio y término para muro exterior." },
  { id: 17, name: "Perfil Esquinero Exterior", dims: "50×50×3000mm", cat: "accesorio", code: "OUTSIDE-CORNER", price: 7500, unit: "c/u", tk: "siding_c", image: perfilEsquineroSiding, images: [perfilEsquineroSiding, perfilEsquineroSiding, perfilEsquineroSiding], desc: "Terminación esquinera exterior para siding." },
  { id: 18, name: "Perfil Esquinero Interior", dims: "30×30×3000mm", cat: "accesorio", code: "INSIDE-CORNER", price: 7500, unit: "c/u", tk: "siding_r", image: perfilEsquineroInteriorSiding, images: [perfilEsquineroInteriorSiding, perfilEsquineroInteriorSiding, perfilEsquineroInteriorSiding], desc: "Terminación esquinera interior para siding." },
];

const $$ = (n) => `$${Number(n).toLocaleString("es-CL")}`;
const CATS = ["todos", "muro", "cielo", "exterior", "accesorio"];
const CAT_L = { todos: "Todos", muro: "Muros", cielo: "Cielos", exterior: "Exterior", accesorio: "Accesorios" };

function Thumb({ tk, customImg, w = 120, h = 80 }) {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    ctx.clearRect(0, 0, w, h);
    if (customImg) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, w, h);
      img.src = customImg;
    } else {
      const blob = new Blob([TX[tk] || TX.marble_gray], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => { ctx.drawImage(img, 0, 0, w, h); URL.revokeObjectURL(url); };
      img.src = url;
    }
  }, [tk, customImg, w, h]);
  return <canvas ref={ref} width={w} height={h} style={{ display: "block", width: "100%", height: "100%" }} />;
}

async function applyTexture(photoSrc, tk, zone, customImg = null) {
  const load = (src) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = src; });
  const photo = await load(photoSrc);
  let tex;
  if (customImg) { tex = await load(customImg); }
  else {
    const blob = new Blob([TX[tk] || TX.marble_gray], { type: "image/svg+xml" });
    const tu = URL.createObjectURL(blob);
    tex = await load(tu);
    URL.revokeObjectURL(tu);
  }
  const c = document.createElement("canvas");
  const W = Math.min(photo.naturalWidth, 1000);
  const H = Math.round((photo.naturalHeight * W) / photo.naturalWidth);
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");
  ctx.drawImage(photo, 0, 0, W, H);
  const pc = document.createElement("canvas");
  pc.width = tex.width; pc.height = tex.height;
  pc.getContext("2d").drawImage(tex, 0, 0);
  const pat = ctx.createPattern(pc, "repeat");
  let ry = 0, rh = H;
  if (zone === "muro") { ry = 0; rh = H * 0.78; }
  if (zone === "piso") { ry = H * 0.6; rh = H * 0.4; }
  if (zone === "cielo") { ry = 0; rh = H * 0.2; }
  ctx.save();
  ctx.beginPath(); ctx.rect(0, ry, W, rh); ctx.clip();
  ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = 0.7;
  ctx.fillStyle = pat; ctx.fillRect(0, ry, W, rh);
  ctx.globalCompositeOperation = "screen"; ctx.globalAlpha = 0.07;
  ctx.fillStyle = "#fff"; ctx.fillRect(0, ry, W, rh);
  ctx.restore();
  return c.toDataURL("image/jpeg", 0.93);
}

function EditText({ value, onChange, editing, tag = "span", style = {}, multiline = false, placeholder = "Haz clic para editar" }) {
  const ref = useRef();
  const Tag = tag;
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);
  if (!editing) return <Tag style={style}>{value}</Tag>;
  if (multiline) return <textarea ref={ref} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ ...style, background: "rgba(255,255,200,0.9)", border: "2px solid #F5A623", borderRadius: 4, padding: "4px 8px", resize: "vertical", width: "100%", fontFamily: "inherit", outline: "none", minHeight: 80 }} />;
  return <input ref={ref} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ ...style, background: "rgba(255,255,200,0.9)", border: "2px solid #F5A623", borderRadius: 4, padding: "4px 8px", width: "100%", fontFamily: "inherit", outline: "none" }} />;
}

function Editable({ editing, label, children, style = {}, onClick }) {
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

function ImgUpload({ onImage, children, style = {} }) {
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

// ─── ProductCarousel ──────────────────────────────────────────────────────────
function ProductCarousel({ images, productName }) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const intervalRef = useRef(null);
  const imgs = images && images.length > 0 ? images : [];

  // Auto-rotate cada 1 segundo
  useEffect(() => {
    if (imgs.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % imgs.length);
    }, 1700);
    return () => clearInterval(intervalRef.current);
  }, [imgs.length]);

  // Bloquear scroll del body cuando el lightbox está abierto
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  // Navegación con teclado
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e) => {
      if (e.key === "ArrowRight") setLightboxIdx((i) => (i + 1) % imgs.length);
      if (e.key === "ArrowLeft") setLightboxIdx((i) => (i - 1 + imgs.length) % imgs.length);
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, imgs.length]);

  const openLightbox = (e) => {
    e.stopPropagation();
    setLightboxIdx(current);
    setLightboxOpen(true);
  };

  if (imgs.length === 0) return null;

  // Lightbox renderizado con portal directo al body — nunca queda cortado
  const lightbox = lightboxOpen ? createPortal(
    <div
      onClick={() => setLightboxOpen(false)}
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "rgba(0,0,0,0.93)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "clamp(10px,2vh,20px)",
        padding: "clamp(12px,3vw,32px)",
      }}
    >
      {/* Botón cerrar */}
      <button
        onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
        style={{
          position: "fixed", top: 14, right: 14,
          background: "rgba(255,255,255,0.15)",
          border: "none", color: "white",
          fontSize: "clamp(20px,4vw,28px)",
          cursor: "pointer", width: 44, height: 44,
          borderRadius: "50%", display: "flex",
          alignItems: "center", justifyContent: "center",
          zIndex: 100000, backdropFilter: "blur(4px)",
        }}
      >×</button>

      {/* Nombre producto */}
      <div style={{
        color: "rgba(255,255,255,0.55)", fontSize: "clamp(10px,1.5vw,13px)",
        fontWeight: 600, letterSpacing: 2, textTransform: "uppercase",
        textAlign: "center", maxWidth: "80vw",
      }}>{productName}</div>

      {/* Flecha izquierda */}
      {imgs.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => (i - 1 + imgs.length) % imgs.length); }}
          style={{
            position: "fixed", left: "clamp(6px,2vw,16px)", top: "50%", transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.12)", border: "none", color: "white",
            fontSize: "clamp(22px,4vw,36px)", cursor: "pointer",
            padding: "clamp(6px,1.5vw,12px) clamp(10px,2vw,18px)",
            borderRadius: 10, zIndex: 100000, backdropFilter: "blur(4px)",
          }}
        >‹</button>
      )}

      {/* Imagen principal */}
      <img
        src={imgs[lightboxIdx]}
        alt={`${productName} vista ${lightboxIdx + 1}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "min(90vw, 900px)",
          maxHeight: "clamp(200px, 55vh, 600px)",
          objectFit: "contain",
          borderRadius: "clamp(8px,1.5vw,16px)",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.03)",
          display: "block",
        }}
      />

      {/* Miniaturas */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex", gap: "clamp(8px,1.5vw,14px)",
          flexWrap: "wrap", justifyContent: "center",
          maxWidth: "90vw",
        }}
      >
        {imgs.map((src, i) => (
          <div
            key={i}
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(i); }}
            style={{
              width: "clamp(56px,10vw,80px)",
              height: "clamp(56px,10vw,80px)",
              borderRadius: "clamp(6px,1vw,10px)",
              overflow: "hidden", cursor: "pointer", flexShrink: 0,
              border: `${i === lightboxIdx ? 3 : 1.5}px solid ${i === lightboxIdx ? "white" : "rgba(255,255,255,0.25)"}`,
              opacity: i === lightboxIdx ? 1 : 0.5,
              transition: "all 0.2s",
            }}
          >
            <img src={src} alt={`Vista ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        ))}
      </div>

      {/* Contador */}
      <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "clamp(11px,1.5vw,13px)" }}>
        {lightboxIdx + 1} / {imgs.length}
      </div>

      {/* Flecha derecha */}
      {imgs.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => (i + 1) % imgs.length); }}
          style={{
            position: "fixed", right: "clamp(6px,2vw,16px)", top: "50%", transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.12)", border: "none", color: "white",
            fontSize: "clamp(22px,4vw,36px)", cursor: "pointer",
            padding: "clamp(6px,1.5vw,12px) clamp(10px,2vw,18px)",
            borderRadius: 10, zIndex: 100000, backdropFilter: "blur(4px)",
          }}
        >›</button>
      )}
    </div>,
    document.body
  ) : null;

  return (
    <>
      {/* Carrusel */}
      <div
        onClick={openLightbox}
        style={{ position: "relative", width: "100%", height: "100%", cursor: "zoom-in", overflow: "hidden" }}
      >
        <img
          src={imgs[current]}
          alt={productName}
          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", transition: "opacity 0.35s ease" }}
        />
        {/* Dots */}
        {imgs.length > 1 && (
          <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5, zIndex: 2 }}>
            {imgs.map((_, i) => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: i === current ? "white" : "rgba(255,255,255,0.4)", boxShadow: "0 1px 4px rgba(0,0,0,0.5)", transition: "background 0.2s" }} />
            ))}
          </div>
        )}
        {/* Hint */}
        <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.42)", color: "white", fontSize: 10, padding: "3px 8px", borderRadius: 5, fontWeight: 600, zIndex: 2, pointerEvents: "none" }}>🔍 ver</div>
      </div>

      {/* Portal lightbox — se monta en document.body, nunca queda cortado */}
      {lightbox}
    </>
  );
}

function ProductEditor({ product, onSave, onDelete, onClose }) {
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
            <div style={{ flex: 1, height: 1, background: "#E0D8D0" }} />
            <span style={{ fontSize: 11, color: "#AAA", fontWeight: 600 }}>O elige una textura generada</span>
            <div style={{ flex: 1, height: 1, background: "#E0D8D0" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 5 }}>
            {Object.keys(TX).map((k) => (
              <div key={k} onClick={() => { set("tk", k); set("customImg", null); }} style={{ borderRadius: 6, overflow: "hidden", cursor: "pointer", border: `2px solid ${!p.customImg && p.tk === k ? "#F5A623" : "transparent"}`, height: 44, opacity: p.customImg ? 0.4 : 1, transition: "opacity .15s" }} title={k}>
                <Thumb tk={k} w={80} h={44} />
              </div>
            ))}
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

function VisualizerModal({ prods, onClose, C, $$ }) {
  const w = useW();
  const sm = w < 640;
  const [vizSurface, setVizSurface] = useState("muro");
  const [vizFilterCat, setVizFilterCat] = useState("todos");
  const [vizSelected, setVizSelected] = useState(null);
  const [vizImage, setVizImage] = useState(null);
  const [vizDragging, setVizDragging] = useState(false);
  const [panel, setPanel] = useState("foto");
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState(null);
  const [txt, setTxt] = useState("");

  useEffect(() => { setVizFilterCat("todos"); setVizSelected(null); }, [vizSurface]);

  const vizCats = vizSurface === "muro"
    ? [{ key: "todos", label: "Todos" }, { key: "muro", label: "Muros int." }, { key: "exterior", label: "Muros ext." }]
    : [{ key: "todos", label: "Todos" }, { key: "cielo", label: "Cielos" }];

  const vizFiltered = prods.filter((p) => {
    if (vizSurface === "muro" && !(p.cat === "muro" || p.cat === "exterior")) return false;
    if (vizSurface === "cielo" && p.cat !== "cielo") return false;
    if (vizFilterCat !== "todos" && p.cat !== vizFilterCat) return false;
    return true;
  });

  const selectedVizProduct = vizSelected || vizFiltered[0] || null;

  const handleVizFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setVizImage(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  async function run() {
    const currentMat = selectedVizProduct;
    if (!vizImage || !currentMat) return;
    setBusy(true); setRes(null); setTxt("");
    const OPENAI_KEY = import.meta.env.VITE_OPENAI_KEY;
    try {
      const b64 = vizImage.includes(",") ? vizImage.split(",")[1] : vizImage;
      const descResp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_KEY}` },
        body: JSON.stringify({ model: "gpt-4o", max_tokens: 300, messages: [{ role: "user", content: [{ type: "image_url", image_url: { url: `data:image/jpeg;base64,${b64}` } }, { type: "text", text: "Describe this interior space in detail for an image generation prompt: dimensions, colors, lighting, furniture style, architectural features. Be specific and concise (max 100 words)." }] }] }),
      });
      const descData = await descResp.json();
      const spaceDesc = descData.choices?.[0]?.message?.content || "a modern interior room";
      const zoneEs = vizSurface === "muro" ? "walls" : "ceiling";
      const dallePrompt = `Photorealistic interior design render. The space is: ${spaceDesc}. Apply "${currentMat.name}" (${currentMat.desc}) to the ${zoneEs}. High quality architectural visualization, professional lighting, 4K quality. Keep all furniture and elements the same, only change the ${zoneEs} surface material.`;
      const imgResp = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_KEY}` },
        body: JSON.stringify({ model: "dall-e-3", prompt: dallePrompt, n: 1, size: "1024x1024", quality: "standard" }),
      });
      const imgData = await imgResp.json();
      if (imgData.data?.[0]?.url) { setRes(imgData.data[0].url); setTxt(`✦ Visualización generada con IA — ${currentMat.name} aplicado en el ${vizSurface}.`); }
      else { const fallback = await applyTexture(vizImage, currentMat.tk, vizSurface, currentMat.customImg || null); setRes(fallback); setTxt(imgData.error?.message || "Mostrando simulación de textura."); }
    } catch {
      const fallback = await applyTexture(vizImage, selectedVizProduct?.tk || "marble_gray", vizSurface, selectedVizProduct?.customImg || null);
      setRes(fallback); setTxt("Visítanos en Arturo Prat 1016 o al +56 9 7868 2990 para asesoría personalizada.");
    }
    setBusy(false);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,12,10,0.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: sm ? 0 : 20, backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#FAF8F4", borderRadius: sm ? 0 : 16, width: "100%", maxWidth: 880, height: sm ? "100%" : "90vh", maxHeight: sm ? "100%" : "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #EDE8E0", display: "flex", alignItems: "center", justifyContent: "space-between", background: "white", flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: 16, fontWeight: 700 }}>✦ Visualizador IA</div>
            <div style={{ fontSize: 11, color: "#8A7868", marginTop: 1 }}>Aplica texturas reales en tu espacio</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #E0D8D0", background: "white", cursor: "pointer", fontSize: 20, color: "#8A7868", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        {sm && (
          <div style={{ display: "flex", borderBottom: "2px solid #EDE8E0", flexShrink: 0 }}>
            {[["foto", "📷 Mi espacio"], ["catalogo", "🧱 Materiales"]].map(([id, l]) => (
              <button key={id} onClick={() => setPanel(id)} style={{ flex: 1, padding: "11px 4px", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit", background: panel === id ? "#FAF8F4" : "white", color: panel === id ? "#5A3A1A" : "#8A7868", borderBottom: `2px solid ${panel === id ? "#8B6B4A" : "transparent"}`, marginBottom: -2 }}>{l}</button>
            ))}
          </div>
        )}
        <div style={{ display: "flex", flex: 1, overflow: "hidden", flexDirection: sm ? "column" : "row" }}>
          {(!sm || panel === "foto") && (
            <div style={{ flex: 1, padding: sm ? 16 : 18, borderRight: sm ? "none" : "1px solid #E8E0D4", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[{ key: "muro", label: "Muros", icon: "🧱" }, { key: "cielo", label: "Cielos", icon: "☁️" }].map((item) => {
                  const active = vizSurface === item.key;
                  return <button key={item.key} onClick={() => setVizSurface(item.key)} style={{ height: 46, borderRadius: 12, border: active ? `2px solid ${C.warm}` : "1px solid #D8CEC0", background: active ? "#F6EFE6" : "white", color: C.text, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><span>{item.icon}</span><span>{item.label}</span></button>;
                })}
              </div>
              {selectedVizProduct && (
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", border: "1px solid #E7DDD0", borderRadius: 12, background: "#FCF7F1" }}>
                  <img src={selectedVizProduct.image} alt={selectedVizProduct.name} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 10, border: "1px solid #E7DDD0" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: "#7A6858", marginBottom: 4 }}>Revestimiento seleccionado</div>
                    <div style={{ fontWeight: 700, color: C.text, marginBottom: 2 }}>{selectedVizProduct.name}</div>
                    <div style={{ fontSize: 13, color: C.warmDk }}>{$$(selectedVizProduct.price)} {selectedVizProduct.unit}</div>
                  </div>
                </div>
              )}
              <div onDragOver={(e) => { e.preventDefault(); setVizDragging(true); }} onDragLeave={() => setVizDragging(false)} onDrop={(e) => { e.preventDefault(); setVizDragging(false); handleVizFile(e.dataTransfer.files?.[0]); }} style={{ border: vizDragging ? `2px solid ${C.warm}` : "2px dashed #D8CEC0", background: vizDragging ? "#FCF7F1" : "#F7F3EE", borderRadius: 16, padding: sm ? 18 : 26, minHeight: 160, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                {!vizImage ? (
                  <div>
                    <div style={{ fontSize: 42, marginBottom: 10 }}>🏠</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 6 }}>Arrastra tu foto aquí</div>
                    <div style={{ fontSize: 13, color: "#7A6858", marginBottom: 18 }}>JPG, PNG, WEBP</div>
                    <label style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", borderRadius: 12, background: C.dark, color: "white", fontWeight: 700, cursor: "pointer" }}>📁 Seleccionar<input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleVizFile(e.target.files?.[0])} /></label>
                  </div>
                ) : (
                  <div style={{ width: "100%" }}>
                    <img src={vizImage} alt="Vista cargada" style={{ width: "100%", maxHeight: 300, objectFit: "contain", borderRadius: 14, border: "1px solid #E7DDD0", background: "white" }} />
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 14 }}>
                      <label style={{ padding: "11px 16px", borderRadius: 10, background: C.dark, color: "white", fontWeight: 700, cursor: "pointer" }}>Cambiar foto<input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleVizFile(e.target.files?.[0])} /></label>
                      <button onClick={() => { setVizImage(null); setRes(null); }} style={{ padding: "11px 16px", borderRadius: 10, background: "white", color: C.text, border: "1px solid #D8CEC0", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Quitar foto</button>
                    </div>
                  </div>
                )}
              </div>
              <button disabled={!vizImage || !selectedVizProduct || busy} onClick={run} style={{ padding: "13px", background: (!vizImage || !selectedVizProduct || busy) ? "#E0D8D0" : C.dark, color: (!vizImage || !selectedVizProduct || busy) ? "#A09488" : "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: (!vizImage || !selectedVizProduct || busy) ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                {busy ? "⏳ Procesando..." : !vizImage ? "Sube una foto" : !selectedVizProduct ? "Elige un material" : "✨ Visualizar con IA"}
              </button>
              {busy && !res && (
                <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, background: "#F5F0EA", borderRadius: 10 }}>
                  <div style={{ width: 28, height: 28, border: "3px solid #E0D8D0", borderTopColor: "#8B6B4A", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                  <div><div style={{ fontSize: 13, color: "#8A7868", fontWeight: 600 }}>Generando imagen con IA...</div><div style={{ fontSize: 11, color: "#A09488", marginTop: 3 }}>Puede tomar 15–30 segundos</div></div>
                </div>
              )}
              {res && (
                <>
                  <div style={{ borderRadius: 10, overflow: "hidden", position: "relative", border: "1px solid #E0D8D0" }}>
                    <img src={res} style={{ width: "100%", display: "block" }} alt="Resultado" />
                    <div style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(44,36,32,0.82)", color: "white", fontSize: 10, padding: "4px 10px", borderRadius: 20, fontWeight: 700 }}>✦ {selectedVizProduct?.name}</div>
                  </div>
                  {txt && <div style={{ background: "#F5EDE4", borderLeft: "3px solid #8B6B4A", padding: "12px 14px", borderRadius: "0 8px 8px 0", fontSize: 13, lineHeight: 1.8 }}>{txt}</div>}
                </>
              )}
            </div>
          )}
          {(!sm || panel === "catalogo") && (
            <div style={{ width: sm ? "100%" : 268, borderLeft: sm ? "none" : "1px solid #EDE8E0", background: "white", display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0 }}>
              <div style={{ padding: "10px", borderBottom: "1px solid #EDE8E0", display: "flex", gap: 4, flexWrap: "wrap", flexShrink: 0 }}>
                {vizCats.map((c) => <button key={c.key} onClick={() => setVizFilterCat(c.key)} style={{ padding: "4px 9px", border: `1px solid ${vizFilterCat === c.key ? "#8B6B4A" : "#E0D8D0"}`, borderRadius: 20, fontSize: 10, fontWeight: 700, cursor: "pointer", background: vizFilterCat === c.key ? "#8B6B4A" : "white", color: vizFilterCat === c.key ? "white" : "#8A7868", fontFamily: "inherit" }}>{c.label}</button>)}
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {vizFiltered.length === 0 && <div style={{ textAlign: "center", padding: "40px 16px", color: "#8A7868", fontSize: 13 }}>No hay productos en esta categoría.</div>}
                {vizFiltered.map((p) => {
                  const selected = vizSelected?.id === p.id;
                  return (
                    <div key={p.id} onClick={() => { setVizSelected(p); if (sm) setPanel("foto"); }} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 10px", borderRadius: 8, border: `2px solid ${selected ? "#8B6B4A" : "transparent"}`, background: selected ? "#FDF5EE" : "white", cursor: "pointer", transition: "all .15s" }}
                      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = "#FAF7F4"; }}
                      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = "white"; }}>
                      <div style={{ width: 44, height: 44, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}><Thumb tk={p.tk} customImg={p.customImg || null} w={44} h={44} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                        <div style={{ fontSize: 10, color: "#8A7868" }}>{p.code}</div>
                        <div style={{ fontSize: 11, fontWeight: 800, color: "#7A5B3A" }}>{$$(p.price)}</div>
                      </div>
                      {selected && <div style={{ width: 18, height: 18, background: "#8B6B4A", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "white", fontWeight: 800, flexShrink: 0 }}>✓</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const w = useW();
  const sm = w < 640;
  const md = w < 900;

  const ADMIN_PASS = "Casaestudio1016%CMCF";
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

  const DEFAULT_CONTENT = {
    brandName: "Casa-Estudio", brandNum: "1016", brandSub: "Revestimientos · Santa Bárbara",
    promoText: "⭐ Precios de Inauguración — Válidos hasta el 31 de Abril 2026",
    heroTag: "Importadora & Comercializadora", heroTitle1: "Revestimientos", heroTitle2: "de alto estándar", heroTitle3: "para tu espacio",
    heroSubtitle: "Arquitectura, diseño e importación de materiales decorativos. Santa Bárbara — atendemos todo Chile.",
    heroBtnPrimary: "Ver Catálogo", heroBtnSecondary: "Cotizar", heroImage: heroImg,
    stat1n: "14+", stat1l: "Productos", stat2n: "Alta densidad", stat2l: "Materiales", stat3n: "Inauguración", stat3l: "Precios 2026", stat4n: "Santa Bárbara", stat4l: "Todo Chile",
    aboutTag: "Quiénes somos", aboutTitle1: "Arquitectura", aboutTitle2: "& Diseño",
    aboutBody1: "Casa-Estudio 1016 es una importadora y comercializadora de materiales decorativos de construcción, con foco en revestimientos de alto estándar.",
    aboutBody2: "Ofrecemos servicio en arquitectura y diseño para proyectos residenciales y comerciales, con productos que combinan durabilidad, estética y precio accesible.",
    aboutImg1: about1, aboutImg2: about2, aboutImg3: about3, aboutImg4: about4,
    svcTitle: "Servicios especializados",
    svc1icon: "🏛️", svc1title: "Arquitectura & Diseño", svc1desc: "Asesoría profesional para proyectos residenciales y comerciales.",
    svc2icon: "📦", svc2title: "Importación Directa", svc2desc: "Materiales de alta calidad desde el fabricante, sin intermediarios.",
    svc3icon: "🛠️", svc3title: "Asesoría Técnica", svc3desc: "Te guiamos en la elección correcta según el ambiente y presupuesto.",
    svc4icon: "🚚", svc4title: "Despacho Nacional", svc4desc: "Enviamos a cualquier región del país.",
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

      {/* NAV */}
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
              {["inicio", "catalogo", "servicios", "contacto"].map((id) => (
                <button key={id} onClick={() => scrollTo(id)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 500, color: C.mid, textTransform: "capitalize", letterSpacing: 0.5 }}>{id.charAt(0).toUpperCase() + id.slice(1)}</button>
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
            {!sm && <button onClick={() => setVizOpen(true)} style={{ background: C.dark, color: "white", border: "none", borderRadius: 6, padding: "8px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.5, textTransform: "uppercase" }}>✦ Visualizador</button>}
            <button onClick={() => setCartOpen(true)} style={{ position: "relative", background: "none", border: "1px solid #E8E0D4", borderRadius: 6, padding: "7px 12px", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, color: C.text }}>
              🛒
              {cartCount > 0 && <span style={{ position: "absolute", top: -6, right: -6, minWidth: 18, height: 18, background: C.warm, borderRadius: "50%", fontSize: 10, color: "white", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>{cartCount}</span>}
            </button>
            {md && <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "1px solid #E8E0D4", borderRadius: 6, padding: "7px 11px", cursor: "pointer", fontSize: 16, color: C.text }}>{menuOpen ? "×" : "☰"}</button>}
          </div>
        </nav>
        {md && menuOpen && (
          <div style={{ background: "white", borderBottom: "1px solid #E8E0D4", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
            {["inicio", "catalogo", "servicios", "contacto"].map((id) => (
              <button key={id} onClick={() => scrollTo(id)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 500, color: C.mid, padding: "8px 0", textAlign: "left", textTransform: "capitalize" }}>{id.charAt(0).toUpperCase() + id.slice(1)}</button>
            ))}
            <button onClick={() => { setVizOpen(true); setMenuOpen(false); }} style={{ background: C.dark, color: "white", border: "none", borderRadius: 6, padding: "10px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginTop: 8 }}>✦ Visualizador IA</button>
          </div>
        )}
      </div>
      <div style={{ height: 94 }} />

      {/* HERO */}
      <section id="inicio" style={{ minHeight: sm ? "85vh" : "92vh", background: "#2A2A2A", position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: `0 0 ${sm ? 52 : 80}px` }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {content.heroImage && <img src={content.heroImage} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }} />}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(40,40,40,0.05) 0%,rgba(40,40,40,0.45) 50%,rgba(30,30,30,0.82) 100%)" }} />
        </div>
        {editMode && <label style={{ position: "absolute", top: 16, right: 16, zIndex: 10, background: "#F5A623", color: "white", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>📷 {content.heroImage ? "Cambiar fondo" : "Agregar imagen"}<input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = (ev) => set("heroImage", ev.target.result); r.readAsDataURL(f); }} /></label>}
        {editMode && content.heroImage && <button onClick={() => set("heroImage", null)} style={{ position: "absolute", top: 16, right: sm ? 16 : 220, zIndex: 10, background: "#FEE2E2", color: "#C45A5A", border: "none", padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>🗑 Quitar imagen</button>}
        <div style={{ position: "relative", maxWidth: 1400, width: "100%", margin: "0 auto", padding: `0 ${sm ? 20 : 32}px`, animation: "fadeUp .8s ease both" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(244,128,109,0.15)", border: "1px solid rgba(244,128,109,0.35)", borderRadius: 20, padding: "5px 14px", marginBottom: sm ? 20 : 28 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#F4806D" }} />
            <span style={{ fontSize: 10, color: "#F4806D", letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>{E("heroTag", "Etiqueta hero", <span>{content.heroTag}</span>)}</span>
          </div>
          <h1 style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: sm ? "clamp(32px,9vw,48px)" : "clamp(40px,6vw,76px)", fontWeight: 400, color: "white", lineHeight: 1.1, marginBottom: sm ? 16 : 20, maxWidth: 700 }}>
            {E("heroTitle1", "Título línea 1", <span>{content.heroTitle1}</span>)}<br />
            <em style={{ color: "#F4806D", fontStyle: "italic" }}>{E("heroTitle2", "Título línea 2", <span>{content.heroTitle2}</span>)}</em><br />
            {E("heroTitle3", "Título línea 3", <span>{content.heroTitle3}</span>)}
          </h1>
          <p style={{ fontSize: sm ? 13 : 15, color: "rgba(255,255,255,0.5)", maxWidth: 460, lineHeight: 1.8, marginBottom: sm ? 28 : 36, fontWeight: 300 }}>{E("heroSubtitle", "Subtítulo hero", <span>{content.heroSubtitle}</span>, true)}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => scrollTo("catalogo")} style={{ background: "white", color: C.text, border: "none", borderRadius: 8, padding: sm ? "13px 22px" : "15px 32px", fontSize: sm ? 13 : 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{E("heroBtnPrimary", "Botón primario", <span>{content.heroBtnPrimary}</span>)}</button>
            <button onClick={() => scrollTo("contacto")} style={{ background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: sm ? "13px 22px" : "15px 32px", fontSize: sm ? 13 : 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>{E("heroBtnSecondary", "Botón secundario", <span>{content.heroBtnSecondary}</span>)}</button>
          </div>
        </div>
        {!sm && (
          <div style={{ position: "relative", maxWidth: 1400, width: "100%", margin: "52px auto 0", padding: "0 32px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 36 }}>
            {[["stat1n", "stat1l"], ["stat2n", "stat2l"], ["stat3n", "stat3l"], ["stat4n", "stat4l"]].map(([nk, lk], i) => (
              <div key={i} style={{ paddingRight: 24, borderRight: i < 3 ? "1px solid rgba(255,255,255,0.12)" : "none", paddingLeft: i > 0 ? 24 : 0 }}>
                <div style={{ fontFamily: "'HWYGothic',sans-serif", fontSize: 20, fontWeight: 800, color: "white", marginBottom: 3 }}>{E(nk, `Stat ${i + 1}`, <span>{content[nk]}</span>)}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{E(lk, `Stat ${i + 1} label`, <span>{content[lk]}</span>)}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ABOUT */}
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
            {["aboutImg1", "aboutImg2", "aboutImg3", "aboutImg4"].map((key, i) => (
              <div key={i} style={{ borderRadius: 10, overflow: "hidden", aspectRatio: "1", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                {editMode ? (
                  <ImgUpload onImage={(v) => set(key, v)} style={{ width: "100%", height: "100%", borderRadius: 10 }}>
                    {content[key] ? <img src={content[key]} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : <div style={{ width: "100%", height: "100%", background: "#F0EBE4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, minHeight: 100 }}>📷</div>}
                  </ImgUpload>
                ) : content[key] ? <img src={content[key]} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : <Thumb tk={["marble_gray", "wood_roble", "marble_black", "ceiling_pino"][i]} w={200} h={200} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATALOG */}
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

                    {/* ── IMAGEN con carrusel ── */}
                    <div style={{ background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", minHeight: sm ? 220 : 320, borderBottom: sm ? "1px solid #F0EAE2" : "none", borderRight: sm ? "none" : "1px solid #F0EAE2", position: "relative", overflow: "hidden" }}>
                      {carouselImgs.length > 0 ? (
                        <div style={{ width: "100%", height: sm ? 220 : 320, position: "relative" }}>
                          <ProductCarousel images={carouselImgs} productName={p.name} />
                        </div>
                      ) : (
                        <div style={{ width: "100%", height: sm ? 220 : 260 }}>
                          <Thumb tk={p.tk} customImg={p.customImg || null} w={420} h={260} />
                        </div>
                      )}
                    </div>

                    {/* INFO */}
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
                        <button onClick={() => setVizOpen(true)} style={{ flex: 1, minWidth: 160, background: C.dark, color: "white", border: "none", borderRadius: 10, padding: "11px 8px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>👁 Visualizar</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES */}
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

      {/* CTA */}
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

      {/* CONTACT */}
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

      {/* FOOTER */}
      <footer style={{ background: C.dark, padding: `${sm ? 20 : 28}px ${sm ? 16 : 32}px`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: 15, color: "white", fontWeight: 600, marginBottom: 3 }}>{E("brandName", "Nombre marca", <span>{content.brandName}</span>)} <span style={{ color: "#C4B49A" }}>{E("brandNum", "Número", <span>{content.brandNum}</span>)}</span></div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", letterSpacing: 0.5 }}>{E("contactAddr", "Dirección", <span>{content.contactAddr}</span>)} · {E("contactPhone", "Teléfono", <span>{content.contactPhone}</span>)}</div>
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.22)" }}>© 2025 {content.brandName} {content.brandNum}</div>
      </footer>

      {/* CART DRAWER */}
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

      {vizOpen && <VisualizerModal prods={prods} onClose={() => setVizOpen(false)} C={C} $$={$$} />}
      {quoteOpen && <QuotationModal cart={cart} total={total} content={content} $$={$$} onClose={() => setQuoteOpen(false)} />}
      {productEditor && <ProductEditor product={productEditor} onSave={saveProds} onDelete={deleteProds} onClose={() => setProductEditor(null)} />}
      {flujoCajaOpen && <FlujoCaja onClose={() => setFlujoCajaOpen(false)} />}
      {editMode && <EditBar />}

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
