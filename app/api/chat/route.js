import { NextResponse } from "next/server";
import { answerFor, systemPrompt } from "../../../lib/brain.js";

export async function POST(req) {
  let messages = [];
  try {
    messages = (await req.json()).messages ?? [];
  } catch {
    return NextResponse.json({ text: "Send { messages: [{ role, content }] }.", cards: [], source: "error" }, { status: 400 });
  }
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const scripted = answerFor(lastUser);

  if (!process.env.LLM_API_KEY) {
    return NextResponse.json({ ...scripted, source: "scripted" });
  }
  try {
    const base = (process.env.LLM_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "");
    const model = process.env.LLM_MODEL ?? "gpt-4o-mini";
    const r = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: systemPrompt() }, ...messages.slice(-8)],
        temperature: 0.4,
        max_tokens: 300,
      }),
    });
    if (!r.ok) throw new Error(`LLM ${r.status}`);
    const data = await r.json();
    const text = data.choices?.[0]?.message?.content?.trim() || scripted.text;
    return NextResponse.json({ text, cards: scripted.cards, source: "llm" });
  } catch {
    return NextResponse.json({ ...scripted, source: "scripted" });
  }
}
