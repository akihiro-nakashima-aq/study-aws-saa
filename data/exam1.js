// 演習テスト1: SAA-C03版模擬試験①
// 問題を足すときは questions 配列に1件ずつ追加する。
// explain は index.html の図解パーツCSSと assets/icons/ のAWS公式アイコンが使える。
// 図の選び方は .claude/skills/saa-kaisetsu/SKILL.md を見ること。
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
    <div class="step"><div class="num">1</div><div class="ico"><img src="assets/icons/amazon-eventbridge.svg" alt=""></div><div class="ttl">EventBridge</div>
      <div class="sub">毎日決まった時刻に鳴る目覚まし時計。「そろそろ仕事の時間だよ」と合図を出す。</div></div>
    <div class="arrow">→</div>
    <div class="step"><div class="num">2</div><div class="ico"><img src="assets/icons/aws-batch.svg" alt=""></div><div class="ttl">AWS Batch</div>
      <div class="sub">合図を受け取る受付係。必要な台数・スペックを判断してジョブを並べる。</div></div>
    <div class="arrow">→</div>
    <div class="step"><div class="num">3</div><div class="ico"><img src="assets/icons/amazon-ec2.svg" alt=""></div><div class="ttl">EC2（Windows）</div>
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

  {
    id: 'e1q2',
    q: 'ある金融機関は、銀行業務においてハイパフォーマンスコンピューティングと機械学習を活用した不正検出システムを開発しています。この金融機関は、ワークロードを迅速に処理するための分散処理を求めています。運用上のオーバーヘッドを抑制しつつ、これらの要件を満たすソリューションはどれでしょうか。',
    choices: [
      'Amazon EKSと複数のコンテナを利用して、ハイパフォーマンスコンピューティング（HPC）クラスターをデプロイする',
      'AWS ParallelClusterとEFAを利用したMessage Passing Interface（MPI）ライブラリを使用して、ハイパフォーマンスコンピューティング（HPC）クラスターをデプロイする',
      'Amazon EC2インスタンスにAmazon SQSを連携して、分散並列処理を構成し、ハイパフォーマンスコンピューティング（HPC）クラスターをデプロイする',
      'Amazon ECSと複数のコンテナを利用して、ハイパフォーマンスコンピューティング（HPC）クラスターをデプロイする',
    ],
    answer: 1,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <p>選択肢はどれも「HPCクラスターをデプロイする」で終わっています。つまり<strong>結論は全部同じ</strong>で、違うのはやり方だけ。だから問題文のことばを先に取り出して、どのやり方が求められているのかを決めます。</p>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>ハイパフォーマンスコンピューティング（HPC）</td><td>たくさんのコンピュータで手分けして、1つの大きな計算をする</td></tr>
    <tr><td>分散処理で迅速に処理</td><td><mark>手分けした者どうしが、すごい速さで連絡を取り合う必要がある</mark></td></tr>
    <tr><td>運用上のオーバーヘッド（運用の手間）を抑制</td><td>クラスターの組み立てや管理を、人間が手作業でやらない</td></tr>
  </table>

  <h3>HPCがふつうの分散処理と違うところ</h3>
  <p>同じ「手分け」でも、2種類あります。ここを取り違えると選択肢が全部それっぽく見えます。</p>
  <table>
    <tr><th style="width:24%">種類</th><th style="width:38%">たとえると</th><th>連絡の速さ</th></tr>
    <tr><td>ふつうの分散処理</td><td>採点係が10人。1人1枚ずつ答案を配られて、黙々と採点する</td><td>そんなに要らない</td></tr>
    <tr><td class="good">HPC（今回）</td><td>全校生徒で1つの巨大な計算をする。<strong>隣の人の途中結果を待たないと、自分の次の一歩が進めない</strong></td><td class="good">これが命</td></tr>
  </table>
  <p class="caption">HPCでは計算そのものより「連絡の待ち時間」がボトルネックになります。だから通信の速さを最優先で選びます。</p>

  <h2>決め手は「連絡の待ち時間」</h2>
  <p>コンピュータどうしの連絡は、ふつうOS（基本ソフト）を経由します。EFA（イーエフエー／Elastic Fabric Adapter）は、このOSを飛ばして相手のメモリに直接データを届ける特別な回線です。</p>
  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ ふつうの通信</div>
      <div class="nodes v">
        <div class="node"><span class="ico"><img src="assets/icons/amazon-ec2.svg" alt=""></span><span class="lbl">計算機A</span></div>
        <div class="link ng"><span class="l">↓</span></div>
        <div class="node dim"><span class="ico"><img src="assets/icons/gen-gear.svg" alt=""></span><span class="lbl">OS（基本ソフト）</span></div>
        <div class="link ng"><span class="l">↓</span></div>
        <div class="node dim"><span class="ico"><img src="assets/icons/gen-internet.svg" alt=""></span><span class="lbl">ネットワーク</span></div>
        <div class="link ng"><span class="l">↓</span></div>
        <div class="node dim"><span class="ico"><img src="assets/icons/gen-gear.svg" alt=""></span><span class="lbl">OS（基本ソフト）</span></div>
        <div class="link ng"><span class="l">↓</span></div>
        <div class="node"><span class="ico"><img src="assets/icons/amazon-ec2.svg" alt=""></span><span class="lbl">計算機B</span></div>
      </div>
      <p class="note">1回の連絡ごとに、この段数を毎回通ります。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ EFAの通信</div>
      <div class="nodes v">
        <div class="node ok"><span class="ico"><img src="assets/icons/amazon-ec2.svg" alt=""></span><span class="lbl">計算機A</span></div>
        <div class="link ok"><span>直通</span><span class="l">↓</span></div>
        <div class="node ok"><span class="ico"><img src="assets/icons/amazon-ec2.svg" alt=""></span><span class="lbl">計算機B</span></div>
      </div>
      <p class="note">OSを飛ばして、相手のメモリへ直接届けます。</p>
    </div>
  </div>
  <p class="caption">図の段数がそのまま待ち時間の差です。</p>
  <p>たとえるなら、<mark>隣の席の友だちに紙を渡すのに、いちいち職員室の先生を通す</mark>のがふつうの通信。EFAは<strong>隣の席に直接手渡し</strong>です。1回の差はわずかでも、この連絡が計算中に何億回も起きるので、全体では大きな差になります。</p>

  <h3>登場人物を整理する</h3>
  <table>
    <tr><th style="width:30%">名前</th><th>役割（たとえ）</th></tr>
    <tr><td>MPI（エムピーアイ）</td><td>手分けのルールブック。「誰が何を計算して、結果を誰に渡すか」を決める共通の言葉</td></tr>
    <tr><td>EFA</td><td>その連絡を運ぶ専用の直通回線</td></tr>
    <tr><td>AWS ParallelCluster</td><td>クラスターの組み立てキット。設計図を1枚渡すと、全部まとめて自動で組み立ててくれる</td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. Amazon EKSと複数のコンテナでHPCクラスターを組む</h3>
      <p>EKSはKubernetes（クバネティス）というコンテナの管理人をAWSが用意してくれるサービスです。コンテナは「小さな荷物箱に入った、独立して動くプログラム」。荷物箱をたくさん並べて、それぞれ別の仕事をさせるのが得意です。</p>
      <p>ただし箱と箱の連絡はふつうのネットワーク越し。EFAのような直通回線を前提にした設計ではありません。しかもKubernetesは自由度が高い分、設定も管理も自分で背負うことになります。</p>
      <p class="why">ヒント2「すごい速さで連絡を取り合う」とヒント3「運用の手間を抑える」の両方を満たしません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>B. AWS ParallelCluster ＋ EFA ＋ MPI でHPCクラスターを組む</h3>
      <p>HPCのためだけに用意された組み合わせです。MPIが手分けのルールを決め、EFAがその連絡を最速で運び、ParallelClusterが必要な機材一式を自動で組み立てます。</p>
      <p class="why">手分けのルール・速い連絡・自動の組み立て。3つのヒントにそれぞれ答えが用意されています。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. Amazon EC2にAmazon SQSを連携して分散並列処理を組む</h3>
      <p>SQSは順番待ちの行列です。スーパーのレジの列と同じで、仕事を1件ずつ並べて、空いた人から取っていく仕組み。<strong>並んでいる仕事どうしは、お互いに関係がない</strong>ことが前提です。</p>
      <p>ところがHPCは「隣の人の途中結果を待つ」計算。列に並べて配るやり方では表現できません。おまけにEC2を何台立ててどうつなぐかも、全部自分で組み立てることになります。</p>
      <p class="why">ヒント2の「連絡を取り合いながら計算する」形そのものを作れません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. Amazon ECSと複数のコンテナでHPCクラスターを組む</h3>
      <p>ECSはAWSが独自に作ったコンテナの管理人です。Aより設定はラクですが、<strong>コンテナを並べるという性質はAと同じ</strong>。独立した仕事をたくさんさばくのは得意で、密に会話しながら進める計算は守備範囲の外です。</p>
      <p class="why">運用の手間はAよりマシでも、ヒント2の「すごい速さで連絡を取り合う」を満たしません。</p>
    </div>
  </div>

  <h2>正解の動きを追いかける</h2>
  <div class="flow">
    <div class="step"><div class="num">1</div><div class="ttl">設計図を書く</div>
      <div class="sub">「計算機を何台、どの種類で、EFAを使う」と設定ファイルに書く。人間の仕事はほぼここだけ。</div></div>
    <div class="arrow">→</div>
    <div class="step"><div class="num">2</div><div class="ico"><img src="assets/icons/aws-parallel-cluster.svg" alt=""></div><div class="ttl">ParallelClusterが組み立て</div>
      <div class="sub">司令塔・計算機・共有の保管庫・順番管理役を、まとめて自動で用意する。</div></div>
    <div class="arrow">→</div>
    <div class="step"><div class="num">3</div><div class="ico"><img src="assets/icons/elastic-fabric-adapter.svg" alt=""></div><div class="ttl">MPI ＋ EFA で計算</div>
      <div class="sub">MPIのルールで手分けし、EFAの直通回線で連絡しながら不正検出のモデルを一気に計算する。</div></div>
    <div class="arrow">→</div>
    <div class="step"><div class="num">4</div><div class="ttl">終わったら自動で縮小</div>
      <div class="sub">計算機は使った分だけで片づけられる。次に必要になったらまた自動で増える。</div></div>
  </div>
  <p class="caption">人間がやることは、設計図を1回書くだけ。台数を増やしたいときも、その1行を変えるだけで済みます。</p>

  <h2>「連絡の速さ」で並べると</h2>
  <table>
    <tr><th style="width:26%">やり方</th><th style="width:38%">計算機どうしの連絡</th><th>判定</th></tr>
    <tr><td>ParallelCluster + EFA + MPI</td><td>直通回線。HPC専用の設計</td><td class="good">要件どおり</td></tr>
    <tr><td>ECS + コンテナ</td><td>ふつうのネットワーク越し</td><td class="bad">速さが足りない</td></tr>
    <tr><td>EKS + コンテナ</td><td>ふつうのネットワーク越し＋管理も自前</td><td class="bad">速さも手間もダメ</td></tr>
    <tr><td>EC2 + SQS</td><td>そもそも連絡し合わない形</td><td class="bad">要件を満たさない</td></tr>
  </table>

  <div class="kotae">
    <p><strong>答え：B　AWS ParallelClusterとEFAを利用したMPIライブラリを使用して、HPCクラスターをデプロイする</strong></p>
    <p class="oboe">覚え方 —— <strong>「HPC」「MPI」「低レイテンシ」「ノード間通信」のどれかが出たら、答えはParallelCluster＋EFAで確定。</strong>逆に、コンテナ（ECS／EKS）とキュー（SQS）は<strong>互いに会話しない仕事を並べる</strong>ための道具です。この線引きだけで、HPCの問題はほぼ即決できます。</p>
  </div>`
  },

  {
    id: 'e1q3',
    q: 'ある企業は、AWS上でアプリケーションを開発しています。このアプリケーションはAWS Lambda関数を用いて実行されるサーバーレスアプリケーションです。データベース層にはAmazon RDS for MySQL DBインスタンスを使用し、Lambda関数によって多くのデータ処理を行う必要があります。その際の接続構成を最適化することが求められます。運用上のオーバーヘッドを抑えつつ、これらの要件を満たすソリューションはどれでしょうか。',
    choices: [
      'RDSエンドポイントを利用して、Amazon RDS DBインスタンスに接続する',
      'RDS Proxyを構成して、Amazon RDS DBインスタンスへの接続にRDS Proxyを使用する',
      'RDSライターエンドポイントを利用して、Amazon RDS DBインスタンスに接続する',
      'RDSリーダーエンドポイントを利用して、Amazon RDS DBインスタンスに接続する',
    ],
    answer: 1,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <p>この問題は「Lambda」と「RDS」が同じ文に出てきた時点で、ほぼ勝負がついています。なぜそうなるのかを、問題文のことばから確かめます。</p>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>AWS Lambda（サーバーレス）</td><td>呼ばれるたびに新しい実行環境が立ち上がる。同時にいくつも並んで動く</td></tr>
    <tr><td>多くのデータ処理を行う</td><td><mark>Lambdaが一度にたくさん起動し、そのぶんDBへの接続が一気に増える</mark></td></tr>
    <tr><td>接続構成を最適化／運用の手間を抑える</td><td>接続の使い回しを自前で作らず、任せられる仕組みを使う</td></tr>
  </table>

  <h3>「接続」ってそもそも何をしているのか</h3>
  <p>プログラムがデータベースを使うとき、いきなり質問を投げるわけではありません。先に<strong>接続</strong>という準備をします。受付に行って「私は誰それです、合言葉はこれです」と名乗り、席を1つ用意してもらう作業です。この受付の手続きは、実は1回1回そこそこ重たい作業です。</p>
  <p>ふつうのサーバーなら、朝に一度席を確保したらそのまま1日使い続けます。ところがLambdaは<strong>呼ばれるたびに生まれて、終わったら消える</strong>。だから毎回ゼロから受付をやり直すことになります。</p>

  <h2>決め手は「席の数」が足りなくなること</h2>
  <p>データベースには「同時に何人まで席に座れるか」という上限があります。Lambdaが1,000個同時に動けば、席を1,000個まとめて要求します。上限を超えた分は座れず、エラーになります。</p>
  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ 直接つなぐと</div>
      <div class="nodes v">
        <div class="node many ng"><span class="ico"><img src="assets/icons/aws-lambda.svg" alt=""></span><span class="lbl">Lambda</span><span class="sub">1,000個が同時に起動</span></div>
        <div class="link ng"><span>接続 1,000本</span><span class="l">↓</span></div>
        <div class="node ng"><span class="ico"><img src="assets/icons/amazon-rds.svg" alt=""></span><span class="lbl">RDS for MySQL</span><span class="sub">席が満杯 → エラー</span></div>
      </div>
      <p class="note">Lambdaが増えた分だけ、そのままDBの席を取りにいきます。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ RDS Proxyをはさむと</div>
      <div class="nodes v">
        <div class="node many"><span class="ico"><img src="assets/icons/aws-lambda.svg" alt=""></span><span class="lbl">Lambda</span><span class="sub">1,000個が同時に起動</span></div>
        <div class="link"><span>たくさん来る</span><span class="l">↓</span></div>
        <div class="node ok"><span class="ico"><img src="assets/icons/amazon-rds.svg" alt=""></span><span class="lbl">RDS Proxy</span><span class="sub">接続を貸し出す受付係</span></div>
        <div class="link ok"><span>数十本だけ</span><span class="l">↓</span></div>
        <div class="node ok"><span class="ico"><img src="assets/icons/amazon-rds.svg" alt=""></span><span class="lbl">RDS for MySQL</span><span class="sub">席に余裕あり</span></div>
      </div>
      <p class="note">受付係が少ない接続を順ぐりに回すので、DB側は増えません。</p>
    </div>
  </div>
  <p class="caption">Lambdaがいくら増えても、DBに届く接続の本数は変わらない。ここが決め手です。</p>
  <p>たとえるなら、<mark>100人の生徒が図書館に来るたびに、自分専用の机を新しく運び込む</mark>のが直接つなぐやり方。すぐ部屋がいっぱいになります。RDS Proxyは<strong>共有の机を貸し出す受付係</strong>。使い終わった人から机を返してもらい、次に来た人へ回します。机の数はずっと少なくて足ります。</p>

  <h3>RDS Proxyが引き受けてくれること</h3>
  <table>
    <tr><th style="width:32%">やってくれること</th><th>うれしい理由</th></tr>
    <tr><td>接続の使い回し（プール）</td><td>DBの席が足りなくなるのを防ぐ</td></tr>
    <tr><td>接続の準備を肩代わり</td><td>毎回の受付手続きが省けるので、処理が速くなる</td></tr>
    <tr><td>フェイルオーバーの吸収</td><td>DBが予備機に切り替わるとき、待たされる時間が短くなる</td></tr>
    <tr><td>Secrets Managerとの連携</td><td>パスワードをLambdaのコードに書かずに済む</td></tr>
  </table>
  <p class="caption">しかもマネージドサービスなので、自分でサーバーを立てて管理する必要はありません。</p>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. RDSエンドポイントを利用して直接つなぐ</h3>
      <p>エンドポイントは<strong>DBの住所</strong>です。「このデータベースはここにありますよ」という宛先を示しているだけ。いま使っているのも、たぶんこれです。</p>
      <p>つまりこの選択肢は「今のまま何も変えない」と言っているのと同じ。Lambdaが増えれば接続も増え、席の上限にぶつかります。</p>
      <p class="why">ヒント2の「接続が一気に増える」問題を、まったく解決していません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>B. RDS Proxyを構成して、そこ経由で接続する</h3>
      <p>LambdaとDBのあいだに立つ受付係です。Lambdaは受付係に話しかけ、受付係が手持ちの少ない接続を上手に回して取り次ぎます。</p>
      <p class="why">接続の本数を抑え、準備の手間も減らし、しかも自分で作らなくていい。3つのヒントを全部クリアします。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. RDSライターエンドポイントを利用する</h3>
      <p>ライターエンドポイントは「<strong>書き込みはこちらの担当へ</strong>」という宛先の名前です。AuroraやマルチAZ DBクラスターのように、書く係と読む係が分かれている構成で、行き先を間違えないために使います。</p>
      <p class="why">これは<strong>どこにつなぐか</strong>の話。<strong>何本つなぐか</strong>の話ではないので、席が足りなくなる問題は何も変わりません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. RDSリーダーエンドポイントを利用する</h3>
      <p>こちらは「<strong>読み取りはこちらの担当へ</strong>」という宛先です。読む作業を複数のコピーに振り分けて混雑をやわらげる仕組みで、それ自体は便利なものです。</p>
      <p class="why">Cと同じく宛先の話で接続数は減りません。おまけに読み取り専用なので、データを書き込む処理はそもそも通せません。</p>
    </div>
  </div>

  <h3>CとDがまぎらわしい理由を1行で</h3>
  <table>
    <tr><th style="width:30%">選択肢</th><th style="width:34%">答えているのは</th><th>今回の問題</th></tr>
    <tr><td>エンドポイント（A・C・D）</td><td>どこにつなぐか（宛先）</td><td class="bad">論点が違う</td></tr>
    <tr><td>RDS Proxy（B）</td><td>何本つなぐか（接続の数と使い回し）</td><td class="good">これが論点</td></tr>
  </table>

  <h2>正解の動きを追いかける</h2>
  <div class="flow">
    <div class="step"><div class="num">1</div><div class="ico"><img src="assets/icons/aws-lambda.svg" alt=""></div><div class="ttl">Lambdaが大量に起動</div>
      <div class="sub">処理の依頼が増えると、Lambdaは何百個も同時に立ち上がる。</div></div>
    <div class="arrow">→</div>
    <div class="step"><div class="num">2</div><div class="ico"><img src="assets/icons/amazon-rds.svg" alt=""></div><div class="ttl">RDS Proxyに話しかける</div>
      <div class="sub">DBではなく受付係へ。接続先をProxyのアドレスに変えるだけで済む。</div></div>
    <div class="arrow">→</div>
    <div class="step"><div class="num">3</div><div class="ttl">少ない接続を使い回す</div>
      <div class="sub">Proxyが手持ちの接続を順ぐりに貸し出す。DB側の席は増えない。</div></div>
    <div class="arrow">→</div>
    <div class="step"><div class="num">4</div><div class="ttl">終わった接続は返却</div>
      <div class="sub">Lambdaが消えても接続は残り、次のLambdaがそのまま使う。準備の時間もゼロ。</div></div>
  </div>
  <p class="caption">人間がやることは、Proxyを1つ作って接続先の名前を書き換えるだけ。あとの調整はAWSが引き受けます。</p>

  <div class="kotae">
    <p><strong>答え：B　RDS Proxyを構成して、Amazon RDS DBインスタンスへの接続にRDS Proxyを使用する</strong></p>
    <p class="oboe">覚え方 —— <strong>「Lambda」と「RDS」が同じ問題文に出てきたら、答えはRDS Proxy。</strong>そして<strong>「〜エンドポイント」という選択肢は、どこにつなぐか（宛先）の話であって、接続の本数の話ではありません。</strong>問題が接続数・接続の枯渇・接続の最適化を聞いているなら、エンドポイント系は全部消えます。</p>
  </div>`
  },

  ],
};
