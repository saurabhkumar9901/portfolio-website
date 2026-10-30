import { profile } from "./profile.js";

function projectCards() {
  return profile.systems.map((s) => ({
    kind: "project",
    id: s.id,
    title: s.title,
    blurb: s.blurb,
    tags: s.tags,
    metric: s.metric,
  }));
}

function skillCards() {
  return profile.skillGroups.map((g, i) => ({
    kind: "skill",
    id: `skill-${i}`,
    title: g.name,
    blurb: g.items,
    tags: [],
    metric: "",
  }));
}

export function answerFor(rawQuery) {
  const q = (rawQuery || "").toLowerCase();
  if (/(project|build|built|work|portfolio|ship|working on|agent|rag)/.test(q)) {
    return { text: profile.answers.projects, cards: projectCards(), intent: "projects" };
  }
  if (/(skill|stack|tool|tech|able to|can you)/.test(q)) {
    return { text: profile.answers.skills, cards: skillCards(), intent: "skills" };
  }
  if (/(who are you|about|background|experience|yourself|hello|hi\b|hey)/.test(q)) {
    return { text: profile.answers.about, cards: [], intent: "about" };
  }
  if (/(fun|hobby|hobbies|fact|free time|outside)/.test(q)) {
    return {
      text: `${profile.answers.fun}\n• ${profile.fun[0]}\n• ${profile.fun[1]}`,
      cards: [],
      intent: "fun",
    };
  }
  if (/(contact|hire|email|call|reach|freelance|resume|cv|rate)/.test(q)) {
    return {
      text: profile.answers.contact,
      cards: [
        {
          kind: "contact",
          id: "contact",
          title: profile.contact.email,
          blurb: "Direct inbox.",
          tags: [],
          metric: "",
        },
      ],
      intent: "contact",
    };
  }
  return { text: profile.answers.fallback, cards: [], intent: "fallback" };
}

export function systemPrompt() {
  return [
    "You are the owner of this portfolio site, answering a visitor's question about yourself. You MUST write every answer in the first person as 'I' / 'my' / 'me'. Never write your own name, never write 'he' or 'his', never describe yourself in the third person.",
    "Use ONLY these profile facts; anything else is a placeholder you must label as such.",
    `About: ${profile.about}`,
    `Systems: ${profile.systems.map((s) => `${s.title} — ${s.blurb} (${s.metric})`).join(" | ")}`,
    `Skills: ${profile.skillGroups.map((g) => `${g.name}: ${g.items}`).join(" | ")}`,
    `Contact: ${profile.contact.email}`,
    "Correct example: 'I build retrieval systems and agents, and I shipped RAG apps at Briqlabs.'",
    "Wrong example: 'Saurabh builds retrieval systems...' or 'He shipped RAG apps...'.",
    "Keep answers under 120 words, plain text, no markdown headings. Only first person. Never mention 'Saurabh' or 'he'. Never invent employers, metrics, or links.",
  ].join("\n");
}

export function firstPersonify(text) {
  let t = String(text ?? "");
  t = t.replace(/\bSaurabh Kumar\b/g, "I");
  t = t.replace(/\bSaurabh\b/g, "I");
  t = t.replace(/\bHe's\b/g, "I'm");
  t = t.replace(/\bhe's\b/g, "I'm");
  t = t.replace(/\bHis\b/g, "My");
  t = t.replace(/\bhis\b/g, "my");
  t = t.replace(/\bHim\b/g, "Me");
  t = t.replace(/\bhim\b/g, "me");
  t = t.replace(/\bI is\b/g, "I am");
  t = t.replace(/\bI has\b/g, "I have");
  t = t.replace(/\bI builds\b/g, "I build");
  t = t.replace(/\bI specializes\b/g, "I specialize");
  t = t.replace(/\bHe /g, "I ");
  t = t.replace(/\bhe /g, "I ");
  t = t.replace(/\bI am I\b/g, "I am");
  t = t.replace(/\bI am I,/g, "I am");
  t = t.replace(/\bI am, an\b/g, "I am an");
  t = t.replace(/\bI I\b/g, "I");
  t = t.replace(/\bI, I\b/g, "I");
  return t;
}
