import marmolBlanco from "../assets/Marmol blanco.png";
import marmolGris from "../assets/Marmol Gris.png";
import marmolNegro from "../assets/Marmol Negro.png";
import wallCaoba from "../assets/Wall panel Caoba.png";
import wallMarmol from "../assets/wall-panel-marmol.png";
import wallRoble from "../assets/wall-panel-roble.png";
import cieloPvcPino from "../assets/cielo pvc pino.png";
import cieloPvcPinoTextura from "../assets/cielo pvc pino textura.png";
import cieloPvcPinoliving from "../assets/cielo pvc pino living.png";
import sidingMetalCastano from "../assets/siding metal castaño.png";
import sidingMetalCedro from "../assets/siding metal cedro.png";
import clipsWallPanel from "../assets/Clips wall panel.jpg";
import perfilPvcH from "../assets/Perfil PVC H.jpg";
import perfilPvcCornisa from "../assets/Perfil PVC CORNISA.jpg";
import perfilHSiding from "../assets/Perfil H siding.jpg";
import perfilTerminoSiding from "../assets/perfil termino siding.jpg";
import perfilEsquineroSiding from "../assets/perfil esquinero siding.jpg";
import perfilEsquineroInteriorSiding from "../assets/perfil esquinero interior siding.jpg";
import perfilWInteriorPvcUv from "../assets/perfil W interior PVC UV.jpg";
import perfilHPvcUv from "../assets/perfil-h-pvc-uv.jpg";
import wallCaobaLiving from "../assets/Wall-panel-Caoba-living.png";
import wallCaobaTextura from "../assets/Wall-panel-Caoba-textura.png";
import wallMarmolTextura from "../assets/wpmt.png";
import wallMarmolLiving from "../assets/wpml.png";
import wallRobleTextura from "../assets/wall-panel-roble-textura.png";
import wallRoblelLiving from "../assets/wall-panel-roble-living.png";
import sidingMetalCedroTextura from "../assets/siding metal cedro textura.png";
import sidingMetalCedroExterior from "../assets/siding metal cedro exterior.png";
import sidingMetalCastanoTextura from "../assets/siding metal castaño textura.png";
import sidingMetalCastanoExterior from "../assets/siding metal castaño exterior.png";
import marmolBlancoMedida from "../assets/PvcUVmarmol.png";
import marmolGrisMedida from "../assets/PvcUVgris.png";
import marmolNegroMedida from "../assets/PvcUVnegro.png";

export const $$ = (n) => `$${Number(n).toLocaleString("es-CL")}`;

export const CATS = ["todos", "muro", "cielo", "exterior", "accesorio"];
export const CAT_L = { todos: "Todos", muro: "Muros", cielo: "Cielos", exterior: "Exterior", accesorio: "Accesorios" };

export const DEFAULT_PRODS = [
  { id: 1, name: "PVC Mármol Gris", dims: "122×244cm", cat: "muro", code: "KL8235", price: 18700, unit: "c/u", tk: "marble_gray", image: marmolGris, images: [marmolGris, marmolGrisMedida, marmolGris], desc: "Elegancia mineral con venas sutiles." },
  { id: 2, name: "PVC Mármol Blanco", dims: "122×244cm", cat: "muro", code: "KL8263", price: 18700, unit: "c/u", tk: "marble_white", image: marmolBlanco, images: [marmolBlanco, marmolBlancoMedida, marmolBlanco], desc: "Pureza y luminosidad. Amplía cualquier espacio." },
  { id: 3, name: "PVC Mármol Negro", dims: "122×244cm", cat: "muro", code: "KL8264", price: 18700, unit: "c/u", tk: "marble_black", image: marmolNegro, images: [marmolNegro, marmolNegroMedida, marmolNegro], desc: "Sofisticación absoluta. Contraste dramático." },
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
