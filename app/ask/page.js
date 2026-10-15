"use client";
import { useEffect, useState } from "react";
import Aurora from "../../components/Aurora";
import Fluid from "../../components/Fluid";
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
      <Fluid />
      <div className="wrap">
        <div className="ask-topbar">
          <a className="top-pill" href="/"><span className="mark">←</span>Back home</a>
        </div>
        <main className="ask-open">
          <Avatar />
          {ready && <ChatPanel key={initial ?? "fresh"} initialQuestion={initial} />}
        </main>
      </div>
    </>
  );
}
