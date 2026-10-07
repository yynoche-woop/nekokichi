"""ネコキチ猫吉:日別のPV・ユーザーと、PVが多い日の内訳(ページ・流入元・地域・端末)を出す。
1人で大量にPVがある日(作業中の確認・ボットなど)を見分けるため。

使い方: python ops/spike_check.py [日数(既定14)] [内訳を見る日 YYYY-MM-DD(省略時はPV最大の日)]
認証は traffic_report.py と同じ。
"""
import os
import sys
from datetime import date, timedelta

from google.oauth2 import service_account
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, OrderBy, RunReportRequest

CRED_DIR = os.environ.get("CLAUDECODE_CRED_DIR") or os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".credentials"))
KEY = os.path.join(CRED_DIR, "sheet-service-account.json")
PROP = "properties/556074127"
DAYS = int(sys.argv[1]) if len(sys.argv) > 1 else 14
end = date.today() - timedelta(days=1)
start = end - timedelta(days=DAYS - 1)
cl = BetaAnalyticsDataClient(credentials=service_account.Credentials.from_service_account_file(KEY, scopes=["https://www.googleapis.com/auth/analytics.readonly"]))


def run(dims, mets, d0, d1, limit=15, order_metric=None):
    req = RunReportRequest(property=PROP, date_ranges=[DateRange(start_date=d0, end_date=d1)],
                           dimensions=[Dimension(name=d) for d in dims], metrics=[Metric(name=m) for m in mets], limit=limit)
    if order_metric:
        req.order_bys = [OrderBy(metric=OrderBy.MetricOrderBy(metric_name=order_metric), desc=True)]
    else:
        req.order_bys = [OrderBy(dimension=OrderBy.DimensionOrderBy(dimension_name=dims[0]))]
    return cl.run_report(req).rows


print(f"# 日別 {start}〜{end}")
rows = run(["date"], ["activeUsers", "screenPageViews", "sessions"], str(start), str(end), limit=100)
best = None
for r in rows:
    d = r.dimension_values[0].value
    u, pv, s = (int(m.value) for m in r.metric_values)
    print(f"- {d[:4]}-{d[4:6]}-{d[6:]}: ユーザー{u} / セッション{s} / PV{pv}")
    if best is None or pv > best[1]:
        best = (f"{d[:4]}-{d[4:6]}-{d[6:]}", pv)
day = sys.argv[2] if len(sys.argv) > 2 else (best[0] if best else str(end))
print(f"\n# {day} の内訳")
for title, dims in [("流入元", ["sessionSourceMedium"]), ("地域・端末", ["city", "deviceCategory"]), ("ページ", ["pagePath"])]:
    print(f"## {title}")
    for r in run(dims, ["activeUsers", "screenPageViews"], day, day, order_metric="screenPageViews"):
        print(f"- {' / '.join(v.value for v in r.dimension_values)}: ユーザー{r.metric_values[0].value} PV{r.metric_values[1].value}")
