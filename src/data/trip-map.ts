// 猫の旅の地図(ビルド時に SVG を作る)。東京からの位置関係を見せるための絵地図。
// 地形は Natural Earth(world-atlas、パブリックドメイン)。細かい道案内は記事内の Googleマップに任せる。
import { geoMercator, geoNaturalEarth1, geoPath, geoDistance, geoInterpolate } from 'd3-geo';
import { feature } from 'topojson-client';
import land10 from 'world-atlas/land-10m.json' with { type: 'json' };
import land50 from 'world-atlas/land-50m.json' with { type: 'json' };
import land110 from 'world-atlas/land-110m.json' with { type: 'json' };

export const TOKYO = { lat: 35.68124, lng: 139.76712, label: '東京' }; // 東京駅

export type Pin = { lat: number; lng: number; label?: string; n?: number; href?: string };

const toLand = (t: any) => feature(t, t.objects.land) as any;
const LAND = { 10: toLand(land10), 50: toLand(land50), 110: toLand(land110) };

const SEA = '#ece6ff';
const LANDC = '#fbfaf0';
const INK = '#1c1629';

/** 東京からの直線距離(km、丸め) */
export function kmFromTokyo(p: { lat: number; lng: number }) {
  const km = geoDistance([TOKYO.lng, TOKYO.lat], [p.lng, p.lat]) * 6371;
  return km < 100 ? Math.round(km) : Math.round(km / 10) * 10;
}

const star = (x: number, y: number, r: number) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    return `${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr).toFixed(1)}`;
  });
  return `<polygon points="${pts.join(' ')}" fill="#ff3ea5" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
};

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function label(x: number, y: number, text: string, size: number, anchor = 'start') {
  return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-size="${size}" font-weight="800" text-anchor="${anchor}" fill="${INK}" stroke="#fff" stroke-width="${size / 3.5}" paint-order="stroke" stroke-linejoin="round">${esc(text)}</text>`;
}

function pinMark(x: number, y: number, s: number, n?: number) {
  const body = `<path d="M${x} ${y}c-${s * 0.9} -${s * 1.2} -${s * 1.4} -${s * 1.9} -${s * 1.4} -${s * 2.6}a${s * 1.4} ${s * 1.4} 0 1 1 ${s * 2.8} 0c0 ${s * 0.7} -${s * 0.5} ${s * 1.4} -${s * 1.4} ${s * 2.6}z" fill="#e6ff2e" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
  const num = n === undefined ? `<circle cx="${x}" cy="${y - s * 2.6}" r="${s * 0.5}" fill="${INK}"/>` : `<text x="${x}" y="${(y - s * 2.6 + s * 0.45).toFixed(1)}" font-size="${(s * 1.25).toFixed(1)}" font-weight="900" text-anchor="middle" fill="${INK}">${n}</text>`;
  return body + num;
}

/** 大圏航路(ゆるい弧)の点列 */
function arc(a: Pin, b: Pin) {
  const f = geoInterpolate([a.lng, a.lat], [b.lng, b.lat]);
  return { type: 'LineString', coordinates: Array.from({ length: 65 }, (_, i) => f(i / 64)) };
}

/**
 * 日本地図。pins が1つなら東京とその地点が収まるように拡大する(近場は関東の拡大図になる)。
 * pins が複数なら日本全体(北海道南部〜九州)。
 */
export function japanMapSvg(pins: Pin[], opt: { title: string; w?: number; h?: number; labels?: boolean } = { title: '' }) {
  const w = opt.w ?? 640, h = opt.h ?? 520;
  const all = [TOKYO, ...pins];
  let minLng = Math.min(...all.map((p) => p.lng)), maxLng = Math.max(...all.map((p) => p.lng));
  let minLat = Math.min(...all.map((p) => p.lat)), maxLat = Math.max(...all.map((p) => p.lat));
  if (pins.length > 1) { minLng = Math.min(minLng, 129.3); maxLng = Math.max(maxLng, 142.2); minLat = Math.min(minLat, 31); maxLat = Math.max(maxLat, 41.6); }
  // 余白と最小の範囲
  const span = Math.max(maxLng - minLng, (maxLat - minLat) * 1.25, 2.4); // 近場でも関東が見える広さは残す
  const cx = (minLng + maxLng) / 2, cy = (minLat + maxLat) / 2;
  const pad = span * 0.32;
  const box = { type: 'MultiPoint', coordinates: [[cx - span / 2 - pad, cy - span / 2.5 - pad / 1.3], [cx + span / 2 + pad, cy + span / 2.5 + pad / 1.3]] };
  const proj = geoMercator().fitExtent([[10, 10], [w - 10, h - 10]], box as any).clipExtent([[0, 0], [w, h]]);
  const path = geoPath(proj);
  const res = span < 3 ? 10 : 50;
  const land = path(LAND[res]) ?? '';
  const s = Math.max(7, Math.min(11, w / 60));
  let out = `<svg class="tripmap" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(opt.title)}" xmlns="http://www.w3.org/2000/svg"><rect width="${w}" height="${h}" fill="${SEA}"/><path d="${land}" fill="${LANDC}" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>`;
  const [tx, ty] = proj([TOKYO.lng, TOKYO.lat])!;
  if (pins.length === 1) {
    const d = path(arc(TOKYO, pins[0]) as any);
    out += `<path d="${d}" fill="none" stroke="#ff3ea5" stroke-width="3" stroke-dasharray="7 6" stroke-linecap="round"/>`;
  }
  // 東京を先に描き、ピンを上に重ねる(近場のピンが星に隠れないように)。ラベルは東京と反対側に出す
  const west = pins.length === 1 && pins[0].lng < TOKYO.lng;
  out += star(tx, ty, s * 1.3) + label(west ? tx + s * 1.6 : tx - s * 1.6, ty + s * 1.9, '東京', s * 1.5, west ? 'start' : 'end');
  pins.forEach((p) => {
    const [x, y] = proj([p.lng, p.lat])!;
    const m = pinMark(x, y, s, p.n);
    out += p.href ? `<a href="${p.href}">${m}<title>${esc(p.label ?? '')}</title></a>` : m;
    if (p.label && opt.labels !== false) out += west ? label(x - s * 1.7, y - s * 2.2, p.label, s * 1.5, 'end') : label(x + s * 1.7, y - s * 2.2, p.label, s * 1.5);
  });
  return out + '</svg>';
}

/** 世界地図(東京が真ん中の、日本でよく見る並び)。弧は東京からの大圏航路 */
export function worldMapSvg(pins: Pin[], opt: { title: string; w?: number; h?: number; labels?: boolean } = { title: '' }) {
  const w = opt.w ?? 760, h = opt.h ?? 400;
  const proj = geoNaturalEarth1().rotate([-150, 0]).fitExtent([[6, 6], [w - 6, h - 6]], { type: 'Sphere' } as any);
  const path = geoPath(proj);
  const s = Math.max(6, Math.min(10, w / 80));
  let out = `<svg class="tripmap" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(opt.title)}" xmlns="http://www.w3.org/2000/svg"><path d="${path({ type: 'Sphere' } as any)}" fill="${SEA}" stroke="${INK}" stroke-width="2"/><path d="${path(LAND[110])}" fill="${LANDC}" stroke="${INK}" stroke-width="1" stroke-linejoin="round"/>`;
  const [tx, ty] = proj([TOKYO.lng, TOKYO.lat])!;
  pins.forEach((p) => { out += `<path d="${path(arc(TOKYO, p) as any)}" fill="none" stroke="#ff3ea5" stroke-width="2.4" stroke-dasharray="6 5" stroke-linecap="round" opacity=".9"/>`; });
  out += star(tx, ty, s * 1.4) + label(tx + s * 1.6, ty + s * 2, '東京', s * 1.6);
  pins.forEach((p) => {
    const [x, y] = proj([p.lng, p.lat])!;
    const m = pinMark(x, y, s, p.n);
    out += p.href ? `<a href="${p.href}">${m}<title>${esc(p.label ?? '')}</title></a>` : m;
    if (p.label && opt.labels !== false) out += label(x + s * 1.6, y - s * 2.1, p.label, s * 1.6);
  });
  return out + '</svg>';
}

/** 写真がない旅先のイラスト(絵はがき風)。scene ごとに背景を描き分け、手前に猫を置く */
export function sceneSvg(scene: string, catFace: string, title: string, seed = 1) {
  const W = 640, H = 400;
  const sky = { island: ['#7ee0ff', '#ece6ff'], town: ['#ffd27a', '#ffeccc'], shrine: ['#ff9bc8', '#ffe6f1'], station: ['#9be7c9', '#e6fff6'], ruins: ['#ffb36b', '#fff0d9'], festival: ['#6c3cff', '#b9a4ff'], house: ['#7ee0ff', '#fff6cc'] }[scene] ?? ['#7ee0ff', '#ece6ff'];
  const g = `<defs><linearGradient id="sk${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs>`;
  let bg = `<rect width="${W}" height="${H}" fill="url(#sk${seed})"/><circle cx="${520 - (seed % 5) * 30}" cy="80" r="38" fill="#fff6a8" stroke="${INK}" stroke-width="3"/>`;
  const st = `stroke="${INK}" stroke-width="3" stroke-linejoin="round"`;
  if (scene === 'island') {
    bg += `<rect y="250" width="${W}" height="150" fill="#3bb6e8"/><path d="M60 262c40-70 110-120 190-118 70 2 120 50 170 118z" fill="#5fcf7a" ${st}/><path d="M420 262c30-40 70-60 120-56 40 4 70 30 90 56z" fill="#7fdc8c" ${st}/><path d="M0 300q40-10 80 0t80 0 80 0 80 0 80 0 80 0 80 0 80 0" fill="none" stroke="#fff" stroke-width="4" opacity=".7"/><path d="M470 300h90l-12 16h-66z" fill="#fff" ${st}/><rect x="500" y="286" width="30" height="14" fill="#ff3ea5" ${st}/>`;
  } else if (scene === 'shrine') {
    bg += `<rect y="300" width="${W}" height="100" fill="#e9d6b0"/><path d="M150 140h340l-14 26H164z" fill="#e8402a" ${st}/><rect x="180" y="166" width="280" height="18" fill="#e8402a" ${st}/><rect x="200" y="184" width="26" height="130" fill="#e8402a" ${st}/><rect x="414" y="184" width="26" height="130" fill="#e8402a" ${st}/><rect x="306" y="166" width="28" height="18" fill="#1c1629"/>`;
  } else if (scene === 'station') {
    bg += `<rect y="300" width="${W}" height="100" fill="#cfc6b8"/><path d="M0 330h640M0 360h640" stroke="${INK}" stroke-width="4"/><path d="M90 300V200h220v100z" fill="#fbfaf0" ${st}/><path d="M70 205l130-70 130 70z" fill="#c99b66" ${st}/><path d="M150 170a12 12 0 0 1 24 0M226 170a12 12 0 0 1 24 0" fill="none" stroke="${INK}" stroke-width="3"/><rect x="170" y="240" width="60" height="60" fill="#ff8a1f" ${st}/>`;
  } else if (scene === 'ruins') {
    bg += `<rect y="290" width="${W}" height="110" fill="#e9c995"/>${[80, 170, 260, 350].map((x, i) => `<rect x="${x}" y="${150 + (i % 2) * 40}" width="40" height="${140 - (i % 2) * 40}" fill="#f4ead2" ${st}/><rect x="${x - 6}" y="${140 + (i % 2) * 40}" width="52" height="14" fill="#f4ead2" ${st}/>`).join('')}<path d="M40 300h360" stroke="${INK}" stroke-width="3"/>`;
  } else if (scene === 'festival') {
    bg += `<rect y="300" width="${W}" height="100" fill="#3a2c56"/>${[60, 150, 240, 330, 420, 510, 600].map((x, i) => `<circle cx="${x}" cy="${60 + (i % 3) * 30}" r="${8 + (i % 2) * 5}" fill="${['#e6ff2e', '#ff3ea5', '#16e0b0'][i % 3]}"/>`).join('')}<path d="M40 300V170l50-40 50 40v130M160 300V190l45-35 45 35v110M270 300V160l55-45 55 45v140" fill="#f4ead2" ${st}/><path d="M0 120q160 40 320 0t320 0" fill="none" stroke="#fff" stroke-width="2"/>${[40, 100, 160, 220, 280, 340, 400, 460, 520, 580].map((x, i) => `<path d="M${x} ${128 + Math.sin(i) * 6}l10 18h-20z" fill="${['#e6ff2e', '#ff3ea5', '#16e0b0'][i % 3]}" ${st.replace('3', '1.5')}/>`).join('')}`;
  } else if (scene === 'house') {
    bg += `<rect y="300" width="${W}" height="100" fill="#7fdc8c"/><path d="M70 300V180h300v120z" fill="#fbfaf0" ${st}/><path d="M50 185l170-75 170 75z" fill="#16e0b0" ${st}/>${[100, 170, 270, 330].map((x) => `<rect x="${x}" y="210" width="34" height="50" fill="#9be7c9" ${st}/>`).join('')}<path d="M470 300c0-60 10-120 40-170M470 300" stroke="${INK}" stroke-width="5" fill="none"/><path d="M510 130c-40-10-70 10-90 30M510 130c30-30 70-30 90-10M510 130c-10-30-40-50-70-50M510 130c20 10 50 40 50 60" stroke="#2e9e5a" stroke-width="12" fill="none" stroke-linecap="round"/>`;
  } else {
    bg += `<rect y="300" width="${W}" height="100" fill="#e9d6b0"/>${[30, 130, 230, 330, 430].map((x, i) => `<path d="M${x} 300V${190 + (i % 3) * 20}l45-30 45 30V300z" fill="${['#fbfaf0', '#ffd6e8', '#e6f7ff', '#fff3c4', '#e6fff6'][i]}" ${st}/><rect x="${x + 32}" y="${250 + (i % 2) * 6}" width="26" height="${50 - (i % 2) * 6}" fill="#c99b66" ${st}/>`).join('')}<path d="M0 340q160 -20 320 0t320 0" fill="none" stroke="#fff" stroke-width="10" opacity=".7"/>`;
  }
  // 猫(bodySvg のおすわり)を入れ子の svg で右下に置く
  const cat = catFace.replace(/^<svg /, '<svg x="430" y="138" width="170" height="232" ');
  return `<svg class="tripscene" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}のイラスト" xmlns="http://www.w3.org/2000/svg">${g}${bg}${cat}<rect x="1.5" y="1.5" width="${W - 3}" height="${H - 3}" fill="none" stroke="${INK}" stroke-width="3"/></svg>`;
}
