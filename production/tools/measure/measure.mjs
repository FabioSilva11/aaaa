// Per-character advance widths of the composition's fonts, measured in
// Chromium with the same Google Fonts files the Diffusion Studio runtime
// loads. The composition has explicit positioning only (no layout engine),
// so this table is how it sizes pills, blocks and centered rows.
//
// Usage: node measure.mjs  →  project/lib/metrics.json

import { writeFile } from "node:fs/promises";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(here, "../../project/lib/metrics.json");
const FAMILIES = { Inter: [400, 500, 600, 700, 800], "JetBrains Mono": [500] };
const CHARS = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join("") + "áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ→·•…—–“”‘’";

const req = createRequire(join(process.env.PLAYWRIGHT_MODULE_DIR ?? "/opt/node-tools/node_modules", "x.js"));
const { chromium } = req("playwright");
const browser = await chromium.launch();
const page = await browser.newPage({ ignoreHTTPSErrors: true });
const families = Object.entries(FAMILIES).map(([f, w]) => `family=${f.replace(/ /g, "+")}:wght@${w.join(";")}`).join("&");
await page.setContent(`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${families}&display=block">`);
const result = await page.evaluate(async ({ FAMILIES, CHARS }) => {
  const out = {};
  const ctx = document.createElement("canvas").getContext("2d");
  for (const [family, weights] of Object.entries(FAMILIES)) {
    out[family] = {};
    for (const w of weights) {
      await document.fonts.load(`${w} 100px "${family}"`, CHARS);
      ctx.font = `${w} 100px "${family}"`;
      const table = {};
      for (const ch of CHARS) table[ch] = Math.round(ctx.measureText(ch).width * 100) / 100;
      out[family][w] = table;
    }
  }
  return out;
}, { FAMILIES, CHARS });
await writeFile(OUT, JSON.stringify(result));
await browser.close();
console.log("metrics →", OUT, "| Inter 700 'M' =", result.Inter[700]["M"]);
