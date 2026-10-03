import SubPage from "../../components/SubPage";
import { funRows } from "../../lib/content";

export const metadata = { title: "Fun — Your Name" };

export default function Page() {
  return (
    <SubPage
      current="/fun"
      eyebrow="Fun · off the keyboard"
      title="The human behind the evals."
      sub="Placeholder fun page — replace with your hobbies, side quests, and the fact people remember."
    >
      <section className="block" aria-label="Fun">
        <div className="spec">
          {funRows.map((f, i) => (
            <div className="spec-row" key={f.title}>
              <div><span className="mono-label">File {String(i + 1).padStart(2, "0")}*</span><h3>{f.title.replace("*", "")}</h3></div>
              <div style={{ gridColumn: "span 2" }}><p style={{ fontSize: 17 }}>{f.text}</p></div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", marginTop: 26 }}>
          <a className="btn btn-primary" href="/contact">Work with the human →</a>
        </p>
      </section>
    </SubPage>
  );
}
