// ネコキチ猫吉のイラスト。太い黒線・フラット塗り・白ふちのステッカー調(週刊ラグドールの pop-art を全猫種向けに一般化)。
// 毛色 × 柄 × 目 × 耳 × 毛の長さ の組み合わせで、雑種も猫種もだいたい描ける。指定の型は art-schema.ts
import type { Art } from './art-schema';

const K = '#141214'; // 線は墨色(ゆるい手描き。太めの線を、ページ側の filter で少しよれさせる)
const WHITE = '#ffffff';
const PINK = '#ff9fb8';

type Tone = { body: string; mark: string; soft: string; label: string };
export const COAT: Record<Art['coat'], Tone> = {
  black: { body: '#2e2b2c', mark: '#141212', soft: '#4a4546', label: '黒' },
  white: { body: '#ffffff', mark: '#e9e4de', soft: '#f3efea', label: '白' },
  blue: { body: '#9aa5b6', mark: '#6d7a8e', soft: '#b9c2cf', label: 'グレー(ブルー)' },
  silver: { body: '#e6eaee', mark: '#3f434a', soft: '#c8cfd6', label: 'シルバー' },
  brown: { body: '#c99b66', mark: '#4a3322', soft: '#e3c49c', label: 'ブラウン' },
  red: { body: '#f3a55e', mark: '#cf6526', soft: '#f8c595', label: '茶(レッド)' },
  cream: { body: '#f7dfba', mark: '#e0b37c', soft: '#fbecd4', label: 'クリーム' },
  seal: { body: '#f3e7d6', mark: '#5b4232', soft: '#a88467', label: 'シール' },
  chocolate: { body: '#f6ebdd', mark: '#86604a', soft: '#c29c80', label: 'チョコレート' },
  lilac: { body: '#f5f0f3', mark: '#a3909d', soft: '#cdbfc8', label: 'ライラック' },
  ruddy: { body: '#c9824c', mark: '#5a3a22', soft: '#dfa878', label: 'ルディ' },
  cinnamon: { body: '#d69c6c', mark: '#9b5a34', soft: '#e8bf98', label: 'シナモン' },
  fawn: { body: '#ead0b6', mark: '#c9a07e', soft: '#f3e2d0', label: 'フォーン' },
  sable: { body: '#7e5236', mark: '#4f3020', soft: '#6a432b', label: 'セーブル' },
  mink: { body: '#d8b892', mark: '#6a4630', soft: '#b89070', label: 'ミンク' },
  sepia: { body: '#dcc3a0', mark: '#7a5a3e', soft: '#f2e6d4', label: 'セピア' },
};
const IRIS: Record<Art['eye'], string> = {
  gold: '#f2c230', copper: '#e68a2e', green: '#6cc26a', blue: '#3d8cf0', hazel: '#b9b03c', aqua: '#3fbfae', odd: '#3d8cf0',
};

/** シャム系(顔・耳・足・しっぽが濃い)の柄 */
const POINTED = ['point', 'mitted', 'gloves', 'sepia'];
const isPoint = (a: Art) => POINTED.includes(a.pattern);

const HEAD = 'M30 104 C28 60 60 40 100 40 C140 40 172 60 170 104 C178 110 176 120 183 128 C172 130 174 141 164 146 C150 164 126 172 100 172 C74 172 50 164 36 146 C26 141 28 130 17 128 C24 120 22 110 30 104 Z';
const HEAD_SHORT = 'M28 108 C26 62 60 40 100 40 C140 40 174 62 172 108 C172 146 142 172 100 172 C58 172 28 146 28 108 Z';
const EARS: Record<Art['ears'], [string, string]> = {
  normal: ['M40 88 L45 24 Q47 11 60 20 L94 50 Z', 'M160 88 L155 24 Q153 11 140 20 L106 50 Z'],
  big: ['M36 96 L28 8 Q28 -6 42 2 L96 50 Z', 'M164 96 L172 8 Q172 -6 158 2 L104 50 Z'],
  tufted: ['M40 88 L45 24 Q47 11 60 20 L94 50 Z', 'M160 88 L155 24 Q153 11 140 20 L106 50 Z'],
  curl: ['M40 88 L44 30 Q44 6 66 8 Q74 10 70 20 Q58 16 58 30 L94 50 Z', 'M160 88 L156 30 Q156 6 134 8 Q126 10 130 20 Q142 16 142 30 L106 50 Z'],
  fold: ['M44 70 Q46 40 78 46 L64 62 Q56 70 44 70 Z', 'M156 70 Q154 40 122 46 L136 62 Q144 70 156 70 Z'],
};
const INNER: Record<Art['ears'], string> = {
  normal: 'M52 72 L55 38 L78 54 Z M148 72 L145 38 L122 54 Z',
  tufted: 'M52 72 L55 38 L78 54 Z M148 72 L145 38 L122 54 Z',
  big: 'M48 80 L42 22 L84 54 Z M152 80 L158 22 L116 54 Z',
  curl: 'M52 72 L54 38 L78 54 Z M148 72 L146 38 L122 54 Z',
  fold: '',
};

function eyes(a: Art, lid: string): string {
  const eye = (x: number, iris: string) => {
    if (a.expr === 'sleepy') return `<path d="M${x - 16} 110 Q${x} 124 ${x + 16} 110" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round"/>`;
    const px = x + (x < 100 ? 2 : -2);
    const k = a.bigEyes ? 1.4 : 1;
    const base = `<ellipse cx="${x}" cy="110" rx="${15 * k}" ry="${16 * k}" fill="#fff" stroke="${K}" stroke-width="4"/><circle cx="${px}" cy="112" r="${(a.expr === 'wow' ? 9 : 11) * k}" fill="${K}" stroke="${iris}" stroke-width="${1.4 * k}"/>`;
    const hi = `<circle cx="${px + 3.5 * k}" cy="${110 - 2.5 * k}" r="${3 * k}" fill="#fff"/>`;
    // smug(ごきげん顔)は半目にせず、ほっぺを赤くする(半目は不機嫌に見えたため)
    const l = a.expr === 'smug' ? `<ellipse cx="${x + (x < 100 ? -12 : 12)}" cy="132" rx="11" ry="6" fill="#ff8fa8" opacity=".55"/>` : '';
    return base + hi + l;
  };
  return eye(74, IRIS[a.eye]) + eye(126, a.eye === 'odd' ? IRIS.gold : IRIS[a.eye]);
}

/** 顔の柄(頭の輪郭の上に重ねる) */
function marks(a: Art, c: Tone): string {
  const M = `<path d="M84 74 L90 60 L100 72 L110 60 L116 74" fill="none" stroke="${c.mark}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
  const cheek = `<g fill="none" stroke="${c.mark}" stroke-width="4.5" stroke-linecap="round"><path d="M34 104 L52 108 M34 118 L50 118 M166 104 L148 108 M166 118 L150 118"/><path d="M100 46 V58 M88 48 L90 58 M112 48 L110 58"/></g>`;
  const muzzleV = `<path d="M100 84 C94 104 82 128 72 156 Q100 170 128 156 C118 128 106 104 100 84 Z" fill="${WHITE}"/>`;
  const chin = `<path d="M78 146 Q100 132 122 146 Q116 168 100 168 Q84 168 78 146 Z" fill="${WHITE}"/>`;
  switch (a.pattern) {
    case 'tabby': return M + cheek;
    case 'kiji': return M + cheek + chin;
    case 'classic': return M + `<g fill="none" stroke="${c.mark}" stroke-width="5" stroke-linecap="round"><path d="M34 100 Q52 104 50 118 Q48 128 38 126 M166 100 Q148 104 150 118 Q152 128 162 126"/><path d="M100 46 V58 M88 48 L90 58 M112 48 L110 58"/></g>`;
    case 'spotted': return M + `<g fill="${c.mark}"><circle cx="44" cy="102" r="4"/><circle cx="40" cy="118" r="3.6"/><circle cx="52" cy="128" r="3.2"/><circle cx="156" cy="102" r="4"/><circle cx="160" cy="118" r="3.6"/><circle cx="148" cy="128" r="3.2"/><circle cx="92" cy="52" r="3"/><circle cx="108" cy="52" r="3"/></g>`;
    case 'ticked': return `<path d="M86 72 L92 62 L100 70 L108 62 L114 72" fill="none" stroke="${c.mark}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/><path d="M78 140 Q100 128 122 140 Q116 164 100 164 Q84 164 78 140 Z" fill="${c.soft}"/>`;
    case 'bicolor': return muzzleV + chin;
    case 'tuxedo': return `<path d="M100 70 C92 96 78 124 66 158 Q100 174 134 158 C122 124 108 96 100 70 Z" fill="${WHITE}"/>` + chin;
    case 'point': return `<path d="M100 64 C70 64 50 86 50 112 C50 138 74 158 100 158 C126 158 150 138 150 112 C150 86 130 64 100 64 Z" fill="${c.soft}"/><path d="M100 76 C78 76 64 92 64 112 C64 132 80 146 100 146 C120 146 136 132 136 112 C136 92 122 76 100 76 Z" fill="${c.mark}" opacity=".6"/>`;
    case 'mitted': return marks({ ...a, pattern: 'point' }, c) + `<path d="M100 92 C95 108 86 128 78 152 Q100 166 122 152 C114 128 105 108 100 92 Z" fill="${WHITE}"/>`;
    case 'gloves': return marks({ ...a, pattern: 'point' }, c);
    case 'sepia': return `<path d="M100 70 C74 70 56 90 56 113 C56 138 77 156 100 156 C123 156 144 138 144 113 C144 90 126 70 100 70 Z" fill="${c.mark}" opacity=".22"/><path d="M100 88 C84 88 74 100 74 116 C74 134 86 146 100 146 C114 146 126 134 126 116 C126 100 116 88 100 88 Z" fill="${c.mark}" opacity=".22"/>`;
    case 'calico': return `<path d="M40 64 C50 44 80 40 94 46 C92 70 70 92 34 96 C32 84 34 72 40 64 Z" fill="${COAT.red.body}"/><path d="M160 64 C150 44 120 40 106 46 C110 66 128 84 166 92 C168 82 166 72 160 64 Z" fill="${COAT.black.body}"/>` + muzzleV;
    default: return '';
  }
}

/** 頭のまわりの毛(長毛・セミロング)。頭の輪郭より後ろに描く */
function ruff(a: Art, fill: string): string {
  if (a.hair !== 'long' && a.hair !== 'semi') return '';
  const big = a.hair === 'long';
  // 頭の下半分〜横を、ふくらみの連続(ふわふわの飾り毛)で囲む
  const n = big ? 11 : 9;
  const r = big ? 90 : 82;
  const pt = (t: number, rr: number) => `${(100 - Math.cos(t) * rr).toFixed(1)} ${(108 + Math.sin(t) * rr * 0.8).toFixed(1)}`;
  const t0 = -Math.PI * 0.06, t1 = Math.PI * 1.06;
  let d = `M${pt(t0, r - 14)}`;
  for (let i = 0; i < n; i++) {
    const a0 = t0 + ((t1 - t0) * i) / n, a1 = t0 + ((t1 - t0) * (i + 1)) / n;
    d += ` Q${pt((a0 + a1) / 2, r + 16)} ${pt(a1, r)}`;
  }
  d += ` L${pt(t1, r - 14)} Z`;
  return `<path d="${d}" fill="${fill}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>`;
}

/** 顔(viewBox 0 0 200 190)。sticker で白ふち */
/** 編集長のキャップ(ネオンイエロー。つばは横向き。耳のあいだにかぶる) */
const BOSS_CAP = `<g class="boss-cap"><path d="M132 50 Q172 40 190 58 Q164 68 130 62 Z" fill="#e6ff2e" stroke="#1c1629" stroke-width="5" stroke-linejoin="round"/><path d="M60 62 Q64 20 100 18 Q138 20 142 62 Q100 54 60 62 Z" fill="#e6ff2e" stroke="#1c1629" stroke-width="5" stroke-linejoin="round"/><path d="M62 56 Q100 46 140 56" fill="none" stroke="#6c3cff" stroke-width="8"/><circle cx="100" cy="18" r="5" fill="#6c3cff" stroke="#1c1629" stroke-width="3"/></g>`;

/** 編集長だけの服装(キャップ・蝶ネクタイ・ベスト)を付けるかどうか */
export type CatArt = Art & { boss?: boolean };

export function faceGroup(a: CatArt, sticker = false): string {
  const c = COAT[a.coat];
  const s = `stroke="${K}" stroke-width="5" stroke-linejoin="round"`;
  const white = a.pattern === 'calico';
  const headFill = white ? WHITE : a.pattern === 'tuxedo' ? COAT.black.body : c.body;
  const earFill = isPoint(a) ? c.mark : a.pattern === 'calico' ? COAT.red.body : a.pattern === 'tuxedo' ? COAT.black.body : c.body;
  const [el, er] = EARS[a.ears];
  const head = a.hair === 'short' || a.hair === 'hairless' || a.hair === 'rex' ? HEAD_SHORT : HEAD;
  const edge = sticker ? `<g fill="${WHITE}" stroke="${WHITE}" stroke-width="22" stroke-linejoin="round"><path d="${el}"/><path d="${er}"/>${ruff(a, WHITE).replace(`stroke="${K}"`, `stroke="${WHITE}"`)}<path d="${head}"/></g>` : '';
  const tufts = a.ears === 'tufted' ? `<path d="M50 20 l-4 -14 M56 18 l2 -14 M150 20 l4 -14 M144 18 l-2 -14" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>` : '';
  const hairless = a.hair === 'hairless' ? `<path d="M80 62 Q100 56 120 62 M84 72 Q100 67 116 72" fill="none" stroke="${K}" stroke-width="2.6" stroke-linecap="round" opacity=".55"/>` : '';
  const whisk = a.hair === 'rex'
    ? `<path d="M44 128 q-8 -8 -16 0 t-14 -2 M46 138 q-8 8 -16 0 t-14 6 M156 128 q8 -8 16 0 t14 -2 M154 138 q8 8 16 0 t14 6" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`
    : `<path d="M44 128 L14 122 M46 138 L16 142 M156 128 L186 122 M154 138 L184 142" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`;
  const foldEar = a.ears === 'fold' ? `<path d="M50 64 Q56 52 70 52 M150 64 Q144 52 130 52" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round"/>` : '';
  return `<g class="cface">
    ${edge}
    ${tufts}
    <path class="ear-l" d="${el}" fill="${earFill}" ${s}/>
    <path class="ear-r" d="${er}" fill="${a.pattern === 'calico' ? COAT.black.body : earFill}" ${s}/>
    ${INNER[a.ears] ? `<path d="${INNER[a.ears]}" fill="${PINK}"/>` : ''}
    ${ruff(a, a.pattern === 'calico' ? WHITE : isPoint(a) ? c.body : headFill)}
    <path d="${head}" fill="${a.hair === 'hairless' ? '#f1cdbd' : headFill}" ${s}/>
    ${a.hair === 'hairless' ? '' : marks(a, c)}
    ${hairless}${foldEar}
    ${a.ears === 'fold' ? `<path d="${el}" fill="${earFill}" ${s}/><path d="${er}" fill="${earFill}" ${s}/>` : ''}
    ${a.boss ? BOSS_CAP : ''}
    <g class="eyes">${eyes(a, isPoint(a) ? c.soft : headFill === WHITE ? '#eee' : c.soft)}</g>
    <ellipse cx="100" cy="130" rx="3.6" ry="2.6" fill="${K}"/>
    <path d="M91 138 Q100 147 109 138" fill="none" stroke="${K}" stroke-width="3.4" stroke-linecap="round"/>
    ${whisk}
  </g>`;
}

/** 線を少し細くする(週刊ラグドールより軽く) */
const thin = (svg: string) => svg.replace(/stroke-width="([\d.]+)"/g, (_, w) => `stroke-width="${+(Number(w) * 1.25).toFixed(1)}"`).replace(/stroke="#1c1629"/g, `stroke="${K}"`);

/** 手描きのゆらぎ:線を少しよれさせるフィルター(ゆるい手描き風。横田さんの参考イメージは「太い墨の線・白目に黒目・余白」) */
const ROUGH = '<defs><filter id="nkr" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';
const rough = (svg: string) => svg.replace(/(<svg[^>]*>)/, `$1${ROUGH}<g filter="url(#nkr)">`).replace(/<\/svg>\s*$/, '</g></svg>');

export const faceGroupThin = (a: CatArt, sticker = false) => thin(faceGroup(a, sticker));

export function faceSvg(a: CatArt, label?: string, sticker = false): string {
  const aria = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
  return rough(`<svg viewBox="-10 -16 220 206" ${aria} xmlns="http://www.w3.org/2000/svg" style="overflow:visible">${faceGroupThin(a, sticker)}</svg>`);
}

/** 全身のおすわり(viewBox 0 0 220 300) */
export function bodySvg(a: Art, label?: string): string {
  const c = COAT[a.coat];
  const s = `stroke="${K}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"`;
  const base = a.pattern === 'calico' ? WHITE : a.pattern === 'tuxedo' ? COAT.black.body : a.hair === 'hairless' ? '#f1cdbd' : c.body;
  const tailCol = isPoint(a) ? c.mark : a.pattern === 'calico' ? COAT.red.body : base;
  const striped = ['tabby', 'kiji', 'classic', 'spotted'].includes(a.pattern);
  const whiteChest = ['bicolor', 'tuxedo', 'kiji', 'calico', 'mitted'].includes(a.pattern);
  const legFill = a.pattern === 'mitted' ? WHITE : a.pattern === 'sepia' ? c.soft : isPoint(a) ? c.soft : whiteChest ? WHITE : base;
  const pawFill = a.pattern === 'gloves' ? WHITE : legFill; // バーマンは白い手袋
  const tail = 'M160 272 C200 272 214 232 202 196';
  const tw = a.hair === 'long' || a.hair === 'semi' ? 34 : 22;
  const aria = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
  const patches = a.pattern === 'calico'
    ? `<path d="M60 170 C80 160 100 176 96 200 C80 206 62 196 58 186 Z" fill="${COAT.red.body}"/><path d="M160 176 C150 166 130 176 134 200 C146 210 164 200 164 190 Z" fill="${COAT.black.body}"/>` : '';
  const stripes = striped ? `<g fill="none" stroke="${c.mark}" stroke-width="5" stroke-linecap="round"><path d="M58 186 q14 4 16 16 M56 212 q16 4 18 18 M164 186 q-14 4 -16 16 M166 212 q-16 4 -18 18"/></g>` : '';
  return rough(thin(`<svg viewBox="0 0 220 300" ${aria} xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
    <g transform="${a.small ? 'translate(110 296) scale(.84) translate(-110 -296)' : ''}">
    <g class="tail">
      <path d="${tail}" fill="none" stroke="${K}" stroke-width="${tw + 10}" stroke-linecap="round"/>
      <path d="${tail}" fill="none" stroke="${tailCol}" stroke-width="${tw}" stroke-linecap="round"/>
      ${striped ? `<path d="${tail}" fill="none" stroke="${c.mark}" stroke-width="${tw}" stroke-dasharray="6 12" opacity=".8"/>` : ''}
    </g>
    <path d="M56 150 C38 196 40 256 60 286 L160 286 C180 256 182 196 164 150 Z" fill="${base}" ${s}/>
    ${patches}${stripes}
    ${whiteChest ? `<path d="M80 160 C70 200 72 250 76 284 L144 284 C148 250 150 200 140 160 Z" fill="${WHITE}"/>` : ''}
    <!-- 前足:付け根(上の辺)には線を引かず、胴体から生えているように見せる(横田さん 2026-10-02) -->
    <rect x="76" y="212" width="28" height="74" rx="14" fill="${legFill}"/>
    <rect x="116" y="212" width="28" height="74" rx="14" fill="${legFill}"/>
    <path d="M76 226 V272 M104 226 V272 M116 226 V272 M144 226 V272" fill="none" ${s}/>
    ${a.pattern === 'gloves' ? `<g fill="${WHITE}"><rect x="78.5" y="256" width="23" height="28"/><rect x="118.5" y="256" width="23" height="28"/></g><path d="M77 256 h26 M117 256 h26" stroke="${K}" stroke-width="2.4" stroke-linecap="round" opacity=".5"/>` : ''}
    <ellipse cx="90" cy="286" rx="19" ry="11" fill="${pawFill}" ${s}/>
    <ellipse cx="130" cy="286" rx="19" ry="11" fill="${pawFill}" ${s}/>
    <path d="M84 281 v9 M96 281 v9 M124 281 v9 M136 281 v9" stroke="${K}" stroke-width="3" stroke-linecap="round"/>
    <g transform="translate(14 0) scale(.96)">${faceGroup(a)}</g>
  </g>
  </svg>`));
}

/** 香箱座り(前足を胸の下にしまって、香箱のように丸くなる座り方)。bodySvg と同じ viewBox 0 0 220 300 */
export function loafSvg(a: Art, label?: string): string {
  const c = COAT[a.coat];
  const s = `stroke="${K}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"`;
  const base = a.pattern === 'calico' ? WHITE : a.pattern === 'tuxedo' ? COAT.black.body : a.hair === 'hairless' ? '#f1cdbd' : c.body;
  const tailCol = isPoint(a) ? c.mark : a.pattern === 'calico' ? COAT.red.body : base;
  const striped = ['tabby', 'kiji', 'classic', 'spotted'].includes(a.pattern);
  const whiteChest = ['bicolor', 'tuxedo', 'kiji', 'calico', 'mitted'].includes(a.pattern);
  const tw = a.hair === 'long' || a.hair === 'semi' ? 30 : 20;
  const aria = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
  const body = 'M44 288 C22 288 18 248 36 220 C56 188 108 176 150 180 C196 184 212 228 208 260 C206 282 194 290 176 290 Z';
  const tail = 'M196 272 C214 284 200 296 168 294 L118 294';
  const patches = a.pattern === 'calico' ? `<path d="M150 186 C184 190 204 220 204 246 C180 248 160 230 150 206 Z" fill="${COAT.black.body}"/><path d="M120 240 C140 236 160 250 158 272 C140 278 122 266 120 240 Z" fill="${COAT.red.body}"/>` : '';
  const stripes = striped ? `<g fill="none" stroke="${c.mark}" stroke-width="5" stroke-linecap="round"><path d="M150 188 q6 16 0 30 M170 192 q8 16 2 32 M188 204 q8 14 4 30"/></g>` : '';
  const shade = isPoint(a) ? `<path d="M150 182 C190 186 210 226 207 258 C190 250 170 226 158 200 Z" fill="${c.soft}" opacity=".7"/>` : '';
  return rough(thin(`<svg viewBox="0 0 220 300" ${aria} xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
    <g transform="${a.small ? 'translate(110 296) scale(.84) translate(-110 -296)' : ''}">
    <path d="${body}" fill="${base}" ${s}/>
    ${patches}${shade}${stripes}
    ${whiteChest ? `<path d="M52 284 C40 250 54 214 92 210 C120 214 132 250 124 286 Z" fill="${WHITE}"/>` : ''}
    <ellipse cx="78" cy="288" rx="15" ry="7" fill="${a.pattern === 'gloves' || a.pattern === 'mitted' || whiteChest ? WHITE : isPoint(a) ? c.soft : base}" ${s}/>
    <g class="tail">
      <path d="${tail}" fill="none" stroke="${K}" stroke-width="${tw + 10}" stroke-linecap="round"/>
      <path d="${tail}" fill="none" stroke="${tailCol}" stroke-width="${tw}" stroke-linecap="round"/>
      ${striped ? `<path d="${tail}" fill="none" stroke="${c.mark}" stroke-width="${tw}" stroke-dasharray="6 12" opacity=".8"/>` : ''}
    </g>
    <g transform="translate(6 58) scale(.86)">${faceGroup({ ...a, expr: a.expr === 'wow' ? 'normal' : a.expr })}</g>
    </g>
  </svg>`));
}

/** 編集長・猫吉(キジトラ白のオス) */
export const NEKOKICHI: CatArt = { coat: 'brown', pattern: 'kiji', eye: 'gold', ears: 'normal', hair: 'short', expr: 'normal', boss: true };

export const PAW_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><ellipse cx="12" cy="16" rx="5.2" ry="4.4"/><ellipse cx="5.6" cy="10.4" rx="2.3" ry="2.9"/><ellipse cx="9.4" cy="6.4" rx="2.3" ry="2.9"/><ellipse cx="14.6" cy="6.4" rx="2.3" ry="2.9"/><ellipse cx="18.4" cy="10.4" rx="2.3" ry="2.9"/></g></svg>`;

/** トップの集合写真:いろんな猫がぎゅうぎゅうに並ぶ。真ん中に編集長 */
export const CROWD: { a: Art; x: number; y: number; s: number; r: number }[] = [
  { a: { coat: 'black', pattern: 'solid', eye: 'gold', ears: 'normal', hair: 'short', expr: 'normal' }, x: 0, y: 150, s: .72, r: -8 },
  { a: { coat: 'white', pattern: 'calico', eye: 'green', ears: 'normal', hair: 'short', expr: 'wow' }, x: 120, y: 70, s: .78, r: 6 },
  { a: { coat: 'seal', pattern: 'point', eye: 'blue', ears: 'normal', hair: 'long', expr: 'normal' }, x: 390, y: 60, s: .8, r: -5 },
  { a: { coat: 'blue', pattern: 'solid', eye: 'copper', ears: 'normal', hair: 'short', expr: 'normal' }, x: 520, y: 150, s: .72, r: 8 },
  { a: { coat: 'silver', pattern: 'classic', eye: 'green', ears: 'normal', hair: 'short', expr: 'smug' }, x: 60, y: 250, s: .7, r: 4 },
  { a: { coat: 'red', pattern: 'tabby', eye: 'gold', ears: 'normal', hair: 'short', expr: 'sleepy' }, x: 460, y: 250, s: .7, r: -6 },
  { a: { coat: 'brown', pattern: 'tabby', eye: 'green', ears: 'tufted', hair: 'long', expr: 'normal' }, x: 0, y: 0, s: .66, r: -10 },
  { a: { coat: 'white', pattern: 'tuxedo', eye: 'gold', ears: 'normal', hair: 'short', expr: 'wow' }, x: 520, y: 0, s: .66, r: 10 },
];

/** 砂かけ中の猫(横向き・左を向いて、こっちを振り返る。viewBox 0 0 400 280)。
 * 動きは「足を付け根で回す」のではなく、手描きのポーズを3コマ切り替える(機械っぽくしない。横田さんの指摘)。
 *   .kf0 かまえ(後ろ足は体の下)/ .kf1 手前の後ろ足でけり上げ / .kf2 奥の後ろ足でけり上げ
 * 足の付け根は胴体の裏に隠し、足は先細りの形。頭は胸に重ねて首をつなげる。しっぽはご機嫌に真上。
 * 砂は、表示中のコマの .toe の位置から飛ばす(script 側) */
export function kickCatSvg(a: CatArt, label?: string): string {
  const c = COAT[a.coat];
  const s = `stroke="${K}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"`;
  const base = a.pattern === 'tuxedo' ? COAT.black.body : c.body;
  const white = ['kiji', 'bicolor', 'tuxedo', 'calico'].includes(a.pattern);
  const striped = ['tabby', 'kiji', 'classic', 'spotted'].includes(a.pattern);
  const pawC = white ? WHITE : base;
  const far = mixDark(base);
  const farPaw = mixDark(pawC);
  const uid = Math.random().toString(36).slice(2, 7);
  const aria = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
  // 足は「左右のふち」だけ線を引く(上のふちに線がないので、胴体から生えて見える)。足先を先に描き、足の色で足首の線を隠す
  type Leg = { l: string; r: string; fill: string; color: string; foot: string };
  const foot = (cx: number, cy: number, rx: number, ry: number, rot: number, fill: string, cls = '') =>
    `<g transform="rotate(${rot} ${cx} ${cy})"><ellipse class="${cls}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${s}/><path d="M${cx - rx * .35} ${cy - ry * .15} v${ry * .6} M${cx + rx * .15} ${cy - ry * .2} v${ry * .6}" stroke="${K}" stroke-width="3" stroke-linecap="round"/></g>`;
  const draw = (g: Leg) => `${g.foot}<path d="${g.fill}" fill="${g.color}"/><path d="${g.l} ${g.r}" fill="none" ${s}/>`;
  const front = (x: number, color: string, pf: string): Leg => ({
    l: `M${x} 180 C${x - 2} 206 ${x} 224 ${x + 2} 240`,
    r: `M${x + 30} 180 C${x + 28} 202 ${x + 26} 222 ${x + 22} 240`,
    fill: `M${x} 180 C${x - 2} 206 ${x} 224 ${x + 2} 240 L${x + 22} 240 C${x + 26} 222 ${x + 28} 202 ${x + 30} 180 Z`,
    color, foot: foot(x + 12, 245, 19, 10, 0, pf),
  });
  const hindRest = (dx: number, color: string, pf: string): Leg => ({
    l: `M${250 + dx} 180 C${262 + dx} 202 ${272 + dx} 222 ${268 + dx} 240`,
    r: `M${284 + dx} 176 C${291 + dx} 198 ${294 + dx} 222 ${288 + dx} 242`,
    fill: `M${250 + dx} 180 C${262 + dx} 202 ${272 + dx} 222 ${268 + dx} 240 L${288 + dx} 242 C${294 + dx} 222 ${291 + dx} 198 ${284 + dx} 176 Z`,
    color, foot: foot(282 + dx, 246, 20, 10, 0, pf),
  });
  const hindKick = (dx: number, dy: number, color: string, pf: string): Leg => ({
    l: `M${270 + dx} 164 C${310 + dx} 184 ${344 + dx} ${186 + dy} ${370 + dx} ${160 + dy}`,
    r: `M${262 + dx} 198 C${306 + dx} 210 ${352 + dx} ${210 + dy} ${384 + dx} ${176 + dy}`,
    fill: `M${270 + dx} 164 C${310 + dx} 184 ${344 + dx} ${186 + dy} ${370 + dx} ${160 + dy} L${384 + dx} ${176 + dy} C${352 + dx} ${210 + dy} ${306 + dx} 210 ${262 + dx} 198 Z`,
    color, foot: foot(382 + dx, 164 + dy, 11, 19, -40, pf, 'toe'),
  });
  const frontNear = front(104, white ? WHITE : base, pawC);
  const frontFar = front(146, far, farPaw);
  const FRAMES: Leg[][] = [
    [hindRest(-24, far, farPaw), hindRest(0, base, pawC)],
    [hindRest(-24, far, farPaw), hindKick(0, 0, base, pawC)],
    [hindKick(-18, 14, far, farPaw), hindRest(0, base, pawC)],
  ];
  const tail = `M318 146 C336 120 338 78 330 42 C326 26 334 16 344 22`;
  const body = `M92 200 C78 176 80 136 106 116 C130 98 190 104 246 102 C300 100 330 128 326 166 C322 200 296 216 256 216 L140 216 C114 216 98 210 92 200 Z`;
  // 胴体の輪郭線は、足が生えているところだけ消す(マスク)。コマごとに足の位置が違うのでコマごとに作る
  const masks = FRAMES.map((legs, f) => `<mask id="km${f}-${uid}" maskUnits="userSpaceOnUse" x="-40" y="-40" width="480" height="360"><rect x="-40" y="-40" width="480" height="360" fill="#fff"/>${[frontNear, frontFar, ...legs].map((g) => `<path d="${g.fill}" fill="#000"/>`).join('')}</mask>`).join('');
  const vest = a.boss ? `<g clip-path="url(#kb-${uid})">
      <path d="M150 90 L238 90 L250 230 L176 230 C156 190 146 140 150 90 Z" fill="#6c3cff"/>
      <path d="M238 90 L250 230" stroke="#e6ff2e" stroke-width="7"/>
      <path d="M150 90 C146 140 156 190 176 230" fill="none" stroke="#e6ff2e" stroke-width="7"/>
      <path d="M186 146 L196 118 L204 121 L194 149 Z" fill="#ff3ea5" stroke="${K}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M180 144 H218 V172 Q218 178 212 178 H186 Q180 178 180 172 Z" fill="#8a64ff" stroke="${K}" stroke-width="3.5" stroke-linejoin="round"/>
    </g>` : '';
  const bow = a.boss ? `<g class="boss-bow"><path d="M108 150 L86 138 L88 164 Z M112 150 L134 138 L132 164 Z" fill="#ff3ea5" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><circle cx="110" cy="151" r="7" fill="#ff3ea5" stroke="${K}" stroke-width="4"/></g>` : '';
  return rough(thin(`<svg viewBox="0 0 400 280" ${aria} xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
    <defs>${masks}<clipPath id="kb-${uid}"><path d="${body}"/></clipPath></defs>
    <g class="kc-tail">
      <path d="${tail}" fill="none" stroke="${K}" stroke-width="30" stroke-linecap="round"/>
      <path d="${tail}" fill="none" stroke="${base}" stroke-width="20" stroke-linecap="round"/>
      ${striped ? `<path d="${tail}" fill="none" stroke="${c.mark}" stroke-width="20" stroke-dasharray="6 13" opacity=".85"/>` : ''}
    </g>
    ${FRAMES.map((legs, f) => `<g class="kf kf${f}">${draw(legs[0])}${draw(legs[1])}</g>`).join('')}
    ${draw(frontFar)}${draw(frontNear)}
    <path d="${body}" fill="${base}"/>
    ${white ? `<path d="M96 196 C88 172 92 146 108 132 C124 160 150 190 206 214 L140 214 C114 214 100 208 96 196 Z" fill="${WHITE}"/>` : ''}
    ${striped ? `<g fill="none" stroke="${c.mark}" stroke-width="6" stroke-linecap="round"><path d="M176 104 q8 20 -2 40 M208 102 q9 22 -1 44 M240 104 q8 20 0 42 M276 108 q8 20 -2 38 M304 124 q6 16 -4 30"/></g>` : ''}
    ${vest}
    ${FRAMES.map((_, f) => `<path class="kf kf${f}" d="${body}" fill="none" ${s} mask="url(#km${f}-${uid})"/>`).join('')}
    <path d="M296 146 C312 164 316 192 302 210" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round" opacity=".5"/>
    <g class="kc-head" transform="translate(34 18) scale(.74)">${faceGroup({ ...a, expr: a.expr === 'normal' ? 'smug' : a.expr })}</g>
    ${bow}
  </svg>`));
}

/** 奥の足用に少し暗くする */
function mixDark(hex: string): string {
  const n = (i: number) => Math.round(parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) * 0.82);
  return '#' + [0, 1, 2].map((i) => n(i).toString(16).padStart(2, '0')).join('');
}
