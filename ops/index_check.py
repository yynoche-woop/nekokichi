"""Search Console の URL 検査 API でインデックス状況を確認する(wed-sites-weekly 用)。

使い方: PYTHONIOENCODING=utf-8 python ops/index_check.py [パス ...]
  パス省略時はトップ・主要ページ。例: python ops/index_check.py / /columns/whiskers/(Git Bash では MSYS_NO_PATHCONV=1 を付ける)
"""
import os, sys
from google.oauth2 import service_account
from googleapiclient.discovery import build

CRED = os.environ.get('CLAUDECODE_CRED_DIR') or os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '.credentials'))
SITE = 'sc-domain:nekokichi.net'
BASE = 'https://nekokichi.net'
paths = sys.argv[1:] or ['/', '/columns/', '/breeds/', '/tools/', '/breeds/ragdoll/']

cr = service_account.Credentials.from_service_account_file(os.path.join(CRED, 'sheet-service-account.json'), scopes=['https://www.googleapis.com/auth/webmasters'])
sc = build('searchconsole', 'v1', credentials=cr)
for p in paths:
    try:
        r = sc.urlInspection().index().inspect(body={'inspectionUrl': BASE + p, 'siteUrl': SITE}).execute()
        i = r['inspectionResult']['indexStatusResult']
        print(f"{p}: {i.get('coverageState')} / 最終クロール {i.get('lastCrawlTime', '-')[:10]}")
    except Exception as e:
        print(f'{p}: エラー {e}')
for sm in sc.sitemaps().list(siteUrl=SITE).execute().get('sitemap', []):
    print(f"サイトマップ {sm['path']}: エラー {sm.get('errors', 0)} 警告 {sm.get('warnings', 0)} 最終DL {sm.get('lastDownloaded', '-')[:10]}")
