"""週次の機械チェック(wed-sites-weekly の「既存コンテンツのチェック」用)。

使い方:
  npm run build のあとで  PYTHONIOENCODING=utf-8 python ops/site_check.py          # dist のみ(リンク切れ・title/description・表示崩れ)
                          PYTHONIOENCODING=utf-8 python ops/site_check.py --live   # 本番サイトマップの全URLが200かも確認
"""
import re, sys, pathlib, urllib.request, collections, html

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / 'dist'
SITE = 'https://nekokichi.net'

pages = {}
for f in DIST.rglob('*.html'):
    rel = '/' + f.relative_to(DIST).as_posix()
    url = rel[:-len('index.html')] if rel.endswith('index.html') else rel
    pages[url] = f.read_text(encoding='utf-8')

problems = []
titles, descs = collections.defaultdict(list), collections.defaultdict(list)
for url, s in sorted(pages.items()):
    if url == '/404.html':
        continue
    t = re.search(r'<title>(.*?)</title>', s, re.S)
    d = re.search(r'<meta name="description" content="(.*?)"', s)
    if not t or not t.group(1).strip():
        problems.append(f'title なし: {url}')
    else:
        titles[t.group(1).strip()].append(url)
    if not d or not d.group(1).strip():
        problems.append(f'description なし: {url}')
    else:
        descs[d.group(1).strip()].append(url)
    body = re.sub(r'(?s)<(script|style)\b.*?</\1>', '', s)
    text = html.unescape(re.sub(r'<[^>]+>', '', body))
    for pat in (r'\*\*', r'\]\((https?:|/)',r'&lt;/?(strong|a|div)', r'undefined', r'NaN'):
        if re.search(pat, text):
            problems.append(f'表示崩れの疑い {pat}: {url}')
    for href in re.findall(r'href="(/[^"#?]*)', s):
        if href.startswith('//'):
            continue
        p = href if href.endswith('/') or '.' in href.rsplit('/', 1)[-1] else href + '/'
        if p not in pages and not (DIST / p.lstrip('/')).exists():
            problems.append(f'リンク切れ {href}: {url}')

for k, v in titles.items():
    if len(v) > 1:
        problems.append(f'title 重複 {k}: {v}')
for k, v in descs.items():
    if len(v) > 1:
        problems.append(f'description 重複: {v}')

print(f'ページ数: {len(pages)}')
if '--live' in sys.argv:
    def get(u):
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0 nekokichi-check'})
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.status, r.read().decode('utf-8', 'replace')
    _, idx = get(SITE + '/sitemap-index.xml')
    urls = []
    for sm in re.findall(r'<loc>(.*?)</loc>', idx):
        urls += re.findall(r'<loc>(.*?)</loc>', get(sm)[1])
    bad = 0
    for u in urls:
        try:
            st, _ = get(u)
        except Exception as e:
            st = getattr(e, 'code', str(e))
        if st != 200:
            bad += 1
            problems.append(f'本番 {st}: {u}')
    print(f'サイトマップURL: {len(urls)} 件(200以外 {bad} 件)')

print('問題なし' if not problems else '\n'.join(problems))
