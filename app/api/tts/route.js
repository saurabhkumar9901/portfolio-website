import { NextResponse } from "next/server";
import { MAX_CHARS, VOICE_MODEL, toSpeech } from "../../../lib/voice.js";

export const runtime = "nodejs";

// In-memory token bucket. Per-instance only, so this is a speed bump across
// Vercel's fleet rather than a wall — enough for a portfolio, not a product.
const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 30;
const hits = new Map();

function allowed(ip) {
  const now = Date.now();
  const record = hits.get(ip);
  if (!record || now - record.start > WINDOW_MS) {
    hits.set(ip, { start: now, count: 1 });
    if (hits.size > 5000) hits.clear();
    return true;
  }
  if (record.count >= LIMIT) return false;
  record.count += 1;
  return true;
}

function clientIp(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function GET() {
  return NextResponse.json({ enabled: Boolean(process.env.DEEPGRAM_API_KEY), voice: VOICE_MODEL });
}

export async function POST(req) {
  const key = process.env.DEEPGRAM_API_KEY;
  if (!key) return NextResponse.json({ error: "voice disabled" }, { status: 503 });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const text = toSpeech(body?.text);
  if (!text) return NextResponse.json({ error: "empty text" }, { status: 400 });
  if (text.length > MAX_CHARS) return NextResponse.json({ error: "text too long" }, { status: 413 });

  if (!allowed(clientIp(req))) return NextResponse.json({ error: "rate limited" }, { status: 429 });

  const url = new URL("https://api.deepgram.com/v1/speak");
  url.searchParams.set("model", VOICE_MODEL);
  url.searchParams.set("encoding", "mp3");
  url.searchParams.set("speed", "1");

  let upstream;
  try {
    upstream = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Token ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    return NextResponse.json({ error: "upstream unreachable" }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "synthesis failed" }, { status: 502 });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
      "X-Voice": VOICE_MODEL,
    },
  });
}
