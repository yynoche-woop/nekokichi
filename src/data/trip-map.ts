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
