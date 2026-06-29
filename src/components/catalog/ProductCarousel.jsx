import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export function ProductCarousel({ images, productName }) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const intervalRef = useRef(null);
  const imgs = images && images.length > 0 ? images : [];

  useEffect(() => {
    if (imgs.length <= 1) return;
    intervalRef.current = setInterval(() => { setCurrent((c) => (c + 1) % imgs.length); }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [imgs.length]);

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

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

  const openLightbox = (e) => { e.stopPropagation(); setLightboxIdx(current); setLightboxOpen(true); };

  if (imgs.length === 0) return null;

  const lightbox = lightboxOpen ? createPortal(
    <div onClick={() => setLightboxOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.93)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "clamp(10px,2vh,20px)", padding: "clamp(12px,3vw,32px)" }}>
      <button onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }} style={{ position: "fixed", top: 14, right: 14, background: "rgba(255,255,255,0.15)", border: "none", color: "white", fontSize: "clamp(20px,4vw,28px)", cursor: "pointer", width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100000, backdropFilter: "blur(4px)" }}>×</button>
      <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "clamp(10px,1.5vw,13px)", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", textAlign: "center", maxWidth: "80vw" }}>{productName}</div>
      {imgs.length > 1 && (<button onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => (i - 1 + imgs.length) % imgs.length); }} style={{ position: "fixed", left: "clamp(6px,2vw,16px)", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.12)", border: "none", color: "white", fontSize: "clamp(22px,4vw,36px)", cursor: "pointer", padding: "clamp(6px,1.5vw,12px) clamp(10px,2vw,18px)", borderRadius: 10, zIndex: 100000, backdropFilter: "blur(4px)" }}>‹</button>)}
      <img src={imgs[lightboxIdx]} alt={`${productName} vista ${lightboxIdx + 1}`} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "min(90vw, 900px)", maxHeight: "clamp(200px, 55vh, 600px)", objectFit: "contain", borderRadius: "clamp(8px,1.5vw,16px)", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", display: "block" }} />
      <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", gap: "clamp(8px,1.5vw,14px)", flexWrap: "wrap", justifyContent: "center", maxWidth: "90vw" }}>
        {imgs.map((src, i) => (<div key={i} onClick={(e) => { e.stopPropagation(); setLightboxIdx(i); }} style={{ width: "clamp(56px,10vw,80px)", height: "clamp(56px,10vw,80px)", borderRadius: "clamp(6px,1vw,10px)", overflow: "hidden", cursor: "pointer", flexShrink: 0, border: `${i === lightboxIdx ? 3 : 1.5}px solid ${i === lightboxIdx ? "white" : "rgba(255,255,255,0.25)"}`, opacity: i === lightboxIdx ? 1 : 0.5, transition: "all 0.2s" }}><img src={src} alt={`Vista ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></div>))}
      </div>
      <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "clamp(11px,1.5vw,13px)" }}>{lightboxIdx + 1} / {imgs.length}</div>
      {imgs.length > 1 && (<button onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => (i + 1) % imgs.length); }} style={{ position: "fixed", right: "clamp(6px,2vw,16px)", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.12)", border: "none", color: "white", fontSize: "clamp(22px,4vw,36px)", cursor: "pointer", padding: "clamp(6px,1.5vw,12px) clamp(10px,2vw,18px)", borderRadius: 10, zIndex: 100000, backdropFilter: "blur(4px)" }}>›</button>)}
    </div>,
    document.body
  ) : null;

  return (
    <>
      <div onClick={openLightbox} style={{ position: "relative", width: "100%", height: "100%", cursor: "zoom-in", overflow: "hidden" }}>
        <img src={imgs[current]} alt={productName} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", transition: "opacity 0.35s ease" }} />
        {imgs.length > 1 && (<div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5, zIndex: 2 }}>{imgs.map((_, i) => (<div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: i === current ? "white" : "rgba(255,255,255,0.4)", boxShadow: "0 1px 4px rgba(0,0,0,0.5)", transition: "background 0.2s" }} />))}</div>)}
        <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.42)", color: "white", fontSize: 10, padding: "3px 8px", borderRadius: 5, fontWeight: 600, zIndex: 2, pointerEvents: "none" }}>🔍 ver</div>
      </div>
      {lightbox}
    </>
  );
}
