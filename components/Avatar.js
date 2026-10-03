"use client";
import { useEffect, useState } from "react";

function FacePlaceholder() {
  return (
    <svg className="face" viewBox="0 0 168 168" role="img" aria-label="Placeholder avatar — replace with your memoji at public/avatar.png">
      <defs>
        <linearGradient id="avbg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b9f2d5" />
          <stop offset="0.5" stopColor="#a8e9f7" />
          <stop offset="1" stopColor="#d8d1fc" />
        </linearGradient>
      </defs>
      <circle cx="84" cy="84" r="84" fill="url(#avbg)" />
      <circle cx="84" cy="96" r="40" fill="#f2c9a4" />
      <path d="M44 92 Q46 52 84 50 Q122 52 124 92 Q112 66 84 66 Q56 66 44 92 Z" fill="#4a3226" />
      <circle cx="70" cy="98" r="5.5" fill="#23232a" />
      <circle cx="98" cy="98" r="5.5" fill="#23232a" />
      <circle cx="71.8" cy="96.4" r="1.8" fill="#fff" />
      <circle cx="99.8" cy="96.4" r="1.8" fill="#fff" />
      <path d="M62 86 Q70 83 78 86" stroke="#4a3226" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M90 86 Q98 83 106 86" stroke="#4a3226" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M72 116 Q84 126 96 116" stroke="#8a5a3b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function Avatar() {
  const [custom, setCustom] = useState(false);
  useEffect(() => {
    let alive = true;
    fetch("/avatar.png", { method: "HEAD" }).then(
      (r) => { if (alive && r.ok) setCustom(true); },
      () => {}
    );
    return () => { alive = false; };
  }, []);
  return (
    <div className="avatar">
      {custom ? (
        <img src="/avatar.png" alt="Memoji avatar of the site owner" />
      ) : (
        <FacePlaceholder />
      )}
    </div>
  );
}
