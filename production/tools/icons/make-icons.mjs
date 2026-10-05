// Original icon set for the promo, drawn here from scratch (24-unit grid,
// 2-unit round strokes), plus the brand mark used in the titles. Nothing is
// taken or converted from the Sketchware IA repository: these are new
// drawings in a consistent line style, rasterized to PNG with Chromium so the
// Diffusion Studio composition can use them as <image> sources.
//
// Usage: node make-icons.mjs

import { mkdir } from "node:fs/promises";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const here = dirname(fileURLToPath(import.meta.url));
const ICONS = resolve(here, "../../project/assets/icons");
const BRAND = resolve(here, "../../project/assets/brand");

const TINTS = {
  dark: "#1C1C1E",
  gray: "#8E8E93",
  primary: "#6B5CE7",
  white: "#FFFFFF",
  green: "#2FA36B",
};

// Each icon: SVG body on a 24×24 grid, drawn with `currentColor`.
const S = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
const DRAW = {
  plus: `<path ${S} d="M12 5v14M5 12h14"/>`,
  play: `<path ${S} d="M7 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L8.5 4.64A1 1 0 0 0 7 5.5z"/>`,
  check: `<path ${S} d="M5 12.5l4.5 4.5L19 7.5"/>`,
  text: `<path ${S} d="M5 7V5h14v2M12 5v14M9 19h6"/>`,
  button: `<rect ${S} x="3" y="7" width="18" height="10" rx="5"/><path ${S} d="M8 12h8"/>`,
  input: `<rect ${S} x="3" y="6" width="18" height="12" rx="3"/><path ${S} d="M8 9v6M7 9h2M7 15h2"/>`,
  image: `<rect ${S} x="3" y="4" width="18" height="16" rx="3"/><circle ${S} cx="9" cy="10" r="1.8"/><path ${S} d="M21 16l-5-5-9 9"/>`,
  vertical: `<rect ${S} x="4" y="3" width="16" height="18" rx="3"/><path ${S} d="M4 12h16"/>`,
  horizontal: `<rect ${S} x="3" y="4" width="18" height="16" rx="3"/><path ${S} d="M12 4v16"/>`,
  list: `<path ${S} d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.3" fill="currentColor"/><circle cx="4.5" cy="12" r="1.3" fill="currentColor"/><circle cx="4.5" cy="18" r="1.3" fill="currentColor"/>`,
  check_box: `<rect ${S} x="4" y="4" width="16" height="16" rx="4"/><path ${S} d="M8 12l3 3 5-6"/>`,
  toggle: `<rect ${S} x="2" y="7" width="20" height="10" rx="5"/><circle cx="16.5" cy="12" r="3" fill="currentColor"/>`,
  slider: `<path ${S} d="M3 12h18"/><circle cx="9" cy="12" r="3.2" fill="#FFFFFF" stroke="currentColor" stroke-width="2"/>`,
  search: `<circle ${S} cx="11" cy="11" r="6.5"/><path ${S} d="M20 20l-4.2-4.2"/>`,
  tap: `<circle ${S} cx="12" cy="12" r="3"/><path ${S} d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>`,
  cursor: `<path ${S} d="M5 3.5l13 7-5.6 1.6L9.8 18z"/><path ${S} d="M13 13l5 5"/>`,
  phone: `<rect ${S} x="6" y="2.5" width="12" height="19" rx="3"/><path ${S} d="M11 18.5h2"/>`,
  code: `<path ${S} d="M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15"/>`,
  blocks: `<path ${S} d="M4 5h6v2.2a1.8 1.8 0 1 0 3.6 0V5H20v6h-2.2a1.8 1.8 0 1 0 0 3.6H20V20H4z"/>`,
  palette: `<path ${S} d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-1.3-1.1-1.6-1.1-2.7 0-1 .8-1.6 1.8-1.6H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3z"/><circle cx="7.5" cy="11" r="1.3" fill="currentColor"/><circle cx="10" cy="7" r="1.3" fill="currentColor"/><circle cx="15" cy="7.5" r="1.3" fill="currentColor"/>`,
  gear: `<circle ${S} cx="12" cy="12" r="3"/><path ${S} d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/>`,
  undo: `<path ${S} d="M9 14L4 9l5-5"/><path ${S} d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>`,
  redo: `<path ${S} d="M15 14l5-5-5-5"/><path ${S} d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>`,
  chevron: `<path ${S} d="M7 10l5 5 5-5"/>`,
  menu: `<path ${S} d="M4 7h16M4 12h16M4 17h16"/>`,
  back: `<path ${S} d="M19 12H5M11 6l-6 6 6 6"/>`,
  more: `<circle cx="12" cy="5.5" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="18.5" r="1.6" fill="currentColor"/>`,
  user: `<circle ${S} cx="12" cy="8" r="4"/><path ${S} d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>`,
  wave: `<path ${S} d="M7 13V6.5a1.5 1.5 0 0 1 3 0V12M10 11V4.5a1.5 1.5 0 0 1 3 0V11M13 11V5.5a1.5 1.5 0 0 1 3 0V12M16 12V8.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-.5a6.5 6.5 0 0 1-5.2-2.6L3.6 14.8a1.6 1.6 0 0 1 2.4-2.1L7 13.5"/>`,
  layers: `<path ${S} d="M12 3l9 5-9 5-9-5z"/><path ${S} d="M3 13l9 5 9-5"/>`,
  bolt: `<path ${S} d="M13 2.5L5 13.5h6l-1 8 8-11h-6z"/>`,
  build: `<path ${S} d="M12 3v12M7 10l5 5 5-5M4 19h16"/>`,
  home: `<path ${S} d="M4 11l8-7 8 7v9H4z"/><path ${S} d="M10 20v-5h4v5"/>`,
  folder: `<path ${S} d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>`,
  eye: `<path ${S} d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle ${S} cx="12" cy="12" r="2.8"/>`,
};

// Brand mark: an original drawing of stacked isometric cubes (the product's
// "building blocks" idea) in white over the brand's violet gradient tile.
function cube(cx, cy, s) {
  const h = s * 0.58;
  const top = `M${cx} ${cy - s}L${cx + s} ${cy - s + h}L${cx} ${cy - s + 2 * h}L${cx - s} ${cy - s + h}Z`;
  const left = `M${cx - s} ${cy - s + h}V${cy + h * 0.9}L${cx} ${cy + h * 0.9 + h}V${cy - s + 2 * h}`;
  const right = `M${cx + s} ${cy - s + h}V${cy + h * 0.9}L${cx} ${cy + h * 0.9 + h}`;
  return `<path d="${top}"/><path d="${left}"/><path d="${right}"/>`;
}
const MARK = (tile) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8B6CFF"/>
      <stop offset="0.55" stop-color="#6B5CE7"/>
      <stop offset="1" stop-color="#4C7DFF"/>
    </linearGradient>
    <radialGradient id="shine" cx="0.25" cy="0.15" r="0.9">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.28"/>
      <stop offset="0.6" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  ${tile ? '<rect width="1024" height="1024" rx="232" fill="url(#g)"/><rect width="1024" height="1024" rx="232" fill="url(#shine)"/>' : ""}
  <g fill="none" stroke="#FFFFFF" stroke-width="50" stroke-linecap="round" stroke-linejoin="round">
    ${cube(512, 372, 145)}
    ${cube(362, 637, 145)}
    ${cube(662, 637, 145)}
  </g>
</svg>`;

const req = createRequire(join(process.env.PLAYWRIGHT_MODULE_DIR ?? "/opt/node-tools/node_modules", "x.js"));
const { chromium } = req("playwright");
const browser = await chromium.launch();
const page = await browser.newPage();

async function rasterize(svg, out, size) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
  await page.screenshot({ path: out, omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
}

await mkdir(ICONS, { recursive: true });
await mkdir(BRAND, { recursive: true });
for (const [name, body] of Object.entries(DRAW)) {
  for (const [tint, color] of Object.entries(TINTS)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="192" height="192" style="color:${color}">${body}</svg>`;
    await rasterize(svg, join(ICONS, `${name}-${tint}.png`), 192);
  }
}
await rasterize(MARK(true), join(BRAND, "mark-tile.png"), 1024);
await rasterize(MARK(false), join(BRAND, "mark-cubes.png"), 1024);
await browser.close();
console.log("icons →", ICONS);
