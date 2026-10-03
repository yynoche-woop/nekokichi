import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { ART_SCHEMA } from './data/art-schema';
import { SCENES } from './data/trip-scene';

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
    // tabi = 猫の旅(猫に会える旅先。trip に地図・写真の情報。2026-10-03)
    category: z.enum(['shuusei', 'jitsuyo', 'bunka', 'tabi']),
    tags: z.array(z.string()).default([]),
    // 記事冒頭の「答え」。type は色分け用(習性事典では判定ではなく答えの種類の目安)
    verdict: z.object({
      type: z.enum(['hontou', 'uso', 'usoyori', 'kotai', 'kochou', 'warito']),
      label: z.string(),
      summary: z.string(),
    }),
    art: ART_SCHEMA,
    sources: z.array(z.object({ title: z.string(), url: z.string().url() })).default([]),
    // 猫の旅:地図(東京からの位置・Googleマップ)と写真。写真は Wikimedia Commons の自由ライセンスのものだけ(作者・ライセンスを表示)
    trip: z
      .object({
        region: z.enum(['japan', 'world']),
        place: z.string(), // 「宮城県石巻市」「トルコ・イスタンブール」
        lat: z.number(),
        lng: z.number(),
        mapQuery: z.string(), // Googleマップの検索語(スポット名)
        access: z.string(), // 東京からの行き方の要約(所要時間の目安)
        time: z.string().optional(), // 比較表用:東京からの所要の目安(「約4時間」)
        ship: z.boolean().optional(), // 比較表用:船に乗る
        feed: z.string().optional(), // 比較表用:エサやりのルール(短く)
        scene: z.enum(SCENES).default('town'), // 記事の顔のイラスト(src/data/trip-scene.ts)
        photo: z.object({ src: z.string(), alt: z.string(), author: z.string(), license: z.string(), url: z.string().url() }).optional(),
      })
      .optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { columns };
