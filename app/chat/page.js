import { Suspense } from "react";
import ChatLoader from "../../components/ChatLoader";

export default function ChatPage() {
  return (
    <main className="chat-page">
      <header className="chat-top">
        <a className="back" href="/">← Your Name</a>
        <span className="chat-status">interview in progress*</span>
      </header>
      <Suspense fallback={<p className="chat-hint">Opening the interview…</p>}>
        <ChatLoader />
      </Suspense>
      <div className="watermark small" aria-hidden="true">YOURNAME</div>
    </main>
  );
}
