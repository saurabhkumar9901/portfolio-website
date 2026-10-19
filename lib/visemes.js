// Text-timed viseme mapping. No provider gives us phoneme timestamps, so we
// distribute mouth shapes across the audio's real duration using per-grapheme
// speech weights. Amplitude from the analyser modulates how far the mouth opens.

export const VISEMES = ["rest", "MBP", "AE", "EI", "OU", "FV"];

const LETTER_VISEME = {
  a: "AE",
  e: "EI",
  i: "EI",
  o: "OU",
  u: "OU",
  y: "EI",
  m: "MBP",
  b: "MBP",
  p: "MBP",
  f: "FV",
  v: "FV",
};

// Rough relative duration of each viseme. Vowels hold, plosives are quick.
const WEIGHT = {
  AE: 1.15,
  EI: 1.0,
  OU: 1.1,
  MBP: 0.55,
  FV: 0.7,
  rest: 0.45,
};

// Pauses that read as silence rather than mouth movement.
const PAUSE = /[\s,.;:!?—–\-()[\]{}"'“”‘’]/;

function visemeFor(ch) {
  const lower = ch.toLowerCase();
  return LETTER_VISEME[lower] || "rest";
}

/**
 * Build a monotonic timeline: [{ t, v }] where `t` is the start time in
 * seconds and `v` the viseme held from `t` until the next entry.
 */
export function timelineFor(text, duration) {
  const clean = String(text ?? "");
  if (!clean || !(duration > 0)) return [{ t: 0, v: "rest" }];

  const weights = [];
  let total = 0;
  for (const ch of clean) {
    const v = visemeFor(ch);
    const w = PAUSE.test(ch) ? 0.25 : WEIGHT[v];
    weights.push({ v, w });
    total += w;
  }
  if (total <= 0) return [{ t: 0, v: "rest" }];

  const scale = duration / total;
  const timeline = [];
  let cursor = 0;
  for (const { v, w } of weights) {
    if (!timeline.length || timeline[timeline.length - 1].v !== v) {
      timeline.push({ t: cursor, v });
    }
    cursor += w * scale;
  }
  return timeline;
}

/** Viseme active at `t` seconds into the clip. Binary search. */
export function visemeAt(timeline, t) {
  if (!timeline || !timeline.length) return "rest";
  let lo = 0;
  let hi = timeline.length - 1;
  if (t <= timeline[0].t) return timeline[0].v;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (timeline[mid].t <= t) lo = mid;
    else hi = mid - 1;
  }
  return timeline[lo].v;
}
