"use client";
import { useEffect, useRef } from "react";

const DEPTHS = [0.35, 0.6, 0.9, 1.25, 1.7];

export default function Aurora() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;
    const layers = Array.from(el.querySelectorAll(".par"));
    const glow = el.querySelector(".glow");
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    function onMove(e) {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
      if (glow) {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      }
    }
    function loop() {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      layers.forEach((layer, i) => {
        const d = DEPTHS[i] ?? 1;
        layer.style.transform = `translate(${(x * 9 * d).toFixed(3)}vmax, ${(y * 9 * d).toFixed(3)}vmax)`;
      });
      raf = requestAnimationFrame(loop);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="aurora" ref={ref} aria-hidden="true">
      <span className="par"><span className="blob blob-1" /></span>
      <span className="par"><span className="blob blob-2" /></span>
      <span className="par"><span className="blob blob-3" /></span>
      <span className="par"><span className="blob blob-4" /></span>
      <span className="par"><span className="blob blob-5" /></span>
      <span className="glow" />
    </div>
  );
}
