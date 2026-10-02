import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { ART_SCHEMA } from './data/art-schema';

// コラム。書き方のルールは ops/column-spec.md
const columns = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/columns' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // shuusei = 猫の習性事典(2026-09-28 までの kensho=ウワサ検証 を改めた), jitsuyo = 暮らし・健康の実用
    // bunka = 猫と文化(歌・映画・絵。歌詞や台詞は引用しない。2026-10-03)
    category: z.enum(['shuusei', 'jitsuyo', 'bunka']),
    tags: z.array(z.string()).default([]),
    // 記事冒頭の「答え」。type は色分け用(習性事典では判定ではなく答えの種類の目安)
    verdict: z.object({
      type: z.enum(['hontou', 'uso', 'usoyori', 'kotai', 'kochou', 'warito']),
      label: z.string(),
      summary: z.string(),
    }),
    art: ART_SCHEMA,
    sources: z.array(z.object({ title: z.string(), url: z.string().url() })).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { columns };
