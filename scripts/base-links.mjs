// サブパス公開(例 GitHub Pages の /nekokichi/)のとき、ビルド後のHTMLのサイト内リンク "/..." に base を付ける。
// ページやMarkdownのリンクは常に "/columns/..." のようにルートから書き、公開先が変わってもここだけで吸収する。
// 独自ドメインにしたら astro.config.mjs の base を消すだけでよい(このスクリプトは base が "/" のとき何もしない)。
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

export default function baseLinks() {
  let base = '/';
  return {
    name: 'base-links',
    hooks: {
      'astro:config:done': ({ config }) => { base = config.base.replace(/\/?$/, '/'); },
      'astro:build:done': async ({ dir }) => {
        if (base === '/') return;
        const b = base.slice(1); // "nekokichi/"
        const re = new RegExp(`((?:href|src|action)=")/(?!/|${b})`, 'g');
        for await (const f of walk(fileURLToPath(dir))) {
          const s = await readFile(f, 'utf8');
          const t = s.replace(re, `$1${base}`);
          if (t !== s) await writeFile(f, t);
        }
      },
    },
  };
}
