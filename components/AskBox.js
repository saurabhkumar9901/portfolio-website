"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AskBox() {
  const [value, setValue] = useState("");
  const router = useRouter();
  return (
    <form
      className="askbox hero-ask"
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) router.push(`/chat?q=${encodeURIComponent(value.trim())}`);
      }}
    >
      <label className="sr" htmlFor="hero-ask">Ask me anything</label>
      <input
        id="hero-ask"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask me anything…"
        autoComplete="off"
      />
      <button type="submit" aria-label="Send question" disabled={!value.trim()}>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </form>
  );
}
