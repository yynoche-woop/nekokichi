import { z } from 'astro/zod';

// 猫のイラストの指定(src/data/cat-art.ts が描く)。コラムの frontmatter `art:` と猫種図鑑で共通
export const COATS = ['black', 'white', 'blue', 'silver', 'brown', 'red', 'cream', 'seal', 'chocolate', 'lilac', 'ruddy', 'cinnamon', 'fawn', 'sable', 'mink', 'sepia', 'bluepoint'] as const; // bluepoint=ポイント柄用の、青みのある白い地とブルーグレーのポイント
export const PATTERNS = ['solid', 'tabby', 'classic', 'spotted', 'ticked', 'bicolor', 'point', 'calico', 'tuxedo', 'kiji', 'mitted', 'gloves', 'sepia'] as const;
// point=顔・耳・足・しっぽが濃い(シャム) / mitted=ポイント+白い鼻すじ・胸・足(ラグドールのミテッド・バイカラー)
// gloves=ポイント+白い足先(バーマン) / sepia=ポイントのコントラストが弱く、顔と足先がほんのり濃いグラデ(バーミーズ)
export const EYES = ['gold', 'copper', 'green', 'blue', 'hazel', 'aqua', 'odd'] as const;
export const EARS = ['normal', 'fold', 'curl', 'big', 'tufted'] as const;
export const HAIRS = ['short', 'semi', 'long', 'hairless', 'rex'] as const;
export const EXPRS = ['normal', 'smug', 'wow', 'sleepy'] as const;

export const ART_SCHEMA = z
  .object({
    coat: z.enum(COATS).default('brown'),
    pattern: z.enum(PATTERNS).default('kiji'),
    eye: z.enum(EYES).default('gold'),
    ears: z.enum(EARS).default('normal'),
    hair: z.enum(HAIRS).default('short'),
    expr: z.enum(EXPRS).default('normal'),
    bigEyes: z.boolean().optional(), // 目が大きい(シンガプーラ)
    small: z.boolean().optional(), // 全身を小さめに描く(小柄な猫種)
    bobtail: z.boolean().optional(), // ぽんぽんの短いしっぽ(ジャパニーズボブテイル)
    paleChest: z.boolean().optional(), // 胸・お腹が淡い色(シンガプーラ)
  })
  .default({ coat: 'brown', pattern: 'kiji', eye: 'gold', ears: 'normal', hair: 'short', expr: 'normal' });

export type Art = z.infer<typeof ART_SCHEMA>;
