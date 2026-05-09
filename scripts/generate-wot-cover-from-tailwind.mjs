/**
 * Reads semantic OKLCH tokens from tailwind.css or styles/tailwind.css (.light / .dark),
 * expands them to plain hex/rgba for WeChat miniprogram-safe Wot CSS variables,
 * and injects the result into styles/cover.css between markers.
 *
 * Usage: node scripts/generate-wot-cover-from-tailwind.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const TAILWIND_PATH = fs.existsSync(path.join(ROOT, "tailwind.css"))
  ? path.join(ROOT, "tailwind.css")
  : path.join(ROOT, "styles/tailwind.css");
const COVER_PATH = path.join(ROOT, "styles/cover.css");

const BEGIN = "/* BEGIN GENERATED WOT COVER */";
const END = "/* END GENERATED WOT COVER */";

/** OKLCH → sRGB hex (#rrggbb). Same pipeline as CSS Color 4 oklab route. */
function oklchToHex(L, C, H) {
  const hr = (H * Math.PI) / 180;
  const a = Math.cos(hr) * C;
  const b = Math.sin(hr) * C;
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  let R = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let G = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let B = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  function linToSrgb(c) {
    if (c <= 0.0031308)
      return 12.92 * c;
    return 1.055 * c ** (1 / 2.4) - 0.055;
  }
  function clamp255(x) {
    return Math.max(0, Math.min(255, Math.round(linToSrgb(x) * 255)));
  }
  const r = clamp255(R);
  const g = clamp255(G);
  const bl = clamp255(B);
  return `#${[r, g, bl].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

function parseOklch(value) {
  const s = value.trim();
  const m = s.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/i);
  if (!m)
    throw new Error(`Expected oklch(...), got: ${value}`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function extractClassBody(css, className) {
  const needle = `.${className}`;
  const i = css.indexOf(needle);
  if (i === -1)
    throw new Error(`Missing ${needle} in tailwind.css`);
  const open = css.indexOf("{", i);
  let depth = 0;
  let j = open;
  for (; j < css.length; j++) {
    const ch = css[j];
    if (ch === "{")
      depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        j++;
        break;
      }
    }
  }
  return css.slice(open + 1, j - 1);
}

function parseCssVars(block) {
  const vars = {};
  const re = /--([\w-]+):\s*([^;]+);/g;
  let m;
  while ((m = re.exec(block))) {
    vars[m[1]] = m[2].trim();
  }
  return vars;
}

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [Number.parseInt(h.slice(0, 2), 16), Number.parseInt(h.slice(2, 4), 16), Number.parseInt(h.slice(4, 6), 16)];
}

function lerpHex(a, b, t) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const t2 = Math.max(0, Math.min(1, t));
  const o = A.map((v, i) => Math.round(v + (B[i] - v) * t2));
  return `#${o.map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

function rgba(hex, alpha) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Semantic hex bundle from tailwind --vars */
function tokensFromVars(vars) {
  return {
    bg: oklchToHex(...parseOklch(vars.background)),
    fg: oklchToHex(...parseOklch(vars.foreground)),
    card: oklchToHex(...parseOklch(vars.card)),
    popover: oklchToHex(...parseOklch(vars.popover)),
    primary: oklchToHex(...parseOklch(vars.primary)),
    pf: oklchToHex(...parseOklch(vars["primary-foreground"])),
    secondary: oklchToHex(...parseOklch(vars.secondary)),
    muted: oklchToHex(...parseOklch(vars.muted)),
    mf: oklchToHex(...parseOklch(vars["muted-foreground"])),
    destruct: oklchToHex(...parseOklch(vars.destructive)),
    border: oklchToHex(...parseOklch(vars.border)),
  };
}

/* Fixed accent OKLCH (same as previous hand-tuned cover mapping) */
const ACCENT = {
  succMain: [0.62, 0.17, 145],
  succClick: [0.55, 0.17, 145],
  warnMain: [0.7, 0.19, 55],
  warnClick: [0.63, 0.19, 55],
  yBg: [0.92, 0.08, 85],
  yBorder: [0.85, 0.14, 85],
  yContent: [0.55, 0.14, 75],
  cyBg: [0.94, 0.06, 210],
  cyBorder: [0.82, 0.1, 210],
  cyContent: [0.52, 0.12, 215],
  puBg: [0.94, 0.06, 290],
  puBorder: [0.82, 0.12, 290],
  puContent: [0.52, 0.2, 290],
  grBg: [0.93, 0.07, 275],
  grBorder: [0.8, 0.11, 275],
  grContent: [0.5, 0.22, 275],
  pkBg: [0.94, 0.06, 350],
  pkBorder: [0.85, 0.12, 350],
  pkContent: [0.52, 0.2, 350],
};

function emitThemeBlock(mode, T, opts) {
  const { selectorPrefix } = opts;
  const succ = oklchToHex(...ACCENT.succMain);
  const succD = oklchToHex(...ACCENT.succClick);
  const warn = oklchToHex(...ACCENT.warnMain);
  const warnD = oklchToHex(...ACCENT.warnClick);
  const prRgb = hexToRgb(T.primary);

  const blendBase = mode === "light" ? T.muted : T.bg;
  const classifyBlend = mode === "light" ? 0.55 : 0.78;

  const lines = [];
  const push = (s) => lines.push(s);

  push(`${selectorPrefix} {`);

  const ratiosLow = [0.1, 0.18, 0.28, 0.4, 0.52];
  ratiosLow.forEach((t, idx) => {
    push(`  --wot-primary-${idx + 1}: ${lerpHex(T.bg, T.primary, t)};`);
  });
  push(`  --wot-primary-6: ${T.primary};`);
  [
    [7, 0.78],
    [8, 0.62],
    [9, 0.48],
    [10, 0.34],
  ].forEach(([i, w]) => {
    push(`  --wot-primary-${i}: ${lerpHex(T.fg, T.primary, w)};`);
  });

  push(`  --wot-danger-main: ${T.destruct};`);
  push(`  --wot-danger-hover: ${lerpHex(T.fg, T.destruct, 0.88)};`);
  push(`  --wot-danger-clicked: ${lerpHex(T.fg, T.destruct, 0.72)};`);
  push(`  --wot-danger-disabled: ${lerpHex(T.bg, T.destruct, 0.38)};`);
  push(`  --wot-danger-particular: ${lerpHex(T.bg, T.destruct, 0.22)};`);
  push(`  --wot-danger-surface: ${lerpHex(T.bg, T.destruct, 0.12)};`);

  push(`  --wot-success-main: ${succ};`);
  push(`  --wot-success-hover: ${lerpHex(T.fg, succ, 0.85)};`);
  push(`  --wot-success-clicked: ${lerpHex(T.fg, succD, 0.78)};`);
  push(`  --wot-success-disabled: ${lerpHex(T.bg, succ, 0.35)};`);
  push(`  --wot-success-particular: ${lerpHex(T.bg, succ, 0.22)};`);
  push(`  --wot-success-surface: ${lerpHex(T.bg, succ, 0.12)};`);

  push(`  --wot-warning-main: ${warn};`);
  push(`  --wot-warning-hover: ${lerpHex(T.fg, warn, 0.88)};`);
  push(`  --wot-warning-clicked: ${lerpHex(T.fg, warnD, 0.78)};`);
  push(`  --wot-warning-disabled: ${lerpHex(T.bg, warn, 0.38)};`);
  push(`  --wot-warning-particular: ${lerpHex(T.bg, warn, 0.22)};`);
  push(`  --wot-warning-surface: ${lerpHex(T.bg, warn, 0.12)};`);

  push(`  --wot-text-main: ${T.fg};`);
  push(`  --wot-text-secondary: ${T.mf};`);
  push(`  --wot-text-auxiliary: ${lerpHex(T.bg, T.mf, 0.92)};`);
  push(`  --wot-text-disabled: ${lerpHex(T.bg, T.mf, 0.55)};`);
  push(`  --wot-text-placeholder: ${T.mf};`);
  push(`  --wot-text-white: ${T.pf};`);

  push(`  --wot-icon-main: ${T.fg};`);
  push(`  --wot-icon-secondary: ${T.mf};`);
  push(`  --wot-icon-auxiliary: ${lerpHex(T.bg, T.mf, 0.92)};`);
  push(`  --wot-icon-disabled: ${lerpHex(T.bg, T.mf, 0.55)};`);
  push(`  --wot-icon-placeholder: ${T.mf};`);
  push(`  --wot-icon-white: ${T.pf};`);

  push(`  --wot-border-extra-strong: ${lerpHex(T.border, T.fg, 0.45)};`);
  push(`  --wot-border-strong: ${lerpHex(T.border, T.fg, 0.28)};`);
  push(`  --wot-border-main: ${T.border};`);
  push(`  --wot-border-light: ${lerpHex(T.bg, T.border, 0.58)};`);
  push(`  --wot-border-white: ${T.card};`);
  push(`  --wot-border-zero: transparent;`);

  push(`  --wot-filled-extra-strong: ${T.secondary};`);
  push(`  --wot-filled-strong: ${T.muted};`);
  push(`  --wot-filled-content: ${lerpHex(T.bg, T.muted, 0.72)};`);
  push(`  --wot-filled-bottom: ${T.card};`);
  push(`  --wot-filled-oppo: ${T.popover};`);
  push(`  --wot-filled-zero: transparent;`);

  if (mode === "light") {
    push(`  --wot-divider-main: rgba(0, 0, 0, 0.08);`);
    push(`  --wot-divider-light: rgba(0, 0, 0, 0.04);`);
    push(`  --wot-divider-strong: rgba(0, 0, 0, 0.14);`);
    push(`  --wot-feedback-hover: rgba(0, 0, 0, 0.06);`);
    push(`  --wot-feedback-active: rgba(0, 0, 0, 0.1);`);
  }
  else {
    push(`  --wot-divider-main: rgba(255, 255, 255, 0.08);`);
    push(`  --wot-divider-light: rgba(255, 255, 255, 0.04);`);
    push(`  --wot-divider-strong: rgba(255, 255, 255, 0.14);`);
    push(`  --wot-feedback-hover: rgba(255, 255, 255, 0.06);`);
    push(`  --wot-feedback-active: rgba(255, 255, 255, 0.1);`);
  }
  push(`  --wot-feedback-accent: rgba(${prRgb[0]}, ${prRgb[1]}, ${prRgb[2]}, 0.12);`);
  push(`  --wot-divider-white: ${T.card};`);

  push(`  --wot-opacfilled-tooltip-toast-cover: rgba(0, 0, 0, 0.75);`);
  push(`  --wot-opacfilled-main-cover: rgba(0, 0, 0, 0.55);`);
  push(`  --wot-opacfilled-light-cover: rgba(0, 0, 0, 0.32);`);

  push(`  --wot-picker-view-mask-start-color: ${rgba(T.bg, 0.88)};`);
  push(`  --wot-picker-view-mask-end-color: ${rgba(T.bg, 0.18)};`);

  const yTint = oklchToHex(...ACCENT.yBg);
  const cyTint = oklchToHex(...ACCENT.cyBg);
  const puTint = oklchToHex(...ACCENT.puBg);
  const grTint = oklchToHex(...ACCENT.grBg);
  const pkTint = oklchToHex(...ACCENT.pkBg);

  push(`  --wot-classifyapplication-yellow-background: ${lerpHex(blendBase, yTint, classifyBlend)};`);
  push(`  --wot-classifyapplication-yellow-border: ${lerpHex(T.border, oklchToHex(...ACCENT.yBorder), 0.7)};`);
  push(`  --wot-classifyapplication-yellow-content: ${oklchToHex(...ACCENT.yContent)};`);

  push(`  --wot-classifyapplication-cyan-background: ${lerpHex(blendBase, cyTint, classifyBlend)};`);
  push(`  --wot-classifyapplication-cyan-border: ${lerpHex(T.border, oklchToHex(...ACCENT.cyBorder), 0.65)};`);
  push(`  --wot-classifyapplication-cyan-content: ${oklchToHex(...ACCENT.cyContent)};`);

  push(`  --wot-classifyapplication-purple-background: ${lerpHex(blendBase, puTint, classifyBlend)};`);
  push(`  --wot-classifyapplication-purple-border: ${lerpHex(T.border, oklchToHex(...ACCENT.puBorder), 0.65)};`);
  push(`  --wot-classifyapplication-purple-content: ${oklchToHex(...ACCENT.puContent)};`);

  push(`  --wot-classifyapplication-grape-background: ${lerpHex(blendBase, grTint, classifyBlend)};`);
  push(`  --wot-classifyapplication-grape-border: ${lerpHex(T.border, oklchToHex(...ACCENT.grBorder), 0.65)};`);
  push(`  --wot-classifyapplication-grape-content: ${oklchToHex(...ACCENT.grContent)};`);

  push(`  --wot-classifyapplication-pink-background: ${lerpHex(blendBase, pkTint, classifyBlend)};`);
  push(`  --wot-classifyapplication-pink-border: ${lerpHex(T.border, oklchToHex(...ACCENT.pkBorder), 0.65)};`);
  push(`  --wot-classifyapplication-pink-content: ${oklchToHex(...ACCENT.pkContent)};`);

  push(`}`);
  return lines.join("\n");
}

function buildGeneratedCss() {
  const tailwind = fs.readFileSync(TAILWIND_PATH, "utf8");
  const lightVars = parseCssVars(extractClassBody(tailwind, "light"));
  const darkVars = parseCssVars(extractClassBody(tailwind, "dark"));
  const lightT = tokensFromVars(lightVars);
  const darkT = tokensFromVars(darkVars);

  const lightSelectors = ".light.cover-wd,\n.light.wd-root-portal,\n.light .wd-root-portal";
  const darkSelectors = ".dark.cover-wd,\n.dark.wd-root-portal,\n.dark .wd-root-portal";

  return [
    emitThemeBlock("light", lightT, { selectorPrefix: lightSelectors }),
    "",
    emitThemeBlock("dark", darkT, { selectorPrefix: darkSelectors }),
    "",
  ].join("\n");
}

function main() {
  console.log(`Reading theme from ${path.relative(ROOT, TAILWIND_PATH)}`);
  const generated = buildGeneratedCss();
  let cover = fs.readFileSync(COVER_PATH, "utf8");

  if (!cover.includes(BEGIN) || !cover.includes(END)) {
    console.error(`${COVER_PATH} must contain:\n  ${BEGIN}\n  ${END}`);
    process.exit(1);
  }

  const re = new RegExp(
    `${BEGIN.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${END.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
  );
  cover = cover.replace(re, `${BEGIN}\n${generated}\n${END}`);

  fs.writeFileSync(COVER_PATH, cover, "utf8");
  console.log(`Updated ${path.relative(ROOT, COVER_PATH)}`);
}

main();
