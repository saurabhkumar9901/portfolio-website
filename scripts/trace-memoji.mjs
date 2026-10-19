// One-off asset build: trace every PNG in "Memoji pack" to a real SVG.
//
// The source renders sit on a flat white background. VTracer emits that
// background as the first path, so we drop it and keep the head on a
// transparent canvas.
//
//   node scripts/trace-memoji.mjs
//
// Output: public/memoji/<source name>.svg (900×900, viewBox preserved).

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import vectorizer from "@neplex/vectorizer";

const { vectorize, optimizeSync, Preset } = vectorizer;

const SRC_DIR = "Memoji pack";
const OUT_DIR = path.join("public", "memoji");

function isWhiteish(fill) {
  const m = /^#([0-9a-f]{6})$/i.exec(fill || "");
  if (!m) return false;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return r >= 248 && g >= 248 && b >= 248;
}

function stripBackground(svg) {
  const paths = svg.match(/<path\b[^>]*\/>/g);
  if (!paths?.length) return svg;
  const fill = /fill="([^"]*)"/.exec(paths[0])?.[1];
  if (!isWhiteish(fill)) return svg;
  let replaced = false;
  return svg.replace(paths[0], () => {
    if (replaced) return paths[0];
    replaced = true;
    return "";
  });
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const files = fs
    .readdirSync(SRC_DIR)
    .filter((f) => f.toLowerCase().endsWith(".png"))
    .sort();

  let total = 0;
  for (const file of files) {
    const name = path.basename(file, path.extname(file));
    const buf = await sharp(path.join(SRC_DIR, file)).ensureAlpha().png().toBuffer();
    const meta = await sharp(buf).metadata();
    let svg = optimizeSync(stripBackground(await vectorize(buf, Preset.Photo)), { multipass: true });
    // The tracer emits width/height only; a viewBox keeps scaling identical
    // wherever the file is used (img, CSS background, inline).
    svg = svg.replace(/<svg\b([^>]*)>/, (m, attrs) => `<svg${attrs} viewBox="0 0 ${meta.width} ${meta.height}">`);
    fs.writeFileSync(path.join(OUT_DIR, `${name}.svg`), svg);
    const kb = svg.length / 1024;
    total += kb;
    console.log(`${name.padEnd(18)} ${kb.toFixed(1).padStart(7)} KB`);
  }
  console.log(`\n${files.length} files, ${(total / 1024).toFixed(2)} MB total`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
