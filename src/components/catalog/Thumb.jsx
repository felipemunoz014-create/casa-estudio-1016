import { useRef, useEffect } from "react";
import { TX } from "../../utils/textures";

export function Thumb({ tk, customImg, w = 120, h = 80 }) {
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

export async function applyTexture(photoSrc, tk, zone, customImg = null) {
  const load = (src) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = src; });
  const photo = await load(photoSrc);
  let tex;
  if (customImg) {
    tex = await load(customImg);
  } else {
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
