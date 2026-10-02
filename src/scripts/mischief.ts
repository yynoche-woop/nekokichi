// 猫のしわざ(このサイトは猫が作っている、という設定の演出。横田さん 2026-09-27)
// - 画面に猫の毛が落ちている → 左下の「コロコロ」で取れる。しばらくすると、また抜ける
// - 肉球の足あとが画面を横切る
// - 紙のパネルの上に置いたカップを、猫の手が机から落とす(1ページに1回)
// - マウスのカーソルが画面の下のほうに来ると、猫の手がじゃれにくる
// 動きを減らす設定のときは、毛だけ置いて動きはなし。

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
// 演出はすべて #fx の中へ(画面からはみ出してもページの横幅を広げない。スマホで勝手に縮小表示される不具合の対策)
const fx = document.getElementById('fx') ?? document.body;
const HAIR_COLORS = ['#ffffff', '#e9d6b0', '#c99b66', '#2e2b2c', '#9aa5b6', '#f3a55e'];
const PAW = 'M50 88c-17 0-28-9-28-21 0-13 13-24 28-24s28 11 28 24c0 12-11 21-28 21zM20 46c-7 0-11-7-11-14s5-13 11-13 11 6 11 13-4 14-11 14zM38 30c-7 0-11-7-11-15S31 1 38 1s11 7 11 14-4 15-11 15zM62 30c-7 0-11-7-11-15S55 1 62 1s11 7 11 14-4 15-11 15zM80 46c-7 0-11-7-11-14s4-13 11-13 11 6 11 13-5 14-11 14z';
const rand = (a: number, b: number) => a + Math.random() * (b - a);

function popWord(x: number, y: number, text: string) {
  const w = document.createElement('span');
  w.className = 'pop-word';
  w.textContent = text;
  w.style.left = `${x - 30}px`;
  w.style.top = `${y}px`;
  w.style.setProperty('--dx', `${rand(-30, 30)}px`);
  w.style.setProperty('--dy', `${rand(-70, -40)}px`);
  w.style.setProperty('--r', `${rand(-12, 12)}deg`);
  fx.appendChild(w);
  w.addEventListener('animationend', () => w.remove());
}

/* ---------- 猫の毛とコロコロ ---------- */
const hairs: HTMLElement[] = [];
const BLOCKS = 'main :is(p, h1, h2, h3, li, a, button, img, svg, table, figure, article, .band, .stile, .wanted, .news, .fes, .calm), header, footer';
function addHair() {
  const h = document.createElement('span');
  h.className = 'hair';
  // 1本の線だと表示の崩れに見えるので、根元でまとまった数本の「毛の束」にする(2026-10-02 指摘)
  const len = rand(22, 34);
  const col = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)];
  // ほぼ平行な、ゆるく波打つ毛を数本ずらして重ねる(1点から放射状にすると矢印に見えるため)
  const strands = Array.from({ length: 4 }, (_, i) => {
    const y0 = len / 2 - 4 + i * 2.6 + rand(-1, 1), x0 = rand(1, 5), x1 = len - rand(1, 6);
    return `<path d="M${x0} ${y0} C${len * .3} ${y0 - rand(2, 5)} ${len * .6} ${y0 + rand(2, 5)} ${x1} ${y0 + rand(-2, 2)}" />`;
  }).join('');
  h.innerHTML = `<svg viewBox="0 0 ${len} ${len}" width="${len}" height="${len}" aria-hidden="true"><g fill="none" stroke="#1c1629" stroke-width="3.4" stroke-linecap="round" opacity=".35">${strands}</g><g fill="none" stroke="${col}" stroke-width="1.6" stroke-linecap="round">${strands}</g></svg>`;
  // 文字やカードの上には落とさない(読むじゃまになり、表示の崩れに見えるため。2026-10-02 指摘)。すき間が見つからなければ落とさない
  const docH = Math.max(document.body.scrollHeight - 200, innerHeight);
  const blocks = [...document.querySelectorAll(BLOCKS)].map((e) => e.getBoundingClientRect()).filter((r) => r.width && r.height)
    .map((r) => ({ l: r.left + scrollX - 12, t: r.top + scrollY - 12, r: r.right + scrollX + 12, b: r.bottom + scrollY + 12 }));
  let x = 0, y = 0, ok = false;
  for (let k = 0; k < 20 && !ok; k++) {
    x = rand(10, document.documentElement.clientWidth - 60);
    y = rand(160, docH);
    ok = !blocks.some((b) => x + len > b.l && x < b.r && y + len > b.t && y < b.b);
  }
  if (!ok) return;
  h.style.left = `${x}px`;
  h.style.top = `${y}px`;
  h.style.rotate = `${rand(0, 360)}deg`;
  fx.appendChild(h);
  hairs.push(h);
  updateCount();
}
const roller = document.getElementById('roller') as HTMLButtonElement | null;
function updateCount() {
  const n = roller?.querySelector('.roller-n');
  if (n) n.textContent = String(hairs.length);
}
for (let i = 0; i < 16; i++) addHair();
roller?.addEventListener('click', () => {
  const r = roller.getBoundingClientRect();
  const got = hairs.length;
  for (const h of hairs.splice(0)) {
    if (reduce) { h.remove(); continue; }
    const hr = h.getBoundingClientRect();
    h.animate([{ translate: '0 0', opacity: 1 }, { translate: `${r.left + r.width / 2 - hr.left}px ${r.top + r.height / 2 - hr.top}px`, opacity: 0, scale: .3 }], { duration: rand(400, 900), easing: 'cubic-bezier(.5,0,.7,1)' }).onfinish = () => h.remove();
  }
  updateCount();
  if (!reduce) roller.animate([{ rotate: '0deg' }, { rotate: '-20deg' }, { rotate: '16deg' }, { rotate: '0deg' }], { duration: 500 });
  popWord(r.left + scrollX + r.width / 2, r.top + scrollY - 10, got ? `毛が${got}本とれた` : 'きれい!');
});
// 換毛期:しばらくすると、また抜ける
setInterval(() => { if (!document.hidden && hairs.length < 24) addHair(); }, 9000);

if (!reduce) {
  /* ---------- 肉球の足あと ---------- */
  const walk = () => {
    const startX = rand(40, document.documentElement.clientWidth * .5);
    const startY = scrollY + rand(innerHeight * .3, innerHeight * .8);
    const ang = rand(-.5, .3);
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('span');
      p.className = 'pawprint';
      p.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${PAW}"/></svg>`;
      const side = i % 2 ? 14 : -14;
      p.style.left = `${startX + i * 46 * Math.cos(ang) - side * Math.sin(ang)}px`;
      p.style.top = `${startY + i * 46 * Math.sin(ang) + side * Math.cos(ang)}px`;
      p.style.rotate = `${(ang * 180) / Math.PI + 90}deg`;
      p.style.animationDelay = `${i * 170}ms`;
      fx.appendChild(p);
      p.addEventListener('animationend', () => p.remove());
    }
  };
  setTimeout(walk, 2500);
  setInterval(() => { if (!document.hidden) walk(); }, 26000);

  /* ---------- カップを机から落とす ---------- */
  const target = document.querySelector<HTMLElement>('.news, .tool, .paper, .fes, .col-sources');
  if (target) {
    target.style.position ||= 'relative';
    const cup = document.createElement('span');
    cup.className = 'cup';
    cup.innerHTML = '<svg viewBox="0 0 60 56" aria-hidden="true"><path d="M8 10 H44 V40 Q44 52 32 52 H20 Q8 52 8 40 Z" fill="#fff" stroke="#1c1629" stroke-width="4" stroke-linejoin="round"/><path d="M44 18 Q58 18 56 30 Q54 40 44 38" fill="none" stroke="#1c1629" stroke-width="4"/><path d="M14 22 Q26 18 38 22" stroke="#ff3ea5" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M18 2 q4 4 0 8 M28 0 q4 4 0 8" stroke="#b8b0c8" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';
    const hand = document.createElement('span');
    hand.className = 'hand';
    hand.innerHTML = '<svg viewBox="0 0 120 60" aria-hidden="true"><path d="M120 16 H52 Q30 16 30 32 Q30 48 52 48 H120 Z" fill="#c99b66" stroke="#1c1629" stroke-width="4" stroke-linejoin="round"/><path d="M78 16 v10 M92 16 v8" stroke="#4a3322" stroke-width="4" stroke-linecap="round"/><ellipse cx="40" cy="32" rx="12" ry="14" fill="#fff" stroke="#1c1629" stroke-width="4"/><ellipse cx="38" cy="36" rx="5" ry="5" fill="#ff9fb8"/></svg>';
    target.append(cup, hand);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      setTimeout(async () => {
        const push = (x: number, d: number) => hand.animate([{ translate: `${x + 30}px 0` }, { translate: `${x}px 0` }], { duration: d, fill: 'forwards', easing: 'ease-out' }).finished;
        hand.style.opacity = '1';
        await push(-88, 500);
        cup.animate([{ rotate: '0deg' }, { rotate: '-10deg' }, { rotate: '0deg' }], { duration: 300 });
        await push(-40, 300);
        await push(-92, 250);
        cup.animate([{ rotate: '0deg' }, { rotate: '-14deg' }, { rotate: '0deg' }], { duration: 300 });
        await push(-40, 300);
        await push(-135, 200); // 最後のひと押し
        const cr = cup.getBoundingClientRect();
        cup.animate([
          { translate: '0 0', rotate: '0deg' },
          { translate: '-30px -20px', rotate: '-40deg', offset: .2 },
          { translate: '-60px 420px', rotate: '-260deg', opacity: 1, offset: .9 },
          { translate: '-60px 460px', rotate: '-280deg', opacity: 0 },
        ], { duration: 900, easing: 'cubic-bezier(.4,0,.8,.6)', fill: 'forwards' });
        setTimeout(() => popWord(cr.left + scrollX - 40, cr.top + scrollY + 380, 'ガシャーン'), 780);
        await push(60, 600);
        hand.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
        const note = document.createElement('span');
        note.className = 'cup-note';
        note.textContent = '※編集長がカップを落としました';
        target.append(note);
      }, 700);
    }, { threshold: .6 });
    io.observe(target);
  }

  /* ---------- カーソルにじゃれる猫の手 ---------- */
  if (matchMedia('(pointer: fine)').matches) {
    const paw = document.createElement('span');
    paw.className = 'swat';
    paw.innerHTML = '<svg viewBox="0 0 70 140" aria-hidden="true"><path d="M16 140 V60 Q16 20 35 20 Q54 20 54 60 V140 Z" fill="#c99b66" stroke="#1c1629" stroke-width="4"/><path d="M16 90 h12 M42 80 h12 M16 110 h10" stroke="#4a3322" stroke-width="4" stroke-linecap="round"/><ellipse cx="35" cy="30" rx="22" ry="18" fill="#fff" stroke="#1c1629" stroke-width="4"/><ellipse cx="35" cy="34" rx="8" ry="6" fill="#ff9fb8"/><circle cx="22" cy="22" r="4" fill="#ff9fb8"/><circle cx="35" cy="17" r="4" fill="#ff9fb8"/><circle cx="48" cy="22" r="4" fill="#ff9fb8"/></svg>';
    document.body.appendChild(paw);
    let x = innerWidth / 2, tx = x, up = 0, tup = 0, last = 0;
    addEventListener('pointermove', (e) => {
      tx = e.clientX;
      const near = innerHeight - e.clientY;
      tup = near < 170 ? Math.min(1, (170 - near) / 110) : 0;
      if (near < 60 && Date.now() - last > 900) {
        last = Date.now();
        paw.animate([{ rotate: '0deg' }, { rotate: '-18deg' }, { rotate: '10deg' }, { rotate: '0deg' }], { duration: 380 });
      }
    });
    const loop = () => {
      x += (tx - x) * .12;
      up += (tup - up) * .15;
      paw.style.translate = `${x - 35}px ${-up * 110}px`;
      requestAnimationFrame(loop);
    };
    loop();
  }
}
