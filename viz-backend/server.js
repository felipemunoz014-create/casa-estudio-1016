// ─── viz-backend/server.js ────────────────────────────────────────────────────
// Backend seguro para generación de imágenes con OpenAI.
// La API Key NUNCA sale de aquí hacia el frontend.
// ─────────────────────────────────────────────────────────────────────────────
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ── CORS: permite solo tu frontend ───────────────────────────────────────────
// En producción cambia el origin por tu dominio real, ej: "https://casaestudio1016.cl"
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["POST"],
}));

// ── Body parser: imágenes base64 pueden ser grandes, aumentamos límite ────────
app.use(express.json({ limit: "20mb" }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Visualizador IA backend activo" });
});

// ── POST /api/generate-visualization ─────────────────────────────────────────
app.post("/api/generate-visualization", async (req, res) => {
  const {
    imageBase64,      // foto del espacio subida por el usuario (base64, sin prefijo)
    productName,      // nombre del revestimiento seleccionado
    productDesc,      // descripción del producto
    productImageBase64, // imagen/textura del producto (base64, puede ser null)
    surface,          // "muro" | "cielo"
    largo,            // metros
    alto,             // metros
  } = req.body;

  // ── Validaciones básicas ──────────────────────────────────────────────────
  if (!imageBase64) {
    return res.status(400).json({ error: "Falta la imagen del espacio." });
  }
  if (!productName) {
    return res.status(400).json({ error: "Falta el nombre del producto." });
  }

  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) {
    return res.status(500).json({ error: "API Key de OpenAI no configurada en el servidor." });
  }

  // ── Prompt hiperrealista ──────────────────────────────────────────────────
  const zoneEN = surface === "cielo" ? "ceiling" : "wall";
  const dimsText = largo && alto ? ` The ${zoneEN} measures ${largo}m wide by ${alto}m high.` : "";

  const prompt =
    `Edit this uploaded interior photo to create a hyperrealistic architectural visualization. ` +
    `Apply the selected wall covering "${productName}"${productDesc ? ` (${productDesc})` : ""} only to the main visible ${zoneEN} surface.${dimsText} ` +
    `Preserve the room structure, camera perspective, door, television, floor, ceiling, trim, lighting and all objects. ` +
    `Only replace the ${zoneEN} finish with the selected cladding. ` +
    `The material must look real, integrated and proportional. ` +
    `Respect realistic shadows, depth, texture scale and lighting. ` +
    `Do not redesign the room. Do not remove existing elements. Keep the environment recognizable. ` +
    `Final result must look premium, photorealistic and commercially attractive.`;

  try {
    // ── Llamada a GPT-Image-1 (edición de imagen) ─────────────────────────
    // Convertimos el base64 a un Blob/Buffer para enviarlo como multipart
    const imageBuffer = Buffer.from(imageBase64, "base64");

    // Construimos FormData manualmente para node-fetch
    const FormData = (await import("form-data")).default;
    const formData = new FormData();

    formData.append("model", "gpt-image-1");
    formData.append("prompt", prompt);
    formData.append("n", "1");
    formData.append("size", "1024x1024");
    // Imagen del espacio del usuario
    formData.append("image", imageBuffer, {
      filename: "room.jpg",
      contentType: "image/jpeg",
    });

    const openaiRes = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    const openaiData = await openaiRes.json();

    if (!openaiRes.ok) {
      console.error("OpenAI error:", openaiData);
      return res.status(502).json({
        error: openaiData?.error?.message || "Error al llamar a OpenAI.",
        fallback: true,
      });
    }

    // ── Respuesta exitosa ─────────────────────────────────────────────────
    // GPT-Image-1 devuelve b64_json o url dependiendo del response_format
    const imageData = openaiData.data?.[0];
    if (imageData?.url) {
      return res.json({ imageUrl: imageData.url });
    }
    if (imageData?.b64_json) {
      return res.json({ imageUrl: `data:image/png;base64,${imageData.b64_json}` });
    }

    return res.status(502).json({ error: "OpenAI no devolvió imagen.", fallback: true });

  } catch (err) {
    console.error("Error interno:", err);
    return res.status(500).json({
      error: "Error interno del servidor.",
      fallback: true,
    });
  }
});

app.listen(PORT, () => {
  console.log(`✦ Visualizador IA backend corriendo en http://localhost:${PORT}`);
});
