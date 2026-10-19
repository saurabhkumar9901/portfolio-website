"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { VoiceEngine, decode } from "../lib/audioQueue.js";
import { createSplitter, splitAll, toSpeech } from "../lib/voice.js";

const VoiceContext = createContext(null);

const STORAGE_KEY = "voice-enabled";

export function useVoice() {
  return useContext(VoiceContext);
}

export function VoiceProvider({ children, initialAvailable = false }) {
  const [available, setAvailable] = useState(initialAvailable);
  const [blocked, setBlocked] = useState(false);
  // Read the preference synchronously so the very first auto-asked question
  // already knows whether to speak. The toggle only renders once `available`
  // is known, so there is no hydration mismatch.
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [speaking, setSpeaking] = useState(false);
  const [viseme, setViseme] = useState("rest");
  const [amplitude, setAmplitude] = useState(0);

  const engineRef = useRef(null);
  const splitterRef = useRef(null);
  const turnRef = useRef(0);
  const enabledRef = useRef(false);
  const pendingRef = useRef([]);
  const drainingRef = useRef(false);

  enabledRef.current = enabled;

  const engine = useCallback(() => {
    if (!engineRef.current) {
      const e = new VoiceEngine();
      e.onFrame = ({ viseme: v, amplitude: a, speaking: s }) => {
        setViseme(v);
        setAmplitude(a);
        setSpeaking(s);
      };
      e.onIdle = () => setSpeaking(false);
      engineRef.current = e;
    }
    return engineRef.current;
  }, []);

  // If the server says voice is off, there is nothing to probe. Otherwise
  // confirm the key is actually working before rendering the toggle.
  useEffect(() => {
    if (initialAvailable) return undefined;
    let alive = true;
    fetch("/api/tts")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (alive && data?.enabled) setAvailable(true);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [initialAvailable]);

  useEffect(() => {
    if (!enabled && engineRef.current) engineRef.current.stop();
  }, [enabled]);

  useEffect(() => () => {
    if (engineRef.current) engineRef.current.dispose();
  }, []);

  const stop = useCallback(() => {
    turnRef.current += 1;
    pendingRef.current = [];
    splitterRef.current = null;
    if (engineRef.current) engineRef.current.stop();
    setSpeaking(false);
    setViseme("rest");
    setAmplitude(0);
  }, []);

  const toggle = useCallback(() => {
    const next = !enabledRef.current;
    enabledRef.current = next;
    setEnabled(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* private mode */
    }
    if (next) engine().unlock();
    else if (engineRef.current) engineRef.current.stop();
  }, [engine]);

  /**
   * Fetch one sentence and decode it. Requests start the moment a sentence is
   * complete, so the network calls for later sentences overlap with playback
   * of earlier ones; only the *enqueue* is serialised, which keeps the
   * playhead in order.
   */
  const synthesize = useCallback((text) => {
    const eng = engine();
    return (async () => {
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        if (!res.ok) {
          if (res.status === 429 || res.status === 503) setBlocked(true);
          return null;
        }
        const bytes = await res.arrayBuffer();
        if (!bytes.byteLength) return null;
        return await decode(eng, bytes);
      } catch {
        return null;
      }
    })();
  }, [engine]);

  /** Play finished clips strictly in the order the sentences were written. */
  const drain = useCallback(async (turn) => {
    if (drainingRef.current) return;
    drainingRef.current = true;
    const eng = engine();
    try {
      while (pendingRef.current.length) {
        if (turn !== turnRef.current) break;
        const item = pendingRef.current.shift();
        const buffer = await item.buffer;
        if (turn !== turnRef.current) break;
        if (!buffer) continue;
        eng.enqueue(buffer, item.text);
      }
    } finally {
      drainingRef.current = false;
      // A turn that started while this drain was awaiting a fetch queued its
      // own clips; hand them to a fresh drain instead of leaving them silent.
      if (pendingRef.current.length && turn !== turnRef.current) drain(turnRef.current);
    }
  }, [engine]);

  const queue = useCallback((text) => {
    // Sanitise here as well as on the server so the viseme timeline is laid
    // over the same words the voice actually speaks.
    const spoken = toSpeech(text);
    if (!spoken) return;
    const buffer = synthesize(spoken);
    pendingRef.current.push({ text: spoken, buffer });
    drain(turnRef.current);
  }, [drain, synthesize]);

  const beginTurn = useCallback(() => {
    stop();
    if (!enabledRef.current || !available) return false;
    engine().unlock();
    splitterRef.current = createSplitter();
    return true;
  }, [available, engine, stop]);

  const pushChunk = useCallback((delta) => {
    if (!enabledRef.current || !splitterRef.current) return;
    for (const chunk of splitterRef.current.push(delta)) queue(chunk);
  }, [queue]);

  const endTurn = useCallback(() => {
    if (!splitterRef.current) return;
    const rest = splitterRef.current.flush();
    splitterRef.current = null;
    for (const chunk of rest) queue(chunk);
  }, [queue]);

  /** Play a committed demo clip by intent name. */
  const playStatic = useCallback(async (intent, { force = false } = {}) => {
    if (!intent || !available) return;
    if (!enabledRef.current) {
      if (!force) return;
      enabledRef.current = true;
      setEnabled(true);
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* private mode */
      }
    }
    const eng = engine();
    eng.unlock();
    turnRef.current += 1;
    const turn = turnRef.current;
    pendingRef.current = [];
    splitterRef.current = null;
    eng.stop();
    try {
      const res = await fetch(`/audio/${intent}.mp3`);
      if (!res.ok) return;
      const bytes = await res.arrayBuffer();
      const buffer = await decode(eng, bytes);
      if (turn !== turnRef.current) return;
      eng.enqueue(buffer, "");
    } catch {
      /* no audio, no problem */
    }
  }, [available, engine]);

  /** Speak a whole finished answer (replay of a live answer). */
  const speakText = useCallback(async (text, { force = false } = {}) => {
    if (!text || !available) return;
    if (!enabledRef.current) {
      if (!force) return;
      enabledRef.current = true;
      setEnabled(true);
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* private mode */
      }
    }
    const eng = engine();
    eng.unlock();
    turnRef.current += 1;
    const turn = turnRef.current;
    pendingRef.current = [];
    splitterRef.current = null;
    eng.stop();
    const chunks = splitAll(text);
    for (const chunk of chunks) {
      pendingRef.current.push({ text: chunk, buffer: synthesize(chunk) });
    }
    drain(turn);
  }, [available, drain, engine, synthesize]);

  const value = useMemo(
    () => ({
      available: available && !blocked,
      enabled: enabled && available && !blocked,
      muted: !enabled,
      toggle,
      stop,
      beginTurn,
      pushChunk,
      endTurn,
      playStatic,
      speakText,
      speaking,
      viseme,
      amplitude,
    }),
    [available, blocked, enabled, toggle, stop, beginTurn, pushChunk, endTurn, playStatic, speakText, speaking, viseme, amplitude]
  );

  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
}
