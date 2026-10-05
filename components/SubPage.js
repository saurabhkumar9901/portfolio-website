import Aurora from "./Aurora";
import Fluid from "./Fluid";
import CardNav from "./CardNav";

export default function SubPage({ current, eyebrow, title, sub, children }) {
  return (
    <>
      <Aurora />
      <Fluid />
      <div className="wrap">
        <div className="toprow">
          <a className="top-pill" href="/"><span className="mark">←</span>Back home</a>
        </div>
        <header className="hero" style={{ paddingBottom: 10 }}>
          <span className="hero-eyebrow"><span className="pulse" aria-hidden="true" />{eyebrow}</span>
          <h1 style={{ marginBottom: 0 }}>{title}</h1>
          <p className="hero-sub">{sub}</p>
          <CardNav current={current} />
        </header>
        {children}
      </div>
    </>
  );
}
