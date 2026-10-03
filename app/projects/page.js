import SubPage from "../../components/SubPage";
import Pipeline from "../../components/Pipeline";
import { systems } from "../../lib/content";

export const metadata = { title: "Projects — Your Name" };

export default function Page() {
  return (
    <SubPage
      current="/projects"
      eyebrow="Projects · proof over claims"
      title="Selected systems, each runnable."
      sub="Placeholder builds covering retrieval, agents, training, and full-stack delivery. Run the live pipeline, inspect a trace. Asterisked numbers are synthetic."
    >
      <section className="block" aria-label="Projects">
        {systems.map((s) => (
          <article className="system" key={s.name}>
            <div className="sys-main">
              <h3 className="sys-title">{s.name}</h3>
              <p className="sys-desc">{s.desc}</p>
              <div className="sys-tags">{s.tags.map((t) => <span key={t}>{t}</span>)}</div>
              <dl className="sys-metrics">
                {s.metrics.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
              </dl>
              <div className="lamps" aria-label="Evaluation status">
                eval
                {s.lamps.map((l, i) => <span key={i} className={`lampdot ${l}`} aria-hidden="true" />)}
                <span>suite passing*</span>
              </div>
              <div className="sys-links">
                <span className="btn btn-ghost btn-small is-disabled" aria-disabled="true" title="Placeholder — add case-study link">Case study*</span>
                <span className="btn btn-ghost btn-small is-disabled" aria-disabled="true" title="Placeholder — add code link">Code*</span>
                <span className="btn btn-ghost btn-small is-disabled" aria-disabled="true" title="Placeholder — add demo link">Live demo*</span>
              </div>
            </div>
            <div className="sys-side">
              {s.live ? (
                <div className="sheet" aria-label="Live pipeline demonstration">
                  <div className="sheet-head">
                    <span className="lamp" aria-hidden="true" />
                    <span>Live system — Atlas RAG*</span>
                    <span className="no">run ai-2026-084</span>
                  </div>
                  <div className="sheet-body"><Pipeline /></div>
                  <div className="sheet-foot"><span>* synthetic demo data</span><span>trace below</span></div>
                </div>
              ) : (
                <>
                  <div className="mini-dag" aria-hidden="true">
                    {s.flows.map(([label, pct]) => (
                      <div className="row" key={label}>
                        <b>{pct}%</b>
                        <span className="bar"><i style={{ width: `${pct}%` }} /></span>
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                  <span className="placeholder-note">Placeholder — replace with real architecture</span>
                </>
              )}
            </div>
          </article>
        ))}
      </section>
    </SubPage>
  );
}
