"use client";

import { useEffect, useState } from "react";
import { useVoice } from "./VoiceProvider";

export default function VoiceToggle() {
  const voice = useVoice();
  // The server cannot know the stored preference, so the first paint always
  // shows "off". Swap to the real state after mount to avoid a mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!voice?.available) return null;

  const on = mounted && voice.enabled;
  return (
    <button
      type="button"
      className="voice-toggle"
      onClick={voice.toggle}
      aria-pressed={on}
      aria-label={on ? "Mute the avatar" : "Let the avatar speak"}
      title={on ? "Mute the avatar" : "Let the avatar speak"}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 9.5h3.2L12 5.4v13.2L7.2 14.5H4z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        {on ? (
          <>
            <path d="M15.6 9.2a4 4 0 0 1 0 5.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            <path d="M18 6.8a7.2 7.2 0 0 1 0 10.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </>
        ) : (
          <path d="m16 9.6 5 4.8M21 9.6l-5 4.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        )}
      </svg>
      <span>{on ? "Voice on" : "Voice off"}</span>
    </button>
  );
}
