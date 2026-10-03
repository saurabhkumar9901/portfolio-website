const ITEMS = [
  { href: "/me", label: "Me", icon: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="#0e9f6e" strokeWidth="1.8" /><circle cx="9" cy="10.5" r="1.2" fill="#0e9f6e" /><circle cx="15" cy="10.5" r="1.2" fill="#0e9f6e" /><path d="M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8" stroke="#0e9f6e" strokeWidth="1.8" strokeLinecap="round" /></svg> },
  { href: "/projects", label: "Projects", icon: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="7" width="17" height="13" rx="2.5" stroke="#4d7c0f" strokeWidth="1.8" /><path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7" stroke="#4d7c0f" strokeWidth="1.8" /><path d="M3.5 12.5h17" stroke="#4d7c0f" strokeWidth="1.8" /></svg> },
  { href: "/skills", label: "Skills", icon: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Z" stroke="#6d5ef0" strokeWidth="1.8" strokeLinejoin="round" /><path d="m4.5 12.5 7.5 4 7.5-4" stroke="#6d5ef0" strokeWidth="1.8" strokeLinejoin="round" /><path d="m4.5 16.5 7.5 4 7.5-4" stroke="#6d5ef0" strokeWidth="1.8" strokeLinejoin="round" /></svg> },
  { href: "/fun", label: "Fun", icon: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4" stroke="#c262b8" strokeWidth="1.8" strokeLinecap="round" /><path d="m6.5 6.5 2.5 2.5M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5" stroke="#c262b8" strokeWidth="1.8" strokeLinecap="round" /></svg> },
  { href: "/contact", label: "Contact", icon: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="8" r="3.2" stroke="#b7791f" strokeWidth="1.8" /><path d="M3.5 19c.6-3 2.8-4.8 5.5-4.8s4.9 1.8 5.5 4.8" stroke="#b7791f" strokeWidth="1.8" strokeLinecap="round" /><circle cx="17" cy="9" r="2.4" stroke="#b7791f" strokeWidth="1.6" /><path d="M15.5 14.6c2.3.2 4 1.8 4.5 4.4" stroke="#b7791f" strokeWidth="1.6" strokeLinecap="round" /></svg> },
];

export default function CardNav({ current }) {
  return (
    <nav className="cardnav" aria-label="Sections">
      {ITEMS.map((n) => (
        <a key={n.label} href={n.href} aria-current={current === n.href ? "page" : undefined} className={current === n.href ? "is-here" : ""}>
          {n.icon}{n.label}
        </a>
      ))}
    </nav>
  );
}
