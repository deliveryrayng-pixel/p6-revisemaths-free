// api/claude.js — Vercel Serverless Function
// Place this file at: p6-maths/api/claude.js
//
// This proxies requests from the browser to Anthropic's API.
// Your API key stays on the server — never exposed to the student.
//
// Set your API key in Vercel dashboard:
//   Project → Settings → Environment Variables
//   Name: ANTHROPIC_API_KEY
//   Value: sk-ant-...

// Vercel automatically detects Edge Runtime from the Response/fetch usage

const ALLOWED_ORIGIN = "*"; // Lock this down to your Vercel domain in production
                             // e.g. "https://p6-maths.vercel.app"

const RATE_LIMIT = new Map(); // Simple in-memory rate limit (resets per edge instance)
const MAX_REQUESTS_PER_MIN = 10; // Per IP

export default async function handler(req) {
  // ── CORS ──────────────────────────────────────────────────────────────────
  const corsHeaders = {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  // ── RATE LIMITING ─────────────────────────────────────────────────────────
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  const windowStart = now - 60000; // 1-minute window

  if (!RATE_LIMIT.has(ip)) RATE_LIMIT.set(ip, []);
  const timestamps = RATE_LIMIT.get(ip).filter(t => t > windowStart);
  timestamps.push(now);
  RATE_LIMIT.set(ip, timestamps);

  if (timestamps.length > MAX_REQUESTS_PER_MIN) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please wait a minute and try again." }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // ── PARSE BODY ────────────────────────────────────────────────────────────
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // ── VALIDATE PAYLOAD ──────────────────────────────────────────────────────
  // Only allow the fields we need — prevents prompt injection from client
  const { messages, system, max_tokens } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "Invalid messages array" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Cap max_tokens to prevent abuse
  const safeMaxTokens = Math.min(max_tokens || 1000, 1000);

  // ── CALL ANTHROPIC ────────────────────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "API key not configured. Set ANTHROPIC_API_KEY in Vercel environment variables." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

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
      return new Response(
        JSON.stringify({ error: `Anthropic API error: ${anthropicRes.status}` }),
        { status: anthropicRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── STREAM RESPONSE BACK ───────────────────────────────────────────────
    // Pass the SSE stream directly through to the browser
    return new Response(anthropicRes.body, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to reach Anthropic API. Check server logs." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}
