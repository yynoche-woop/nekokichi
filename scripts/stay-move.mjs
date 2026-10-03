// 猫の旅:記事ページの <template data-stay>(StayBox.astro が出す「泊まるならこの宿」)を、
// 本文の「モデルコース」見出しの直前(見どころの後)へ移す。宿の枠は記事に1か所だけ(横田さん 2026-10-04)
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export async function moveStay(file) {
  const html = await readFile(file, 'utf8');
  const m = html.match(/<template data-stay[^>]*>([\s\S]*?)<\/template>/);
  if (!m) return false;
  let out = html.replace(m[0], '');
  const heads = [...out.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)];
  const plain = (s) => s.replace(/<[^>]+>/g, '');
  const h = heads.find((x) => plain(x[1]).trim().startsWith('モデルコース')) ?? heads.find((x) => plain(x[1]).includes('行き方'));
  if (!h) return false;
  out = out.slice(0, h.index) + m[1] + out.slice(h.index);
  await writeFile(file, out);
  return true;
}

export default function stayMove() {
  return {
    name: 'stay-move',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = join(fileURLToPath(dir), 'columns');
        let n = 0;
        for (const d of await readdir(root).catch(() => [])) {
          if (d.startsWith('tabi-') && (await moveStay(join(root, d, 'index.html')).catch(() => false))) n++;
        }
        logger.info(`泊まるならこの宿を ${n} 記事の本文に配置`);
      },
    },
  };
}
