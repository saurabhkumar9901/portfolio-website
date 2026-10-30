"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { VoiceEngine } from "../lib/audioQueue.js";
import { createSplitter, splitAll, toSpeech } from "../lib/voice.js";

const VoiceContext = createContext(null);

const STORAGE_KEY = "voice-enabled";

export function useVoice() {
  return useContext(VoiceContext);
}

export function VoiceProvider({ children, initialAvailable = false }) {
  const [available, setAvailable] = useState(initialAvailable);
  const [blocked, setBlocked] = useState(false);
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

  const queue = useCallback((text) => {
    const spoken = toSpeech(text);
    if (!spoken) return;
    const eng = engine();
    eng.enqueue(spoken);
  }, [engine]);

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
    eng.stop();
    eng.playStatic(intent);
  }, [available, engine]);

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
    eng.stop();
    const chunks = splitAll(text);
    for (const chunk of chunks) queue(chunk);
  }, [available, engine, queue]);

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
