import SubPage from "../../components/SubPage";
import { instruments } from "../../lib/content";

export const metadata = { title: "Skills — Your Name" };

const titles = ["Instrument 1", "Instrument 2", "Instrument 3"];

export default function Page() {
  return (
    <SubPage
      current="/skills"
      eyebrow="Skills · three instruments"
      title="One developer, three instruments."
      sub="What I actually do, the tools I reach for, and the production concern I never skip — verify against the projects."
    >
      <section className="block" aria-label="Skills">
        <div className="spec">
          {instruments.map((ins, i) => (
            <div className="spec-row" key={ins.name}>
              <div><span className="mono-label">{titles[i]}</span><h3>{ins.name}</h3><p>{ins.sub}</p></div>
              <div><span className="mono-label">Reaches for</span><ul>{ins.tools.map((t) => <li key={t}>{t}</li>)}</ul></div>
              <div><span className="mono-label">Never ships without</span><p>{ins.never}</p></div>
            </div>
          ))}
        </div>
      </section>
    </SubPage>
  );
}
