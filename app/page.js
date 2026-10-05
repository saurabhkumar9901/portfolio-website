import Aurora from "../components/Aurora";
import Fluid from "../components/Fluid";
import Avatar from "../components/Avatar";
import AskBar from "../components/AskBar";
import CardNav from "../components/CardNav";

export const metadata = { title: "Your Name — AI Engineer" };

export default function Page() {
  return (
    <>
      <Aurora />
      <Fluid />
      <div className="wrap">
        <div className="toprow">
          {/* <a className="top-pill" href="/contact"><span className="mark">B</span>Build your AI portfolio<span aria-hidden="true">›</span></a> */}
        </div>
        <header className="hero" id="top">
          {/* <span className="hero-eyebrow"><span className="pulse" aria-hidden="true" />Available — 2026 · placeholder content</span> */}
          <h1><span className="soft">Hey, I&apos;m Saurabh Kumar</span></h1>
          <div className="hero-title">AI Engineer</div>
          <p className="hero-sub">
            I build retrieval systems, agents, and evals, then ship them as production web apps.
          </p>
          <Avatar />
          <AskBar />
          <CardNav />
        </header>
        <footer>
          <div className="wrap" style={{ padding: 0 }}>
            <span>© 2026 Your Name* · placeholder portfolio</span>
            <span>Aurora field · ask pill is placeholder logic</span>
          </div>
        </footer>
      </div>
    </>
  );
}
