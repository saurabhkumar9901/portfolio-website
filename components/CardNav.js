"use client";

import { useRef, useState, useCallback, useEffect } from "react";

const ITEMS = [
  { href: "/ask?q=Tell%20me%20about%20yourself", label: "Me", icon: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="#0e9f6e" strokeWidth="1.8" /><circle cx="9" cy="10.5" r="1.2" fill="#0e9f6e" /><circle cx="15" cy="10.5" r="1.2" fill="#0e9f6e" /><path d="M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8" stroke="#0e9f6e" strokeWidth="1.8" strokeLinecap="round" /></svg> },
  { href: "/ask?q=What%20are%20your%20projects%3F", label: "Projects", icon: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="7" width="17" height="13" rx="2.5" stroke="#4d7c0f" strokeWidth="1.8" /><path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7" stroke="#4d7c0f" strokeWidth="1.8" /><path d="M3.5 12.5h17" stroke="#4d7c0f" strokeWidth="1.8" /></svg> },
  { href: "/ask?q=What%20are%20your%20skills%3F", label: "Skills", icon: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Z" stroke="#6d5ef0" strokeWidth="1.8" strokeLinejoin="round" /><path d="m4.5 12.5 7.5 4 7.5-4" stroke="#6d5ef0" strokeWidth="1.8" strokeLinejoin="round" /><path d="m4.5 16.5 7.5 4 7.5-4" stroke="#6d5ef0" strokeWidth="1.8" strokeLinejoin="round" /></svg> },
  { href: "/ask?q=Tell%20me%20a%20fun%20fact", label: "Fun", icon: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4" stroke="#c262b8" strokeWidth="1.8" strokeLinecap="round" /><path d="m6.5 6.5 2.5 2.5M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5" stroke="#c262b8" strokeWidth="1.8" strokeLinecap="round" /></svg> },
  { href: "/ask?q=How%20do%20I%20contact%20you%3F", label: "Contact", icon: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="8" r="3.2" stroke="#b7791f" strokeWidth="1.8" /><path d="M3.5 19c.6-3 2.8-4.8 5.5-4.8s4.9 1.8 5.5 4.8" stroke="#b7791f" strokeWidth="1.8" strokeLinecap="round" /><circle cx="17" cy="9" r="2.4" stroke="#b7791f" strokeWidth="1.6" /><path d="M15.5 14.6c2.3.2 4 1.8 4.5 4.4" stroke="#b7791f" strokeWidth="1.6" strokeLinecap="round" /></svg> },
];

const MAGNIFICATION = 1.25;
const DISTANCE = 120;

export default function CardNav({ current }) {
  const navRef = useRef(null);
  const itemRefs = useRef([]);
  const [scales, setScales] = useState(() => ITEMS.map(() => 1));
  const [bouncing, setBouncing] = useState(-1);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleMove = useCallback((e) => {
    if (mobile) return;
    const nav = navRef.current;
    if (!nav) return;
    const rect = nav.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const next = itemRefs.current.map((el) => {
      if (!el) return 1;
      const r = el.getBoundingClientRect();
      const center = r.left + r.width / 2 - rect.left;
      const dist = Math.abs(x - center);
      const t = Math.max(0, 1 - dist / DISTANCE);
      return 1 + (MAGNIFICATION - 1) * (t * t);
    });
    setScales(next);
  }, [mobile]);

  const handleLeave = useCallback(() => {
    setScales(ITEMS.map(() => 1));
  }, []);

  const handleClick = useCallback((i) => {
    setBouncing(i);
    setTimeout(() => setBouncing(-1), 420);
  }, []);

  return (
    <nav className="cardnav docknav" aria-label="Sections" ref={navRef} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {ITEMS.map((n, i) => (
        <a
          key={n.label}
          href={n.href}
          ref={(el) => (itemRefs.current[i] = el)}
          aria-current={current === n.href ? "page" : undefined}
          className={current === n.href ? "is-here" : ""}
          onClick={() => handleClick(i)}
          style={{
            transform: mobile ? undefined : `translateY(${scales[i] > 1.05 ? -6 : 0}px) scale(${scales[i]})`,
            transformOrigin: "bottom center",
            transition: "transform 0.18s cubic-bezier(.2,.8,.2,1)",
            willChange: mobile ? undefined : "transform",
            zIndex: !mobile && scales[i] > 1.05 ? 5 : 1,
            position: "relative",
          }}
        >
          <span className={`dock-item ${bouncing === i ? "is-bounce" : ""}`}>
            {n.icon}{n.label}
          </span>
        </a>
      ))}
    </nav>
  );
}
