import { z } from 'astro/zod';

// 猫のイラストの指定(src/data/cat-art.ts が描く)。コラムの frontmatter `art:` と猫種図鑑で共通
export const COATS = ['black', 'white', 'blue', 'silver', 'brown', 'red', 'cream', 'seal', 'chocolate', 'lilac', 'ruddy', 'cinnamon', 'fawn'] as const;
export const PATTERNS = ['solid', 'tabby', 'classic', 'spotted', 'ticked', 'bicolor', 'point', 'calico', 'tuxedo', 'kiji'] as const;
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
  })
  .default({ coat: 'brown', pattern: 'kiji', eye: 'gold', ears: 'normal', hair: 'short', expr: 'normal' });

export type Art = z.infer<typeof ART_SCHEMA>;
