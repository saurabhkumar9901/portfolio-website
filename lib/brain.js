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
    return { text: profile.answers.projects, cards: projectCards() };
  }
  if (/(skill|stack|tool|tech|able to|can you)/.test(q)) {
    return { text: profile.answers.skills, cards: skillCards() };
  }
  if (/(who are you|about|background|experience|yourself|hello|hi\b|hey)/.test(q)) {
    return { text: profile.answers.about, cards: [] };
  }
  if (/(fun|hobby|hobbies|fact|free time|outside)/.test(q)) {
    return {
      text: `${profile.answers.fun}\n• ${profile.fun[0]}\n• ${profile.fun[1]}`,
      cards: [],
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
          blurb: "Replies within 48h* — placeholder inbox.",
          tags: [],
          metric: "",
        },
      ],
    };
  }
  return { text: profile.answers.fallback, cards: [] };
}

export function systemPrompt() {
  return [
    `You are ${profile.name}, an ${profile.title}, answering visitors on your portfolio site.`,
    "Use ONLY these profile facts; anything else is a placeholder you must label as such.",
    `About: ${profile.about}`,
    `Systems: ${profile.systems.map((s) => `${s.title} — ${s.blurb} (${s.metric})`).join(" | ")}`,
    `Skills: ${profile.skillGroups.map((g) => `${g.name}: ${g.items}`).join(" | ")}`,
    `Contact: ${profile.contact.email}`,
    "Keep answers under 120 words, plain text, no markdown headings. Never invent employers, metrics, or links.",
  ].join("\n");
}
