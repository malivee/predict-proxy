import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  console.log("📥 Raw body:", req.body);

  if (!req.body || !req.body.input) {
    return res.status(400).json({ error: "Missing or invalid 'input' in request body" });
  }

  const { input } = req.body;
  const EC2_URL = process.env.EC2_URL;

  try {
    const ec2Res = await fetch(`${EC2_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });

    const result = await ec2Res.json();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({ error: "Proxy failed", detail: error.message });
  }
}
