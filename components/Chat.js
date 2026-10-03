"use client";
import { useEffect, useRef, useState } from "react";

const QUICK = [
  { label: "About me", q: "Who are you?" },
  { label: "Projects", q: "What are your projects?" },
  { label: "Skills", q: "What are your skills?" },
  { label: "Fun", q: "Tell me a fun fact" },
  { label: "Contact", q: "How do I contact you?" },
];

function useTypewriter(full, done) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    if (!full) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(full);
      return;
    }
    setShown("");
    let i = 0;
    const t = setInterval(() => {
      i += 6;
      setShown(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(t);
        done?.();
      }
    }, 16);
    return () => clearInterval(t);
  }, [full]);
  return shown;
}

function Card({ card }) {
  if (card.kind === "contact") {
    return (
      <a className="ans-card contact-card" href={`mailto:${card.title}`}>
        <span className="ans-card-title">{card.title}</span>
        <span className="ans-card-blurb">{card.blurb}</span>
      </a>
    );
  }
  return (
    <article className="ans-card">
      <h4>{card.title}</h4>
      <p>{card.blurb}</p>
      <div className="ans-card-meta">
        {card.tags.map((t) => (
          <span key={t}>{t}</span>
        ))}
        {card.metric && <strong>{card.metric}</strong>}
      </div>
    </article>
  );
}

function Answer({ text, cards }) {
  const shown = useTypewriter(text);
  const finished = shown.length >= text.length;
  return (
    <div className="answer" aria-live="polite">
      <p className="answer-text">{shown}{!finished && <span className="caret" aria-hidden="true" />}</p>
      {finished && cards.length > 0 && (
        <div className="ans-cards">
          {cards.map((c) => (
            <Card key={c.id} card={c} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Chat({ initial }) {
  const [turns, setTurns] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bottom = useRef(null);

  async function ask(q) {
    const query = q.trim();
    if (!query || busy) return;
    setInput("");
    setBusy(true);
    setTurns((t) => [...t, { role: "user", text: query }]);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: query }] }),
      });
      const data = await r.json();
      setTurns((t) => [...t, { role: "host", text: data.text, cards: data.cards ?? [], source: data.source }]);
    } catch {
      setTurns((t) => [...t, { role: "host", text: "The demo brain hiccuped — try a quick question below.", cards: [], source: "error" }]);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (initial) ask(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns]);

  return (
    <div className="chat">
      <div className="turns">
        {turns.length === 0 && (
          <p className="chat-hint">Ask anything below — or tap a quick question to start the interview.</p>
        )}
        {turns.map((t, i) =>
          t.role === "user" ? (
            <div key={i} className="bubble user">{t.text}</div>
          ) : (
            <div key={i} className="bubble host">
              <Answer text={t.text} cards={t.cards} />
              {t.source === "scripted" && <span className="src">demo brain*</span>}
            </div>
          )
        )}
        <div ref={bottom} />
      </div>
      <div className="quick">
        {QUICK.map((q) => (
          <button key={q.label} className="pill" onClick={() => ask(q.q)} disabled={busy}>
            {q.label}
          </button>
        ))}
      </div>
      <form
        className="askbox"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <label className="sr" htmlFor="chat-input">Ask me anything</label>
        <input
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything…"
          autoComplete="off"
        />
        <button type="submit" aria-label="Send question" disabled={busy || !input.trim()}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
    </div>
  );
}
