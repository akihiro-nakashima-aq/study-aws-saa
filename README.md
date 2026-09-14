# study-aws-saa

AWS SAA-C03 の問題集アプリ。`index.html` をブラウザで開くだけで動く（ビルド不要）。

- 解答結果と「自信あり」チェックは localStorage に保存
- 解説は図解パーツ（`.day` / `.bars` / `.flow` / `.choice` / `table` / `.kotae`）を使って中学生でもわかるレベルで記述

## 問題の追加

`data/exam1.js` の `questions` 配列に1件追加する。

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
