"use client";
import { useEffect, useRef } from "react";

const MAX_BEADS = 800;
const MAX_DROPS = 260;
const MAX_RINGS = 60;
const CLICK_HUES = [212, 300, 28];

export default function Fluid() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0, h = 0, raf = 0, t = 0;

    const beads = [];
    const drops = [];
    const rings = [];
    const blooms = [];
    let px = -1, py = -1, hueBase = 205, rippleAt = 0;

    function size() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();

    function bead(x, y, vx, vy) {
      if (beads.length >= MAX_BEADS) beads.shift();
      const speed = Math.min(Math.hypot(vx, vy), 50);
      const hue = (hueBase + Math.random() * 60) % 360;
      beads.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: vx * 0.08 + (Math.random() - 0.5) * 0.8,
        vy: vy * 0.08 + (Math.random() - 0.5) * 0.8,
        life: 1,
        decay: 0.005 + Math.random() * 0.005,
        r: 3 + Math.random() * 8 + speed * 0.08,
        hue,
      });
    }

    function drop(x, y, hue, power) {
      if (drops.length >= MAX_DROPS) drops.shift();
      const a = Math.random() * Math.PI * 2;
      const sp = (1 + Math.random() * 3.2) * power;
      drops.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 1,
        life: 1,
        decay: 0.012 + Math.random() * 0.014,
        r: 2 + Math.random() * 5,
        hue,
      });
    }

    function ring(x, y, hue, maxR, lw) {
      if (rings.length >= MAX_RINGS) rings.shift();
      rings.push({ x, y, hue, r: 6, maxR, lw, life: 1 });
    }

    function bloom(x, y) {
      blooms.push({ x, y, life: 1 });
      if (blooms.length > 8) blooms.shift();
    }

    function onMove(e) {
      const x = e.clientX, y = e.clientY;
      if (px >= 0) {
        const dx = x - px, dy = y - py;
        const dist = Math.hypot(dx, dy);
        hueBase = (hueBase + dist * 0.14) % 360;
        const steps = Math.min(14, Math.max(2, Math.round(dist / 6)));
        for (let s = 0; s <= steps; s++) {
          bead(px + (dx * s) / steps, py + (dy * s) / steps, dx, dy);
        }
        const now = performance.now();
        if (dist > 24 && now - rippleAt > 110) {
          rippleAt = now;
          ring(x, y, Math.round(hueBase), 46 + Math.random() * 30, 2);
        }
      }
      px = x;
      py = y;
    }

    function onDown(e) {
      const x = e.clientX, y = e.clientY;
      bloom(x, y);
      CLICK_HUES.forEach((hue, i) => {
        setTimeout(() => ring(x, y, hue, 90 + i * 46, 5 - i), i * 90);
      });
      for (let i = 0; i < 26; i++) {
        drop(x, y, CLICK_HUES[i % CLICK_HUES.length] + Math.random() * 30, 1.6);
      }
    }

    function loop() {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      for (let i = blooms.length - 1; i >= 0; i--) {
        const b = blooms[i];
        b.life -= 0.011;
        if (b.life <= 0) {
          blooms.splice(i, 1);
          continue;
        }
        const r = 90 * (1.2 - b.life) + 26;
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
        const hue = (215 + t * 30) % 360;
        g.addColorStop(0, `hsla(${hue}, 90%, 66%, ${0.5 * b.life})`);
        g.addColorStop(0.55, `hsla(${(hue + 60) % 360}, 90%, 70%, ${0.28 * b.life})`);
        g.addColorStop(1, `hsla(${(hue + 110) % 360}, 90%, 70%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = beads.length - 1; i >= 0; i--) {
        const p = beads[i];
        p.vx = p.vx * 0.97 + Math.sin(p.y * 0.02 + t * 2) * 0.07;
        p.vy = p.vy * 0.97 + Math.cos(p.x * 0.02 - t * 1.7) * 0.07;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) {
          beads.splice(i, 1);
          continue;
        }
        const a = Math.min(1, p.life * 1.5);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 62%, ${0.34 * a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255, 255, 255, ${0.75 * a})`;
        ctx.beginPath();
        ctx.arc(p.x - p.r * 0.28, p.y - p.r * 0.3, p.r * 0.42, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = drops.length - 1; i >= 0; i--) {
        const p = drops[i];
        p.vx *= 0.97;
        p.vy = p.vy * 0.97 + 0.06;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) {
          drops.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `hsla(${p.hue}, 90%, 62%, ${0.85 * p.life})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.life + 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = rings.length - 1; i >= 0; i--) {
        const g = rings[i];
        g.r += (g.maxR - g.r) * 0.09 + 0.6;
        g.life -= 0.016;
        if (g.life <= 0 || g.r >= g.maxR) {
          rings.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `hsla(${g.hue}, 90%, 60%, ${0.55 * g.life})`;
        ctx.lineWidth = Math.max(0.6, g.lw * g.life);
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      raf = requestAnimationFrame(loop);
    }

    function onResize() { size(); }
    function onVis() {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(loop);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas className="fluid-canvas" ref={ref} aria-hidden="true" />;
}
