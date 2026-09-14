---
name: saa-kaisetsu
description: AWS SAA問題集（data/exam*.js）に問題と解説を追加するときに必ず使う。Udemyの問題文・選択肢・解説を貼られた場合、「この問題を追加して」「解説を作って」「図解にして」と言われた場合に発動する。中学生でもわかるレベルの図解つき解説HTMLを、決まった型で生成する。
---

# SAA問題集の解説を作る

## 何をするか

Udemyの問題＋解説を受け取り、`data/exam1.js` の `questions` 配列に1件追加する。
解説は**毎回同じ型**で書く。型を崩さないことが品質の再現性そのもの。

## 手順

1. 追加先ファイルの末尾の `id` を見て、次の番号を決める（`e1q1` → `e1q2`）。
   **一度つけた `id` は変えない**（localStorage の保存キーになっている）。
2. 下の「解説の型」に沿って `explain` を書く。
3. 書き終わったら「セルフチェック」を全項目を確認する。
4. `node --check data/exam1.js` で構文を確認する。
5. ブラウザで開き（`python3 -m http.server 8765`）、下の一括チェックを実行する。

### 一括チェック（ブラウザのコンソールで実行）

アイコンのパス切れ、選択肢と丸つけの数ずれ、必須セクションの抜けをまとめて検出する。

```js
const d=document.createElement('div');d.style.cssText='position:absolute;left:-9999px';
d.innerHTML=EXAM.questions.map(q=>q.explain).join('');document.body.appendChild(d);
const imgs=[...d.querySelectorAll('img')];
await Promise.all(imgs.map(i=>i.complete?null:new Promise(r=>{i.onload=i.onerror=r})));
const r={questions:EXAM.questions.length, images:imgs.length,
  broken:imgs.filter(i=>!i.naturalWidth).map(i=>i.getAttribute('src')),
  missingKotae:EXAM.questions.filter(q=>!q.explain.includes('class="kotae"')).map(q=>q.id),
  choicesMismatch:EXAM.questions.filter(q=>{const a=Array.isArray(q.answer)?q.answer:[q.answer];
    return a.some(i=>i<0||i>=q.choices.length)}).map(q=>q.id),
  choiceBlocks:EXAM.questions.map(q=>[q.id,(q.explain.match(/class="choice"/g)||[]).length,q.choices.length])
    .filter(x=>x[1]!==x[2])};
d.remove(); r
```

`broken` `missingKotae` `choicesMismatch` `choiceBlocks` が**すべて空**なら合格。

## データの形

```js
{
  id: 'e1q2',
  q: '問題文（Udemyの日本語のまま。長くてよい）',
  choices: ['Aの文', 'Bの文', 'Cの文', 'Dの文'],
  answer: 0,               // 複数選択は [0, 2]
  explain: `…下の型…`,
}
```

---

## 解説の型（この順番で書く）

### ① 問題文の中の「Nつのヒント」　【必須】

答えを決めた根拠を、問題文の**単語**まで分解して表にする。暗記ではなく読解にするための最重要セクション。

```html
<h2>まず、問題文の中の「3つのヒント」</h2>
<p>問題文には、答えを決めるためのヒントが3つ隠れています。読み飛ばすと選択肢が全部それっぽく見えてしまうので、先に取り出しておきます。</p>
<table>
  <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
  <tr><td>Windowsサーバー</td><td>Windowsが動く場所が必要。どこでも動くわけではない</td></tr>
  <tr><td>最大1時間</td><td>1時間動ける仕組みでないとダメ。<mark>そして残りの23時間はヒマ</mark></td></tr>
</table>
```

- ヒントは2〜4個。5個以上に散らさない。
- 一番の決め手には `<mark>` を1か所だけ入れる。

### ② 決め手を図にする　【必須】

①で `<mark>` した決め手を図にする。下の**「図の選び方」の表で図の種類を決めてから**描くこと。
文章の言い換えにしない。読まなくても違いが目に入る図にする。
構成や経路の話なら、AWSアイコン入りの矩形と矢印（`.nodes`）で描く。

そのあと必ず、**身近なたとえ**を1文入れる（例：「1日1回しか使わない教室のエアコンを24時間つけっぱなしにするのと同じ」）。

### ③ 紛らわしい用語の区別　【必須】

**SAAで点を落とすのはここ。** 選択肢に並ぶ似た名前・似た方式を、表で1回はっきり分ける。

何を区別するかは問題によって違う。だいたい次のどれか。

| パターン | 例 |
|---|---|
| 同じサービスの方式違い | 保管型ボリューム／キャッシュ型ボリューム、プロビジョンド／オンデマンド |
| 名前が似ていて論点が違う | RDSのエンドポイント（宛先）とRDS Proxy（接続の本数） |
| 役割が違うのに全部「処理する」に見える | EventBridge（合図）／Batch（実行）／Step Functions（指揮）／Lambda（短い処理） |
| 同じカテゴリの中の選び分け | Storage Gatewayのファイル／ボリューム／テープ |

```html
<h2>まぎらわしい3つを区別する</h2>
<table>
  <tr><th style="width:26%">名前</th><th style="width:34%">役割（たとえ）</th><th>できないこと</th></tr>
  <tr><td>Amazon EventBridge</td><td>決まった時刻に鳴る目覚まし時計</td><td>自分では処理しない</td></tr>
  <tr><td class="good">AWS Batch</td><td class="good">必要なときだけ作業員を呼ぶ派遣センター</td><td>ミリ秒の即応には向かない</td></tr>
</table>
```

- 「できないこと」「向かないこと」の列を必ず作る。**そこが選択肢を切る根拠**になる。
- 正解にあたる行は `td.good` で目立たせる。
- 置き場所は④の直前が基本。④のあとに「CとDがまぎらわしい理由」としてまとめても良い。

### ④ 選択肢を1つずつ丸つけ　【必須】

**全選択肢**を `.choice` で1つずつ。飛ばさない。

```html
<h2>選択肢を1つずつ丸つけする</h2>
<div class="choice">
  <div class="mark x">✕</div>
  <div>
    <h3>C. EventBridgeルールでAWS Lambda関数を呼び出す</h3>
    <p>Lambdaは短距離ランナーです。<strong>1回の実行は最長15分まで</strong>と決まっていて、1時間は走りきれません。</p>
    <p class="why">「最大1時間」の一言で、この選択肢は消えます。</p>
  </div>
</div>
```

各選択肢に必要なもの：

| 要素 | 書くこと |
|---|---|
| `<h3>` | `A.` のように記号つきで、選択肢を短く要約 |
| 1段落目 | そのサービスが何者か、**たとえ話で**説明（例：Step Functions＝合唱コンクールの指揮者） |
| `.why` | ①のどのヒントに引っかかって◯／✕なのか、1文で言い切る |

- ✕の理由は「劣っている」ではなく「**どのヒントを満たさないか**」で書く。
- 「動くけれど手間が多いので不正解」型（要件は満たすが最適でない）と、「そもそも要件を満たさない」型を区別して書く。

### ⑤ 正解の動きを追いかける　【条件付き・入れないほうが多い】

**②で構成図（`.nodes` や `.vs`）を描いたなら、このセクションは入れない。** 同じ絵を言葉で言い直すだけになる。

入れてよいのは次の条件を**両方**満たすときだけ。

1. 正解が**複数サービスの組み合わせ**である（例：EventBridge ＋ AWS Batch ＋ EC2）
2. その**連携の順番が②の図では分からない**

このときだけ `.flow` で4ステップ前後。最後のステップは「終わったあとどうなるか」（後片づけ・コスト・自動化）で締め、図のあとに `.caption` で「人間がやることは〜だけ」と労力を明示する。

迷ったら入れない。解説が長いほど良いわけではない。

### ⑥ 比較表　【任意・迷いやすい問題のみ】

観点（運用の手間／コスト／耐障害性など）を1つに絞って全選択肢を並べる。
判定列は `td.good` / `td.bad` で色をつける。

### ⑦ 答えと覚え方　【必須】

```html
<div class="kotae">
  <p><strong>答え：A　AWS Batch でEC2インスタンス（Windows）を起動し、EventBridgeで日次スケジュールを設定する</strong></p>
  <p class="oboe">覚え方 —— <strong>15分を超えるならLambdaは消える。時々しか動かない処理はAWS Batchに任せる。</strong>この2つで、同じ形の問題はだいたい解けます。</p>
</div>
```

覚え方は**次に似た問題が出たとき使える判定ルール**にする。この問題の答えの繰り返しにしない。
数字（15分、5分、99.999999999%）は覚え方に入れる価値が高い。

---

## 文章のルール

- **中学生が読んでわかること**。これが最優先。
- AWSサービスは初出で必ず「何者か」をたとえる。サービス名だけで進めない。
- 断定する。「〜かもしれません」「〜と思われます」は書かない。
- 一文を短く。1文＝1つのことだけ。
- 専門用語を使うなら直後に言い換える（例：「オーバーヘッド（運用の手間）」）。
- 英略語はカタカナか日本語を添える。
- 語りかける文体（「〜します」「〜です」）で統一。突然の体言止めを混ぜない。

## 図の選び方（ここが品質を決める）

**同じ図を毎回使わない。** 説明したいことの種類で図を選ぶ。

| 説明したいこと | 使う図 | 例 |
|---|---|---|
| **どうつながっているか**（構成・経路・登場人物） | `.vs` ＋ `.nodes` | Lambda→Proxy→RDS、通信がOSを経由する／しない |
| **どちらを選ぶべきか**（ダメな構成と良い構成） | `.vs`（✕こうなる／◯こうする） | 直接つなぐ vs Proxyをはさむ |
| **何がどこに入っているか**（範囲・階層） | `.zone`（入れ子の枠） | VPC＞サブネット＞EC2、AZをまたぐ構成 |
| **どういう順番で動くか**（時系列） | `.flow` | EventBridge→Batch→EC2→停止 |
| **量や長さの大小**（本当に数値の比較のとき **だけ**） | `.bars` | 60分 vs 15分、10TB vs 100GB |
| **1日・1年のうちどれだけ動くか** | `.day` | 1日1時間だけ稼働 |
| **項目ごとの違いの一覧** | `table` | 選択肢×観点の比較 |

`.bars` は<strong>数の大小そのものが論点のときだけ</strong>使う。「接続が増える」「性能が落ちる」のような**構造の話を棒グラフにしない**。構造の話は必ず矩形と矢印の図（`.nodes`）で描く。

## 図解パーツの書き方

### 構成図 `.nodes`（矩形＋矢印）

```html
<div class="nodes v">
  <div class="node many ng">
    <span class="ico"><img src="assets/icons/aws-lambda.svg" alt=""></span>
    <span class="lbl">Lambda</span><span class="sub">1,000個が同時に起動</span>
  </div>
  <div class="link ng"><span>接続 1,000本</span><span class="l">↓</span></div>
  <div class="node ng">
    <span class="ico"><img src="assets/icons/amazon-rds.svg" alt=""></span>
    <span class="lbl">RDS for MySQL</span><span class="sub">席が満杯 → エラー</span>
  </div>
</div>
```

| クラス | 意味 |
|---|---|
| `.nodes` / `.nodes.v` | 横並び／縦並び。3つ以上つなぐときや `.vs` の中では `v` を使う |
| `.node.ok` / `.node.ng` / `.node.dim` | 枠を緑／赤／灰色にする |
| `.node.many` | 同じものが何枚も重なっている表現（Lambdaが大量起動、EC2が複数台） |
| `.link` | 矢印。`<span>ラベル</span><span class="l">↓</span>` の2行。`.ok` `.ng` で色がつく |
| 矢印の文字 | 縦並びは `↓`、横並びは `⟶` を使う |

### 対比 `.vs`（✕こうなる／◯こうする）

```html
<div class="vs">
  <div class="pane bad">
    <div class="pane-h">✕ 直接つなぐと</div>
    <div class="nodes v">…</div>
    <p class="note">この構成だと何が起きるか、1文で。</p>
  </div>
  <div class="pane good">
    <div class="pane-h">◯ RDS Proxyをはさむと</div>
    <div class="nodes v">…</div>
    <p class="note">何が解決するか、1文で。</p>
  </div>
</div>
```

左右の**段数の差がそのまま説明**になるように組む（経由が多い／少ない、接続が多い／少ない）。

### 範囲の枠 `.zone`（VPC・サブネット・AZ）

```html
<div class="zone">
  <span class="zlbl"><img src="assets/icons/group-virtual-private-cloud-vpc.svg" alt="">VPC</span>
  <div class="zone">
    <span class="zlbl">プライベートサブネット</span>
    <div class="zrow">
      <div class="node">…</div>
      <div class="node">…</div>
    </div>
  </div>
</div>
```

`.zone` は入れ子にできる。外側が破線、内側が実線になる。`.zone.ok` / `.zone.ng` で色がつく。

### 流れ図 `.flow`（時系列）

各ステップの先頭に `<div class="ico"><img src="assets/icons/xxx.svg" alt=""></div>` を置ける。

## AWSアイコンの使い方

`assets/icons/` に公式のAWSアーキテクチャアイコン（SVG）が359個入っている。

**探し方** — ファイル名一覧を grep する。

```bash
grep -i rds assets/icons/INDEX.txt
grep -iE "kubernetes|container" assets/icons/INDEX.txt
```

| 種類 | 名前の形 | 例 |
|---|---|---|
| サービス | `<正式名を小文字ケバブ>.svg` | `aws-lambda.svg` `amazon-rds.svg` `amazon-simple-queue-service.svg` |
| グループ枠 | `group-*.svg` | `group-virtual-private-cloud-vpc.svg` `group-auto-scaling-group.svg` |
| 汎用 | `gen-*.svg` | `gen-server.svg` `gen-database.svg` `gen-client.svg` `gen-internet.svg` `gen-gear.svg` `gen-alert.svg` |

ルール：

- **必ず実在するファイル名を使う。** 書いたあと `ls assets/icons/<name>.svg` で確認する。存在しないパスは画像が出ず、図が壊れる。
- 専用アイコンがないもの（RDS Proxyなど）は、**近いサービスのアイコン＋ラベルで区別する**。AWS公式の構成図も同じやり方をしている。
- サービスでないもの（OS、ネットワーク、人）は `gen-*` を使う。
- 絵文字は使わない。ページの見た目が崩れる。

## セルフチェック

解説を書き終えたら全部確認する。1つでも欠けていたら直す。

- [ ] ①のヒント表がある。決め手に `<mark>` が1か所ある
- [ ] 図解パーツを**2つ以上**使っている（①の表は数えない）
- [ ] **`.bars` を構造の説明に使っていない**（数値の大小のときだけ）
- [ ] 構成・経路の説明に矩形と矢印の図（`.nodes`）を使っている
- [ ] 図の中のアイコンパスが全部実在する（`ls assets/icons/…` で確認した）
- [ ] 図のすぐ下に `.caption` がある
- [ ] 身近なたとえが**2つ以上**ある（教室、目覚まし時計、短距離ランナー…）
- [ ] **全部の**選択肢に `.choice` がある。`.why` が全部に入っている
- [ ] ✕の理由が「どのヒントを満たさないか」になっている
- [ ] ③の区別の表に「できないこと／向かないこと」の列がある
- [ ] **②で構成図を描いたなら `.flow` を入れていない**（入れたなら組み合わせの連携を説明している）
- [ ] `.kotae` の覚え方が、**次の問題に使える判定ルール**になっている
- [ ] 「〜かもしれません」「〜と思います」が1つもない
- [ ] 初出のAWSサービスに、たとえか言い換えがついている
- [ ] `id` が既存と重複していない
- [ ] `answer` の番号が `choices` の並びと合っている（複数選択なら配列）
- [ ] ブラウザで開いて、レイアウトが崩れていない
