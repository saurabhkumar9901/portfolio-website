// Pre-render the finite scripted answers to committed MP3s.
// Usage: node scripts/prerender-audio.mjs
// Requires DEEPGRAM_API_KEY in .env.local (or the environment).
//
// Regenerate whenever lib/profile.js changes — the manifest keys are the
// intent names returned by lib/brain.js, not hashes of the text.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(root, "public", "audio");

const VOICE_MODEL = "aura-2-orpheus-en";
const INTENTS = ["about", "projects", "skills", "fun", "contact", "fallback"];

async function loadEnv() {
  const file = path.join(root, ".env.local");
  if (!existsSync(file)) return;
  const text = await readFile(file, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const value = m[2].replace(/^["']|["']$/g, "");
    if (!process.env[m[1]]) process.env[m[1]] = value;
  }
}

const { answerFor } = await import("../lib/brain.js");
const { toSpeech } = await import("../lib/voice.js");

// The same questions the quick chips and cards use, so the intent lookup and
// the committed clips always agree.
const PROMPTS = {
  about: "Tell me about yourself",
  projects: "What are your projects?",
  skills: "What are your skills?",
  fun: "Tell me a fun fact",
  contact: "How do I contact you?",
  fallback: "What is the meaning of life?",
};

await loadEnv();
const key = process.env.DEEPGRAM_API_KEY;
if (!key) {
  console.error("DEEPGRAM_API_KEY missing. Add it to .env.local and re-run.");
  process.exit(1);
}

await mkdir(OUT, { recursive: true });

const manifest = {};
for (const intent of INTENTS) {
  const answer = answerFor(PROMPTS[intent]);
  if (answer.intent !== intent) {
    console.warn(`! ${intent}: brain routed to "${answer.intent}" — skipping`);
    continue;
  }
  const text = toSpeech(answer.text);
  if (!text) {
    console.warn(`! ${intent}: nothing to speak`);
    continue;
  }

  const url = new URL("https://api.deepgram.com/v1/speak");
  url.searchParams.set("model", VOICE_MODEL);
  url.searchParams.set("encoding", "mp3");
  url.searchParams.set("speed", "1");

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Token ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    console.error(`! ${intent}: ${res.status} ${await res.text()}`);
    continue;
  }
  const bytes = Buffer.from(await res.arrayBuffer());
  await writeFile(path.join(OUT, `${intent}.mp3`), bytes);
  manifest[intent] = { file: `${intent}.mp3`, chars: text.length, bytes: bytes.length };
  console.log(`✓ ${intent}.mp3  ${text.length} chars  ${(bytes.length / 1024).toFixed(1)} KB`);
}

await writeFile(path.join(OUT, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`\nWrote ${Object.keys(manifest).length} clips to public/audio/`);
