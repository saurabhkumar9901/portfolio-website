// Voice pipeline shared by the API route, the client provider and the
// pre-render script. Nothing here touches the DOM or the network.

export const VOICE_MODEL = "aura-2-orpheus-en";
export const MAX_CHARS = 900;

// Aura-2 rejects anything above 2,000 characters per request; we stay well
// under it so a single sentence chunk can never fail on length.
export const CHUNK_MAX = 320;
export const CHUNK_MIN = 20;
const CLAUSE_MIN = 16;

const ABBREVIATIONS = /(?:^|\s)(?:mr|mrs|ms|dr|prof|sr|jr|st|vs|etc|e\.g|i\.e|approx|fig|no|vol|dept|inc|ltd)\.$/i;

/**
 * Strip everything that a voice should not read aloud: markdown markers,
 * link syntax, bare URLs, code fences, bullets, emoji.
 */
export function toSpeech(input) {
  let t = String(input ?? "");

  // Code fences and inline code: drop the markers, keep the words.
  t = t.replace(/```[\s\S]*?```/g, " ");
  t = t.replace(/`([^`]*)`/g, "$1");

  // [label](url) -> label
  t = t.replace(/\[([^\]]+)\]\((?:[^)\s]+)\)/g, "$1");

  // Bare URLs are read as noise; say "link" instead of spelling them out.
  t = t.replace(/https?:\/\/\S+/g, "link");

  // HTML entities the model occasionally emits.
  t = t.replace(/&amp;/g, "and").replace(/&lt;|&gt;/g, " ").replace(/&nbsp;/g, " ");

  // Emphasis and headings.
  t = t.replace(/\*\*([^*]+)\*\*/g, "$1");
  t = t.replace(/__([^_]+)__/g, "$1");
  t = t.replace(/(^|\s)[*_]([^*_\n]+)[*_]/g, "$1$2");
  t = t.replace(/^\s{0,3}#{1,6}\s*/gm, "");

  // Any markdown punctuation left over (stray *, _, ~, |, #) is silent noise.
  t = t.replace(/[*_~|#]+/g, " ");

  // List and quote markers.
  t = t.replace(/^\s*[-*+]\s+/gm, "");
  t = t.replace(/^\s*\d+[.)]\s+/gm, "");
  t = t.replace(/^\s*>\s?/gm, "");

  // Emoji, pictographs, dingbats, variation selectors, zero-width joiners.
  t = t.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}\u{2190}-\u{21FF}]/gu, "");

  // Collapse whitespace but keep paragraph breaks as sentence breaks.
  t = t.replace(/\r\n?/g, "\n");
  t = t.replace(/[ \t]+/g, " ");
  t = t.replace(/\n{2,}/g, "\n");
  t = t.replace(/\s+([,.;:!?])/g, "$1");

  return t.trim();
}

/** True when `s[i]` ends a speakable sentence. */
function isBoundary(s, i) {
  const ch = s[i];
  if (ch === "\n") return true;
  if (ch !== "." && ch !== "!" && ch !== "?") return false;

  const next = s[i + 1];
  if (next !== undefined && !/\s/.test(next)) return false;

  if (ch === ".") {
    const before = s.slice(0, i);
    // Single initials ("S. Kumar") and known abbreviations are not endings.
    const word = (before.match(/([A-Za-z.]+)$/) || [])[1] || "";
    if (/^[A-Za-z]$/.test(word)) return false;
    if (ABBREVIATIONS.test(before)) return false;
    // Decimals: 1.5
    if (/\d$/.test(before) && /^\s*\d/.test(s.slice(i + 1))) return false;
  }
  return true;
}

function findCut(s, first = false) {
  for (let i = CHUNK_MIN - 1; i < s.length; i += 1) {
    if (isBoundary(s, i)) return i + 1;
  }
  if (s.length > CHUNK_MAX) {
    const space = s.lastIndexOf(" ", CHUNK_MAX);
    return space > CHUNK_MIN ? space + 1 : CHUNK_MAX;
  }
  return -1;
}

/**
 * Incremental sentence splitter for a token stream. `push` returns every
 * chunk that is now complete; `flush` drains the tail.
 */
export function createSplitter() {
  let buf = "";
  let first = true;
  return {
    push(delta) {
      buf += delta;
      const out = [];
      for (;;) {
        const cut = findCut(buf, first);
        if (cut <= 0) break;
        const chunk = buf.slice(0, cut).trim();
        buf = buf.slice(cut);
        if (chunk) out.push(chunk);
        first = false;
      }
      return out;
    },
    flush() {
      const rest = buf.trim();
      buf = "";
      first = false;
      return rest ? [rest] : [];
    },
  };
}

/** Split a finished answer into speech chunks. */
export function splitAll(text) {
  const s = createSplitter();
  return [...s.push(toSpeech(text)), ...s.flush()];
}
