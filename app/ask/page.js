"use client";
import { useEffect, useState } from "react";
import Aurora from "../../components/Aurora";
import Avatar from "../../components/Avatar";
import ChatPanel from "../../components/ChatPanel";

export default function AskPage() {
  const [initial, setInitial] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    setInitial(q && q.trim() ? q.trim() : null);
    setReady(true);
  }, []);

  return (
    <>
      <Aurora />
      <div className="wrap">
        <div className="toprow">
          <a className="top-pill" href="/"><span className="mark">←</span>Back home</a>
        </div>
        <main className="ask-page">
          <Avatar />
          <h1>Ask me anything</h1>
          <p className="hero-sub">Placeholder brain — keyword answers about skills, projects, experience, contact, and fun. Quick questions appear after your first message.</p>
          <div className="chat-card">
            {ready && <ChatPanel key={initial ?? "fresh"} initialQuestion={initial} />}
          </div>
          <p className="ask-note">* Demo chat — answers are placeholders until the owner wires real content.</p>
        </main>
        <footer>
          <div className="wrap" style={{ padding: 0 }}>
            <span>© 2026 Your Name* · placeholder portfolio</span>
            <span><a href="/">Home</a> · Aurora field</span>
          </div>
        </footer>
      </div>
    </>
  );
}
