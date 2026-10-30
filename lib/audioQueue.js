// Gapless, streaming playback for TTS. Audio is played through an
// HTMLAudioElement so the browser starts speaking as soon as the first bytes
// arrive (progressive MP3 download) instead of waiting for the whole file.
// An AnalyserNode taps the same element for mouth amplitude, and a text-derived
// viseme timeline is rebuilt once the real duration is known.
import { timelineFor, visemeAt } from "./visemes.js";

const LOOKAHEAD_TEXT = 0.07; // seconds per character until the real duration lands

export class VoiceEngine {
  constructor() {
    this.ctx = null;
    this.gain = null;
    this.analyser = null;
    this.audio = null;
    this.sourceNode = null;
    this.ready = false;

    this.queue = [];
    this.playing = false;
    this.currentText = "";
    this.timeline = null;
    this.timelineFinal = false;
    this.startedAt = 0;

    this.raf = null;
    this.amp = 0;
    this.viseme = "rest";
    this.amplitude = 0;
    this.speaking = false;

    this.onFrame = null;
    this.onIdle = null;

    this.aborted = false;
    this.turnToken = 0;
  }

  #ensure() {
    if (this.ctx) return this.ctx;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioCtx();
    this.gain = this.ctx.createGain();
    this.gain.gain.value = 1;
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.smoothingTimeConstant = 0.5;
    this.gain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    this.audio = new Audio();
    this.audio.crossOrigin = "anonymous";
    this.sourceNode = this.ctx.createMediaElementSource(this.audio);
    this.sourceNode.connect(this.gain);

    this.audio.addEventListener("loadedmetadata", () => this.#onMetadata());
    this.audio.addEventListener("ended", () => this.#onEnded());
    this.audio.addEventListener("error", () => this.#onEnded());
    this.ready = true;
    return this.ctx;
  }

  unlock() {
    const ctx = this.#ensure();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    try { this.audio.load(); } catch {}
  }

  #onMetadata() {
    if (!this.currentText) return;
    const dur = this.audio.duration;
    if (dur && isFinite(dur) && dur > 0) {
      this.timeline = timelineFor(this.currentText, dur);
      this.timelineFinal = true;
    }
  }

  #start(text, prefetchedUrl = null) {
    this.playing = true;
    this.currentText = text;
    this.timelineFinal = false;
    this.timeline = timelineFor(text, Math.max(0.5, text.length * LOOKAHEAD_TEXT));
    this.amp = 0;
    this.viseme = "rest";
    this.amplitude = 0;
    this.speaking = true;

    const url = prefetchedUrl || `/api/tts?text=${encodeURIComponent(text)}`;
    this.audio.src = url;
    this.audio.load();
    const p = this.audio.play();
    if (p && typeof p.then === "function") p.catch(() => {});

    this.#startRaf();
  }

  enqueue(text) {
    if (!text) return;
    if (this.playing) {
      const item = { text, url: null };
      // Prefetch the audio so the next sentence starts without a network wait.
      const fetchPromise = fetch(`/api/tts?text=${encodeURIComponent(text)}`)
        .then((r) => (r.ok ? r.blob() : null))
        .then((b) => (b ? (item.url = URL.createObjectURL(b)) : null))
        .catch(() => null);
      item.fetchPromise = fetchPromise;
      this.queue.push(item);
    } else {
      this.#start(text);
    }
  }

  #startRaf() {
    if (this.raf) cancelAnimationFrame(this.raf);
    const loop = () => {
      if (!this.playing) return;
      const data = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);
      this.amp = this.amp * 0.55 + rms * 0.45;

      const t = this.audio.currentTime || 0;
      if (!this.timelineFinal && this.audio.duration && isFinite(this.audio.duration) && this.audio.duration > 0) {
        this.timeline = timelineFor(this.currentText, this.audio.duration);
        this.timelineFinal = true;
      }
      const v = visemeAt(this.timeline, t);
      this.viseme = v;
      this.amplitude = Math.min(1, this.amp * 2.4);
      if (this.onFrame) this.onFrame({ viseme: v, amplitude: this.amplitude, speaking: true });
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  #onEnded() {
    this.playing = false;
    this.timeline = null;
    this.timelineFinal = false;
    this.currentText = "";
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; }
    this.amp = 0;
    this.viseme = "rest";
    this.amplitude = 0;
    this.speaking = false;
    if (this.onFrame) this.onFrame({ viseme: "rest", amplitude: 0, speaking: false });

    if (this.queue.length) {
      const item = this.queue.shift();
      const text = typeof item === "string" ? item : item.text;
      const url = (typeof item === "object" && item.url) ? item.url : null;
      if (url) this.#start(text, url);
      else {
        // Prefetch not ready yet — start direct fetch; prefetch continues in bg.
        this.#start(text);
        if (typeof item === "object" && item.fetchPromise) {
          item.fetchPromise.then((u) => {
            if (u && this.currentText === text && this.playing) {
              // Too late to swap; ignore. Next time prefetch wins.
            }
          });
        }
      }
    } else {
      if (this.onIdle) this.onIdle();
    }
  }

  stop() {
    this.queue = [];
    this.playing = false;
    this.timeline = null;
    this.timelineFinal = false;
    this.currentText = "";
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; }
    if (this.audio) {
      this.audio.pause();
      try { this.audio.removeAttribute("src"); this.audio.load(); } catch {}
    }
    this.amp = 0;
    this.viseme = "rest";
    this.amplitude = 0;
    this.speaking = false;
    if (this.onFrame) this.onFrame({ viseme: "rest", amplitude: 0, speaking: false });
  }

  playStatic(intent) {
    if (!intent) return;
    this.stop();
    this.playing = true;
    this.currentText = "";
    this.timeline = [{ t: 0, v: "rest" }];
    this.timelineFinal = true;
    this.amp = 0;
    this.speaking = true;
    this.audio.src = `/audio/${intent}.mp3`;
    this.audio.load();
    const p = this.audio.play();
    if (p && typeof p.then === "function") p.catch(() => {});
    // Amplitude-only mouth for static clips.
    this.#startRafStatic();
  }

  #startRafStatic() {
    if (this.raf) cancelAnimationFrame(this.raf);
    const loop = () => {
      if (!this.playing) return;
      const data = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);
      this.amp = this.amp * 0.55 + rms * 0.45;
      this.amplitude = Math.min(1, this.amp * 2.4);
      if (this.onFrame) this.onFrame({ viseme: "rest", amplitude: this.amplitude, speaking: true });
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  dispose() {
    this.stop();
    if (this.sourceNode) { try { this.sourceNode.disconnect(); } catch {} }
    if (this.ctx) { try { this.ctx.close(); } catch {} }
    this.ctx = null;
    this.audio = null;
  }
}

// Kept for any external callers; unused by the streaming engine.
export async function decode() { return null; }
