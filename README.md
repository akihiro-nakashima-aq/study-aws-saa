# study-aws-saa

AWS SAA-C03 の問題集アプリ。`index.html` をブラウザで開くだけで動く（ビルド不要）。

- 解答結果と「自信あり」チェックは localStorage に保存
- 解説は図解パーツ（`.nodes` 構成図 / `.vs` 対比 / `.zone` 範囲 / `.flow` 流れ / `.day` / `.bars` / `table` / `.kotae`）で中学生でもわかるレベルに図解
- `assets/icons/` にAWS公式アーキテクチャアイコン（SVG 359個）。一覧は `assets/icons/INDEX.txt`

## 問題の追加

Claude Code にUdemyの問題文・選択肢・解説を貼れば、`.claude/skills/saa-kaisetsu/` のスキルが
決まった型（ヒント表 → 図解 → 選択肢の丸つけ → 流れ図 → 答えと覚え方）で解説を生成して追加する。

手で書く場合は `data/exam1.js` の `questions` 配列に1件追加する。

```js
{
  id: 'e1q2',              // 重複しない任意のID（保存キーになるので後から変えない）
  q: '問題文',
  choices: ['A の文', 'B の文', 'C の文', 'D の文'],
  answer: 0,               // 複数選択は [0, 2]
  explain: `<h2>…</h2>…`,  // 図解入りの解説HTML
}
```

## ローカルサーバー（任意）

```bash
python3 -m http.server 8765
```
