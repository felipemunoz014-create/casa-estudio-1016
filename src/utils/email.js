const EJS = {
  serviceId: "service_aycesln",
  templateId: "template_zkd4qaq",
  publicKey: "HNVJqgrwRpicOZjCJ",
};

export async function sendEmail(fields) {
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
