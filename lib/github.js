const USER = "saurabhkumar9901";
const TTL = 60 * 60 * 1000;

let cache = { at: 0, text: "" };

const FALLBACK =
  "Saurabh Kumar — https://github.com/saurabhkumar9901 — 50+ public repos and counting (bio-stated). Live repo list unavailable right now (API or rate limit); browse the profile for the latest.";

export async function githubRepos() {
  if (Date.now() - cache.at < TTL && cache.text) return cache.text;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const r = await fetch(
      `https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`,
      { signal: ctrl.signal, headers: { Accept: "application/vnd.github+json", "User-Agent": "portfolio-bot" } }
    );
    clearTimeout(timer);
    if (!r.ok) throw new Error(`GitHub ${r.status}`);
    const repos = await r.json();
    const top = repos
      .filter((x) => !x.fork)
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 12)
      .map((x) => `${x.name} (${x.language || "n/a"}, ${x.stargazers_count || 0} stars) — ${x.description || "no description"}`);
    const text = `GitHub ${USER}: ${repos.length} public repos. Most-starred own work: ${top.join(" | ")}. Profile: https://github.com/${USER}`;
    cache = { at: Date.now(), text };
    return text;
  } catch {
    return FALLBACK;
  }
}
