# ネコキチ猫吉 〜猫好きは、結局ぜんぶの猫が好き〜

猫種を問わず、猫好き全体からのアクセスを狙う猫の総合サイト(Astro 7)。運営は横田さん。
アメショの森(../amesho-mori:実用ツール・健康・占い)と週刊ラグドール(../ragdoll-kawaii:ウワサ検証の週刊誌ノリ)のいいとこ取り(2026-09-27 作成)。
アメショの森と週刊ラグドールはABテスト中なので、このサイトから両サイトへはリンクしない。

- 公開先:https://nekokichi.net/ (GitHub Pages。main に push すると GitHub Actions で自動デプロイ)
  - ドメインは Cloudflare Registrar(2026-09-27 取得)。DNS は Cloudflare で apex と www を yynoche-woop.github.io に CNAME(DNS only)。`public/CNAME` がドメイン設定
  - サイト内リンクは常に "/columns/..." のようにルートから書く(`scripts/base-links.mjs` はサブパス公開のときだけ働く)
- `npm run build` / `npx astro dev`
- 広告は未設定(Amazonアソシエイトのサイト専用IDを作ったら、姓名判断の下などに控えめに)

## 構成
- `src/content/columns/*.md` → `/columns/<slug>/`。書き方は `ops/column-spec.md`(kensho=ウワサ検証、jitsuyo=暮らし・健康)
- `src/data/breeds.ts` → 猫種図鑑 `/breeds/<slug>/`(20種、雑種 mix を含む)。`tendency` は猫種診断 `/tools/match/` に使う
- `src/data/cat-art.ts` → イラスト。毛色×柄×目×耳×毛の長さ(型は `art-schema.ts`)で、どの猫もステッカー調で描ける。編集長・猫吉はキジトラ白
- ツール:`/tools/match/`(猫種診断)`/tools/seimei/`(姓名判断。計算は seimei.ts、文章は seimei-text.ts)`/tools/age/` `/tools/bcs/` `/tools/food/`
- `.scratch/assets.mts` → favicon・OG画像・イラスト確認シート(`npx tsx .scratch/assets.mts`)

## トーン
- 週刊誌ノリ、アホっぽくてOK。書き手は「ネコキチ編集部」、編集長は猫吉
- 芯は「猫好きは、結局ぜんぶの猫が好き」。一種だけ持ち上げない、どの猫種も雑種も下げない
- 情報は正確に:性格は「よく言われる」と「個体差」を分ける、数字は幅を持たせた目安、健康は断定せず受診の目安を書く
- お迎え(購入)を前面に出さない。保護猫・譲渡にも自然に触れてよい

## 日本語の改行・占い
- アメショの森・週刊ラグドールと同じ(`scripts/phrase-break.mjs`、姓名判断に「凶」はなく1ランク上げて表示)
