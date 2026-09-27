// 猫砂のかけあい(スプラトゥーンのインクの代わり。横田さん 2026-09-27)。
// 猫が後ろ足でかけた砂が、粒になって飛び散り、山になる。seed が同じなら毎回同じ形になる。

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/** 砂の粒を1つ(少しゆがんだ丸・角の丸い四角)描くパス */
function grain(x: number, y: number, r: number, rand: () => number): string {
  if (rand() < 0.45) {
    // 丸っこい粒(鉱物系・おから系)
    const rx = r * (0.8 + rand() * 0.4), ry = r * (0.7 + rand() * 0.35);
    return `M${(x - rx).toFixed(1)} ${y.toFixed(1)}a${rx.toFixed(1)} ${ry.toFixed(1)} 0 1 0 ${(rx * 2).toFixed(1)} 0a${rx.toFixed(1)} ${ry.toFixed(1)} 0 1 0 ${(-rx * 2).toFixed(1)} 0Z`;
  }
  // ペレット(紙・木系):角の丸い短い棒を少し傾ける
  const w = r * (0.8 + rand() * 0.5), h = r * (0.42 + rand() * 0.2), a = rand() * Math.PI;
  const c = Math.cos(a), s = Math.sin(a);
  const p = (dx: number, dy: number) => `${(x + dx * c - dy * s).toFixed(1)} ${(y + dx * s + dy * c).toFixed(1)}`;
  return `M${p(-w, -h)}L${p(w, -h)}L${p(w, h)}L${p(-w, h)}Z`;
}

/** 砂かけ:左下から右上へ、扇形に粒が飛ぶ(viewBox 0 0 200 200)。dir=-1 で左右反転 */
export function sandBurst(seed: number, n = 90): string {
  const rand = rng(seed);
  let d = '';
  for (let i = 0; i < n; i++) {
    const t = -Math.PI * (0.12 + rand() * 0.5); // 右上方向の扇
    const dist = 20 + Math.pow(rand(), 0.7) * 160;
    const x = 18 + Math.cos(t) * dist, y = 180 + Math.sin(t) * dist + (dist / 160) ** 2 * 26;
    const r = 1.5 + rand() * 3.4 * (1 - dist / 260);
    d += grain(x, y, r, rand);
  }
  return d;
}

/** 砂山:底が平らで、上がでこぼこの山と、ふもとに転がった粒(viewBox 0 0 200 100) */
export function sandPile(seed: number): string {
  const rand = rng(seed);
  let d = 'M4 100';
  const steps = 16;
  for (let i = 0; i <= steps; i++) {
    const x = 4 + (192 * i) / steps;
    const h = Math.sin((i / steps) * Math.PI) * (58 + rand() * 12) + rand() * 6;
    d += ` L${x.toFixed(1)} ${(100 - h).toFixed(1)}`;
  }
  d += ' L196 100 Z';
  for (let i = 0; i < 14; i++) {
    const x = rand() < 0.5 ? rand() * 40 : 160 + rand() * 40;
    d += grain(x, 94 - rand() * 10, 2 + rand() * 3, rand);
  }
  return d;
}

/** 砂かけの SVG。色は粒ごとに2色まぜる(色つきの猫砂) */
export function sandSvg(seed: number, colors: [string, string], cls = ''): string {
  return `<svg class="splat ${cls}" viewBox="0 0 200 200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" style="overflow:visible"><path d="${sandBurst(seed)}" fill="${colors[0]}"/><path d="${sandBurst(seed + 7, 50)}" fill="${colors[1]}"/></svg>`;
}

/** 横幅いっぱいの砂の地面(区切り・フッターの上。viewBox 0 0 1200 60・preserveAspectRatio none) */
export function sandGround(seed: number, w = 1200, h = 60): string {
  const rand = rng(seed);
  let d = `M0 ${h}`;
  let x = 0;
  while (x < w) {
    const y = h * (0.35 + rand() * 0.35);
    d += ` L${x.toFixed(0)} ${y.toFixed(0)}`;
    x += 14 + rand() * 30;
  }
  d += ` L${w} ${(h * 0.5).toFixed(0)} L${w} ${h} Z`;
  for (let i = 0; i < 70; i++) d += grain(rand() * w, h * (0.1 + rand() * 0.35), 2 + rand() * 3.5, rand);
  return d;
}

/** 肉球(viewBox 0 0 100 100) */
export const PAW_PATH = 'M50 88c-17 0-28-9-28-21 0-13 13-24 28-24s28 11 28 24c0 12-11 21-28 21z M20 46c-7 0-11-7-11-14s5-13 11-13 11 6 11 13-4 14-11 14z M38 30c-7 0-11-7-11-15S31 1 38 1s11 7 11 14-4 15-11 15z M62 30c-7 0-11-7-11-15S55 1 62 1s11 7 11 14-4 15-11 15z M80 46c-7 0-11-7-11-14s4-13 11-13 11 6 11 13-5 14-11 14z';
