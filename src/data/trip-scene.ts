// 猫の旅の扉絵(旅先ごとのイラスト)。サイトのステッカー調:太い黒線・ベタ塗り・手前に猫。
// 写真は記事の中で小さく添えるだけにして、記事の顔はこのイラストにする(横田さん 2026-10-03)
import { bodySvg, loafSvg } from './cat-art';
import type { Art } from './art-schema';

export const SCENES = ['catshrine', 'island', 'port', 'jump', 'alley', 'enoshima', 'temple', 'station', 'mining', 'statue', 'mosque', 'ruins', 'walled', 'house', 'festival', 'town', 'shrine'] as const;
export type Scene = (typeof SCENES)[number];

const K = '#1c1629';
const st = (w = 3) => `stroke="${K}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const W = 640, H = 400;

// 脇役の猫(毛色だけ変える)
const EXTRA: Art[] = [
  { coat: 'black', pattern: 'solid', eye: 'gold', ears: 'normal', hair: 'short', expr: 'sleepy' },
  { coat: 'white', pattern: 'calico', eye: 'green', ears: 'normal', hair: 'short', expr: 'normal' },
  { coat: 'red', pattern: 'tabby', eye: 'gold', ears: 'normal', hair: 'short', expr: 'sleepy' },
  { coat: 'brown', pattern: 'kiji', eye: 'gold', ears: 'normal', hair: 'short', expr: 'normal' },
  { coat: 'silver', pattern: 'tabby', eye: 'green', ears: 'normal', hair: 'short', expr: 'sleepy' },
];
const place = (svg: string, x: number, y: number, w: number) => svg.replace(/^<svg /, `<svg x="${x}" y="${y}" width="${w}" height="${(w * 300) / 220}" `);
const sit = (a: Art, x: number, y: number, w: number) => place(bodySvg(a), x, y, w);
const loaf = (a: Art, x: number, y: number, w: number) => place(loafSvg(a), x, y, w);

const sky = (a: string, b: string, id: string) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#${id})"/>`;
const sun = (x: number, y: number, r = 34, c = '#fff6a8') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${st()}/>`;
const cloud = (x: number, y: number, s = 1) => `<path d="M${x} ${y}h${70 * s}a${16 * s} ${16 * s} 0 0 0-${18 * s}-${22 * s}a${22 * s} ${22 * s} 0 0 0-${40 * s}-${6 * s}a${16 * s} ${16 * s} 0 0 0-${12 * s} ${28 * s}z" fill="#fff" ${st(2.5)}/>`;
const sea = (y: number, c = '#3bb6e8') => `<rect y="${y}" width="${W}" height="${H - y}" fill="${c}"/><path d="M0 ${y + 26}q20-8 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0" fill="none" stroke="#fff" stroke-width="3" opacity=".75"/><path d="M${W} ${y}H0" ${st()}/>`;
const boat = (x: number, y: number, c = '#ff3ea5') => `<path d="M${x} ${y}h96l-14 18h-68z" fill="#fff" ${st()}/><rect x="${x + 28}" y="${y - 16}" width="38" height="16" fill="${c}" ${st()}/><rect x="${x + 34}" y="${y - 12}" width="8" height="7" fill="#9be7ff"/><rect x="${x + 50}" y="${y - 12}" width="8" height="7" fill="#9be7ff"/>`;
const palm = (x: number, y: number, h = 150) => `<path d="M${x} ${y}c4-${h * 0.4} 0-${h * 0.75} 14-${h}" fill="none" stroke="${K}" stroke-width="9" stroke-linecap="round"/><path d="M${x} ${y}c4-${h * 0.4} 0-${h * 0.75} 14-${h}" fill="none" stroke="#c99b66" stroke-width="5" stroke-linecap="round"/>${[-70, -30, 10, 50, 100].map((a) => `<path d="M${x + 14} ${y - h}q${Math.cos((a * Math.PI) / 180) * 40} ${Math.sin((a * Math.PI) / 180) * 30 - 20} ${Math.cos((a * Math.PI) / 180) * 70} ${Math.sin((a * Math.PI) / 180) * 50}" fill="none" stroke="#2e9e5a" stroke-width="12" stroke-linecap="round"/>`).join('')}`;
const tree = (x: number, y: number, r = 40, c = '#3fbf6a') => `<rect x="${x - 6}" y="${y - 10}" width="12" height="40" fill="#8a5a3c" ${st(2.5)}/><circle cx="${x}" cy="${y - 30}" r="${r}" fill="${c}" ${st()}/>`;
const torii = (x: number, y: number, s = 1, c = '#e8402a') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-96 0h192l-10 18H-86z" fill="${c}" ${st()}/><rect x="-80" y="18" width="160" height="14" fill="${c}" ${st()}/><rect x="-66" y="32" width="18" height="120" fill="${c}" ${st()}/><rect x="48" y="32" width="18" height="120" fill="${c}" ${st()}/><rect x="-10" y="18" width="20" height="14" fill="${K}"/></g>`;
const maneki = (x: number, y: number, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-14 0q-2-26 14-28t14 28z" fill="#fff" ${st(2)}/><circle cx="0" cy="-32" r="12" fill="#fff" ${st(2)}/><path d="M-10-40l2-9 6 5M10-40l-2-9-6 5" fill="#fff" ${st(2)}/><path d="M6-14q8-8 8-20" fill="none" ${st(2)}/><path d="M-12-24h24" stroke="#e8402a" stroke-width="3"/></g>`;
// 手前の岸壁・砂浜(海の絵で猫が水の上に浮かないように)
const shore = (c = '#d9d2c3') => `<rect y="336" width="${W}" height="${H - 336}" fill="${c}"/><path d="M0 336h${W}" ${st()}/>`;
const fukuishi = (x: number, y: number, c: string) => `<ellipse cx="${x}" cy="${y}" rx="22" ry="16" fill="#d9d2c3" ${st(2.5)}/><path d="M${x - 9} ${y - 2}l3-8 4 5M${x + 9} ${y - 2}l-3-8-4 5" fill="none" stroke="${c}" stroke-width="2.5"/><circle cx="${x - 5}" cy="${y + 2}" r="1.8" fill="${K}"/><circle cx="${x + 5}" cy="${y + 2}" r="1.8" fill="${K}"/>`;

function background(scene: Scene, id: string): string {
  switch (scene) {
    case 'catshrine': // 田代島:森の中の猫神社と海
      return sky('#9be7ff', '#e6fbff', id) + sun(90, 70) + sea(250) + `<path d="M0 250c80-110 260-150 420-120 90 18 160 60 220 120z" fill="#3fbf6a" ${st()}/>` + tree(120, 238, 46, '#2e9e5a') + tree(330, 210, 40, '#2e9e5a') + torii(230, 170, 0.62) + `<rect x="210" y="226" width="40" height="30" fill="#c9c2b3" ${st()}/><path d="M204 226l26-16 26 16z" fill="#8a5a3c" ${st()}/>` + boat(40, 320) + shore('#d9d2c3');
    case 'island': // 島と渡船
      return sky('#7ee0ff', '#ece6ff', id) + sun(540, 70) + cloud(150, 80) + sea(250) + `<path d="M40 252c40-80 120-120 200-116 70 4 120 50 170 116z" fill="#5fcf7a" ${st()}/><path d="M80 250h60v-30h-60z" fill="#fbfaf0" ${st()}/><path d="M74 222l36-20 36 20z" fill="#ff8a1f" ${st()}/>` + boat(360, 300) + shore('#d9d2c3');
    case 'port': // 青島:港のコンクリートに猫が集まる
      return sky('#ffd6a0', '#fff3dc', id) + sun(520, 80, 30, '#fff') + sea(220, '#2fa8dc') + `<path d="M380 222c30-50 90-80 160-70 50 8 80 36 100 70z" fill="#5fcf7a" ${st()}/>` + `<rect y="270" width="${W}" height="130" fill="#cfc6b8"/><path d="M0 270h${W}" ${st()}/><path d="M0 300h${W}" stroke="#b5ab9a" stroke-width="2"/>` + boat(60, 262, '#16e0b0');
    case 'jump': // 佐柳島:堤防から堤防へ飛ぶ猫
      return sky('#7ee0ff', '#f2fbff', id) + cloud(80, 70) + cloud(430, 50, 0.8) + sea(240) + `<rect x="20" y="210" width="230" height="80" fill="#d9d2c3" ${st()}/><rect x="330" y="210" width="290" height="80" fill="#d9d2c3" ${st()}/><path d="M20 230h230M330 230h290" stroke="#b5ab9a" stroke-width="2"/>`;
    case 'alley': // 尾道:坂の路地、福石猫、三重塔
      return sky('#ffcf8a', '#fff3dc', id) + sun(560, 60, 28) + `<path d="M380 120l40-30 40 30zM388 150l32-24 32 24zM394 178l26-20 26 20z" fill="#8a5a3c" ${st()}/><rect x="410" y="120" width="20" height="90" fill="#c9562c" ${st()}/>` + `<path d="M0 400V250l120-40 160 30 360-60v220z" fill="#e9d6b0" ${st()}/>` + [0, 1, 2, 3, 4, 5].map((i) => `<path d="M${60 + i * 30} ${380 - i * 24}h120" stroke="${K}" stroke-width="3"/>`).join('') + `<path d="M0 260V150h90v120z" fill="#fbfaf0" ${st()}/><path d="M-6 154l54-34 54 34z" fill="#5f5870" ${st()}/>` + fukuishi(260, 300, '#ff3ea5') + fukuishi(300, 250, '#6c3cff') + fukuishi(330, 330, '#16e0b0') + tree(560, 260, 50, '#3fbf6a');
    case 'enoshima': // 江の島:展望灯台と橋
      return sky('#ffb3c7', '#fff0f4', id) + sun(110, 90, 38, '#ffef6b') + sea(250) + `<path d="M260 252c30-90 110-140 200-140 80 0 130 60 170 140z" fill="#3fbf6a" ${st()}/><rect x="440" y="70" width="18" height="70" fill="#fbfaf0" ${st()}/><path d="M424 70h50l-8-18h-34z" fill="#fbfaf0" ${st()}/><circle cx="449" cy="44" r="10" fill="#fff6a8" ${st()}/>` + `<path d="M0 290L300 246" stroke="${K}" stroke-width="16"/><path d="M0 290L300 246" stroke="#e9d6b0" stroke-width="10"/>` + shore('#e9d6b0');
    case 'temple': // 豪徳寺:お堂と招き猫の列
      return sky('#ffd6e8', '#fff6fa', id) + `<rect y="300" width="${W}" height="100" fill="#e9d6b0"/><path d="M0 300h${W}" ${st()}/>` + `<path d="M120 150h300l50 40H70z" fill="#5f5870" ${st()}/><rect x="110" y="190" width="320" height="110" fill="#c9562c" ${st()}/><rect x="150" y="210" width="60" height="90" fill="#8a5a3c" ${st()}/><rect x="330" y="210" width="60" height="90" fill="#8a5a3c" ${st()}/>` + tree(540, 250, 48, '#e85a9a') + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => maneki(40 + i * 34, 360 - (i % 2) * 6, 1)).join('') + [0, 1, 2, 3, 4, 5].map((i) => maneki(60 + i * 34, 330, 0.8)).join('');
    case 'station': // 貴志駅:猫の顔の駅舎と電車
      return sky('#9be7c9', '#e6fff6', id) + `<rect y="300" width="${W}" height="100" fill="#cfc6b8"/><path d="M0 330h${W}M0 360h${W}" stroke="${K}" stroke-width="4"/>` + `<path d="M80 300V200h260v100z" fill="#fbfaf0" ${st()}/><path d="M60 205c40-60 80-90 150-90s110 30 150 90z" fill="#8a5a3c" ${st()}/><path d="M110 160l-6-40 40 24M310 160l6-40-40 24" fill="#8a5a3c" ${st()}/><circle cx="170" cy="170" r="12" fill="#fff6a8" ${st()}/><circle cx="250" cy="170" r="12" fill="#fff6a8" ${st()}/><rect x="180" y="240" width="60" height="60" fill="#ff8a1f" ${st()}/>` + `<rect x="390" y="250" width="240" height="70" rx="14" fill="#fbfaf0" ${st()}/>${[410, 470, 530].map((x) => `<rect x="${x}" y="264" width="40" height="26" fill="#9be7ff" ${st(2)}/>`).join('')}<path d="M390 300h240" stroke="#e8402a" stroke-width="6"/>`;
    case 'mining': // 猴硐:山あいの炭鉱の町と鉄道、猫の陸橋
      return sky('#b9e3c6', '#f0fff4', id) + `<path d="M0 240l90-110 80 70 90-120 120 110 90-60 170 110v160H0z" fill="#3fa36a" ${st()}/>` + `<rect y="300" width="${W}" height="100" fill="#cfc6b8"/><path d="M0 320h${W}M0 345h${W}" stroke="${K}" stroke-width="3"/>` + `<path d="M120 300V180M380 300V180" stroke="${K}" stroke-width="6"/><path d="M100 180h300" stroke="${K}" stroke-width="10"/><path d="M100 180h300" stroke="#ff8a1f" stroke-width="5"/>` + `<rect x="420" y="220" width="70" height="80" fill="#a99f92" ${st()}/><path d="M410 222l45-30 45 30z" fill="#5f5870" ${st()}/>`;
    case 'statue': // クチン:大きな白猫の像と街並み
      return sky('#ffd27a', '#fff6dc', id) + sun(80, 70) + `<rect y="300" width="${W}" height="100" fill="#cfc6b8"/><path d="M0 300h${W}" ${st()}/>` + [0, 1, 2].map((i) => `<rect x="${330 + i * 100}" y="${170 + (i % 2) * 20}" width="96" height="${130 - (i % 2) * 20}" fill="${['#ffd6e8', '#e6f7ff', '#fff3c4'][i]}" ${st()}/><path d="M${330 + i * 100} ${200 + (i % 2) * 20}h96" ${st(2)}/>`).join('') + palm(300, 300, 160) + `<g transform="translate(60 110)"><rect x="40" y="170" width="140" height="20" fill="#d9d2c3" ${st()}/><path d="M60 170c-10-60 10-110 50-110s60 50 50 110z" fill="#fff" ${st()}/><circle cx="110" cy="50" r="42" fill="#fff" ${st()}/><path d="M76 24l-4-30 26 18M144 24l4-30-26 18" fill="#fff" ${st()}/><circle cx="96" cy="48" r="5" fill="${K}"/><circle cx="124" cy="48" r="5" fill="${K}"/><path d="M104 62q6 6 12 0" fill="none" ${st(2.5)}/><path d="M150 110q24-30 10-64" fill="none" stroke="#fff" stroke-width="18" stroke-linecap="round"/><path d="M150 110q24-30 10-64" fill="none" ${st()}/></g>`;
    case 'mosque': // イスタンブール:ドームとミナレット、海峡
      return sky('#ffb36b', '#ffe9cc', id) + sun(520, 90, 36, '#ffef6b') + sea(280, '#2f8fd0') + `<rect x="120" y="190" width="300" height="90" fill="#e9d6b0" ${st()}/><path d="M180 190a90 70 0 0 1 180 0z" fill="#a9b8d0" ${st()}/><path d="M130 200a40 32 0 0 1 80 0zM330 200a40 32 0 0 1 80 0z" fill="#a9b8d0" ${st()}/><path d="M270 120v-20" ${st()}/>` + [90, 450].map((x) => `<rect x="${x}" y="110" width="14" height="170" fill="#fbfaf0" ${st()}/><path d="M${x - 2} 110l9-40 9 40z" fill="#a9b8d0" ${st()}/>`).join('') + boat(470, 330, '#e8402a') + shore('#d9c7a8');
    case 'ruins': // ローマ:神殿の柱
      return sky('#ffb36b', '#fff0d9', id) + sun(540, 70) + `<rect y="280" width="${W}" height="120" fill="#e9c995"/><path d="M0 280h${W}" ${st()}/>` + [70, 160, 250, 340, 430].map((x, i) => `<rect x="${x}" y="${140 + (i % 3) * 30}" width="44" height="${140 - (i % 3) * 30}" fill="#f4ead2" ${st()}/><rect x="${x - 6}" y="${128 + (i % 3) * 30}" width="56" height="14" fill="#f4ead2" ${st()}/><path d="M${x + 14} ${150 + (i % 3) * 30}V280M${x + 30} ${150 + (i % 3) * 30}V280" stroke="#d9cdb0" stroke-width="2"/>`).join('') + `<path d="M40 330h260v20H40z" fill="#d9cdb0" ${st()}/>` + tree(590, 270, 36, '#3f8f5a');
    case 'walled': // コトル:山と城壁と入り江
      return sky('#8fd0ff', '#eef8ff', id) + `<path d="M0 220l120-150 110 90 120-130 140 120 150-60v130z" fill="#8a8f98" ${st()}/><path d="M120 70l20 40M350 30l30 50" stroke="#fff" stroke-width="4"/>` + sea(300, '#2fa8dc') + `<path d="M20 300V220h380v80z" fill="#e9d6b0" ${st()}/>${[40, 100, 160, 220, 280, 340].map((x) => `<rect x="${x}" y="206" width="26" height="16" fill="#e9d6b0" ${st(2.5)}/>`).join('')}<path d="M180 220v-60l30-30 30 30v60" fill="#f4ead2" ${st()}/><path d="M200 220v-30a10 10 0 0 1 20 0v30" fill="${K}"/>` + `<path d="M120 140l60 60M170 120l40 50M220 110l30 40" stroke="#e9d6b0" stroke-width="6" stroke-dasharray="2 10" stroke-linecap="round"/>` + shore('#d9d2c3');
    case 'house': // キーウェスト:コロニアルの家、ヤシ、灯台
      return sky('#7ee0ff', '#fff6cc', id) + `<rect y="300" width="${W}" height="100" fill="#7fdc8c"/><path d="M0 300h${W}" ${st()}/>` + `<rect x="420" y="80" width="40" height="220" fill="#fbfaf0" ${st()}/><path d="M420 150h40M420 220h40" stroke="${K}" stroke-width="3"/><rect x="410" y="60" width="60" height="22" fill="#2a2a2a" ${st()}/><circle cx="440" cy="50" r="12" fill="#fff6a8" ${st()}/>` + `<path d="M60 300V180h300v120z" fill="#fff3c4" ${st()}/><path d="M40 185l180-70 180 70z" fill="#16e0b0" ${st()}/><path d="M60 240h300" ${st()}/>${[90, 160, 260, 320].map((x) => `<rect x="${x}" y="196" width="30" height="36" fill="#9be7c9" ${st(2)}/><rect x="${x}" y="252" width="30" height="40" fill="#9be7c9" ${st(2)}/>`).join('')}` + palm(560, 300, 170);
    case 'festival': // イーペル:鐘楼と巨大な猫の山車
      return sky('#6c3cff', '#b9a4ff', id) + [60, 150, 240, 520, 600].map((x, i) => `<circle cx="${x}" cy="${50 + (i % 3) * 26}" r="${6 + (i % 2) * 4}" fill="${['#e6ff2e', '#ff3ea5', '#16e0b0'][i % 3]}"/>`).join('') + `<rect y="310" width="${W}" height="90" fill="#3a2c56"/><path d="M0 310h${W}" ${st()}/>` + `<rect x="250" y="80" width="80" height="230" fill="#e9d6b0" ${st()}/><path d="M240 80l50-60 50 60z" fill="#5f5870" ${st()}/><circle cx="290" cy="120" r="16" fill="#fff" ${st()}/><path d="M290 112v8l6 4" ${st(2)}/><rect x="40" y="200" width="210" height="110" fill="#f4ead2" ${st()}/><path d="M40 200l20-24h170l20 24z" fill="#5f5870" ${st()}/><rect x="330" y="200" width="270" height="110" fill="#f4ead2" ${st()}/><path d="M330 200l20-24h230l20 24z" fill="#5f5870" ${st()}/>${[60, 110, 160, 360, 410, 460, 510, 560].map((x) => `<path d="M${x} 300v-40a12 12 0 0 1 24 0v40" fill="${K}"/>`).join('')}` + `<path d="M0 150q160 40 320 0t320 0" fill="none" stroke="#fff" stroke-width="2"/>${[40, 100, 160, 220, 380, 440, 500, 560].map((x, i) => `<path d="M${x} ${158 + Math.sin(i) * 6}l10 18h-20z" fill="${['#e6ff2e', '#ff3ea5', '#16e0b0'][i % 3]}" ${st(1.5)}/>`).join('')}`;
    case 'shrine':
      return sky('#ff9bc8', '#ffe6f1', id) + `<rect y="300" width="${W}" height="100" fill="#e9d6b0"/>` + torii(320, 150, 1);
    default: // town
      return sky('#ffd27a', '#ffeccc', id) + sun(540, 70) + `<rect y="300" width="${W}" height="100" fill="#e9d6b0"/>` + [30, 130, 230, 330, 430].map((x, i) => `<path d="M${x} 300V${190 + (i % 3) * 20}l45-30 45 30V300z" fill="${['#fbfaf0', '#ffd6e8', '#e6f7ff', '#fff3c4', '#e6fff6'][i]}" ${st()}/>`).join('');
  }
}

/** 旅先の扉絵。主役の猫(記事の art)と、場所に合わせた脇役の猫を描く */
export function tripSceneSvg(scene: string, art: Art, title: string, seed = 1): string {
  const s = (SCENES as readonly string[]).includes(scene) ? (scene as Scene) : 'town';
  const id = `sk-${s}-${seed}`;
  // 脇役は主役と同じ毛色を避ける
  const pool = EXTRA.filter((x) => x.coat !== art.coat);
  const e = (i: number) => pool[(seed + i) % pool.length];
  let cats = '';
  switch (s) {
    case 'jump': // 堤防のすき間を飛ぶ猫(主役を斜めに)
      cats = `<g transform="rotate(-18 290 170)">${place(bodySvg(art), 230, 70, 120)}</g>` + loaf(e(0), 470, 130, 90);
      break;
    case 'port':
      cats = loaf(e(0), 180, 250, 80) + loaf(e(1), 260, 262, 72) + sit(e(2), 330, 214, 76) + loaf(e(3), 120, 290, 70) + sit(art, 440, 150, 150);
      break;
    case 'island':
    case 'catshrine':
      cats = loaf(e(0), 300, 270, 80) + sit(art, 450, 150, 150);
      break;
    case 'temple':
      cats = sit(art, 470, 150, 150);
      break;
    case 'station':
      cats = loaf(art, 185, 220, 50) + loaf(e(1), 470, 300, 70);
      break;
    case 'statue':
      cats = sit(art, 470, 160, 140);
      break;
    case 'ruins':
      cats = loaf(e(0), 100, 290, 60) + loaf(e(2), 260, 300, 56) + sit(art, 450, 150, 150);
      break;
    case 'festival':
      cats = `<g>${place(bodySvg(art), 420, 120, 190)}</g>`;
      break;
    case 'mining':
      cats = loaf(e(0), 220, 128, 50) + sit(art, 460, 160, 140);
      break;
    default:
      cats = loaf(e(0), 230, 290, 70) + sit(art, 460, 150, 150);
  }
  return `<svg class="tripscene" viewBox="0 0 ${W} ${H}" role="img" aria-label="${title.replace(/</g, '')}のイラスト" xmlns="http://www.w3.org/2000/svg">${background(s, id)}${cats}<rect x="1.5" y="1.5" width="${W - 3}" height="${H - 3}" fill="none" ${st()}/></svg>`;
}
