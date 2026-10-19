"use client";

import { useEffect, useState } from "react";
import { useVoice } from "./VoiceProvider";

// Traced straight from the "Memoji pack" turnaround (scripts/trace-memoji.mjs).
// Three front views are stacked:
//
//   base   eyes open, lips closed      (sheet4)
//   mouth  eyes open, mouth open       (sheet2) — masked to the mouth
//   eyes   eyes closed, lips closed    (sheet3) — masked to the eyes, for blinks
//
// Masking the overlays keeps the mouth and eyelids changing without the rest of
// the render (which differs slightly between generations) ghosting through.

const BASE = "/memoji/sheet4_emoji1.svg";
const MOUTH = "/memoji/sheet2_emoji1.svg";
const EYES = "/memoji/sheet3_emoji1.svg";

// How far the open-mouth layer comes in for each viseme, and how the mouth is
// squashed so the single open shape reads as different vowels.
const OPEN = { rest: 0, MBP: 0, FV: 0.32, OU: 0.6, EI: 0.68, AE: 0.9 };
const SQUASH = {
  rest: "scale(1, 1)",
  MBP: "scale(1, 1)",
  FV: "scale(1.02, 0.74)",
  OU: "scale(0.84, 0.96)",
  EI: "scale(1.02, 0.88)",
  AE: "scale(1, 1.04)",
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export default function Avatar() {
  const voice = useVoice();
  const reduced = useReducedMotion();

  // Under reduced motion the face stays still: audio still plays, only the
  // decorative movement is dropped.
  const speaking = Boolean(voice?.speaking) && !reduced;
  const viseme = speaking ? voice.viseme : "rest";
  const amplitude = speaking ? Math.max(0, Math.min(1, voice.amplitude || 0)) : 0;

  const open = speaking ? Math.min(1, (OPEN[viseme] ?? 0) + amplitude * 0.16) : 0;
  const squash = SQUASH[viseme] || SQUASH.rest;

  return (
    <div className={`avatar${reduced ? " is-static" : ""}`}>
      <div className="avatar-stage">
        <img className="avatar-layer" src={BASE} alt="Illustrated avatar of Saurabh Kumar" draggable="false" />
        <img
          className="avatar-layer avatar-mouth"
          src={MOUTH}
          alt=""
          aria-hidden="true"
          draggable="false"
          style={{ opacity: open, transform: squash }}
        />
        <img className="avatar-layer avatar-eyes" src={EYES} alt="" aria-hidden="true" draggable="false" />
      </div>
    </div>
  );
}
