import fs from "node:fs";
import path from "node:path";
import { FunctionTool, InMemoryRunner, LlmAgent, StreamingMode } from "@google/adk";
import { githubRepos } from "./github.js";

const MODEL = "gemini-3.5-flash-lite";

let profileMd = "";
try {
  profileMd = fs.readFileSync(path.join(process.cwd(), "PROFILE.md"), "utf8");
} catch {
  profileMd = "Saurabh Kumar — AI Developer based in Noida.";
}

const githubTool = new FunctionTool({
  name: "github_repos",
  description:
    "Look up Saurabh Kumar's live public GitHub repositories (names, languages, stars, descriptions). Use when asked about projects, repos, code, or GitHub.",
  execute: async () => githubRepos(),
});

const agent = new LlmAgent({
  name: "portfolio_assistant",
  model: MODEL,
  instruction: `You answer visitor questions on Saurabh Kumar's portfolio site.

${profileMd}

Rules: answer ONLY from the profile facts above plus the github_repos tool. Anything else: say you don't know and point to the contact details above (email/phone/GitHub/LinkedIn). Never invent employers, metrics, links, dates, or repo names. Under 120 words, plain text, no markdown headings.`,
  tools: [githubTool],
});

function foldHistory(messages) {
  const recent = messages.slice(-8);
  return recent
    .map((m) => `${m.role === "user" ? "Visitor" : "Saurabh-bot"}: ${m.content}`)
    .join("\n");
}

export async function* agentStream(messages) {
  const runner = new InMemoryRunner({ agent });
  let sent = "";
  const gen = runner.runEphemeral({
    userId: "visitor",
    newMessage: { parts: [{ text: foldHistory(messages) }] },
    runConfig: { streamingMode: StreamingMode.SSE },
  });
  for await (const event of gen) {
    const parts = event.content?.parts ?? [];
    for (const part of parts) {
      if (typeof part.text !== "string" || !part.text) continue;
      let delta = part.text;
      if (delta.startsWith(sent)) delta = delta.slice(sent.length);
      if (!delta) continue;
      sent += delta;
      yield delta;
    }
  }
}
