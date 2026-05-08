// api/generate-visualization.js
// ─── Función serverless para Vercel ──────────────────────────────────────────
// Este archivo va en la carpeta /api dentro de tu proyecto React.
// Vercel lo despliega automáticamente como POST /api/generate-visualization
// ─────────────────────────────────────────────────────────────────────────────

import fetch from "node-fetch";
import FormData from "form-data";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { imageBase64, productName, productDesc, surface, largo, alto } = req.body;

  if (!imageBase64 || !productName) {
    return res.status(400).json({ error: "Faltan datos requeridos." });
  }

  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) {
    return res.status(500).json({ error: "API Key no configurada.", fallback: true });
  }

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
    const imageBuffer = Buffer.from(imageBase64, "base64");
    const formData = new FormData();
    formData.append("model", "gpt-image-1");
    formData.append("prompt", prompt);
    formData.append("n", "1");
    formData.append("size", "1024x1024");
    formData.append("image", imageBuffer, { filename: "room.jpg", contentType: "image/jpeg" });

    const openaiRes = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_KEY}`, ...formData.getHeaders() },
      body: formData,
    });

    const openaiData = await openaiRes.json();

    if (!openaiRes.ok) {
      return res.status(502).json({ error: openaiData?.error?.message || "Error OpenAI.", fallback: true });
    }

    const imageData = openaiData.data?.[0];
    if (imageData?.url) return res.json({ imageUrl: imageData.url });
    if (imageData?.b64_json) return res.json({ imageUrl: `data:image/png;base64,${imageData.b64_json}` });

    return res.status(502).json({ error: "OpenAI no devolvió imagen.", fallback: true });

  } catch (err) {
    return res.status(500).json({ error: "Error interno.", fallback: true });
  }
}
