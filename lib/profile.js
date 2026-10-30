export const profile = {
  name: "Saurabh Kumar",
  greeting: "Hey, I'm Saurabh Kumar",
  title: "AI Developer",
  watermark: "SAURABH",
  about:
    "Saurabh Kumar — AI Developer based in Noida, currently Founding AI Engineer at ENXT AI. Previously AI Developer at Briqlabs, where he shipped RAG applications that cut document analysis time by 60%. Software Developer with 50+ repos and counting.",
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
    "Saurabh has over 50 public repositories on GitHub and builds, breaks, and ships code daily.",
  ],
  contact: {
    email: "saurabhkumar9901@gmail.com",
    links: [
      { label: "GitHub — @saurabhkumar9901", href: "https://github.com/saurabhkumar9901" },
      { label: "LinkedIn — /in/saurabh-kumar-11june", href: "https://www.linkedin.com/in/saurabh-kumar-11june" },
      { label: "Resume", href: "https://drive.google.com/file/d/10ozDx-0ZGzVPYMG01vDJRQOoUML0l4U_/view?usp=drivesdk" },
    ],
  },
  answers: {
    projects:
      "A little of everything across the stack — here are the four placeholder systems. Every metric marked * is synthetic; the real ones (and links) land here when you wire up your proof.",
    skills:
      "Three instruments, one engineer. I keep the evals honest and the deploys boring — details per group below.",
    about: "",
    fun: "Off the record:",
    contact:
      "Fastest way to reach me: one paragraph with the problem, the data, and what good looks like. Email, GitHub, LinkedIn, and resume below are live.",
    fallback:
      "Good question — my scripted demo brain only knows about me, my projects, my skills, fun facts, and contact details. Try one of the quick questions, or plug in an LLM key (see .env.example) and ask me anything for real.",
  },
};

profile.answers.about = profile.about;
