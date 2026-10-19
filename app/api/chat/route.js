import { NextResponse } from "next/server";
import { answerFor } from "../../../lib/brain.js";
import { agentStream } from "../../../lib/agent.js";

export async function POST(req) {
  let messages = [];
  try {
    messages = (await req.json()).messages ?? [];
  } catch {
    return NextResponse.json({ text: "Send { messages: [{ role, content }] }.", cards: [], source: "error" }, { status: 400 });
  }
  const scripted = answerFor([...messages].reverse().find((m) => m.role === "user")?.content ?? "");

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ ...scripted, source: "scripted" });
  }
  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      const send = (obj) => controller.enqueue(enc.encode(`data: ${JSON.stringify(obj)}\n\n`));
      try {
        for await (const delta of agentStream(messages)) {
          send({ delta });
        }
        send({ done: true, source: "adk" });
      } catch {
        send({ done: true, source: "error", text: scripted.text, intent: scripted.intent });
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
