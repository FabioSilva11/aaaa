// Renders the Diffusion Studio project in production/project to an MP4,
// headless: compiles the JSX the way the app does, serves it with the
// project's files to the export host (harness/, built with Vite from the
// Diffusion Studio packages), and drives that host in Chromium.
//
// Usage:
//   node render.mjs [--out file.mp4] [--from s] [--to s] [--fps 30] [--no-audio]

import http from "node:http";
import { open, readFile, readdir, stat, mkdir, writeFile } from "node:fs/promises";
import { join, resolve, dirname, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

import { compileProject } from "./compile.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const PROJECT = resolve(here, "../../project");
const DIST = join(here, "harness/dist");

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const out = resolve(arg("out", join(here, "../../output/sketchware-ia-promo.mp4")));
const options = {
  fps: Number(arg("fps", 30)),
  from: arg("from") !== undefined ? Number(arg("from")) : undefined,
  to: arg("to") !== undefined ? Number(arg("to")) : undefined,
  audio: !args.includes("--no-audio"),
  bitrate: Number(arg("bitrate", 24e6)),
};

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".png": "image/png", ".jpg": "image/jpeg",
  ".svg": "image/svg+xml", ".wav": "audio/wav", ".mp3": "audio/mpeg", ".json": "application/json",
  ".ttf": "font/ttf", ".woff2": "font/woff2",
};

const code = await compileProject(PROJECT);
await mkdir(dirname(out), { recursive: true });

const master = out.replace(/\.mp4$/, "") + ".master.webm";
let outHandle = null;
const inProject = (source) => {
  const path = normalize(source.startsWith("/") ? source : join(PROJECT, source));
  return path;
};

const body = (req) => new Promise((ok) => {
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => ok(Buffer.concat(chunks)));
});

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  try {
    if (url.pathname === "/project.js") {
      res.setHeader("Content-Type", "text/javascript");
      return res.end(code);
    }
    if (url.pathname === "/fs/list") {
      const dir = inProject(url.searchParams.get("source"));
      let entries = [];
      try {
        entries = await Promise.all((await readdir(dir, { withFileTypes: true })).map(async (e) => {
          const s = await stat(join(dir, e.name));
          return { name: e.name, kind: s.isDirectory() ? "directory" : "file", size: s.size, mtime: s.mtimeMs };
        }));
      } catch {}
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify(entries));
    }
    if (url.pathname === "/fs/stat") {
      let result = null;
      try {
        const s = await stat(inProject(url.searchParams.get("source")));
        result = { size: s.size, mtime: s.mtimeMs };
      } catch {}
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify(result));
    }
    if (url.pathname === "/fs/file") {
      const path = inProject(url.searchParams.get("source"));
      const data = await readFile(path);
      res.setHeader("Content-Type", MIME[extname(path)] ?? "application/octet-stream");
      return res.end(data);
    }
    if (url.pathname === "/fs/write") {
      await body(req); // derived caches (thumbnails, peaks): not kept
      return res.end("ok");
    }
    if (url.pathname === "/out/open") {
      outHandle = await open(master, "w");
      return res.end("ok");
    }
    if (url.pathname === "/out/write") {
      const data = await body(req);
      await outHandle.write(data, 0, data.length, Number(url.searchParams.get("position")));
      return res.end("ok");
    }
    if (url.pathname === "/out/close") {
      await outHandle.close();
      outHandle = null;
      return res.end("ok");
    }
    const file = join(DIST, url.pathname === "/" ? "index.html" : url.pathname);
    const data = await readFile(file);
    res.setHeader("Content-Type", MIME[extname(file)] ?? "application/octet-stream");
    return res.end(data);
  } catch (error) {
    res.statusCode = 404;
    res.end(String(error));
  }
});

await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const port = server.address().port;

const requireGlobal = createRequire(join(process.env.PLAYWRIGHT_MODULE_DIR ?? "/opt/node-tools/node_modules", "x.js"));
const { chromium } = requireGlobal("playwright");
const browser = await chromium.launch({
  headless: true,
  args: [
    "--autoplay-policy=no-user-gesture-required",
    "--enable-unsafe-webgpu",
    "--disable-renderer-backgrounding",
    "--disable-background-timer-throttling",
  ],
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, ignoreHTTPSErrors: true });
let last = 0;
page.on("console", (msg) => {
  const text = msg.text();
  if (/^progress /.test(text)) return;
  console.log(`[page:${msg.type()}] ${text}`);
});
page.on("pageerror", (err) => console.log(`[pageerror] ${err.message}`));
await page.exposeFunction("__progress", (p) => {
  const now = Date.now();
  if (now - last > 5000) { console.log(p); last = now; }
});
await page.goto(`http://127.0.0.1:${port}/`);
await page.waitForFunction(() => typeof window.__render === "function");
await page.evaluate(() => { window.__log = (m) => window.__progress(m); });

const started = Date.now();
const report = await page.evaluate((o) => window.__render(o), options);
console.log(JSON.stringify(report, null, 2));
console.log(`render took ${((Date.now() - started) / 1000).toFixed(1)}s → ${out}`);

await browser.close();
server.close();
if (!report.ok) process.exit(1);

// Delivery file: H.264 High / AAC MP4, 1920×1080, from the VP9 master.
const { execFileSync } = await import("node:child_process");
execFileSync("ffmpeg", [
  "-y", "-hide_banner", "-loglevel", "error", "-i", master,
  "-c:v", "libx264", "-preset", "medium", "-crf", "16", "-profile:v", "high", "-pix_fmt", "yuv420p",
  "-r", String(options.fps), "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-movflags", "+faststart",
  ...(options.audio ? [] : ["-an"]),
  out,
], { stdio: "inherit" });
console.log(`delivery → ${out}`);
