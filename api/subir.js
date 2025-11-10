export default async function handler(req, res) {
  // Habilitar CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Manejar preflight OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { texto } = req.body;

  const token = process.env.GITHUB_TOKEN;
  const repo = "angelos2024/Local-consults";
  const filePath = `clientes/cliente_${Date.now()}.txt`;
  const base64Content = Buffer.from(texto).toString("base64");

  const response = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Subida desde HTML",
      content: base64Content
    })
  });

  const data = await response.json();
  if (response.ok) {
    res.status(200).json({ success: true, url: data.content.download_url });
  } else {
    res.status(400).json({ success: false, error: data });
  }
}
