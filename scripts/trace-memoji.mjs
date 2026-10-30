// One-off asset build: trace every PNG in "Memoji pack" to a real SVG.
//
//   npm run trace:memoji
//
// Output: public/memoji/<source name>.svg (900x900, viewBox preserved).
//
// Why it pre-processes instead of tracing the raw render: the pack images are
// soft-shaded 3D renders. VTracer turns every tonal gradient into a hard-edged
// flat patch, so at avatar size (120-168px) the face reads as oily — bright
// plates on the forehead, cheeks and around the glasses.
//
// The prep below flattens that shading *before* tracing:
//
//   1. key the flat white backdrop to transparency and drop the antialiased
//      rim (otherwise a light halo survives as a thin outline);
//   2. suppress specular highlights on skin only — pixels much brighter than
//      their wide neighbourhood are pulled back toward it, while hair, glasses,
//      teeth and eye whites keep their contrast;
//   3. remove 40% of the broad skin lighting so forehead/cheek light plates
//      stop being separate regions, keeping enough form to stay 3D;
//   4. blur, quantise to a small palette and median-clean, so the tracer emits
//      a handful of large smooth regions instead of dozens of slivers.

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import vectorizer from "@neplex/vectorizer";

const { vectorize, optimizeSync, Preset } = vectorizer;

const SRC_DIR = "Memoji pack";
const OUT_DIR = path.join("public", "memoji");

const BG_WHITE = 244; // backdrop threshold
const BLUR = 1.4; // soften left-over gradients before quantising
const COLOURS = 14; // palette size handed to the tracer
const MEDIAN = 3; // clears single-pixel islands

const SHINE_RADIUS = 25; // neighbourhood used to find specular
const SHINE_KNEE = 2; // how much brighter than local mean counts as specular
const SHINE_KEEP = 0.1; // how much of that excess survives
const FORM_RADIUS = 45; // neighbourhood used to read broad lighting
const FORM_REMOVE = 0.5; // how much broad lighting is flattened

const NEIGHBOURS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const BITS = 5; // histogram resolution per channel
const SHIFT = 8 - BITS;
const SIDE = 1 << BITS;
const BINS = SIDE * SIDE * SIDE;

/** Median-cut palette over the opaque pixels, so flat regions come from a small fixed set. */
function medianCut(rgb, alpha, colours) {
  const hist = new Uint32Array(BINS);
  const n = alpha.length;
  for (let i = 0; i < n; i++) {
    if (!alpha[i]) continue;
    const o = i * 3;
    const idx = ((rgb[o] >> SHIFT) << (BITS * 2)) | ((rgb[o + 1] >> SHIFT) << BITS) | (rgb[o + 2] >> SHIFT);
    hist[idx]++;
  }

  const bins = [];
  for (let i = 0; i < BINS; i++) if (hist[i]) bins.push(i);
  if (!bins.length) return [[255, 255, 255]];

  const channel = (idx, c) => (idx >> ((2 - c) * BITS)) & (SIDE - 1);
  const centre = (idx) => [
    (channel(idx, 0) << SHIFT) + (1 << (SHIFT - 1)),
    (channel(idx, 1) << SHIFT) + (1 << (SHIFT - 1)),
    (channel(idx, 2) << SHIFT) + (1 << (SHIFT - 1)),
  ];

  const boxes = [bins];
  while (boxes.length < colours) {
    let pick = -1;
    let best = -1;
    for (let b = 0; b < boxes.length; b++) {
      if (boxes[b].length < 2) continue;
      let weight = 0;
      for (const idx of boxes[b]) weight += hist[idx];
      if (weight > best) {
        best = weight;
        pick = b;
      }
    }
    if (pick < 0) break;
    const box = boxes[pick];

    let axis = 0;
    let span = -1;
    for (let c = 0; c < 3; c++) {
      let lo = SIDE;
      let hi = -1;
      for (const idx of box) {
        const v = channel(idx, c);
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
      if (hi - lo > span) {
        span = hi - lo;
        axis = c;
      }
    }

    box.sort((a, b) => channel(a, axis) - channel(b, axis));
    let total = 0;
    for (const idx of box) total += hist[idx];
    let acc = 0;
    let cut = 1;
    for (let i = 0; i < box.length - 1; i++) {
      acc += hist[box[i]];
      cut = i + 1;
      if (acc * 2 >= total) break;
    }
    if (cut >= box.length) cut = box.length - 1;
    boxes.splice(pick, 1, box.slice(0, cut), box.slice(cut));
  }

  return boxes.map((box) => {
    let r = 0;
    let g = 0;
    let b = 0;
    let weight = 0;
    for (const idx of box) {
      const c = centre(idx);
      const count = hist[idx];
      r += c[0] * count;
      g += c[1] * count;
      b += c[2] * count;
      weight += count;
    }
    return [Math.round(r / weight), Math.round(g / weight), Math.round(b / weight)];
  });
}

/** Map every pixel to its nearest palette entry, via a cached 15-bit lookup. */
function applyPalette(rgb, alpha, palette) {
  const cache = new Int16Array(BINS).fill(-1);
  const n = alpha.length;
  for (let i = 0; i < n; i++) {
    const o = i * 3;
    const idx = ((rgb[o] >> SHIFT) << (BITS * 2)) | ((rgb[o + 1] >> SHIFT) << BITS) | (rgb[o + 2] >> SHIFT);
    let pick = cache[idx];
    if (pick < 0) {
      let best = Infinity;
      for (let p = 0; p < palette.length; p++) {
        const dr = rgb[o] - palette[p][0];
        const dg = rgb[o + 1] - palette[p][1];
        const db = rgb[o + 2] - palette[p][2];
        const d = dr * dr + dg * dg + db * db;
        if (d < best) {
          best = d;
          pick = p;
        }
      }
      cache[idx] = pick;
    }
    rgb[o] = palette[pick][0];
    rgb[o + 1] = palette[pick][1];
    rgb[o + 2] = palette[pick][2];
  }
  return rgb;
}

function isWhiteish(fill) {
  const m = /^#([0-9a-f]{6})$/i.exec(fill || "");
  if (!m) return false;
  const n = parseInt(m[1], 16);
  return ((n >> 16) & 255) >= BG_WHITE && ((n >> 8) & 255) >= BG_WHITE && (n & 255) >= BG_WHITE;
}

function stripBackground(svg) {
  const paths = svg.match(/<path\b[^>]*\/>/g);
  if (!paths?.length) return svg;
  if (!isWhiteish(/fill="([^"]*)"/.exec(paths[0])?.[1])) return svg;
  let replaced = false;
  return svg.replace(paths[0], () => {
    if (replaced) return paths[0];
    replaced = true;
    return "";
  });
}

/** Flood-fill the flat backdrop from the border and clear its alpha. */
function keyBackground(raw, w, h) {
  const n = w * h;
  const near = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    near[i] = raw[o] >= BG_WHITE && raw[o + 1] >= BG_WHITE && raw[o + 2] >= BG_WHITE ? 1 : 0;
  }
  const seen = new Uint8Array(n);
  const stack = [];
  for (let x = 0; x < w; x++) {
    if (near[x]) stack.push(x);
    if (near[(h - 1) * w + x]) stack.push((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    if (near[y * w]) stack.push(y * w);
    if (near[y * w + w - 1]) stack.push(y * w + w - 1);
  }
  while (stack.length) {
    const i = stack.pop();
    if (seen[i] || !near[i]) continue;
    seen[i] = 1;
    const x = i % w;
    const y = (i / w) | 0;
    if (x > 0) stack.push(i - 1);
    if (x < w - 1) stack.push(i + 1);
    if (y > 0) stack.push(i - w);
    if (y < h - 1) stack.push(i + w);
  }
  for (let i = 0; i < n; i++) if (seen[i]) raw[i * 4 + 3] = 0;
  return raw;
}

/** Drag interior colour into the transparent margin so later blur has no white to pull in. */
function inpaintMargin(raw, w, h, passes = 10) {
  const n = w * h;
  for (let p = 0; p < passes; p++) {
    let changed = 0;
    const src = Buffer.from(raw);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        if (src[i * 4 + 3] !== 0) continue;
        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;
        for (const [dx, dy] of NEIGHBOURS) {
          const j = (y + dy) * w + (x + dx);
          if (src[j * 4 + 3] === 0) continue;
          r += src[j * 4];
          g += src[j * 4 + 1];
          b += src[j * 4 + 2];
          count++;
        }
        if (!count) continue;
        raw[i * 4] = r / count;
        raw[i * 4 + 1] = g / count;
        raw[i * 4 + 2] = b / count;
        raw[i * 4 + 3] = 0; // still transparent, colour only
        changed++;
      }
    }
    if (!changed) break;
  }
  return raw;
}

async function blurChannel(values, w, h, sigma) {
  return sharp(values, { raw: { width: w, height: h, channels: 1 } })
    .blur(sigma)
    .toColourspace("b-w")
    .raw()
    .toBuffer();
}

/**
 * Flatten the render's specular + broad lighting. Only warm, mid-bright pixels
 * are touched, which leaves hair, glasses, teeth and the flat backdrop alone.
 */
/**
 * Flatten the render's specular + broad lighting. Only warm, mid-bright pixels
 * are touched, which leaves hair, glasses, teeth and the flat backdrop alone.
 */
async function flattenSkin(raw, w, h) {
  const n = w * h;
  const mask = new Uint8Array(n);
  const L0 = new Uint8Array(n);
  const masked = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    const r = raw[o];
    const g = raw[o + 1];
    const b = raw[o + 2];
    const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    L0[i] = Math.min(255, l | 0);
    if (r >= g && g >= b && r - b > 5 && r - b < 110 && l > 85 && l < 248) {
      mask[i] = 255;
      masked[i] = L0[i];
    }
  }

  // Pass 1 — specular: pull down pixels much brighter than their neighbourhood.
  const nearMask = await blurChannel(mask, w, h, SHINE_RADIUS);
  const nearLevel = await blurChannel(masked, w, h, SHINE_RADIUS);
  for (let i = 0; i < n; i++) {
    if (!mask[i]) continue;
    const near = nearMask[i] / 255;
    if (near <= 0.02) continue;
    const excess = L0[i] - nearLevel[i] / near - SHINE_KNEE;
    if (excess <= 0) continue;
    const target = L0[i] - excess * (1 - SHINE_KEEP);
    const s = target / Math.max(L0[i], 1);
    const o = i * 4;
    raw[o] = Math.max(0, raw[o] * s);
    raw[o + 1] = Math.max(0, raw[o + 1] * s);
    raw[o + 2] = Math.max(0, raw[o + 2] * s);
  }

  // Pass 2 — broad lighting: read the level off the deshined image and pull
  // light/dark plates part-way back to the median skin tone.
  const L1 = new Uint8Array(n);
  const masked1 = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    const l = 0.2126 * raw[o] + 0.7152 * raw[o + 1] + 0.0722 * raw[o + 2];
    L1[i] = Math.min(255, l);
    if (mask[i]) masked1[i] = L1[i];
  }
  const wideMask = await blurChannel(mask, w, h, FORM_RADIUS);
  const wideLevel = await blurChannel(masked1, w, h, FORM_RADIUS);

  const tones = Array.from(masked1).filter((v) => v > 0).sort((a, b) => a - b);
  const median = tones.length ? tones[tones.length >> 1] : 170;

  for (let i = 0; i < n; i++) {
    if (!mask[i]) continue;
    const wide = wideMask[i] / 255;
    if (wide <= 0.05) continue;
    const target = L1[i] - FORM_REMOVE * (wideLevel[i] / wide - median);
    const s = Math.max(0, target) / Math.max(L1[i], 1);
    const o = i * 4;
    raw[o] = Math.max(0, raw[o] * s);
    raw[o + 1] = Math.max(0, raw[o + 1] * s);
    raw[o + 2] = Math.max(0, raw[o + 2] * s);
  }
  return raw;
}

/** Grow the silhouette outward so the traced edge sits outside the antialiased rim. */
function dilateAlpha(raw, w, h, passes = 2) {
  for (let p = 0; p < passes; p++) {
    const src = Buffer.from(raw);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = (y * w + x) * 4;
        if (src[i + 3] !== 0) continue;
        for (const [dx, dy] of NEIGHBOURS) {
          if (src[((y + dy) * w + (x + dx)) * 4 + 3] !== 0) {
            raw[i + 3] = 255;
            break;
          }
        }
      }
    }
  }
  return raw;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const only = process.argv.slice(2);
  const files = fs
    .readdirSync(SRC_DIR)
    .filter((f) => f.toLowerCase().endsWith(".png"))
    .filter((f) => !only.length || only.includes(path.basename(f, path.extname(f))))
    .sort();

  let total = 0;
  for (const file of files) {
    const name = path.basename(file, path.extname(file));
    const { data, info } = await sharp(path.join(SRC_DIR, file))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const w = info.width;
    const h = info.height;

    let raw = Buffer.from(data);
    keyBackground(raw, w, h);
    dilateAlpha(raw, w, h);
    // Everything outside the silhouette is filled with the nearest interior
    // colour, so the blur below never drags white back into the outline.
    inpaintMargin(raw, w, h, 40);
    raw = await flattenSkin(raw, w, h);

    // Blur -> palette -> median on the extended RGB, then clip back to the
    // silhouette and lay it on white. Tracing an opaque image keeps the edge a
    // crisp shape instead of an alpha boundary the tracer renders as a halo.
    const rgb = Buffer.alloc(w * h * 3);
    const alpha = Buffer.alloc(w * h);
    for (let i = 0; i < w * h; i++) {
      rgb[i * 3] = Math.min(255, Math.max(0, raw[i * 4]));
      rgb[i * 3 + 1] = Math.min(255, Math.max(0, raw[i * 4 + 1]));
      rgb[i * 3 + 2] = Math.min(255, Math.max(0, raw[i * 4 + 2]));
      alpha[i] = raw[i * 4 + 3];
    }

    const blurred = await sharp(rgb, { raw: { width: w, height: h, channels: 3 } })
      .blur(BLUR)
      .raw()
      .toBuffer();
    applyPalette(blurred, alpha, medianCut(blurred, alpha, COLOURS));
    const cleaned = await sharp(blurred, { raw: { width: w, height: h, channels: 3 } })
      .median(MEDIAN)
      .raw()
      .toBuffer();

    const rgba = Buffer.alloc(w * h * 4);
    for (let i = 0; i < w * h; i++) {
      const on = alpha[i] !== 0;
      rgba[i * 4] = on ? cleaned[i * 3] : 255;
      rgba[i * 4 + 1] = on ? cleaned[i * 3 + 1] : 255;
      rgba[i * 4 + 2] = on ? cleaned[i * 3 + 2] : 255;
      rgba[i * 4 + 3] = 255;
    }

    const traced = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
      .png()
      .toBuffer();

    let svg = optimizeSync(stripBackground(await vectorize(traced, Preset.Photo)), { multipass: true });
    // The tracer emits width/height only; a viewBox keeps scaling identical
    // wherever the file is used (img, CSS background, inline).
    svg = svg.replace(/<svg\b([^>]*)>/, (m, attrs) => `<svg${attrs} viewBox="0 0 ${w} ${h}">`);

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
