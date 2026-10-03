"use client";
import { useEffect, useRef, useState } from "react";

const KNOWLEDGE = [
  { keys: ["skill", "stack", "tech", "good at", "do"], tag: "Skills", text: "Placeholder answer: LLM engineering (RAG, agents, evals), ML training (fine-tunes, datasets, ablations), and full-stack delivery (Next.js + Python). Swap this logic with your real bio." },
  { keys: ["project", "work", "built", "portfolio", "system"], tag: "Projects", text: "Placeholder answer: 4 demo systems below — Atlas RAG, Relay Agent, Forge FT, Shipkit AI. Scroll to Systems and replace them with your real ships." },
  { keys: ["hire", "freelance", "contact", "email", "call", "work with"], tag: "Contact", text: "Placeholder answer: email hello@yourname.dev or jump to the Contact section to book a call. Wire your real address before shipping." },
  { keys: ["experience", "background", "who", "about", "yourself", "you"], tag: "About", text: "Placeholder answer: an AI developer covering training-to-product. Check the Build log for the timeline, then replace it with your story." },
  { keys: ["fun", "hobby", "free time", "fact"], tag: "Fun", text: "Placeholder answer: I eval prompts for fun and argue with loss curves. Replace with your actual human interests." },
  { keys: ["hi", "hello", "hey"], tag: "Hello", text: "Hey! Ask about my skills, projects, experience, or how to contact me — all answers are placeholders until the owner fills them in." },
];

const QUICK = [
  { label: "Me", q: "Tell me about yourself", icon: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="#0e9f6e" strokeWidth="1.8" /><circle cx="9" cy="10.5" r="1.2" fill="#0e9f6e" /><circle cx="15" cy="10.5" r="1.2" fill="#0e9f6e" /><path d="M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8" stroke="#0e9f6e" strokeWidth="1.8" strokeLinecap="round" /></svg> },
  { label: "Projects", q: "What are your projects?", icon: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="7" width="17" height="13" rx="2.5" stroke="#4d7c0f" strokeWidth="1.8" /><path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7" stroke="#4d7c0f" strokeWidth="1.8" /><path d="M3.5 12.5h17" stroke="#4d7c0f" strokeWidth="1.8" /></svg> },
  { label: "Skills", q: "What are your skills?", icon: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Z" stroke="#6d5ef0" strokeWidth="1.8" strokeLinejoin="round" /><path d="m4.5 12.5 7.5 4 7.5-4" stroke="#6d5ef0" strokeWidth="1.8" strokeLinejoin="round" /><path d="m4.5 16.5 7.5 4 7.5-4" stroke="#6d5ef0" strokeWidth="1.8" strokeLinejoin="round" /></svg> },
  { label: "Fun", q: "Tell me a fun fact", icon: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4" stroke="#c262b8" strokeWidth="1.8" strokeLinecap="round" /><path d="m6.5 6.5 2.5 2.5M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5" stroke="#c262b8" strokeWidth="1.8" strokeLinecap="round" /></svg> },
  { label: "Contact", q: "How do I contact you?", icon: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="8" r="3.2" stroke="#b7791f" strokeWidth="1.8" /><path d="M3.5 19c.6-3 2.8-4.8 5.5-4.8s4.9 1.8 5.5 4.8" stroke="#b7791f" strokeWidth="1.8" strokeLinecap="round" /><circle cx="17" cy="9" r="2.4" stroke="#b7791f" strokeWidth="1.6" /><path d="M15.5 14.6c2.3.2 4 1.8 4.5 4.4" stroke="#b7791f" strokeWidth="1.6" strokeLinecap="round" /></svg> },
];

const FALLBACK = "Placeholder brain: I only know skills, projects, experience, contact, and fun facts so far. Try one of those — or ask the human directly via Contact.";
const LIMIT = 5;
const LIMIT_TEXT = "You've reached your message limit.";

export default function ChatPanel({ initialQuestion }) {
  const [turns, setTurns] = useState([]);
  const [value, setValue] = useState("");
  const [thinking, setThinking] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const timer = useRef(null);
  const booted = useRef(false);
  const answered = turns.filter((t) => t.a).length;
  const limited = answered >= LIMIT;
  const chipsVisible = !dismissed && !limited && answered > 0;

  function answer(q) {
    const lower = q.toLowerCase();
    return KNOWLEDGE.find((k) => k.keys.some((key) => lower.includes(key))) || { tag: "Placeholder", text: FALLBACK };
  }

  function ask(q) {
    const clean = q.trim();
    if (!clean || thinking || limited) return;
    const hit = answer(clean);
    setThinking(true);
    setTurns((t) => [...t, { q: clean, a: null }].slice(-LIMIT));
    timer.current = setTimeout(() => {
      setThinking(false);
      setTurns((t) => t.map((turn) => (turn.a ? turn : { ...turn, a: hit.text, tag: hit.tag })));
    }, 700);
  }

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    if (initialQuestion) ask(initialQuestion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submit(e) {
    e.preventDefault();
    if (!value.trim()) return;
    ask(value);
    setValue("");
  }

  return (
    <div className="chatpanel">
      <div className="chat" aria-live="polite">
        {turns.map((t, i) => (
          <div key={i} style={{ display: "contents" }}>
            <div className="bubble q">{t.q}</div>
            {t.a && <div className="bubble a"><span className="tag">{t.tag} · placeholder</span>{t.a}</div>}
          </div>
        ))}
        {thinking && <div className="bubble a"><span className="typing" aria-label="Thinking"><i /><i /><i /></span></div>}
      </div>
      {chipsVisible && (
        <button type="button" className="quick-toggle" onClick={() => setDismissed(true)} aria-expanded="true">
          <svg viewBox="0 0 12 12" aria-hidden="true">
            <path d="m2 4 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Hide quick questions
        </button>
      )}
      {chipsVisible && (
        <div className="quick" role="group" aria-label="Quick questions">
          {QUICK.map((item) => (
            <button key={item.label} type="button" className="quick-chip" onClick={() => ask(item.q)} disabled={thinking}>
              {item.icon}<span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
      <form className={`askbar${limited ? " is-limited" : ""}`} onSubmit={submit} role="search" aria-label="Ask me anything">
        <input
          value={limited ? LIMIT_TEXT : value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask me anything…"
          aria-label="Ask me anything"
          maxLength={140}
          disabled={limited}
          readOnly={limited}
        />
        <button type="submit" aria-label="Send question" disabled={limited || thinking}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 10h11M10 5.5 14.5 10 10 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
    </div>
  );
}
