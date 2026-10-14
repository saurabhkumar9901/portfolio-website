"use client";
import { useEffect, useState } from "react";
import Aurora from "../../components/Aurora";
import Avatar from "../../components/Avatar";
import ChatPanel from "../../components/ChatPanel";

export default function AskPage() {
  const [initial, setInitial] = useState(null);
  const [ready, setReady] = useState(false);
  const [info, setInfo] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    setInitial(q && q.trim() ? q.trim() : null);
    setReady(true);
  }, []);

  return (
    <>
      <Aurora />
      <div className="wrap">
        <div className="ask-topbar">
          <a className="top-pill" href="/"><span className="mark">←</span>Back home</a>
          <button
            type="button"
            className="info-btn"
            aria-label="About this chat"
            aria-expanded={info}
            onClick={() => setInfo((s) => !s)}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <line x1="8" y1="7.2" x2="8" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="8" cy="5" r="1.1" fill="currentColor" />
            </svg>
          </button>
        </div>
        {info && (
          <div className="info-pop" role="note">
            I answer from Saurabh&apos;s profile, projects, and live GitHub. Demo fallback answers stay tagged. 5 messages per visit.
          </div>
        )}
        <main className="ask-open">
          <Avatar />
          {ready && <ChatPanel key={initial ?? "fresh"} initialQuestion={initial} />}
        </main>
      </div>
    </>
  );
}
