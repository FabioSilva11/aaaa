// Builds the headless export host against the Diffusion Studio packages of a
// local checkout of https://github.com/diffusionstudio/editor (DS_EDITOR).

import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const DS_EDITOR = resolve(process.env.DS_EDITOR ?? join(here, '../../../../../diffusionstudio/editor'));
const pkg = (name) => join(DS_EDITOR, 'packages', name, 'src');

export default ({
  root: here,
  base: './',
  logLevel: 'warn',
  resolve: {
    alias: [
      { find: /^@diffusionstudio\/runtime$/, replacement: join(pkg('runtime'), 'index.ts') },
      { find: /^@diffusionstudio\/reconciler$/, replacement: join(pkg('reconciler'), 'index.ts') },
      { find: /^@diffusionstudio\/encoder$/, replacement: join(pkg('encoder'), 'index.ts') },
      { find: /^@diffusionstudio\/assets$/, replacement: join(pkg('assets'), 'index.ts') },
      { find: /^@diffusionstudio\/jsx$/, replacement: join(pkg('jsx'), 'index.ts') },
    ],
  },
  build: {
    outDir: join(here, 'dist'),
    emptyOutDir: true,
    target: 'chrome130',
    minify: false,
    sourcemap: false,
    chunkSizeWarningLimit: 100000,
  },
});
