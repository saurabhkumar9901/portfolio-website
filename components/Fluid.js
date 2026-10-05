"use client";
import { useEffect, useRef } from "react";

const HUES = 24;
const MAX_BEADS = 900;
const MAX_DROPS = 260;
const MAX_RINGS = 60;
const CLICK_HUES = [212, 300, 28];

function makeSmoke(hue) {
  const s = 128;
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, `hsla(${hue}, 95%, 55%, 0.75)`);
  grad.addColorStop(0.25, `hsla(${hue}, 92%, 58%, 0.5)`);
  grad.addColorStop(0.6, `hsla(${hue}, 90%, 64%, 0.18)`);
  grad.addColorStop(1, `hsla(${hue}, 90%, 66%, 0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  return c;
}

export default function Fluid() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0, h = 0, raf = 0, t = 0;
    const smokes = [];
    for (let i = 0; i < HUES; i++) smokes.push(makeSmoke(Math.round((i / HUES) * 360)));

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
      const hue = (hueBase + Math.random() * 50) % 360;
      beads.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: vx * 0.08 + (Math.random() - 0.5) * 0.8,
        vy: vy * 0.08 + (Math.random() - 0.5) * 0.8,
        born: performance.now(),
        maxAge: 6000 + Math.random() * 3000,
        size: 44 + Math.random() * 52 + speed * 0.5,
        grow: 0.4,
        sprite: smokes[Math.round(hue / 360 * (HUES - 1)) % HUES],
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
        born: performance.now(),
        maxAge: 1800 + Math.random() * 1200,
        r: 2 + Math.random() * 5,
        hue,
      });
    }

    function ring(x, y, hue, maxR, lw) {
      if (rings.length >= MAX_RINGS) rings.shift();
      rings.push({ x, y, hue, r: 6, maxR, lw, born: performance.now(), maxAge: 1600 });
    }

    function bloom(x, y) {
      blooms.push({ x, y, born: performance.now(), maxAge: 1600 });
      if (blooms.length > 8) blooms.shift();
    }

    function onMove(e) {
      const x = e.clientX, y = e.clientY;
      if (px >= 0) {
        const dx = x - px, dy = y - py;
        const dist = Math.hypot(dx, dy);
        hueBase = (hueBase + dist * 0.07) % 360;
        const steps = Math.min(20, Math.max(3, Math.round(dist / 4)));
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
      const now = performance.now();
      ctx.clearRect(0, 0, w, h);

      for (let i = blooms.length - 1; i >= 0; i--) {
        const b = blooms[i];
        const age = (now - b.born) / b.maxAge;
        if (age >= 1) {
          blooms.splice(i, 1);
          continue;
        }
        const life = 1 - age;
        const r = 90 * (0.2 + age) + 26;
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
        const hue = (215 + t * 30) % 360;
        g.addColorStop(0, `hsla(${hue}, 90%, 66%, ${0.5 * life})`);
        g.addColorStop(0.55, `hsla(${(hue + 60) % 360}, 90%, 70%, ${0.28 * life})`);
        g.addColorStop(1, `hsla(${(hue + 110) % 360}, 90%, 70%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = beads.length - 1; i >= 0; i--) {
        const p = beads[i];
        p.vx = p.vx * 0.968 + Math.sin(p.y * 0.014 + t * 1.8) * 0.22;
        p.vy = p.vy * 0.968 + Math.cos(p.x * 0.014 - t * 1.5) * 0.22;
        p.x += p.vx;
        p.y += p.vy;
        p.size += p.grow;
        const bAge = (now - p.born) / p.maxAge;
        if (bAge >= 1) {
          beads.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = 0.55 * Math.pow(1 - bAge, 0.8);
        const d = p.size;
        ctx.drawImage(p.sprite, p.x - d / 2, p.y - d / 2, d, d);
      }
      ctx.globalAlpha = 1;

      for (let i = drops.length - 1; i >= 0; i--) {
        const p = drops[i];
        p.vx *= 0.97;
        p.vy = p.vy * 0.97 + 0.06;
        p.x += p.vx;
        p.y += p.vy;
        const dAge = (now - p.born) / p.maxAge;
        if (dAge >= 1) {
          drops.splice(i, 1);
          continue;
        }
        const dLife = 1 - dAge;
        ctx.fillStyle = `hsla(${p.hue}, 90%, 62%, ${0.85 * dLife})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * dLife + 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = rings.length - 1; i >= 0; i--) {
        const g = rings[i];
        g.r += (g.maxR - g.r) * 0.09 + 0.6;
        const gAge = (now - g.born) / g.maxAge;
        if (gAge >= 1 || g.r >= g.maxR) {
          rings.splice(i, 1);
          continue;
        }
        const gLife = 1 - gAge;
        ctx.strokeStyle = `hsla(${g.hue}, 90%, 60%, ${0.55 * gLife})`;
        ctx.lineWidth = Math.max(0.6, g.lw * gLife);
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
