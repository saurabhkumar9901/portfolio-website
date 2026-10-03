import SubPage from "../../components/SubPage";
import Avatar from "../../components/Avatar";
import { logRows } from "../../lib/content";

export const metadata = { title: "Me — Your Name" };

const facts = [
  ["Based*", "Your city · open to remote"],
  ["Focus", "LLM apps → prod"],
  ["Proof", "4 systems · traces"],
  ["Elsewhere*", "GitHub · LinkedIn"],
];

export default function Page() {
  return (
    <SubPage
      current="/me"
      eyebrow="Me · the human"
      title="Hey, I'm Your Name."
      sub="Placeholder bio — an AI developer covering training-to-product. Replace with your story, your photo, and the two sentences people quote back to you."
    >
      <section className="block" aria-label="About">
        <div style={{ display: "flex", justifyContent: "center" }}><Avatar /></div>
        <div className="spec" style={{ marginTop: 28 }}>
          <div className="spec-row">
            <div><span className="mono-label">Currently*</span><h3>AI Engineer, placeholder role</h3><p>Own RAG + agent stack, eval gate on every deploy.</p></div>
            <div><span className="mono-label">Before*</span><p>Shipped LLM features to prod: retrieval quality, streaming UX, cost routing. Replace with your history.</p></div>
            <div><span className="mono-label">Fast facts*</span><p>{facts.map(([k, v]) => <span key={k} style={{ display: "block" }}><strong>{k}:</strong> {v}</span>)}</p></div>
          </div>
        </div>
      </section>
      <section className="block" aria-label="Timeline">
        <div className="sec-head">
          <h2>Build log.</h2>
          <p>Placeholder timeline — replace rows with your roles and ships.</p>
        </div>
        <div className="log">
          {logRows.map((r) => (
            <div className="log-row" key={r.time}><time>{r.time}</time><p dangerouslySetInnerHTML={{ __html: r.html }} /><span aria-hidden="true">→</span></div>
          ))}
        </div>
      </section>
    </SubPage>
  );
}
