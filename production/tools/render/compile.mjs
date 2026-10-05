// Compiles a Diffusion Studio project folder exactly the way the desktop app
// does (apps/desktop/src/projects.ts → compileProject): esbuild bundles the
// entry, and every project source goes through babel-preset-solid in
// `universal` mode against the "@diffusionstudio/jsx" runtime, plus the
// app's own source / tag-canonicalization / @inspect plugins.
//
// Usage: node compile.mjs <projectDir> [out.js]

import { createRequire } from "node:module";
import { readFile, writeFile, realpath } from "node:fs/promises";
import { join, relative, sep, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { canonicalizeTagsPlugin, inspectPlugin, sourcePlugin } from "./vendor/ds-source-plugins.mjs";

const here = dirname(fileURLToPath(import.meta.url));
export const DS_EDITOR = resolve(process.env.DS_EDITOR ?? join(here, "../../../../diffusionstudio/editor"));
const require = createRequire(join(DS_EDITOR, "package.json"));

const RUNTIME_MODULE = "@diffusionstudio/jsx";
const preset = (name) => {
  const loaded = require(name);
  return loaded.default ?? loaded;
};

export async function compileProject(dir) {
  const babel = require("@babel/core");
  const esbuild = require("esbuild");
  const root = await realpath(dir);
  const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
  const entry = pkg.main ?? "index.tsx";

  const solidLoader = {
    name: "solid-universal",
    setup(build) {
      build.onLoad({ filter: /\.[jt]sx?$/ }, async (args) => {
        const name = relative(root, args.path);
        if (name.startsWith("..") || name.includes(`${sep}node_modules${sep}`)) return undefined;
        const file = name.split(sep).join("/");
        const source = await readFile(args.path, "utf8");
        const result = await babel.transformAsync(source, {
          filename: args.path,
          babelrc: false,
          configFile: false,
          plugins: [[sourcePlugin, { file }], canonicalizeTagsPlugin, [inspectPlugin, { file }]],
          presets: [
            [preset("babel-preset-solid"), { generate: "universal", moduleName: RUNTIME_MODULE }],
            [preset("@babel/preset-typescript"), { onlyRemoveTypeImports: true }],
          ],
        });
        return { contents: result?.code ?? "", loader: "js" };
      });
    },
  };

  const result = await esbuild.build({
    bundle: true,
    write: false,
    format: "cjs",
    platform: "browser",
    target: "chrome130",
    external: ["solid-js", "solid-js/*", RUNTIME_MODULE],
    logLevel: "silent",
    entryPoints: [join(root, entry)],
    plugins: [solidLoader],
  });
  return result.outputFiles[0].text;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const [dir, out] = process.argv.slice(2);
  const code = await compileProject(dir);
  if (out) await writeFile(out, code);
  else process.stdout.write(code);
}
