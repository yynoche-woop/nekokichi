import { getCollection, type CollectionEntry } from 'astro:content';

export type Column = CollectionEntry<'columns'>;

/** 公開順(新しい順)。本番ビルドでは draft を除く */
export async function getColumns() {
  const all = await getCollection('columns', (c) => (import.meta.env.PROD ? !c.data.draft : true));
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.id.localeCompare(b.id));
}

export const CATEGORY_LABEL = { shuusei: '習性事典', jitsuyo: '暮らし・健康', bunka: '猫と文化', tabi: '猫の旅' } as const;
export const fmtDate = (d: Date) => `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;

// 楽天アフィリエイト(アカウント共通のID。heisei-zukan・onsen-map と同じ)
export const RAKUTEN_AFF_ID = '57ed04be.8b7052f1.57ed04bf.f902b143';
export const rakutenAff = (url: string) => `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_AFF_ID}/?pc=${encodeURIComponent(url)}&m=${encodeURIComponent(url)}`;
