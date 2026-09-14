// 演習テスト1: SAA-C03版模擬試験①
// 問題を足すときは questions 配列に1件ずつ追加する。
// explain は index.html の図解パーツCSS（.day / .bars / .flow / .choice / table / .kotae）が使える。
const EXAM = {
  title: '演習テスト1 ／ SAA-C03版 模擬試験①',
  questions: [

  {
    id: 'e1q1',
    q: 'Windowsサーバーで動いているバッチジョブがある。1日1回実行され、完了までに最大1時間かかる。これをAWSに移行したい。運用のオーバーヘッドは最小にしたい。どうするべきか。',
    choices: [
      'AWS Batch でEC2インスタンス（Windows）を起動し、Amazon EventBridgeで日次スケジュールを設定する',
      'Auto Scalingグループを組んだEC2のフリートでバッチジョブを実行する',
      'Amazon EventBridgeのルールでAWS Lambda関数を日次で呼び出す',
      'AWS Step Functionsのステートマシンでバッチジョブを実行する',
    ],
    answer: 0,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <p>問題文には、答えを決めるためのヒントが3つ隠れています。読み飛ばすと選択肢が全部それっぽく見えてしまうので、先に取り出しておきます。</p>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>Windowsサーバー</td><td>Windowsが動く場所が必要。どこでも動くわけではない</td></tr>
    <tr><td>日次（1日1回）</td><td>決まった時刻に自動で始めてくれる「目覚まし時計」が要る</td></tr>
    <tr><td>最大1時間</td><td>1時間動ける仕組みでないとダメ。<mark>そして残りの23時間はヒマ</mark></td></tr>
  </table>

  <h3>1日のうち、実際に働いているのはここだけ</h3>
  <div class="day">
    <div class="strip">
      <span></span><span></span><span class="on"></span><span></span><span></span><span></span>
      <span></span><span></span><span></span><span></span><span></span><span></span>
      <span></span><span></span><span></span><span></span><span></span><span></span>
      <span></span><span></span><span></span><span></span><span></span><span></span>
    </div>
    <div class="scale"><span>0時</span><span>6時</span><span>12時</span><span>18時</span><span>24時</span></div>
    <p class="caption">赤いところが仕事の時間（1時間）。灰色の23時間はなにもしていません。</p>
  </div>
  <p>ここが一番大事なポイントです。24時間ずっとサーバーを起動しておくのは、<mark>1日1回しか使わない教室のエアコンを24時間つけっぱなしにする</mark>のと同じ。お金も手間ももったいない。だから「必要なときだけ動いて、終わったら勝手に片づく」仕組みを選びます。</p>

  <h2>選択肢を1つずつ丸つけする</h2>
  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>A. AWS Batch でEC2のWindowsサーバーを起動し、EventBridgeで毎日実行</h3>
      <p>AWS Batchは「必要なときだけ作業員を呼んで、仕事が終わったら帰らせてくれる派遣センター」のような仕組みです。サーバーを何台にするか、いつ止めるかを人間が考えなくていい。</p>
      <p class="why">Windowsも動く／1時間でも大丈夫／後片づけまで自動 → 3つのヒントを全部クリア。</p>
    </div>
  </div>
  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. Auto Scalingグループを組んだEC2のフリートで実行</h3>
      <p>これでも動くには動きます。でもEC2を何台にするか、どう増やすか減らすか、OSの更新は誰がやるか──ぜんぶ自分で面倒を見ることになります。</p>
      <p class="why">問題が求めているのは「運用の手間が小さい方法」。動くけれど手間が多いので不正解。</p>
    </div>
  </div>
  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. EventBridgeルールでAWS Lambda関数を呼び出す</h3>
      <p>Lambdaは短距離ランナーです。<strong>1回の実行は最長15分まで</strong>と決まっていて、1時間は走りきれません。そもそもWindowsサーバーのプログラムをそのまま持ち込める場所でもありません。</p>
      <p class="why">「最大1時間」の一言で、この選択肢は消えます。</p>
    </div>
  </div>
  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. Step Functionsのステートマシンで実行</h3>
      <p>Step Functionsは合唱コンクールの指揮者です。「次はこれ、その次はこれ」と順番を指示するのが仕事で、<strong>自分では歌いません</strong>。実際にバッチを動かす場所（EC2やBatch）が別に必要です。</p>
      <p class="why">複数の処理をつなげたいときには便利ですが、今回のように1本のジョブを動かすだけなら役者不足。</p>
    </div>
  </div>

  <h2>Lambdaが落ちる理由をもう一度、図で</h2>
  <div class="bars">
    <div class="barrow"><div class="name">今回のバッチ</div><div class="bar dark" style="width:100%">最大 60分</div></div>
    <div class="barrow"><div class="name">Lambdaの上限</div><div class="bar red" style="width:25%">15分</div></div>
  </div>
  <p class="caption">長さがまるで足りていません。Lambdaは「短くて軽い処理」の担当です。</p>

  <h2>正解の動きを追いかける</h2>
  <div class="flow">
    <div class="step"><div class="num">1</div><div class="ttl">EventBridge</div>
      <div class="sub">毎日決まった時刻に鳴る目覚まし時計。「そろそろ仕事の時間だよ」と合図を出す。</div></div>
    <div class="arrow">→</div>
    <div class="step"><div class="num">2</div><div class="ttl">AWS Batch</div>
      <div class="sub">合図を受け取る受付係。必要な台数・スペックを判断してジョブを並べる。</div></div>
    <div class="arrow">→</div>
    <div class="step"><div class="num">3</div><div class="ttl">EC2（Windows）</div>
      <div class="sub">このタイミングで起動。今までと同じWindowsの環境でバッチを実行する。</div></div>
    <div class="arrow">→</div>
    <div class="step"><div class="num">4</div><div class="ttl">終了・自動で停止</div>
      <div class="sub">1時間の仕事が終わったらEC2は片づけられる。残りの23時間は料金も手間もゼロ。</div></div>
  </div>
  <p class="caption">人間がやることは、最初にこの流れを1回作るだけ。あとは毎日ひとりでに回ります。</p>

  <h2>運用の手間で並べると</h2>
  <table>
    <tr><th style="width:30%">やり方</th><th style="width:36%">人間がやる仕事</th><th>判定</th></tr>
    <tr><td>AWS Batch + EventBridge</td><td>最初の設定だけ</td><td class="good">いちばん手間が小さい</td></tr>
    <tr><td>EC2 + Auto Scaling</td><td>台数の設計、増減の調整、OSの管理</td><td>手間が大きい</td></tr>
    <tr><td>Lambda</td><td>そもそも1時間動かせない</td><td class="bad">要件を満たさない</td></tr>
    <tr><td>Step Functions 単体</td><td>実行する場所を別に用意する必要あり</td><td class="bad">要件を満たさない</td></tr>
  </table>

  <div class="kotae">
    <p><strong>答え：A　AWS Batch でEC2インスタンス（Windows）を起動し、EventBridgeで日次スケジュールを設定する</strong></p>
    <p class="oboe">覚え方 —— <strong>15分を超えるならLambdaは消える。時々しか動かない処理はAWS Batchに任せる。</strong>この2つで、同じ形の問題はだいたい解けます。</p>
  </div>`
  },

  ],
};
