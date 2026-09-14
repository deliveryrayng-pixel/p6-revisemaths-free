// api/claude.js — Vercel Serverless Function (Node.js runtime)
// Proxies requests from the browser to Anthropic's API
// API key stays on the server — never exposed to students

export default async function handler(req, res) {
  // ── CORS ────────────────────────────────────────────────────────────────────
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── RATE LIMITING (simple) ───────────────────────────────────────────────────
  // Vercel serverless functions are stateless so we can't do persistent rate
  // limiting here — use Vercel's built-in rate limiting in the dashboard instead

  // ── PARSE BODY ───────────────────────────────────────────────────────────────
  const { messages, system, max_tokens } = req.body || {};

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Invalid messages array" });
  }

  // Cap max_tokens to prevent abuse
  const safeMaxTokens = Math.min(max_tokens || 1000, 1000);

  // ── CHECK API KEY ────────────────────────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "API key not configured. Add ANTHROPIC_API_KEY to Vercel environment variables."
    });
  }

  // ── CALL ANTHROPIC ────────────────────────────────────────────────────────────
  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: safeMaxTokens,
        stream: true,
        system: system || "",
        messages,
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return res.status(anthropicRes.status).json({
        error: `Anthropic API error: ${anthropicRes.status} — ${errText}`
      });
    }

    // ── STREAM RESPONSE BACK ──────────────────────────────────────────────────
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("X-Accel-Buffering", "no");

    // Pipe the stream directly to the response
    const reader = anthropicRes.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }

    res.end();

  } catch (err) {
    console.error("API proxy error:", err);
    return res.status(500).json({
      error: "Failed to reach Anthropic API: " + err.message
    });
  }
}
