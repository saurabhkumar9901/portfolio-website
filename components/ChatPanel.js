"use client";
import { useEffect, useRef, useState } from "react";

const QUICK = [
  { label: "Me", q: "Tell me about yourself", icon: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="#0e9f6e" strokeWidth="1.8" /><circle cx="9" cy="10.5" r="1.2" fill="#0e9f6e" /><circle cx="15" cy="10.5" r="1.2" fill="#0e9f6e" /><path d="M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8" stroke="#0e9f6e" strokeWidth="1.8" strokeLinecap="round" /></svg> },
  { label: "Projects", q: "What are your projects?", icon: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="7" width="17" height="13" rx="2.5" stroke="#4d7c0f" strokeWidth="1.8" /><path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7" stroke="#4d7c0f" strokeWidth="1.8" /><path d="M3.5 12.5h17" stroke="#4d7c0f" strokeWidth="1.8" /></svg> },
  { label: "Skills", q: "What are your skills?", icon: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Z" stroke="#6d5ef0" strokeWidth="1.8" strokeLinejoin="round" /><path d="m4.5 12.5 7.5 4 7.5-4" stroke="#6d5ef0" strokeWidth="1.8" strokeLinejoin="round" /><path d="m4.5 16.5 7.5 4 7.5-4" stroke="#6d5ef0" strokeWidth="1.8" strokeLinejoin="round" /></svg> },
  { label: "Fun", q: "Tell me a fun fact", icon: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4" stroke="#c262b8" strokeWidth="1.8" strokeLinecap="round" /><path d="m6.5 6.5 2.5 2.5M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5" stroke="#c262b8" strokeWidth="1.8" strokeLinecap="round" /></svg> },
  { label: "Contact", q: "How do I contact you?", icon: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="8" r="3.2" stroke="#b7791f" strokeWidth="1.8" /><path d="M3.5 19c.6-3 2.8-4.8 5.5-4.8s4.9 1.8 5.5 4.8" stroke="#b7791f" strokeWidth="1.8" strokeLinecap="round" /><circle cx="17" cy="9" r="2.4" stroke="#b7791f" strokeWidth="1.6" /><path d="M15.5 14.6c2.3.2 4 1.8 4.5 4.4" stroke="#b7791f" strokeWidth="1.6" strokeLinecap="round" /></svg> },
];

const LIMIT = 5;
const LIMIT_TEXT = "You've reached your message limit.";
const NET_FAIL = "The bot is unreachable right now - try again, or email saurabhkumar9901@gmail.com.";

function linkify(h) {
  const saved = [];
  h = h.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, (m, t, u) => {
    saved.push(`<a href="${u}" target="_blank" rel="noopener noreferrer">${t}</a>`);
    return `\u0001${saved.length - 1}\u0001`;
  });
  h = h.replace(/(^|[\s(>])(https?:\/\/[^\s<>"')\]]+)/g, (m, pre, u) => {
    let url = u;
    let trail = "";
    while (/[.,;:!?)\]]$/.test(url)) {
      trail = url.slice(-1) + trail;
      url = url.slice(0, -1);
    }
    return `${pre}<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>${trail}`;
  });
  return h.replace(/\u0001(\d+)\u0001/g, (m, n) => saved[Number(n)]);
}

function renderMd(text) {
  let h = String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  h = linkify(h);
  h = h.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  const lines = h.split("\n");
  let out = "";
  let inList = false;
  for (const line of lines) {
    const m = line.match(/^\s*[-*]\s+(.*)$/);
    if (m) {
      if (!inList) {
        out += "<ul>";
        inList = true;
      }
      out += `<li>${m[1]}</li>`;
    } else {
      if (inList) {
        out += "</ul>";
        inList = false;
      }
      out += `${line}<br>`;
    }
  }
  if (inList) out += "</ul>";
  return out.replace(/(<br>)+$/, "");
}

function StreamText({ text }) {
  const lines = String(text).split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <span
          key={i}
          className="sline"
          dangerouslySetInnerHTML={{ __html: renderMd(line) || "&nbsp;" }}
        />
      ))}
    </>
  );
}

export default function ChatPanel({ initialQuestion }) {
  const [turns, setTurns] = useState([]);
  const [value, setValue] = useState("");
  const [thinking, setThinking] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const booted = useRef(false);
  const busy = useRef(false);
  const chatRef = useRef(null);
  const answered = turns.filter((t) => t.a).length;
  const limited = answered >= LIMIT;
  const chipsVisible = !dismissed && !limited && answered > 0;
  const streaming = turns.some((t) => t.stream !== undefined && !t.a);

  function syncFade() {
    const el = chatRef.current;
    if (!el) return;
    el.classList.toggle("scrolled", el.scrollTop > 32);
  }

  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 140;
    if (nearBottom) el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
    syncFade();
  }, [turns, thinking]);

  async function ask(q) {
    const clean = q.trim();
    if (!clean || busy.current || limited) return;
    busy.current = true;
    setThinking(true);
    const next = [...turns, { q: clean, a: null }].slice(-LIMIT);
    setTurns(next);
    const messages = next.flatMap((t) => (
      t.a ? [{ role: "user", content: t.q }, { role: "assistant", content: t.a }] : [{ role: "user", content: t.q }]
    ));
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      const ctype = r.headers.get("content-type") || "";
      if (!ctype.includes("text/event-stream")) {
        const data = await r.json();
        const text = (data && data.text ? String(data.text) : "").trim() || NET_FAIL;
        const live = data && data.source === "adk";
        fill({ a: text, tag: live ? "Gemini" : "Quick answer", live });
      } else {
        setTurns((t) => t.map((turn) => (turn.a ? turn : { ...turn, stream: "" })));
        const reader = r.body.getReader();
        const dec = new TextDecoder();
        let buf = "";
        for (; ;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          const frames = buf.split("\n\n");
          buf = frames.pop();
          for (const frame of frames) {
            const line = frame.split("\n").find((l) => l.startsWith("data:"));
            if (!line) continue;
            let msg = null;
            try {
              msg = JSON.parse(line.slice(5).trim());
            } catch {
              continue;
            }
            if (msg.delta) {
              const d = msg.delta;
              setTurns((t) => t.map((turn) => (turn.stream !== undefined && !turn.a ? { ...turn, stream: turn.stream + d } : turn)));
            } else if (msg.done && msg.text) {
              setTurns((t) => t.map((turn) => (turn.stream !== undefined && !turn.a ? { ...turn, a: msg.text, tag: "Quick answer", live: false } : turn)));
            }
          }
        }
        setTurns((t) => t.map((turn) => {
          if (turn.a || turn.stream === undefined) return turn;
          if (turn.stream) return { ...turn, a: turn.stream, tag: "Gemini", live: true };
          return { ...turn, a: NET_FAIL, tag: "Offline", live: false };
        }));
      }
    } catch {
      setTurns((t) => t.map((turn) => (turn.a ? turn : { ...turn, a: NET_FAIL, tag: "Offline", live: false })));
    } finally {
      busy.current = false;
      setThinking(false);
    }
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
    <div className="chatopen">
      <div className="thread" aria-live="polite" ref={chatRef} onScroll={syncFade}>
        {turns.length === 0 && !thinking && (
          <p className="greet">Hey there! <span aria-hidden="true">👋</span> How&apos;s it going? What brings you to my little corner of the internet?</p>
        )}
        {turns.map((t, i) => (
          <div key={i} style={{ display: "contents" }}>
            <div className="bubble q">{t.q}</div>
            {t.a && <div className="bot-plain">{!t.live && <span className="tag">{t.tag} - demo</span>}<span dangerouslySetInnerHTML={{ __html: renderMd(t.a) }} /></div>}
            {!t.a && t.stream !== undefined && <div className="bot-plain streaming"><StreamText text={t.stream} /></div>}
          </div>
        ))}
        {thinking && !streaming && <div className="bubble a thinking-bubble"><span className="typing" aria-label="Thinking"><i /><i /><i /></span></div>}
      </div>
      <div className="dock">
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
            placeholder="Ask me anything..."
            aria-label="Ask me anything"
            maxLength={140}
            disabled={limited}
            readOnly={limited}
          />
          <button type="submit" aria-label="Send question" disabled={limited || thinking}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 16V4M5.5 8.5 10 4l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
