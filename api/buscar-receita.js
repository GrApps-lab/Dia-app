// Função serverless da Vercel. Roda no servidor, então a chave da API
// (ANTHROPIC_API_KEY) fica escondida — nunca é exposta pro navegador do usuário.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { ingredientes } = req.body || {};
  if (!ingredientes || !ingredientes.trim()) {
    return res.status(400).json({ error: "Informe os ingredientes" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "Chave da API não configurada no servidor" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Busque na internet uma receita real, simples e rápida de fazer que use principalmente estes ingredientes: ${ingredientes}. Responda SOMENTE com um objeto JSON válido, sem markdown, sem crases, sem texto antes ou depois, exatamente neste formato: {"name": "nome da receita", "time": "tempo estimado", "ingredients": ["ingrediente 1", "ingrediente 2"], "steps": "modo de preparo em um parágrafo curto"}`,
          },
        ],
        tools: [{ type: "web_search_20250305", name: "web_search" }],
      }),
    });

    const data = await response.json();
    const textBlocks = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    const clean = textBlocks.replace(/```json|```/g, "").trim();
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    const parsed = JSON.parse(clean.slice(start, end + 1));

    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: "Não foi possível buscar a receita agora" });
  }
}
