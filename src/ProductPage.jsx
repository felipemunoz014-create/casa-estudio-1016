import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

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
import marmolBlancoMedida from "./assets/PvcUVmarmol.png";
import marmolGrisMedida from "./assets/PvcUVgris.png";
import marmolNegroMedida from "./assets/PvcUVnegro.png";

const FICHAS = {
  "pvc-marmol-gris": {
    nombre: "PVC Mármol Gris", slug: "pvc-marmol-gris", codigo: "KL8235", precio: 18700, unidad: "c/u", dims: "122×244cm", categoria: "Muros",
    descripcion: "Panel decorativo de PVC con acabado mármol gris, diseñado para revestir muros interiores con elegancia mineral. Sus venas sutiles aportan profundidad y sofisticación a cualquier espacio residencial o comercial.",
    images: [marmolGris, marmolGrisMedida, marmolGris],
    propiedades: [
      { label: "Material", valor: "PVC rígido UV" }, { label: "Dimensiones", valor: "122 × 244 cm" },
      { label: "Espesor", valor: "3 mm" }, { label: "Peso", valor: "~4,2 kg/unidad" },
      { label: "Cobertura", valor: "2,97 m² por unidad" }, { label: "Acabado", valor: "Alto brillo marmolado" },
      { label: "Resistencia UV", valor: "Sí" }, { label: "Resistencia humedad", valor: "Alta" },
    ],
    usos: ["Living y comedor", "Dormitorios", "Baños y cocinas", "Locales comerciales", "Recintos de alta humedad"],
    instalacion: "Instalación con adhesivo de contacto o sistema de clips ocultos. No requiere herramientas especializadas. Compatible con superficies de madera, hormigón y metalcom.",
    accesorios: ["Perfil H Aluminio (KOD: SILVER-H-JOINT)", "Perfil Interior Aluminio (KOD: SILVER-INSIDE)"],
  },
  "pvc-marmol-blanco": {
    nombre: "PVC Mármol Blanco", slug: "pvc-marmol-blanco", codigo: "KL8263", precio: 18700, unidad: "c/u", dims: "122×244cm", categoria: "Muros",
    descripcion: "Panel de PVC con textura mármol blanco puro. Ideal para ampliar visualmente cualquier espacio, aportando luminosidad y sensación de amplitud. Perfecto para ambientes modernos y minimalistas.",
    images: [marmolBlanco, marmolBlancoMedida, marmolBlanco],
    propiedades: [
      { label: "Material", valor: "PVC rígido UV" }, { label: "Dimensiones", valor: "122 × 244 cm" },
      { label: "Espesor", valor: "3 mm" }, { label: "Peso", valor: "~4,2 kg/unidad" },
      { label: "Cobertura", valor: "2,97 m² por unidad" }, { label: "Acabado", valor: "Alto brillo marmolado blanco" },
      { label: "Resistencia UV", valor: "Sí" }, { label: "Resistencia humedad", valor: "Alta" },
    ],
    usos: ["Living y comedor", "Dormitorios", "Baños y cocinas", "Locales comerciales", "Recintos de alta humedad"],
    instalacion: "Instalación con adhesivo de contacto o sistema de clips ocultos. No requiere herramientas especializadas.",
    accesorios: ["Perfil H Aluminio (KOD: SILVER-H-JOINT)", "Perfil Interior Aluminio (KOD: SILVER-INSIDE)"],
  },
  "pvc-marmol-negro": {
    nombre: "PVC Mármol Negro", slug: "pvc-marmol-negro", codigo: "KL8264", precio: 18700, unidad: "c/u", dims: "122×244cm", categoria: "Muros",
    descripcion: "Panel PVC con acabado mármol negro. Sofisticación absoluta para espacios que buscan contraste dramático y elegancia contemporánea. Ideal para muros de acento y ambientes premium.",
    images: [marmolNegro, marmolNegroMedida, marmolNegro],
    propiedades: [
      { label: "Material", valor: "PVC rígido UV" }, { label: "Dimensiones", valor: "122 × 244 cm" },
      { label: "Espesor", valor: "3 mm" }, { label: "Peso", valor: "~4,2 kg/unidad" },
      { label: "Cobertura", valor: "2,97 m² por unidad" }, { label: "Acabado", valor: "Alto brillo marmolado negro" },
      { label: "Resistencia UV", valor: "Sí" }, { label: "Resistencia humedad", valor: "Alta" },
    ],
    usos: ["Muros de acento", "Living y comedor", "Baños de lujo", "Locales comerciales premium"],
    instalacion: "Instalación con adhesivo de contacto o sistema de clips ocultos.",
    accesorios: ["Perfil H Aluminio (KOD: SILVER-H-JOINT)", "Perfil Interior Aluminio (KOD: SILVER-INSIDE)"],
  },
  "wall-panel-caoba-24mm": {
    nombre: "Wall Panel Caoba 24mm", slug: "wall-panel-caoba-24mm", codigo: "PY-60023-21", precio: 6500, unidad: "c/u", dims: "16×290cm", categoria: "Muros",
    descripcion: "Panel acanalado de PVC con acabado madera caoba. Textura profunda y contemporánea que aporta calidez y carácter a cualquier ambiente. Diseño nórdico adaptado al gusto latinoamericano.",
    images: [wallCaobaTextura, wallCaoba, wallCaobaLiving],
    propiedades: [
      { label: "Material", valor: "PVC texturizado" }, { label: "Dimensiones", valor: "16 × 290 cm" },
      { label: "Espesor", valor: "24 mm" }, { label: "Cobertura", valor: "0,464 m² por unidad" },
      { label: "Acabado", valor: "Madera caoba acanalada" }, { label: "Sistema montaje", valor: "Clips ocultos" },
      { label: "Resistencia humedad", valor: "Media-alta" }, { label: "Apto interior", valor: "Sí" },
    ],
    usos: ["Muros de acento", "Cabeceros de cama", "Living", "Oficinas", "Restaurantes"],
    instalacion: "Sistema de instalación con clips ocultos (se venden por separado). Paneles se encajan sin tornillos visibles para acabado perfecto.",
    accesorios: ["100 Clips de Montaje (KOD: CLIPS)"],
  },
  "wall-panel-roble-24mm": {
    nombre: "Wall Panel Roble 24mm", slug: "wall-panel-roble-24mm", codigo: "PY-80450I-9", precio: 6500, unidad: "c/u", dims: "16×290cm", categoria: "Muros",
    descripcion: "Panel acanalado tono roble natural. Armonía nórdica para interiores cálidos y acogedores. Su tono miel equilibrado combina con materiales naturales y acabados mate.",
    images: [wallRobleTextura, wallRoble, wallRoblelLiving],
    propiedades: [
      { label: "Material", valor: "PVC texturizado" }, { label: "Dimensiones", valor: "16 × 290 cm" },
      { label: "Espesor", valor: "24 mm" }, { label: "Cobertura", valor: "0,464 m² por unidad" },
      { label: "Acabado", valor: "Madera roble acanalada" }, { label: "Sistema montaje", valor: "Clips ocultos" },
      { label: "Resistencia humedad", valor: "Media-alta" }, { label: "Apto interior", valor: "Sí" },
    ],
    usos: ["Muros de acento", "Cabeceros de cama", "Living", "Oficinas", "Restaurantes"],
    instalacion: "Sistema de instalación con clips ocultos. Paneles se encajan sin tornillos visibles.",
    accesorios: ["100 Clips de Montaje (KOD: CLIPS)"],
  },
  "wall-panel-marmol-24mm": {
    nombre: "Wall Panel Mármol 24mm", slug: "wall-panel-marmol-24mm", codigo: "PY-80401-2", precio: 6500, unidad: "c/u", dims: "16×290cm", categoria: "Muros",
    descripcion: "Mármol en formato panel acanalado. Lo mejor de dos mundos: la elegancia del mármol con el dinamismo del relieve acanalado contemporáneo.",
    images: [wallMarmolTextura, wallMarmol, wallMarmolLiving],
    propiedades: [
      { label: "Material", valor: "PVC texturizado" }, { label: "Dimensiones", valor: "16 × 290 cm" },
      { label: "Espesor", valor: "24 mm" }, { label: "Cobertura", valor: "0,464 m² por unidad" },
      { label: "Acabado", valor: "Mármol acanalado" }, { label: "Sistema montaje", valor: "Clips ocultos" },
      { label: "Resistencia humedad", valor: "Media-alta" }, { label: "Apto interior", valor: "Sí" },
    ],
    usos: ["Muros de acento", "Baños", "Living", "Locales comerciales"],
    instalacion: "Sistema de instalación con clips ocultos.",
    accesorios: ["100 Clips de Montaje (KOD: CLIPS)"],
  },
  "placa-cielo-pvc-pino": {
    nombre: "Placa Cielo PVC Pino", slug: "placa-cielo-pvc-pino", codigo: "DS059", precio: 12500, unidad: "c/u", dims: "25×580cm", categoria: "Cielos",
    descripcion: "Placa para cielos de PVC con veta natural de pino. Instalación sencilla y resultado cálido y natural. Ideal para cabañas, casas de campo y ambientes rústicos modernos.",
    images: [cieloPvcPinoTextura, cieloPvcPino, cieloPvcPinoliving],
    propiedades: [
      { label: "Material", valor: "PVC" }, { label: "Dimensiones", valor: "25 × 580 cm" },
      { label: "Cobertura", valor: "1,45 m² por unidad" }, { label: "Acabado", valor: "Veta pino natural" },
      { label: "Uso", valor: "Cielos interiores" }, { label: "Resistencia humedad", valor: "Alta" },
      { label: "Aislación térmica", valor: "Leve" }, { label: "Aislación acústica", valor: "Leve" },
    ],
    usos: ["Cielos de cabañas", "Interiores rústicos", "Casas de campo", "Recintos húmedos"],
    instalacion: "Instalación con perfil H DS059-H para uniones. Se puede clavar o encolar sobre estructura existente.",
    accesorios: ["Perfil PVC H Cielo (KOD: DS059-H)", "Perfil Cornisa 3×3 (KOD: DS059-P)"],
  },
  "siding-metal-castano": {
    nombre: "Siding Metal Castaño", slug: "siding-metal-castano", codigo: "WG-02", precio: 26500, unidad: "c/u", dims: "38.3×580cm", categoria: "Exterior",
    descripcion: "Revestimiento exterior metálico imitación madera castaño. Alta densidad y resistencia para fachadas expuestas. 2,2 m² de cobertura por unidad, con excelente desempeño térmico cumpliendo normativa.",
    images: [sidingMetalCastanoTextura, sidingMetalCastano, sidingMetalCastanoExterior],
    propiedades: [
      { label: "Material", valor: "Metal prelacado" }, { label: "Dimensiones", valor: "38,3 × 580 cm" },
      { label: "Cobertura", valor: "2,22 m² por unidad" }, { label: "Acabado", valor: "Madera castaño" },
      { label: "Uso", valor: "Exterior / Fachadas" }, { label: "Resistencia UV", valor: "Alta" },
      { label: "Resistencia lluvia", valor: "Muy alta" }, { label: "Normativa térmica", valor: "Compatible" },
    ],
    usos: ["Fachadas de cabañas", "Revestimiento exterior casas", "Muros de bodegas", "Proyectos comerciales"],
    instalacion: "Instalación horizontal con perfiles de inicio, término y esquineros. Requiere estructura de apoyo. Usar tornillo autoperforante para metal.",
    accesorios: ["Perfil H Siding", "Perfil Término Siding", "Perfil Esquinero Exterior", "Perfil Esquinero Interior"],
  },
  "siding-metal-cedro": {
    nombre: "Siding Metal Cedro", slug: "siding-metal-cedro", codigo: "WG-08", precio: 26500, unidad: "c/u", dims: "38.3×580cm", categoria: "Exterior",
    descripcion: "Revestimiento exterior metálico imitación cedro. Tono cálido y natural para fachadas con carácter. Resistente a condiciones climáticas extremas del sur de Chile.",
    images: [sidingMetalCedroTextura, sidingMetalCedro, sidingMetalCedroExterior],
    propiedades: [
      { label: "Material", valor: "Metal prelacado" }, { label: "Dimensiones", valor: "38,3 × 580 cm" },
      { label: "Cobertura", valor: "2,22 m² por unidad" }, { label: "Acabado", valor: "Madera cedro" },
      { label: "Uso", valor: "Exterior / Fachadas" }, { label: "Resistencia UV", valor: "Alta" },
      { label: "Resistencia lluvia", valor: "Muy alta" }, { label: "Normativa térmica", valor: "Compatible" },
    ],
    usos: ["Fachadas de cabañas", "Revestimiento exterior casas", "Proyectos en zona sur"],
    instalacion: "Instalación horizontal con perfiles de inicio, término y esquineros.",
    accesorios: ["Perfil H Siding", "Perfil Término Siding", "Perfil Esquinero Exterior", "Perfil Esquinero Interior"],
  },
  "perfil-pvc-h-cielo": {
    nombre: "Perfil PVC H Cielo", slug: "perfil-pvc-h-cielo", codigo: "DS059-H", precio: 14500, unidad: "c/u", dims: "1×4×580cm", categoria: "Accesorios",
    descripcion: "Perfil de unión tipo H en PVC para placas de cielo. Cubre las juntas entre placas logrando un acabado limpio y profesional.",
    images: [perfilPvcH, perfilPvcH, perfilPvcH],
    propiedades: [
      { label: "Material", valor: "PVC rígido" }, { label: "Dimensiones", valor: "1 × 4 × 580 cm" },
      { label: "Largo", valor: "580 cm" }, { label: "Tipo", valor: "Perfil H unión" },
      { label: "Color", valor: "Blanco / Natural" }, { label: "Uso", valor: "Cielos interiores" },
      { label: "Compatibilidad", valor: "Placa Cielo PVC DS059" }, { label: "Instalación", valor: "Encaje directo" },
    ],
    usos: ["Unión entre placas de cielo", "Acabado de juntas PVC", "Cielos de cabañas"],
    instalacion: "Se encaja directamente entre dos placas contiguas. No requiere adhesivo ni tornillos. Instalación en seco.",
    accesorios: ["Placa Cielo PVC Pino (COD: DS059)", "Perfil Cornisa 3×3 (COD: DS059-P)"],
  },
  "perfil-cornisa-3x3": {
    nombre: "Perfil Cornisa 3×3", slug: "perfil-cornisa-3x3", codigo: "DS059-P", precio: 14500, unidad: "c/u", dims: "3×3×580cm", categoria: "Accesorios",
    descripcion: "Perfil de cornisa para encuentro entre muro y cielo. Aporta una terminación elegante y oculta el encuentro de ambas superficies.",
    images: [perfilPvcCornisa, perfilPvcCornisa, perfilPvcCornisa],
    propiedades: [
      { label: "Material", valor: "PVC rígido" }, { label: "Dimensiones", valor: "3 × 3 × 580 cm" },
      { label: "Largo", valor: "580 cm" }, { label: "Tipo", valor: "Cornisa / remate muro-cielo" },
      { label: "Color", valor: "Blanco" }, { label: "Uso", valor: "Terminación interior" },
      { label: "Compatibilidad", valor: "PVC Mármol y Cielo PVC" }, { label: "Instalación", valor: "Adhesivo o clavo" },
    ],
    usos: ["Encuentro muro-cielo", "Terminación decorativa", "Remate de revestimientos PVC"],
    instalacion: "Se fija con adhesivo de contacto o clavos de acabado sobre la línea de encuentro entre muro y cielo.",
    accesorios: ["Placa Cielo PVC Pino (COD: DS059)", "Perfil PVC H Cielo (COD: DS059-H)"],
  },
  "100-clips-de-montaje": {
    nombre: "100 Clips de Montaje", slug: "100-clips-de-montaje", codigo: "CLIPS", precio: 6000, unidad: "set", dims: "33×45mm", categoria: "Accesorios",
    descripcion: "Set de 100 clips metálicos para fijación oculta de Wall Panel. Permiten instalar los paneles sin tornillos visibles, logrando un acabado perfecto y profesional.",
    images: [clipsWallPanel, clipsWallPanel, clipsWallPanel],
    propiedades: [
      { label: "Material", valor: "Acero galvanizado" }, { label: "Dimensiones", valor: "33 × 45 mm" },
      { label: "Cantidad", valor: "100 unidades por set" }, { label: "Cobertura aprox.", valor: "~46 m²" },
      { label: "Sistema", valor: "Fijación oculta" }, { label: "Compatibilidad", valor: "Wall Panel 24mm" },
      { label: "Instalación", valor: "Tornillo o grapadora" }, { label: "Acabado visible", valor: "Ninguno (oculto)" },
    ],
    usos: ["Instalación Wall Panel Caoba", "Instalación Wall Panel Roble", "Instalación Wall Panel Mármol"],
    instalacion: "Se fija el clip a la estructura con tornillo o grapadora. El panel se encaja en el clip sin tornillos visibles. Un clip cada 40 cm aprox.",
    accesorios: ["Wall Panel Caoba 24mm (COD: PY-60023-21)", "Wall Panel Roble 24mm (COD: PY-80450I-9)", "Wall Panel Mármol 24mm (COD: PY-80401-2)"],
  },
  "perfil-h-aluminio": {
    nombre: "Perfil H Aluminio", slug: "perfil-h-aluminio", codigo: "SILVER-H-JOINT", precio: 3600, unidad: "c/u", dims: "1.8×250cm", categoria: "Accesorios",
    descripcion: "Perfil de unión tipo H en aluminio anodizado plateado para paneles PVC Mármol UV. Cubre juntas verticales entre paneles con acabado de alto brillo.",
    images: [perfilHPvcUv, perfilHPvcUv, perfilHPvcUv],
    propiedades: [
      { label: "Material", valor: "Aluminio anodizado" }, { label: "Dimensiones", valor: "1,8 × 250 cm" },
      { label: "Largo", valor: "250 cm" }, { label: "Acabado", valor: "Plateado brillante" },
      { label: "Tipo", valor: "Perfil H unión" }, { label: "Uso", valor: "Muros interiores" },
      { label: "Compatibilidad", valor: "PVC Mármol UV 122×244cm" }, { label: "Instalación", valor: "Adhesivo de contacto" },
    ],
    usos: ["Unión entre paneles PVC Mármol", "Terminación vertical de revestimientos", "Baños y cocinas"],
    instalacion: "Se aplica adhesivo de contacto en la ranura del perfil y se presiona sobre la junta entre dos paneles. Tiempo de secado 24 horas.",
    accesorios: ["PVC Mármol Gris (COD: KL8235)", "PVC Mármol Blanco (COD: KL8263)", "PVC Mármol Negro (COD: KL8264)"],
  },
  "perfil-interior-aluminio": {
    nombre: "Perfil Interior Aluminio", slug: "perfil-interior-aluminio", codigo: "SILVER-INSIDE", precio: 3600, unidad: "c/u", dims: "2×250cm", categoria: "Accesorios",
    descripcion: "Perfil de terminación interior en aluminio para remates de esquina interna o borde de paneles PVC. Acabado plateado que complementa el aspecto premium de los revestimientos.",
    images: [perfilWInteriorPvcUv, perfilWInteriorPvcUv, perfilWInteriorPvcUv],
    propiedades: [
      { label: "Material", valor: "Aluminio anodizado" }, { label: "Dimensiones", valor: "2 × 250 cm" },
      { label: "Largo", valor: "250 cm" }, { label: "Acabado", valor: "Plateado brillante" },
      { label: "Tipo", valor: "Perfil W interior" }, { label: "Uso", valor: "Muros interiores" },
      { label: "Compatibilidad", valor: "PVC Mármol UV" }, { label: "Instalación", valor: "Adhesivo de contacto" },
    ],
    usos: ["Esquinas interiores", "Remate de bordes PVC", "Terminación de paneles en vanos"],
    instalacion: "Se aplica adhesivo en la ranura y se presiona en la esquina o borde del panel. Cortar a medida con segueta.",
    accesorios: ["PVC Mármol Gris (COD: KL8235)", "PVC Mármol Blanco (COD: KL8263)", "Perfil H Aluminio (COD: SILVER-H-JOINT)"],
  },
  "perfil-h-siding": {
    nombre: "Perfil H Siding", slug: "perfil-h-siding", codigo: "CENTER-JOINT", precio: 7500, unidad: "c/u", dims: "20×50×3000mm", categoria: "Accesorios",
    descripcion: "Perfil conector tipo H para unión entre paños de siding metálico exterior. Cubre la junta vertical con acabado limpio y resistente a la intemperie.",
    images: [perfilHSiding, perfilHSiding, perfilHSiding],
    propiedades: [
      { label: "Material", valor: "Metal prelacado" }, { label: "Dimensiones", valor: "20 × 50 × 3000 mm" },
      { label: "Largo", valor: "300 cm" }, { label: "Tipo", valor: "Conector H central" },
      { label: "Uso", valor: "Fachadas exteriores" }, { label: "Resistencia UV", valor: "Alta" },
      { label: "Resistencia lluvia", valor: "Muy alta" }, { label: "Compatibilidad", valor: "Siding Metálico WG" },
    ],
    usos: ["Unión entre paños de siding", "Fachadas de cabañas", "Revestimientos exteriores"],
    instalacion: "Se instala verticalmente entre dos paños de siding. Se fija a la estructura con tornillo autoperforante.",
    accesorios: ["Siding Metal Castaño (COD: WG-02)", "Siding Metal Cedro (COD: WG-08)"],
  },
  "perfil-termino-siding": {
    nombre: "Perfil Término Siding", slug: "perfil-termino-siding", codigo: "STARTING-CLOSING", precio: 7500, unidad: "c/u", dims: "20×40×3000mm", categoria: "Accesorios",
    descripcion: "Perfil de inicio y término para instalación de siding exterior. Se usa en la primera y última hilada para asegurar y rematar el revestimiento.",
    images: [perfilTerminoSiding, perfilTerminoSiding, perfilTerminoSiding],
    propiedades: [
      { label: "Material", valor: "Metal prelacado" }, { label: "Dimensiones", valor: "20 × 40 × 3000 mm" },
      { label: "Largo", valor: "300 cm" }, { label: "Tipo", valor: "Inicio / término horizontal" },
      { label: "Uso", valor: "Fachadas exteriores" }, { label: "Resistencia UV", valor: "Alta" },
      { label: "Resistencia lluvia", valor: "Muy alta" }, { label: "Compatibilidad", valor: "Siding Metálico WG" },
    ],
    usos: ["Inicio de instalación siding", "Remate inferior y superior", "Fachadas de cabañas"],
    instalacion: "Se fija horizontalmente en la parte inferior (inicio) y superior (término) del paño de siding. Tornillo autoperforante cada 30 cm.",
    accesorios: ["Siding Metal Castaño (COD: WG-02)", "Siding Metal Cedro (COD: WG-08)", "Perfil H Siding (COD: CENTER-JOINT)"],
  },
  "perfil-esquinero-exterior": {
    nombre: "Perfil Esquinero Exterior", slug: "perfil-esquinero-exterior", codigo: "OUTSIDE-CORNER", precio: 7500, unidad: "c/u", dims: "50×50×3000mm", categoria: "Accesorios",
    descripcion: "Perfil esquinero para terminación exterior de esquinas en fachadas con siding metálico. Protege el canto de los paneles y aporta una terminación limpia.",
    images: [perfilEsquineroSiding, perfilEsquineroSiding, perfilEsquineroSiding],
    propiedades: [
      { label: "Material", valor: "Metal prelacado" }, { label: "Dimensiones", valor: "50 × 50 × 3000 mm" },
      { label: "Largo", valor: "300 cm" }, { label: "Tipo", valor: "Esquinero exterior 90°" },
      { label: "Uso", valor: "Esquinas de fachada" }, { label: "Resistencia UV", valor: "Alta" },
      { label: "Resistencia lluvia", valor: "Muy alta" }, { label: "Compatibilidad", valor: "Siding Metálico WG" },
    ],
    usos: ["Esquinas exteriores de fachada", "Terminación de bordes verticales", "Cabañas y casas"],
    instalacion: "Se instala verticalmente en la esquina exterior. Se fija a la estructura con tornillo autoperforante antes de instalar el siding.",
    accesorios: ["Siding Metal Castaño (COD: WG-02)", "Siding Metal Cedro (COD: WG-08)", "Perfil Esquinero Interior (COD: INSIDE-CORNER)"],
  },
  "perfil-esquinero-interior": {
    nombre: "Perfil Esquinero Interior", slug: "perfil-esquinero-interior", codigo: "INSIDE-CORNER", precio: 7500, unidad: "c/u", dims: "30×30×3000mm", categoria: "Accesorios",
    descripcion: "Perfil esquinero para terminación interior de esquinas en fachadas con siding metálico. Cubre el encuentro entre dos paños en esquinas entrantes.",
    images: [perfilEsquineroInteriorSiding, perfilEsquineroInteriorSiding, perfilEsquineroInteriorSiding],
    propiedades: [
      { label: "Material", valor: "Metal prelacado" }, { label: "Dimensiones", valor: "30 × 30 × 3000 mm" },
      { label: "Largo", valor: "300 cm" }, { label: "Tipo", valor: "Esquinero interior 90°" },
      { label: "Uso", valor: "Esquinas interiores fachada" }, { label: "Resistencia UV", valor: "Alta" },
      { label: "Resistencia lluvia", valor: "Muy alta" }, { label: "Compatibilidad", valor: "Siding Metálico WG" },
    ],
    usos: ["Esquinas interiores de fachada", "Encuentro entre paños de siding", "Cabañas y casas"],
    instalacion: "Se instala verticalmente en la esquina interior. Se fija con tornillo autoperforante a la estructura.",
    accesorios: ["Siding Metal Castaño (COD: WG-02)", "Siding Metal Cedro (COD: WG-08)", "Perfil Esquinero Exterior (COD: OUTSIDE-CORNER)"],
  },
};

export function slugify(name) {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const $$ = (n) => `$${Number(n).toLocaleString("es-CL")}`;
const WA = "56978682990";

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [imgIdx, setImgIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [qty, setQty] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const p = FICHAS[slug];

  useEffect(() => { window.scrollTo(0, 0); setImgIdx(0); }, [slug]);
  useEffect(() => { if (p) document.title = `${p.nombre} | Casa-Estudio 1016`; }, [p]);

  const sm = isMobile;
  const C = { dark: "#4A6741", warm: "#F4806D", bg: "#F5F4F2", text: "#2A3528", mid: "#6B7B6A" };

  if (!p) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, fontFamily: "'HWYGothic', sans-serif", padding: 24 }}>
      <div style={{ fontSize: 48 }}>🔍</div>
      <h2 style={{ fontSize: 22, color: C.text, textAlign: "center" }}>Producto no encontrado</h2>
      <button onClick={() => navigate("/")} style={{ background: C.dark, color: "white", border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>← Volver al catálogo</button>
    </div>
  );

  const waMsg = encodeURIComponent(`Hola, me interesa el producto:\n\n${p.nombre}\nCódigo: ${p.codigo}\nDimensiones: ${p.dims}\nCantidad: ${qty}\nPrecio ref.: ${$$(p.precio * qty)}\n\n¿Está disponible? ¿Cuál es el plazo de entrega?`);

  return (
    <div style={{ fontFamily: "'HWYGothic', sans-serif", background: C.bg, minHeight: "100vh", color: C.text }}>
      <style>{`
        @font-face { font-family: 'HWYGothic'; src: url('/src/assets/fonts/HWYGOTH.TTF') format('truetype'); }
        @font-face { font-family: 'HWYGWide'; src: url('/src/assets/fonts/HWYGWDE.TTF') format('truetype'); }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* NAV */}
      <nav style={{ background: "white", borderBottom: "1px solid #E8E0D4", padding: "0 16px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: C.mid, fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>
          ← {sm ? "Volver" : "Volver al catálogo"}
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, background: C.dark, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'HWYGWide',sans-serif", fontWeight: 700, color: "white", fontSize: 10 }}>1016</div>
          <span style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: 14, fontWeight: 700, color: C.text }}>Casa-Estudio <span style={{ color: C.warm }}>1016</span></span>
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.mid, flexWrap: "wrap" }}>
        <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", color: C.mid, fontFamily: "inherit", fontSize: 11 }}>Inicio</button>
        <span>›</span>
        <button onClick={() => navigate("/#catalogo")} style={{ background: "none", border: "none", cursor: "pointer", color: C.mid, fontFamily: "inherit", fontSize: 11 }}>Catálogo</button>
        <span>›</span>
        <span style={{ color: C.text, fontWeight: 600 }}>{p.nombre}</span>
      </div>

      {/* MAIN: imagen + info */}
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: sm ? "0 16px 32px" : "0 24px 60px",
        display: "grid",
        gridTemplateColumns: sm ? "1fr" : "1fr 1fr",
        gap: sm ? 20 : 48,
        animation: "fadeIn 0.4s ease both",
      }}>
        {/* GALERÍA */}
        <div>
          <div onClick={() => setLightbox(true)} style={{ background: "white", borderRadius: 12, overflow: "hidden", border: "1px solid #E8E0D4", cursor: "zoom-in", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", marginBottom: 10 }}>
            <img src={p.images[imgIdx]} alt={p.nombre} style={{ width: "100%", height: "100%", objectFit: "contain", padding: sm ? 8 : 16 }} />
            <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.4)", color: "white", fontSize: 10, padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>🔍 Ampliar</div>
            <div style={{ position: "absolute", top: 10, left: 10, background: C.warm, color: "white", fontSize: 10, padding: "4px 10px", borderRadius: 20, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{p.categoria}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {p.images.map((src, i) => (
              <div key={i} onClick={() => setImgIdx(i)} style={{ width: sm ? 58 : 72, height: sm ? 58 : 72, borderRadius: 8, overflow: "hidden", cursor: "pointer", border: `2px solid ${imgIdx === i ? C.warm : "#E8E0D4"}`, background: "white", flexShrink: 0 }}>
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} />
              </div>
            ))}
          </div>
        </div>

        {/* INFO */}
        <div style={{ display: "flex", flexDirection: "column", gap: sm ? 12 : 18 }}>
          <div style={{ fontSize: 11, color: C.mid, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>COD: {p.codigo}</div>
          <h1 style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: sm ? "clamp(20px,5.5vw,26px)" : "clamp(24px,3vw,36px)", fontWeight: 700, color: C.text, lineHeight: 1.15 }}>{p.nombre}</h1>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: sm ? 24 : 32, fontWeight: 800, color: C.dark }}>{$$(p.precio)}</span>
            <span style={{ fontSize: 13, color: C.mid }}>{p.unidad} · {p.dims}</span>
          </div>
          <p style={{ fontSize: sm ? 13 : 15, color: C.mid, lineHeight: 1.8, fontWeight: 300 }}>{p.descripcion}</p>

          {/* Cantidad + botones */}
          <div style={{ background: "white", borderRadius: 12, padding: sm ? "14px" : "20px", border: "1px solid #E8E0D4" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Cantidad:</span>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #E0D8D0", borderRadius: 999, overflow: "hidden" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 36, height: 36, border: "none", background: "white", cursor: "pointer", fontSize: 18, color: C.text }}>−</button>
                <span style={{ minWidth: 40, textAlign: "center", fontSize: 15, fontWeight: 700 }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 36, height: 36, border: "none", background: "white", cursor: "pointer", fontSize: 18, color: C.text }}>+</button>
              </div>
              <span style={{ fontSize: 13, color: C.mid }}>= <strong style={{ color: C.dark }}>{$$(p.precio * qty)}</strong></span>
            </div>
            <a href={`https://wa.me/${WA}?text=${waMsg}`} target="_blank" rel="noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#25D366", color: "white", padding: "13px", borderRadius: 9, fontSize: 14, fontWeight: 700, textDecoration: "none", width: "100%", marginBottom: 10 }}>
              💬 Cotizar por WhatsApp
            </a>
            <button onClick={() => navigate("/")}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: C.dark, color: "white", border: "none", padding: "11px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", width: "100%", fontFamily: "inherit" }}>
              ← Ver más productos
            </button>
          </div>

          {/* Usos */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: C.mid, marginBottom: 8 }}>Usos recomendados</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {p.usos.map((uso, i) => (
                <span key={i} style={{ background: `${C.dark}12`, color: C.dark, border: `1px solid ${C.dark}25`, borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: 600 }}>{uso}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FICHA TÉCNICA */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: sm ? "0 16px 60px" : "0 24px 80px" }}>
        {/* En móvil: todo en columna. En desktop: ficha ocupa 2/3, lateral 1/3 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: sm ? "1fr" : "2fr 1fr",
          gap: sm ? 14 : 20,
        }}>
          {/* Propiedades */}
          <div style={{ background: "white", borderRadius: 14, padding: sm ? "16px" : "24px", border: "1px solid #E8E0D4" }}>
            <h2 style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: sm ? 15 : 18, fontWeight: 700, color: C.text, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <span>📋</span> Ficha Técnica
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: sm ? "1fr" : "1fr 1fr", gap: 0 }}>
              {p.propiedades.map((prop, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: i % 2 === 0 ? "#F9F7F4" : "white", borderBottom: "1px solid #F0EAE2", gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.mid, textTransform: "uppercase", letterSpacing: 0.4, flexShrink: 0 }}>{prop.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text, textAlign: "right" }}>{prop.valor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instalación + Accesorios */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: `${C.dark}08`, borderRadius: 14, padding: sm ? "14px" : "20px", border: `1px solid ${C.dark}20` }}>
              <h3 style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: 14, fontWeight: 700, color: C.dark, marginBottom: 10, display: "flex", gap: 6 }}>
                <span>🔧</span> Instalación
              </h3>
              <p style={{ fontSize: 12, color: C.mid, lineHeight: 1.75 }}>{p.instalacion}</p>
            </div>
            {p.accesorios.length > 0 && (
              <div style={{ background: "white", borderRadius: 14, padding: sm ? "14px" : "20px", border: "1px solid #E8E0D4" }}>
                <h3 style={{ fontFamily: "'HWYGWide',sans-serif", fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10, display: "flex", gap: 6 }}>
                  <span>🔩</span> Accesorios compatibles
                </h3>
                {p.accesorios.map((ac, i) => (
                  <div key={i} style={{ fontSize: 12, color: C.mid, padding: "5px 0", borderBottom: i < p.accesorios.length - 1 ? "1px solid #F0EAE2" : "none" }}>→ {ac}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightbox && createPortal(
        <div onClick={() => setLightbox(false)} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <button onClick={() => setLightbox(false)} style={{ position: "fixed", top: 16, right: 16, background: "rgba(255,255,255,0.15)", border: "none", color: "white", fontSize: 24, cursor: "pointer", width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          <img src={p.images[imgIdx]} onClick={e => e.stopPropagation()} alt={p.nombre} style={{ maxWidth: "90vw", maxHeight: "80vh", objectFit: "contain", borderRadius: 12 }} />
          {p.images.length > 1 && (
            <div onClick={e => e.stopPropagation()} style={{ position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
              {p.images.map((src, i) => (
                <div key={i} onClick={() => setImgIdx(i)} style={{ width: 52, height: 52, borderRadius: 8, overflow: "hidden", cursor: "pointer", border: `2px solid ${imgIdx === i ? "white" : "rgba(255,255,255,0.3)"}`, opacity: imgIdx === i ? 1 : 0.5 }}>
                  <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", background: "white", padding: 3 }} />
                </div>
              ))}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
