export const profile = {
  name: "Your Name",
  greeting: "Hey, I'm Your Name",
  title: "AI Engineer",
  watermark: "YOURNAME",
  about:
    "I'm a placeholder AI engineer — I build LLM apps, train and fine-tune models, and ship them as production web apps. This profile is synthetic demo content: replace every fact below with your real story.",
  systems: [
    {
      id: "atlas",
      title: "Atlas RAG",
      blurb: "Grounded answers over 12k docs. Hybrid retrieval, rerank, citation-forced generation.",
      tags: ["RAG", "Evals"],
      metric: "0.94* faithfulness",
    },
    {
      id: "relay",
      title: "Relay Agent",
      blurb: "Multi-step ops agent with approval gates on every write. Fully traced.",
      tags: ["Agents", "Tool use"],
      metric: "87%* task success",
    },
    {
      id: "forge",
      title: "Forge FT",
      blurb: "Fine-tune loop with ablations and a 214-case regression suite.",
      tags: ["Fine-tuning", "Datasets"],
      metric: "+6.2* eval delta",
    },
    {
      id: "shipkit",
      title: "Shipkit AI",
      blurb: "Full-stack reference for shipping LLM features without invoice shock.",
      tags: ["Next.js", "Streaming"],
      metric: "-63%* cost / 1k req",
    },
  ],
  skillGroups: [
    { name: "LLM Engineering", items: "RAG · agents · evals · guardrails" },
    { name: "ML & Training", items: "datasets · LoRA fine-tunes · ablations" },
    { name: "Full-stack Delivery", items: "Next.js · Python APIs · streaming UI" },
  ],
  fun: [
    "Placeholder fun fact one — replace with something human (e.g. espresso dial-in rituals).",
    "Placeholder fun fact two — replace with a hobby, a side quest, a hot take.",
  ],
  contact: {
    email: "hello@yourname.dev",
    links: [
      { label: "GitHub — @yourhandle*", href: "#contact" },
      { label: "LinkedIn — /in/yourname*", href: "#contact" },
      { label: "Resume PDF*", href: "#contact" },
    ],
  },
  answers: {
    projects:
      "A little of everything across the stack — here are the four placeholder systems. Every metric marked * is synthetic; the real ones (and links) land here when you wire up your proof.",
    skills:
      "Three instruments, one engineer. I keep the evals honest and the deploys boring — details per group below.",
    about: "",
    fun: "Off the record, placeholder edition:",
    contact:
      "Fastest way to reach me: one paragraph with the problem, the data, and what good looks like. Placeholder inbox below — swap in the real one before shipping.",
    fallback:
      "Good question — my scripted demo brain only knows about me, my projects, my skills, fun facts, and contact details. Try one of the quick questions, or plug in an LLM key (see .env.example) and ask me anything for real.",
  },
};

profile.answers.about = profile.about;
