"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AskBar() {
  const [value, setValue] = useState("");
  const router = useRouter();

  function submit(e) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(`/ask?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="askzone">
      <form className="askbar" onSubmit={submit} role="search" aria-label="Ask me anything">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask me anything…"
          aria-label="Ask me anything"
          maxLength={140}
        />
        <button type="submit" aria-label="Send question">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 10h11M10 5.5 14.5 10 10 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
    </div>
  );
}
