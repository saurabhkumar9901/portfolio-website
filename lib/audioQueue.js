// Gapless chunked playback for streamed TTS. Everything is scheduled against
// AudioContext.currentTime so chunks butt together sample-accurately, and an
// AnalyserNode taps the same graph for mouth amplitude.

import { timelineFor, visemeAt } from "./visemes.js";

const LOOKAHEAD = 0.08; // seconds of head start for the first chunk

export class VoiceEngine {
  constructor() {
    this.ctx = null;
    this.gain = null;
    this.analyser = null;
    this.buffer = null;
    this.playhead = 0;
    this.clips = [];
    this.sources = new Set();
    this.raf = null;
    this.amp = 0;
    this.active = null;
    this.onFrame = null;
    this.onIdle = null;
    this.gestureBound = false;
  }

  /** Must be called from a user gesture (click/keypress) for autoplay. */
  unlock() {
    const ctx = this.#ensure();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
      // A shared /ask?q= link can be opened with the preference already on but
      // no gesture yet, so the browser keeps the context suspended. Resume on
      // the first interaction rather than staying silent forever.
      if (typeof window !== "undefined" && !this.gestureBound) {
        this.gestureBound = true;
        const resume = () => {
          if (this.ctx && this.ctx.state === "suspended") this.ctx.resume().catch(() => {});
          window.removeEventListener("pointerdown", resume);
          window.removeEventListener("keydown", resume);
        };
        window.addEventListener("pointerdown", resume, { passive: true });
        window.addEventListener("keydown", resume, { passive: true });
      }
    }
  }

  #ensure() {
    if (this.ctx) return this.ctx;
    const Ctor = typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext);
    if (!Ctor) throw new Error("Web Audio unavailable");
    const ctx = new Ctor();
    this.gain = ctx.createGain();
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 1024;
    this.analyser.smoothingTimeConstant = 0.6;
    this.buffer = new Float32Array(this.analyser.fftSize);
    this.gain.connect(this.analyser);
    this.analyser.connect(ctx.destination);
    this.ctx = ctx;
    return ctx;
  }

  /**
   * Schedule one decoded clip. `text` is the exact text that produced this
   * audio, so the viseme timeline can be laid over its real duration.
   */
  enqueue(audioBuffer, text) {
    const ctx = this.#ensure();
    const src = ctx.createBufferSource();
    src.buffer = audioBuffer;
    src.connect(this.gain);

    const now = ctx.currentTime;
    const start = Math.max(this.playhead, now + LOOKAHEAD);
    src.start(start);

    const clip = {
      start,
      end: start + audioBuffer.duration,
      timeline: timelineFor(text, audioBuffer.duration),
    };
    this.clips.push(clip);
    this.playhead = clip.end;
    this.sources.add(src);

    src.onended = () => {
      this.sources.delete(src);
      this.clips = this.clips.filter((c) => c !== clip);
      if (!this.sources.size) this.#drain();
    };

    this.#tick();
  }

  #tick() {
    if (this.raf !== null) return;
    const frame = () => {
      const ctx = this.ctx;
      if (!ctx) {
        this.raf = null;
        return;
      }
      const t = ctx.currentTime;
      const clip = this.clips.find((c) => t >= c.start && t < c.end);

      this.analyser.getFloatTimeDomainData(this.buffer);
      let sum = 0;
      for (let i = 0; i < this.buffer.length; i += 1) {
        const s = this.buffer[i];
        sum += s * s;
      }
      const rms = Math.sqrt(sum / this.buffer.length);
      // Map RMS into a usable 0..1 range; speech sits around 0.05–0.25.
      const target = Math.min(1, Math.max(0, (rms - 0.012) * 6.5));
      this.amp += (target - this.amp) * 0.35;

      const viseme = clip ? visemeAt(clip.timeline, t - clip.start) : "rest";
      if (this.onFrame) this.onFrame({ viseme, amplitude: this.amp, speaking: Boolean(clip) });
      this.raf = requestAnimationFrame(frame);
    };
    this.raf = requestAnimationFrame(frame);
  }

  #drain() {
    if (this.raf !== null) {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    }
    this.amp = 0;
    this.playhead = this.ctx ? this.ctx.currentTime : 0;
    if (this.onFrame) this.onFrame({ viseme: "rest", amplitude: 0, speaking: false });
    if (this.onIdle) this.onIdle();
  }

  /** Hard stop — used on barge-in, mute and new questions. */
  stop() {
    for (const src of this.sources) {
      src.onended = null;
      try {
        src.stop();
      } catch {
        /* already finished */
      }
    }
    this.sources.clear();
    this.clips = [];
    this.playhead = this.ctx ? this.ctx.currentTime : 0;
    this.#drain();
  }

  /** Release the device. Safari allows only a handful of live contexts. */
  dispose() {
    this.stop();
    const ctx = this.ctx;
    this.ctx = null;
    this.gain = null;
    this.analyser = null;
    if (ctx && ctx.state !== "closed") ctx.close().catch(() => {});
  }
}

/** Decode an MP3 blob/arraybuffer into an AudioBuffer on the engine's context. */
export async function decode(engine, arrayBuffer) {
  engine.unlock();
  return engine.ctx.decodeAudioData(arrayBuffer.slice(0));
}
