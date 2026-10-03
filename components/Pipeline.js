"use client";
import { useEffect, useRef, useState } from "react";

const NODES = [
  { id: "query", name: "Query", detail: "user_0142 · 38 tok" },
  { id: "retrieve", name: "Retrieve", detail: "8/120 chunks · 0.41s" },
  { id: "rerank", name: "Rerank", detail: "cross-enc · top 3" },
  { id: "generate", name: "Generate", detail: "412 tok · cited" },
];

const TRACE = [
  ["t-dim", "› run ai-2026-084 · model placeholder-llm · temp 0.2"],
  ["t-signal", "› retrieve: hybrid search over 12,400 docs → 8 candidates"],
  ["t-dim", "› rerank: scores 0.91 / 0.87 / 0.84 · dropped 5"],
  ["t-signal", "› generate: 412 tokens · 3 citations · grounded ✓"],
  ["t-dim", "› eval: faithfulness 0.94 · latency 1.8s · pass"],
];

export default function Pipeline() {
  const [phase, setPhase] = useState(-1);
  const [running, setRunning] = useState(false);
  const [tokens, setTokens] = useState(0);
  const timer = useRef(null);

  function run() {
    if (running) return;
    setRunning(true);
    setPhase(0);
    setTokens(0);
    let p = 0;
    timer.current = setInterval(() => {
      p += 1;
      if (p > NODES.length) {
        clearInterval(timer.current);
        setRunning(false);
        return;
      }
      setPhase(p);
      setTokens((t) => (p >= NODES.length ? 412 : t + 97));
    }, 650);
  }

  useEffect(() => {
    run();
    return () => clearInterval(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="dag" role="img" aria-label="RAG pipeline diagram: query, retrieve, rerank, generate">
        {NODES.map((n, i) => (
          <div key={n.id} style={{ display: "contents" }}>
            <div className={`node ${phase > i ? "done" : phase === i ? "active" : ""}`}>
              <div className="n-top">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span>{phase > i ? "done" : phase === i ? "live" : "idle"}</span>
              </div>
              <div className="n-name">{n.name}</div>
              <div className="n-val">{n.detail}</div>
            </div>
            {i < NODES.length - 1 && (
              <div className={`edge${phase > i ? " done" : phase === i ? " live" : ""}`} aria-hidden="true">
                <svg viewBox="0 0 28 40" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
                  <path d="M2 20 H26 M20 14 L26 20 L20 26" fill="none" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="sheet-controls">
        <button className="btn btn-primary btn-small" onClick={run} disabled={running}>
          {running ? "Running…" : phase >= NODES.length ? "Run again" : "Run pipeline"}
        </button>
        <span className="ticker">
          tokens <strong>{tokens}</strong> · latency <strong>{phase >= NODES.length ? "1.8s" : "—"}</strong> · grounded <strong>{phase >= NODES.length ? "yes" : "—"}</strong>
        </span>
      </div>
      <div className="trace" aria-live="polite">
        {TRACE.slice(0, Math.max(1, Math.min(phase + 1, TRACE.length))).map(([cls, line], i) => (
          <div key={i} className={cls}>{line}</div>
        ))}
      </div>
    </div>
  );
}
