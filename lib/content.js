export const systems = [
  {
    name: "Atlas RAG — grounded answers over 12k docs",
    desc: "Hybrid retrieval, cross-encoder rerank, citation-forced generation. Eval harness tracks faithfulness and latency per deploy. Placeholder system — swap in your real retrieval stack and numbers.",
    tags: ["RAG", "Evals", "Next.js + Python"],
    metrics: [["Faithfulness", "0.94*"], ["p95 latency", "1.8s*"], ["Corpus", "12.4k*"]],
    lamps: ["g", "g", "a"],
    live: true,
  },
  {
    name: "Relay Agent — multi-step ops that ask before acting",
    desc: "Tool-using agent for support ops: plans, calls 6 tools, pauses for approval on writes. Full trace per run, replayable. Placeholder — replace with your agent framework and guardrails.",
    tags: ["Agents", "Tool use", "Traces"],
    metrics: [["Task success", "87%*"], ["Approval rate", "100%"], ["Tools", "6"]],
    lamps: ["g", "g", "g"],
    flows: [["plan → act → observe", 81], ["approval gate on writes", 100], ["audit trace export", 95]],
  },
  {
    name: "Forge FT — fine-tune loop with honest evals",
    desc: "Dataset curation, LoRA fine-tune, ablation log, regression suite before any merge. Placeholder — drop in your base model, dataset size, and delta metrics.",
    tags: ["Fine-tuning", "Datasets", "Ablations"],
    metrics: [["Eval delta", "+6.2*"], ["Regressions", "0"], ["Dataset", "48k*"]],
    lamps: ["g", "a", "g"],
    flows: [["curate → train → ablate", 69], ["regression suite × 214", 97], ["merge only on green", 100]],
  },
  {
    name: "Shipkit AI — ship LLM features without the invoice shock",
    desc: "Caching, routing between small/large models, streaming UI, cost guardrails. Full-stack reference build. Placeholder — replace with your production cost and latency wins.",
    tags: ["Full-stack", "Caching", "Streaming"],
    metrics: [["Cost / 1k req", "-63%*"], ["TTFT", "0.4s*"], ["Uptime", "99.9*"]],
    lamps: ["g", "g", "g"],
    flows: [["route small → large", 83], ["cache + stream", 90], ["budget alarms", 100]],
  },
];

export const instruments = [
  {
    name: "LLM Engineering",
    sub: "RAG, agents, evals, guardrails.",
    tools: ["Retrieval + rerank + citation loops", "Tool-using agents with approval gates", "Faithfulness, latency, cost suites"],
    never: "Trace per run, regression suite green, grounded answers or explicit abstain.",
  },
  {
    name: "ML & Training",
    sub: "Data, fine-tunes, ablations.",
    tools: ["Dataset curation + dedup + labeling", "LoRA / full fine-tunes, ablations", "Benchmark deltas, error analysis"],
    never: "Baseline comparison, held-out evals, and a written note on what got worse.",
  },
  {
    name: "Full-stack Delivery",
    sub: "Next.js + Python APIs in prod.",
    tools: ["Next.js App Router, streaming UI", "FastAPI / queues / vector stores", "Cache, routing, budget alarms"],
    never: "Auth, rate limits, cost dashboard, and a rollback plan.",
  },
];

export const logRows = [
  { time: "2026 — now", html: "<strong>Placeholder role — AI Engineer.</strong> Own RAG + agent stack, eval gate on every deploy. Replace with employer, scope, and one measured win." },
  { time: "2024 — 2025", html: "Placeholder — shipped 3 LLM features to prod. Retrieval quality, streaming UX, cost routing. Replace with links and traces." },
  { time: "2023 — 2024", html: "Placeholder — ML foundations. Training, datasets, evals. Replace with courses, papers, or models." },
];

export const funRows = [
  { title: "Currently learning*", text: "Placeholder — e.g. inference optimization, vLLM internals, and saying no to scope creep." },
  { title: "Off the keyboard*", text: "Placeholder — e.g. long runs, espresso experiments, and collecting mechanical keyboards." },
  { title: "Hot take*", text: "Placeholder — evals are the whole game; demos are the trailer, not the movie." },
];

export const contactLinks = [
  { href: "mailto:hello@yourname.dev", label: "hello@yourname.dev" },
  { href: "/contact", label: "Book a 25-min call*" },
  { href: "/contact", label: "GitHub — @yourhandle*" },
  { href: "/contact", label: "LinkedIn — /in/yourname*" },
  { href: "/contact", label: "Resume PDF*" },
];
