import type { Art } from './art-schema';

// ツール一覧(トップとツールページで共通)
export const TOOLS: { href: string; t: string; d: string; group: 'fun' | 'health'; art: Art }[] = [
  { href: '/tools/match/', t: '猫種診断', d: '8つの質問で、あなたと相性のいい猫種がわかる。雑種も出ます。', group: 'fun', art: { coat: 'seal', pattern: 'point', eye: 'blue', ears: 'normal', hair: 'long', expr: 'wow' } },
  { href: '/tools/seimei/', t: '猫の姓名判断', d: '苗字と名前の画数で、猫生を五格で占う。凶は出ません。', group: 'fun', art: { coat: 'white', pattern: 'calico', eye: 'green', ears: 'normal', hair: 'short', expr: 'smug' } },
  { href: '/tools/age/', t: '年齢換算', d: 'うちの子は人間でいうと何歳?36猫種から選ぶと、成長の早さの補足も。', group: 'health', art: { coat: 'red', pattern: 'tabby', eye: 'gold', ears: 'normal', hair: 'short', expr: 'sleepy' } },
  { href: '/tools/bcs/', t: '体型チェック(BCS)', d: '触って答えるだけで5段階判定。猫種ごとの体重の目安と見比べられる。', group: 'health', art: { coat: 'blue', pattern: 'solid', eye: 'copper', ears: 'fold', hair: 'short', expr: 'normal' } },
  { href: '/tools/food/', t: 'ごはんの量計算', d: '体重とフードのカロリーから1日の量を計算。猫種ごとの注意つき。', group: 'health', art: { coat: 'black', pattern: 'solid', eye: 'gold', ears: 'normal', hair: 'short', expr: 'wow' } },
];
