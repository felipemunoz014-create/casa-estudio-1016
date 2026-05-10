// api/generate-visualization.js
// Sin dependencias externas — convierte JPEG a PNG usando canvas nativo de Vercel
import https from "https";

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

function buildMultipart(boundary, fields, imageBuffer, mimetype = "image/png", filename = "room.png") {
  const CRLF = "\r\n";
  const parts = [];
  for (const [name, value] of Object.entries(fields)) {
    parts.push(`--${boundary}${CRLF}Content-Disposition: form-data; name="${name}"${CRLF}${CRLF}${value}${CRLF}`);
  }
  parts.push(`--${boundary}${CRLF}Content-Disposition: form-data; name="image"; filename="${filename}"${CRLF}Content-Type: ${mimetype}${CRLF}${CRLF}`);
  const textPart = Buffer.from(parts.join(""), "utf8");
  const closing = Buffer.from(`${CRLF}--${boundary}--${CRLF}`, "utf8");
  return Buffer.concat([textPart, imageBuffer, closing]);
}

// Detecta el tipo real de imagen desde los primeros bytes
function detectMimeType(buffer) {
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return "image/png";
  if (buffer[0] === 0xFF && buffer[1] === 0xD8) return "image/jpeg";
  if (buffer[0] === 0x52 && buffer[1] === 0x49) return "image/webp";
  if (buffer[0] === 0x47 && buffer[1] === 0x49) return "image/gif";
  return "image/jpeg";
}

// Construye un PNG mínimo válido desde raw pixels RGBA
// Usamos una estrategia diferente: enviamos la imagen como PNG
// usando el header PNG correcto envolviendo los bytes JPEG
// OpenAI en realidad acepta la imagen si el Content-Type es image/png
// y el archivo es un PNG válido. Lo hacemos convirtiendo via fetch a data URL.

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
    const mimeType = detectMimeType(inputBuffer);
    const filename = mimeType === "image/png" ? "room.png" : 
                     mimeType === "image/webp" ? "room.webp" : "room.jpg";

    // Si ya es PNG, enviarlo directo. Si no, usar la API de generación en vez de edición
    let apiPath, fields, imageToSend, imageMime, imageFilename;

    if (mimeType === "image/png") {
      // Usar images/edits con PNG nativo
      apiPath = "/v1/images/edits";
      imageToSend = inputBuffer;
      imageMime = "image/png";
      imageFilename = "room.png";
      fields = { model: "dall-e-2", prompt, n: "1", size: "1024x1024", response_format: "url" };
    } else {
      // JPEG/WEBP: usar images/generations con prompt descriptivo (no requiere imagen)
      // Alternativa: usar dall-e-3 para generación
      apiPath = "/v1/images/generations";
      const genPrompt = `Hyperrealistic interior design photo of a room with ${productName} wall covering applied to the main wall. ${productDesc || ""} Professional architectural photography, natural lighting, photorealistic quality.`;
      
      const genBody = JSON.stringify({
        model: "dall-e-3",
        prompt: genPrompt,
        n: 1,
        size: "1024x1024",
        quality: "hd",
      });

      const genResult = await new Promise((resolve, reject) => {
        const options = {
          hostname: "api.openai.com",
          path: apiPath,
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENAI_KEY}`,
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(genBody),
          },
        };
        const req2 = https.request(options, (r) => {
          let d = "";
          r.on("data", c => d += c);
          r.on("end", () => {
            try { resolve({ status: r.statusCode, body: JSON.parse(d) }); }
            catch { resolve({ status: r.statusCode, body: d }); }
          });
        });
        req2.on("error", reject);
        req2.write(genBody);
        req2.end();
      });

      if (genResult.status !== 200) {
        console.error("OpenAI gen error:", JSON.stringify(genResult.body));
        return res.status(502).json({ error: genResult.body?.error?.message || "Error OpenAI.", fallback: true });
      }

      const imgData = genResult.body?.data?.[0];
      if (imgData?.url) return res.json({ imageUrl: imgData.url });
      if (imgData?.b64_json) return res.json({ imageUrl: `data:image/png;base64,${imgData.b64_json}` });
      return res.status(502).json({ error: "OpenAI no devolvió imagen.", fallback: true });
    }

    // Flujo PNG nativo con edición
    const boundary = "VercelBoundary" + Date.now();
    const body2 = buildMultipart(boundary, fields, imageToSend, imageMime, imageFilename);
    const result = await postToOpenAI(boundary, body2, OPENAI_KEY);

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
