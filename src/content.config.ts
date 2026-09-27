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
    // kensho = ウワサ検証, jitsuyo = 暮らし・健康の実用
    category: z.enum(['kensho', 'jitsuyo']),
    tags: z.array(z.string()).default([]),
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
