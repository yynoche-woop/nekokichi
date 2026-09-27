# ネコキチ猫吉 〜猫好きは、結局ぜんぶの猫が好き〜

猫種を問わず、猫好き全体からのアクセスを狙う猫の総合サイト(Astro 7)。運営は横田さん。
2026-09-27 作成。当初はアメショの森と週刊ラグドールのいいとこ取りだったが、2026-09-28 から下の役割分担に切り替えた(全猫種・猫の習性の百科)。
猫サイト3つ(ネコキチ猫吉・アメショの森・週刊ラグドール)は姉妹サイト(横田さん 2026-09-27 方針転換。以前のABテストの扱いはやめた)。フッター末尾の「姉妹サイト」リンクで相互につなぐ(目立たせない)。
## 猫3サイトの役割分担(横田さん 2026-09-28)
- 週刊ラグドール = ネタ系(ウワサ検証・ガチャ・号外・占い)。真面目な情報は「ここだけ真面目」の小枠まで
- アメショの森 = 飼育情報系(健康・食事・体重・お手入れ・計算ツール)。新しい記事は飼育情報だけ。占い・あるあるは増やさない
- ネコキチ猫吉 = 圧倒的情報量(全猫種・猫の習性の百科)。ウワサ検証の週刊誌ノリはラグドールに任せ、事実中心で網羅する
- 重なる話題は役割に合うサイトに寄せ、ほかは切り口を変えるかリンクで案内する。書き分け案: https://claude.ai/artifact/FJbZ8TPUxsJ7b3TXzR2ymd

- 公開先:https://nekokichi.net/ (GitHub Pages。main に push すると GitHub Actions で自動デプロイ)
  - ドメインは Cloudflare Registrar(2026-09-27 取得)。DNS は Cloudflare で apex と www を yynoche-woop.github.io に CNAME(DNS only)。`public/CNAME` がドメイン設定
  - サイト内リンクは常に "/columns/..." のようにルートから書く(`scripts/base-links.mjs` はサブパス公開のときだけ働く)
- GA4:G-52E7ZV9WTT(アカウント「アメショの森」内、プロパティ「ネコキチ猫吉 (nekokichi.net)」properties/556074127)。本番ドメインのときだけ計測
- Search Console:sc-domain:nekokichi.net(サービスアカウントが Site Verification API + Cloudflare の TXT で確認。所有者はサービスアカウントと横田さん)。サイトマップ再送信は `../.scratch/gsc_submit_sitemaps.py nekokichi`
- `npm run build` / `npx astro dev`
- 広告:Amazonアソシエイト(トラッキングID **nekokichinet-22**、2026-09-27作成のサイト専用ID。nekokichi-22 は他人が使用済みだった)。他サイト(ameshomori-22・shukanragdoll-22 等)のIDは絶対に使わない(横田さん「プロパティを分けて」)。`src/components/DnaTest.astro`(猫のDNA検査キット)を姓名判断の下にだけ置く。広告まみれにしない
- GA4:プロパティ 556074127(測定ID G-52E7ZV9WTT、アカウント「アメショの森」)。Search Console:sc-domain:nekokichi.net(横田さんとサービスアカウントが所有者)。週次ルーティン wed-sites-weekly の対象(節 I)

## 構成
- `src/content/columns/*.md` → `/columns/<slug>/`。書き方は `ops/column-spec.md`(shuusei=猫の習性事典、jitsuyo=暮らし・健康。旧 kensho=ウワサ検証は 2026-09-28 に習性事典へ書き直し済み。URLは変えていない)
- `src/data/breeds.ts` → 猫種図鑑 `/breeds/<slug>/`(36種、雑種 mix を含む。`myths`=よくある誤解、label は 事実・おおむね正しい・個体差が大きい・言いすぎ・誤り・根拠は弱い)。`tendency` は猫種診断 `/tools/match/` に使う
- `src/data/cat-art.ts` → イラスト。毛色×柄×目×耳×毛の長さ(型は `art-schema.ts`)で、どの猫もステッカー調で描ける。編集長・猫吉はキジトラ白
- ツール:`/tools/match/`(猫種診断)`/tools/seimei/`(姓名判断。計算は seimei.ts、文章は seimei-text.ts)`/tools/age/` `/tools/bcs/` `/tools/food/`
  - age/bcs/food はアメショの森と似たツールなので、ネコキチ版は全猫種向けにする:`src/components/BreedPick.astro` の猫種セレクタで、breeds.ts の体重の目安と `grown`(成長がゆっくりな猫種)を結果に添える。計算式(RER=70×体重^0.75 など)は猫種で変えない
- `.scratch/assets.mts` → favicon・OG画像・イラスト確認シート(`npx tsx .scratch/assets.mts`)

## トーン
- 事実中心で網羅する「猫の百科」。やわらかく親しみのある口調はOK、でも週刊誌ノリ・ウワサ検証の見出し(【検証】・判定・ドッキリ調の寸劇)は使わない(それは週刊ラグドールの役目。横田さん 2026-09-28)。書き手は「ネコキチ編集部」、編集長は猫吉
- トップページの「猫が作っているメディア」の遊び(砂かけ・ニュースの掛け合い・猫砂フェス)はデザインとして残す。記事本文は事典として書く
- 芯は「猫好きは、結局ぜんぶの猫が好き」。一種だけ持ち上げない、どの猫種も雑種も下げない
- 情報は正確に:性格は「よく言われる」と「個体差」を分ける、数字は幅を持たせた目安、健康は断定せず受診の目安を書く
- お迎え(購入)を前面に出さない。保護猫・譲渡にも自然に触れてよい

## 日本語の改行・占い
- アメショの森・週刊ラグドールと同じ(`scripts/phrase-break.mjs`、姓名判断に「凶」はなく1ランク上げて表示)

## デザイン(2026-09-27 横田さん決定)
- スプラトゥーン風の勢い。ただしインクではなく「猫砂のかけあい」。夜の地(#1c1629)に色つき猫砂(ネオンイエロー・バイオレット・ミント・ピンク)が飛び散る。読む所は紙のパネル
- 砂の絵は `src/data/splat.ts`(sandSvg / sandPile / sandGround)。タップ・編集長を押すと砂が飛ぶ(Base.astro の kick)
- 文字:見出し Reggae One、英字 Bungee、本文 M PLUS 1p
- トップの構成:ステージ → コーナー選択 → ネコキチニュース(猫吉とミケ子の掛け合い)→ 猫砂フェス → ずかん → 真面目な話。週刊ラグドールの構成(一面→結論→ウワサ→指名手配→アンケート)は使わない(横田さん「サボりはやめて」)
- 却下案:ねこの庭(弱い)、ちいかわ・mofusand系(色はmofusandが近いが方向が違う)
- `set:html` で入れたSVGにはページの scoped CSS が当たらない。クラスで効かせるときは `:global()` を使う
- 猫の動きは機械っぽくしない(横田さんから何度も指摘あり):足を付け根で回さず、手描きのポーズをコマで切り替える。足の付け根は胴体の裏に隠し、先細りの形に。頭は胸に重ねて首をつなげる。しっぽは真上。砂かけ猫は `kickCatSvg`(.kf0 かまえ / .kf1 手前の足でけり / .kf2 奥の足でけり)
