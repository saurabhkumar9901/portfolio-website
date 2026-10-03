import SubPage from "../../components/SubPage";
import { contactLinks } from "../../lib/content";

export const metadata = { title: "Contact — Your Name" };

export default function Page() {
  return (
    <SubPage
      current="/contact"
      eyebrow="Contact · replies within 48h*"
      title="Send a spec, get a system."
      sub="Placeholder contact block — swap in your email, calendar, GitHub, and LinkedIn. One clear next step, always one click away."
    >
      <section className="block" aria-label="Contact">
        <div className="contact-grid">
          <div>
            <h3>Hiring or building? Start with one paragraph.</h3>
            <p>Tell me the problem, the data you have, and what good looks like. I reply with a plan, a fixed scope, and what I would measure — or a polite no with a pointer.</p>
            <div className="sys-tags"><span>Full-time</span><span>Freelance</span><span>Advisory</span></div>
          </div>
          <div>
            <div className="contact-lines">
              {contactLinks.map((l) => (
                <a key={l.label} href={l.href}><span>{l.label}</span><span>↗</span></a>
              ))}
            </div>
            <p style={{ marginTop: 18, fontSize: 13 }}>* Placeholder links — wire to real URLs before shipping.</p>
          </div>
        </div>
      </section>
    </SubPage>
  );
}
