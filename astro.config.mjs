// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import phraseBreak from './scripts/phrase-break.mjs';
import baseLinks from './scripts/base-links.mjs';

// GitHub Pages + 独自ドメイン(https://nekokichi.net/)で公開。public/CNAME がドメイン設定
export default defineConfig({
  site: 'https://nekokichi.net',
  trailingSlash: 'ignore',
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') }), phraseBreak(), baseLinks()],
});
