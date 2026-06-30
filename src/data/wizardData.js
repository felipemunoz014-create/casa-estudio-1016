export const WZ_TIPOS = [
  { id: "cabaña_1p",  label: "Cabaña 1 piso",        icon: "🏕️" },
  { id: "cabaña_2p",  label: "Cabaña 2 pisos",        icon: "🏔️" },
  { id: "cabaña_mod", label: "Cabaña modular",         icon: "📦" },
  { id: "refugio",    label: "Refugio / Tiny house",   icon: "🌲" },
  { id: "quincho",    label: "Quincho + cabaña",       icon: "🔥" },
  { id: "conjunto",   label: "Conjunto de cabañas",    icon: "🏘️" },
];

export const WZ_TERRENO = [
  { id: "si",      label: "Sí, tengo terreno" },
  { id: "no",      label: "No tengo aún" },
  { id: "proceso", label: "En proceso" },
];

export const WZ_AGUA = [
  { id: "ap_red",   label: "Red de agua potable", icon: "🚰", desc: "Conectado a red pública" },
  { id: "ap_pozo",  label: "Pozo propio",          icon: "💧", desc: "Pozo o noria en el terreno" },
  { id: "ap_rural", label: "APR / Rural",           icon: "🌊", desc: "Agua potable rural (APR)" },
  { id: "ap_nd",    label: "No determinado",        icon: "❓", desc: "Aún no se ha definido" },
];

export const WZ_ALCANTARILLADO = [
  { id: "alc_red",    label: "Red de alcantarillado", icon: "🏙️", desc: "Conectado a red pública" },
  { id: "alc_fosa",   label: "Fosa séptica",           icon: "🪣",  desc: "Fosa tradicional" },
  { id: "alc_planta", label: "Planta de tratamiento",  icon: "♻️",  desc: "Sistema de tratamiento" },
  { id: "alc_nd",     label: "No determinado",          icon: "❓",  desc: "Aún no se ha definido" },
];

export const WZ_PRESUPUESTO = [
  { id: "bajo",      label: "Bajo",      sub: "Hasta $20M" },
  { id: "medio",     label: "Medio",     sub: "$20M – $60M" },
  { id: "alto",      label: "Alto",      sub: "$60M+" },
  { id: "a_definir", label: "A definir", sub: "Aún no lo sé" },
];

export const WZ_PROGRAMA = [
  { id: "d1", label: "1 Dormitorio",       icon: "🛏", group: "dorm" },
  { id: "d2", label: "2 Dormitorios",      icon: "🛏", group: "dorm" },
  { id: "d3", label: "3 Dormitorios",      icon: "🛏", group: "dorm" },
  { id: "d4", label: "4+ Dormitorios",     icon: "🛏", group: "dorm" },
  { id: "b1", label: "1 Baño",             icon: "🚿", group: "baño" },
  { id: "b2", label: "2 Baños",            icon: "🚿", group: "baño" },
  { id: "b3", label: "3+ Baños",           icon: "🚿", group: "baño" },
  { id: "co", label: "Cocina integrada",   icon: "🍳", group: "extra" },
  { id: "lv", label: "Living / Comedor",   icon: "🛋", group: "extra" },
  { id: "te", label: "Terraza",            icon: "☀️", group: "extra" },
  { id: "bo", label: "Bodega",             icon: "📦", group: "extra" },
  { id: "es", label: "Estacionamiento",    icon: "🚗", group: "extra" },
  { id: "2p", label: "Segundo piso",       icon: "⬆️", group: "extra" },
  { id: "qu", label: "Espacio quincho",    icon: "🔥", group: "extra" },
  { id: "rd", label: "Revestimiento deco.",icon: "🪨", group: "extra" },
];

export const WZ_ESTILOS = [
  { id: "moderno",      label: "Moderno",         icon: "◻️" },
  { id: "bosque",       label: "Bosque / Natural", icon: "🌲" },
  { id: "minimalista",  label: "Minimalista",      icon: "⬜" },
  { id: "industrial",   label: "Industrial",       icon: "⚙️" },
  { id: "mediterraneo", label: "Mediterráneo",     icon: "🌞" },
  { id: "premium",      label: "Premium",          icon: "✦"  },
  { id: "rustico",      label: "Rústico Moderno",  icon: "🪵" },
  { id: "clasico",      label: "Clásico",          icon: "🏛️" },
];

export const WZ_MAT_PISO = [
  { id: "piso_radier",   label: "Radier" },
  { id: "piso_recub",    label: "Recubrimiento piso" },
  { id: "piso_flotante", label: "Piso flotante" },
  { id: "piso_porcel",   label: "Porcelanato" },
  { id: "piso_ceramica", label: "Cerámica" },
  { id: "piso_otro",     label: "Otro" },
];

export const WZ_MAT_REV_EXT = [
  { id: "ext_siding", label: "Siding metálico imitación madera" },
  { id: "ext_zinc",   label: "Zinc 5V" },
  { id: "ext_fibro",  label: "Fibrocemento" },
  { id: "ext_otro",   label: "Otro" },
];

export const WZ_MAT_TABIQUE = [
  { id: "tab_madera", label: "Madera" },
  { id: "tab_metal",  label: "Metalcom" },
  { id: "tab_ladr",   label: "Ladrillo" },
  { id: "tab_estmet", label: "Estructura metálica" },
];

export const WZ_MAT_AISLACION = [
  { id: "ais_fibra", label: "Fibra de vidrio" },
  { id: "ais_poli",  label: "Poliestireno" },
  { id: "ais_otro",  label: "Otro" },
];

export const WZ_MAT_INT_LIVING  = [{ id: "int_liv_wpc", label: "WPC" }, { id: "int_liv_pvc", label: "PVC UV" }, { id: "int_liv_otro", label: "Otro" }];
export const WZ_MAT_INT_COCINA  = [{ id: "int_coc_pvc", label: "PVC UV" }, { id: "int_coc_fibro", label: "Fibrocemento" }, { id: "int_coc_otro", label: "Otro" }];
export const WZ_MAT_INT_DORM    = [{ id: "int_dor_yeso", label: "Yeso cartón" }, { id: "int_dor_wpc", label: "WPC" }, { id: "int_dor_otro", label: "Otro" }];
export const WZ_MAT_INT_BANO    = [{ id: "int_ban_fibro", label: "Fibrocemento" }, { id: "int_ban_pvc", label: "PVC UV" }, { id: "int_ban_otro", label: "Otro" }];

export const WZ_MATS_INIT = {
  piso: "", revestimientoExterior: "", tabique: "", aislacion: "",
  intLiving: "", intCocina: "", intDormitorio: "", intBano: "",
};

export const WZ_INIT = {
  tipo: "", nombre: "", ubicacion: "", terreno: "",
  superficie: "", presupuesto: "",
  agua: "", alcantarillado: "",
  programa: [], estilo: "",
  materiales: [],
  mats: { ...WZ_MATS_INIT },
};

import casaBasica from "../assets/CasaBasica.JPG";
import inicio1 from "../assets/Inicio1.jpeg";
import inicio2 from "../assets/Inicio2.jpeg";
import inicio3 from "../assets/Inicio3.jpeg";
import inicio5 from "../assets/Inicio5.png";
import casaTiomoncho from "../assets/CasaTiomoncho.jpg";
import heroVideo from "../assets/HeroVideo.mp4";
import modeloAVideo from "../assets/ModeloA.mp4";
import modeloCVideo from "../assets/ModeloC.mp4";

export const MODELOS_CABANAS = [
  {
    id: 1,
    nombre: "Modelo A",
    precioDesde: "desde 8 UF/m²",
    tag: "Entrada",
    tagColor: "#6B9A5E",
    nivel: "Terminaciones esenciales",
    puntos: ["Estructura y envolvente completa", "Revestimientos de entrada", "Funcional y lista para habitar"],
    cta: "Quiero cotizar Modelo A →",
    media: [
      { type: "image", src: casaBasica },
      { type: "video", src: modeloAVideo },
    ],
  },
  {
    id: 2,
    nombre: "Modelo B",
    precioDesde: "desde 12 UF/m²",
    tag: "Intermedio",
    tagColor: "#C8982A",
    nivel: "Terminaciones de mayor calidad",
    puntos: ["Materiales de línea media-alta", "Mejor aislación térmica y acústica", "Diseño más cuidado y personalizable"],
    cta: "Quiero cotizar Modelo B →",
    media: [
      { type: "image", src: inicio1 },
      { type: "video", src: heroVideo },
    ],
  },
  {
    id: 3,
    nombre: "Modelo C",
    precioDesde: "desde 18 UF/m²",
    tag: "Premium",
    tagColor: "#8A4A2A",
    nivel: "Alto estándar · Arquitectura de autor",
    puntos: ["Materialidades premium seleccionadas", "Diseño arquitectónico personalizado", "Calidad de construcción superior"],
    cta: "Quiero cotizar Modelo C →",
    media: [
      { type: "image", src: casaTiomoncho },
      { type: "video", src: modeloCVideo },
    ],
  },
];

export function wzLabel(id, arr) {
  return arr.find((x) => x.id === id)?.label ?? id;
}

export function matLabel(id, arr) {
  if (!id) return "";
  return arr.find((x) => x.id === id)?.label ?? id;
}

export function buildMatsText(m) {
  if (!m || typeof m !== "object") return "No especificado";
  const MAP = {
    piso: WZ_MAT_PISO, revestimientoExterior: WZ_MAT_REV_EXT,
    tabique: WZ_MAT_TABIQUE, aislacion: WZ_MAT_AISLACION,
    intLiving: WZ_MAT_INT_LIVING, intCocina: WZ_MAT_INT_COCINA,
    intDormitorio: WZ_MAT_INT_DORM, intBano: WZ_MAT_INT_BANO,
  };
  const LABELS = {
    piso: "Piso", revestimientoExterior: "Rev. Exterior",
    tabique: "Tabique/Estructura", aislacion: "Aislación",
    intLiving: "Int. Living", intCocina: "Int. Cocina",
    intDormitorio: "Int. Dormitorio", intBano: "Int. Baño",
  };
  const entries = Object.entries(LABELS)
    .map(([key, label]) => [label, matLabel(m[key], MAP[key])])
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`);
  return entries.length ? entries.join(" · ") : "No especificado";
}

export function getMLabel(id, key) {
  const MAP = {
    piso: WZ_MAT_PISO, revestimientoExterior: WZ_MAT_REV_EXT,
    tabique: WZ_MAT_TABIQUE, aislacion: WZ_MAT_AISLACION,
    intLiving: WZ_MAT_INT_LIVING, intCocina: WZ_MAT_INT_COCINA,
    intDormitorio: WZ_MAT_INT_DORM, intBano: WZ_MAT_INT_BANO,
  };
  return MAP[key] ? matLabel(id, MAP[key]) : id;
}

export function buildWizardWA(d, waNumber) {
  const prog = d.programa.map((id) => wzLabel(id, WZ_PROGRAMA)).join(", ") || "No especificado";
  const mats = buildMatsText(d.mats);
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hola, soy ${d.nombre || "un cliente"}. Quiero cotizar una cabaña en Casa Estudio 1016.\n\n` +
    `Tipo de cabaña:\n${wzLabel(d.tipo, WZ_TIPOS)}\n\n` +
    `Ubicación:\n${d.ubicacion || "No indicada"}\n\n` +
    `¿Tiene terreno?: ${wzLabel(d.terreno, WZ_TERRENO)}\n\n` +
    `Superficie aproximada:\n${d.superficie || "No indicada"} m²\n\n` +
    `Agua potable:\n${wzLabel(d.agua, WZ_AGUA)}\n\n` +
    `Aguas servidas:\n${wzLabel(d.alcantarillado, WZ_ALCANTARILLADO)}\n\n` +
    `Programa:\n${prog}\n\n` +
    `Estilo:\n${wzLabel(d.estilo, WZ_ESTILOS)}\n\n` +
    `Materialidades:\n${mats}\n\n` +
    `Presupuesto estimado:\n${wzLabel(d.presupuesto, WZ_PRESUPUESTO)}\n\n` +
    `Quedo atento a orientación y cotización. ¡Gracias!`
  )}`;
}

export function getCotNum() {
  const stored = parseInt(localStorage.getItem("ce1016_cab_cot") || "1010", 10);
  const next = stored + 1;
  localStorage.setItem("ce1016_cab_cot", String(next));
  return `COT-${next}`;
}
