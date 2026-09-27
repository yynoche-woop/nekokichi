// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import phraseBreak from './scripts/phrase-break.mjs';
import baseLinks from './scripts/base-links.mjs';

// いまは GitHub Pages(https://yynoche-woop.github.io/nekokichi/)で公開。
// 独自ドメインを取ったら site をそのドメインにして base を消し、public/CNAME を置く。
export default defineConfig({
  site: 'https://yynoche-woop.github.io',
  base: '/nekokichi',
  trailingSlash: 'ignore',
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') }), phraseBreak(), baseLinks()],
});
