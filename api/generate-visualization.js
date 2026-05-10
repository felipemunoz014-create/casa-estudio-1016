// api/generate-visualization.js
// Convierte la imagen a PNG usando sharp (disponible en Vercel) o fallback nativo
import https from "https";
import sharp from "sharp";

function postToOpenAI(boundary, body, apiKey) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.openai.com",
      path: "/v1/images/edits",
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "Content-Length": body.length,
      },
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function buildMultipart(boundary, fields, imageBuffer) {
  const CRLF = "\r\n";
  const parts = [];
  for (const [name, value] of Object.entries(fields)) {
    parts.push(`--${boundary}${CRLF}Content-Disposition: form-data; name="${name}"${CRLF}${CRLF}${value}${CRLF}`);
  }
  parts.push(`--${boundary}${CRLF}Content-Disposition: form-data; name="image"; filename="room.png"${CRLF}Content-Type: image/png${CRLF}${CRLF}`);
  const textPart = Buffer.from(parts.join(""), "utf8");
  const closing = Buffer.from(`${CRLF}--${boundary}--${CRLF}`, "utf8");
  return Buffer.concat([textPart, imageBuffer, closing]);
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { imageBase64, productName, productDesc, surface, largo, alto } = req.body;
  if (!imageBase64 || !productName) return res.status(400).json({ error: "Faltan datos requeridos." });

  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) return res.status(500).json({ error: "API Key no configurada.", fallback: true });

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
    const inputBuffer = Buffer.from(imageBase64, "base64");
    // Convertir a PNG usando sharp (incluido en Vercel por defecto)
    const pngBuffer = await sharp(inputBuffer).png().toBuffer();

    const boundary = "VercelBoundary" + Date.now();
    const body = buildMultipart(boundary, {
      model: "dall-e-2",
      prompt,
      n: "1",
      size: "1024x1024",
      response_format: "url",
    }, pngBuffer);

    const result = await postToOpenAI(boundary, body, OPENAI_KEY);

    if (result.status !== 200) {
      console.error("OpenAI error:", JSON.stringify(result.body));
      return res.status(502).json({ error: result.body?.error?.message || "Error OpenAI.", fallback: true });
    }

    const imageData = result.body?.data?.[0];
    if (imageData?.url) return res.json({ imageUrl: imageData.url });
    if (imageData?.b64_json) return res.json({ imageUrl: `data:image/png;base64,${imageData.b64_json}` });
    return res.status(502).json({ error: "OpenAI no devolvió imagen.", fallback: true });

  } catch (err) {
    console.error("Error interno:", err.message);
    return res.status(500).json({ error: "Error interno: " + err.message, fallback: true });
  }
}
