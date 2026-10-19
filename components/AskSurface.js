"use client";
import { useEffect, useState } from "react";
import Aurora from "./Aurora";
import Fluid from "./Fluid";
import Avatar from "./Avatar";
import ChatPanel from "./ChatPanel";
import { VoiceProvider } from "./VoiceProvider";
import VoiceToggle from "./VoiceToggle";

export default function AskSurface({ voiceEnabled = false }) {
  const [initial, setInitial] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    setInitial(q && q.trim() ? q.trim() : null);
    setReady(true);
  }, []);

  return (
    <VoiceProvider initialAvailable={voiceEnabled}>
      <Aurora />
      <Fluid />
      <div className="wrap">
        <div className="ask-topbar">
          <a className="top-pill" href="/"><span className="mark">←</span>Back home</a>
          <VoiceToggle />
        </div>
        <main className="ask-open">
          <Avatar />
          {ready && <ChatPanel key={initial ?? "fresh"} initialQuestion={initial} />}
        </main>
      </div>
    </VoiceProvider>
  );
}
