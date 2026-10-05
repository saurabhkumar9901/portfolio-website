"use client";
import { useState } from "react";

function FacePlaceholder() {
  return (
    <svg className="face" viewBox="0 0 168 168" role="img" aria-label="Placeholder avatar — replace with your memoji at public/avatar.png">
      <ellipse cx="84" cy="172" rx="54" ry="34" fill="#4a7d96" />
      <ellipse cx="84" cy="170" rx="54" ry="34" fill="#54879e" />
      <rect x="73" y="116" width="22" height="28" rx="9" fill="#eab88f" />
      <circle cx="45" cy="94" r="9" fill="#f2c9a4" />
      <circle cx="123" cy="94" r="9" fill="#f2c9a4" />
      <rect x="44" y="50" width="80" height="74" rx="30" fill="#f2c9a4" />
      <path d="M42 102 L42 84 Q42 44 84 42 Q126 44 126 84 L126 102 L116 102 L116 74 Q100 66 84 68 Q62 70 54 78 L52 102 Z" fill="#3a2a22" />
      <rect x="60" y="84" width="19" height="5.5" rx="2.75" fill="#3a2a22" />
      <rect x="89" y="84" width="19" height="5.5" rx="2.75" fill="#3a2a22" />
      <circle cx="69.5" cy="97" r="5.5" fill="#23232a" />
      <circle cx="98.5" cy="97" r="5.5" fill="#23232a" />
      <circle cx="71.3" cy="95.4" r="1.8" fill="#fff" />
      <circle cx="100.3" cy="95.4" r="1.8" fill="#fff" />
      <path d="M84 100 Q82 108 77 111" stroke="#d89a6c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M71 117 Q84 128 97 117" stroke="#8a5a3b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function Avatar() {
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  if (failed) {
    return (
      <div className="avatar">
        <FacePlaceholder />
      </div>
    );
  }
  return (
    <div className={ready ? "avatar" : "avatar is-loading"}>
      <img
        src="/avatar.png"
        alt="Memoji avatar of the site owner"
        fetchPriority="high"
        ref={(el) => { if (el && el.complete && el.naturalWidth > 0) setReady(true); }}
        onLoad={() => setReady(true)}
        onError={() => setFailed(true)}
        className={ready ? "is-ready" : ""}
      />
    </div>
  );
}
