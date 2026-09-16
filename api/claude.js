// api/claude.js — Vercel Serverless Function
// Uses OpenRouter API (free tier available)
// Get free API key from: openrouter.ai/keys

export default async function handler(req, res) {
  // ── CORS ────────────────────────────────────────────────────────────────────
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // ── PARSE BODY ───────────────────────────────────────────────────────────────
  const { messages, system, max_tokens } = req.body || {};

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Invalid messages array" });
  }

  const safeMaxTokens = Math.min(max_tokens || 1000, 1000);

  // ── CHECK API KEY ────────────────────────────────────────────────────────────
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "API key not configured. Add OPENROUTER_API_KEY to Vercel environment variables."
    });
  }

  // ── BUILD MESSAGES (OpenRouter uses OpenAI format) ──────────────────────────
  const openRouterMessages = [];

  // Add system message if present
  if (system) {
    openRouterMessages.push({ role: "system", content: system });
  }

  // Add conversation messages
  openRouterMessages.push(...messages);

  // ── CALL OPENROUTER ──────────────────────────────────────────────────────────
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://p6-revisemaths-free.vercel.app",
        "X-Title": "P6 Maths Prep",
      },
      body: JSON.stringify({
        // Free models on OpenRouter — picks best available free one
        model: "meta-llama/llama-3.1-8b-instruct:free",
        max_tokens: safeMaxTokens,
        stream: true,
        messages: openRouterMessages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        error: `OpenRouter API error: ${response.status} — ${errText}`
      });
    }

    // ── STREAM RESPONSE BACK ──────────────────────────────────────────────────
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("X-Accel-Buffering", "no");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }

    res.end();

  } catch (err) {
    console.error("OpenRouter proxy error:", err);
    return res.status(500).json({
      error: "Failed to reach OpenRouter API: " + err.message
    });
  }
}
