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

  <h2>まぎらわしい4つを区別する</h2>
  <p>選択肢に出てくる名前は、どれも「処理を動かす」ように聞こえます。役割をはっきり分けておくと迷いません。</p>
  <table>
    <tr><th style="width:22%">名前</th><th style="width:30%">役割（たとえ）</th><th>できないこと</th></tr>
    <tr><td>Amazon EventBridge</td><td>決まった時刻に鳴る目覚まし時計</td><td>自分では処理しない。合図を出すだけ</td></tr>
    <tr><td class="good">AWS Batch</td><td class="good">必要なときだけ作業員を呼ぶ派遣センター</td><td>ミリ秒で即答するような用途には向かない</td></tr>
    <tr><td>AWS Lambda</td><td>短距離ランナー</td><td class="bad">15分を超える処理。Windowsのプログラムをそのまま動かすこと</td></tr>
    <tr><td>AWS Step Functions</td><td>合唱コンクールの指揮者</td><td class="bad">自分では歌わない。実行する場所が別に要る</td></tr>
  </table>
  <p class="caption">EventBridgeとStep Functionsは<strong>どちらも「自分では処理しない」</strong>のが共通点。処理する場所（Lambda・Batch・EC2）と必ずセットで考えます。</p>

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

  <h2>まぎらわしい3つの名前を整理する</h2>
  <p>正解の選択肢には知らない名前が3つ並んでいます。それぞれ担当がまったく違います。</p>
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


  <div class="kotae">
    <p><strong>答え：B　RDS Proxyを構成して、Amazon RDS DBインスタンスへの接続にRDS Proxyを使用する</strong></p>
    <p class="oboe">覚え方 —— <strong>「Lambda」と「RDS」が同じ問題文に出てきたら、答えはRDS Proxy。</strong>そして<strong>「〜エンドポイント」という選択肢は、どこにつなぐか（宛先）の話であって、接続の本数の話ではありません。</strong>問題が接続数・接続の枯渇・接続の最適化を聞いているなら、エンドポイント系は全部消えます。</p>
  </div>`
  },

  {
    id: 'e1q4',
    q: 'ある企業は、3TBのボリュームデータをオンプレミスのリポジトリに保有し、大量の印刷ファイルを保存しています。このリポジトリは年間500GBの容量が増加しているものの、ローカル環境の制約により、単一の論理ボリュームとして運用する必要があります。あなたはソリューションアーキテクトとして、ローカルストレージの制約を回避するために、このリポジトリをAmazon S3バケットに拡張することが求められています。その際、ローカルストレージをメインストレージとして利用して、S3バケットをバックアップとして利用します。この要件を満たすために、AWS Storage Gatewayの構成をどのように設定すればよいでしょうか。',
    choices: [
      'Amazon S3への移転スケジュールが設定されたスナップショットを利用するキャッシュ型ボリュームをAWS上に構成して、キャッシュを取得する仕組みをオンプレミス環境に設定する',
      'Amazon S3への移転スケジュールが設定されたスナップショットを利用する保管型ボリュームをAWS上に構成して、保管ボリュームをオンプレミス環境に設定する',
      'Amazon S3 Glacier（迅速アクセス）への移転スケジュールが設定されたスナップショットを利用するキャッシュ型ボリュームをAWS上に構成して、スナップショットをAWSの別リージョンに保管する',
      'Amazon S3への移転スケジュールが設定されたスナップショットを利用する仮想テープライブラリーをAWS上に構成して、仮想テープをAmazon S3バケットに保存する',
    ],
    answer: 1,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <p>この問題文には<strong>わざと迷わせる書き方</strong>が仕込まれています。前半だけ読むと間違った選択肢に行き着くので、最後まで読んでから判断します。</p>
  <table>
    <tr><th style="width:36%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>単一の論理ボリュームとして運用</td><td>ファイル共有でもテープでもなく、<strong>1本のディスク</strong>として見えるものが必要</td></tr>
    <tr><td>ローカルストレージの制約を回避するためにS3に拡張</td><td>ここだけ読むと「S3を本体にする」ように見える。<strong>これがワナ</strong></td></tr>
    <tr><td>ローカルをメインストレージ、S3をバックアップ</td><td><mark>データの本体はオンプレミスに置く。S3は控えのコピー置き場</mark></td></tr>
  </table>
  <p class="caption">3行目が最後に出てきて、2行目をひっくり返します。矛盾しているように見えたら、<strong>あとに書かれたほうが本当の要件</strong>です。</p>

  <h2>決め手は「データの本体がどこにあるか」</h2>
  <p>AWS Storage Gateway（ストレージゲートウェイ）は、オンプレミスのサーバーとAWSのストレージをつなぐ<strong>中継役</strong>です。ボリューム（1本のディスクとして見えるもの）を扱うときは2種類から選びます。ここが今回の分かれ目です。</p>

  <div class="vs">
    <div class="pane good">
      <div class="pane-h">保管型（Stored）＝ 本体はローカル</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/gen-disk.svg" alt=""></span>
          <span class="lbl">オンプレのディスク</span><span class="sub">3TB 全部がここにある</span>
        </div>
        <div class="link ok"><span>定期的にコピーを送る</span><span class="l">↓</span></div>
        <div class="node">
          <span class="ico"><img src="assets/icons/amazon-simple-storage-service.svg" alt=""></span>
          <span class="lbl">Amazon S3</span><span class="sub">スナップショット（控え）</span>
        </div>
      </div>
      <p class="note">読み書きは全部手元で完結。S3が止まっても業務は続きます。</p>
    </div>
    <div class="pane bad">
      <div class="pane-h">キャッシュ型（Cached）＝ 本体はS3</div>
      <div class="nodes v">
        <div class="node ng">
          <span class="ico"><img src="assets/icons/gen-disk.svg" alt=""></span>
          <span class="lbl">オンプレのディスク</span><span class="sub">よく使う分だけ置く</span>
        </div>
        <div class="link ng"><span>手元にない分は取り寄せ</span><span class="l">↑</span></div>
        <div class="node ng">
          <span class="ico"><img src="assets/icons/amazon-simple-storage-service.svg" alt=""></span>
          <span class="lbl">Amazon S3</span><span class="sub">3TB の本体がここ</span>
        </div>
      </div>
      <p class="note">手元の容量は節約できますが、本体はAWS側です。</p>
    </div>
  </div>
  <p class="caption">矢印の向きに注目してください。<strong>保管型は下向き（ローカル→S3にコピーを送る）、キャッシュ型は上向き（S3から取り寄せる）</strong>。これがそのまま「どちらが本体か」を表しています。</p>

  <p>たとえるなら、<mark>保管型は教科書を全部自分の本棚に置いて、コピーを実家に送って預けておく</mark>やり方。いつでも手元からすぐ開けます。キャッシュ型は<strong>本体を図書館に預けて、手元にはよく読むページだけ置く</strong>やり方。手元にないページは、そのつど取り寄せることになります。</p>

  <h3>Storage Gatewayの3つのタイプ</h3>
  <p>選択肢に出てくる用語を整理します。何を置き換えたいのかで選ぶものが決まります。</p>
  <table>
    <tr><th style="width:26%">タイプ</th><th style="width:34%">オンプレからどう見えるか</th><th>使いどころ</th></tr>
    <tr><td>ファイルゲートウェイ</td><td>共有フォルダ（NFS／SMB）</td><td>みんなでファイルを置き場に共有したいとき</td></tr>
    <tr><td class="good">ボリュームゲートウェイ</td><td class="good">1本のディスク（iSCSI）</td><td class="good">今回。「単一の論理ボリューム」がこれ</td></tr>
    <tr><td>テープゲートウェイ（仮想テープライブラリ）</td><td>テープの棚</td><td>今あるテープバックアップの置き換え</td></tr>
  </table>
  <p class="caption">「単一の論理ボリュームとして運用する」と書かれている時点で、ボリュームゲートウェイに決まります。</p>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. キャッシュ型ボリュームを構成し、キャッシュを取得する仕組みをオンプレに置く</h3>
      <p>タイプ（ボリューム）は合っています。ただしキャッシュ型は、データの本体をS3に置いて、手元にはよく使う分だけを残すやり方です。</p>
      <p class="why">ヒント3の「ローカルをメインストレージにする」と本体の置き場所が逆です。問題文の前半だけを読むとこれを選んでしまいます。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>B. 保管型ボリュームを構成し、保管ボリュームをオンプレに置く</h3>
      <p>3TBのデータは今までどおり手元のディスクに全部あり、その控えがスナップショットとして定期的にS3へ送られます。読み書きの速さは変わらず、S3はバックアップに徹します。</p>
      <p class="why">1本のディスクとして使えて、本体はローカル、S3はバックアップ。3つのヒントを全部満たします。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. キャッシュ型＋S3 Glacier（迅速アクセス）＋スナップショットを別リージョンに保管</h3>
      <p>まずキャッシュ型な時点でAと同じ理由で外れます。さらにS3 Glacierは<strong>めったに出さないものを安くしまっておく冷凍庫</strong>で、取り出しに手間と時間がかかります。毎日使うデータの置き場ではありません。</p>
      <p class="why">本体の置き場所が逆なうえ、別リージョンへの保管も問題文が求めていない余計な条件です。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. 仮想テープライブラリーを構成し、仮想テープをS3に保存する</h3>
      <p>仮想テープライブラリは、昔ながらのテープ装置をAWSで置き換えるための仕組みです。テープは<strong>しまい込んで、必要なときに取り出すもの</strong>。順番に読む前提なので、日常的に読み書きするディスクの代わりにはなりません。</p>
      <p class="why">ヒント1の「単一の論理ボリュームとして運用する」を満たしません。</p>
    </div>
  </div>


  <div class="kotae">
    <p><strong>答え：B　Amazon S3への移転スケジュールが設定されたスナップショットを利用する保管型ボリュームをAWS上に構成して、保管ボリュームをオンプレミス環境に設定する</strong></p>
    <p class="oboe">覚え方 —— <strong>Storage Gatewayのボリュームは「データの本体がどこにあるか」だけで決まる。ローカルが本体なら保管型（Stored）、S3が本体なら キャッシュ型（Cached）。</strong>「ローカルをメイン／S3はバックアップ」と書いてあれば保管型、「ローカルの容量を減らしたい」と書いてあればキャッシュ型です。あわせて、<strong>共有フォルダならファイル、1本のディスクならボリューム、テープの置き換えならテープ</strong>の3タイプも押さえておけば、この分野は取りこぼしません。</p>
  </div>`
  },

  {
    id: 'e1q5',
    q: 'ある企業がAWS上で3層アプリケーションを開発しています。あなたはソリューションアーキテクトとして、このアプリケーションを複数のマイクロサービスに分割し、疎結合化することが求められています。その際、マイクロサービスの構築にはコンテナを利用します。また、運用要件として、AWS上でのコンテナ用コンピュートリソースの構成管理を不要にすることが求められています。この要件を満たすために、どのようなアプローチを取るべきでしょうか。',
    choices: [
      'Amazon ECSクラスターをEC2起動モードでプロビジョニングする。ECSクラスターのEC2ノードにAmazon EC2 Auto Scalingグループをアタッチし、コンテナにタスクを定義する',
      'AWS Lambda関数を作成して、マイクロサービスのコンポーネントを構成する。これらの関数をAmazon API Gatewayと統合して、スケーリングとトラフィック制御を実施する',
      'Amazon ECSクラスターをEC2起動モードでプロビジョニングする。コンテナにEC2タスクをデプロイする',
      'Amazon ECSクラスターをFargate起動モードでプロビジョニングする。コンテナにFargateタスクをデプロイする',
    ],
    answer: 3,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <p>選択肢を見ると、ECSが3つ並んでいて、そのうち2つは同じ「EC2起動モード」です。つまり問われているのは<strong>サービス選びではなく、その中の設定</strong>。問題文のどの言葉がそれを決めているのかを取り出します。</p>
  <table>
    <tr><th style="width:36%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>マイクロサービスに分割し、疎結合化</td><td>小さな部品に分けて、それぞれが独立して動くようにする</td></tr>
    <tr><td>マイクロサービスの構築には<strong>コンテナを利用します</strong></td><td>コンテナと名指しされている。関数（Lambda）ではない</td></tr>
    <tr><td>コンテナ用コンピュートリソースの<strong>構成管理を不要に</strong></td><td><mark>コンテナを動かすサーバーを、自分で用意も管理もしない</mark></td></tr>
  </table>
  <p class="caption">3行目の「コンピュートリソース」とは、コンテナが動く土台のサーバーのことです。その<strong>構成管理が要らない</strong>＝台数もOSも自分では触らない、という意味になります。</p>

  <h2>決め手は「自分で管理する範囲がどこまでか」</h2>
  <p>Amazon ECSでコンテナを動かすとき、<strong>動かす場所</strong>を2つから選びます。選び方ひとつで、自分が面倒を見る範囲がまるごと変わります。</p>

  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ EC2起動タイプ</div>
      <div class="zone ng">
        <span class="zlbl">自分で管理する範囲</span>
        <div class="nodes v">
          <div class="node ng">
            <span class="ico"><img src="assets/icons/amazon-elastic-container-service.svg" alt=""></span>
            <span class="lbl">コンテナ（タスク）</span>
          </div>
          <div class="node ng"><span class="lbl">Docker・ECSエージェント</span></div>
          <div class="node ng"><span class="lbl">OSとパッチ当て</span></div>
          <div class="node ng">
            <span class="ico"><img src="assets/icons/amazon-ec2-auto-scaling.svg" alt=""></span>
            <span class="lbl">EC2の台数調整</span>
          </div>
          <div class="node ng">
            <span class="ico"><img src="assets/icons/amazon-ec2.svg" alt=""></span>
            <span class="lbl">EC2インスタンス</span>
          </div>
        </div>
      </div>
      <p class="note">コンテナの中身より、その下の土台の世話のほうが仕事量が多くなります。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ Fargate起動タイプ</div>
      <div class="zone ok">
        <span class="zlbl">自分で管理する範囲</span>
        <div class="nodes v">
          <div class="node ok">
            <span class="ico"><img src="assets/icons/amazon-elastic-container-service.svg" alt=""></span>
            <span class="lbl">コンテナ（タスク）</span>
          </div>
        </div>
      </div>
      <div class="nodes v">
        <div class="node dim">
          <span class="ico"><img src="assets/icons/aws-fargate.svg" alt=""></span>
          <span class="lbl">Fargate</span>
          <span class="sub">土台はAWSが持つ。こちらからは見えない</span>
        </div>
      </div>
      <p class="note">「CPUとメモリをいくつ使う」と書くだけ。サーバーは1台も出てきません。</p>
    </div>
  </div>
  <p class="caption">枠の大きさの差がそのまま仕事量の差です。問題文が言う「構成管理を不要に」は、この枠を1段まで小さくしてほしい、という意味になります。</p>

  <p>たとえるなら、<mark>EC2起動タイプは工場を自分で建てて、その中で作業する</mark>やり方。建物の掃除も電気も耐震工事も自分持ちです。Fargateは<strong>貸し作業スペースを時間で借りる</strong>やり方。建物の面倒は大家さんが見てくれるので、こちらは作業そのものに集中できます。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <p>この分野は「何を動かすか」と「どこで動かすか」がごちゃ混ぜになりがちです。分けて覚えます。</p>
  <table>
    <tr><th style="width:24%">名前</th><th style="width:20%">決めるもの</th><th style="width:26%">たとえ</th><th>まちがえやすい点</th></tr>
    <tr><td>Amazon ECS／EKS</td><td>何をどれだけ動かすか</td><td>現場監督</td><td>これ自体は場所を決めていない</td></tr>
    <tr><td>EC2起動タイプ</td><td>どこで動かすか</td><td>自分で建てた工場</td><td class="bad">EC2の台数・OSの管理が自分に残る</td></tr>
    <tr><td class="good">Fargate起動タイプ</td><td class="good">どこで動かすか</td><td class="good">借りた作業スペース</td><td class="good">サービス名ではなく<strong>ECS／EKSの設定</strong></td></tr>
    <tr><td>AWS Lambda</td><td>何を動かすか</td><td>単発の作業を頼む</td><td class="bad">動かすのは関数。コンテナの置き場ではない</td></tr>
  </table>
  <p class="caption">いちばんの誤解は<strong>「Fargateは独立したサービス」と思ってしまうこと</strong>。実際はECSやEKSに対して「場所はおまかせで」と指定する起動タイプです。</p>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. ECSをEC2起動モードで構成し、EC2ノードにAuto Scalingグループをアタッチする</h3>
      <p>Auto Scalingグループは「混んできたらEC2を増やし、空いたら減らす仕組み」です。自動ではありますが、<strong>何台まで増やすか、どの種類のEC2にするか、いつ減らすかを決めるのは自分</strong>です。</p>
      <p class="why">ヒント3の「構成管理を不要に」に反します。自動化しただけで、管理する対象は残ったままです。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. Lambda関数でマイクロサービスを作り、API Gatewayと統合する</h3>
      <p>これ自体は疎結合なマイクロサービスの作り方として正しい構成です。サーバーの管理も要りません。ただしLambdaが動かすのは<strong>関数</strong>であって、コンテナではありません。</p>
      <p class="why">ヒント2で「コンテナを利用します」と名指しされています。コンテナと書かれた時点でこの選択肢は消えます。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. ECSをEC2起動モードで構成し、コンテナにEC2タスクをデプロイする</h3>
      <p>Aから台数調整の仕組みを取り除いただけで、EC2を自分で用意する点は変わりません。むしろ増減も手作業になるぶん、Aより手間が増えます。</p>
      <p class="why">Aと同じくヒント3を満たしません。EC2という言葉が出てきた時点で、土台の管理は自分に残ります。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>D. ECSをFargate起動モードで構成し、コンテナにFargateタスクをデプロイする</h3>
      <p>コンテナで作り（ヒント2）、サービスごとに独立して動かせて（ヒント1）、土台のサーバーはAWSが持つ（ヒント3）。指定するのは「このコンテナにCPUいくつ、メモリいくつ」だけです。</p>
      <p class="why">3つのヒントを全部満たすのはこれだけです。</p>
    </div>
  </div>

  <h2>「構成管理の手間」で並べると</h2>
  <table>
    <tr><th style="width:28%">やり方</th><th style="width:36%">自分がやること</th><th>判定</th></tr>
    <tr><td>D　ECS ＋ Fargate</td><td>コンテナとCPU・メモリの指定だけ</td><td class="good">要件どおり</td></tr>
    <tr><td>A　ECS ＋ EC2 ＋ Auto Scaling</td><td>EC2の種類・台数の設計、OSの更新</td><td class="bad">構成管理が残る</td></tr>
    <tr><td>C　ECS ＋ EC2</td><td>上に加えて、増減も手作業</td><td class="bad">さらに手間が増える</td></tr>
    <tr><td>B　Lambda ＋ API Gateway</td><td>関数の実装（管理は不要）</td><td class="bad">コンテナではない</td></tr>
  </table>

  <div class="kotae">
    <p><strong>答え：D　Amazon ECSクラスターをFargate起動モードでプロビジョニングする。コンテナにFargateタスクをデプロイする</strong></p>
    <p class="oboe">覚え方 —— <strong>「コンテナ」と書いてあれば ECS／EKS。そこに「サーバーを管理したくない」「構成管理は不要」が付いたら Fargate で確定。</strong>逆に<strong>「EC2起動タイプ」は、サーバーの中身まで自分で決めたいときの選択肢</strong>です。そして<strong>「サーバーレス」という言葉だけでLambdaに飛びつかないこと。</strong>問題文にコンテナと書いてあるなら、Lambdaは要件そのものを外します。</p>
  </div>`
  },

  {
    id: 'e1q6',
    q: 'ある企業は、AWSを利用してアプリケーションを運用しています。このアプリケーションのデータレイヤーにはAmazon DynamoDBテーブルを使用しています。同社ではこのアプリケーションのパフォーマンスを向上させるため、Amazon DynamoDB Accelerator（DAX）クラスターを追加したキャッシュ処理を実装しました。ソリューションアーキテクトは、このDAXクラスターが保管データを暗号化する必要があると考えていますが、現在は実施できていません。この要件を満たすソリューションはどれでしょうか。',
    choices: [
      '既存のDAXクラスターを停止してから既存のDAXクラスター設定を編集して、AWS KMSカスタマーマネージドキーを使用して、暗号化を有効化する',
      'DAXクラスターを作成し直して、暗号化を有効化する',
      '既存のDAXクラスター設定を編集して、AWS KMSカスタマーマネージドキーを使用して、保管データを暗号化する',
      '事前にAWS KMSカスタマーマネージドキーを作成する。このAWS KMSカスタマーマネージドキーを使用して、DAXクラスターを暗号化する',
    ],
    answer: 1,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <p>選択肢はどれも「暗号化する」で終わっています。違うのは<strong>いつ・どうやって</strong>だけ。つまりこの問題は、暗号化のやり方ではなく<strong>設定を変えられるタイミング</strong>を聞いています。</p>
  <table>
    <tr><th style="width:36%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>DAXクラスターを追加した</td><td>クラスターは<strong>すでに作られて動いている</strong></td></tr>
    <tr><td>保管データを暗号化する必要がある</td><td>ディスクに置かれたデータを読めなくする設定が要る</td></tr>
    <tr><td>現在は実施できていない</td><td><mark>暗号化なしで作ってしまった。あとから有効にできるかどうかが分かれ目</mark></td></tr>
  </table>

  <h2>決め手は「暗号化を決められるのは作成時だけ」</h2>
  <p>DAX（ダックス）はDynamoDBの前に置く<strong>おぼえのいい受付係</strong>です。一度聞かれた答えを手元に覚えておいて、次に同じ質問が来たら即答します。そのDAXの保管時の暗号化は、<mark>クラスターを作るときにしか決められません</mark>。あとから「やっぱり暗号化する」に切り替えるボタンは存在しません。</p>

  <div class="nodes">
    <div class="node ok">
      <span class="ico"><img src="assets/icons/gen-ssl-padlock.svg" alt=""></span>
      <span class="lbl">クラスター作成</span><span class="sub">暗号化を決められるのはここだけ</span>
    </div>
    <div class="link"><span class="l">⟶</span></div>
    <div class="node dim"><span class="lbl">稼働中</span><span class="sub">設定画面に暗号化の項目がない</span></div>
    <div class="link"><span class="l">⟶</span></div>
    <div class="node dim"><span class="lbl">停止・再起動</span><span class="sub">止めても変えられない</span></div>
    <div class="link"><span class="l">⟶</span></div>
    <div class="node dim"><span class="lbl">削除</span><span class="sub">ここまで一度も変更できない</span></div>
  </div>
  <p class="caption">緑の箱は1つだけ。作ってしまったあとは、どのタイミングでも暗号化をあとづけできません。</p>

  <p>たとえるなら、<strong>金庫つきの部屋を借りるようなもの</strong>です。金庫を入れるかどうかは<mark>契約するときに決めます</mark>。入居してから「やっぱり金庫を入れたい」と言っても、壁を壊さずに後付けはできません。引っ越すしかない、というのがDAXの暗号化です。</p>

  <h2>では、どうすればいいのか</h2>
  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ 既存のクラスターをいじる</div>
      <div class="nodes v">
        <div class="node ng">
          <span class="ico"><img src="assets/icons/res-amazon-dynamodb-amazon-dynamodb-accelerator.svg" alt=""></span>
          <span class="lbl">今のDAXクラスター</span><span class="sub">暗号化オフで作成済み</span>
        </div>
        <div class="link ng"><span>設定を編集／停止して編集</span><span class="l">↓</span></div>
        <div class="node ng"><span class="lbl">変えられない</span><span class="sub">そういう項目が存在しない</span></div>
      </div>
      <p class="note">選択肢A・C・Dは、やり方は違ってもすべてこれです。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ 暗号化ありで作り直す</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/res-amazon-dynamodb-amazon-dynamodb-accelerator.svg" alt=""></span>
          <span class="lbl">新しいDAXクラスター</span><span class="sub">作成時に暗号化オン</span>
        </div>
        <div class="link ok"><span>アプリの接続先を切り替え</span><span class="l">↓</span></div>
        <div class="node ok"><span class="lbl">古いクラスターを削除</span></div>
      </div>
      <p class="note">DAXはキャッシュ（控え）なので、中身が消えても元データはDynamoDBに残っています。</p>
    </div>
  </div>
  <p class="caption">作り直しても<strong>データは失われません</strong>。DAXが持っているのはDynamoDBのコピーだからです。ここが「作り直し」を選びやすい理由でもあります。</p>

  <h2>あとから変えられる設定・変えられない設定</h2>
  <p>AWSには「作成時にしか決められない設定」がいくつもあります。試験ではここが問われます。</p>
  <table>
    <tr><th style="width:30%">設定</th><th style="width:24%">あとから変えられるか</th><th>変えたいときの方法</th></tr>
    <tr><td>DAXクラスターの暗号化</td><td class="bad">できない</td><td>暗号化ありで作り直す</td></tr>
    <tr><td>RDSインスタンスの暗号化</td><td class="bad">できない</td><td>スナップショットを暗号化してコピーし、復元する</td></tr>
    <tr><td>EBSボリュームの暗号化</td><td class="bad">できない</td><td>スナップショットを暗号化してコピーし、新しいボリュームを作る</td></tr>
    <tr><td>EFSの暗号化</td><td class="bad">できない</td><td>暗号化ありで作り直し、データをコピーする</td></tr>
    <tr><td class="good">S3バケットの暗号化</td><td class="good">できる</td><td class="good">バケットの設定を変えるだけ</td></tr>
  </table>
  <p class="caption">S3だけ感覚が違うので注意。<strong>「箱を作るときに決める」タイプが多数派</strong>と覚えておくと迷いません。</p>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. 既存クラスターを停止してから設定を編集し、KMSキーで暗号化を有効化する</h3>
      <p>「止めてからなら設定を変えられるはず」という発想です。EC2のインスタンスタイプ変更などは実際にそうなので、つい選びたくなります。</p>
      <p class="why">DAXの暗号化は停止しても編集できません。ヒント3の「あとから有効にできるか」に対して、できないのが答えです。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>B. DAXクラスターを作成し直して、暗号化を有効化する</h3>
      <p>作成時なら暗号化を選べます。DAXの中身はDynamoDBのコピーなので、作り直してもデータは失われません。アプリの接続先を新しいクラスターに向け直せば終わりです。</p>
      <p class="why">「作成時にしか決められない」という制約に対して、正面から答えている唯一の選択肢です。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. 既存クラスターの設定を編集して、KMSキーで保管データを暗号化する</h3>
      <p>Aから「停止する」を取り除いただけで、やろうとしていることは同じです。動いたまま設定を変えようとしています。</p>
      <p class="why">Aと同じ理由で成立しません。既存クラスターに暗号化の設定項目そのものがありません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. 事前にKMSキーを作成し、そのキーでDAXクラスターを暗号化する</h3>
      <p>鍵を先に用意する手順自体は正しいものです。ただしこの選択肢は<strong>既存のクラスターに対して鍵を適用する</strong>と言っています。鍵があっても、適用するタイミングがもうありません。</p>
      <p class="why">鍵の準備は問題の本質ではありません。ヒント3の「作成済みかどうか」を見落とした選択肢です。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：B　DAXクラスターを作成し直して、暗号化を有効化する</strong></p>
    <p class="oboe">覚え方 —— <strong>「暗号化されていない既存リソースを暗号化したい」と来たら、まず「作成時にしか決められないのでは？」と疑う。</strong>DAX・RDS・EBS・EFSは作成時のみで、答えは<strong>作り直すか、スナップショットを暗号化してコピーするか</strong>の2択になります。逆に<strong>S3はあとから変更できる</strong>数少ない例外です。選択肢に「設定を編集して有効化」が並んでいたら、それらは全部ダミーだと思って構いません。</p>
  </div>`
  },

  {
    id: 'e1q7',
    q: 'あなたはソリューションアーキテクトとして、AWSを活用してEC2インスタンス上にデータベースサーバーを設定する役割を担っています。このデータベースには非常に重要な情報を保存するため、必要なパッチをダウンロードする場合を除き、インターネットから直接にデータベースサーバーに接続されないようにする必要があります。この要件を満たすためのAWSネットワーク設定はどれでしょうか。',
    choices: [
      'データベースをパブリックサブネット内に構築して、このプライベートサブネットのルートテーブルにインターネットゲートウェイへのルートを設定する',
      'データベースをパブリックサブネット内に構築して、このプライベートサブネットのルートテーブルにNATゲートウェイへのルートを設定する',
      'データベースをプライベートサブネット内に構築して、このプライベートサブネットのルートテーブルにインターネットゲートウェイへのルートを設定する',
      'データベースをプライベートサブネット内に構築して、このプライベートサブネットのルートテーブルにNATゲートウェイへのルートを設定する',
    ],
    answer: 3,
    explain: `
  <h2>まず、問題文の中の「2つのヒント」</h2>
  <p>選択肢は「どのサブネットに置くか」×「どこへのルートを引くか」の2×2、つまり4通りの組み合わせです。それぞれを問題文のどの言葉が決めているのかを取り出します。</p>
  <table>
    <tr><th style="width:40%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>インターネットから直接にデータベースサーバーに接続されないようにする</td><td>外から入ってこられない場所に置く → <strong>プライベートサブネット</strong></td></tr>
    <tr><td>必要なパッチをダウンロードする場合を除き</td><td><mark>外に出る通信だけは必要。入る通信は要らない</mark> → 片道だけ通す仕組み</td></tr>
  </table>
  <p class="caption">「〜する場合を除き」という書き方に注意します。これは<strong>例外を1つだけ認めている</strong>という意味で、そこが正解を分けます。</p>

  <h2>決め手は「通信の向き」</h2>
  <p>外とつながる出口には2種類あります。名前は似ていますが、通す向きがまったく違います。</p>

  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ インターネットゲートウェイ（IGW）</div>
      <div class="nodes v">
        <div class="node ng">
          <span class="ico"><img src="assets/icons/amazon-ec2.svg" alt=""></span>
          <span class="lbl">データベース</span>
        </div>
        <div class="link ng"><span>行きも帰りも通る</span><span class="l">↕</span></div>
        <div class="node ng">
          <span class="ico"><img src="assets/icons/res-amazon-vpc-internet-gateway.svg" alt=""></span>
          <span class="lbl">インターネットゲートウェイ</span><span class="sub">出入り自由の表玄関</span>
        </div>
        <div class="link ng"><span class="l">↕</span></div>
        <div class="node ng">
          <span class="ico"><img src="assets/icons/gen-internet.svg" alt=""></span>
          <span class="lbl">インターネット</span><span class="sub">外から入ってこられる</span>
        </div>
      </div>
      <p class="note">パッチは取れますが、外から直接つなげる状態になります。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ NATゲートウェイ</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/amazon-ec2.svg" alt=""></span>
          <span class="lbl">データベース</span>
        </div>
        <div class="link ok"><span>行きだけ通る</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/res-amazon-vpc-nat-gateway.svg" alt=""></span>
          <span class="lbl">NATゲートウェイ</span><span class="sub">代わりに買い物へ行く人</span>
        </div>
        <div class="link ok"><span class="l">↓</span></div>
        <div class="node">
          <span class="ico"><img src="assets/icons/gen-internet.svg" alt=""></span>
          <span class="lbl">インターネット</span><span class="sub">DBの居場所は見えない</span>
        </div>
      </div>
      <p class="note">パッチは取れて、外から入ってくることはできません。</p>
    </div>
  </div>
  <p class="caption">矢印に注目してください。<strong>IGWは両向き（↕）、NATゲートウェイは片道（↓）</strong>。この違いだけで答えが決まります。</p>

  <p>たとえるなら、<mark>NATゲートウェイは「代わりに買い物に行ってくれる人」</mark>です。データベースは店に出かけません。必要なものをNATに頼み、NATが買って持ち帰ります。店から見えるのはNATだけなので、<strong>店員はデータベースの住所を知りません</strong>。一方インターネットゲートウェイは表玄関を開けっぱなしにするようなもので、こちらから出られる代わりに、誰でも訪ねてこられます。</p>

  <h3>全体の形はこうなります</h3>
  <div class="zone">
    <span class="zlbl"><img src="assets/icons/group-virtual-private-cloud-vpc.svg" alt="">VPC（自社専用のネットワーク）</span>
    <div class="zone">
      <span class="zlbl"><img src="assets/icons/group-public-subnet.svg" alt="">パブリックサブネット（表通りに面した場所）</span>
      <div class="zrow">
        <div class="node">
          <span class="ico"><img src="assets/icons/res-amazon-vpc-nat-gateway.svg" alt=""></span>
          <span class="lbl">NATゲートウェイ</span><span class="sub">ここに置く</span>
        </div>
      </div>
    </div>
    <div class="zone">
      <span class="zlbl"><img src="assets/icons/group-private-subnet.svg" alt="">プライベートサブネット（建物の奥の部屋）</span>
      <div class="zrow">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/amazon-ec2.svg" alt=""></span>
          <span class="lbl">データベースサーバー</span><span class="sub">外から到達できない</span>
        </div>
      </div>
    </div>
  </div>
  <p class="caption">NATゲートウェイ自身はパブリックサブネットに置きます。外と話せる場所にいないと、代わりに買い物に行けないからです。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <p>ここが最大の落とし穴です。<strong>「パブリック」「プライベート」はサブネットの設定項目ではありません。</strong></p>
  <table>
    <tr><th style="width:28%">名前</th><th style="width:34%">正体</th><th>まちがえやすい点</th></tr>
    <tr><td>パブリックサブネット</td><td>ルートテーブルに<strong>IGWへのルートがある</strong>サブネット</td><td class="bad">そういう名前の設定があるわけではない。ルートの中身で決まる</td></tr>
    <tr><td class="good">プライベートサブネット</td><td class="good">IGWへのルートが<strong>ない</strong>サブネット</td><td class="good">NATへのルートは持てる</td></tr>
    <tr><td>インターネットゲートウェイ</td><td>VPCと外をつなぐ出入口</td><td class="bad">これを向けた時点でパブリックサブネットになる</td></tr>
    <tr><td>NATゲートウェイ</td><td>内から外への通信だけを代行する</td><td>自分はパブリックサブネットに置く必要がある</td></tr>
  </table>
  <p class="caption">つまり<strong>「プライベートサブネットにIGWへのルートを引く」と書いた瞬間、それはもうプライベートサブネットではありません。</strong>言葉として矛盾しています。</p>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. パブリックサブネットに構築し、IGWへのルートを設定する</h3>
      <p>データベースを表通りに面した場所に置き、玄関も開けるという構成です。パッチは取れますが、外からも直接つなげます。</p>
      <p class="why">ヒント1の「インターネットから直接接続されないようにする」を真正面から破っています。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. パブリックサブネットに構築し、NATゲートウェイへのルートを設定する</h3>
      <p>通信の向きは片道で正しいのですが、置き場所がパブリックサブネットのままです。パブリックサブネットにいる以上、そこには別途IGWへのルートが存在します。</p>
      <p class="why">ヒント1の置き場所が違います。DBは奥の部屋に置かなければいけません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. プライベートサブネットに構築し、IGWへのルートを設定する</h3>
      <p>置き場所は正しいのですが、そこに表玄関への道をつないでしまっています。上の表のとおり、<strong>IGWへのルートを引いた時点でそのサブネットはパブリックサブネットです</strong>。</p>
      <p class="why">名前だけプライベートで中身はパブリックになり、ヒント1を満たしません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>D. プライベートサブネットに構築し、NATゲートウェイへのルートを設定する</h3>
      <p>データベースは奥の部屋にいて、外からは到達できません。それでいてパッチを取りにいくときはNATが代わりに出向いてくれます。</p>
      <p class="why">「入れない」と「出られる」を両立できるのはこの組み合わせだけです。2つのヒントを同時に満たします。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：D　データベースをプライベートサブネット内に構築して、このプライベートサブネットのルートテーブルにNATゲートウェイへのルートを設定する</strong></p>
    <p class="oboe">覚え方 —— <strong>「外から入れたくない、でも外には出たい」＝ プライベートサブネット ＋ NATゲートウェイ。これがAWSの定番の形です。</strong>判断は2段階でやります。まず<strong>置き場所</strong>（外から接続されたくない → プライベート）、次に<strong>出口</strong>（外に出る必要があるか → あればNAT、なければ出口なし）。そして<strong>IGWは両向き、NATは片道</strong>。この向きの違いさえ押さえれば、VPCの問題は形が変わっても解けます。</p>
  </div>`
  },

  {
    id: 'e1q8',
    q: 'ある企業では、AWSを利用して多くのウェブサイトとアプリケーションを運営しています。これらのウェブアプリケーションからは、毎日1TBを超えるクリックストリームデータが収集されており、ユーザーの行動データ解析に活用されています。現在、ソリューションアーキテクトは、これらの大量のデータを保存して、効果的に分析するためのプラットフォームを構築中です。このデータ分析のために、ソリューションアーキテクトが採用すべきアプローチは何でしょうか。',
    choices: [
      'AWS Data Pipelineを構成して、Amazon S3バケットにデータを保存し、そのデータをAmazon EMRクラスターで分析する',
      'AWS Data Pipelineを構成して、Amazon S3バケットにデータを保存する。Amazon Redshift Spectrumでバケット内のデータを分析する',
      'Amazon Kinesis Data Streamsでデータを収集して、Amazon Data Firehoseを介して、S3バケットにデータを保存する。オブジェクトがS3バケットに格納された際にS3イベント通知を実行してAWS Lambda関数を起動してデータ分析を行う',
      'Amazon Kinesis Data Streamsでデータを収集して、Amazon Data Firehoseを介して、S3バケットにデータを保存する。Amazon Redshift Spectrumでバケット内のデータを分析する',
    ],
    answer: 3,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <p>この問題は<strong>「集める側」と「分析する側」の2つを別々に判断</strong>すると一気にほどけます。選択肢はその2つの組み合わせでできています。</p>
  <table>
    <tr><th style="width:36%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>クリックストリームデータ</td><td><mark>ユーザーがクリックするたびに発生する。止まらずに流れ続けるデータ</mark></td></tr>
    <tr><td>毎日1TBを超える</td><td>とても多い。全部をデータベースに取り込むのは重すぎる</td></tr>
    <tr><td>保存して、効果的に分析する</td><td>置き場所（保存）と分析する道具の<strong>両方</strong>が要る</td></tr>
  </table>
  <p class="caption">クリックストリームとは、ユーザーがサイトの中でどこをクリックしたかの記録です。人が操作するたびに1件ずつ生まれるので、水道のように<strong>流れ続けます</strong>。</p>

  <h2>決め手は「まとめて運ぶか、流れてくるそばから受けるか」</h2>
  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ AWS Data Pipeline（まとめて運ぶ）</div>
      <div class="nodes v">
        <div class="node ng"><span class="lbl">データが発生し続ける</span></div>
        <div class="link ng"><span>次のお迎えまで待つ</span><span class="l">↓</span></div>
        <div class="node ng">
          <span class="ico"><img src="assets/icons/gen-gear.svg" alt=""></span>
          <span class="lbl">決まった時刻にまとめて運搬</span><span class="sub">1日1回など</span>
        </div>
      </div>
      <p class="note">1日分ためてから動くので、分析はいつも昨日の話になります。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ Kinesis Data Streams（流れを受け止める）</div>
      <div class="nodes v">
        <div class="node ok"><span class="lbl">データが発生し続ける</span></div>
        <div class="link ok"><span>発生したそばから</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/amazon-kinesis-data-streams.svg" alt=""></span>
          <span class="lbl">流れてくる端から受け取る</span><span class="sub">たまらない・落とさない</span>
        </div>
      </div>
      <p class="note">1日1TBが途切れず来ても、受け止め続けられます。</p>
    </div>
  </div>
  <p class="caption">クリックストリームは蛇口から出続ける水です。<strong>Data Pipelineはバケツを1日1回汲みに行く人、Kinesisは蛇口にホースをつなぐ</strong>やり方。流れ続けるものには、ホースをつなぐほうが合っています。</p>

  <p>もうひとつのたとえです。<mark>Data Pipelineは学校の給食の配膳</mark>で、決まった時間にまとめて運びます。Kinesisは<strong>ベルトコンベア</strong>で、乗ったものが次々に流れていきます。今回は「毎日1TBが休みなく発生する」ので、ベルトコンベアの出番です。</p>

  <h3>正解の並び</h3>
  <div class="nodes">
    <div class="node">
      <span class="ico"><img src="assets/icons/gen-users.svg" alt=""></span>
      <span class="lbl">ユーザーの<br>クリック</span>
    </div>
    <div class="link"><span class="l">⟶</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/amazon-kinesis-data-streams.svg" alt=""></span>
      <span class="lbl">Kinesis<br>Data Streams</span><span class="sub">受け止める</span>
    </div>
    <div class="link"><span class="l">⟶</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/amazon-data-firehose.svg" alt=""></span>
      <span class="lbl">Data Firehose</span><span class="sub">運んで書き込む</span>
    </div>
    <div class="link"><span class="l">⟶</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/amazon-simple-storage-service.svg" alt=""></span>
      <span class="lbl">Amazon S3</span><span class="sub">ためる</span>
    </div>
    <div class="link"><span class="l">⟶</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/amazon-redshift.svg" alt=""></span>
      <span class="lbl">Redshift<br>Spectrum</span><span class="sub">そのまま分析</span>
    </div>
  </div>
  <p class="caption">Redshift Spectrumは<strong>S3に置いたデータを、取り込まずにそのままSQLで分析</strong>できます。1TBを毎日どこかに引っ越しさせる必要がありません。</p>

  <h2>まぎらわしい6つを区別する</h2>
  <p>名前が似ていたり、どれも「データを扱う」ように見えたりします。担当を分けて覚えます。</p>
  <table>
    <tr><th style="width:26%">名前</th><th style="width:16%">担当</th><th style="width:26%">たとえ</th><th>できないこと</th></tr>
    <tr><td class="good">Kinesis Data Streams</td><td class="good">集める</td><td class="good">ベルトコンベア</td><td class="good">流れ続けるデータを受け止める専門</td></tr>
    <tr><td class="good">Data Firehose</td><td class="good">運ぶ</td><td class="good">宅配便</td><td class="good">受け取ったデータをS3などへ自動で届ける</td></tr>
    <tr><td>AWS Data Pipeline</td><td>運ぶ</td><td>時間割どおりの配膳</td><td class="bad">決まった時刻に動く。流れ続けるデータ向きではない</td></tr>
    <tr><td class="good">Redshift Spectrum</td><td class="good">分析する</td><td class="good">棚の本をその場で読む</td><td class="good">S3のデータを取り込まずSQLで分析できる</td></tr>
    <tr><td>Amazon EMR</td><td>分析する</td><td>自分で組み立てる工場</td><td class="bad">できるが、クラスターの管理が自分に残る</td></tr>
    <tr><td>AWS Lambda</td><td>処理する</td><td>短距離ランナー</td><td class="bad">15分まで。ファイル1個ずつの処理で、全体の集計には向かない</td></tr>
  </table>
  <p class="caption">「集める・運ぶ・ためる・分析する」の4役に分けると、選択肢がどこを埋めているかが見えます。</p>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. Data PipelineでS3に保存し、EMRクラスターで分析する</h3>
      <p>集める側がバッチ（決まった時刻にまとめて運ぶ）になっています。さらにEMRは分析用のサーバー群を自分で組んで管理する仕組みで、台数もソフトの設定も自分持ちです。</p>
      <p class="why">ヒント1の「流れ続けるデータ」に集め方が合いません。分析側も手間が大きい選び方です。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. Data PipelineでS3に保存し、Redshift Spectrumで分析する</h3>
      <p>分析する側は正解と同じで、ここは正しい選択です。落ちているのは集める側だけです。</p>
      <p class="why">Aと同じくヒント1に反します。<strong>半分だけ正しい選択肢</strong>で、いちばん迷わせてきます。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. Kinesis ＋ Firehose でS3に保存し、S3イベント通知でLambdaを起動して分析する</h3>
      <p>集める側は正解と同じです。問題は分析側で、Lambdaは<strong>ファイルが1個届くたびに、その1個を処理する</strong>仕組みです。しかも1回15分まで。</p>
      <p class="why">ヒント3の「効果的に分析する」を満たしません。1TB全体を横断して集計することができません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>D. Kinesis ＋ Firehose でS3に保存し、Redshift Spectrumで分析する</h3>
      <p>流れ続けるデータをKinesisが受け止め、Firehoseが自動でS3へ届け、Redshift SpectrumがS3のデータをそのままSQLで分析します。データを引っ越しさせずに済みます。</p>
      <p class="why">集める側も分析する側も、3つのヒントすべてに合っています。</p>
    </div>
  </div>

  <h2>「集める側」「分析する側」で並べると</h2>
  <table>
    <tr><th style="width:14%">選択肢</th><th style="width:30%">集める</th><th style="width:30%">分析する</th><th>判定</th></tr>
    <tr><td>A</td><td class="bad">バッチ</td><td class="bad">EMR（管理が重い）</td><td class="bad">両方だめ</td></tr>
    <tr><td>B</td><td class="bad">バッチ</td><td class="good">Redshift Spectrum</td><td class="bad">集め方がだめ</td></tr>
    <tr><td>C</td><td class="good">Kinesis</td><td class="bad">Lambda（全体集計できない）</td><td class="bad">分析がだめ</td></tr>
    <tr><td class="good">D</td><td class="good">Kinesis</td><td class="good">Redshift Spectrum</td><td class="good">両方そろう</td></tr>
  </table>
  <p class="caption">4択が2×2の表になっていることに気づけば、<strong>半分ずつ正しい選択肢のワナ</strong>にかかりません。</p>

  <div class="kotae">
    <p><strong>答え：D　Amazon Kinesis Data Streamsでデータを収集して、Amazon Data Firehoseを介して、S3バケットにデータを保存する。Amazon Redshift Spectrumでバケット内のデータを分析する</strong></p>
    <p class="oboe">覚え方 —— <strong>止まらず流れ続けるデータ（クリックストリーム・IoT・ログ・動画）と来たら、集めるのはKinesis。</strong>「決まった時刻に」「1日1回」と書いてあればバッチ（Data PipelineやGlue）です。分析側は<strong>「S3に置いたままSQLで分析」＝ Redshift Spectrum か Athena</strong>。そして<strong>Lambdaは1ファイルずつの処理役であって、分析基盤ではありません。</strong>この3つの線引きで、データ分析の問題は形が変わっても切り分けられます。</p>
  </div>`
  },

  {
    id: 'e1q9',
    q: 'ある企業では、AWSの東京リージョンにおいてEC2インスタンスにホストされたWEBアプリケーションを運営しています。あなたはソリューションアーキテクトとして、これらのWEBアプリケーションをシンガポールリージョンおよびシドニーリージョンに複製し、アプリケーションを拡張しようとしています。このプロセスにおいては、地理的に近いユーザーに対する最適な言語選択とルーティング制御が求められます。ユーザーに対して最適な言語選択とルーティング制御を実現するためには、どのようなソリューションが必要でしょうか。',
    choices: [
      'Route53において位置情報ルーティングを設定して、ユーザーの位置情報に応じた言語表示を自動で実施する',
      'NLBを利用して全リージョンのロードバランシングを実施して、ロードバランサーのトラフィック分散地域に応じて言語表示を自動で実施する',
      'Route53で地理的近接性ルーティングを設定して、ユーザーの位置情報に応じた言語表示を自動で実施する',
      'ALBを利用して全リージョンのロードバランシングを実施して、ロードバランサーのトラフィック分散地域に応じて言語表示を自動で実施する',
    ],
    answer: 0,
    explain: `
  <h2>まず、問題文の中の「2つのヒント」</h2>
  <p>選択肢はRoute 53が2つ、ロードバランサーが2つ。まず<strong>道具の種類</strong>を決めて、次に<strong>Route 53の中のどの方式か</strong>を決める、という2段階で解きます。</p>
  <table>
    <tr><th style="width:36%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>3つのリージョンに複製し、ルーティング制御</td><td>リージョンをまたいで振り分ける必要がある → ロードバランサーの守備範囲外</td></tr>
    <tr><td>最適な<strong>言語</strong>選択</td><td><mark>言語は「どの国から来たか」で決まる。「どこから近いか」では決まらない</mark></td></tr>
  </table>
  <p class="caption">「地理的に近いユーザーに対する」という前置きがあるので、つい「近さ」で選びたくなります。でも実際に求められているのは<strong>言語の出し分け</strong>です。</p>

  <h2>決め手は「国で分けるか、距離で分けるか」</h2>
  <p>Route 53（ルートフィフティスリー）はAWSの<strong>電話帳</strong>です。「このサイトを見たい」と言われたとき、どのリージョンの住所を教えるかを決めます。その決め方にいくつも種類があり、今回はよく似た2つで迷わせてきます。</p>

  <div class="vs">
    <div class="pane good">
      <div class="pane-h">◯ 位置情報ルーティング（国で分ける）</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/gen-user.svg" alt=""></span>
          <span class="lbl">アクセスしてきた人</span>
        </div>
        <div class="link ok"><span>どの国から？</span><span class="l">↓</span></div>
        <div class="node ok"><span class="lbl">日本</span></div>
        <div class="link ok"><span class="l">↓</span></div>
        <div class="node ok"><span class="lbl">日本語のサイトへ</span><span class="sub">国と言語が一致する</span></div>
      </div>
      <p class="note">国境で線を引くので、言語や法律の出し分けにそのまま使えます。</p>
    </div>
    <div class="pane bad">
      <div class="pane-h">✕ 地理的近接性ルーティング（距離で分ける）</div>
      <div class="nodes v">
        <div class="node ng">
          <span class="ico"><img src="assets/icons/gen-user.svg" alt=""></span>
          <span class="lbl">アクセスしてきた人</span>
        </div>
        <div class="link ng"><span>どこから一番近い？</span><span class="l">↓</span></div>
        <div class="node ng"><span class="lbl">シンガポールリージョン</span></div>
        <div class="link ng"><span class="l">↓</span></div>
        <div class="node ng"><span class="lbl">言語は決められない</span><span class="sub">近い国＝同じ言語とは限らない</span></div>
      </div>
      <p class="note">国境を無視して距離で線を引くので、言語の判断材料になりません。</p>
    </div>
  </div>
  <p class="caption">どちらも「ユーザーのいる場所」を見ますが、<strong>見たあとの分け方が違います</strong>。位置情報は国名で、地理的近接性は距離で分けます。</p>

  <p>たとえるなら、<mark>位置情報ルーティングは「パスポートを見て案内する係」</mark>です。日本のパスポートなら日本語の窓口へ、と迷いません。地理的近接性は<strong>「いま立っている場所から一番近い窓口を教える係」</strong>。近い窓口には案内できますが、その人が何語を話すかは分かりません。今回ほしいのはパスポートを見る係のほうです。</p>

  <h2>Route 53のルーティング方式を区別する</h2>
  <p>試験ではここが繰り返し問われます。<strong>「何を見て決めるか」</strong>の列が判断の決め手になります。</p>
  <table>
    <tr><th style="width:24%">方式</th><th style="width:26%">何を見て決めるか</th><th>こう書かれていたら選ぶ</th></tr>
    <tr><td class="good">位置情報</td><td class="good">ユーザーの<strong>国・地域</strong></td><td class="good">言語を出し分けたい／国ごとに違う内容／法律で国を分ける</td></tr>
    <tr><td>地理的近接性</td><td>ユーザーとリソースの<strong>距離</strong></td><td class="bad">特定の拠点に寄せる割合を調整したい（バイアス）</td></tr>
    <tr><td>レイテンシー</td><td>実際の<strong>応答の速さ</strong></td><td class="bad">とにかく速く表示したい</td></tr>
    <tr><td>加重（Weighted）</td><td>あらかじめ決めた<strong>割合</strong></td><td class="bad">新バージョンに10％だけ流したい</td></tr>
    <tr><td>フェイルオーバー</td><td>正常かどうかの<strong>健康チェック</strong></td><td class="bad">普段はA、壊れたらBに切り替えたい</td></tr>
  </table>
  <p class="caption">まぎらわしいのは<strong>「近さ」で選ぶものが3つある</strong>こと。位置情報＝国、地理的近接性＝距離、レイテンシー＝速さ。<strong>言語と来たら国</strong>です。</p>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>A. Route 53の位置情報ルーティングを設定する</h3>
      <p>アクセス元の国を判定して、その国に対応したリージョンへ案内します。日本からなら東京、オーストラリアからならシドニー、という具合です。国が分かるので、言語の出し分けにそのまま使えます。</p>
      <p class="why">ヒント1のリージョンまたぎの振り分けと、ヒント2の言語判定を同時に満たします。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. NLBで全リージョンのロードバランシングを実施する</h3>
      <p>NLB（ネットワークロードバランサー）はリージョンの中で、複数のサーバーに通信を振り分ける係です。<strong>リージョンをまたいで振り分けることはできません。</strong>さらにNLBは通信の中身を見ないため、言語の判断もできません。</p>
      <p class="why">ヒント1のリージョンまたぎに対応できません。道具の選択そのものが違います。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. Route 53の地理的近接性ルーティングを設定する</h3>
      <p>道具はRoute 53で合っています。ただし決め方が距離なので、国境をまたいで割り振られます。シンガポールに近い国の人はシンガポール版に案内されますが、<strong>その人が何語を話すかは分かりません</strong>。</p>
      <p class="why">ヒント2の「言語」を決められません。<strong>いちばん惜しい選択肢</strong>で、ここで迷うと落とします。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. ALBで全リージョンのロードバランシングを実施する</h3>
      <p>ALB（アプリケーションロードバランサー）は通信の中身まで見られるので、NLBよりは器用です。それでも<strong>担当するのは1つのリージョンの中だけ</strong>という点は変わりません。</p>
      <p class="why">Bと同じくヒント1を満たしません。中身を見られるかどうか以前に、届く範囲が足りません。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：A　Route53において位置情報ルーティングを設定して、ユーザーの位置情報に応じた言語表示を自動で実施する</strong></p>
    <p class="oboe">覚え方 —— <strong>リージョンをまたぐ振り分けはRoute 53の仕事。ロードバランサー（ALB・NLB）はリージョンの中だけ。</strong>この線引きで選択肢は必ず半分に減ります。そのうえで<strong>「言語」「国ごとの表示」「法律で国を分ける」＝ 位置情報ルーティング</strong>、<strong>「速さ」＝ レイテンシー</strong>、<strong>「特定拠点への寄せ具合を調整」＝ 地理的近接性</strong>。<strong>言語と書いてあったら国で決める</strong>、とだけ覚えておけば十分です。</p>
  </div>`
  },

  {
    id: 'e1q10',
    q: 'ある企業が、パブリックドメインの画像データを提供するアプリケーションを開発しています。このアプリケーションはAmazon EC2インスタンス上で運用されており、画像コンテンツはAmazon S3バケットの標準ストレージクラスに保存されています。S3バケットにはパブリックアクセスブロックを有効にしてバケットポリシーによる制御が設定されています。アプリケーションは、AWS外部のユーザーのリクエストに応じて特定の画像を一時的に表示する必要があり、その際には特定のユーザーに対してのみ一時的な画像の利用許可を設定することが求められます。この要件に応じて、どのようなソリューションを導入する必要がありますか。',
    choices: [
      'Amazon S3の期限付きの事前署名付きURLを利用して、画像コンテンツをユーザーに配信する',
      'CloudFrontディストリビューションによって画像配信を実施することで、画像コンテンツを利用できるユーザー範囲を限定する',
      'Amazon S3にAWS KMSの暗号化キーを適用して期限付きで、画像コンテンツを暗号化する。ユーザーは復号キーを利用して、画像にアクセスする',
      '画像保存先をEFSによるファイル共有に切り替えることで、期限付きで画像コンテンツを共有する仕組みを構成する',
    ],
    answer: 0,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <p>条件が細かく書かれていますが、必要なものは3つだけです。この3つを同時に満たす仕組みを探します。</p>
  <table>
    <tr><th style="width:38%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>パブリックアクセスブロックを有効にしている</td><td>バケットは閉じたまま。<strong>公開設定にはできない</strong></td></tr>
    <tr><td>AWS外部のユーザー</td><td>AWSのアカウントを持っていない人。IAMの権限は渡せない</td></tr>
    <tr><td>特定のユーザーに一時的に表示</td><td><mark>渡した相手だけ、決めた時間だけ開ける仕組みが要る</mark></td></tr>
  </table>
  <p class="caption">「パブリックドメインの画像」とあるので公開してよさそうに見えますが、<strong>バケットは閉じたまま運用する</strong>と明記されています。ここを読み違えないようにします。</p>

  <h2>決め手は「鍵つきの入場券を発行する」こと</h2>
  <p>事前署名付きURL（じぜんしょめいつきURL）は、<strong>期限が書き込まれた特別なURL</strong>です。アプリがそのURLを作って渡すと、受け取った人はその1枚で、その画像だけを、決められた時間だけ開けます。</p>

  <div class="nodes">
    <div class="node">
      <span class="ico"><img src="assets/icons/gen-user.svg" alt=""></span>
      <span class="lbl">外部のユーザー</span><span class="sub">「この画像が見たい」</span>
    </div>
    <div class="link"><span>①たのむ</span><span class="l">⟶</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/amazon-ec2.svg" alt=""></span>
      <span class="lbl">アプリ（EC2）</span><span class="sub">本人か確認して発行</span>
    </div>
    <div class="link ok"><span>②期限つきURLを渡す</span><span class="l">⟶</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/gen-ssl-padlock.svg" alt=""></span>
      <span class="lbl">署名付きURL</span><span class="sub">「18時まで有効」と書いてある</span>
    </div>
    <div class="link ok"><span>③そのURLで直接</span><span class="l">⟶</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/amazon-simple-storage-service.svg" alt=""></span>
      <span class="lbl">Amazon S3</span><span class="sub">閉じたまま。この1枚だけ通す</span>
    </div>
  </div>
  <p class="caption">バケットの設定は何も変えません。<strong>扉は閉じたまま、券を持っている人だけを通します。</strong></p>

  <h3>期限が切れたらどうなるか</h3>
  <div class="day">
    <div class="strip">
      <span class="on"></span><span class="on"></span><span></span><span></span><span></span><span></span>
      <span></span><span></span><span></span><span></span><span></span><span></span>
      <span></span><span></span><span></span><span></span><span></span><span></span>
      <span></span><span></span><span></span><span></span><span></span><span></span>
    </div>
    <div class="scale"><span>発行</span><span>6時間後</span><span>12時間後</span><span>18時間後</span><span>24時間後</span></div>
    <p class="caption">赤いところだけURLが使えます。時間が過ぎると、同じURLを開いてもエラーになります。<strong>こちらから取り消し作業をしなくても、勝手に無効になる</strong>のが利点です。</p>
  </div>

  <p>たとえるなら、<mark>事前署名付きURLは「時間の書かれた入場券」</mark>です。受付（アプリ）が本人を確かめて「18時まで有効」の券を渡します。券を持っている人だけが入れて、時間が過ぎれば自動で無効。<strong>建物の入口をずっと開け放つ必要はありません。</strong></p>

  <h2>まぎらわしい4つを区別する</h2>
  <p>どれも「アクセスを制限する」ように聞こえますが、守っているものが違います。</p>
  <table>
    <tr><th style="width:26%">名前</th><th style="width:26%">何をするもの</th><th>今回に合わない理由</th></tr>
    <tr><td class="good">S3 事前署名付きURL</td><td class="good">期限つきで、その1つのオブジェクトだけ許可</td><td class="good">AWSの外の人にそのまま渡せる。これが答え</td></tr>
    <tr><td>CloudFront 署名付きURL</td><td>CDN経由の配信を期限つきで許可</td><td class="bad">大量配信や地域制限が要るときの道具。今回は過剰</td></tr>
    <tr><td>バケットポリシー</td><td>AWSアカウントやIAM単位で許可</td><td class="bad">AWSの外の一般ユーザーには渡せない</td></tr>
    <tr><td>AWS KMS</td><td>データを暗号化して読めなくする</td><td class="bad">アクセスを許可する仕組みではない</td></tr>
  </table>
  <p class="caption">押さえどころは<strong>「暗号化」と「アクセス許可」は別物</strong>だということ。暗号化は中身を読めなくするだけで、誰が取りに来られるかは変えません。</p>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>A. S3の期限付き事前署名付きURLで画像を配信する</h3>
      <p>アプリがリクエストを受けたときにURLを1本発行し、そのユーザーに渡します。バケットは閉じたまま、渡した相手だけが、決めた時間だけアクセスできます。</p>
      <p class="why">「閉じたまま」「AWS外部の人」「特定の相手に一時的に」の3つを同時に満たします。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. CloudFrontディストリビューションで配信し、利用できるユーザー範囲を限定する</h3>
      <p>CloudFront（クラウドフロント）は世界中に配置された<strong>配送センター</strong>です。同じ画像を大量の人に速く届けるための仕組みで、主な目的は配信を速くすることです。</p>
      <p>CloudFrontにも署名付きURLの仕組みはありますが、この選択肢は「ディストリビューションを作れば範囲が限定される」と言っているだけです。<strong>ディストリビューションを作っただけでは期限も相手も絞れません。</strong></p>
      <p class="why">ヒント3の「特定の相手に一時的に」を実現する手段が書かれていません。仕組みを足さないと成立しない選択肢です。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. KMSの暗号化キーで期限付きに暗号化し、ユーザーが復号キーで取得する</h3>
      <p>暗号化は<strong>中身を読めなくする</strong>仕組みです。取りに来ること自体を止めるものではありません。しかもこの案では、外部のユーザー一人ひとりに復号キーを配ることになります。</p>
      <p class="why">ヒント1のとおりバケットは閉じているので、そもそも取りに来られません。さらに鍵を配る運用は、一時的な公開にはまったく向きません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. 保存先をEFSに切り替えて、期限付きで共有する</h3>
      <p>EFS（イーエフエス）はVPCの中のサーバーどうしで使う共有フォルダです。社内のファイルサーバーのようなもので、<strong>インターネット越しに一般ユーザーが開くための場所ではありません</strong>。</p>
      <p class="why">ヒント2の「AWS外部のユーザー」に届きません。保存先を変える話で、要件そのものと噛み合っていません。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：A　Amazon S3の期限付きの事前署名付きURLを利用して、画像コンテンツをユーザーに配信する</strong></p>
    <p class="oboe">覚え方 —— <strong>「AWSの外の人に」「一時的に」「特定のファイルだけ」と3つそろったら、S3の事前署名付きURL。</strong>バケットは閉じたままでよい、というのがこの仕組みの一番の価値です。区別のコツは2つ。<strong>CloudFrontの署名付きURLが答えになるのは、CDN経由の大量配信や地域制限が問題文に出てきたとき</strong>。そして<strong>暗号化（KMS）はアクセス制御ではありません。</strong>「誰が取りに来られるか」を聞かれているのに暗号化を選ぶと、必ず外します。</p>
  </div>`
  },

  {
    id: 'e1q11',
    q: 'あなたはソリューションアーキテクトとして、AWS上でアプリケーションの開発およびテストを行っています。その際は、作業効率を高めるために、AWS環境のインフラ構成を一括にデプロイするような方法が求められています。それによって、開発環境やテスト環境を迅速にプロビジョニングしたり、容易に削除したりできるようにすることを目指しています。この要件を満たす最も適切なAWSサービスの設定はどれでしょうか。',
    choices: [
      'AWS CodePipelineを設定して、コードを展開するパイプラインを構成することで迅速な環境設定と削除を可能にする',
      'CloudFormationによりテスト環境用のテンプレートを作成する。このテンプレートを利用してテスト環境をデプロイできるようにする',
      'EC2インスタンスのAMIとBashスクリプトを利用して、テスト環境構築を設定する。スクリプトを実行することで、テスト環境をデプロイできるようにする',
      'Amazon ECRにイメージを作成して、テスト環境構築を設定する。このイメージを利用して、テスト環境をデプロイできるようにする',
    ],
    answer: 1,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <p>「環境を作る」と聞くと選択肢がどれも正しそうに見えます。問題文をよく見ると、<strong>作るものの範囲</strong>と<strong>消すこと</strong>が指定されています。</p>
  <table>
    <tr><th style="width:38%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>AWS環境の<strong>インフラ構成</strong>を一括にデプロイ</td><td>サーバー1台ではなく、ネットワークもDBも含めた<strong>まるごと一式</strong></td></tr>
    <tr><td>迅速にプロビジョニング</td><td>手作業で1つずつポチポチ作らない</td></tr>
    <tr><td><strong>容易に削除</strong>できるようにする</td><td><mark>作るだけでなく、まとめて消せることが条件。ここが選択肢を分ける</mark></td></tr>
  </table>
  <p class="caption">開発・テスト環境は<strong>作っては壊すもの</strong>です。だから「消しやすさ」が要件に入っています。消し忘れたリソースは料金だけがかかり続けます。</p>

  <h2>決め手は「1枚の設計図でまとめて作り、まとめて消せるか」</h2>
  <p>AWS CloudFormation（クラウドフォーメーション）は、<strong>ほしい環境を文章で書いておくと、そのとおりに作ってくれる</strong>サービスです。書いたものをテンプレート、作られた環境のひとかたまりをスタックと呼びます。</p>

  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ 1つずつ作る（手作業・スクリプト）</div>
      <div class="nodes v">
        <div class="node ng"><span class="lbl">VPCを作る</span></div>
        <div class="node ng"><span class="lbl">サブネットを作る</span></div>
        <div class="node ng"><span class="lbl">EC2を作る</span></div>
        <div class="node ng"><span class="lbl">RDSを作る</span></div>
      </div>
      <p class="note">消すときも1つずつ。順番を間違えると消せず、消し忘れも起きます。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ テンプレート1枚から作る</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/res-aws-cloudformation-template.svg" alt=""></span>
          <span class="lbl">テンプレート1枚</span><span class="sub">ほしい環境を書いたもの</span>
        </div>
        <div class="link ok"><span>この1枚から</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/res-aws-cloudformation-stack.svg" alt=""></span>
          <span class="lbl">スタック（環境ひとかたまり）</span><span class="sub">VPC・EC2・RDSがまとめて作られる</span>
        </div>
        <div class="link ok"><span>いらなくなったら</span><span class="l">↓</span></div>
        <div class="node ok"><span class="lbl">スタックを削除</span><span class="sub">中身も全部まとめて消える</span></div>
      </div>
      <p class="note">同じテンプレートから、開発用・テスト用と何個でも同じ環境を作れます。</p>
    </div>
  </div>
  <p class="caption">ポイントは<strong>「スタック」というひとかたまりで管理される</strong>こと。作るのも消すのも、この単位で一発です。</p>

  <p>たとえるなら、<mark>CloudFormationはプラモデルの設計図と組立キット</mark>です。同じ設計図があれば、何個でもまったく同じものが組み上がります。しかも箱ごと片づけられるので、部品が机に残ることもありません。手作業で1つずつ作るのは、設計図なしで毎回ちがう部品を探して組むようなものです。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <p>どれも「デプロイ」に関わりますが、<strong>扱う対象がまったく違います</strong>。</p>
  <table>
    <tr><th style="width:26%">名前</th><th style="width:24%">何を作るもの</th><th>今回に合わない理由</th></tr>
    <tr><td class="good">AWS CloudFormation</td><td class="good">インフラ一式</td><td class="good">VPC・EC2・RDSをまとめて作り、まとめて消せる</td></tr>
    <tr><td>AWS CodePipeline</td><td>コードを届ける流れ</td><td class="bad">アプリの配信役。インフラは作らない</td></tr>
    <tr><td>AMI（マシンイメージ）</td><td>サーバー1台分の型</td><td class="bad">EC2は複製できるが、ネットワークやDBは作れない</td></tr>
    <tr><td>Amazon ECR</td><td>コンテナ画像の倉庫</td><td class="bad">画像を置く場所。環境を組み立てる仕組みではない</td></tr>
  </table>
  <p class="caption">AMIとECRはどちらも<strong>「1つの部品の型」</strong>です。今回ほしいのは<strong>組み立て全体の設計図</strong>なので、役者の大きさが足りません。</p>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. CodePipelineでコードを展開するパイプラインを構成する</h3>
      <p>CodePipelineは<strong>書いたコードを自動でテストして本番へ届ける流れ作業のベルトコンベア</strong>です。アプリを配るのが仕事で、その下のサーバーやネットワークは対象外です。</p>
      <p class="why">ヒント1の「インフラ構成を一括にデプロイ」を担当できません。役割が違います。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>B. CloudFormationでテンプレートを作り、それを使ってデプロイする</h3>
      <p>テンプレート1枚からスタックを作れば環境がまるごと立ち上がり、スタックを消せば中身も全部片づきます。同じテンプレートを使い回せるので、開発用とテスト用で構成がずれることもありません。</p>
      <p class="why">「まとめて作る」「すぐ作る」「まとめて消す」の3つのヒントを、1つの仕組みで満たします。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. AMIとBashスクリプトで構築する</h3>
      <p>AMIはEC2インスタンス1台をまるごと写し取った型です。同じサーバーを増やすのには向いています。ただしVPCやサブネット、データベースまでは含められません。</p>
      <p>足りない部分をBashスクリプトで書くこともできますが、<strong>削除の手順も自分で書くことになります</strong>。順番を間違えれば消えずに残ります。</p>
      <p class="why">ヒント3の「容易に削除」を満たせません。動きはしますが、手間が残ります。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. Amazon ECRにイメージを作成する</h3>
      <p>ECRはコンテナのイメージ（プログラムの入った荷物箱の型）を保管する倉庫です。置き場所であって、環境を組み立てる仕組みではありません。</p>
      <p class="why">ヒント1の「インフラ構成を一括にデプロイ」に対して、そもそも作る機能を持っていません。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：B　CloudFormationによりテスト環境用のテンプレートを作成する。このテンプレートを利用してテスト環境をデプロイできるようにする</strong></p>
    <p class="oboe">覚え方 —— <strong>「インフラをまとめて作る・まとめて消す」＝ CloudFormation。</strong>この1行で決まります。区別のコツは担当範囲です。<strong>CloudFormationはインフラ、CodePipelineはコードの配達、AMIはサーバー1台の型、ECRはコンテナ画像の倉庫。</strong>そして<strong>「繰り返し作って壊す」「環境の差をなくしたい」と書いてあれば、答えはコード化（IaC）＝ CloudFormation</strong>です。</p>
  </div>`
  },

  {
    id: 'e1q12',
    q: 'ある企業がAWSを活用してデータベースを構築するための要件を検討しています。あなたはソリューションアーキテクトとして、データベース要件に基づいて最適なAWSサービスを選定し、データベースを設定する役割を担っています。同社は、データベースに使用するサーバーのOS設定を自社で管理する考えです。この要件に適合するデータベース構築の方法を選択してください。',
    choices: [
      'Amazon RDSを利用してデータベースを構築する',
      'Amazon DynamoDBを利用してデータベースを構築する',
      'Amazon Auroraを選択してデータベースを構築する',
      'Amazon EC2インスタンスを利用してデータベースを構築する',
    ],
    answer: 3,
    explain: `
  <h2>まず、問題文の中の「1つのヒント」</h2>
  <p>この問題文は短く、条件はたった1つです。その1つが全部を決めます。</p>
  <table>
    <tr><th style="width:42%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>サーバーの<strong>OS設定を自社で管理する</strong></td><td><mark>OSにログインして設定を変えられる必要がある</mark></td></tr>
  </table>
  <p class="caption">OSとは、サーバーを動かしている基本ソフト（LinuxやWindows）のことです。「自社で管理する」とは、<strong>そこに入って自分で設定をいじる</strong>という意味になります。</p>

  <h2>決め手は「OSに入れるかどうか」</h2>
  <p>AWSのデータベースには2つの流儀があります。<strong>AWSが土台ごと面倒を見てくれる（マネージド）</strong>か、<strong>サーバーを1台借りて自分で全部やる</strong>かです。</p>

  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ マネージドなDB（RDS・Aurora・DynamoDB）</div>
      <div class="nodes v">
        <div class="node ng"><span class="lbl">データベースの設定</span><span class="sub">ここは自分でできる</span></div>
        <div class="link ng"><span>ここから下は触れない</span><span class="l">↓</span></div>
        <div class="node dim"><span class="lbl">OS（基本ソフト）</span><span class="sub">ログインできない</span></div>
        <div class="node dim"><span class="lbl">サーバー本体</span><span class="sub">AWSが持っている</span></div>
      </div>
      <p class="note">ラクな代わりに、OSには入れません。これは仕様です。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ EC2にDBを自分で入れる</div>
      <div class="nodes v">
        <div class="node ok"><span class="lbl">データベースの設定</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/gen-gear.svg" alt=""></span>
          <span class="lbl">OS（基本ソフト）</span><span class="sub">ログインして自由に設定できる</span>
        </div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/amazon-ec2.svg" alt=""></span>
          <span class="lbl">EC2インスタンス</span><span class="sub">自分が借りたサーバー</span>
        </div>
      </div>
      <p class="note">自由になる代わりに、更新もバックアップも自分の仕事になります。</p>
    </div>
  </div>
  <p class="caption">灰色の箱は<strong>「AWSのものなので手が出せない」</strong>という意味です。マネージドなDBが便利なのは、この部分をAWSが引き受けているからです。</p>

  <p>たとえるなら、<mark>RDSやAuroraは家具付きのマンション</mark>です。エアコンも冷蔵庫も最初から付いていて、壊れたら大家さんが直してくれます。その代わり<strong>壁に穴を開けることはできません</strong>。EC2は土地を借りて自分で家を建てるやり方。何でも好きにできますが、雨漏りの修理も自分でやります。</p>

  <h3>この問題は「良し悪し」を聞いていない</h3>
  <p>ふつうの設計では、運用の手間が小さいRDSやAuroraを選ぶのが定石です。ところがこの問題は<strong>「OSを自社で管理したい」と条件が指定されています</strong>。条件が先にある以上、便利かどうかではなく<strong>条件を満たせるかどうか</strong>で選びます。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <table>
    <tr><th style="width:22%">名前</th><th style="width:22%">種類</th><th style="width:22%">OSに入れるか</th><th>選ぶ場面</th></tr>
    <tr><td>Amazon RDS</td><td>マネージドな関係DB</td><td class="bad">入れない</td><td>ふつうのDB運用。手間を減らしたいとき</td></tr>
    <tr><td>Amazon Aurora</td><td>RDSの高性能版</td><td class="bad">入れない</td><td>速さと可用性がほしいとき</td></tr>
    <tr><td>Amazon DynamoDB</td><td>マネージドなNoSQL</td><td class="bad">入れない</td><td>キーで引く超高速な読み書き</td></tr>
    <tr><td class="good">EC2にDBを構築</td><td class="good">自前運用</td><td class="good">入れる</td><td class="good">OSの管理・特殊なDB製品やバージョンが要るとき</td></tr>
  </table>
  <p class="caption">AuroraはRDSの仲間なので、<strong>RDSがだめならAuroraもだめ</strong>です。選択肢に両方あるときは、まとめて判断できます。</p>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. Amazon RDSを利用する</h3>
      <p>RDSはAWSが用意してくれたデータベースの部屋です。バックアップもソフトの更新もAWSがやってくれます。その裏返しで、<strong>動いているサーバーにログインすることはできません</strong>。</p>
      <p class="why">ヒントの「OS設定を自社で管理する」ができません。便利さと引き換えに、その自由がない仕組みです。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. Amazon DynamoDBを利用する</h3>
      <p>DynamoDBはサーバーという考え方そのものが表に出てこないデータベースです。何台で動いているのかも利用者には見えません。</p>
      <p class="why">OSどころかサーバーの存在すら見えないので、ヒントを満たしようがありません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. Amazon Auroraを選択する</h3>
      <p>AuroraはRDSの一種で、速さと壊れにくさを高めたものです。中身が高性能になっただけで、<strong>AWSが土台を持つという点はRDSと同じ</strong>です。</p>
      <p class="why">Aと同じ理由です。RDSがだめならAuroraもだめ、とまとめて判断できます。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>D. Amazon EC2インスタンスを利用してデータベースを構築する</h3>
      <p>EC2は自分で借りたサーバーです。そこにMySQLやPostgreSQLなどを自分でインストールしてデータベースにします。OSにログインでき、設定ファイルもチューニングも自由です。</p>
      <p class="why">「OS設定を自社で管理する」を満たせるのはこれだけです。手間は増えますが、問題が求めているのはそれです。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：D　Amazon EC2インスタンスを利用してデータベースを構築する</strong></p>
    <p class="oboe">覚え方 —— <strong>「OSを管理したい」「OSにログインしたい」「特定のDB製品・バージョンを使いたい」と書いてあったら、答えはEC2にDBを自分で立てる。</strong>逆に言えば、<strong>これらが書かれていなければマネージド（RDS・Aurora・DynamoDB）が正解</strong>です。SAAの問題は基本「運用の手間を減らす」方向が正解ですが、<strong>条件が明示されたときは条件が優先します。</strong>ここを読み違えると、一番ラクな選択肢を選んで外します。</p>
  </div>`
  },

  {
    id: 'e1q13',
    q: 'ある企業がAWS上でウェブアプリケーションを開発しています。このアプリケーションは複数のEC2インスタンスにホストされており、Amazon SQSキューからメッセージを取得して、EC2インスタンスがそのメッセージを処理し、処理結果をAmazon RDS DBインスタンスに書き込む仕組みです。処理完了後、メッセージはキューから削除されます。Amazon SQSキュー内のメッセージは重複しないものの、RDS DBインスタンスに保存されたデータには時折重複レコードが見受けられます。重複メッセージの発生を防ぐために、ソリューションアーキテクトはどのような対策を講じるべきでしょうか。',
    choices: [
      'ChangeMessageVisibility をAPI使用して、適切な可視性タイムアウト値を設定する',
      'AddPermission APIを使用して、適切な権限を付与する',
      'CreateQueue APIを使用して、新しいキューを作成する',
      'ReceiveMessage APIを使用して、適切な待機時間を設定する',
    ],
    answer: 0,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <p>この問題は<strong>原因を先に突き止める</strong>タイプです。「どこが壊れているか」が分かれば、直す場所は1つしかありません。</p>
  <table>
    <tr><th style="width:38%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>キュー内のメッセージは<strong>重複しない</strong></td><td>入れる側は正しい。原因は<strong>取り出したあと</strong>にある</td></tr>
    <tr><td>複数のEC2インスタンスが処理する</td><td>同じメッセージを別のインスタンスが取る余地がある</td></tr>
    <tr><td>DBには時折<strong>重複レコード</strong></td><td><mark>同じメッセージが2回処理されている</mark></td></tr>
  </table>
  <p class="caption">「メッセージは重複していないのに結果は重複する」。この食い違いが問題の中心です。<strong>1件のメッセージが2回処理されている</strong>と考えるしかありません。</p>

  <h2>決め手は「貸出中の札が早く外れている」こと</h2>
  <p>SQS（キュー）は仕事の順番待ちの行列です。インスタンスがメッセージを取り出すと、そのメッセージはしばらく<strong>他の人から見えなくなります</strong>。この見えない時間を<strong>可視性タイムアウト</strong>と呼びます。処理が終わってメッセージを削除すれば、そこで完了です。</p>
  <p>ところが<mark>処理が終わる前に可視性タイムアウトが切れると、メッセージがまた見えるようになります</mark>。すると別のインスタンスがそれを拾い、同じ仕事をもう一度やってしまいます。</p>

  <div class="bars">
    <div class="barrow"><div class="name">処理にかかる時間</div><div class="bar dark" style="width:100%">たとえば 5分</div></div>
    <div class="barrow"><div class="name">可視性タイムアウト</div><div class="bar red" style="width:20%">30秒</div></div>
  </div>
  <p class="caption">タイムアウトのほうが短いと、<strong>処理の途中でメッセージが行列に戻ります</strong>。これが重複の正体です。</p>

  <div class="nodes">
    <div class="node">
      <span class="ico"><img src="assets/icons/amazon-simple-queue-service.svg" alt=""></span>
      <span class="lbl">SQSキュー</span><span class="sub">メッセージは1件だけ</span>
    </div>
    <div class="link ng"><span>30秒後に<br>また見えた</span><span class="l">⟶</span></div>
    <div class="node ng many">
      <span class="ico"><img src="assets/icons/amazon-ec2.svg" alt=""></span>
      <span class="lbl">EC2が2台とも処理</span><span class="sub">1台目はまだ作業中</span>
    </div>
    <div class="link ng"><span>同じ結果を2回</span><span class="l">⟶</span></div>
    <div class="node ng">
      <span class="ico"><img src="assets/icons/amazon-rds.svg" alt=""></span>
      <span class="lbl">RDS</span><span class="sub">重複レコード</span>
    </div>
  </div>
  <p class="caption">直し方は<strong>可視性タイムアウトを処理時間より長くする</strong>こと。それだけで重複は止まります。</p>

  <p>たとえるなら、<mark>可視性タイムアウトは図書館の「貸出中」の札</mark>です。本を借りると札が立ち、他の人は借りられません。ところが<strong>まだ読んでいる途中で札が勝手に外れる</strong>と、別の人が同じ本を持っていってしまいます。札の有効期間を、読み終わるまでの時間より長くしておけば解決します。</p>

  <h2>まぎらわしい4つのAPIを区別する</h2>
  <p>選択肢はどれもSQSの本物のAPIです。<strong>何を調整するものか</strong>で切り分けます。</p>
  <table>
    <tr><th style="width:30%">API</th><th style="width:30%">調整するもの</th><th>今回に効くか</th></tr>
    <tr><td class="good">ChangeMessageVisibility</td><td class="good">取り出したメッセージが隠れている時間</td><td class="good">これが重複の原因。効く</td></tr>
    <tr><td>ReceiveMessage の待機時間</td><td>メッセージが来るまで待つ時間（ロングポーリング）</td><td class="bad">空振りの問い合わせを減らすもの。重複とは無関係</td></tr>
    <tr><td>AddPermission</td><td>誰がこのキューを使えるか</td><td class="bad">権限の話。動いている以上、権限は足りている</td></tr>
    <tr><td>CreateQueue</td><td>新しいキューを作る</td><td class="bad">キューを増やしても、同じ現象がそこで起きる</td></tr>
  </table>
  <p class="caption">よく混同するのが<strong>「可視性タイムアウト」と「ロングポーリングの待機時間」</strong>です。前者は<strong>取り出したあと</strong>の話、後者は<strong>取り出す前</strong>の話。時間軸が逆だと覚えます。</p>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>A. ChangeMessageVisibility で適切な可視性タイムアウト値を設定する</h3>
      <p>メッセージが隠れている時間を、実際の処理時間より長く設定します。処理が終わるまで他のインスタンスからは見えないので、二重に拾われません。</p>
      <p class="why">ヒント3の「同じメッセージが2回処理される」原因に、直接手を打っています。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. AddPermission APIで適切な権限を付与する</h3>
      <p>AddPermissionは「どのアカウントにこのキューを使わせるか」を決めるものです。権限の話です。</p>
      <p class="why">処理そのものは正常に動いています。権限が足りないなら、そもそもメッセージを1件も取り出せません。原因の場所が違います。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. CreateQueue APIで新しいキューを作成する</h3>
      <p>キューを新しく作っても、可視性タイムアウトの設定が同じなら、そこでもまったく同じ重複が起きます。</p>
      <p class="why">原因を持ち越すだけで、何も解決しません。入れ物を替えても中身の問題は残ります。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. ReceiveMessage APIで適切な待機時間を設定する</h3>
      <p>これはロングポーリングの設定です。キューが空のときに「何もなかった」という返事をすぐ受け取らず、少し待ってから返してもらう仕組みで、無駄な問い合わせ回数と料金を減らします。</p>
      <p class="why">調整しているのは<strong>取り出す前</strong>の待ち時間です。重複が起きるのは<strong>取り出したあと</strong>なので、ここをいじっても直りません。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：A　ChangeMessageVisibility をAPI使用して、適切な可視性タイムアウト値を設定する</strong></p>
    <p class="oboe">覚え方 —— <strong>SQSで「同じメッセージが2回処理された」と来たら、可視性タイムアウトが処理時間より短い。</strong>これがほぼ唯一の原因です。直し方は<strong>可視性タイムアウトを処理時間より長くする</strong>こと。あわせて2つの時間を取り違えないようにします。<strong>可視性タイムアウト＝取り出したあとに隠れている時間（重複を防ぐ）、ロングポーリングの待機時間＝取り出す前に待つ時間（空振りを減らす）。</strong>なお<strong>「順番を守りたい」「絶対に1回だけ処理したい」と書いてあればFIFOキュー</strong>が答えになります。</p>
  </div>`
  },

  {
    id: 'e1q14',
    q: 'ある企業はEC2インスタンス上に「イベントドリブンアプリケーション」を構築しました。アプリケーションのトラフィック急増時にも円滑に処理を続けられるよう、これらのインスタンスにはAuto Scalingグループが設定されています。しかし、最近、毎日17時から17時半の間にアプリケーションのパフォーマンスが急激に低下する問題が発生しています。この負荷増加が短時間であるため、Auto Scalingによるインスタンスの追加が間に合っていないようです。ソリューションアーキテクトとして、どのようにこの問題を改善するべきでしょうか。',
    choices: [
      'Auto Scalingが起動するインスタンス数の最大数を増加する',
      'ELBによるロードバランシングを設定する',
      'Route53によるトラフィックルーティングを設定する',
      'Auto Scalingに対して、スケジュールされたスケーリングポリシーを追加する',
    ],
    answer: 3,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <p>問題文が<strong>原因まで書いてくれている</strong>親切なタイプです。「間に合っていない」の一言を見落とさないことがすべてです。</p>
  <table>
    <tr><th style="width:38%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td><strong>毎日</strong>17時から17時半</td><td><mark>いつ混むかが分かっている。予測できる</mark></td></tr>
    <tr><td>負荷増加が短時間</td><td>気づいてから増やしていては終わってしまう</td></tr>
    <tr><td>インスタンスの追加が<strong>間に合っていない</strong></td><td>台数が足りないのではなく、<strong>増え始めるのが遅い</strong></td></tr>
  </table>
  <p class="caption">「足りない」と「間に合わない」はまったく別の問題です。<strong>間に合わないのは時間の問題</strong>なので、数を増やしても解決しません。</p>

  <h2>決め手は「反応してから増やす」か「先に増やしておく」か</h2>
  <p>ふだんのAuto Scalingは<strong>混んできたことに気づいてから</strong>インスタンスを増やします。ところがEC2は起動してアプリが動き出すまでに数分かかります。混雑が30分しかないと、準備できたころには終わっています。</p>

  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ 今のやり方（混んでから増やす）</div>
      <div class="nodes v">
        <div class="node ng"><span class="lbl">17:00　混み始める</span></div>
        <div class="link ng"><span>数分かけて気づく</span><span class="l">↓</span></div>
        <div class="node ng"><span class="lbl">17:05　増やし始める</span></div>
        <div class="link ng"><span>起動に数分</span><span class="l">↓</span></div>
        <div class="node ng"><span class="lbl">17:10　やっと使える</span><span class="sub">混雑はもう半分終わっている</span></div>
      </div>
      <p class="note">遅れているぶん、毎日必ず性能が落ちます。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ スケジュールで先に増やす</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/amazon-ec2-auto-scaling.svg" alt=""></span>
          <span class="lbl">16:45　時刻で増やす</span><span class="sub">混む前に準備</span>
        </div>
        <div class="link ok"><span>起動が終わっている</span><span class="l">↓</span></div>
        <div class="node ok"><span class="lbl">17:00　万全で迎える</span></div>
        <div class="link ok"><span class="l">↓</span></div>
        <div class="node ok"><span class="lbl">17:45　台数を戻す</span><span class="sub">余分な料金もかからない</span></div>
      </div>
      <p class="note">毎日同じ時刻に混むと分かっているので、待たずに先回りできます。</p>
    </div>
  </div>
  <p class="caption">左右で変えたのは<strong>増やし始める時刻だけ</strong>です。台数もインスタンスの種類も変えていません。</p>

  <h3>混むのは1日のうちこの30分だけ</h3>
  <div class="day">
    <div class="strip">
      <span></span><span></span><span></span><span></span><span></span><span></span>
      <span></span><span></span><span></span><span></span><span></span><span></span>
      <span></span><span></span><span></span><span></span><span></span><span class="on"></span>
      <span></span><span></span><span></span><span></span><span></span><span></span>
    </div>
    <div class="scale"><span>0時</span><span>6時</span><span>12時</span><span>18時</span><span>24時</span></div>
    <p class="caption">赤いところが混雑する時間帯。<strong>場所が毎日決まっている</strong>ので、その直前に増やしておけば済みます。</p>
  </div>

  <p>たとえるなら、<mark>今のやり方は「行列ができてから店員を呼びに行く」</mark>状態です。呼ばれた店員が着替えて売り場に出るころには、お客さんは帰っています。スケジュールされたスケーリングは<strong>「ランチが混むと分かっているから11時半に店員を増やしておく」</strong>やり方です。</p>

  <h2>Auto Scalingの増やし方を区別する</h2>
  <p>Auto Scalingには増やし方が何種類かあります。<strong>何をきっかけに増やすか</strong>が違います。</p>
  <table>
    <tr><th style="width:26%">やり方</th><th style="width:28%">きっかけ</th><th>こう書かれていたら選ぶ</th></tr>
    <tr><td>動的スケーリング<br>（ターゲット追跡・ステップ）</td><td>CPU使用率などの<strong>実際の数値</strong></td><td class="bad">いつ来るか分からない負荷。ただし気づくまでに時間がかかる</td></tr>
    <tr><td class="good">スケジュールされた<br>スケーリング</td><td class="good"><strong>時刻</strong></td><td class="good">毎日／毎週／毎月、決まった時間に混む</td></tr>
    <tr><td>予測スケーリング</td><td>過去の実績からの<strong>予想</strong></td><td class="bad">周期はあるが時刻がはっきり決まっていない</td></tr>
    <tr><td>最大数の変更</td><td>（増やし方ではない）</td><td class="bad">天井を上げるだけ。増え始める速さは変わらない</td></tr>
  </table>
  <p class="caption">押さえどころは<strong>「最大数」は上限であって、スピードではない</strong>ということ。ここを取り違えると選択肢Aを選んでしまいます。</p>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. Auto Scalingが起動するインスタンス数の最大数を増やす</h3>
      <p>最大数は「ここまでなら増やしていい」という<strong>天井</strong>です。天井を高くしても、増やし始めるタイミングも起動にかかる時間も変わりません。</p>
      <p class="why">ヒント3は「足りない」ではなく「<strong>間に合っていない</strong>」です。数の問題ではなく時間の問題なので、効きません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. ELBによるロードバランシングを設定する</h3>
      <p>ELB（ロードバランサー）は、いま動いているサーバーに通信を均等に配る係です。全員が忙しいときに、配り方を工夫しても処理能力は増えません。</p>
      <p class="why">足りないのは配分ではなくサーバーの数です。ヒント3の原因に対して効き目がありません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. Route53によるトラフィックルーティングを設定する</h3>
      <p>Route 53はどのサーバーの住所を教えるかを決める電話帳です。案内先を変えられても、案内した先が混んでいることには変わりありません。</p>
      <p class="why">Bと同じく振り分けの話です。増やすタイミングの問題には触れていません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>D. スケジュールされたスケーリングポリシーを追加する</h3>
      <p>「毎日16時45分に台数を増やし、17時45分に戻す」と時刻で指定します。混雑が始まる前に準備が終わっているので、立ち上がりの数分を待つ必要がありません。</p>
      <p class="why">ヒント1の「毎日決まった時刻」という条件をそのまま利用して、ヒント3の「間に合わない」を解消します。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：D　Auto Scalingに対して、スケジュールされたスケーリングポリシーを追加する</strong></p>
    <p class="oboe">覚え方 —— <strong>「毎日」「毎週」「決まった時刻に」混むと書いてあれば、スケジュールされたスケーリング。</strong>迷ったときは、問題文が<strong>「足りない」なのか「間に合わない」なのか</strong>を見ます。<strong>足りない → 最大数やインスタンスサイズの話。間に合わない → 増やすタイミングの話。</strong>そして<strong>ELBやRoute 53は振り分ける道具であって、処理能力を増やす道具ではありません。</strong>この2つが選択肢に混ざっていたら、たいていダミーです。</p>
  </div>`
  },

  {
    id: 'e1q15',
    q: 'ある企業はAWS上で基幹システムを運用しており、このシステムはAmazon Aurora MySQLデータベースを用いてデータを管理しています。保存データは業務において極めて重要であるため、データセンター障害に備えた構成が求められます。要件としては、データセンター障害が発生した際には、数分以内にデータベースを再稼働させることができるようにして、ダウンタイムを最小限に抑える必要があります。この要件を満たすために、コスト効率の良いソリューションを選定してください。',
    choices: [
      'Amazon Aurora Global Databaseによる高速フェールオーバーを有効化する。これによって、プライマリDBに障害が発生した場合でも、スタンバイDBが処理を継続する',
      'Amazon Aurora Global Databaseを有効化する。プライマリDBに障害が発生した場合は、スタンバイDBインスタンスをプライマリDBインスタンスに昇格させる',
      'Aurora DBクラスターのレプリカを複数アベイラビリティゾーンに展開する。プライマリDBに障害が発生した場合は、レプリカの１つをプライマリDBに昇格させる',
      'AuroraDBクラスターのスナップショットを作成して、Amazon Data Lifecycle Managerを設定する。プライマリDBに障害が発生した場合は、Amazon DLMによってスナップショットから迅速にDBが復元される',
    ],
    answer: 2,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <p>この問題のカギは<strong>「どのくらいの規模の障害に備えるのか」</strong>です。備える範囲を大きくしすぎると、要件は満たしてもコストで落とされます。</p>
  <table>
    <tr><th style="width:38%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td><strong>データセンター</strong>障害に備える</td><td><mark>建物1つの障害。AWSでいうアベイラビリティゾーン（AZ）1つ分</mark></td></tr>
    <tr><td>数分以内に再稼働</td><td>バックアップから戻していては間に合わない。待機役が動いている必要がある</td></tr>
    <tr><td>コスト効率の良い</td><td>要件を満たす中で<strong>いちばん安い</strong>ものを選ぶ</td></tr>
  </table>
  <p class="caption">「データセンター障害」を「リージョン全体の災害」と読み違えると、選択肢AやBに行きます。<strong>データセンター1つ＝AZ1つ</strong>です。</p>

  <h2>決め手は「AZ障害か、リージョン障害か」</h2>
  <p>AWSの場所には大きさの段階があります。ここを混同すると、必要以上に大きな備えを選んでしまいます。</p>
  <table>
    <tr><th style="width:26%">用語</th><th style="width:30%">大きさ</th><th>たとえ</th></tr>
    <tr><td class="good">アベイラビリティゾーン（AZ）</td><td class="good">データセンター1つ（または数棟）</td><td class="good">同じ市内の別の建物</td></tr>
    <tr><td>リージョン</td><td>複数のAZをまとめた地域</td><td>東京、シンガポールといった別の国・都市</td></tr>
  </table>
  <p class="caption">1つのリージョンには、離れた場所にあるAZが複数あります。<strong>片方が停電しても、もう片方は生きています。</strong></p>

  <div class="zone">
    <span class="zlbl"><img src="assets/icons/group-region.svg" alt="">東京リージョン</span>
    <div class="zrow">
      <div class="zone ok">
        <span class="zlbl">AZ-a</span>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/amazon-aurora.svg" alt=""></span>
          <span class="lbl">プライマリDB</span><span class="sub">いま使っている</span>
        </div>
      </div>
      <div class="zone ok">
        <span class="zlbl">AZ-c</span>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/amazon-aurora.svg" alt=""></span>
          <span class="lbl">レプリカ</span><span class="sub">障害時はここが昇格</span>
        </div>
      </div>
    </div>
  </div>
  <p class="caption">AZ-aのデータセンターが落ちても、AZ-cのレプリカが自動でプライマリに切り替わります。切り替えは<strong>ふつう30秒ほど</strong>で終わるので、「数分以内」を余裕で満たします。</p>

  <h2>備える範囲とコストの関係</h2>
  <div class="vs">
    <div class="pane good">
      <div class="pane-h">◯ 同じリージョンの複数AZ</div>
      <div class="nodes v">
        <div class="node ok"><span class="lbl">AZ-a のプライマリ</span></div>
        <div class="link ok"><span>同じリージョン内で複製</span><span class="l">↓</span></div>
        <div class="node ok"><span class="lbl">AZ-c のレプリカ</span><span class="sub">自動で昇格。数十秒</span></div>
      </div>
      <p class="note">データセンター障害に必要十分。追加費用はレプリカの分だけです。</p>
    </div>
    <div class="pane bad">
      <div class="pane-h">✕ Aurora Global Database</div>
      <div class="nodes v">
        <div class="node ng"><span class="lbl">東京リージョンのDB</span></div>
        <div class="link ng"><span>別のリージョンへ複製</span><span class="l">↓</span></div>
        <div class="node ng"><span class="lbl">大阪／シンガポールのDB</span><span class="sub">まるごと1式ぶんの費用</span></div>
      </div>
      <p class="note">リージョンごと使えなくなる大災害への備え。今回はそこまで求められていません。</p>
    </div>
  </div>
  <p class="caption">どちらも数分以内に復旧できます。違うのは<strong>備える範囲と値段</strong>だけ。だから「コスト効率」の一言で答えが決まります。</p>

  <p>たとえるなら、<mark>AZをまたぐ構成は「近所のもう1棟にも同じ設備を置く」</mark>やり方です。1棟が停電しても、もう1棟で続けられます。Global Databaseは<strong>海外に支社をもう1つ作る</strong>ようなもの。街ごと被災したときには頼れますが、<strong>「近所の建物が停電した」だけの話に海外支社を建てるのは、明らかにやりすぎです。</strong></p>

  <h2>まぎらわしい4つを区別する</h2>
  <table>
    <tr><th style="width:26%">やり方</th><th style="width:24%">どこまで守れるか</th><th style="width:20%">復旧の速さ</th><th>コスト</th></tr>
    <tr><td class="good">Auroraレプリカを複数AZに</td><td class="good">AZ（データセンター）障害</td><td class="good">数十秒で自動昇格</td><td class="good">レプリカの分だけ</td></tr>
    <tr><td>Aurora Global Database</td><td>リージョン全体の災害</td><td>1分ほど</td><td class="bad">別リージョンに1式ぶん</td></tr>
    <tr><td>スナップショットから復元</td><td>データの消失</td><td class="bad">数十分〜数時間</td><td>安い</td></tr>
  </table>
  <p class="caption">選ぶ順番は<strong>①要件（守る範囲と速さ）を満たすか → ②その中でいちばん安いか</strong>。この順でしか判断できません。</p>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. Aurora Global Databaseの高速フェイルオーバーを有効化する</h3>
      <p>Global Databaseは<strong>別のリージョンにもう1つデータベースを持つ</strong>仕組みです。リージョンまるごとが使えなくなる大災害に備えるためのもので、速さは申し分ありません。</p>
      <p class="why">要件は満たしますが、備える範囲が大きすぎます。ヒント3の「コスト効率」で落ちます。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. Aurora Global Databaseを有効化し、障害時にスタンバイを昇格させる</h3>
      <p>Aと同じくGlobal Databaseです。昇格を自動でやるか手動でやるかの違いしかありません。</p>
      <p class="why">Aと同じ理由です。<strong>Global Databaseと書かれた時点で、リージョンをまたぐ構成＝割高</strong>と判断できます。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>C. Auroraレプリカを複数のアベイラビリティゾーンに展開し、障害時に昇格させる</h3>
      <p>同じリージョンの中で、別のデータセンター（AZ）にレプリカを置きます。プライマリが止まればレプリカが自動でプライマリに昇格し、数十秒で処理を再開します。</p>
      <p class="why">データセンター障害に必要十分で、リージョンをまたがないぶん安い。3つのヒントを同時に満たします。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. スナップショットを作成し、Data Lifecycle Managerで管理する</h3>
      <p>スナップショットは<strong>データの控え</strong>です。Data Lifecycle Managerは、その取得と削除を自動で回してくれる仕組みで、データを失わないためには有効です。</p>
      <p>ただし復元は、新しいデータベースを一から作り直す作業です。データ量が多いほど時間がかかり、数十分から数時間かかります。</p>
      <p class="why">ヒント2の「数分以内に再稼働」を満たせません。備えとしては必要ですが、この要件の答えにはなりません。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：C　Aurora DBクラスターのレプリカを複数アベイラビリティゾーンに展開する。プライマリDBに障害が発生した場合は、レプリカの１つをプライマリDBに昇格させる</strong></p>
    <p class="oboe">覚え方 —— <strong>「データセンター障害」＝AZ1つの障害。答えは同じリージョンの複数AZで足ります。</strong>「リージョン全体の災害」「別の国からも使いたい」と書いてあって初めてGlobal Databaseです。そして<strong>「数分以内」と言われたらスナップショットからの復元は消えます</strong>（あれは数十分以上かかる手段です）。判断は必ず<strong>①要件を満たすか → ②その中で最も安いか</strong>の順で。<strong>「コスト効率」の一言は、要件を満たす選択肢が複数あるときの決勝戦の合図</strong>です。</p>
  </div>`
  },

  {
    id: 'e1q16',
    q: 'あなたはソリューションアーキテクトとしてAmazon DynamoDBテーブルにデータを書き込むためのAWS Lambda関数を作成しました。このLambda関数がDynamoDBテーブルを操作できるように権限を設定する必要があります。どのように権限を設定すればよいでしょうか。',
    choices: [
      'Lambda関数に適切な権限を付与したIAMユーザーを設定してDynamoDBへのアクセスを許可する',
      'Lambda関数に適切な権限を付与したIAMロールを設定してDynamoDBへのアクセスを許可する',
      'Lambda関数に適切な権限を付与したIAMポリシーを設定してDynamoDBへのアクセスを許可する',
      'Lambda関数に適切な権限を付与したリソースポリシーを設定してDynamoDBへのアクセスを許可する',
    ],
    answer: 1,
    explain: `
  <h2>まず、問題文の中の「2つのヒント」</h2>
  <p>選択肢は4つとも「適切な権限を付与した◯◯を設定して」という同じ形です。違うのは◯◯の部分だけ。つまりこの問題は<strong>IAMの用語を正しく区別できるか</strong>を聞いています。</p>
  <table>
    <tr><th style="width:40%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td><strong>Lambda関数が</strong>DynamoDBを操作する</td><td><mark>権限を受け取るのは人ではなく、AWSのサービス</mark></td></tr>
    <tr><td>Lambda関数<strong>に</strong>設定する</td><td>Lambda側に付けるもの。DynamoDB側の設定ではない</td></tr>
  </table>

  <h2>決め手は「人か、サービスか」</h2>
  <p>IAM（アイアム）はAWSの<strong>身分証と許可証を管理する仕組み</strong>です。ここでいちばん大事な区別は、<strong>権限を持つのが人なのかサービスなのか</strong>です。</p>

  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ IAMユーザー（人のための身分証）</div>
      <div class="nodes v">
        <div class="node ng">
          <span class="ico"><img src="assets/icons/gen-user.svg" alt=""></span>
          <span class="lbl">IAMユーザー</span><span class="sub">人ひとりに1つ</span>
        </div>
        <div class="link ng"><span>アクセスキーを<br>コードに書くことになる</span><span class="l">↓</span></div>
        <div class="node ng">
          <span class="ico"><img src="assets/icons/aws-lambda.svg" alt=""></span>
          <span class="lbl">Lambda関数</span><span class="sub">鍵が漏れたら終わり</span>
        </div>
      </div>
      <p class="note">鍵を自分で配って管理することになります。AWSが避けるべきとしているやり方です。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ IAMロール（貸し出す許可証）</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/res-aws-identity-access-management-role.svg" alt=""></span>
          <span class="lbl">IAMロール</span><span class="sub">誰でも一時的に借りられる</span>
        </div>
        <div class="link ok"><span>実行のたびに自動で貸与</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/aws-lambda.svg" alt=""></span>
          <span class="lbl">Lambda関数</span><span class="sub">鍵を持たなくていい</span>
        </div>
        <div class="link ok"><span>許された操作だけ</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/amazon-dynamodb.svg" alt=""></span>
          <span class="lbl">DynamoDB</span>
        </div>
      </div>
      <p class="note">Lambdaが動くたびに一時的な資格情報が渡され、終われば消えます。</p>
    </div>
  </div>
  <p class="caption">ロールを使うと<strong>コードの中に鍵を一切書かずに済みます</strong>。これが「サービスにはロール」と決まっている一番の理由です。</p>

  <p>たとえるなら、<mark>IAMユーザーは自分専用の社員証</mark>です。持ち主が決まっていて、貸し借りは禁止。落とすと大問題になります。<strong>IAMロールは受付で借りる来客用の入館証</strong>です。誰が使うかは決まっておらず、その場で借りて、用が済んだら返します。今回の「Lambda関数」は社員ではないので、入館証を借りるほうが自然です。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <p>ここが試験で最も問われるところです。<strong>「誰が」と「何ができるか」は別物</strong>だと覚えます。</p>
  <table>
    <tr><th style="width:22%">名前</th><th style="width:24%">正体</th><th style="width:22%">たとえ</th><th>まちがえやすい点</th></tr>
    <tr><td>IAMユーザー</td><td>「誰が」</td><td>社員証</td><td class="bad">人のためのもの。サービスには使わない</td></tr>
    <tr><td class="good">IAMロール</td><td class="good">「誰が」（一時的に借りる）</td><td class="good">来客用の入館証</td><td class="good">サービスに権限を渡すときはこれ</td></tr>
    <tr><td>IAMポリシー</td><td>「何ができるか」</td><td>許可内容を書いた紙</td><td class="bad">単体では効かない。ユーザーかロールに貼って初めて働く</td></tr>
    <tr><td>リソースポリシー</td><td>「誰に使わせるか」</td><td>入口に貼る入館条件</td><td class="bad">向きが逆。資源の側が相手を受け入れる設定</td></tr>
  </table>
  <p class="caption">ポリシーは<strong>紙</strong>、ユーザーとロールは<strong>それを持つ人</strong>。紙だけ用意しても、誰かが持たないと意味がありません。</p>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. IAMユーザーを設定して許可する</h3>
      <p>IAMユーザーは人のための身分証です。これをLambdaに使わせるには、アクセスキーという鍵を発行してコードに書き込むことになります。<strong>鍵が漏れれば誰でもDynamoDBを操作できてしまいます。</strong></p>
      <p class="why">ヒント1の「権限を受け取るのはサービス」に合いません。AWSが明確に避けるべきとしているやり方です。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>B. IAMロールを設定して許可する</h3>
      <p>Lambda関数に実行ロールを設定すると、関数が動くたびに一時的な資格情報が自動で渡されます。有効期限があるので、漏れたときの被害も限られます。鍵の管理も不要です。</p>
      <p class="why">「AWSサービスに権限を渡す」場面の正解の形そのものです。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. IAMポリシーを設定して許可する</h3>
      <p>ポリシーは<strong>「DynamoDBに書き込んでよい」と書かれた紙</strong>です。書いてあるだけでは効きません。ユーザーかロールに貼り付けて、はじめて権限になります。</p>
      <p>実際にやるべきことは「ポリシーを貼ったロールを作り、そのロールをLambdaに設定する」です。<strong>この選択肢はロールの部分が抜けています。</strong></p>
      <p class="why">いちばん惜しい選択肢です。ポリシー単体では誰にも紐づかないので、権限として機能しません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. リソースポリシーを設定して許可する</h3>
      <p>リソースポリシーは<strong>資源の側が「誰に使わせるか」を決める</strong>設定です。Lambdaのリソースポリシーなら「誰がこのLambda関数を呼んでよいか」を決めるもので、向きが逆になります。</p>
      <p class="why">ほしいのは「Lambdaが他のサービスを操作する」権限です。<strong>呼ばれる側の設定では、呼びに行く権限になりません。</strong></p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：B　Lambda関数に適切な権限を付与したIAMロールを設定してDynamoDBへのアクセスを許可する</strong></p>
    <p class="oboe">覚え方 —— <strong>AWSサービスに権限を渡すなら必ずIAMロール。人ならIAMユーザー。</strong>「Lambdaが」「EC2が」「ECSタスクが」と<strong>主語がサービスなら、答えはロールで確定</strong>します。あわせて2つの向きを押さえます。<strong>ポリシーは「何ができるか」で、単体では効きません。リソースポリシーは「自分を誰に使わせるか」で、向きが逆です。</strong>選択肢に「アクセスキーをコードに書く」系が出てきたら、それはほぼ必ず不正解です。</p>
  </div>`
  },

  {
    id: 'e1q17',
    q: 'ある企業が、オンプレミス環境にある静的ウェブサイトをAWSに移行することを決定しました。このウェブサイトは、世界中のユーザーにアクセスされるグローバルなサイトであり、迅速に全てのユーザーが利用できることが求められています。また、その際は、コスト効率の良いアーキテクチャであることも要件となっています。これらの要件を満たすために、ソリューションアーキテクトはどのような対策を講じるべきでしょうか。',
    choices: [
      '静的ウェブホスティングをS3バケットに構成する。S3バケットを複数のAWSリージョンにレプリケートして、各リージョンに配信する',
      '静的ウェブホスティングをS3バケットに構成する。Amazon CloudFrontディストリビューションを構成し、S3バケットをオリジンとして設定する',
      '静的ウェブホスティングをS3バケットに構成する。Route53を利用して、各リージョンにルーティングするように構成する',
      '静的ウェブホスティングをS3バケットに構成する。S3バケットを複数のAWSリージョンにレプリケートして、Route53を利用して、各リージョンにルーティングするように構成する',
    ],
    answer: 1,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <p>4つの選択肢はどれも「S3で静的ウェブホスティング」から始まります。<strong>そこから先の速くする方法</strong>だけが違います。</p>
  <table>
    <tr><th style="width:38%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>静的ウェブサイト</td><td>中身が変わらないファイル。S3に置けば動く</td></tr>
    <tr><td>世界中のユーザー／迅速に</td><td><mark>遠くのユーザーにも速く届ける仕組みが要る</mark></td></tr>
    <tr><td>コスト効率の良い</td><td>同じ結果なら、置き場所は増やさないほうがよい</td></tr>
  </table>
  <p class="caption">「速く届ける」と「安く済ませる」は、ふつうなら相反します。両立できる方法が1つだけあります。</p>

  <h2>決め手は「倉庫を増やすか、コンビニに置くか」</h2>
  <p>遠くのユーザーが遅いのは、<strong>データが物理的に遠いから</strong>です。日本のサーバーにブラジルからアクセスすれば、地球の裏側まで往復することになります。解決策は2通りあります。</p>

  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ 各リージョンにバケットを複製する</div>
      <div class="nodes v">
        <div class="node ng">
          <span class="ico"><img src="assets/icons/amazon-simple-storage-service.svg" alt=""></span>
          <span class="lbl">東京のバケット</span>
        </div>
        <div class="link ng"><span>まるごと複製</span><span class="l">↓</span></div>
        <div class="node ng many">
          <span class="ico"><img src="assets/icons/amazon-simple-storage-service.svg" alt=""></span>
          <span class="lbl">各リージョンのバケット</span><span class="sub">保存料金が地域の数だけかかる</span>
        </div>
      </div>
      <p class="note">更新のたびに全部へ配り直し。置き場所も管理も増えます。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ CloudFrontでキャッシュする</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/amazon-simple-storage-service.svg" alt=""></span>
          <span class="lbl">S3バケット（オリジン）</span><span class="sub">1つのまま</span>
        </div>
        <div class="link ok"><span>初回だけ取りに行く</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/res-amazon-cloudfront-edge-location.svg" alt=""></span>
          <span class="lbl">世界中のエッジロケーション</span><span class="sub">2回目からは手元から返す</span>
        </div>
      </div>
      <p class="note">バケットは1つ。更新もそこを直すだけで済みます。</p>
    </div>
  </div>
  <p class="caption">CloudFrontは<strong>世界中に置かれた中継所（エッジロケーション）</strong>にコピーを預けておく仕組みです。ユーザーは自分にいちばん近い中継所から受け取ります。</p>

  <div class="nodes">
    <div class="node">
      <span class="ico"><img src="assets/icons/gen-users.svg" alt=""></span>
      <span class="lbl">世界中の<br>ユーザー</span>
    </div>
    <div class="link ok"><span>すぐ近くから</span><span class="l">⟶</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/amazon-cloudfront.svg" alt=""></span>
      <span class="lbl">CloudFront</span><span class="sub">近くの中継所が返す</span>
    </div>
    <div class="link"><span>初回のみ</span><span class="l">⟶</span></div>
    <div class="node">
      <span class="ico"><img src="assets/icons/amazon-simple-storage-service.svg" alt=""></span>
      <span class="lbl">S3バケット</span><span class="sub">1つだけ</span>
    </div>
  </div>
  <p class="caption">オリジンへ取りに行くのは<strong>最初の1回だけ</strong>。以降は中継所のコピーが使われるので、S3への通信料も減ります。</p>

  <p>たとえるなら、<mark>CloudFrontは全国のコンビニに人気商品を置いておくやり方</mark>です。倉庫は1つのままで、お客さんは近所の店で買えます。一方リージョンごとの複製は<strong>各地に倉庫そのものを建てる</strong>やり方。速くはなりますが、家賃も在庫管理も地域の数だけ増えます。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <p>どれも「速くする」ように聞こえますが、やっていることが違います。</p>
  <table>
    <tr><th style="width:26%">名前</th><th style="width:30%">やっていること</th><th>速くなるか</th></tr>
    <tr><td class="good">CloudFront</td><td class="good">近くの中継所にコピーを置く</td><td class="good">なる。置き場所は1つのまま</td></tr>
    <tr><td>S3レプリケーション</td><td>バケットそのものを複製する</td><td class="bad">なるが、保存料金が地域の数だけかかる</td></tr>
    <tr><td>Route 53</td><td>どの住所につなぐかを教える</td><td class="bad">案内するだけ。遠い相手は遠いまま</td></tr>
    <tr><td>Global Accelerator</td><td>AWSの専用網へ早く入れる</td><td class="bad">動くアプリ向け。静的ファイルならCloudFront</td></tr>
  </table>
  <p class="caption">押さえどころは<strong>Route 53は電話帳であって、配送業者ではない</strong>ということ。宛先を教えても、距離は縮まりません。</p>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. S3バケットを複数リージョンにレプリケートして各リージョンで配信する</h3>
      <p>各地にバケットを置けば確かに近くなります。ただし保存料金が地域の数だけかかり、ファイルを1つ直すたびに全リージョンへ反映を待つことになります。</p>
      <p class="why">ヒント2は満たしますが、ヒント3の「コスト効率」で落ちます。しかも<strong>宛先を振り分ける仕組みがない</strong>ので、ユーザーがどこにつなぐかを決められません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>B. CloudFrontディストリビューションを構成し、S3バケットをオリジンにする</h3>
      <p>バケットは1つのまま、世界中の中継所がコピーを預かります。ユーザーは近くの中継所から受け取るので速く、更新はオリジンを直すだけで済みます。</p>
      <p class="why">速さ（ヒント2）と安さ（ヒント3）を同時に満たします。静的サイトの定番の形です。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. Route 53で各リージョンにルーティングする</h3>
      <p>Route 53は「このサイトはここにあります」と住所を教える電話帳です。ところがバケットは1つしかないので、<strong>どこへ案内しても同じ場所に届きます</strong>。</p>
      <p class="why">案内先が増えていないので、ヒント2の「速く届ける」が実現しません。振り分ける先がそもそもありません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. 複数リージョンにレプリケートし、Route 53でルーティングする</h3>
      <p>AとCを組み合わせたもので、確かに動きます。各地にバケットがあり、Route 53が近い地域へ案内します。</p>
      <p class="why">動くけれど<strong>バケットの数だけ料金と管理が増えます</strong>。CloudFrontなら同じことがバケット1つで実現できるので、ヒント3で負けます。</p>
    </div>
  </div>

  <h2>「速さ」と「コスト」で並べると</h2>
  <table>
    <tr><th style="width:14%">選択肢</th><th style="width:22%">速くなるか</th><th style="width:28%">かかるコスト</th><th>判定</th></tr>
    <tr><td class="good">B</td><td class="good">なる</td><td class="good">バケット1つ＋配信料</td><td class="good">要件どおり</td></tr>
    <tr><td>D</td><td class="good">なる</td><td class="bad">バケットの数だけ</td><td class="bad">動くが割高</td></tr>
    <tr><td>A</td><td>近くはなる</td><td class="bad">バケットの数だけ</td><td class="bad">振り分けもできない</td></tr>
    <tr><td>C</td><td class="bad">ならない</td><td>安い</td><td class="bad">要件を満たさない</td></tr>
  </table>

  <div class="kotae">
    <p><strong>答え：B　静的ウェブホスティングをS3バケットに構成する。Amazon CloudFrontディストリビューションを構成し、S3バケットをオリジンとして設定する</strong></p>
    <p class="oboe">覚え方 —— <strong>「静的コンテンツ」＋「世界中に速く」＝ S3 ＋ CloudFront。</strong>これはAWSで最も出題される定番の組み合わせです。押さえどころは<strong>CloudFrontを使えば置き場所は1つのままでよい</strong>こと。だから<strong>「コスト効率」と書かれているのに複製する選択肢は、動いても負けます。</strong>そして<strong>Route 53は宛先を教えるだけで、それ自体は何も速くしません。</strong>この線引きで、配信系の問題はほぼ即決できます。</p>
  </div>`
  },

  {
    id: 'e1q18',
    q: 'ある企業では、AWSを活用した発注管理アプリケーションの設計を行っています。このアプリケーションを通じてユーザーが発注を行うと、12時間以内にその処理が完了する必要があります。発注内容は多様であるため、注文を分類し、適切に管理することも求められています。費用対効果と運用効率を最大限に高めながら、これらの要件を満たすための最適なソリューションはどれでしょうか。',
    choices: [
      '注文内容に応じて、複数のAmazon Kinesis Data Streamsシャードを作成する。適切なシャードにメッセージを送信するように、Amazon SNSトピックを作成する。データストリームに関連するSNSトピックにサブスクライブするようにアプリケーションを設定する',
      '注文内容に応じて、複数のAWS Lambda関数とAmazon SNSトピックを作成する。Lambda関数を関連するSNSトピックにサブスクライブして、注文に応じたSNSトピックにメッセージを発行するように設定する',
      'Amazon SNSトピックを１つ作成して、このSNSトピックに複数のAmazon SQSキューをサブスクライブする。SNSトピックにフィルターを設定して注文内容に応じて適切なSQSキューに適切なメッセージを送信するようにメッセージをフィルタリングする。注文に応じたSQSキューからメッセージを受信するようにバックエンドサーバーを設定する',
      '注文内容に応じて、複数のAmazon Kinesis Data Streamsのシャードを作成する。適切なシャードにメッセージを送信するように、ウェブアプリケーションを設定する。アプリケーションサーバーの各バックエンドグループを設定して、Kinesis Client Libraryを使用してそれぞれのデータストリームからのメッセージをプールする',
    ],
    answer: 2,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <p>選択肢が長くて読みづらい問題です。こういうときほど、<strong>問題文の条件を先に3つ取り出してから</strong>選択肢を見ます。</p>
  <table>
    <tr><th style="width:38%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td><strong>12時間以内</strong>に処理が完了</td><td><mark>すぐ処理しなくてよい。いったん溜めておける仕組みが向いている</mark></td></tr>
    <tr><td>注文を<strong>分類</strong>して管理</td><td>種類ごとに行き先を分ける必要がある</td></tr>
    <tr><td>費用対効果と運用効率</td><td>作り込みが少なく、種類が増えても手直しの小さい形</td></tr>
  </table>
  <p class="caption">「12時間以内」は非常にゆるい条件です。<strong>リアルタイム処理は求められていない</strong>という意味なので、ここで選択肢がふるいにかけられます。</p>

  <h2>決め手は「1回の放送を、種類ごとの受け箱に仕分ける」</h2>
  <p>登場するのは2つのサービスです。<strong>SNS（エスエヌエス）は校内放送</strong>で、1回しゃべると聞いている全員に届きます。<strong>SQS（エスキューエス）は各クラスの連絡ボックス</strong>で、入れたものは誰かが取り出すまで残ります。</p>
  <p>この2つを組み合わせると、<strong>1件の注文を、種類に応じた受け箱に自動で仕分けられます</strong>。しかもSNSにはフィルターという機能があり、「これは書籍の注文」といった目印を見て、<mark>該当する受け箱にだけ届ける</mark>ことができます。</p>

  <div class="nodes">
    <div class="node">
      <span class="ico"><img src="assets/icons/gen-users.svg" alt=""></span>
      <span class="lbl">発注</span>
    </div>
    <div class="link"><span>1か所に出す</span><span class="l">⟶</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/amazon-simple-notification-service.svg" alt=""></span>
      <span class="lbl">SNSトピック<br>（1つだけ）</span><span class="sub">フィルターで仕分け</span>
    </div>
    <div class="link ok"><span>種類ごとに</span><span class="l">⟶</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/amazon-simple-queue-service.svg" alt=""></span>
      <span class="lbl">SQSキュー<br>（種類の数だけ）</span><span class="sub">処理まで溜めておける</span>
    </div>
    <div class="link ok"><span class="l">⟶</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/gen-server.svg" alt=""></span>
      <span class="lbl">バックエンド<br>サーバー</span><span class="sub">自分の担当だけ処理</span>
    </div>
  </div>
  <p class="caption">この形を<strong>ファンアウト</strong>と呼びます。入口は1つ、出口は種類の数だけ。注文の種類が増えても、<strong>入口はそのままでキューを1本足すだけ</strong>です。</p>

  <p>たとえるなら、<mark>SNSは職員室からの校内放送、SQSは各クラスの連絡ボックス</mark>です。放送は1回流すだけ。ただし「これは3年生あて」という目印を付けておけば、3年生のボックスにだけ届きます。<strong>放送を聞き逃しても、ボックスに紙が残っているので大丈夫</strong>。これがSQSを挟む理由です。</p>

  <h3>なぜSQSを挟むのか</h3>
  <p>SNSだけだと、放送は<strong>流した瞬間に聞いていた人にしか届きません</strong>。サーバーが再起動中だったら、その注文は消えます。SQSを挟めば、処理されるまでメッセージが残り続けます。12時間以内でよいのだから、<strong>溜めておけることのほうが価値があります</strong>。</p>

  <h2>まぎらわしい3つを区別する</h2>
  <table>
    <tr><th style="width:24%">名前</th><th style="width:24%">正体</th><th style="width:22%">たとえ</th><th>向いていない場面</th></tr>
    <tr><td class="good">Amazon SNS</td><td class="good">同じ知らせを複数に配る</td><td class="good">校内放送</td><td class="good">1対多の配信。溜められないのでSQSと組む</td></tr>
    <tr><td class="good">Amazon SQS</td><td class="good">処理されるまで溜める行列</td><td class="good">連絡ボックス</td><td class="good">あとで処理すればよい仕事に最適</td></tr>
    <tr><td>Kinesis Data Streams</td><td>流れ続けるデータを順番に</td><td>ベルトコンベア</td><td class="bad">シャード数の設計と管理が必要。リアルタイム不要なら過剰</td></tr>
  </table>
  <p class="caption">見分け方は<strong>「すぐ処理する必要があるか」</strong>。<strong>秒単位・リアルタイム・順番が大事 → Kinesis。数時間以内でよい・仕事の受け渡し → SQS。</strong></p>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. 注文ごとにKinesisシャードを作り、SNSでシャードに振り分ける</h3>
      <p>Kinesis Data Streamsは、流れ続けるデータを受け止めるベルトコンベアです。シャードとはその通り道の本数で、<strong>何本必要かを自分で見積もって設定します</strong>。</p>
      <p class="why">ヒント1のとおり12時間以内でよいので、リアルタイム向けのKinesisは過剰です。ヒント3の「運用効率」も、シャード管理のぶん悪くなります。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. 注文の種類ごとに複数のLambda関数とSNSトピックを作る</h3>
      <p>種類ごとにトピックを作るので、<strong>注文の種類が増えるたびにトピックとLambdaを追加し、送信側のコードも直すことになります</strong>。</p>
      <p>さらにSNSから直接Lambdaを呼ぶ形なので、メッセージを溜めておく場所がありません。処理に失敗したときの作り込みも必要です。</p>
      <p class="why">ヒント3の「運用効率」に反します。<strong>正解はトピック1つで済むのに、こちらは種類の数だけ増えていきます。</strong></p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>C. SNSトピック1つに複数のSQSキューをつなぎ、フィルターで振り分ける</h3>
      <p>入口はトピック1つ。フィルターが注文の種類を見て、該当するキューにだけメッセージを届けます。各キューは処理されるまでメッセージを保持します。</p>
      <p>種類が増えたら、<strong>キューを1本足してフィルターを1行足すだけ</strong>。送信側のコードは触りません。</p>
      <p class="why">溜められる（ヒント1）、種類で分けられる（ヒント2）、増えても手直しが小さい（ヒント3）。3つを同時に満たします。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. Kinesisシャードを作り、KCLでメッセージをプールする</h3>
      <p>KCL（Kinesis Client Library）は、シャードからデータを読み取るためのライブラリです。どこまで読んだかの記録や、担当の割り振りを自分で組み込むことになります。</p>
      <p class="why">Aと同じくリアルタイム向けの道具で、しかも<strong>アプリ側の作り込みがいちばん多い</strong>選択肢です。ヒント3から最も遠くなります。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：C　Amazon SNSトピックを１つ作成して、このSNSトピックに複数のAmazon SQSキューをサブスクライブする（フィルターで振り分ける）</strong></p>
    <p class="oboe">覚え方 —— <strong>「1つの出来事を複数の宛先に配りたい」＝ SNS ＋ SQS のファンアウト。「種類ごとに振り分けたい」＝ SNSのフィルターポリシー。</strong>これが定番の形です。判断のコツは<strong>処理までに許される時間</strong>を見ること。<strong>数時間以内でよい・仕事の受け渡し → SQS。秒単位・順番が大事・大量の連続データ → Kinesis。</strong>そして<strong>「種類ごとにトピックを作る」「種類ごとに関数を作る」系の選択肢は、種類が増えるたびに作り直しになるので、運用効率を聞かれたら必ず負けます。</strong></p>
  </div>`
  },

  {
    id: 'e1q19',
    q: 'ある企業は、社内のストレージをAWSにホストすることを検討しています。このストレージは、オンプレミスのアプリケーションサーバーにiSCSIデバイスを介して接続される必要があります。さらに、移行後はAWS上のストレージをプライマリーストレージとして使用する方針です。この要件を満たすための適切な設定方法はどれでしょうか。',
    choices: [
      'S3バケットを作成して、S3コネクターをiSCSIデバイスとして利用する',
      'EBSを作成して、EBSコネクターをiSCSIデバイスとして利用する',
      'Glacierを作成して、GlacierコネクターをiSCSIデバイスとして利用する',
      'AWS Storage GatewayをISCSIデバイスとして利用する',
    ],
    answer: 3,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <p>この問題は<strong>第4問の兄弟</strong>です。同じStorage Gatewayの話ですが、条件が1つひっくり返っています。</p>
  <table>
    <tr><th style="width:38%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td><strong>オンプレミス</strong>のサーバーから使う</td><td>社内の機械とAWSをつなぐ中継役が要る</td></tr>
    <tr><td><strong>iSCSI</strong>デバイスを介して接続</td><td>1本のディスクとして見せる方式。ファイル共有でもテープでもない</td></tr>
    <tr><td>AWS上のストレージを<strong>プライマリー</strong>に</td><td><mark>データの本体はAWS側。ローカルには置ききらない</mark></td></tr>
  </table>
  <p class="caption">iSCSI（アイスカジー）とは、ネットワーク越しのストレージを<strong>パソコンに直接つないだディスクのように見せる</strong>約束ごとです。「iSCSI」と書いてあれば、ブロックストレージの話だと決まります。</p>

  <h2>決め手は「そんな名前のサービスは存在しない」こと</h2>
  <p>選択肢A・B・Cはどれも「◯◯コネクター」という名前です。<strong>AWSにS3コネクター、EBSコネクター、Glacierコネクターというサービスはありません。</strong>実在しない名前で作られたダミーです。</p>
  <p>オンプレミスのサーバーからAWSのストレージをiSCSIで使う方法は、AWSには1つしかありません。それが<strong>AWS Storage Gateway</strong>です。</p>

  <div class="nodes">
    <div class="node">
      <span class="ico"><img src="assets/icons/group-corporate-data-center.svg" alt=""></span>
      <span class="lbl">オンプレミスの<br>アプリサーバー</span>
    </div>
    <div class="link"><span>iSCSI で接続</span><span class="l">⟶</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/aws-storage-gateway.svg" alt=""></span>
      <span class="lbl">Storage Gateway<br>（ボリュームゲートウェイ）</span><span class="sub">1本のディスクに見せる</span>
    </div>
    <div class="link ok"><span>本体を預ける</span><span class="l">⟶</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/amazon-simple-storage-service.svg" alt=""></span>
      <span class="lbl">Amazon S3</span><span class="sub">データの本体はここ</span>
    </div>
  </div>
  <p class="caption">サーバーから見れば、つながっているのは<strong>ふつうのディスク1本</strong>です。その裏でAWSにデータが置かれていることを、アプリは知りません。</p>

  <p>たとえるなら、<mark>Storage Gatewayは社内と倉庫をつなぐ受付カウンター</mark>です。社員は「棚から取ってきて」と頼むだけ。実際の荷物が社内にあるのか遠くの倉庫にあるのかを、社員は意識しません。</p>

  <h2>第4問との違い：どちらが本体か</h2>
  <p>第4問は「ローカルをメイン、S3をバックアップ」だったので<strong>保管型</strong>でした。今回は逆です。</p>
  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">保管型（第4問の答え）</div>
      <div class="nodes v">
        <div class="node"><span class="lbl">オンプレのディスク</span><span class="sub">データ全部がここ</span></div>
        <div class="link"><span>控えを送る</span><span class="l">↓</span></div>
        <div class="node dim"><span class="lbl">S3</span><span class="sub">バックアップ</span></div>
      </div>
      <p class="note">「ローカルをメインに」と書いてあるときはこちら。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">キャッシュ型（今回の答え）</div>
      <div class="nodes v">
        <div class="node ok"><span class="lbl">オンプレのディスク</span><span class="sub">よく使う分だけ</span></div>
        <div class="link ok"><span>本体はこちら</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/amazon-simple-storage-service.svg" alt=""></span>
          <span class="lbl">S3</span><span class="sub">データ全部がここ</span>
        </div>
      </div>
      <p class="note">「AWSをプライマリーに」と書いてあるときはこちら。</p>
    </div>
  </div>
  <p class="caption">選択肢では起動タイプまで問われていませんが、<strong>「AWSをプライマリーストレージに」＝キャッシュ型ボリューム</strong>だと読めるようにしておきます。</p>

  <h2>実在するもの・しないものを区別する</h2>
  <p>試験には<strong>もっともらしいが存在しない名前</strong>が混ざります。見分けられれば一瞬で正解できます。</p>
  <table>
    <tr><th style="width:26%">選択肢の名前</th><th style="width:20%">実在するか</th><th>本当のところ</th></tr>
    <tr><td>S3コネクター</td><td class="bad">存在しない</td><td>S3はオブジェクトの置き場。iSCSIでは直接つながらない</td></tr>
    <tr><td>EBSコネクター</td><td class="bad">存在しない</td><td>EBSは実在するが、<strong>EC2に付けるディスク</strong>。オンプレからは使えない</td></tr>
    <tr><td>Glacierコネクター</td><td class="bad">存在しない</td><td>Glacierは実在するが、めったに出さないものをしまう保管庫</td></tr>
    <tr><td class="good">AWS Storage Gateway</td><td class="good">存在する</td><td class="good">オンプレとAWSストレージをつなぐ唯一の正規の道</td></tr>
  </table>
  <p class="caption">見分け方は<strong>「AWSのサービス名として聞いたことがあるか」</strong>。聞いたことのない名前が並んでいたら、残った1つが答えである可能性が高くなります。</p>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. S3バケットを作り、S3コネクターをiSCSIデバイスとして利用する</h3>
      <p>S3は<strong>ファイルを1つずつ預ける倉庫</strong>で、ディスクのように読み書きする作りにはなっていません。そして「S3コネクター」というサービスは存在しません。</p>
      <p class="why">ヒント2の「iSCSIで1本のディスクとして見せる」を実現できません。名前の時点で成立していません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. EBSを作り、EBSコネクターをiSCSIデバイスとして利用する</h3>
      <p>EBSはディスクなので、一見いちばん近そうに見えます。しかしEBSは<strong>AWSの中のEC2インスタンスに取り付けるためのもの</strong>で、オンプレミスのサーバーからは使えません。</p>
      <p class="why">ヒント1の「オンプレミスから使う」を満たしません。<strong>いちばん惜しく見える選択肢</strong>なので注意します。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. Glacierを作り、GlacierコネクターをiSCSIデバイスとして利用する</h3>
      <p>Glacierは<strong>めったに出さないものを安くしまっておく冷凍庫</strong>です。取り出しに手間と時間がかかります。</p>
      <p class="why">ヒント3の「プライマリーストレージとして使う」＝毎日読み書きする、とは正反対の性格です。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>D. AWS Storage GatewayをiSCSIデバイスとして利用する</h3>
      <p>オンプレミスに置いたゲートウェイが、アプリサーバーからは1本のディスクとして見えます。その裏でデータはS3に保存され、よく使う分だけ手元に残ります。</p>
      <p class="why">オンプレから使えて（ヒント1）、iSCSIで1本のディスクに見えて（ヒント2）、本体をAWSに置ける（ヒント3）。3つすべてを満たします。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：D　AWS Storage GatewayをiSCSIデバイスとして利用する</strong></p>
    <p class="oboe">覚え方 —— <strong>「オンプレミス」と「AWSのストレージ」が同じ問題文に出てきたら、答えはAWS Storage Gateway。</strong>ほぼこれだけで決まります。そのうえで<strong>iSCSI＝ボリュームゲートウェイ、NFS／SMB＝ファイルゲートウェイ、テープ＝テープゲートウェイ</strong>と3タイプを結び付けます。起動タイプは<strong>「AWSをプライマリーに」＝キャッシュ型、「ローカルをメインに」＝保管型</strong>（第4問を参照）。そして<strong>「◯◯コネクター」のような聞いたことのない名前は、たいてい実在しないダミー</strong>です。</p>
  </div>`
  },

  {
    id: 'e1q20',
    q: 'ある企業では、EC2インスタンス上でバッチ処理ワークロードを運用しています。このワークロードは複数のAmazon EC2インスタンスを活用しており、ステートレスな特性を持っています。そのため、インスタンス処理を途中で停止したり再開したりすることが容易です。全体の処理時間は約1時間を要します。あなたはソリューションアーキテクトとして、コストの最適化を求められています。コスト最適化を実現するために、ソリューションアーキテクトはどのインスタンスタイプを選択すべきでしょうか。',
    choices: [
      'スポットインスタンスを利用する',
      'リザーブドインスタンスを利用する',
      'オンデマンドインスタンスを利用する',
      'ベアメタルインスタンスを利用する',
    ],
    answer: 0,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <p>EC2の料金の選び方は、<strong>ワークロードの性格</strong>で決まります。問題文はその性格をていねいに書いてくれています。</p>
  <table>
    <tr><th style="width:38%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td><strong>ステートレス</strong>な特性</td><td>途中経過をサーバーに溜めていない。どのインスタンスが担当してもよい</td></tr>
    <tr><td>途中で<strong>停止したり再開したり</strong>することが容易</td><td><mark>急に中断されても困らない。これが決め手</mark></td></tr>
    <tr><td>処理時間は約1時間</td><td>ずっと動かし続けるわけではない</td></tr>
  </table>
  <p class="caption">「ステートレス」とは、作業の途中経過をそのサーバーの中に持たない作り方のことです。持っていないので、<strong>いつ止められても最初からやり直せます</strong>。</p>

  <h2>決め手は「中断されても平気かどうか」</h2>
  <p>スポットインスタンスは、AWSの<strong>空いているサーバーを格安で借りる</strong>仕組みです。オンデマンド料金の最大90%引きになります。ただし条件があり、<mark>AWS側でそのサーバーが必要になると、2分前の通知のあと取り上げられます</mark>。</p>

  <div class="bars">
    <div class="barrow"><div class="name">オンデマンド</div><div class="bar dark" style="width:100%">定価（いつでも使える）</div></div>
    <div class="barrow"><div class="name">リザーブド</div><div class="bar dark" style="width:40%">最大72%引き</div></div>
    <div class="barrow"><div class="name">スポット</div><div class="bar green" style="width:12%">最大90%引き</div></div>
  </div>
  <p class="caption">棒の長さが料金のイメージです。スポットが圧倒的に安いのは、<strong>中断されるという条件を引き受けているから</strong>です。</p>

  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ 中断されると困る仕事</div>
      <div class="nodes v">
        <div class="node ng"><span class="lbl">途中経過をサーバーに持っている</span></div>
        <div class="link ng"><span>取り上げられると</span><span class="l">↓</span></div>
        <div class="node ng"><span class="lbl">作業が失われる</span><span class="sub">やり直しが効かない</span></div>
      </div>
      <p class="note">Webサーバーやデータベースはこちら。スポットは使えません。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ 今回のバッチ処理</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/res-amazon-ec2-spot-instance.svg" alt=""></span>
          <span class="lbl">ステートレス</span><span class="sub">途中経過を持たない</span>
        </div>
        <div class="link ok"><span>取り上げられても</span><span class="l">↓</span></div>
        <div class="node ok"><span class="lbl">別のインスタンスが続きをやる</span><span class="sub">困らない</span></div>
      </div>
      <p class="note">問題文が「停止・再開が容易」と書いているのは、この確認です。</p>
    </div>
  </div>
  <p class="caption">問題文の「ステートレス」「停止・再開が容易」は、<strong>スポットインスタンスを選んでよいという許可証</strong>です。この言葉が出てきたら迷いません。</p>

  <p>たとえるなら、<mark>スポットインスタンスは劇場の当日キャンセル席</mark>です。空いていれば破格で観られますが、正規の予約客が来たら席を譲ることになります。何度でも観に来られる人なら、これが一番お得です。<strong>リザーブドは年間の指定席予約</strong>で、毎回必ず来る人向け。オンデマンドは当日の正規料金です。</p>

  <h2>4つの料金体系を区別する</h2>
  <table>
    <tr><th style="width:20%">種類</th><th style="width:20%">安さ</th><th style="width:24%">中断されるか</th><th>選ぶ場面</th></tr>
    <tr><td class="good">スポット</td><td class="good">最大90%引き</td><td class="good">される（2分前に通知）</td><td class="good">中断されても平気な処理。バッチ・解析・レンダリング</td></tr>
    <tr><td>リザーブド<br>／Savings Plans</td><td>最大72%引き</td><td>されない</td><td class="bad">1年・3年ずっと動かし続けるもの</td></tr>
    <tr><td>オンデマンド</td><td>定価</td><td>されない</td><td class="bad">いつ使うか読めない。短期で中断も困る</td></tr>
    <tr><td>ベアメタル</td><td class="bad">高い</td><td>されない</td><td class="bad">物理サーバーそのものが必要なとき。コストの話ではない</td></tr>
  </table>
  <p class="caption">ベアメタルだけ<strong>料金体系ではなく、インスタンスの種類</strong>です。仮想化なしの物理サーバーがほしいときに選ぶもので、安さとは無関係です。</p>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>A. スポットインスタンスを利用する</h3>
      <p>空いているサーバーを最大90%引きで借ります。取り上げられることがありますが、この処理はステートレスなので、別のインスタンスがやり直せば済みます。</p>
      <p class="why">ヒント1とヒント2が「中断されても平気」と保証しているので、いちばん安いものを選べます。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. リザーブドインスタンスを利用する</h3>
      <p>「1年間このぶんは必ず使います」と約束する代わりに安くなる仕組みです。約束した期間はずっと料金が発生します。</p>
      <p class="why">ヒント3のとおり、この処理は1時間で終わります。<strong>使っていない時間まで払い続ける</strong>ので、コスト最適化にはなりません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. オンデマンドインスタンスを利用する</h3>
      <p>使った分だけ定価で払う、いちばん基本の形です。中断されない安心はありますが、割引はありません。</p>
      <p class="why">動きはしますが、<strong>中断されても平気なのに定価を払う</strong>ことになります。問題はコスト最適化を求めているので負けます。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. ベアメタルインスタンスを利用する</h3>
      <p>これは料金の選び方ではなく、<strong>仮想化されていない物理サーバーそのものを借りる</strong>種類です。特殊なソフトウェアのライセンス条件などで必要になります。</p>
      <p class="why">安くなるどころか高くつきます。ヒントのどれとも関係がありません。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：A　スポットインスタンスを利用する</strong></p>
    <p class="oboe">覚え方 —— <strong>「ステートレス」「中断されても平気」「停止・再開が容易」「やり直せる」と書いてあったら、答えはスポットインスタンス（最大90%引き）。</strong>これはSAAで最も分かりやすい合図です。逆に<strong>「1年以上ずっと動かす」「常時稼働」ならリザーブドインスタンスかSavings Plans（最大72%引き）</strong>、<strong>「いつ使うか読めない」「中断が許されない短期」ならオンデマンド</strong>。<strong>ベアメタルは料金の話ではなく物理サーバーが必要なときの選択肢</strong>なので、コスト最適化の問題に出てきたら必ずダミーです。</p>
  </div>`
  },

  {
    id: 'e1q21',
    q: 'ある会社は、AWS Marketplaceから提供されているサードパーティ製のWEBアプリケーションの利用を検討している。このアプリケーションを活用するには、同社のAWSアカウント内で稼働しているEC2インスタンスへのAPI経由のアクセスが必要である。同社のセキュリティポリシーに基づき、WEBアプリケーションのアクセス権限は、その業者のみが利用できるように制限し、第三者による不正利用を防ぐ必要がある。これらの要件をすべて満たすソリューションはどれか。',
    choices: [
      'サードパーティ製のWEBアプリケーションが必要とする権限のみに限定したIAMポリシーを設定したクロスアカウントアクセス用のIAMロールを作成する。そのIAMロールを外部WEBアプリケーションに設定する',
      'サードパーティ製のWEBアプリケーションのAPIへのアクセス権限を有したIAMロールをEC2インスタンスに割り当てて、EC2インスタンスと外部WEBアプリケーションを連携する',
      'サードパーティ製のWEBアプリケーションが必要とする権限のみに限定したIAMロールをAPI Gatewayに設定して、API経由でEC2インスタンスと外部WEBアプリケーションを連携する',
      'サードパーティ製のWEBアプリケーションが必要とする権限のみに限定したIAMユーザーを設定して、ベンダーに提供する。そのIAMユーザーに対してAWS Organizationsによるクロスアカウント連携を実施する',
    ],
    answer: 0,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <p>問題文には、答えを決めるためのヒントが3つ隠れています。先に取り出しておかないと、選択肢が全部それっぽく見えてしまいます。</p>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>サードパーティ製（別会社）のWEBアプリケーション</td><td>権限をあげる相手は<strong>自分のAWSアカウントの外</strong>にいる。アカウントをまたぐ話になる</td></tr>
    <tr><td>必要とする権限のみに限定</td><td>全部の権限を渡してはいけない。使う分だけに絞る（最小権限）</td></tr>
    <tr><td>第三者による不正利用を防ぐ</td><td><mark>渡した鍵が盗まれても被害が出ない仕組み</mark>でなければならない</td></tr>
  </table>

  <h2>「鍵を渡す」か「合鍵を毎回その場で作る」か</h2>
  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ IAMユーザーを作ってアクセスキーを渡す</div>
      <div class="nodes v">
        <div class="node ng">
          <span class="ico"><img src="assets/icons/res-aws-identity-access-management-long-term-security-credential.svg" alt=""></span>
          <span class="lbl">アクセスキー</span><span class="sub">ずっと同じ・期限なし</span>
        </div>
        <div class="link ng"><span>メールなどで手渡し</span><span class="l">↓</span></div>
        <div class="node ng">
          <span class="ico"><img src="assets/icons/gen-office-building.svg" alt=""></span>
          <span class="lbl">業者の会社</span><span class="sub">保管方法はこちらで管理できない</span>
        </div>
      </div>
      <p class="note">1回渡したら、こちらからは取り消すまで永久に有効です。漏れたら誰でも使えてしまいます。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ クロスアカウント用のIAMロールを引き受けてもらう</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/group-aws-account.svg" alt=""></span>
          <span class="lbl">業者のAWSアカウント</span><span class="sub">相手は自分のアカウントで動く</span>
        </div>
        <div class="link ok"><span>ロールを引き受ける（AssumeRole）</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/res-aws-identity-access-management-role.svg" alt=""></span>
          <span class="lbl">クロスアカウントIAMロール</span><span class="sub">信頼するアカウントを名指しで指定</span>
        </div>
        <div class="link ok"><span>数時間で切れる一時的な鍵が発行される</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/amazon-ec2.svg" alt=""></span>
          <span class="lbl">自社のEC2インスタンス</span><span class="sub">許した操作だけ実行できる</span>
        </div>
      </div>
      <p class="note">鍵は毎回その場で作られ、数時間で自動的に無効になります。信頼するアカウントを名指ししているので、他の業者は引き受けられません。</p>
    </div>
  </div>
  <p class="caption">左は合鍵を配ってしまう方式、右は毎回フロントで一時的な入館証を発行する方式です。</p>
  <p>ホテルのルームキーを思い出してください。<strong>永久に使える金属の鍵を郵送する</strong>のと、<strong>チェックアウト時刻で自動的に無効になるカードキーをフロントで渡す</strong>のとでは、落としたときの怖さがまるで違います。IAMロールは後者です。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <table>
    <tr><th style="width:26%">名前</th><th style="width:36%">正体（たとえ）</th><th>できないこと・向かないこと</th></tr>
    <tr><td>IAMユーザー</td><td>社員証。ずっと使えるアクセスキーがついてくる</td><td>期限がない。社外の人に渡すと回収できるまで有効なまま</td></tr>
    <tr><td class="good">IAMロール（クロスアカウント）</td><td class="good">フロントで発行する一時入館証。「どの会社の人なら受け取れるか」を名指しで書いておける</td><td>引き受ける側にもAWSアカウントが必要（今回は業者が持っている）</td></tr>
    <tr><td>IAMロール（EC2に割り当て）</td><td>自分のEC2に持たせる作業員バッジ。<strong>EC2が他のサービスを呼ぶため</strong>のもの</td><td>向きが逆。外から自分のEC2を呼んでもらう用途には使えない</td></tr>
    <tr><td>AWS Organizations</td><td>グループ会社をまとめる本社機能。請求の統合や全社ルールの適用に使う</td><td>他社のアカウントを勝手に自分の組織へ入れることはできない</td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>A. 権限を限定したIAMポリシーを持つクロスアカウント用IAMロールを作り、外部WEBアプリに設定する</h3>
      <p>業者のアカウントだけが引き受けられるIAMロールを用意し、必要な操作だけを許します。渡るのは有効期限つきの一時的な鍵です。</p>
      <p class="why">ヒント1（相手はアカウントの外）、ヒント2（権限を絞る）、ヒント3（盗まれても期限切れになる）を全部満たします。これが正解です。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. WEBアプリのAPIへのアクセス権限を持つIAMロールをEC2インスタンスに割り当てる</h3>
      <p>EC2に持たせるIAMロールは、<strong>EC2が外に向かって何かをするときの権限</strong>です。EC2自身の作業員バッジだと思ってください。</p>
      <p class="why">矢印の向きが逆です。今回必要なのは「外の業者が自社のEC2を呼ぶ」権限なので、ヒント1を満たしません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. IAMロールをAPI Gatewayに設定して、API経由で連携する</h3>
      <p>Amazon API Gatewayは、自分で作ったAPIの受付窓口を用意するサービスです。今回アクセスしたいのはEC2インスタンスのAPIであって、新しい窓口を作る話ではありません。</p>
      <p class="why">求められていない部品を1つ増やすだけで、「業者だけに限定する」というヒント3の答えになっていません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. IAMユーザーを作ってベンダーに提供し、AWS Organizationsでクロスアカウント連携する</h3>
      <p>IAMユーザーを社外に渡すのは、<strong>期限のない合鍵を郵送する</strong>のと同じです。さらにAWS Organizationsは自分のグループ会社をまとめる機能で、他社を勝手に加えることはできません。</p>
      <p class="why">ヒント3（盗まれても被害が出ない）に真正面から反します。SAAでは「外部に渡すIAMユーザー」はほぼ必ず不正解です。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：A　権限を限定したIAMポリシーを設定したクロスアカウントアクセス用のIAMロールを作成し、外部WEBアプリケーションに設定する</strong></p>
    <p class="oboe">覚え方 —— <strong>「他社・別アカウント・サードパーティに権限を渡す」と書いてあったら、答えはクロスアカウントのIAMロール。IAMユーザーとアクセスキーを外に出す選択肢は即座に消す。</strong>あわせて向きも覚えます。<strong>EC2に付けるIAMロールは「EC2が外を呼ぶ」ため、クロスアカウントIAMロールは「外がこちらを呼ぶ」ため。</strong></p>
  </div>`
  },

  {
    id: 'e1q22',
    q: 'ある企業は、静的コンテンツをAmazon S3バケットに保存するWebアプリケーションを開発している。非機能要件として、S3バケットは1秒間に3500件を超えるPUTリクエストを迅速に処理するパフォーマンスを持つ必要がある。その際は最もファイル管理がしやすい方式であることが求められる。最適なパフォーマンスを確保するためには、どのような対策を講じるべきか。',
    choices: [
      'オブジェクトキー名にランダムPrefixを利用する',
      'オブジェクトキー名に日付などのPrefixを利用する',
      'マルチパートアップロードを利用する',
      'S3のライフサイクル管理を有効化する',
    ],
    answer: 1,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>1秒間に3500件を超えるPUTリクエスト</td><td>S3の書き込み上限そのものの数字。<strong>3,500 PUT/秒はプレフィックス1つあたりの上限</strong>だと気づけるかが勝負</td></tr>
    <tr><td>迅速に処理するパフォーマンス</td><td>上限を超えるには、置き場所（プレフィックス）を分けて上限を足し算する</td></tr>
    <tr><td>最もファイル管理がしやすい方式</td><td><mark>速いだけではダメで、人間が後から探せること</mark>が条件に入っている</td></tr>
  </table>

  <h2>プレフィックスは「棚」。棚を増やすと上限も増える</h2>
  <p>プレフィックスとは、オブジェクトキー名の<code>/</code>で区切られた前半部分のことです。<code>2026/09/15/click.log</code> なら <code>2026/09/15/</code> がプレフィックスにあたります。S3は<strong>プレフィックス1つにつき毎秒3,500回の書き込み</strong>をさばけるので、棚を分ければその分だけ速くなります。</p>
  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ プレフィックスを分けない</div>
      <div class="nodes v">
        <div class="node many ng">
          <span class="ico"><img src="assets/icons/gen-client.svg" alt=""></span>
          <span class="lbl">アップロード</span><span class="sub">毎秒5,000件</span>
        </div>
        <div class="link ng"><span>全部おなじ棚へ</span><span class="l">↓</span></div>
        <div class="node ng">
          <span class="ico"><img src="assets/icons/gen-folder.svg" alt=""></span>
          <span class="lbl">プレフィックス1つ</span><span class="sub">上限 3,500 PUT/秒 → あふれる</span>
        </div>
      </div>
      <p class="note">棚が1つしかないので、上限の3,500を超えた分は待たされます。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ 日付でプレフィックスを分ける</div>
      <div class="nodes v">
        <div class="node many ok">
          <span class="ico"><img src="assets/icons/gen-client.svg" alt=""></span>
          <span class="lbl">アップロード</span><span class="sub">毎秒5,000件</span>
        </div>
        <div class="link ok"><span>日付ごとに振り分け</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/gen-folders.svg" alt=""></span>
          <span class="lbl">2026/09/15/ ・ 2026/09/16/ …</span><span class="sub">棚の数だけ 3,500 PUT/秒 が積み上がる</span>
        </div>
      </div>
      <p class="note">速さが出るうえに、「9月15日のファイル」を人間がそのまま探せます。</p>
    </div>
  </div>
  <p class="caption">プレフィックスは図書館の棚です。窓口が1つだと行列ができ、棚を分ければ同時にさばけます。</p>
  <p>ランダムな文字列（<code>a7f3k9/click.log</code>）でも棚は分かれるので速さは出ます。でもそれは、<strong>図書館の本を全部バラバラの棚に適当に置く</strong>ようなものです。探すときに地獄を見ます。日付なら速さも管理しやすさも両取りできます。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <table>
    <tr><th style="width:26%">名前</th><th style="width:36%">何のための機能か</th><th>できないこと・向かないこと</th></tr>
    <tr><td>ランダムPrefix</td><td>昔（2018年以前）に推奨された、書き込み分散の裏技</td><td>人間が中身を推測できない。「管理しやすい」という条件に負ける</td></tr>
    <tr><td class="good">日付などのPrefix</td><td class="good">棚を分けて上限を増やしつつ、名前から中身が分かる</td><td>1日に極端な集中がある場合はさらに細かく分ける工夫がいる</td></tr>
    <tr><td>マルチパートアップロード</td><td><strong>1個の巨大ファイル</strong>を分割して並列に送る仕組み</td><td>小さいファイルを大量に送る速度は上がらない。今回の論点と別</td></tr>
    <tr><td>ライフサイクル管理</td><td>古くなったデータを安いクラスへ自動で移す、コストの機能</td><td>書き込み性能とは無関係</td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. オブジェクトキー名にランダムPrefixを利用する</h3>
      <p>かつてS3の性能を出すための定番でしたが、現在はS3側が自動で内部分割するようになり、必須ではなくなりました。</p>
      <p class="why">速さのヒント1・2は満たしますが、<strong>ヒント3の「最もファイル管理がしやすい」で負けます</strong>。名前から中身が分からないからです。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>B. オブジェクトキー名に日付などのPrefixを利用する</h3>
      <p>日付でプレフィックスを分けると、棚の数だけ毎秒3,500件の上限が積み上がります。そのうえ名前を見れば、いつのデータかが一目で分かります。</p>
      <p class="why">3つのヒントを全部満たす唯一の選択肢です。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. マルチパートアップロードを利用する</h3>
      <p>これは<strong>1個の大きなファイルを小分けにして同時に送る</strong>仕組みです。100MBを超えるファイルを速く上げたいときに使います。</p>
      <p class="why">問題文が言っているのは「1秒あたりのリクエスト件数」です。ファイル1個の大きさの話ではないので、ヒント1と噛み合いません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. S3のライフサイクル管理を有効化する</h3>
      <p>「30日たったら安いクラスへ移す」といったルールを自動で回す機能です。倉庫の整理係にあたります。</p>
      <p class="why">コストの話であって、書き込みの速さは1ミリも変わりません。ヒントのどれにも答えていません。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：B　オブジェクトキー名に日付などのPrefixを利用する</strong></p>
    <p class="oboe">覚え方 —— <strong>S3の性能上限は「プレフィックスあたり 毎秒3,500 PUT／5,500 GET」。超えたいならプレフィックスを分ける。</strong>そして<strong>「管理しやすさ」も条件に入っていたら、ランダムではなく日付。</strong>さらにセットで、<strong>マルチパートアップロードは「1ファイルが大きい」ときの答え、ライフサイクルは「コスト」のときの答え</strong>と覚えておくと、この4択は毎回0秒で切れます。</p>
  </div>`
  },

  {
    id: 'e1q23',
    q: 'ある企業が自社の文書管理システムとしてAmazon S3バケットを導入しようとしている。初期段階では保存される文書が頻繁に利用される可能性があるが、4か月後には利用頻度が大幅に減少し、ほとんどアクセスされなくなる見込みである。したがって、これらの文書をアーカイブする必要がある。その際、コストを最適化することが求められる。この要件を満たすためには、どのようなS3バケット設定が必要か。',
    choices: [
      'S3 Standard IAにデータを蓄積して、4カ月後にGlacier Instant Retrievalに移行するライフサイクルルールを設定する',
      'S3 Standardにデータを蓄積して、4カ月後にGlacier Deep Archiveに移行するライフサイクルルールを設定する',
      'S3 Standardにデータを蓄積して、4カ月後にGlacier Instant Retrievalに移行するライフサイクルルールを設定する',
      'S3 Standard IAにデータを蓄積して、4カ月後にGlacier Deep Archiveに移行するライフサイクルルールを設定する',
    ],
    answer: 1,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>初期段階では頻繁に利用される</td><td>最初の置き場所は<strong>取り出し料金がかからないS3 Standard</strong>。IAを選ぶと取り出すたびにお金を取られる</td></tr>
    <tr><td>4か月後にはほとんどアクセスされなくなる</td><td>4か月でルールを切り替える。ライフサイクルルールの出番</td></tr>
    <tr><td>アーカイブする／コストを最適化</td><td><mark>「アーカイブ」は倉庫の奥にしまう合図。いちばん安いクラスを選ぶ</mark></td></tr>
  </table>

  <h2>保存クラスは「時間とともに移す」もの</h2>
  <div class="flow">
    <div class="step">
      <div class="ico"><img src="assets/icons/amazon-simple-storage-service.svg" alt=""></div>
      <div class="num">0か月目</div>
      <div class="ttl">S3 Standard</div>
      <div class="sub">机の引き出し。取り出し料金は無料で、何度読んでも追加コストなし</div>
    </div>
    <div class="arrow">⟶</div>
    <div class="step">
      <div class="ico"><img src="assets/icons/gen-gear.svg" alt=""></div>
      <div class="num">4か月目</div>
      <div class="ttl">ライフサイクルルールが発動</div>
      <div class="sub">「作成から120日たったら移す」と1回書いておくだけ。人は何もしない</div>
    </div>
    <div class="arrow">⟶</div>
    <div class="step">
      <div class="ico"><img src="assets/icons/res-amazon-simple-storage-service-s3-glacier-deep-archive.svg" alt=""></div>
      <div class="num">4か月目以降</div>
      <div class="ttl">S3 Glacier Deep Archive</div>
      <div class="sub">倉庫の最奥。S3標準のおよそ23分の1の保管料。取り出しは12時間ほどかかる</div>
    </div>
  </div>
  <p class="caption">人間がやることは、最初に移行ルールを1行書くことだけです。</p>
  <p>これは<strong>教科書の置き場所</strong>と同じ考え方です。学期中は机の上（Standard）、学年が終わったら押し入れの奥（Deep Archive）。押し入れから出すのに少し手間はかかりますが、場所代はほとんどかかりません。</p>

  <h2>まぎらわしい4つのクラスを区別する</h2>
  <table>
    <tr><th style="width:24%">クラス</th><th style="width:22%">取り出しにかかる時間</th><th style="width:20%">保管料の目安</th><th>向かないこと</th></tr>
    <tr><td>S3 Standard</td><td>すぐ（ミリ秒）</td><td>高い</td><td>ほとんど読まないデータを置き続けるのはムダ</td></tr>
    <tr><td>S3 Standard-IA</td><td>すぐ（ミリ秒）</td><td>やや安い</td><td><strong>読むたびに取り出し料金がかかる</strong>。頻繁に読む最初の4か月には不向き</td></tr>
    <tr><td>Glacier Instant Retrieval</td><td>すぐ（ミリ秒）</td><td>安い</td><td>「すぐ読める」ぶんDeep Archiveより高い。即時性を求められていない今回は割高</td></tr>
    <tr><td class="good">Glacier Deep Archive</td><td class="good">12時間ほど</td><td class="good">最安</td><td>すぐ読みたいデータには使えない。最低保存期間は180日</td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. S3 Standard-IAに蓄積し、4か月後にGlacier Instant Retrievalへ移行する</h3>
      <p>最初からIA（低頻度アクセス）に置く構成です。IAは保管料が安いかわりに、<strong>読み出すたびにGBあたりの料金</strong>が発生します。</p>
      <p class="why">ヒント1の「初期段階では頻繁に利用される」に反します。移行先がInstant Retrievalなのもヒント3に対して割高です。二重に外しています。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>B. S3 Standardに蓄積し、4か月後にGlacier Deep Archiveへ移行する</h3>
      <p>よく読む最初の4か月はStandard、読まなくなったら最安のDeep Archiveへ。ライフサイクルルールが自動で運びます。</p>
      <p class="why">ヒント1（最初は頻繁）、ヒント2（4か月で切り替え）、ヒント3（アーカイブ＋最安）を全部満たします。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. S3 Standardに蓄積し、4か月後にGlacier Instant Retrievalへ移行する</h3>
      <p>前半は正しい構成です。問題は移行先で、Instant Retrievalは「めったに読まないが、読むときは一瞬で欲しい」データ向けのクラスです。</p>
      <p class="why">動きはしますが、問題文には「すぐ取り出したい」とは一言も書いてありません。<strong>要件にない速さにお金を払っている</strong>ので、ヒント3のコスト最適化で負けます。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. S3 Standard-IAに蓄積し、4か月後にGlacier Deep Archiveへ移行する</h3>
      <p>移行先はいちばん安く、ヒント3には合っています。しかし最初の置き場所がIAのままです。</p>
      <p class="why">よく読む時期にIAを使うと取り出し料金がかさみ、かえって高くつきます。ヒント1を満たしません。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：B　S3 Standardにデータを蓄積して、4カ月後にGlacier Deep Archiveに移行するライフサイクルルールを設定する</strong></p>
    <p class="oboe">覚え方 —— <strong>置き始めの判定は「最初によく読むか」だけ。よく読むならStandard、最初から読まないならIA。</strong>移行先の判定は「取り出しの速さを要求されているか」だけ。<strong>速さの指定がなく「アーカイブ」「コスト最適」とだけ書いてあればGlacier Deep Archive（最安・取り出し12時間）。「めったに読まないがすぐ欲しい」と書いてあればGlacier Instant Retrieval。</strong>この2段構えで、S3クラスの問題はほぼ機械的に解けます。</p>
  </div>`
  },

  {
    id: 'e1q24',
    q: 'ある企業は、AWS上でホストされている一連のアプリケーションの運用を行っている。アプリケーション間の連携を実現するためにAmazon API Gatewayを導入することに決定した。そのため、Amazon API Gateway APIに対する権限管理を行い、API呼び出し時にAPIコール元に対して適切なアクセス権限を設定する必要がある。この要件を満たすためのAPI Gatewayの最も適切な設定方法はどれか。',
    choices: [
      'AWS STSを利用して、APIコールの呼び出し元に対して権限を付与する',
      'IAMポリシーを利用して、APIコールの呼び出し元に対して権限を付与する',
      'AWS Configを利用して、APIコールの呼び出し元に対して権限を付与する',
      'IAMアクセスキーを利用して、APIコールの呼び出し元に対して権限を付与する',
    ],
    answer: 1,
    explain: `
  <h2>まず、問題文の中の「2つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>AWS上でホストされているアプリケーション間の連携</td><td>呼ぶ側も呼ばれる側も<strong>AWSの中にいる</strong>。IAMで身元が分かる相手同士の話</td></tr>
    <tr><td>APIコール元に対して適切なアクセス権限を設定する</td><td><mark>「誰が、どのAPIを呼んでよいか」を書いたルールが要る</mark>。AWSでルールを書く道具はIAMポリシー</td></tr>
  </table>

  <h2>API Gatewayの前に立つ「門番」は誰か</h2>
  <div class="nodes v">
    <div class="node">
      <span class="ico"><img src="assets/icons/gen-client.svg" alt=""></span>
      <span class="lbl">呼び出し元アプリ</span><span class="sub">EC2やLambdaなど。IAMロールを持っている</span>
    </div>
    <div class="link"><span>署名つきでAPIを呼ぶ</span><span class="l">↓</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/aws-identity-and-access-management.svg" alt=""></span>
      <span class="lbl">IAMポリシーによる判定</span><span class="sub">「このAPIのこのメソッドを実行してよい」と書いてあるか照合する</span>
    </div>
    <div class="link ok"><span>許可されていれば通す</span><span class="l">↓</span></div>
    <div class="node">
      <span class="ico"><img src="assets/icons/amazon-api-gateway.svg" alt=""></span>
      <span class="lbl">Amazon API Gateway</span><span class="sub">APIの受付窓口</span>
    </div>
  </div>
  <p class="caption">IAMポリシーは、受付の前に貼られた「入館規則」です。呼び出し元の身元と規則を突き合わせて通すかどうかを決めます。</p>
  <p>これは<strong>マンションのオートロック</strong>と同じです。住人名簿（IAMポリシー）に名前が載っている人だけが開けられます。名簿そのものがなければ、どんな鍵を配っても管理になりません。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <table>
    <tr><th style="width:24%">名前</th><th style="width:38%">正体（たとえ）</th><th>できないこと</th></tr>
    <tr><td class="good">IAMポリシー</td><td class="good">入館規則そのもの。「誰が何をしてよいか」を書いたJSONの文書</td><td>これ自体は身元確認をしない（それはIAMロールやユーザーの役目）</td></tr>
    <tr><td>AWS STS</td><td>一時的な入館証を発行する<strong>窓口</strong>。IAMロールを引き受けるときに裏で動いている</td><td><strong>権限の中身を決めるのはあくまでIAMポリシー</strong>。STSは発券係であって規則ではない</td></tr>
    <tr><td>AWS Config</td><td>設定の変更履歴を記録し、ルール違反を見つける<strong>監査カメラ</strong></td><td>アクセスを許可も拒否もしない。見て記録するだけ</td></tr>
    <tr><td>IAMアクセスキー</td><td>持ち主を証明するための<strong>鍵そのもの</strong>。期限がない</td><td>鍵は「本人かどうか」を示すだけ。「何をしてよいか」は決められない</td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. AWS STSを利用して権限を付与する</h3>
      <p>AWS Security Token Service（STS）は、一時的な認証情報を発行する窓口です。IAMロールを引き受けるときに裏側で自動的に使われています。</p>
      <p class="why">STSが発行するのは<strong>期限つきの鍵</strong>であって、権限の中身ではありません。中身を決めるのはIAMポリシーなので、ヒント2に答えていません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>B. IAMポリシーを利用して権限を付与する</h3>
      <p>API Gatewayは、リソースごとに <code>execute-api:Invoke</code> といったアクションをIAMポリシーで制御できます。呼び出し元のIAMロールにこのポリシーを付けるだけです。</p>
      <p class="why">ヒント1（どちらもAWS内）とヒント2（誰が何を呼べるかのルール）の両方に答えています。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. AWS Configを利用して権限を付与する</h3>
      <p>AWS Configは、AWSリソースの設定が今どうなっているか、いつ変わったかを記録して点検するサービスです。監査カメラにあたります。</p>
      <p class="why">記録するだけで、アクセスを許可も拒否もしません。そもそも権限を付与する機能がないので、ヒント2を満たしません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. IAMアクセスキーを利用して権限を付与する</h3>
      <p>アクセスキーは「私は確かにこの人です」と示すための鍵です。身元確認（認証）の道具であって、権限（認可）の道具ではありません。</p>
      <p class="why">鍵を配っても「どのAPIを呼んでよいか」は決まりません。さらにAWS内部の連携では、期限のないキーを配ること自体が避けるべきやり方です。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：B　IAMポリシーを利用して、APIコールの呼び出し元に対して権限を付与する</strong></p>
    <p class="oboe">覚え方 —— <strong>「誰が何をしてよいか」を決めるのは、AWSでは常にIAMポリシー。</strong>まぎらわしい3つはこう切り分けます。<strong>STS＝一時的な鍵を発行する窓口、アクセスキー＝本人確認の鍵、Config＝設定を記録して点検する監査役。</strong>どれも権限の中身は決めません。なおAPI Gatewayの認可方式は3種類あり、<strong>AWS内部の連携ならIAM、スマホやWebのユーザー認証ならAmazon Cognito、独自ルールならLambdaオーソライザー</strong>と覚えておくと、この系統の問題はまとめて取れます。</p>
  </div>`
  },

  {
    id: 'e1q25',
    q: 'ある企業がAWSを活用してアプリケーションを開発している。このアプリケーションのデータレイヤーには、Amazon DynamoDBテーブルを使用する予定である。データ処理は午前中はほとんど行われないが、午後からは増加し、夕方には予測できない読み書きのトラフィックが発生する可能性がある。その際、短時間でトラフィックの急増が起こることも考えられる。コストを最適化しつつ要件を満たすために、ソリューションアーキテクトはどのような対策を講じるべきか。',
    choices: [
      'オンデマンドモードのDynamoDBテーブルを作成する。さらに、このテーブルをグローバルテーブルとして設定する',
      'オンデマンドモードのDynamoDBテーブルを作成する',
      'プロビジョンドスループットモードのDynamoDBテーブルを作成する。さらに、このテーブルのオートスケーリングを有効化する',
      'プロビジョンドスループットモードのDynamoDBテーブルを作成する。さらに、このテーブルをグローバルテーブルとして設定する',
    ],
    answer: 1,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>午前中はほとんど行われない／午後から増加</td><td>1日の中で使用量が大きく上下する。平らではない</td></tr>
    <tr><td>夕方には<strong>予測できない</strong>トラフィック</td><td><mark>どれだけ来るか前もって分からない。だから枠を決め打ちできない</mark></td></tr>
    <tr><td>短時間でトラフィックの急増</td><td>じわじわではなく一瞬で跳ね上がる。追いかける方式では間に合わない</td></tr>
  </table>

  <h2>1日の使われ方を見ると、答えが見えてくる</h2>
  <div class="day">
    <div class="strip">
      <span></span><span></span><span></span><span></span><span></span><span></span>
      <span></span><span></span><span></span><span></span><span></span><span></span>
      <span></span><span class="on"></span><span class="on"></span><span class="on"></span><span class="on"></span><span class="on"></span>
      <span class="on"></span><span class="on"></span><span></span><span></span><span></span><span></span>
    </div>
    <div class="scale"><span>0時</span><span>6時</span><span>12時</span><span>18時</span><span>24時</span></div>
    <p class="caption">赤いところだけが忙しい時間。しかも、この赤がどこまで高く跳ねるかは事前に分かりません。</p>
  </div>

  <h2>「席を予約する」か「来た人数だけ払う」か</h2>
  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ プロビジョンド＋Auto Scaling</div>
      <div class="nodes v">
        <div class="node ng">
          <span class="ico"><img src="assets/icons/gen-metrics.svg" alt=""></span>
          <span class="lbl">使用率を監視</span><span class="sub">数分おきに様子を見る</span>
        </div>
        <div class="link ng"><span>混んできたと気づいてから</span><span class="l">↓</span></div>
        <div class="node ng">
          <span class="ico"><img src="assets/icons/amazon-dynamodb.svg" alt=""></span>
          <span class="lbl">枠を広げる</span><span class="sub">広がるまでの数分間はエラー（スロットリング）</span>
        </div>
      </div>
      <p class="note">後追いなので、一瞬で跳ねる山には間に合いません。空いている時間も予約した枠の料金を払い続けます。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ オンデマンドモード</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/amazon-dynamodb.svg" alt=""></span>
          <span class="lbl">オンデマンドのテーブル</span><span class="sub">枠の設定という概念がない</span>
        </div>
        <div class="link ok"><span>来たリクエストをその場でさばく</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/gen-data-table.svg" alt=""></span>
          <span class="lbl">読み書きした回数ぶんだけ課金</span><span class="sub">午前中はほぼ0円</span>
        </div>
      </div>
      <p class="note">急増にその場で追従し、使っていない時間はお金がかかりません。</p>
    </div>
  </div>
  <p class="caption">左は監視して後から広げる方式、右ははじめから枠を持たない方式です。</p>
  <p>これは<strong>レストランの席の押さえ方</strong>にそっくりです。プロビジョンドは「毎日50席を予約しておく」方式で、来なくても席代がかかり、60人来たら10人は入れません。オンデマンドは「来た人数ぶんだけ後払い」。何人来るか読めない日には、後者が安全で安上がりです。</p>

  <h2>まぎらわしい3つを区別する</h2>
  <table>
    <tr><th style="width:26%">名前</th><th style="width:36%">何のための設定か</th><th>できないこと・向かないこと</th></tr>
    <tr><td class="good">オンデマンドモード</td><td class="good">読み書きした回数ぶんだけ払う。枠の設定が不要で、急増にその場で追従する</td><td>1日中ずっと一定量が流れ続ける用途では、プロビジョンドより割高になる</td></tr>
    <tr><td>プロビジョンドスループットモード</td><td>あらかじめ「毎秒これだけ」と枠を買う。使用量が読めるなら最も安い</td><td>枠を超えた分はエラーになる。読めないトラフィックには危険</td></tr>
    <tr><td>Auto Scaling（プロビジョンド用）</td><td>使用率を見て枠を自動で増減させる</td><td><strong>気づいてから広げる後追い</strong>なので、数秒で跳ねる急増には間に合わない</td></tr>
    <tr><td>グローバルテーブル</td><td>複数リージョンに同じテーブルを複製する。<strong>世界中から低遅延で使う／リージョン障害に備える</strong>ための機能</td><td>コスト最適化にはならない。むしろリージョンぶん料金が増える</td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. オンデマンドモード＋グローバルテーブル</h3>
      <p>オンデマンドの部分は正解と同じです。問題は後半のグローバルテーブルで、これは同じデータを別リージョンにも複製する機能です。</p>
      <p class="why">問題文には海外展開もリージョン障害対策も書かれていません。<strong>要件にない機能でコストを増やしている</strong>ので、コスト最適化に反します。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>B. オンデマンドモードのDynamoDBテーブルを作成する</h3>
      <p>枠を決めずに、来たリクエストをその場でさばきます。午前中のようにほとんど使わない時間は、料金もほぼかかりません。</p>
      <p class="why">ヒント2（予測できない）とヒント3（短時間の急増）にそのまま答えており、余計な機能も足していません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. プロビジョンドスループットモード＋Auto Scaling</h3>
      <p>使用率を監視して枠を自動で増やす構成です。毎日だいたい同じ形で増減するなら、これがいちばん安くなります。</p>
      <p class="why">ただしAuto Scalingは<strong>混んできたと気づいてから広げる後追い</strong>です。ヒント3の「短時間の急増」には間に合わず、その数分間はエラーになります。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. プロビジョンドスループットモード＋グローバルテーブル</h3>
      <p>枠を決め打ちしたうえに、要件にない複数リージョン複製まで足しています。</p>
      <p class="why">ヒント2にも3にも反し、さらにコストも増えます。すべての条件で負けています。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：B　オンデマンドモードのDynamoDBテーブルを作成する</strong></p>
    <p class="oboe">覚え方 —— <strong>DynamoDBのモードは「使用量が読めるか」だけで決まる。「予測できない」「急激なスパイク」「新規で見当がつかない」ならオンデマンド。「安定している」「使用量が読める」ならプロビジョンド（＋Auto Scaling）。</strong>そして<strong>グローバルテーブルは複数リージョンの話で、コストの答えには絶対にならない。</strong>コスト最適化の問題に出てきたら、その時点でダミーだと判断してかまいません。</p>
  </div>`
  },
  {
    id: 'e1q26',
    q: 'ある企業は、単一リージョン内の2つのアベイラビリティゾーン（AZ）に配置されたAmazon EC2インスタンスに対してALBおよびAuto Scalingが設定されたWebアプリケーションを運営している。運用要件として、1つのAZがダウンし、かつAuto Scalingが残るAZで新たなインスタンスを起動できていない期間においても、アプリケーションが常に100％のピークロードを処理できるパフォーマンスを維持する必要がある。この要件を満たすために必要なアーキテクチャの構成はどれか。',
    choices: [
      '3つのAZに対して、AZ毎に50％のピークロードを処理できるAuto Scaling設定を行ったEC2インスタンスを展開する',
      '3つのAZに対して、AZ毎に30％のピークロードを処理できるAuto Scaling設定を行ったEC2インスタンスを展開する',
      '2つのAZに対して、リージョン毎に50％のピークロードを処理できるAuto Scaling設定を行ったEC2インスタンスを展開する',
      '2つのAZに対して、AZ毎に50％のピークロードを処理できるAuto Scaling設定を行ったEC2インスタンスを展開する',
    ],
    answer: 0,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>1つのAZがダウンし</td><td>持っている能力のうち、1AZ分がまるごと消える前提で計算する</td></tr>
    <tr><td>Auto Scalingが新たなインスタンスを起動できていない期間</td><td><mark>増やして助けてもらえない。今そこにある台数だけで耐えろ</mark>という条件</td></tr>
    <tr><td>常に100％のピークロードを処理できる</td><td>残ったAZの合計が100％以上でなければならない。99％では不合格</td></tr>
  </table>
  <p>この問題は、たし算ができれば必ず解けます。<strong>「AZ1つを消したあと、残りの合計が100％以上か」</strong>を選択肢ごとに計算するだけです。</p>

  <h2>2つのAZでは、どう配分しても足りない</h2>
  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ 2つのAZに50％ずつ（合計100％）</div>
      <div class="nodes">
        <div class="node ng">
          <span class="ico"><img src="assets/icons/res-amazon-ec2-instances.svg" alt=""></span>
          <span class="lbl">AZ-a</span><span class="sub">50％</span>
        </div>
        <div class="node dim">
          <span class="ico"><img src="assets/icons/res-amazon-ec2-instances.svg" alt=""></span>
          <span class="lbl">AZ-b（停止）</span><span class="sub">50％が消える</span>
        </div>
      </div>
      <p class="note">残るのは50％だけ。ピーク時のお客さんの半分しかさばけません。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ 3つのAZに50％ずつ（合計150％）</div>
      <div class="nodes">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/res-amazon-ec2-instances.svg" alt=""></span>
          <span class="lbl">AZ-a</span><span class="sub">50％</span>
        </div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/res-amazon-ec2-instances.svg" alt=""></span>
          <span class="lbl">AZ-b</span><span class="sub">50％</span>
        </div>
        <div class="node dim">
          <span class="ico"><img src="assets/icons/res-amazon-ec2-instances.svg" alt=""></span>
          <span class="lbl">AZ-c（停止）</span><span class="sub">50％が消える</span>
        </div>
      </div>
      <p class="note">残るのは50＋50で100％。台数を1台も増やさずにピークをさばききれます。</p>
    </div>
  </div>
  <p class="caption">ふだんは150％ぶんの余力を持ち、1AZ失ってちょうど100％になる配分です。</p>

  <h3>1つのAZが落ちたあと、何％残るか</h3>
  <div class="bars">
    <div class="barrow"><div class="name">A：3AZ×50％</div><div class="bar green" style="width:100%">残り 100％　← 合格</div></div>
    <div class="barrow"><div class="name">B：3AZ×30％</div><div class="bar red" style="width:60%">残り 60％</div></div>
    <div class="barrow"><div class="name">C：2AZ・全体で50％</div><div class="bar red" style="width:25%">残り 25％</div></div>
    <div class="barrow"><div class="name">D：2AZ×50％</div><div class="bar red" style="width:50%">残り 50％</div></div>
  </div>
  <p class="caption">合格ラインは100％。棒が届いているのはAだけです。</p>
  <p>これは<strong>3人1組の掃除当番</strong>と同じです。3人それぞれが「1人で半分の量をこなせる力」を持っていれば、1人休んでも残る2人でちょうど全部終わります。2人組で半分ずつしかこなせないなら、1人休んだ時点でその日は終わりません。</p>

  <h2>まぎらわしい2つの言い回しを区別する</h2>
  <table>
    <tr><th style="width:26%">問題文の書き方</th><th style="width:36%">意味</th><th>気をつけること</th></tr>
    <tr><td class="good">AZ毎に50％</td><td class="good">AZ1つあたりが50％をさばける。3AZなら合計150％</td><td>「AZ毎」と書いてあったらAZ数をかけ算する</td></tr>
    <tr><td>リージョン毎に50％</td><td>リージョン全体を足しても50％しかない</td><td>かけ算してはいけない。<strong>障害がなくてもピークをさばけない</strong></td></tr>
  </table>
  <p>ついでに登場する2つの部品も整理しておきます。</p>
  <table>
    <tr><th style="width:26%">名前</th><th style="width:36%">役割（たとえ）</th><th>できないこと</th></tr>
    <tr><td>Application Load Balancer（ALB）</td><td>お客さんを空いている窓口へ振り分ける案内係</td><td>自分では処理しない。窓口の数は増やせない</td></tr>
    <tr><td>Auto Scaling グループ</td><td>忙しくなったら応援を呼ぶシフト管理者</td><td><strong>呼んでから来るまでに数分かかる</strong>。今回はその数分が耐えられるかを問われている</td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>A. 3つのAZに、AZ毎に50％を処理できる構成を展開する</h3>
      <p>平常時は合計150％ぶんの力を持っています。1AZが落ちても 50＋50＝100％ が残ります。</p>
      <p class="why">ヒント2（増援なし）の条件のままヒント3（100％）を満たす、唯一の選択肢です。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. 3つのAZに、AZ毎に30％を処理できる構成を展開する</h3>
      <p>AZの数は足りていますが、1AZあたりの力が小さすぎます。合計90％しかないので、<strong>障害がなくてもピークをさばけません</strong>。</p>
      <p class="why">1AZが落ちれば残り60％。ヒント3の100％にまったく届きません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. 2つのAZに、リージョン毎に50％を処理できる構成を展開する</h3>
      <p>「リージョン毎に50％」なので、<strong>2つのAZを足しても50％</strong>です。ここが引っかけどころです。</p>
      <p class="why">平常時ですら半分しかさばけず、1AZ落ちれば25％。3つのヒントすべてに反します。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. 2つのAZに、AZ毎に50％を処理できる構成を展開する</h3>
      <p>平常時は合計100％でちょうど足ります。これが現状の構成であり、いちばんもっともらしく見えます。</p>
      <p class="why">しかし1AZが落ちると50％に半減します。ヒント2により増援も呼べないので、ヒント3を満たせません。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：A　3つのAZに対して、AZ毎に50％のピークロードを処理できるAuto Scaling設定を行ったEC2インスタンスを展開する</strong></p>
    <p class="oboe">覚え方 —— <strong>「AZが1つ落ちても100％」と書いてあったら、必要な合計は「100％ ÷ （AZ数 − 1） ＝ 1AZあたりの割合」で計算する。</strong>3AZなら 100÷2＝50％、4AZなら 100÷3＝約34％。AZを増やすほど1AZあたりの負担が減り、余分な待機コストも下がります。あわせて<strong>「AZ毎」はかけ算、「リージョン毎」はかけ算しない</strong>という読み分けも必ず覚えてください。ここを取り違えると計算そのものが崩れます。</p>
  </div>`
  },

  {
    id: 'e1q27',
    q: 'ある企業は、Amazon EC2インスタンスをウェブサーバーとして利用し、ELBおよびAuto Scalingグループを設定したアプリケーションを運営している。このアプリケーションのデータベース層には、Amazon RDS MySQLデータベースが利用されている。最近、RDSインスタンスへの読み取り要求が増加しており、その結果、データベース処理のパフォーマンスが低下している。コスト最適にDBインスタンスのパフォーマンスを向上させるソリューションはどれか。',
    choices: [
      'Amazon CloudFrontディストリビューションをデータベース構成の前面に設置する',
      'Amazon RDS DBインスタンスをマルチAZ構成に変更する',
      'Amazon RDS DBインスタンスに対してリードレプリカを増加させる',
      'DynamoDBテーブルをAmazon RDS DBインスタンスのキャッシュレイヤーとして設置する',
    ],
    answer: 2,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td><strong>読み取り</strong>要求が増加している</td><td><mark>増えているのは読み取りだけ。書き込みは問題になっていない</mark></td></tr>
    <tr><td>データベース処理のパフォーマンスが低下</td><td>直したいのは速さ。壊れた話でも、止まった話でもない</td></tr>
    <tr><td>コスト最適に</td><td>読み取りだけを助ける、いちばん素直な方法を選ぶ</td></tr>
  </table>

  <h2>読む係を増やして、1台に集まる読み取りを分ける</h2>
  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ 1台のRDSで全部さばく</div>
      <div class="nodes v">
        <div class="node many ng">
          <span class="ico"><img src="assets/icons/res-amazon-ec2-instances.svg" alt=""></span>
          <span class="lbl">EC2ウェブサーバー</span><span class="sub">読み取りが大量に発生</span>
        </div>
        <div class="link ng"><span>読み取りも書き込みも1本</span><span class="l">↓</span></div>
        <div class="node ng">
          <span class="ico"><img src="assets/icons/amazon-rds.svg" alt=""></span>
          <span class="lbl">RDS MySQL（プライマリ）</span><span class="sub">1台で全部背負って遅くなる</span>
        </div>
      </div>
      <p class="note">窓口が1つしかない役所と同じです。行列が伸びる一方になります。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ リードレプリカを増やす</div>
      <div class="nodes v">
        <div class="node many ok">
          <span class="ico"><img src="assets/icons/res-amazon-ec2-instances.svg" alt=""></span>
          <span class="lbl">EC2ウェブサーバー</span><span class="sub">読み取りはレプリカ宛てに送る</span>
        </div>
        <div class="link ok"><span>書き込みだけプライマリへ</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/amazon-rds.svg" alt=""></span>
          <span class="lbl">プライマリ</span><span class="sub">書き込み専任になり余裕ができる</span>
        </div>
        <div class="link ok"><span>データを自動コピー</span><span class="l">↓</span></div>
        <div class="node many ok">
          <span class="ico"><img src="assets/icons/amazon-rds.svg" alt=""></span>
          <span class="lbl">リードレプリカ</span><span class="sub">読み取り専用。必要なだけ増やせる（最大15台）</span>
        </div>
      </div>
      <p class="note">読み取りの行列がレプリカの台数ぶんに分かれ、プライマリも軽くなります。</p>
    </div>
  </div>
  <p class="caption">リードレプリカは「読むだけの窓口」を増やす機能です。書き込みは今までどおりプライマリ1台が受け持ちます。</p>
  <p>コンビニのレジを思い浮かべてください。<strong>会計（書き込み）ができるレジは1台のままで、商品の場所を聞きたいだけ（読み取り）のお客さん向けに案内カウンターを増やす</strong>。混雑の中身が「質問」だと分かっているなら、これがいちばん安くて効きます。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <table>
    <tr><th style="width:26%">名前</th><th style="width:34%">何のための機能か</th><th>できないこと・向かないこと</th></tr>
    <tr><td class="good">リードレプリカ</td><td class="good">読み取り専用のコピーを増やして、読み取りの負荷を分散する</td><td>書き込みは増やせない。コピーがわずかに遅れることがある</td></tr>
    <tr><td>マルチAZ配置</td><td>別のAZに待機用の複製を置き、障害時に自動で切り替える<strong>可用性</strong>の機能</td><td><strong>待機側は普段まったく使われない</strong>ので、読み取り性能は上がらない</td></tr>
    <tr><td>Amazon CloudFront</td><td>世界中の拠点に配置されたキャッシュ。<strong>ウェブの画像やHTMLを配る</strong>ためのもの</td><td>データベースの前には置けない。SQLをキャッシュする仕組みではない</td></tr>
    <tr><td>Amazon DynamoDB</td><td>それ自体がNoSQLデータベース。キーで引く用途に強い</td><td>RDSのキャッシュとしては動かない。<strong>データベースのキャッシュ役はAmazon ElastiCache</strong></td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. CloudFrontディストリビューションをデータベース構成の前面に設置する</h3>
      <p>CloudFrontは、画像や動画を世界中の拠点にコピーしてユーザーの近くから配る仕組みです。宅配の集配所にあたります。</p>
      <p class="why">データベースの前に置くという構成自体が成り立ちません。ヒント1の「読み取りの増加」に対する答えになっていません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. RDS DBインスタンスをマルチAZ構成に変更する</h3>
      <p>マルチAZは、別のAZに控えを置いて障害時に自動で切り替える仕組みです。非常用発電機にあたります。</p>
      <p class="why">控えは<strong>普段はいっさい使われません</strong>。お金は2台分かかるのに読み取りは1台のままなので、ヒント2にもヒント3にも反します。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>C. RDS DBインスタンスに対してリードレプリカを増加させる</h3>
      <p>読み取り専用のコピーを増やし、アプリの読み取りをそちらへ向けます。必要な数だけ増やせて、減らすのも簡単です。</p>
      <p class="why">ヒント1（読み取りだけが増えた）にぴったり対応し、必要なぶんだけ足せるのでヒント3のコスト最適も満たします。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. DynamoDBテーブルをRDSのキャッシュレイヤーとして設置する</h3>
      <p>DynamoDBは別種のデータベースであって、RDSの手前に置く一時保管庫ではありません。<strong>もしキャッシュを置くならAmazon ElastiCache</strong>です。</p>
      <p class="why">さらにアプリ側にキャッシュの出し入れを全部作り込む必要があり、手間もコストも増えます。ヒント3に反します。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：C　Amazon RDS DBインスタンスに対してリードレプリカを増加させる</strong></p>
    <p class="oboe">覚え方 —— <strong>RDSの2大オプションは目的が正反対。「読み取りが重い・性能を上げたい」ならリードレプリカ（性能）、「障害で止まりたくない・可用性を上げたい」ならマルチAZ（可用性）。</strong>マルチAZの待機インスタンスは普段使われないので、性能の問題には絶対に効きません。あわせて<strong>キャッシュを置くならElastiCache、DynamoDBはキャッシュではない</strong>ことも押さえておくと、この4択は毎回そのまま切れます。</p>
  </div>`
  },

  {
    id: 'e1q28',
    q: 'ある企業がオンプレミス環境からAWSへの移行を決定し、コンサルティング会社と契約した。移行作業においては、同社のAWSアカウントにあるAmazon EC2インスタンスのAmazonマシンイメージ（AMI）をコンサルティング会社のAWSアカウントと共有する必要がある。このAMIのスナップショットはAWS KMSのカスタマー管理キーを用いて暗号化されている。ソリューションアーキテクトはどのような手順を踏むべきか。',
    choices: [
      '暗号化されたAMIを公開して、コンサルティング会社のAWSアカウントがアクセスできるようにする。AWS KMSのキーポリシーを変更して、コンサルティング会社のAWSアカウントが暗号化に使用されたKMSキーを使用できるようにする',
      'AMIをコンサルティング会社のAWSアカウントのみと共有できるようにAMIのLaunchPermissionプロパティを変更する。AWS KMSのキーポリシーを変更して、コンサルティング会社のAWSアカウントが暗号化に使用されたKMSキーを使用できるようにする',
      'AMIをコンサルティング会社のAWSアカウントのみと共有できるようにAMIのLaunchPermissionプロパティを変更する。AWS KMSのキーポリシーを変更して、コンサルティング会社の所有する新しいKMSキーを許可して、このAMIに適用する',
      '暗号化されたAMIを公開して、コンサルティング会社のAWSアカウントがアクセスできるようにする。AWS KMSのキーポリシーを変更して、コンサルティング会社の所有する新しいKMSキーを許可して、このAMIに適用する',
    ],
    answer: 1,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>コンサルティング会社のAWSアカウント<strong>と</strong>共有する</td><td>相手は1社だけ。<mark>全世界に公開してよいとは一言も書かれていない</mark></td></tr>
    <tr><td>KMSのカスタマー管理キーで暗号化されている</td><td>AMIを渡すだけでは中身が読めない。鍵を使う許可も別に要る</td></tr>
    <tr><td>移行作業のためにAMIを使う</td><td>相手はこのAMIからEC2を起動する。起動の許可（LaunchPermission）が必要</td></tr>
    </table>

  <h2>渡すものは「箱」と「鍵」の2つ</h2>
  <p>暗号化されたAMIは、<strong>南京錠のかかった箱</strong>だと思ってください。箱を相手の玄関先に置いただけでは中身は見えません。<mark>箱を渡す許可と、南京錠を開ける許可は別々に出す必要があります。</mark></p>
  <div class="nodes v">
    <div class="node ok">
      <span class="ico"><img src="assets/icons/res-amazon-ec2-ami.svg" alt=""></span>
      <span class="lbl">AMI</span><span class="sub">① LaunchPermission に相手のアカウントIDを1つだけ追加</span>
    </div>
    <div class="link ok"><span>この2つがそろって初めて起動できる</span><span class="l">↓</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/aws-key-management-service.svg" alt=""></span>
      <span class="lbl">KMS カスタマー管理キー</span><span class="sub">② キーポリシーに相手のアカウントIDを追加して復号を許可</span>
    </div>
    <div class="link ok"><span>相手のアカウントで</span><span class="l">↓</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/group-aws-account.svg" alt=""></span>
      <span class="lbl">コンサル会社のAWSアカウント</span><span class="sub">EC2インスタンスを起動できる</span>
    </div>
  </div>
  <p class="caption">①だけでも②だけでも足りません。両方そろえて初めて相手はEC2を起動できます。</p>

  <h2>やってはいけない「公開」</h2>
  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ AMIをパブリックにする</div>
      <div class="nodes v">
        <div class="node ng">
          <span class="ico"><img src="assets/icons/res-amazon-ec2-ami.svg" alt=""></span>
          <span class="lbl">AMI（public）</span><span class="sub">世界中の全AWSアカウントから見える</span>
        </div>
        <div class="link ng"><span>誰でも起動できてしまう</span><span class="l">↓</span></div>
        <div class="node ng">
          <span class="ico"><img src="assets/icons/gen-internet.svg" alt=""></span>
          <span class="lbl">不特定多数</span><span class="sub">社内サーバーの中身が流出する</span>
        </div>
      </div>
      <p class="note">自社サーバーの丸ごとコピーを、インターネットに置くのと同じことです。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ LaunchPermissionで1社だけに共有</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/res-amazon-ec2-ami.svg" alt=""></span>
          <span class="lbl">AMI（プライベート）</span><span class="sub">許可リストに載ったアカウントだけ</span>
        </div>
        <div class="link ok"><span>名指しした1社のみ</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/group-aws-account.svg" alt=""></span>
          <span class="lbl">コンサル会社</span><span class="sub">他社からは存在すら見えない</span>
        </div>
      </div>
      <p class="note">名簿に名前を書いた人だけが入れる、会員制の入口です。</p>
    </div>
  </div>
  <p class="caption">共有と公開はまったく違います。SAAでは「公開（public）」と書かれた選択肢はほぼ必ず不正解です。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <table>
    <tr><th style="width:26%">操作</th><th style="width:36%">何をする設定か</th><th>できないこと・問題点</th></tr>
    <tr><td class="good">AMIのLaunchPermissionに相手アカウントIDを追加</td><td class="good">「このアカウントだけがこのAMIから起動してよい」と名指しで許可する</td><td>これだけでは暗号化されたスナップショットを復号できない</td></tr>
    <tr><td class="good">KMSキーポリシーに相手アカウントIDを追加</td><td class="good">自分のキーを相手が復号に使えるようにする</td><td>キーの実体は渡らない。許可はいつでも取り消せる</td></tr>
    <tr><td>AMIを公開（public）にする</td><td>全AWSユーザーに開放する</td><td><strong>1社だけに限定するという要件に真っ向から反する</strong></td></tr>
    <tr><td>相手が持つ新しいKMSキーを許可する</td><td>—</td><td><strong>そもそも成立しない。</strong>すでに暗号化済みのデータは、暗号化に使った元のキーでしか復号できない</td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. 暗号化AMIを公開し、KMSキーポリシーで相手アカウントに元のキーの使用を許可する</h3>
      <p>後半のKMSの扱いは正しいです。しかし前半でAMIをパブリックにしています。</p>
      <p class="why">ヒント1に反します。1社と共有すればよいところを全世界に開放しており、セキュリティ要件を満たしません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>B. LaunchPermissionで相手アカウントのみに共有し、KMSキーポリシーで元のキーの使用を許可する</h3>
      <p>箱を渡す許可（LaunchPermission）と、鍵を開ける許可（KMSキーポリシー）の両方を、相手1社だけに出しています。</p>
      <p class="why">ヒント1（1社限定）、ヒント2（復号の許可）、ヒント3（起動の許可）をすべて満たします。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. LaunchPermissionで相手アカウントのみに共有し、相手が持つ新しいKMSキーを許可する</h3>
      <p>前半は正解と同じで問題ありません。落とし穴は後半です。</p>
      <p class="why"><strong>すでに暗号化されたデータは、暗号化に使った元のキーでしか開けません。</strong>別の鍵をあとから許可しても南京錠は開かないので、ヒント2を満たせません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. 暗号化AMIを公開し、相手が持つ新しいKMSキーを許可する</h3>
      <p>前半でAMIを全世界に公開し、後半では開かない鍵を指定しています。</p>
      <p class="why">ヒント1にもヒント2にも反しており、しかも実際には動きません。二重に外れています。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：B　AMIのLaunchPermissionプロパティを変更してコンサルティング会社のAWSアカウントのみと共有し、AWS KMSのキーポリシーを変更して暗号化に使用されたKMSキーを使用できるようにする</strong></p>
    <p class="oboe">覚え方 —— <strong>暗号化されたAMIやスナップショットを他アカウントに渡すときは、いつも「共有」と「鍵」の2点セット。片方だけの選択肢は必ず不正解。</strong>さらに2つの鉄則を足してください。<strong>（1）特定の相手に渡すなら「公開（public）」ではなくアカウントIDの名指し。（2）暗号化済みのデータは、暗号化に使った元のキーでしか復号できない。相手の新しいキーを許可する選択肢は常にダミー。</strong></p>
  </div>`
  },

  {
    id: 'e1q29',
    q: 'ある企業はAWS上でウェブアプリケーションを運営している。EC2インスタンスをWEBサーバーとして活用し、ELBおよびAuto Scalingグループを構成して高い可用性を確保している。ELBに対してRoute 53を利用したドメインも設定している。しかしながら、最近、長時間にわたるDDoS攻撃を受け、リクエストにかかるコストが増大した。ソリューションアーキテクトは、このDDoS攻撃によるコスト増加を抑制する必要がある。どのような手段を講じるべきか。',
    choices: [
      'AWSサポートのDDoS攻撃コストプランを適用する',
      'AWS Shield Advancedを適用する',
      'Amazon GuardDutyを適用する',
      'AWS Shield Standardを適用する',
    ],
    answer: 1,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>長時間にわたるDDoS攻撃</td><td>DDoS＝大量の通信を浴びせてサービスを止める攻撃。守る話であることは確定</td></tr>
    <tr><td>リクエストにかかる<strong>コストが増大</strong>した</td><td><mark>困っているのは「止まったこと」ではなく「請求額が増えたこと」</mark>。ここが本問の核心</td></tr>
    <tr><td>コスト増加を抑制する</td><td>攻撃で膨らんだ料金を肩代わりしてくれる仕組みが要る</td></tr>
  </table>

  <h2>DDoSは「請求書」も攻撃してくる</h2>
  <div class="nodes v">
    <div class="node many ng">
      <span class="ico"><img src="assets/icons/gen-internet.svg" alt=""></span>
      <span class="lbl">攻撃者</span><span class="sub">偽のアクセスを大量に送りつける</span>
    </div>
    <div class="link ng"><span>ドメイン宛てに殺到</span><span class="l">↓</span></div>
    <div class="node ng">
      <span class="ico"><img src="assets/icons/amazon-route-53.svg" alt=""></span>
      <span class="lbl">Route 53 ・ ELB</span><span class="sub">受けた通信量とリクエスト数がそのまま課金される</span>
    </div>
    <div class="link ng"><span>負荷が上がる</span><span class="l">↓</span></div>
    <div class="node ng">
      <span class="ico"><img src="assets/icons/group-auto-scaling-group.svg" alt=""></span>
      <span class="lbl">Auto Scaling</span><span class="sub">攻撃に反応してEC2を増やし、さらに課金が膨らむ</span>
    </div>
  </div>
  <p class="caption">サービスは落ちていません。落ちていないからこそ、請求だけが静かに膨らみ続けます。</p>
  <p>これは<strong>いたずら電話が鳴りやまないお店</strong>と同じです。店は営業できていますが、通話料と対応する店員のシフト代だけが積み上がっていきます。AWS Shield Advancedは、この「いたずら電話ぶんの料金は請求しません」と言ってくれる契約にあたります。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <table>
    <tr><th style="width:24%">名前</th><th style="width:34%">正体</th><th>できないこと</th></tr>
    <tr><td>AWS Shield Standard</td><td>全AWSユーザーに<strong>無料で自動的に</strong>有効化されている基本の防御。よくある種類の攻撃は自動で弾く</td><td><strong>料金の払い戻しはない。</strong>すでに有効なので、これから適用する対策にもならない</td></tr>
    <tr><td class="good">AWS Shield Advanced</td><td class="good">有料の上位プラン。高度な攻撃の緩和に加え、<strong>DDoSコスト保護（攻撃で増えた料金のクレジット返還）</strong>と24時間の専門チーム支援がつく</td><td>月額の固定費がかかる。攻撃を受けていない平時にも費用が発生する</td></tr>
    <tr><td>Amazon GuardDuty</td><td>ログを機械学習で分析し、<strong>あやしい動きを見つけて知らせる</strong>見張り役</td><td>見つけて通知するだけ。通信を遮断しないし、料金も返らない</td></tr>
    <tr><td>AWSサポートのDDoS攻撃コストプラン</td><td>—</td><td><strong>そんなサービスは存在しない。</strong>もっともらしい名前のダミー</td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. AWSサポートのDDoS攻撃コストプランを適用する</h3>
      <p>AWSにこの名前のプランはありません。AWSサポートは技術的な問い合わせに答える窓口であって、攻撃の料金を補填する仕組みではありません。</p>
      <p class="why">存在しないものは選べません。名前がそれらしいだけのダミーです。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>B. AWS Shield Advancedを適用する</h3>
      <p>攻撃の緩和を強化するだけでなく、<strong>DDoSコスト保護</strong>により、攻撃で急増したELB・Route 53・CloudFront・EC2の料金がクレジットとして返ってきます。</p>
      <p class="why">ヒント2とヒント3が求めている「料金が増えた」への直接の答えです。これが正解です。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. Amazon GuardDutyを適用する</h3>
      <p>GuardDutyは、AWS上の通信ログや操作ログを分析してあやしい兆候を通知する見張り役です。防犯カメラにあたります。</p>
      <p class="why">気づかせてくれるだけで、攻撃を止めも料金を戻しもしません。ヒント3を満たしません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. AWS Shield Standardを適用する</h3>
      <p>Shield Standardは<strong>すでに全員に無料で有効になっています</strong>。今回もこれが働いたからこそ、サービスは落ちずに済んでいます。</p>
      <p class="why">今から適用するものではありませんし、料金の返還もありません。攻撃に耐えた結果として請求が増えたという、ヒント2の状況そのものを解決できません。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：B　AWS Shield Advancedを適用する</strong></p>
    <p class="oboe">覚え方 —— <strong>DDoSの問題は「何に困っているか」で答えが割れる。「攻撃で料金が増えた」「返金・コスト保護」「24時間の専門家支援」と書いてあったらAWS Shield Advanced（有料）。</strong>Shield Standardは全員に無料で自動適用なので、「適用する」という選択肢になった時点でほぼ不正解です。あわせて<strong>GuardDuty＝あやしい動きを見つけて通知するだけ、AWS WAF＝SQLインジェクションなどアプリ層（L7）の攻撃を条件で遮断する</strong>と覚えておくと、セキュリティ系の4択がまとめて片づきます。</p>
  </div>`
  },

  {
    id: 'e1q30',
    q: 'ある企業は、Amazon EC2インスタンス上で業務アプリケーションを運用している。このアプリケーションのデータレイヤーにはAmazon DynamoDBテーブルが使用されている。同社は、このテーブルを過去24時間以内の任意の時点に復元できるようにする必要がある。運用上のオーバーヘッドを抑えつつ、これらの要件を満たすソリューションはどれか。',
    choices: [
      'DynamoDBテーブルに対してポイントインタイムリカバリを有効化する',
      'DynamoDBテーブルに対してAWS Backupを設定して、バックアッププランを設定する',
      'DynamoDBテーブルに対してAmazon EventBridgeイベントを設定して、バックアップスケジュールを設定する',
      'DynamoDBテーブルに対してオンデマンドバックアップを有効化する',
    ],
    answer: 0,
    explain: `
  <h2>まず、問題文の中の「2つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>過去24時間以内の<strong>任意の時点</strong>に復元</td><td><mark>「任意の時点」は、決まった時刻のバックアップでは絶対に満たせない</mark>。14時37分に戻したいと言われたら困る</td></tr>
    <tr><td>運用上のオーバーヘッドを抑えつつ</td><td>スケジュールの管理も、古いバックアップの削除も、人がやらない方式を選ぶ</td></tr>
  </table>

  <h2>「点」で残すか、「線」で残すか</h2>
  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ 決まった時刻にバックアップを取る</div>
      <div class="nodes v">
        <div class="node ng">
          <span class="ico"><img src="assets/icons/amazon-eventbridge.svg" alt=""></span>
          <span class="lbl">0時・6時・12時…</span><span class="sub">取った瞬間だけが残る</span>
        </div>
        <div class="link ng"><span>14時37分に戻したい</span><span class="l">↓</span></div>
        <div class="node ng">
          <span class="ico"><img src="assets/icons/gen-recover.svg" alt=""></span>
          <span class="lbl">12時の状態にしか戻せない</span><span class="sub">2時間37分ぶんのデータが消える</span>
        </div>
      </div>
      <p class="note">写真を1日数回だけ撮るようなものです。撮っていない瞬間の様子は残りません。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ ポイントインタイムリカバリ（PITR）</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/amazon-dynamodb.svg" alt=""></span>
          <span class="lbl">PITRを有効化（クリック1回）</span><span class="sub">変更を連続的に記録し続ける</span>
        </div>
        <div class="link ok"><span>14時37分に戻したい</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/gen-recover.svg" alt=""></span>
          <span class="lbl">秒単位でその時刻に復元</span><span class="sub">最大35日前まで、いつでも指定できる</span>
        </div>
      </div>
      <p class="note">こちらは動画を回し続けるようなもの。どのコマでも取り出せます。</p>
    </div>
  </div>
  <p class="caption">「任意の時点」という言葉は、点ではなく線で記録している方式を要求しています。</p>
  <p>防犯カメラで例えると分かりやすくなります。<strong>定時のバックアップは1時間に1枚の記念写真、PITRは回しっぱなしの録画</strong>です。「15時12分の様子を見せて」と言われて答えられるのは録画のほうだけです。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <table>
    <tr><th style="width:26%">名前</th><th style="width:34%">何をするものか</th><th>できないこと・向かないこと</th></tr>
    <tr><td class="good">ポイントインタイムリカバリ（PITR）</td><td class="good">スイッチ1つで有効化。直近35日間の<strong>どの秒にでも</strong>復元できる</td><td>35日より前には戻せない。長期保管には別途バックアップが要る</td></tr>
    <tr><td>オンデマンドバックアップ</td><td>ボタンを押したその瞬間の状態を、期限なく保存する</td><td><strong>押した瞬間しか残らない。</strong>任意の時点には戻せず、押す運用も人の仕事になる</td></tr>
    <tr><td>AWS Backup</td><td>複数サービスのバックアップをまとめて管理する司令塔。保存期間のルールも一括で決められる</td><td>結局は<strong>決まった時刻のスナップショット</strong>。任意の時点には戻せず、プラン設計の手間も増える</td></tr>
    <tr><td>Amazon EventBridge</td><td>決まった時刻に鳴る目覚まし時計。他のサービスを呼び出す合図を出す</td><td>自分ではバックアップを取らない。呼び出す先の仕組みを別に作り込む必要がある</td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>A. DynamoDBテーブルに対してポイントインタイムリカバリを有効化する</h3>
      <p>テーブルの設定でスイッチを入れるだけです。以降はDynamoDBが自動で変更を記録し続け、直近35日間の任意の時点を秒単位で指定して復元できます。</p>
      <p class="why">ヒント1（任意の時点）とヒント2（オーバーヘッド最小）の両方を、設定1つで満たします。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. AWS Backupを設定して、バックアッププランを設定する</h3>
      <p>AWS Backupは、EBSやRDSなど複数サービスのバックアップを1か所で管理できる便利な司令塔です。長期保管のルール作りには向いています。</p>
      <p class="why">とはいえ残るのは<strong>決まった時刻のスナップショット</strong>です。ヒント1の「任意の時点」を満たせず、プランの設計という手間も増えます。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. Amazon EventBridgeイベントでバックアップスケジュールを設定する</h3>
      <p>EventBridgeは決まった時刻に合図を出す目覚まし時計です。自分ではバックアップを取らないので、呼び出される側の処理を自分で作る必要があります。</p>
      <p class="why">結果は定時のスナップショットにしかならずヒント1に反し、作り込みが増えるのでヒント2にも反します。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. オンデマンドバックアップを有効化する</h3>
      <p>「今の状態を保存」ボタンにあたる機能です。大きな変更の前に手動で取っておく、といった使い方をします。</p>
      <p class="why">ボタンを押した瞬間しか残りません。24時間のどの時点にでも戻るには押し続けるしかなく、ヒント1にもヒント2にも反します。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：A　DynamoDBテーブルに対してポイントインタイムリカバリを有効化する</strong></p>
    <p class="oboe">覚え方 —— <strong>「任意の時点に戻したい」「ポイントインタイム」「直近◯日以内ならいつでも」と書いてあったら、答えはPITR（ポイントインタイムリカバリ）。DynamoDBもRDSもAuroraも同じ。DynamoDBのPITRは最大35日。</strong>逆に<strong>「毎日◯時に取る」「数年保管する」「複数サービスをまとめて管理する」ならAWS Backupやスナップショット</strong>です。「点で残す」か「線で残す」かの一言で切り分けられます。</p>
  </div>`
  },
  {
    id: 'e1q31',
    q: '次のIAMポリシーでEC2インスタンスに対する権限設定を行っている。{"Version":"2012-10-17","Statement":[{"Action":"ec2:*","Effect":"Allow","Resource":"*"},{"Effect":"Deny","Action":["ec2:*ReservedInstances*","ec2:TerminateInstances"],"Resource":"*"}]} ／ この設定内容として正しい内容を選択せよ。',
    choices: [
      'リザーブドインスタンスの操作が許可されている',
      'EC2インスタンスに対する全ての操作が許可されている',
      '全てのEC2インスタンスを終了することができない',
      '全てのリザーブドインスタンスに対してのみインスタンスを終了することができない',
    ],
    answer: 2,
    explain: `
  <h2>まず、ポリシーの中の「3つのヒント」</h2>
  <table>
    <tr><th style="width:38%">ポリシーの記述</th><th>ここから分かること</th></tr>
    <tr><td>"Effect": "Allow", "Action": "ec2:*"</td><td>1つ目のブロックで、EC2に関するすべての操作を許可している</td></tr>
    <tr><td>"Effect": "<strong>Deny</strong>"</td><td><mark>明示的なDenyは、どんなAllowよりも強い。必ず勝つ</mark>。IAMの絶対ルール</td></tr>
    <tr><td>"ec2:*ReservedInstances*" と "ec2:TerminateInstances"</td><td>拒否されるのは2種類。<strong>リザーブドインスタンス関連の操作</strong>と、<strong>インスタンスの終了</strong></td></tr>
  </table>

  <h2>IAMの判定は、必ずこの順番で進む</h2>
  <div class="nodes v">
    <div class="node">
      <span class="ico"><img src="assets/icons/gen-json-script.svg" alt=""></span>
      <span class="lbl">操作のリクエストが届く</span><span class="sub">例：ec2:TerminateInstances を実行したい</span>
    </div>
    <div class="link ng"><span>① 明示的な Deny があるか？　→ あれば、ここで即座に拒否</span><span class="l">↓</span></div>
    <div class="node ng">
      <span class="ico"><img src="assets/icons/aws-identity-and-access-management.svg" alt=""></span>
      <span class="lbl">Deny のリストに載っている</span><span class="sub">Allow がいくら書いてあっても関係なく拒否される</span>
    </div>
    <div class="link"><span>② Deny がなければ、Allow があるか？</span><span class="l">↓</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/amazon-ec2.svg" alt=""></span>
      <span class="lbl">許可されて実行される</span><span class="sub">③ Allow もなければ、暗黙のうちに拒否</span>
    </div>
  </div>
  <p class="caption">Denyの確認がいちばん先。ここで引っかかった操作は、そこから先に進めません。</p>
  <p>これは<strong>校則と生徒手帳</strong>の関係に似ています。「校内の施設はすべて使ってよい（Allow）」と書いてあっても、別のページに「屋上は立ち入り禁止（Deny）」とあれば屋上には行けません。<mark>禁止のほうが必ず勝ちます。</mark></p>

  <h2>それぞれの操作がどうなるかを確かめる</h2>
  <table>
    <tr><th style="width:34%">やりたい操作</th><th style="width:26%">Denyに当たるか</th><th>結果</th></tr>
    <tr><td>EC2インスタンスの起動（RunInstances）</td><td>当たらない</td><td class="good">実行できる</td></tr>
    <tr><td>EC2インスタンスの一覧表示（DescribeInstances）</td><td>当たらない</td><td class="good">実行できる</td></tr>
    <tr><td>EC2インスタンスの終了（TerminateInstances）</td><td>当たる（名指しで拒否）</td><td class="bad">できない。<strong>リザーブドかどうかに関係なく、すべてのインスタンスが対象</strong></td></tr>
    <tr><td>リザーブドインスタンスの購入や参照（PurchaseReservedInstancesOffering など）</td><td>当たる（<code>*ReservedInstances*</code> に一致）</td><td class="bad">できない</td></tr>
  </table>
  <p>ここで大事なのは、<code>ec2:TerminateInstances</code> という2つ目のDenyが<strong>リザーブドインスタンスとは無関係に、単独で書かれている</strong>ことです。条件も絞り込みもついていないので、終了操作そのものが全面的に禁止されます。</p>

  <h2>まぎらわしい3つを区別する</h2>
  <table>
    <tr><th style="width:26%">名前</th><th style="width:36%">意味</th><th>気をつけること</th></tr>
    <tr><td class="good">明示的なDeny</td><td class="good">"Effect": "Deny" と書いて拒否する</td><td><strong>どんなAllowよりも強い。</strong>覆す方法はない</td></tr>
    <tr><td>暗黙のDeny</td><td>どこにもAllowが書かれていないので実行できない状態</td><td>あとからAllowを足せば実行できるようになる</td></tr>
    <tr><td><code>*ReservedInstances*</code></td><td>前後にワイルドカードがついた書き方。名前の中にこの文字列を含むAPIすべてに一致する</td><td><strong>リザーブドインスタンスという「モノ」を指しているのではなく、API名の文字列を見ている</strong></td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. リザーブドインスタンスの操作が許可されている</h3>
      <p>1つ目のブロックだけを読めばそう見えます。しかし2つ目のブロックに <code>ec2:*ReservedInstances*</code> がDenyとして書かれています。</p>
      <p class="why">ヒント2のとおりDenyが勝つので、リザーブドインスタンス関連の操作はむしろ<strong>禁止</strong>です。正反対の説明になっています。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. EC2インスタンスに対する全ての操作が許可されている</h3>
      <p>1つ目のブロックの <code>"Action": "ec2:*"</code> だけを見た読み方です。</p>
      <p class="why">2つ目のDenyブロックを読み飛ばしています。ヒント3の2種類の操作は明確に拒否されているので、「全て許可」は成り立ちません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>C. 全てのEC2インスタンスを終了することができない</h3>
      <p><code>ec2:TerminateInstances</code> が条件なしでDenyされています。リソースも <code>"*"</code>（すべて）なので、どのインスタンスも終了できません。</p>
      <p class="why">ヒント2とヒント3をそのまま読んだ結果です。これが正しい説明です。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. 全てのリザーブドインスタンスに対してのみインスタンスを終了することができない</h3>
      <p>2つのDenyをひとつながりの条件として読んでしまった誤りです。「リザーブドインスタンスだけが終了できない」という限定はどこにも書かれていません。</p>
      <p class="why"><code>ec2:TerminateInstances</code> は独立した項目で、リソースは <code>"*"</code>。<strong>限定されていないので「のみ」が誤り</strong>です。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：C　全てのEC2インスタンスを終了することができない</strong></p>
    <p class="oboe">覚え方 —— <strong>IAMポリシーは、上から順ではなく「Denyが1つでもあれば即アウト」で読む。明示的Deny ＞ Allow ＞ 暗黙のDeny の順に強い。</strong>読む手順も固定してください。<strong>（1）Denyのブロックだけ先に読む。（2）Actionのリストを1行ずつバラして見る。（3）Resourceが "*" なら限定はない。</strong>2つ並んだDenyを「両方を満たすもの」と読むのがいちばん多い失点です。<strong>リスト内の項目はAND（かつ）ではなくOR（いずれか）</strong>だと覚えてください。</p>
  </div>`
  },

  {
    id: 'e1q32',
    q: 'あるソリューションアーキテクトは、AWSを活用してジョブを並列分散処理するワークロードを設計している。このアプリケーションでは、メッセージに基づいて処理されるジョブの負荷に応じてEC2インスタンス数が増減されるように調整する必要がある。このジョブはステートレスであり、疎結合に実行されることが求められる。この要件を満たすために、どのようにソリューションを設計するべきか。',
    choices: [
      'Amazon SNSトピックを作成して、EC2インスタンスにジョブをメッセージとして送信するように構成する。このインスタンスのAMIを使用した起動テンプレートを作成する。この起動テンプレートを使用して、キューメッセージ数にかかるインスタンスあたりのバックログを指標にしたターゲット追跡スケーリングポリシーを設定したAuto Scalingグループを構成する',
      'Amazon SNSトピックを作成して、EC2インスタンスにジョブをメッセージとして送信するように構成する。このインスタンスのAMIを使用した起動設定を作成する。この起動設定を使用して、キューメッセージ数に基づいてインスタンス総数を増減するターゲット追跡スケーリングポリシーを設定したAuto Scalingグループを構成する',
      'Amazon SQSキューを作成して、EC2インスタンスにジョブをメッセージとして送信するように構成する。このインスタンスのAMIを使用した起動テンプレートを作成する。この起動テンプレートを使用して、キューメッセージ数にかかるインスタンスあたりのバックログを指標にしたターゲット追跡スケーリングポリシーを設定したAuto Scalingグループを構成する',
      'Amazon SQSキューを作成して、EC2インスタンスにジョブをメッセージとして送信するように構成する。このインスタンスのAMIを使用した起動テンプレートを作成する。この起動テンプレートを使用して、キューメッセージ総数に基づいてインスタンス数を増減するスケーリングポリシーを設定したAuto Scalingグループを構成する',
    ],
    answer: 2,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>ジョブを並列分散処理する／疎結合</td><td>ジョブを<strong>いったんためておく置き場</strong>が要る。処理する側が空いたら取りに行く形</td></tr>
    <tr><td>ジョブの負荷に応じてEC2インスタンス数が増減</td><td><mark>たまっているジョブの数を見て台数を決める</mark>。ここでどんな指標を使うかが本問の分かれ目</td></tr>
    <tr><td>ステートレス</td><td>どのインスタンスが処理しても同じ結果になる。だから台数を自由に増減してよい</td></tr>
  </table>

  <h2>「配る」のか「ためる」のか</h2>
  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ Amazon SNSトピックを使う</div>
      <div class="nodes v">
        <div class="node ng">
          <span class="ico"><img src="assets/icons/amazon-simple-notification-service.svg" alt=""></span>
          <span class="lbl">SNSトピック</span><span class="sub">受け取った瞬間に全員へ配る</span>
        </div>
        <div class="link ng"><span>同じジョブが全台に届く／受け手がいなければ消える</span><span class="l">↓</span></div>
        <div class="node many ng">
          <span class="ico"><img src="assets/icons/res-amazon-ec2-instances.svg" alt=""></span>
          <span class="lbl">EC2インスタンス</span><span class="sub">たまっている数が数えられない</span>
        </div>
      </div>
      <p class="note">ためる機能がないので「あと何件残っているか」が分からず、その数で台数を決められません。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ Amazon SQSキューを使う</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/amazon-simple-queue-service.svg" alt=""></span>
          <span class="lbl">SQSキュー</span><span class="sub">処理されるまでジョブをためておく</span>
        </div>
        <div class="link ok"><span>空いたインスタンスが1件ずつ取りに来る</span><span class="l">↓</span></div>
        <div class="node many ok">
          <span class="ico"><img src="assets/icons/res-amazon-ec2-instances.svg" alt=""></span>
          <span class="lbl">Auto Scaling グループ</span><span class="sub">残り件数 ÷ 台数 を見て増減する</span>
        </div>
      </div>
      <p class="note">残り件数が数えられるので、台数の判断材料になります。処理が遅れてもジョブは消えません。</p>
    </div>
  </div>
  <p class="caption">SNSは館内放送、SQSは受付の番号札の箱です。番号札なら「いま何人待ちか」が数えられます。</p>
  <p>回転寿司のレーンを想像してください。SQSは<strong>レーンに皿をためておく</strong>方式で、職人が空いたら順に取ります。SNSは<strong>「いま注文が入りました」と店内放送する</strong>だけなので、聞いていなければその注文は消えてしまいます。</p>

  <h2>この問題には、まぎらわしい選択が3か所ある</h2>
  <table>
    <tr><th style="width:24%">論点</th><th style="width:32%">正しいほう</th><th>もう一方ができないこと</th></tr>
    <tr><td>SQS か SNS か</td><td class="good"><strong>SQSキュー</strong>：ジョブをためて、空いた人が取りに行く</td><td><strong>SNS</strong>は受け取った瞬間に全員へ配るだけ。<strong>ためられないので残件数を数えられない</strong></td></tr>
    <tr><td>起動テンプレート か 起動設定 か</td><td class="good"><strong>起動テンプレート</strong>：現行の方式。バージョン管理ができ、新しい機能にも対応</td><td><strong>起動設定</strong>は旧方式で、いったん作ると変更できず、AWSも新規利用を推奨していない</td></tr>
    <tr><td>バックログ／インスタンス か メッセージ総数 か</td><td class="good"><strong>インスタンスあたりのバックログ</strong>：残件数 ÷ 台数。1台の負担を一定に保つ</td><td><strong>メッセージ総数</strong>は台数を考えない生の件数。<strong>1,000件という数字が「10台で足りている」のか「足りない」のか判断できない</strong></td></tr>
  </table>
  <p>3つ目がいちばん差がつきます。「残り1,000件」と言われても、1台で処理しているのか100台で処理しているのかで意味はまるで違います。<strong>1台あたり何件を抱えているか</strong>に直せば、そのまま「増やすか減らすか」の判断になります。</p>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. SNSトピック＋起動テンプレート＋インスタンスあたりのバックログ</h3>
      <p>後半2つは正解と同じで正しい選択です。問題は先頭のSNSです。</p>
      <p class="why">SNSにはためる機能がないので、そもそも「キューメッセージ数」が存在しません。指標が取れず、ヒント1・ヒント2の両方が成り立ちません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. SNSトピック＋起動設定＋メッセージ総数</h3>
      <p>3つの論点すべてで、もう一方を選んでしまっています。</p>
      <p class="why">SNSでためられず、起動設定は旧方式で、総数では1台あたりの負担が分かりません。全部のヒントに反します。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>C. SQSキュー＋起動テンプレート＋インスタンスあたりのバックログ</h3>
      <p>ジョブをSQSにため、起動テンプレートでインスタンスの設計図を用意し、「1台あたりの残件数」を一定に保つようにターゲット追跡でスケールします。</p>
      <p class="why">3つのヒントすべてに、3つの論点すべてで正しく答えています。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. SQSキュー＋起動テンプレート＋メッセージ総数</h3>
      <p>SQSと起動テンプレートは正しく、構成としては動きます。落とし穴は指標です。</p>
      <p class="why">メッセージ総数は台数を考えない生の件数なので、<strong>台数が増えても指標は下がらず、増やし続けたり減らせなくなったりします</strong>。ヒント2の「負荷に応じて」を正しく満たせません。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：C　Amazon SQSキューを作成し、起動テンプレートを使い、インスタンスあたりのバックログを指標にしたターゲット追跡スケーリングポリシーを設定したAuto Scalingグループを構成する</strong></p>
    <p class="oboe">覚え方 —— 3つの判定ルールをセットで持っておきます。<strong>（1）「疎結合」「ためる」「並列に処理」ならSQS。「全員に知らせる」「ファンアウト」ならSNS。（2）Auto Scalingの設計図は必ず起動テンプレート。起動設定と書いてあれば旧方式なので不正解。（3）キュー連動のスケーリング指標は必ず「インスタンスあたりのバックログ（残件数÷台数）」。メッセージ総数は台数を考慮しないので不正解。</strong></p>
  </div>`
  },

  {
    id: 'e1q33',
    q: '次のバケットポリシーでS3バケットに対する権限設定を行っている。{"Version":"2012-10-17","Id":"S3PolicyId1","Statement":[{"Sid":"IPAllow","Effect":"Deny","Principal":"*","Action":"s3:*","Resource":"arn:aws:s3:::examplebucket/*","Condition":{"NotIpAddress":{"aws:SourceIp":"54.240.143.0/24"}}}]} ／ この設定内容として正しい内容を選択せよ。',
    choices: [
      'このS3バケットに対して、指定されたIPアドレス範囲から全てのアクションが実行可能である',
      'このS3バケットに対して、指定されたIPアドレス範囲以外から全てのアクションが実行可能である',
      'このS3バケットに対して、指定されたIPアドレス範囲からのアクセスが拒否されている',
      'このS3バケットに対して、指定されたIPアドレス範囲以外からのアクセスが拒否されている',
    ],
    answer: 3,
    explain: `
  <h2>まず、ポリシーの中の「3つのヒント」</h2>
  <table>
    <tr><th style="width:38%">ポリシーの記述</th><th>ここから分かること</th></tr>
    <tr><td>"Effect": "<strong>Deny</strong>"</td><td>これは許可の文ではなく、禁止の文。「◯◯を拒否する」と読む</td></tr>
    <tr><td>"Condition": { "<strong>NotIpAddress</strong>": ... }</td><td><mark>Not がついている。「一致しないとき」に、この文が発動する</mark></td></tr>
    <tr><td>"aws:SourceIp": "54.240.143.0/24"</td><td>基準になるIPアドレスの範囲。54.240.143.0 から 54.240.143.255 までの256個</td></tr>
  </table>
  <p>読み方はひとつずつ組み立てます。<strong>「送信元IPが 54.240.143.0/24 <u>ではない</u>とき（NotIpAddress）、すべての操作を<u>拒否</u>する（Deny）」</strong>。ここまで分解できれば、あとは選ぶだけです。</p>

  <h2>どこから来たかで、通るか通らないかが決まる</h2>
  <div class="vs">
    <div class="pane good">
      <div class="pane-h">◯ 54.240.143.0/24 の中から来た場合</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/gen-client.svg" alt=""></span>
          <span class="lbl">社内ネットワーク</span><span class="sub">54.240.143.25 など</span>
        </div>
        <div class="link ok"><span>NotIpAddress に当たらない → Denyは発動しない</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/amazon-simple-storage-service.svg" alt=""></span>
          <span class="lbl">S3バケット</span><span class="sub">アクセスできる</span>
        </div>
      </div>
      <p class="note">このポリシーでは止められません。ただし、別に許可が与えられている必要はあります。</p>
    </div>
    <div class="pane bad">
      <div class="pane-h">✕ それ以外の場所から来た場合</div>
      <div class="nodes v">
        <div class="node ng">
          <span class="ico"><img src="assets/icons/gen-internet.svg" alt=""></span>
          <span class="lbl">社外・カフェ・自宅</span><span class="sub">203.0.113.9 など</span>
        </div>
        <div class="link ng"><span>NotIpAddress に当たる → Denyが発動</span><span class="l">↓</span></div>
        <div class="node ng">
          <span class="ico"><img src="assets/icons/gen-firewall.svg" alt=""></span>
          <span class="lbl">すべての操作を拒否</span><span class="sub">読み取りも書き込みも通らない</span>
        </div>
      </div>
      <p class="note">明示的なDenyなので、他にどんな許可があっても覆せません。</p>
    </div>
  </div>
  <p class="caption">指定した範囲が「通してよい入口」、それ以外はすべて締め出す設定です。</p>
  <p>これは<strong>社員通用口だけを開けておく</strong>のと同じです。「通用口<u>以外</u>から入ろうとした人は通さない」と書いてあるので、結果として通用口から来た人だけが入れます。</p>

  <h2>まぎらわしい4つの書き方を区別する</h2>
  <table>
    <tr><th style="width:30%">書き方</th><th style="width:34%">意味</th><th>結果</th></tr>
    <tr><td class="good">Deny ＋ NotIpAddress</td><td class="good">「その範囲<strong>以外</strong>から来たら拒否」</td><td class="good">指定範囲からだけ使える（今回のポリシー）</td></tr>
    <tr><td>Deny ＋ IpAddress</td><td>「その範囲<strong>から</strong>来たら拒否」</td><td>指定範囲だけを締め出す。正反対の意味になる</td></tr>
    <tr><td>Allow ＋ IpAddress</td><td>「その範囲から来たら許可」</td><td>似た結果になるが、<strong>他の場所からのDenyにはならない</strong>。別の場所に強いAllowがあれば通ってしまう</td></tr>
    <tr><td>Allow ＋ NotIpAddress</td><td>「その範囲以外から来たら許可」</td><td>社外だけを通す設定。今回の意図と真逆</td></tr>
  </table>
  <p>アクセスを確実に閉じたいときは、<strong>Allowで絞るのではなくDenyで閉じる</strong>のが定石です。明示的なDenyだけが、他のすべての許可を打ち消せるからです。</p>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. 指定されたIPアドレス範囲から全てのアクションが実行可能である</h3>
      <p>結果だけ見れば近いのですが、このポリシーは<strong>何かを許可する文ではありません</strong>。Denyしか書かれていないので、実行できるかどうかは別の許可設定しだいです。</p>
      <p class="why">ヒント1（EffectはDeny）を読み違えています。「このポリシーが何をしているか」の説明として誤りです。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. 指定されたIPアドレス範囲以外から全てのアクションが実行可能である</h3>
      <p>Denyが発動するまさにその条件を、「実行可能」と説明してしまっています。</p>
      <p class="why">ヒント1とヒント2の両方を逆に読んでいます。意味が正反対です。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. 指定されたIPアドレス範囲からのアクセスが拒否されている</h3>
      <p><code>NotIpAddress</code> の <code>Not</code> を読み飛ばすと、この読み方になります。いちばん引っかかりやすい選択肢です。</p>
      <p class="why">ヒント2のとおり、Denyが発動するのは「一致<strong>しない</strong>とき」です。指定範囲からのアクセスは、このポリシーでは拒否されません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>D. 指定されたIPアドレス範囲以外からのアクセスが拒否されている</h3>
      <p>「送信元IPが 54.240.143.0/24 ではないとき、すべての操作を拒否する」をそのまま日本語にした文です。</p>
      <p class="why">3つのヒントを組み立てた結論と一致します。これが正解です。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：D　このS3バケットに対して、指定されたIPアドレス範囲以外からのアクセスが拒否されている</strong></p>
    <p class="oboe">覚え方 —— <strong>ポリシーは「Effect（AllowかDenyか）」と「Condition（いつ発動するか）」を分けて読み、最後にくっつける。</strong>特に<strong><code>Not</code> が付いたConditionキー（NotIpAddress、StringNotEquals など）は「〜でないとき」。読み飛ばすと意味が真逆になる</strong>ので、必ず指で押さえて確認してください。実務でも試験でも、<strong>「特定の場所からだけ許したい」ときの定番は Deny ＋ NotIpAddress</strong>です。Allowで絞る方式は他のAllowに負ける可能性があるため使いません。</p>
  </div>`
  },

  {
    id: 'e1q34',
    q: 'ある企業は、オンプレミス環境において複数の仮想マシン（VM）とMySQLデータベースを利用したアプリケーションを運用している。このアプリケーションの災害復旧（DR）対応として、AWSクラウドにリカバリ構成を実現する必要がある。要件は、自動フェイルオーバーが実施できること、目標復旧時間（RTO）を15分とすること、フェイルオーバーソリューションをテストしてリカバリを検証できることである。これらの要件を満たす最適なソリューションはどれか。',
    choices: [
      'AWS DataSyncとAWS Storage Gatewayを使用してバックアップデータをAWSに同期させる。Amazon EC2、Amazon S3、ALBを使用してスタンバイ構成を準備する。Amazon Route 53のフェイルオーバールーティングをスタンバイ構成とオンプレミス環境に設定する',
      'AWS Replication Agentを使用して仮想マシン（VM）を増分的にAWS環境にレプリケートする。Elastic Disaster Recoveryを設定してウォームスタンバイ構成を準備する',
      'AWS Backupを使用してオンプレミスのVMのバックアップを取得して、スタンバイ構成を保持する。Amazon Route 53のフェイルオーバールーティングをバックアップ構成とオンプレミス環境に設定する',
      'AWS DataSyncとAWS Storage Gatewayを使用してバックアップデータをAWS環境に同期させる。Elastic Disaster Recoveryを設定してウォームスタンバイ構成を準備する',
    ],
    answer: 1,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>オンプレミスの<strong>複数の仮想マシン（VM）</strong>ごと移したい</td><td>ファイルのコピーではなく、<strong>サーバーまるごと</strong>を継続的に複製する必要がある</td></tr>
    <tr><td>目標復旧時間（RTO）を15分</td><td><mark>15分以内に立ち上がること。バックアップから作り直していては絶対に間に合わない</mark></td></tr>
    <tr><td>テストしてリカバリを検証できる</td><td>本番を止めずに「訓練」ができる仕組みであること</td></tr>
  </table>

  <h2>AWS Elastic Disaster Recoveryの動き</h2>
  <div class="nodes v">
    <div class="node">
      <span class="ico"><img src="assets/icons/group-corporate-data-center.svg" alt=""></span>
      <span class="lbl">オンプレミスのVM群</span><span class="sub">AWS Replication Agentを入れる</span>
    </div>
    <div class="link"><span>ディスクの変更ぶんだけを絶えず送り続ける（増分レプリケーション）</span><span class="l">↓</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/aws-elastic-disaster-recovery.svg" alt=""></span>
      <span class="lbl">AWS Elastic Disaster Recovery</span><span class="sub">安価なステージング領域に最新のコピーを保持（ウォームスタンバイ）</span>
    </div>
    <div class="link ok"><span>災害発生 → 数分でEC2として起動</span><span class="l">↓</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/amazon-ec2.svg" alt=""></span>
      <span class="lbl">AWS上で本番稼働</span><span class="sub">平常時に「訓練用の起動」だけを試すこともできる</span>
    </div>
  </div>
  <p class="caption">ふだんは安いディスクだけを持ち、いざというときにEC2として立ち上げます。人がやることは切り替えの合図だけです。</p>
  <p>これは<strong>消防訓練つきの非常階段</strong>のようなものです。階段（コピー）はいつでも使える状態で維持され、しかも本番を止めずに「降りてみる練習」ができます。バックアップから作り直す方式は、火事になってから階段を組み立て始めるようなものです。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <table>
    <tr><th style="width:26%">名前</th><th style="width:34%">正体（たとえ）</th><th>できないこと・向かないこと</th></tr>
    <tr><td class="good">AWS Elastic Disaster Recovery（＋Replication Agent）</td><td class="good">サーバーまるごとを常時複製し、災害時に数分でEC2として起動する災害復旧の専用サービス</td><td>アプリの作り替えはしない。エージェントを入れられないVMには使えない</td></tr>
    <tr><td>AWS DataSync</td><td>オンプレとAWSの間で<strong>ファイルやフォルダ</strong>を高速に同期する引っ越し業者</td><td><strong>サーバーまるごとは運べない。</strong>OSやアプリの状態は復元できない</td></tr>
    <tr><td>AWS Storage Gateway</td><td>オンプレから見るとローカルのディスクに見える、AWSにつながった<strong>共有フォルダ</strong></td><td>同じくファイル単位。サーバーの起動可能なイメージにはならない</td></tr>
    <tr><td>AWS Backup</td><td>バックアップを一元管理する司令塔。定時に取って保管する</td><td><strong>取り出して復元するのに時間がかかる。</strong>RTO 15分には届かない</td></tr>
  </table>
  <p>Route 53のフェイルオーバールーティングも登場しますが、これは<strong>宛先を切り替える案内係</strong>にすぎません。切り替えた先にすぐ動くサーバーがなければ、案内しても行き先は空っぽです。</p>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. DataSync＋Storage Gatewayでデータ同期、EC2・S3・ALBでスタンバイ、Route 53でフェイルオーバー</h3>
      <p>運んでいるのは<strong>ファイルだけ</strong>です。VMの中身（OS・ミドルウェア・設定）は運べません。</p>
      <p class="why">ヒント1（VMまるごと）を満たさず、切り替え先を人手で作り込む必要があるためヒント2のRTO 15分にも届きません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>B. AWS Replication AgentでVMを増分レプリケートし、Elastic Disaster Recoveryでウォームスタンバイを準備する</h3>
      <p>VMの中身がまるごと、変更ぶんだけ絶えずAWSへ送られます。災害時は数分でEC2として起動でき、平常時には訓練用の起動テストも行えます。</p>
      <p class="why">ヒント1（VMまるごと）、ヒント2（RTO 15分）、ヒント3（テストできる）をすべて満たします。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. AWS Backupでオンプレのバックアップを取得し、Route 53でフェイルオーバーする</h3>
      <p>バックアップは「保管」であって「待機」ではありません。復元にはデータの取り出しとサーバーの構築が必要です。</p>
      <p class="why">15分では終わりません。ヒント2に届かず、自動フェイルオーバーも成立しません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. DataSync＋Storage Gatewayで同期し、Elastic Disaster Recoveryでウォームスタンバイを準備する</h3>
      <p>後半のElastic Disaster Recoveryは正しい選択です。しかし前半が噛み合っていません。</p>
      <p class="why">Elastic Disaster Recoveryが必要とするのは<strong>Replication Agentが送るブロック単位の複製</strong>であって、DataSyncのファイル同期ではありません。<strong>部品の組み合わせが成立していない</strong>ので、ヒント1を満たせません。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：B　AWS Replication Agentを使用してVMを増分的にAWSにレプリケートし、Elastic Disaster Recoveryでウォームスタンバイ構成を準備する</strong></p>
    <p class="oboe">覚え方 —— <strong>DR問題はRTO（何分で復旧するか）だけで答えが決まる。数時間〜1日ならバックアップ＆リストア、数十分〜数分ならパイロットライト／ウォームスタンバイ（＝Elastic Disaster Recovery）、ほぼ0秒ならマルチサイト（常時両系稼働）。</strong>あわせて運ぶ単位も覚えます。<strong>「サーバーまるごと」ならElastic Disaster Recovery／Application Migration Service、「ファイル・フォルダ」ならDataSync、「オンプレから使う共有ディスク」ならStorage Gateway。</strong>この2軸で、移行とDRの問題はほぼ切り分けられます。</p>
  </div>`
  },

  {
    id: 'e1q35',
    q: 'ある企業は、Amazon SQSキューとAWS Lambdaを用いてサーバーレスアプリケーションを設計している。フロントエンド処理を行うLambda関数からAmazon SQSキューにメッセージを送信し、SQSキューからメッセージを受け取ったEC2インスタンスのバックエンドサーバーがタスクを並行して処理する。Lambda関数と連携するAmazon SQSキューはデフォルトの許可設定が利用される。この前提で、Lambda関数を使用してSQSにメッセージを送信するために必須となる設定はどれか。',
    choices: [
      '適切なポリシーが定義されたSQSアクセスポリシーをLambda関数に設定して、Amazon SQSへのアクセスを可能にする',
      'Lambda関数をAmazon API Gatewayと統合して、Amazon SQSキューを処理するように設定する',
      '適切なポリシーが付与されたIAMロールをLambda関数に設定して、Amazon SQSへのアクセスを許可する',
      'セキュリティグループをLambda関数に設定して、Amazon SQSへのアクセスを可能にする',
    ],
    answer: 2,
    explain: `
  <h2>まず、問題文の中の「2つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>SQSキューは<strong>デフォルトの許可設定</strong></td><td><mark>キュー側の設定はいじらない前提。だから許可を足す場所は「呼ぶ側」しかない</mark></td></tr>
    <tr><td>Lambda関数からSQSにメッセージを送信する</td><td>Lambdaが自分の身元を示して <code>sqs:SendMessage</code> を実行できる必要がある</td></tr>
  </table>
  <p>SQSキューのデフォルト設定は、<strong>「同じAWSアカウントの中の、許可を持つ相手なら使ってよい」</strong>という状態です。つまりキュー側はすでに扉を開けています。あとは、Lambda側が「自分にはその権限がある」と示せるかどうかだけです。</p>

  <h2>Lambdaに権限を持たせる唯一の場所</h2>
  <div class="nodes v">
    <div class="node ok">
      <span class="ico"><img src="assets/icons/aws-lambda.svg" alt=""></span>
      <span class="lbl">Lambda関数</span><span class="sub">自分では権限を持てない</span>
    </div>
    <div class="link ok"><span>実行ロール（IAMロール）を身につける</span><span class="l">↓</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/res-aws-identity-access-management-role.svg" alt=""></span>
      <span class="lbl">IAMロール</span><span class="sub">sqs:SendMessage を許可するポリシーを付けておく</span>
    </div>
    <div class="link ok"><span>この身分でメッセージを送る</span><span class="l">↓</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/amazon-simple-queue-service.svg" alt=""></span>
      <span class="lbl">SQSキュー</span><span class="sub">デフォルト設定のまま受け取れる</span>
    </div>
  </div>
  <p class="caption">Lambdaは実行ロールという「作業員バッジ」を身につけて動きます。バッジに書かれた作業だけができます。</p>
  <p>工事現場を想像してください。<strong>現場（SQS）の門は開いているけれど、入るには作業員バッジが要る</strong>。Lambdaというアルバイトは、バッジ（IAMロール）を渡されて初めて資材を運び込めます。バッジがなければ、門が開いていても追い返されます。</p>

  <h2>許可の書き方は2種類ある。どちらを使う場面か</h2>
  <div class="vs">
    <div class="pane good">
      <div class="pane-h">◯ アイデンティティベース（呼ぶ側に付ける）</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/res-aws-identity-access-management-role.svg" alt=""></span>
          <span class="lbl">LambdaのIAMロール</span><span class="sub">「私はSQSに送ってよい」</span>
        </div>
      </div>
      <p class="note">同じアカウントの中での連携は、これだけで足ります。今回はこちら。</p>
    </div>
    <div class="pane bad">
      <div class="pane-h">△ リソースベース（キュー側に付ける）</div>
      <div class="nodes v">
        <div class="node dim">
          <span class="ico"><img src="assets/icons/amazon-simple-queue-service.svg" alt=""></span>
          <span class="lbl">SQSアクセスポリシー</span><span class="sub">「このキューは誰に使わせるか」</span>
        </div>
      </div>
      <p class="note">別アカウントやS3などのサービスから使わせるときに必要になります。今回は「デフォルトのまま」なので触りません。</p>
    </div>
  </div>
  <p class="caption">大事なのは、SQSアクセスポリシーは<strong>キューに付けるもので、Lambda関数には付けられない</strong>ということです。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <table>
    <tr><th style="width:26%">名前</th><th style="width:34%">正体</th><th>できないこと</th></tr>
    <tr><td class="good">IAMロール（Lambdaの実行ロール）</td><td class="good">Lambdaが「自分は何をしてよいか」を示す作業員バッジ</td><td>別アカウントのキューを使うときは、相手側の許可も別途必要</td></tr>
    <tr><td>SQSアクセスポリシー</td><td>キューの側に貼る「誰に使わせるか」の張り紙</td><td><strong>Lambda関数には設定できない。</strong>付け先がそもそも違う</td></tr>
    <tr><td>セキュリティグループ</td><td>VPCの中で、どのIPやポートの通信を通すかを決める仮想ファイアウォール</td><td><strong>権限の話ではない。</strong>SQSはVPCの外にある公開エンドポイントなので、これでは許可できない</td></tr>
    <tr><td>Amazon API Gateway</td><td>APIの受付窓口を作るサービス</td><td>権限を与える機能ではない。今回は呼び出し口の話ですらない</td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. SQSアクセスポリシーをLambda関数に設定する</h3>
      <p>SQSアクセスポリシーは実在する仕組みですが、<strong>キューに貼るもの</strong>です。Lambda関数に設定することはできません。</p>
      <p class="why">付け先が違ううえ、ヒント1で「キューはデフォルトのまま」と指定されています。触ってはいけない場所を触っています。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. Lambda関数をAPI Gatewayと統合する</h3>
      <p>API GatewayはAPIの受付窓口を作るサービスです。Lambdaを外部から呼び出したいときに使います。</p>
      <p class="why">今回困っているのは「Lambdaが呼ばれる方法」ではなく「Lambdaが送る権限」です。ヒント2に答えていません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>C. 適切なポリシーが付与されたIAMロールをLambda関数に設定する</h3>
      <p><code>sqs:SendMessage</code> を許可するポリシーを付けたIAMロールを、Lambdaの実行ロールとして設定します。これだけで送信できます。</p>
      <p class="why">ヒント1（キューは触らない）とヒント2（送る権限）の両方を満たす、唯一の選択肢です。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. セキュリティグループをLambda関数に設定する</h3>
      <p>セキュリティグループは、VPCの中でIPアドレスやポートの通信を制御する仮想のファイアウォールです。</p>
      <p class="why">扱っているのは<strong>通信経路</strong>であって<strong>権限</strong>ではありません。SQSはVPCの外にあるので、そもそもこの設定では届きません。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：C　適切なポリシーが付与されたIAMロールをLambda関数に設定して、Amazon SQSへのアクセスを許可する</strong></p>
    <p class="oboe">覚え方 —— <strong>「AWSのサービスAがサービスBを呼ぶ権限がほしい」と書いてあったら、答えは常にIAMロール。</strong>LambdaならLambdaの実行ロール、EC2ならインスタンスプロファイル。迷う必要はありません。<strong>リソースベースのポリシー（SQSアクセスポリシー、S3バケットポリシーなど）が必要になるのは、別アカウントから使わせるとき、または他のAWSサービスに直接呼ばせるときだけ。</strong>あわせて、<strong>セキュリティグループは「通信」の制御であって「権限」の制御ではない</strong>ことも覚えておくと、この手の4択は即決できます。</p>
  </div>`
  },
  {
    id: 'e1q36',
    q: 'ある企業のアプリケーションでは、大量のクリックストリームデータをAmazon S3バケットに保存するクリックストリーム分析ツールを開発している。ウェブサイトから送信される膨大なクリックストリームをAPI経由で取り込んでデータ処理をした上で、未加工のデータをAmazon S3バケットに保存する。その後、S3バケットに保存されたクリックストリームデータを迅速に分析するためのデータパイプラインを構成する。このパイプラインでは、データ内容に応じて保存データを分類した上で、一部のデータはさらに分析する必要がある。運用上のオーバーヘッドを抑えつつ、これらの要件を満たすソリューションはどれか。（3つ選択）',
    choices: [
      'Amazon API Gateway APIに連動したAWS Lambda関数がクリックストリームを取得し、Amazon Kinesis Data Streamsに送信してデータ処理を行う',
      'Amazon API Gateway APIに連動したAWS Lambda関数がクリックストリームを取得し、Amazon Data Firehoseに送信してデータ処理を行う',
      'Kinesis Data Streamsがクリックストリームデータを処理し、Amazon Data Firehoseを使用してデータをAmazon S3バケットに保存する',
      'Amazon Data Firehoseがクリックストリームデータを処理して、データをAmazon S3バケットに保存する',
      'AWS Glueクローラーを設定し、Amazon S3バケット内のデータを分割する',
      'Amazon Athenaを設定し、Amazon S3バケット内のデータを分割する',
    ],
    answer: [0, 2, 4],
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>膨大なクリックストリームを<strong>API経由で取り込んで</strong>データ処理</td><td>受付はAPI Gateway＋Lambda。その先に、流れ続けるデータをためて処理する川が要る</td></tr>
    <tr><td>未加工のデータをS3バケットに保存する</td><td>川からS3へ流し込む配送係が別に要る。<mark>「ためて処理する」係と「届ける」係は別のサービス</mark></td></tr>
    <tr><td>データ内容に応じて分類した上で、一部をさらに分析</td><td>S3に置いたあと、中身を見て目録を作る係が要る</td></tr>
  </table>
  <p>登場人物が3人必要だと分かります。<strong>（1）流れを受け止める人、（2）S3へ届ける人、（3）置いたあと目録を作る人</strong>。だから選ぶのも3つです。</p>

  <h2>データが通る道</h2>
  <div class="nodes v">
    <div class="node">
      <span class="ico"><img src="assets/icons/amazon-api-gateway.svg" alt=""></span>
      <span class="lbl">API Gateway ＋ Lambda</span><span class="sub">ウェブサイトからのクリックを受け付ける窓口</span>
    </div>
    <div class="link ok"><span>① 流れ込むデータを送る</span><span class="l">↓</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/amazon-kinesis-data-streams.svg" alt=""></span>
      <span class="lbl">Kinesis Data Streams</span><span class="sub">データを一定期間ためておく「川」。複数の処理が同じデータを読める</span>
    </div>
    <div class="link ok"><span>② 川から引いてS3へ流し込む</span><span class="l">↓</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/amazon-data-firehose.svg" alt=""></span>
      <span class="lbl">Amazon Data Firehose</span><span class="sub">配送専門。まとめてS3へ書き込む。サーバー管理は不要</span>
    </div>
    <div class="link"><span>未加工データが貯まる</span><span class="l">↓</span></div>
    <div class="node">
      <span class="ico"><img src="assets/icons/amazon-simple-storage-service.svg" alt=""></span>
      <span class="lbl">Amazon S3バケット</span><span class="sub">ただのファイルの山。このままでは中身が分からない</span>
    </div>
    <div class="link ok"><span>③ 中を見て目録をつくる</span><span class="l">↓</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/aws-glue.svg" alt=""></span>
      <span class="lbl">AWS Glue クローラー</span><span class="sub">列の種類や区切りを自動で読み取り、データカタログに登録する</span>
    </div>
  </div>
  <p class="caption">◯を付けた3か所が、選ぶべき3つの選択肢です。</p>

  <h2>「川」と「送水管」は役割が違う</h2>
  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ Firehoseだけで受け止める</div>
      <div class="nodes v">
        <div class="node ng">
          <span class="ico"><img src="assets/icons/amazon-data-firehose.svg" alt=""></span>
          <span class="lbl">Data Firehose</span><span class="sub">受け取ったそばからS3へ流すだけ</span>
        </div>
        <div class="link ng"><span>データは手元に残らない</span><span class="l">↓</span></div>
        <div class="node ng">
          <span class="ico"><img src="assets/icons/gen-question.svg" alt=""></span>
          <span class="lbl">別の処理から読み直せない</span><span class="sub">「一部をさらに分析」に対応できない</span>
        </div>
      </div>
      <p class="note">送水管なので、水をためる機能がありません。一度流れたデータは戻せません。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ Kinesis Data Streamsで受け止める</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/amazon-kinesis-data-streams.svg" alt=""></span>
          <span class="lbl">Kinesis Data Streams</span><span class="sub">既定で24時間（最大365日）データを保持する</span>
        </div>
        <div class="link ok"><span>同じデータを何人でも読める</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/gen-data-stream.svg" alt=""></span>
          <span class="lbl">S3保存用・リアルタイム分析用…</span><span class="sub">用途ごとに処理を足せる</span>
        </div>
      </div>
      <p class="note">川なので水がたまります。あとから別の処理を追加しても、同じデータを読めます。</p>
    </div>
  </div>
  <p class="caption">Data Firehoseは「川からS3へ引く送水管」。川そのものの代わりにはなりません。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <table>
    <tr><th style="width:26%">名前</th><th style="width:34%">役割（たとえ）</th><th>できないこと</th></tr>
    <tr><td class="good">Kinesis Data Streams</td><td class="good">流れ続けるデータをためておく川。複数の処理が同じ水を汲める</td><td>それ自体はS3に書き込まない。配送はFirehoseなどに任せる</td></tr>
    <tr><td class="good">Amazon Data Firehose</td><td class="good">川からS3やRedshiftへ引く送水管。設定だけで動き、サーバー管理が不要</td><td><strong>データをためない。</strong>あとから読み直せず、複数の処理に配れない</td></tr>
    <tr><td class="good">AWS Glue クローラー</td><td class="good">S3の中身を読んで、どんな列があるかの<strong>目録（データカタログ）</strong>を自動で作る司書</td><td>データそのものを検索したり集計したりはしない</td></tr>
    <tr><td>Amazon Athena</td><td>S3のデータにSQLを投げて<strong>集計・検索する</strong>分析ツール</td><td><strong>データを分類したり目録を作ったりはしない。</strong>Glueが作った目録を使う側</td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>A. API Gateway＋Lambdaがクリックストリームを取得し、Kinesis Data Streamsに送信する</h3>
      <p>受付で集めたクリックを、ためられる川へ流し込みます。あとから処理を足しても同じデータを読めます。</p>
      <p class="why">ヒント1の「API経由で取り込んでデータ処理」と、ヒント3の「一部をさらに分析」の両方に備える構成です。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. API Gateway＋Lambdaがクリックストリームを取得し、Data Firehoseに送信する</h3>
      <p>Firehoseは受け取ったデータを、まとめて保存先へ流すだけの送水管です。手元には残りません。</p>
      <p class="why">ためられないので、ヒント3の「一部のデータをさらに分析」に後から対応できません。川の代わりにはなりません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>C. Kinesis Data Streamsが処理し、Data Firehoseを使ってS3バケットに保存する</h3>
      <p>川から送水管を引いてS3へ流します。Firehoseはサーバーの用意もスケーリングの調整も不要で、設定するだけで動きます。</p>
      <p class="why">ヒント2の「未加工データをS3へ保存」を、いちばん手間をかけずに実現します。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. Data Firehoseがクリックストリームを処理して、S3バケットに保存する</h3>
      <p>Bと同じ理由です。Firehoseだけで受け止めると、データをためておけません。</p>
      <p class="why">Cとの違いは「川があるかどうか」です。川がないと、ヒント3に必要な読み直しができません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>E. AWS Glueクローラーを設定し、S3バケット内のデータを分割する</h3>
      <p>クローラーはS3の中身を自動で読みに行き、「どんな列があるか」「どう区切られているか」を判定して目録に登録します。人が定義を書く必要がありません。</p>
      <p class="why">ヒント3の「データ内容に応じて保存データを分類する」に直接答えており、運用の手間も最小です。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>F. Amazon Athenaを設定し、S3バケット内のデータを分割する</h3>
      <p>AthenaはS3のデータにSQLで問い合わせる分析ツールです。分析する側であって、分類する側ではありません。</p>
      <p class="why">そもそもAthenaが動くには、<strong>Glueが作った目録が先に必要</strong>です。順番が逆で、ヒント3の答えになっていません。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：A・C・E　API Gateway＋LambdaからKinesis Data Streamsへ送り、Data FirehoseでS3に保存し、AWS GlueクローラーでS3内のデータを分類する</strong></p>
    <p class="oboe">覚え方 —— <strong>ストリーミング分析の役割分担は「川・送水管・司書・分析官」の4人セットで覚える。Kinesis Data Streams＝ためて複数に配る川、Data Firehose＝S3などへ流すだけの送水管（ためない）、AWS Glue＝中身を読んで目録を作る司書、Athena＝目録を使ってSQLで調べる分析官。</strong>判定ルールはひとつ。<strong>「あとから読み直したい」「複数の処理に配りたい」ならData Streamsが必要。「ただ保存先へ届けたい」だけならFirehose単独でよい。</strong></p>
  </div>`
  },

  {
    id: 'e1q37',
    q: 'ある企業は、AWS上でWEBアプリケーションを運用している。Amazon RDS MySQLのマルチAZ配置のデータベースインスタンスと、EC2インスタンスを基盤としたWEBサーバーで構成されている。ソリューションアーキテクトは、現在のデータベース認証方式が安全性に欠けるため、セキュリティ設定の強化を求められた。ユーザーの認証情報を自動的にローテーションし、WEBサーバーからのデータベース接続を安全に保つ必要がある。どのような対策を講じるべきか。',
    choices: [
      'ユーザー認証情報をAWS Secrets Managerのシークレットに保存する。IAMアクセス許可を付与して、EC2インスタンスによるAWS Secrets Managerへのアクセスを許可する',
      'データベースユーザー認証機能をAWS Systems Manager パラメーターストアに保存する。IAMアクセス許可を付与して、EC2インスタンスによるOpsCenterへのアクセスを許可する',
      'ユーザー認証情報をAWS Secrets Manager パラメーターストアに保存する。IAMアクセス許可を付与して、EC2インスタンスによるパラメーターストアへのアクセスを許可する',
      'ユーザー認証情報をAWS Systems Manager パラメーターストアに保存する。IAMアクセス許可を付与して、EC2インスタンスによるOpsCenterへのアクセスを許可する',
    ],
    answer: 0,
    explain: `
  <h2>まず、問題文の中の「2つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>認証情報を<strong>自動的にローテーション</strong>し</td><td><mark>パスワードを定期的に自動で作り直す機能が要る。ここが決め手</mark></td></tr>
    <tr><td>WEBサーバーからのデータベース接続を安全に保つ</td><td>EC2がパスワードを直接持たず、必要なときに取りに行く形にする</td></tr>
  </table>

  <h2>パスワードを「置き場所から取りに行く」形にする</h2>
  <div class="nodes v">
    <div class="node ok">
      <span class="ico"><img src="assets/icons/res-amazon-ec2-instances.svg" alt=""></span>
      <span class="lbl">EC2 WEBサーバー</span><span class="sub">ソースコードにパスワードを書かない</span>
    </div>
    <div class="link ok"><span>IAMロールの権限で取りに行く</span><span class="l">↓</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/aws-secrets-manager.svg" alt=""></span>
      <span class="lbl">AWS Secrets Manager</span><span class="sub">暗号化して保管。最新のパスワードを返す</span>
    </div>
    <div class="link ok"><span>定期的に新しいパスワードを作り、DB側も同時に更新する</span><span class="l">↓</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/amazon-rds.svg" alt=""></span>
      <span class="lbl">RDS MySQL</span><span class="sub">保管庫とDBのパスワードが常に一致する</span>
    </div>
  </div>
  <p class="caption">Secrets Managerは「作り直し」と「DB側への反映」を両方やります。ここが他のサービスとの決定的な違いです。</p>
  <p>これは<strong>ホテルのカードキー</strong>と同じ仕組みです。フロント（Secrets Manager）が定期的にカードを作り直し、同時に部屋のドア（RDS）の設定も書き換えます。宿泊客（EC2）は、使うたびにフロントで最新のカードを受け取ります。<strong>片方だけ書き換えたらドアは開かなくなる</strong>ので、両方を同時に更新できることが重要です。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <table>
    <tr><th style="width:26%">名前</th><th style="width:34%">正体</th><th>できないこと</th></tr>
    <tr><td class="good">AWS Secrets Manager</td><td class="good">パスワードやAPIキー専用の金庫。<strong>RDS・Aurora・Redshiftなら、パスワードの自動ローテーションが標準機能</strong></td><td>保管するシークレット1件ごとに月額がかかる（パラメータストアより高い）</td></tr>
    <tr><td>AWS Systems Manager パラメータストア</td><td>設定値を入れておく引き出し。暗号化もでき、基本の利用は無料</td><td><strong>自動ローテーション機能がない。</strong>作り直しの処理を自分で書く必要がある</td></tr>
    <tr><td>AWS Systems Manager OpsCenter</td><td>運用中に起きた問題（OpsItem）を集めて管理する<strong>課題管理表</strong></td><td>認証情報とは無関係。ここにアクセス許可を出しても何も解決しない</td></tr>
    <tr><td>「AWS Secrets Manager パラメーターストア」</td><td>—</td><td><strong>そんなサービスは存在しない。</strong>2つのサービス名を混ぜたダミー</td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>A. 認証情報をSecrets Managerのシークレットに保存し、EC2にアクセス許可を与える</h3>
      <p>Secrets ManagerはRDSと連携して、決めた間隔でパスワードを自動的に作り直し、DB側にも同時に反映します。EC2はIAMロールの権限で最新の値を取得します。</p>
      <p class="why">ヒント1（自動ローテーション）とヒント2（EC2が安全に取得）の両方を、追加の作り込みなしで満たします。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. 認証機能をSystems Manager パラメータストアに保存し、EC2にOpsCenterへのアクセスを許可する</h3>
      <p>パラメータストアは値を安全にしまえますが、<strong>自分で作り直してくれる機能はありません</strong>。さらに許可先がOpsCenterになっています。</p>
      <p class="why">ヒント1を満たせません。OpsCenterは運用課題の管理表であり、認証情報を読む場所ではないので、ヒント2にも答えていません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. 「AWS Secrets Manager パラメーターストア」に保存し、EC2にパラメータストアへのアクセスを許可する</h3>
      <p>Secrets Managerとパラメータストアは<strong>別々のサービス</strong>です。この名前のサービスは存在しません。</p>
      <p class="why">実在しない構成なので選べません。名前がそれらしいだけのダミーです。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. 認証情報をSystems Manager パラメータストアに保存し、EC2にOpsCenterへのアクセスを許可する</h3>
      <p>Bとほぼ同じ構成です。保管場所にローテーション機能がなく、許可先も見当違いです。</p>
      <p class="why">ヒント1を満たさず、ヒント2の経路も成立しません。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：A　ユーザー認証情報をAWS Secrets Managerのシークレットに保存し、IAMアクセス許可を付与してEC2インスタンスによるSecrets Managerへのアクセスを許可する</strong></p>
    <p class="oboe">覚え方 —— <strong>「自動ローテーション」の4文字が出たら、答えは問答無用でAWS Secrets Manager。</strong>パラメータストアにこの機能はありません。逆の判定も持っておきます。<strong>ローテーションが不要で、ただ設定値を安全にしまいたいだけなら、無料のSystems Manager パラメータストアで十分。</strong>そして<strong>OpsCenterは運用課題の管理表で、認証情報とは一切関係ない</strong>ので、選択肢に出てきたらその場で消してかまいません。</p>
  </div>`
  },

  {
    id: 'e1q38',
    q: 'ある企業は、オンプレミス環境からAWSへの移行を決定した。現在は火曜日であり、業務に影響を及ぼさないように、今週末の金曜日の夜から月曜日の朝までの72時間以内にデータ移行を完了させる必要がある。移行するデータの容量は10TBであり、データの安全な通信を確保することが求められている。現在、オンプレミス環境とVPCはインターネットを通じて接続されている。この条件に適した移行方法を選定せよ。',
    choices: [
      'Snowball Edgeによるデータ移行を実施する',
      'Direct Connect接続によるデータ転送を実施する',
      'AWSサイト間VPNを利用したVPN接続によるデータ転送を実施する',
      'Storage Gatewayによるデータ移行を実施する',
    ],
    answer: 2,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>現在は火曜日／今週末の72時間以内</td><td><mark>準備に使える時間は3日しかない。開通に何週間もかかる方法は選べない</mark></td></tr>
    <tr><td>データ容量は10TB</td><td>ネットワークで送れる量かどうかを計算して確かめる</td></tr>
    <tr><td>安全な通信を確保する／既にインターネットで接続済み</td><td>通信を暗号化する必要がある。回線そのものは既にある</td></tr>
  </table>

  <h2>まず、間に合うかどうかを計算する</h2>
  <p>10TBをビットに直すと、およそ<strong>80,000,000メガビット</strong>。72時間は259,200秒です。割り算すると、必要な速度は<strong>およそ毎秒308メガビット（308Mbps）</strong>。AWSサイト間VPNのトンネル1本は最大1.25Gbps程度なので、<mark>十分に収まります</mark>。計算してみれば、ネットワーク転送で足りることが確認できます。</p>

  <h3>「使えるようになるまで」に何日かかるか</h3>
  <div class="bars">
    <div class="barrow"><div class="name">サイト間VPN<br>数十分</div><div class="bar green" style="width:6%"></div></div>
    <div class="barrow"><div class="name">Snowball Edge</div><div class="bar red" style="width:50%">発送・往復でおよそ1週間</div></div>
    <div class="barrow"><div class="name">Direct Connect</div><div class="bar red" style="width:100%">回線の敷設に数週間〜数か月</div></div>
  </div>
  <p class="caption">締め切りは3日後。棒が期限内に収まるのはVPNだけです。</p>

  <h2>既にある道に、鍵をかけるだけ</h2>
  <div class="nodes v">
    <div class="node">
      <span class="ico"><img src="assets/icons/group-corporate-data-center.svg" alt=""></span>
      <span class="lbl">オンプレミス環境</span><span class="sub">10TBのデータ</span>
    </div>
    <div class="link ok"><span>インターネット回線はすでに開通済み</span><span class="l">↓</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/aws-site-to-site-vpn.svg" alt=""></span>
      <span class="lbl">AWSサイト間VPN</span><span class="sub">通信を暗号化するトンネルを張る。設定は数十分で終わる</span>
    </div>
    <div class="link ok"><span>暗号化された経路で転送</span><span class="l">↓</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/amazon-virtual-private-cloud.svg" alt=""></span>
      <span class="lbl">AWS VPC</span><span class="sub">72時間以内に完了できる</span>
    </div>
  </div>
  <p class="caption">新しい道を作るのではなく、いまある道に屋根つきの専用通路をかぶせるイメージです。</p>
  <p>VPNは<strong>公道に設置する現金輸送車</strong>のようなものです。道（インターネット）はすでにあるので、あとは中身を見られない車を走らせるだけ。今日申し込んで今日走らせられます。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <table>
    <tr><th style="width:24%">名前</th><th style="width:22%">使えるまでの時間</th><th style="width:20%">向いている場面</th><th>できないこと・向かないこと</th></tr>
    <tr><td class="good">AWSサイト間VPN</td><td class="good">数十分</td><td class="good">すぐ始めたい、数TB規模、暗号化が必要</td><td>インターネットの混み具合に速度が左右される</td></tr>
    <tr><td>AWS Snowball Edge</td><td>発送・往復で約1週間</td><td>数十TB〜PB級、回線が細い、期限に余裕がある</td><td><strong>物理的な配送が必要。72時間には絶対に間に合わない</strong></td></tr>
    <tr><td>AWS Direct Connect</td><td>数週間〜数か月</td><td>長期にわたり安定した専用線が必要</td><td><strong>物理回線の敷設工事が要る。週末には間に合わない</strong></td></tr>
    <tr><td>AWS Storage Gateway</td><td>短い</td><td>オンプレから日常的にAWSのストレージを使い続ける</td><td>一括移行の道具ではない。<strong>使う経路は結局インターネットで、VPNのような暗号化トンネルを別に張るわけではない</strong></td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. Snowball Edgeによるデータ移行を実施する</h3>
      <p>Snowball Edgeは、AWSから頑丈な物理ストレージ端末が送られてきて、データを詰めて送り返す「引っ越しトラック」です。回線が細い場合の定番です。</p>
      <p class="why">申し込み・発送・データ書き込み・返送で<strong>1週間前後かかります</strong>。ヒント1の72時間に間に合いません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. Direct Connect接続によるデータ転送を実施する</h3>
      <p>Direct Connectは、自社とAWSを結ぶ専用線を物理的に引く仕組みです。速度も安定性も最高ですが、工事が必要です。</p>
      <p class="why">開通まで<strong>数週間から数か月</strong>かかります。今日申し込んで週末に使うことはできず、ヒント1に反します。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>C. AWSサイト間VPNを利用したVPN接続によるデータ転送を実施する</h3>
      <p>すでにあるインターネット回線の上に、暗号化されたトンネルを張ります。設定は数十分で完了し、10TBを72時間で送るのに必要な308Mbpsも十分に出せます。</p>
      <p class="why">ヒント1（すぐ使える）、ヒント2（量が足りる）、ヒント3（暗号化される・回線は既にある）をすべて満たします。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. Storage Gatewayによるデータ移行を実施する</h3>
      <p>Storage Gatewayは、オンプレのサーバーから見るとローカルのディスクに見える、AWSにつながった共有フォルダです。日常的にAWSのストレージを使い続けるための仕組みです。</p>
      <p class="why">一括移行のための道具ではありません。<strong>VPNのような暗号化トンネルを張るわけでもない</strong>ので、ヒント3の「安全な通信の確保」に対する答えになっていません。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：C　AWSサイト間VPNを利用したVPN接続によるデータ転送を実施する</strong></p>
    <p class="oboe">覚え方 —— <strong>データ移行の問題は「期限」と「容量」の2つだけで決まる。まず「必要な速度 ＝ 容量（ビット）÷ 秒数」を計算して、ネットワークで間に合うかを確かめる。</strong>そのうえで判定します。<strong>数日以内に始めたい・暗号化が必要ならサイト間VPN（即日）。数十TB以上で期限に余裕があるならSnowball（往復1週間）。長期で安定した専用線が要るならDirect Connect（開通に数週間〜数か月）。</strong>「今週末まで」のように期限が短い問題では、SnowballとDirect Connectは<strong>時間切れで自動的に脱落</strong>します。</p>
  </div>`
  },

  {
    id: 'e1q39',
    q: 'ソリューションアーキテクトとして、AWS上に営業管理システム（SFA）を構築している。営業担当者が日々売上データをアップロードするという業務要件がある。これらのデータは営業レポート用に保存される必要があり、高い耐久性と可用性を持つストレージが求められる。また、多くの営業担当者が利用するため、操作ミスなどによって記録が誤って削除されないようにすることも重要な要件である。これらの要件を満たすために、適切なデータ保護施策はどれか。',
    choices: [
      'Amazon S3標準ストレージクラスを利用して、バージョニング機能を有効化する',
      'Amazon EBS汎用ボリュームにデータを蓄積して、スナップショットを定期的に自動取得する',
      'Amazon S3標準ストレージクラスにデータを蓄積して、スナップショットを定期的に自動取得する',
      'Amazon RDS MySQLにデータを蓄積して、スナップショットを定期的に自動取得する',
    ],
    answer: 0,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>高い耐久性と可用性を持つストレージ</td><td>Amazon S3の標準クラスは耐久性99.999999999％（9が11個）。ファイル置き場として最強</td></tr>
    <tr><td>ファイルをアップロードして保存する</td><td>表形式のデータベースではなく、ファイルそのものを置く用途</td></tr>
    <tr><td>操作ミスで誤って削除されないように</td><td><mark>消したあとに元へ戻せる仕組みが要る。しかも「消した直後」でも戻せること</mark></td></tr>
  </table>

  <h2>削除したとき、何が起きるか</h2>
  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ バージョニングなし（定期スナップショットだけ）</div>
      <div class="nodes v">
        <div class="node ng">
          <span class="ico"><img src="assets/icons/gen-documents.svg" alt=""></span>
          <span class="lbl">14時にアップした資料</span><span class="sub">15時にうっかり削除</span>
        </div>
        <div class="link ng"><span>直近のバックアップは12時</span><span class="l">↓</span></div>
        <div class="node ng">
          <span class="ico"><img src="assets/icons/gen-recover.svg" alt=""></span>
          <span class="lbl">戻せない</span><span class="sub">12時以降の3時間ぶんが失われる</span>
        </div>
      </div>
      <p class="note">バックアップを取った瞬間より後のファイルは、どこにも残っていません。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ S3バージョニングを有効化</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/res-amazon-simple-storage-service-bucket-with-objects.svg" alt=""></span>
          <span class="lbl">同じ名前でも世代ごとに残る</span><span class="sub">v1・v2・v3…</span>
        </div>
        <div class="link ok"><span>削除しても、消えたように見えるだけ（削除マーカーが付く）</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/gen-recover.svg" alt=""></span>
          <span class="lbl">削除マーカーを消せば即復活</span><span class="sub">1秒前のファイルでも戻せる</span>
        </div>
      </div>
      <p class="note">上書きしてしまった場合も、前の世代がそのまま残っています。</p>
    </div>
  </div>
  <p class="caption">バージョニングは「ゴミ箱」ではなく「全部の世代を取っておく書庫」です。</p>
  <p>これは<strong>ノートに消しゴムを使わないルール</strong>に似ています。書き直したいときは新しいページに書き、前のページは残しておく。あとから「やっぱり前のほうがよかった」と思ってもすぐ戻れます。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <table>
    <tr><th style="width:26%">名前</th><th style="width:34%">正体</th><th>できないこと・向かないこと</th></tr>
    <tr><td class="good">S3標準 ＋ バージョニング</td><td class="good">ファイル置き場。耐久性は9が11個。上書きも削除も世代が残り、いつでも戻せる</td><td>世代が増えるぶん保管料も増える（ライフサイクルで古い世代を消すと調整できる）</td></tr>
    <tr><td>S3のスナップショット</td><td>—</td><td><strong>S3にスナップショットという機能は存在しない。</strong>S3の守りはバージョニングとレプリケーション</td></tr>
    <tr><td>Amazon EBS ＋ スナップショット</td><td>EC2に取り付ける1台ぶんのディスク</td><td><strong>基本的に1つのEC2からしか使えない。</strong>多人数が同時に読み書きする共有置き場に向かない。取った瞬間以降は戻せない</td></tr>
    <tr><td>Amazon RDS ＋ スナップショット</td><td>表形式のデータを管理するデータベース</td><td>ファイルそのものを置く場所ではない。削除ミスの復旧も、DB全体を巻き戻す大がかりな作業になる</td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>A. S3標準ストレージクラスを利用して、バージョニング機能を有効化する</h3>
      <p>S3標準は耐久性99.999999999％、可用性99.99％。バージョニングを有効にすれば、上書きも削除も世代として残り、いつでも元に戻せます。</p>
      <p class="why">ヒント1（耐久性・可用性）、ヒント2（ファイル置き場）、ヒント3（誤削除からの復旧）をすべて満たします。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. EBS汎用ボリュームにデータを蓄積し、スナップショットを定期取得する</h3>
      <p>EBSはEC2に取り付ける1台ぶんのディスクです。基本的に1つのインスタンスからしか使えず、多人数の共有置き場には向きません。</p>
      <p class="why">耐久性もS3に及ばず、定期スナップショットでは<strong>取った時刻より後に消したファイルは戻りません</strong>。ヒント1とヒント3の両方を満たせません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. S3標準にデータを蓄積し、スナップショットを定期的に自動取得する</h3>
      <p>置き場所はS3で正しいのですが、<strong>S3にスナップショットという機能はありません</strong>。スナップショットはEBSやRDSの用語です。</p>
      <p class="why">存在しない操作なので実行できません。S3で誤削除に備える正しい機能はバージョニングです。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. RDS MySQLにデータを蓄積し、スナップショットを定期的に自動取得する</h3>
      <p>RDSは表形式のデータを扱うデータベースで、アップロードされたファイルそのものを置く場所ではありません。</p>
      <p class="why">ヒント2に合いません。加えて、1件の削除ミスを直すためにデータベース全体を巻き戻すことになり、ヒント3への対応としても大がかりすぎます。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：A　Amazon S3標準ストレージクラスを利用して、バージョニング機能を有効化する</strong></p>
    <p class="oboe">覚え方 —— <strong>「S3で誤削除・誤上書きを防ぐ」＝バージョニング。「S3で絶対に変更・削除させない」＝オブジェクトロック。「S3のスナップショット」という機能は存在しないので、書いてあったら即座に消す。</strong>サービスごとの守り方もセットで覚えます。<strong>S3＝バージョニング、EBS／RDS＝スナップショット、DynamoDB／RDS＝ポイントインタイムリカバリ。</strong>組み合わせが入れ替わっている選択肢は、それだけで不正解です。</p>
  </div>`
  },

  {
    id: 'e1q40',
    q: 'ある企業は、Amazon EC2インスタンス、ELB、Auto Scalingグループで構成されたWEBアプリケーションを運営している。ソリューションアーキテクトは、ELBにAWS Certificate Manager（ACM）からインポートされた証明書を設定し、トラフィックをHTTPSに切り替えた。この証明書管理において、同社のセキュリティチームが各証明書の有効期限の10日前に通知を受け取るように独自のカスタムアラートを設定する必要がある。どのような手段を講じるべきか。',
    choices: [
      'ACM証明書の有効期限の10日前に、Amazon SNSトピックにカスタムメッセージをパブリッシュするルールをACMに追加する',
      'ACM証明書の有効期限をチェックするAWS Configルールを作成して、10日以内に有効期限切れになる証明書がある場合は、Amazon SNSトピック通知を発出するAmazon CloudWatchアラームを設定する',
      'ACM証明書の有効期限をチェックするAmazon EventBridgeルールを作成して、10日以内に有効期限切れになる証明書がある場合に、Amazon SNSトピック通知を発出する',
      '10日以内に期限が切れるACM証明書を検出するAmazon EventBridgeルールを作成する。AWS Lambda関数を呼び出すようにルールを設定する。Amazon SNSによってカスタムアラートを通知するようにLambda関数を設定する',
    ],
    answer: 3,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>ACMから<strong>インポートされた</strong>証明書</td><td>外部で買った証明書を持ち込んだもの。<strong>ACMの自動更新が効かない</strong>ので、期限切れを人が管理する必要がある</td></tr>
    <tr><td>有効期限の<strong>10日前</strong></td><td><mark>「10日」という独自のしきい値。ACMが標準で出す通知のタイミングとは違う</mark></td></tr>
    <tr><td><strong>独自のカスタムアラート</strong>を設定する</td><td>文面も自分たちで決めたい。判定と文面づくりをする場所が要る</td></tr>
  </table>

  <h2>「合図を出す人」と「考える人」と「伝える人」</h2>
  <div class="nodes v">
    <div class="node">
      <span class="ico"><img src="assets/icons/aws-certificate-manager.svg" alt=""></span>
      <span class="lbl">AWS Certificate Manager</span><span class="sub">期限が近づくとイベントを発生させる</span>
    </div>
    <div class="link ok"><span>① 目覚まし時計が鳴る</span><span class="l">↓</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/amazon-eventbridge.svg" alt=""></span>
      <span class="lbl">Amazon EventBridge ルール</span><span class="sub">イベントを受け取って、決めた相手に渡す</span>
    </div>
    <div class="link ok"><span>② 残り日数を数えて、10日以下かを判断する</span><span class="l">↓</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/aws-lambda.svg" alt=""></span>
      <span class="lbl">AWS Lambda 関数</span><span class="sub">条件の判定と、通知文の組み立てを行う</span>
    </div>
    <div class="link ok"><span>③ 作った文面を届ける</span><span class="l">↓</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/amazon-simple-notification-service.svg" alt=""></span>
      <span class="lbl">Amazon SNS</span><span class="sub">セキュリティチームにメールで通知</span>
    </div>
  </div>
  <p class="caption">EventBridgeは合図を出すだけ、SNSは配るだけ。<strong>「10日以下か」を数えて文章を作る役は、間にいるLambdaしかいません。</strong></p>
  <p>学校にたとえると分かりやすくなります。<strong>チャイム（EventBridge）は時間になれば鳴るだけ</strong>で、内容は判断しません。<strong>校内放送（SNS）は渡された原稿を読むだけ</strong>です。<mark>「あと10日だから連絡しよう」と考えて原稿を書く先生（Lambda）が間に必要</mark>なのです。</p>

  <h2>間にLambdaが要るのはなぜか</h2>
  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ EventBridgeから直接SNSへ</div>
      <div class="nodes v">
        <div class="node ng">
          <span class="ico"><img src="assets/icons/amazon-eventbridge.svg" alt=""></span>
          <span class="lbl">EventBridge</span><span class="sub">合図を出すだけ。日数の計算はできない</span>
        </div>
        <div class="link ng"><span>イベントの中身をそのまま渡す</span><span class="l">↓</span></div>
        <div class="node ng">
          <span class="ico"><img src="assets/icons/gen-email.svg" alt=""></span>
          <span class="lbl">読みにくい生データが届く</span><span class="sub">「独自のカスタムアラート」にならない</span>
        </div>
      </div>
      <p class="note">10日という独自の線引きも、読みやすい文面も作れません。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ EventBridge → Lambda → SNS</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/aws-lambda.svg" alt=""></span>
          <span class="lbl">Lambdaが間に入る</span><span class="sub">残り日数を計算し、10日以下なら通知する</span>
        </div>
        <div class="link ok"><span>整えた文面を渡す</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/gen-alert.svg" alt=""></span>
          <span class="lbl">分かりやすいカスタムアラート</span><span class="sub">証明書名・期限・残り日数を含められる</span>
        </div>
      </div>
      <p class="note">判定も文面づくりも自由にできます。</p>
    </div>
  </div>
  <p class="caption">「カスタム」と書かれたら、間に処理を書ける場所が必要だと考えます。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <table>
    <tr><th style="width:26%">名前</th><th style="width:34%">役割（たとえ）</th><th>できないこと</th></tr>
    <tr><td>Amazon EventBridge</td><td>決まった合図で鳴るチャイム。イベントを受け取って転送する</td><td><strong>自分では計算も判断もしない。</strong>文面も作れない</td></tr>
    <tr><td class="good">AWS Lambda</td><td class="good">短い処理を書ける場所。日数を数えて、文章を組み立てる</td><td>1回の実行は最長15分。今回のような短い処理には十分</td></tr>
    <tr><td>Amazon SNS</td><td>渡された文面をメールなどで配る放送係</td><td>中身を判断しない。通知するかどうかを決められない</td></tr>
    <tr><td>AWS Config</td><td>設定が決めたルールに沿っているかを記録・点検する監査役</td><td>点検結果を記録するだけ。<strong>そのままではCloudWatchアラームで見張れず、通知の仕組みを別に作り込む必要がある</strong></td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. 10日前にSNSトピックへカスタムメッセージをパブリッシュするルールをACMに追加する</h3>
      <p>ACM自体には、「◯日前に自分で決めた文面を通知する」というルールを設定する機能がありません。</p>
      <p class="why">存在しない設定なので実行できません。ACMが出すのはイベントまでで、そこから先はEventBridgeで受ける必要があります。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. AWS ConfigルールでチェックしてCloudWatchアラームからSNS通知を出す</h3>
      <p>AWS Configは設定の点検役、CloudWatchアラームは数値の見張り役です。方向としては近いのですが、部品のつなぎ方に無理があります。</p>
      <p class="why">Configの点検結果は<strong>そのままCloudWatchアラームで見張れる数値にはなりません</strong>。結局あいだをつなぐ処理を作ることになり、ヒント3のカスタム文面も別途必要です。遠回りです。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. EventBridgeルールを作成して、10日以内なら直接SNS通知を発出する</h3>
      <p>いちばん短く書けるので、もっともらしく見えます。しかしEventBridgeは<strong>合図を転送するだけ</strong>で、「あと何日か」を計算する機能を持ちません。</p>
      <p class="why">10日という独自のしきい値を判定できず、ヒント2を満たせません。届くのも生のイベントデータなので、ヒント3の「カスタムアラート」にもなりません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>D. EventBridgeルールでLambda関数を呼び出し、LambdaからSNSでカスタムアラートを通知する</h3>
      <p>EventBridgeが合図を出し、Lambdaが残り日数を数えて10日以下かを判定し、読みやすい文面を作ってSNSで届けます。役割が3つにきれいに分かれています。</p>
      <p class="why">ヒント2（独自のしきい値）とヒント3（独自の文面）を満たせる唯一の構成です。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：D　10日以内に期限が切れるACM証明書を検出するEventBridgeルールを作成し、AWS Lambda関数を呼び出して、Amazon SNSでカスタムアラートを通知する</strong></p>
    <p class="oboe">覚え方 —— <strong>通知の問題は「EventBridge＝合図」「Lambda＝判断と加工」「SNS＝配達」の3役で組み立てる。</strong>判定ルールはひとつです。<strong>「独自のしきい値」「カスタムメッセージ」「条件に応じて」と書いてあったら、間にLambdaが必要。EventBridgeからSNSへ直結している選択肢は不正解。</strong>逆に<strong>そのまま通知するだけでよいなら、EventBridge → SNS の直結で正解</strong>になります。あわせて、<strong>ACMにインポートした証明書は自動更新されない</strong>ことも覚えておいてください。この一文が、期限監視を自分で作る理由になっています。</p>
  </div>`
  },
  {
    id: 'e1q41',
    q: 'ソリューションアーキテクトとして、Webサーバーとデータベースサーバーから構成されるWebアプリケーションのアーキテクチャを設計している。Webサーバーとデータベースサーバーは、それぞれ異なるサブネットに配置されたEC2インスタンス上にホストされる。セキュリティを強化するために、データベースサーバーはWebサーバーからのトラフィックのみを受け入れる必要がある。またWebサーバーにはAuto Scalingグループを設定して、負荷に応じてインスタンスの数を増減させる必要がある。この要件を満たすための適切なトラフィック設定方法はどれか。',
    choices: [
      'DBインスタンスのセキュリティグループのインバウンドルールにWEBサーバーインスタンスのプライベートIPアドレスを設定する',
      'DBインスタンスのセキュリティグループのインバウンドルールにWEBサーバーインスタンスのセキュリティグループIDを設定する',
      'DBインスタンスのセキュリティグループのインバウンドルールにWEBサーバーインスタンスのElastic IPアドレスを設定する',
      'DBインスタンスのセキュリティグループのインバウンドルールにWEBサーバーインスタンスのパブリックIPアドレスを設定する',
    ],
    answer: 1,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>DBサーバーはWebサーバーからのトラフィックのみを受け入れる</td><td>許可する相手を絞る。セキュリティグループのインバウンドルールで指定する</td></tr>
    <tr><td>Auto Scalingグループを設定して<strong>インスタンスの数を増減</strong></td><td><mark>Webサーバーは勝手に増えたり消えたりする。そのたびIPアドレスも変わる</mark></td></tr>
    <tr><td>異なるサブネットに配置</td><td>DBは外に出さないプライベートサブネット。パブリックIPは持たない</td></tr>
  </table>

  <h2>Auto Scalingが動くたび、IPアドレスは変わる</h2>
  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ IPアドレスを1つずつ書く</div>
      <div class="nodes v">
        <div class="node ng">
          <span class="ico"><img src="assets/icons/gen-firewall.svg" alt=""></span>
          <span class="lbl">許可リスト</span><span class="sub">10.0.1.5 ／ 10.0.1.6 と手書き</span>
        </div>
        <div class="link ng"><span>Auto Scalingが新しいEC2を追加</span><span class="l">↓</span></div>
        <div class="node ng">
          <span class="ico"><img src="assets/icons/res-amazon-ec2-instances.svg" alt=""></span>
          <span class="lbl">10.0.1.42（新顔）</span><span class="sub">リストにないので拒否される</span>
        </div>
      </div>
      <p class="note">増えるたびに人がルールを書き足すことになります。書き忘れれば障害です。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ セキュリティグループIDを書く</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/gen-firewall.svg" alt=""></span>
          <span class="lbl">許可リスト</span><span class="sub">sg-web（Webサーバー用のグループ）</span>
        </div>
        <div class="link ok"><span>Auto Scalingが新しいEC2を追加</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/res-amazon-ec2-instances.svg" alt=""></span>
          <span class="lbl">新しいEC2もsg-webに所属</span><span class="sub">IPが何であれ自動的に許可される</span>
        </div>
      </div>
      <p class="note">何台増えても何台減っても、ルールは1行のままです。</p>
    </div>
  </div>
  <p class="caption">個人の名前ではなく「所属」で通す方式です。人が入れ替わっても名簿を書き換える必要がありません。</p>
  <p>社員食堂の入口を思い浮かべてください。<strong>「田中さんと佐藤さんを通す」と個人名で書く</strong>と、新入社員が入るたびに書き足さなければなりません。<mark>「社員証を持っている人を通す」と書けば、人が入れ替わっても張り紙はそのまま</mark>です。セキュリティグループIDを指定するのは後者です。</p>

  <h2>いま作ろうとしている構成</h2>
  <div class="zone">
    <span class="zlbl"><img src="assets/icons/group-virtual-private-cloud-vpc.svg" alt="">VPC</span>
    <div class="zone">
      <span class="zlbl">パブリックサブネット（Webサーバー）</span>
      <div class="zrow">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/res-amazon-ec2-instances.svg" alt=""></span>
          <span class="lbl">Webサーバー</span><span class="sub">Auto Scalingで増減　所属：sg-web</span>
        </div>
      </div>
    </div>
    <div class="zone">
      <span class="zlbl">プライベートサブネット（DBサーバー）</span>
      <div class="zrow">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/res-amazon-ec2-db-instance.svg" alt=""></span>
          <span class="lbl">DBサーバー</span><span class="sub">所属：sg-db　インバウンドは sg-web からのみ許可</span>
        </div>
      </div>
    </div>
  </div>
  <p class="caption">DBはプライベートサブネットにいるので、そもそもパブリックIPを持ちません。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <table>
    <tr><th style="width:26%">指定するもの</th><th style="width:34%">性質</th><th>できないこと・向かないこと</th></tr>
    <tr><td class="good">セキュリティグループID</td><td class="good">「このグループに所属していれば通す」という指定。所属は自動で決まる</td><td>同じVPC内（またはピア接続先）のリソースにしか使えない</td></tr>
    <tr><td>プライベートIPアドレス</td><td>VPCの中だけで使われるアドレス。インスタンスごとに割り当てられる</td><td><strong>インスタンスが作り直されると変わる。</strong>Auto Scalingとは相性が最悪</td></tr>
    <tr><td>パブリックIPアドレス</td><td>インターネットから見えるアドレス。停止・起動でも変わる</td><td>VPC内の通信では使われない。<strong>プライベートサブネットのDBには関係がない</strong></td></tr>
    <tr><td>Elastic IPアドレス</td><td>固定できるパブリックIP。1つずつ手で割り当てる</td><td><strong>Auto Scalingで増えるインスタンスに自動で付かない。</strong>そもそもWebサーバー群に固定IPを配る設計自体が現実的でない</td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. WEBサーバーインスタンスのプライベートIPアドレスを設定する</h3>
      <p>VPC内の通信で使われるアドレスなので、通信自体は成立します。設定した瞬間はちゃんと動きます。</p>
      <p class="why">しかしヒント2のとおり、Auto Scalingで生まれた新しいインスタンスは<strong>別のプライベートIP</strong>を持ちます。そのたびに拒否され、人がルールを追記することになります。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>B. WEBサーバーインスタンスのセキュリティグループIDを設定する</h3>
      <p>「sg-webに所属しているインスタンスからの通信を許可する」という書き方です。新しく起動したインスタンスも起動テンプレートで同じグループに入るので、自動的に許可されます。</p>
      <p class="why">ヒント1（Webからのみ許可）とヒント2（台数が変動する）の両方を、ルール1行で満たします。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. WEBサーバーインスタンスのElastic IPアドレスを設定する</h3>
      <p>Elastic IPは固定できるパブリックIPですが、1つずつ手作業で割り当てる必要があります。</p>
      <p class="why">Auto Scalingで自動的に増えるインスタンスには付きません。ヒント2に真っ向から反します。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. WEBサーバーインスタンスのパブリックIPアドレスを設定する</h3>
      <p>パブリックIPはインターネット越しの通信で使うアドレスです。VPCの中どうしの通信では使われません。</p>
      <p class="why">ヒント3のとおりDBはプライベートサブネットにいるため、そもそもこの経路で通信しません。加えて停止・起動のたびにアドレスが変わります。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：B　DBインスタンスのセキュリティグループのインバウンドルールにWEBサーバーインスタンスのセキュリティグループIDを設定する</strong></p>
    <p class="oboe">覚え方 —— <strong>AWSの中どうしを許可するときは、IPアドレスではなくセキュリティグループIDを指定する。これが原則。</strong>特に<strong>Auto Scalingが出てきたら、IPアドレスを書く選択肢はすべて不正解</strong>と決め打ちしてかまいません。台数が変われば必ずIPも変わるからです。IPアドレスやCIDRを書くのは、<strong>社内オフィスからの接続など、AWSの外から来る相手を絞るときだけ</strong>です。</p>
  </div>`
  },

  {
    id: 'e1q42',
    q: 'ある企業はAmazon S3バケットにコンテンツデータを保存し、Amazon CloudFrontディストリビューションを設定することで、S3バケット内のオブジェクトをユーザーに配信するアプリケーションを運営している。管理者として、最近、提供されるコンテンツのURLリンクが無断で使用されていることに気付いた。他サイトからの直リンクによる不正なリソース消費（ホットリンク）を防ぐために、必要なソリューションはどれか。',
    choices: [
      '署名付きURLを付与してオブジェクトのデータ配信を行う',
      'AWS WAFによるリンクのReferer制限を行う',
      '署名付きCookiesを付与してオブジェクトのデータ配信を行う',
      'S3へのアクセス処理を暗号化することで、配信を制限する',
    ],
    answer: 1,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td><strong>他サイトからの直リンク</strong>（ホットリンク）</td><td><mark>問題は「誰が見ているか」ではなく「どのページから呼ばれたか」</mark>。ここが決め手</td></tr>
    <tr><td>URLリンクが無断で使用されている</td><td>URL自体は正しいものが使われている。URLを隠す方式では止まらない</td></tr>
    <tr><td>不正なリソース消費を防ぐ</td><td>他人のサイトの表示のために、こちらの通信料が使われている状態を止めたい</td></tr>
  </table>

  <h2>ホットリンクとは何が起きているのか</h2>
  <div class="nodes v">
    <div class="node ng">
      <span class="ico"><img src="assets/icons/gen-globe.svg" alt=""></span>
      <span class="lbl">他人のサイト（他社.com）</span><span class="sub">HTMLに自社の画像URLを直接埋め込んでいる</span>
    </div>
    <div class="link ng"><span>訪問者のブラウザが画像を取りに来る。Refererヘッダーには「他社.com」と書かれている</span><span class="l">↓</span></div>
    <div class="node ng">
      <span class="ico"><img src="assets/icons/amazon-cloudfront.svg" alt=""></span>
      <span class="lbl">CloudFront ＋ S3</span><span class="sub">正しいURLなので普通に配信してしまう</span>
    </div>
    <div class="link ng"><span>通信料だけこちらの請求になる</span><span class="l">↓</span></div>
    <div class="node ng">
      <span class="ico"><img src="assets/icons/gen-alert.svg" alt=""></span>
      <span class="lbl">自社のコスト増加</span><span class="sub">他社サイトの表示をこちらが肩代わりしている</span>
    </div>
  </div>
  <p class="caption">Refererヘッダーは「どのページから呼ばれたか」を示す情報です。ここを見れば、他社サイト経由かどうかが分かります。</p>
  <p>これは<strong>よその店の看板に、こちらの電気を引き込んで灯している</strong>ようなものです。電気代を払っているのはこちらなのに、集客しているのは向こうの店です。<mark>Refererを見て「自社のページから呼ばれたときだけ配る」と決めれば止まります。</mark></p>

  <h2>WAFでRefererを見て弾く</h2>
  <div class="vs">
    <div class="pane good">
      <div class="pane-h">◯ 自社サイトから呼ばれた場合</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/gen-client.svg" alt=""></span>
          <span class="lbl">Referer: jisha.com</span><span class="sub">自社のページに埋め込まれた画像</span>
        </div>
        <div class="link ok"><span>WAFのルールに一致 → 許可</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/amazon-cloudfront.svg" alt=""></span>
          <span class="lbl">配信される</span><span class="sub">通常の利用者には何の影響もない</span>
        </div>
      </div>
      <p class="note">ログインなどの手続きは不要のままです。</p>
    </div>
    <div class="pane bad">
      <div class="pane-h">✕ 他社サイトから呼ばれた場合</div>
      <div class="nodes v">
        <div class="node ng">
          <span class="ico"><img src="assets/icons/gen-internet.svg" alt=""></span>
          <span class="lbl">Referer: tasha.com</span><span class="sub">他社のページに埋め込まれた画像</span>
        </div>
        <div class="link ng"><span>WAFのルールに不一致 → ブロック</span><span class="l">↓</span></div>
        <div class="node ng">
          <span class="ico"><img src="assets/icons/aws-waf.svg" alt=""></span>
          <span class="lbl">配信しない</span><span class="sub">通信料も発生しない</span>
        </div>
      </div>
      <p class="note">CloudFrontの手前で止まるので、S3にも到達しません。</p>
    </div>
  </div>
  <p class="caption">AWS WAFは、リクエストの中身（ヘッダーやURL）を条件にして通す・通さないを決められる関所です。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <table>
    <tr><th style="width:26%">名前</th><th style="width:34%">何を判定するか</th><th>できないこと・向かないこと</th></tr>
    <tr><td class="good">AWS WAFのReferer制限</td><td class="good"><strong>どのページから呼ばれたか</strong>を見て通す・弾くを決める</td><td>Refererは偽装できるため完璧ではない。ただしホットリンク対策としては定番かつ十分</td></tr>
    <tr><td>署名付きURL</td><td>期限つきの特別なURLを作り、<strong>そのURLを持っている人だけ</strong>に配る</td><td>今回は正規のURLが正しく使われているだけ。<strong>全訪問者ぶんのURLを毎回発行する仕組みが必要になり、公開コンテンツには重すぎる</strong></td></tr>
    <tr><td>署名付きCookie</td><td>Cookieを配り、<strong>それを持っている人だけ</strong>に複数ファイルをまとめて許可する</td><td>会員制サイトの配信向け。同じく<strong>どのページから来たかは判定できない</strong></td></tr>
    <tr><td>S3アクセスの暗号化</td><td>保存時や通信時にデータを読めなくする</td><td><strong>アクセスの可否とは無関係。</strong>暗号化しても正規のURLからは普通に配信される</td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. 署名付きURLを付与してオブジェクトのデータ配信を行う</h3>
      <p>署名付きURLは、期限と条件を埋め込んだ特別なURLです。有料会員だけに動画を配る、といった用途に向きます。</p>
      <p class="why">今回は誰でも見てよい公開コンテンツで、困っているのは<strong>呼び出し元のページ</strong>です。ヒント1に答えておらず、全訪問者にURLを発行する仕組みを新たに作る必要も出てきます。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>B. AWS WAFによるリンクのReferer制限を行う</h3>
      <p>WAFのルールでRefererヘッダーを条件にし、自社ドメイン以外から呼ばれたリクエストをCloudFrontの手前で弾きます。</p>
      <p class="why">ヒント1（どのページから呼ばれたか）を直接判定し、ヒント3（無駄な通信料）も発生前に止めます。通常の利用者には影響がありません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. 署名付きCookiesを付与してオブジェクトのデータ配信を行う</h3>
      <p>署名付きCookieは、URLを1つずつ作らずに複数のファイルへのアクセスをまとめて許可する仕組みです。会員向けサイトで使います。</p>
      <p class="why">判定するのは<strong>「Cookieを持っているか」であって「どこから来たか」ではありません</strong>。ヒント1を満たしません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. S3へのアクセス処理を暗号化することで、配信を制限する</h3>
      <p>暗号化は、データが盗み見られたときに中身を読めなくするための仕組みです。</p>
      <p class="why">アクセスを許すかどうかとは無関係です。暗号化しても正規のURLからは普通に配信されるので、ホットリンクは止まりません。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：B　AWS WAFによるリンクのReferer制限を行う</strong></p>
    <p class="oboe">覚え方 —— <strong>CloudFrontの配信制限は「何で絞るか」で3つに分かれる。「どのページから呼ばれたか（ホットリンク／直リンク）」ならAWS WAFのRefererやヘッダー条件。「誰に見せるか・期限つき・1ファイル」なら署名付きURL。「誰に見せるか・複数ファイルまとめて」なら署名付きCookie。</strong>そして<strong>暗号化はアクセス制御ではない</strong>ので、「誰かを止めたい」という問題に出てきたら常にダミーです。</p>
  </div>`
  },

  {
    id: 'e1q43',
    q: 'ある企業は、オンプレミス環境にあるウェブアプリケーションをAWSに移行し、冗長性と可用性を向上させる。このアプリケーションはウェブサーバーとMySQLデータベースで構成されており、主にデータベースに対する大量の読み取り処理が行われている。現在の災害復旧対策は、1日1回のバッチ処理で全データをエクスポートし、別の地域にあるデータセンターのスタンバイ環境にインポートする方式だが、即時の復旧ができないことが問題となっている。スタンバイDBへの切り替えを数分程度で実行可能にする必要がある。この要件を満たすために、コスト効率が良いソリューションはどれか。',
    choices: [
      'マルチAZ配置を有効化したAmazon RDS MySQL DBインスタンスを本番用データベースとして構成する。Mysqldumpユーティリティを使用したバックアップ/復旧プロセスを実装し、ステージング用データベースに適用する',
      'Amazon Aurora MySQLクラスターを本番用データベースとして構成する。Auroraレプリカを利用してレプリカを別リージョンに展開する',
      'Amazon Aurora MySQLクラスターを本番用データベースとして構成する。Auroraグローバルデータベースを設定して、Auroraレプリカを別リージョンに展開する',
      'マルチAZ配置を有効化したAmazon RDS MySQL DBインスタンスおよびリードレプリカを本番用データベースとして構成する。Mysqldumpユーティリティを使用したバックアップ/復旧プロセスを実装し、ステージング用データベースに適用する',
    ],
    answer: 2,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td><strong>別の地域</strong>にあるデータセンターのスタンバイ環境</td><td><mark>復旧先は別リージョン。同じリージョン内の対策では要件を満たさない</mark></td></tr>
    <tr><td>切り替えを<strong>数分程度</strong>で実行可能に</td><td>バックアップから作り直す方式では絶対に間に合わない。常時複製が必要</td></tr>
    <tr><td>大量の読み取り処理が行われている</td><td>読み取りを分散できる構成だと、なおよい</td></tr>
  </table>

  <h2>リージョンをまたいで、常に複製し続ける</h2>
  <div class="zone">
    <span class="zlbl"><img src="assets/icons/group-region.svg" alt="">プライマリリージョン（東京）</span>
    <div class="zrow">
      <div class="node ok">
        <span class="ico"><img src="assets/icons/amazon-aurora.svg" alt=""></span>
        <span class="lbl">Aurora MySQL クラスター</span><span class="sub">書き込み1台＋読み取り用レプリカ</span>
      </div>
    </div>
  </div>
  <div class="nodes v">
    <div class="link ok"><span>Auroraグローバルデータベースが、通常1秒未満の遅れで複製し続ける</span><span class="l">↓</span></div>
  </div>
  <div class="zone">
    <span class="zlbl"><img src="assets/icons/group-region.svg" alt="">セカンダリリージョン（大阪など）</span>
    <div class="zrow">
      <div class="node ok">
        <span class="ico"><img src="assets/icons/amazon-aurora.svg" alt=""></span>
        <span class="lbl">読み取り専用クラスター</span><span class="sub">障害時は1分程度で書き込み可能に昇格する</span>
      </div>
    </div>
  </div>
  <p class="caption">待機側もふだんから読み取りに使えるので、置いておくだけの無駄になりません。</p>
  <p>これは<strong>同じ本を2つの図書館で同時に更新している</strong>ような状態です。東京の館で1ページ書き加えれば、ほぼ同時に大阪の館にも反映されます。東京が使えなくなっても、大阪の本はすでに最新なので、その場で貸し出しを始められます。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <table>
    <tr><th style="width:26%">名前</th><th style="width:34%">どこまでカバーするか</th><th>できないこと</th></tr>
    <tr><td class="good">Auroraグローバルデータベース</td><td class="good"><strong>別リージョン</strong>へ常時複製。1秒未満の遅れで追随し、障害時は1分程度で昇格する</td><td>複製先リージョンぶんの費用がかかる（それでも常時2系統を動かすより安い）</td></tr>
    <tr><td>Auroraレプリカ</td><td>同じクラスター内、つまり<strong>同一リージョン内</strong>の別AZに読み取り用のコピーを置く</td><td><strong>別リージョンには展開できない。</strong>リージョンごと落ちる災害には無力</td></tr>
    <tr><td>RDSマルチAZ配置</td><td>同一リージョン内の<strong>別AZ</strong>に待機用を置く</td><td>同じくリージョンをまたげない。待機側は読み取りにも使えない</td></tr>
    <tr><td>mysqldumpによるバックアップ／復旧</td><td>全データを書き出して別環境に読み込む昔ながらの方式</td><td><strong>データ量に比例して何時間もかかる。</strong>数分という要件には絶対に届かない</td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. RDS MySQLのマルチAZ配置＋mysqldumpによるバックアップ／復旧</h3>
      <p>マルチAZは同じリージョンの中で別のAZに控えを置く仕組みです。AZ1つの障害には強くなります。</p>
      <p class="why">ヒント1の「別の地域」をカバーできません。加えてmysqldumpによる復旧は何時間もかかるため、ヒント2の「数分」にも届きません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. Aurora MySQLクラスター＋Auroraレプリカを別リージョンに展開する</h3>
      <p>Auroraを選んだところまでは正解と同じです。落とし穴は「Auroraレプリカを別リージョンに」という部分です。</p>
      <p class="why"><strong>Auroraレプリカは同じクラスターの中、つまり同一リージョン内にしか置けません。</strong>別リージョンに広げるにはグローバルデータベースが必要です。構成として成立しておらず、ヒント1を満たせません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>C. Aurora MySQLクラスター＋Auroraグローバルデータベースで別リージョンに展開する</h3>
      <p>別リージョンへ常時複製し、遅れは通常1秒未満。災害時は1分程度でセカンダリを昇格させ、書き込みを受け付けられます。ふだんは読み取りにも使えます。</p>
      <p class="why">ヒント1（別リージョン）、ヒント2（数分で切替）、ヒント3（読み取りの分散）をすべて満たします。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. RDS MySQLのマルチAZ＋リードレプリカ＋mysqldumpによるバックアップ／復旧</h3>
      <p>リードレプリカを足したぶん、ヒント3の読み取り分散には対応できます。しかし災害復旧の中身はAと同じです。</p>
      <p class="why">mysqldumpによる復旧では数分に間に合わず、別リージョンへの常時複製にもなっていません。ヒント1とヒント2に反します。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：C　Amazon Aurora MySQLクラスターを本番用データベースとして構成し、Auroraグローバルデータベースを設定してAuroraレプリカを別リージョンに展開する</strong></p>
    <p class="oboe">覚え方 —— <strong>データベースの冗長化は「どこまで守るか」で3段階。AZ1つの障害まで＝マルチAZ配置。読み取りの負荷分散＝リードレプリカ／Auroraレプリカ（同一リージョン内）。リージョンごとの災害＝Auroraグローバルデータベース（別リージョン・遅延1秒未満・約1分で昇格）。</strong>問題文に<strong>「別リージョン」「別の地域」「クロスリージョン」</strong>が出たら、マルチAZと同一リージョンのレプリカはその時点で脱落します。そして<strong>mysqldumpのような手作業のエクスポート／インポートは、「数分」を求める問題では必ず不正解</strong>です。</p>
  </div>`
  },

  {
    id: 'e1q44',
    q: 'ある企業がサーバーレスアプリケーションを開発している。このアプリケーションは、Amazon API Gatewayを介して呼び出されるAWS Lambda関数で構成されている。このLambda関数は顧客データを取得し、Amazon Aurora MySQLデータベースに保存する。しかし、Aurora MySQLデータベースのアップグレード中は、アップグレードが完了するまでLambda関数がデータベースに接続できず、その間に発生したデータは保存されない。更新期間中のデータを保存するために、どのような対策を講じるべきか。',
    choices: [
      'Lambda関数が顧客データをLambdaのローカルストレージに保持し、このローカルストレージをスキャンして、顧客データをAuroraデータベースに保存する',
      'Lambda関数が取得した顧客データをAmazon SQSキューに保存する。別のLambda関数がこのキューをポーリングして、顧客データをAuroraデータベースに保存する',
      'Lambda関数の実行時間を上限まで増やす。その上で、このLambda関数でデータベースへの接続に失敗した場合の再試行処理を実装する',
      'Amazon RDSプロキシをプロビジョニングし、このRDSプロキシに接続するようにLambda関数を構成する',
    ],
    answer: 1,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>アップグレード中は<strong>接続できない</strong></td><td>データベースが一時的に不在になる時間がある。これ自体は避けられない</td></tr>
    <tr><td>その間に発生したデータは保存されない</td><td><mark>行き先が閉まっている間、データを預かっておく場所が要る</mark></td></tr>
    <tr><td>更新期間中のデータを保存する</td><td>失わないことが目的。速く書き込むことではない</td></tr>
  </table>

  <h2>閉店中でも受け取れる「宅配ボックス」を置く</h2>
  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ Lambdaから直接Auroraへ書く</div>
      <div class="nodes v">
        <div class="node ng">
          <span class="ico"><img src="assets/icons/aws-lambda.svg" alt=""></span>
          <span class="lbl">Lambda関数</span><span class="sub">顧客データを受け取った</span>
        </div>
        <div class="link ng"><span>接続しようとする</span><span class="l">↓</span></div>
        <div class="node ng">
          <span class="ico"><img src="assets/icons/amazon-aurora.svg" alt=""></span>
          <span class="lbl">Aurora（アップグレード中）</span><span class="sub">つながらない → データはそのまま消える</span>
        </div>
      </div>
      <p class="note">Lambdaは処理が終われば消えます。手に持っていたデータも一緒に消えます。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ あいだにSQSキューを置く</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/aws-lambda.svg" alt=""></span>
          <span class="lbl">受付用Lambda</span><span class="sub">キューに入れるだけで仕事を終える</span>
        </div>
        <div class="link ok"><span>預ける</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/amazon-simple-queue-service.svg" alt=""></span>
          <span class="lbl">Amazon SQSキュー</span><span class="sub">既定で4日間（最大14日間）保持できる</span>
        </div>
        <div class="link ok"><span>書き込み用Lambdaが取りに行く。失敗すればメッセージはキューに戻る</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/amazon-aurora.svg" alt=""></span>
          <span class="lbl">Aurora</span><span class="sub">復旧したら順に書き込まれる</span>
        </div>
      </div>
      <p class="note">DBが閉まっている間もデータはキューに残り続けます。1件も失われません。</p>
    </div>
  </div>
  <p class="caption">SQSを挟むことで、受け取る側とDBの都合が切り離されます。これを疎結合といいます。</p>
  <p>これは<strong>宅配ボックス</strong>と同じ考え方です。家の人が留守（DBがアップグレード中）でも、荷物はボックスに入ります。帰ってきたら順番に取り込むだけです。ボックスがなければ、配達員は荷物を持ち帰るしかありません。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <table>
    <tr><th style="width:26%">名前</th><th style="width:34%">正体</th><th>できないこと・向かないこと</th></tr>
    <tr><td class="good">Amazon SQSキュー</td><td class="good">メッセージを預かる宅配ボックス。既定4日、最大14日保持できる</td><td>書き込みが即座に反映されるわけではない（今回はそれで構わない）</td></tr>
    <tr><td>Lambdaのローカルストレージ（/tmp）</td><td>実行中だけ使える一時的な作業場</td><td><strong>実行が終われば中身は保証されない。</strong>あとから別の処理がスキャンすることもできない</td></tr>
    <tr><td>Lambdaの実行時間延長＋再試行</td><td>最長15分まで待たせて、失敗したら繰り返す</td><td><strong>アップグレードが15分を超えたら全滅。</strong>その間ずっとLambdaが動き続けるので費用も無駄</td></tr>
    <tr><td>Amazon RDS Proxy</td><td>DBへの接続をまとめて再利用する<strong>接続の交通整理役</strong>。フェイルオーバーを速くする効果もある</td><td><strong>データをためる機能はない。</strong>DBが長時間不在の間、書き込みを預かることはできない</td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. Lambdaのローカルストレージに保持し、あとでスキャンして保存する</h3>
      <p>Lambdaの <code>/tmp</code> は、その関数が動いている間だけ使える作業台です。実行が終われば消えることを前提に設計されています。</p>
      <p class="why">ヒント2の「預かっておく場所」になりません。別の実行環境から中身を読むこともできず、確実にデータが失われます。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>B. データをSQSキューに保存し、別のLambdaがポーリングしてAuroraに保存する</h3>
      <p>受付側はキューに入れるだけ。書き込み側は取り出して保存し、失敗すればメッセージはキューに戻ります。DBが戻れば自動的に処理が進みます。</p>
      <p class="why">ヒント2（預ける場所）とヒント3（1件も失わない）を満たします。アップグレードが何時間かかっても耐えられます。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. Lambdaの実行時間を上限まで増やし、接続失敗時の再試行を実装する</h3>
      <p>待って再試行する作戦です。短い瞬断であれば有効なこともあります。</p>
      <p class="why">Lambdaの上限は15分です。<strong>アップグレードが15分を超えた時点で、それ以降のデータはすべて失われます。</strong>待っている間ずっと課金され続けるのも無駄です。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. RDS Proxyをプロビジョニングし、Lambdaから接続する</h3>
      <p>RDS Proxyは、大量のLambdaがDBの接続枠を食いつぶす問題を解決する交通整理役です。フェイルオーバー時の切り替えも速くします。</p>
      <p class="why">解決するのは<strong>接続の本数</strong>であって、<strong>DBが長時間いないこと</strong>ではありません。データをためる機能がないので、ヒント2を満たせません。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：B　Lambda関数が取得した顧客データをAmazon SQSキューに保存し、別のLambda関数がこのキューをポーリングしてAuroraデータベースに保存する</strong></p>
    <p class="oboe">覚え方 —— <strong>「送り先が止まっている間もデータを失いたくない」と書いてあったら、答えは間にSQSを挟む（バッファリング）。</strong>SQSは既定4日、最大14日メッセージを保持します。あわせて2つの区別も覚えてください。<strong>RDS Proxyは「接続の本数が多すぎる」ときの答え。Lambdaの再試行や実行時間延長は「15分以内に終わる短い瞬断」までしか耐えられない。</strong>Lambdaの15分という数字は、この手の問題で何度も判定に使えます。</p>
  </div>`
  },

  {
    id: 'e1q45',
    q: 'ソリューションアーキテクトとして、現在開発中のアプリケーションにAWSのメッセージングサービスを活用したメッセージ処理機能を追加する計画を立てている。最も重要な要件は、メッセージの順序が維持され、重複したメッセージが送信されないことである。この要件を満たすために、最適なソリューションはどれか。（2つ選択）',
    choices: [
      'Amazon SQSのFIFOキューを利用する',
      'Amazon SNSのFIFOトピックを利用する',
      'Amazon SESのFIFOトピックを利用する',
      'AWS Lambdaでメッセージを順序通りに処理する関数を設定する',
      'Amazon Step Functionsを利用して、メッセージを順序通りに処理するワークフローを設定する',
    ],
    answer: [0, 1],
    explain: `
  <h2>まず、問題文の中の「2つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>メッセージの<strong>順序が維持され</strong></td><td>送った順番どおりに届くこと。標準の仕組みでは保証されない</td></tr>
    <tr><td><strong>重複した</strong>メッセージが送信されない</td><td><mark>この2つが並んで出てきたら、AWSの答えは「FIFO」の一択</mark></td></tr>
  </table>
  <p>FIFOは First In First Out の略で、<strong>先に入れたものが先に出る</strong>という意味です。日本語なら「先入れ先出し」。AWSではSQSとSNSの両方にFIFO版があります。</p>

  <h2>標準とFIFOで、届き方がどう違うか</h2>
  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ 標準キュー／標準トピック</div>
      <div class="nodes v">
        <div class="node ng">
          <span class="ico"><img src="assets/icons/amazon-simple-queue-service.svg" alt=""></span>
          <span class="lbl">送信：①②③</span><span class="sub">できるだけ順序を保つ努力はする</span>
        </div>
        <div class="link ng"><span>複数の経路を通るため、追い越しや二重配達が起きる</span><span class="l">↓</span></div>
        <div class="node ng">
          <span class="ico"><img src="assets/icons/gen-alert.svg" alt=""></span>
          <span class="lbl">受信：②①②③</span><span class="sub">順番が入れ替わり、②が2回届く</span>
        </div>
      </div>
      <p class="note">そのかわり処理できる件数はほぼ無制限。順序を気にしない用途には最適です。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ FIFOキュー／FIFOトピック</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/amazon-simple-queue-service.svg" alt=""></span>
          <span class="lbl">送信：①②③</span><span class="sub">グループごとに厳密に順序を守る</span>
        </div>
        <div class="link ok"><span>1本の列に並ばせ、同じメッセージは1回だけ通す</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/gen-data-stream.svg" alt=""></span>
          <span class="lbl">受信：①②③</span><span class="sub">順序どおり、重複なし</span>
        </div>
      </div>
      <p class="note">そのかわり処理できる件数に上限があります（SQS FIFOは毎秒3,000件程度）。</p>
    </div>
  </div>
  <p class="caption">標準は「複数のレジに自由に並ぶ」、FIFOは「1列に並んで順番に呼ばれる」方式です。</p>
  <p>銀行の窓口を思い出してください。<strong>番号札を取って1列に並べば、来た順に呼ばれ、同じ人が二度呼ばれることもありません</strong>。FIFOはこの番号札方式です。窓口ごとにバラバラに並ぶ標準方式は速いけれど、順番は前後します。</p>

  <h2>まぎらわしい5つを区別する</h2>
  <table>
    <tr><th style="width:26%">名前</th><th style="width:34%">正体</th><th>できないこと</th></tr>
    <tr><td class="good">Amazon SQS FIFOキュー</td><td class="good">1対1でメッセージを渡すキューのFIFO版。順序保証と重複排除に対応</td><td>毎秒3,000件程度が上限（バッチ利用時）。標準キューほどの量はさばけない</td></tr>
    <tr><td class="good">Amazon SNS FIFOトピック</td><td class="good">1対多で配るトピックのFIFO版。順序を保ったまま複数のSQS FIFOキューへ配れる</td><td>配信先はSQS FIFOキューに限られる（メールやSMSには送れない）</td></tr>
    <tr><td>Amazon SES</td><td>メールを送受信するためのサービス</td><td><strong>FIFOトピックという機能自体が存在しない。</strong>メッセージング基盤ではない</td></tr>
    <tr><td>AWS Lambda</td><td>短い処理を動かす場所</td><td><strong>自分では順序を保証できない。</strong>届いたものを処理するだけで、並べ替えを自作すれば手間も増える</td></tr>
    <tr><td>AWS Step Functions</td><td>複数の処理を決めた順番で動かす<strong>指揮者</strong>。ワークフローの順序管理が役目</td><td>大量のメッセージを受け取って重複を排除する仕組みではない。用途が違う</td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>A. Amazon SQSのFIFOキューを利用する</h3>
      <p>メッセージグループごとに送った順序をそのまま保ち、5分以内の同じメッセージは自動的に1回だけ通します。</p>
      <p class="why">ヒント1（順序）とヒント2（重複なし）を、設定ひとつで両方満たします。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>B. Amazon SNSのFIFOトピックを利用する</h3>
      <p>1つのメッセージを複数の宛先へ配りつつ、順序と重複排除を維持します。配信先はSQS FIFOキューになります。</p>
      <p class="why">同じくヒント1とヒント2を満たします。複数の処理へ同じ順序で配りたい場合の答えです。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. Amazon SESのFIFOトピックを利用する</h3>
      <p>Amazon SES（Simple Email Service）はメールの送受信サービスです。名前がSQS・SNSと似ているだけで、役割がまったく違います。</p>
      <p class="why"><strong>SESにFIFOトピックという機能は存在しません。</strong>実在しない選択肢です。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. AWS Lambdaでメッセージを順序通りに処理する関数を設定する</h3>
      <p>Lambdaは届いたメッセージを処理する場所であって、届く順番を決める場所ではありません。</p>
      <p class="why">バラバラに届いたものを並べ替える処理を自分で書くことになり、重複排除も自作が必要です。ヒント1・2を仕組みとして保証できません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>E. AWS Step Functionsで順序通りに処理するワークフローを設定する</h3>
      <p>Step Functionsは、複数の処理を決めた順番で実行する指揮者です。「Aが終わったらB、失敗したらC」といった流れを管理します。</p>
      <p class="why">管理するのは<strong>処理の順番</strong>であって、<strong>届くメッセージの順番</strong>ではありません。重複排除の機能もなく、ヒント2を満たせません。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：A・B　Amazon SQSのFIFOキューと、Amazon SNSのFIFOトピックを利用する</strong></p>
    <p class="oboe">覚え方 —— <strong>「順序を保証」「重複を排除」の2語が出たら、答えはFIFO。FIFO版があるのはSQSとSNSの2つだけ。</strong>使い分けはこうです。<strong>1対1で渡すならSQS FIFOキュー、1対多で配るならSNS FIFOトピック。</strong>逆に<strong>「大量にさばきたい」「順序は問わない」なら標準キュー／標準トピック</strong>を選びます。SESはメール専用なので、メッセージングの4択に出てきたら常にダミーです。</p>
  </div>`
  },
  {
    id: 'e1q46',
    q: 'ソリューションアーキテクトとして、AWS上にドキュメント共有アプリケーションを設計している。ユーザーはウェブインターフェースまたはモバイルアプリを通じてドキュメントをアップロードできる。厳格なセキュリティ要件に基づき、すべてのユーザーが新たにアップロードしたドキュメントを保存後に変更または削除できないようにする必要がある。この要件を達成するために、どのような対策を講じるべきか。',
    choices: [
      'S3オブジェクトロックのコンプライアンスモードを有効にしたS3バケットを作成して、その中にドキュメントを保存する',
      'アップロードされたドキュメントをAmazon S3バケットに保存する。さらに、アーカイブをGlacierに移行してボールトロックを適用する',
      'S3オブジェクトロックのガバナンスモードを有効化したS3バケットを作成して、その中にドキュメントを保存する',
      'S3バケットを作成した後、プロパティ変更画面でS3オブジェクトロックのガバナンスモードを有効にする。そのバケットの中にドキュメントを保存する',
    ],
    answer: 0,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td><strong>すべての</strong>ユーザーが変更または削除できない</td><td><mark>管理者もrootユーザーも例外なし。「偉い人なら消せる」方式では要件を満たさない</mark></td></tr>
    <tr><td>厳格なセキュリティ要件</td><td>あとから解除できる仕組みではダメ。一度決めたら覆せない設定を選ぶ</td></tr>
    <tr><td>アップロードされたドキュメント（ファイル）</td><td>置き場所はS3。ファイル単位で守る仕組みが要る</td></tr>
  </table>

  <h2>「例外あり」か「例外なし」か</h2>
  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ ガバナンスモード</div>
      <div class="nodes v">
        <div class="node ng">
          <span class="ico"><img src="assets/icons/gen-user.svg" alt=""></span>
          <span class="lbl">特別な権限を持つ管理者</span><span class="sub">s3:BypassGovernanceRetention を持つ人</span>
        </div>
        <div class="link ng"><span>ロックを回避して削除できる</span><span class="l">↓</span></div>
        <div class="node ng">
          <span class="ico"><img src="assets/icons/gen-documents.svg" alt=""></span>
          <span class="lbl">ドキュメントが消える</span><span class="sub">「すべてのユーザーが削除できない」に反する</span>
        </div>
      </div>
      <p class="note">ふつうの社員は消せませんが、鍵を持つ管理者は消せます。「原則禁止・例外あり」の方式です。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ コンプライアンスモード</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/gen-user.svg" alt=""></span>
          <span class="lbl">rootユーザーでさえ</span><span class="sub">AWSアカウントの最高権限者</span>
        </div>
        <div class="link ok"><span>保持期間中はどんな操作も拒否される</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/gen-ssl-padlock.svg" alt=""></span>
          <span class="lbl">変更も削除も不可能</span><span class="sub">保持期間を短くすることもできない</span>
        </div>
      </div>
      <p class="note">誰にも例外はありません。期間が過ぎるまで、物理的に手が出せなくなります。</p>
    </div>
  </div>
  <p class="caption">ヒント1の「すべてのユーザー」という言葉が、そのままこの2つの分かれ目になります。</p>
  <p>これは<strong>試験の答案用紙を提出したあと</strong>と同じです。ガバナンスモードは「先生に頼めば書き直させてもらえる」状態、コンプライアンスモードは<mark>「提出した瞬間に封がされ、先生ですら開けられない」</mark>状態です。厳格さを求められているなら後者しかありません。</p>

  <h2>オブジェクトロックは、バケットを作るときにしか有効化できない</h2>
  <div class="nodes v">
    <div class="node ok">
      <span class="ico"><img src="assets/icons/amazon-simple-storage-service.svg" alt=""></span>
      <span class="lbl">① バケット作成画面</span><span class="sub">ここで「オブジェクトロックを有効にする」にチェックを入れる</span>
    </div>
    <div class="link ok"><span>バージョニングも自動的に有効になる</span><span class="l">↓</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/res-amazon-simple-storage-service-bucket-with-objects.svg" alt=""></span>
      <span class="lbl">② モードと保持期間を設定</span><span class="sub">コンプライアンスモード ＋ 保持年数</span>
    </div>
    <div class="link ok"><span>以降、入れたファイルは自動で保護される</span><span class="l">↓</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/gen-ssl-padlock.svg" alt=""></span>
      <span class="lbl">③ ドキュメントを保存</span><span class="sub">保持期間中は誰も変更・削除できない</span>
    </div>
  </div>
  <p class="caption">順番が大事です。<strong>あとから普通のバケットにこの設定を足すことはできません。</strong></p>

  <h2>まぎらわしい4つを区別する</h2>
  <table>
    <tr><th style="width:26%">名前</th><th style="width:34%">何ができるか</th><th>できないこと・問題点</th></tr>
    <tr><td class="good">S3オブジェクトロック コンプライアンスモード</td><td class="good">保持期間中は<strong>rootユーザーを含む誰も</strong>変更・削除できない。期間の短縮も不可</td><td>いったん設定すると取り消せない。期間を長く設定しすぎると保管料が膨らむ</td></tr>
    <tr><td>S3オブジェクトロック ガバナンスモード</td><td>通常のユーザーは変更・削除できない</td><td><strong>特別な権限を持つ管理者は回避できる。</strong>「すべてのユーザー」という要件を満たさない</td></tr>
    <tr><td>Glacier ボールトロック</td><td>Glacierのボールト（保管庫）単位でポリシーを固定する古い仕組み</td><td><strong>ファイル単位ではなく保管庫単位。</strong>さらにアーカイブへの移行という余計な手順が増える</td></tr>
    <tr><td>作成後にプロパティ画面で有効化</td><td>—</td><td><strong>オブジェクトロックはバケット作成時にしか有効化できない。</strong>手順として成立しない</td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>A. オブジェクトロックのコンプライアンスモードを有効にしたS3バケットを作成して保存する</h3>
      <p>バケットを作る時点でオブジェクトロックを有効にし、モードをコンプライアンスにします。保持期間中は誰も手を出せません。</p>
      <p class="why">ヒント1（すべてのユーザー）、ヒント2（厳格）、ヒント3（ファイル単位）をすべて満たします。手順としても正しい順番です。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. S3に保存し、Glacierに移行してボールトロックを適用する</h3>
      <p>ボールトロックは、Glacierの保管庫（ボールト）に対してポリシーを固定する仕組みです。守れること自体は似ています。</p>
      <p class="why">守る単位が<strong>ファイルではなく保管庫</strong>で、アーカイブに移すという余計な手順も増えます。現在はオブジェクトロックが後継の仕組みなので、ヒント3に対して遠回りです。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. オブジェクトロックのガバナンスモードを有効化したS3バケットを作成して保存する</h3>
      <p>手順は正しく、多くの場面ではこれで十分です。「基本は守るが、必要なら管理者が解除できる」という現実的な設定だからです。</p>
      <p class="why">しかしヒント1は<strong>「すべてのユーザー」</strong>と書いています。特別な権限を持つ管理者が回避できる時点で、この要件を満たしません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. バケット作成後にプロパティ変更画面でガバナンスモードを有効にする</h3>
      <p>モードがガバナンスである点でCと同じ問題を抱えています。さらに手順にも誤りがあります。</p>
      <p class="why"><strong>オブジェクトロックはバケットを作る時点でしか有効にできません。</strong>あとからプロパティ画面で足すことはできず、ヒント1・2の両方に反します。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：A　S3オブジェクトロックのコンプライアンスモードを有効にしたS3バケットを作成して、その中にドキュメントを保存する</strong></p>
    <p class="oboe">覚え方 —— <strong>S3オブジェクトロックの2モードは「例外があるかないか」で選ぶ。「すべてのユーザー」「rootでも不可」「法令順守」「絶対に消させない」ならコンプライアンスモード。「原則は禁止だが管理者は解除できる」ならガバナンスモード。</strong>もうひとつ、手順の鉄則も覚えてください。<strong>オブジェクトロックはバケット作成時にしか有効化できず、バージョニングも同時に有効になる。</strong>「あとから有効にする」と書いてある選択肢は、内容を読むまでもなく不正解です。</p>
  </div>`
  },

  {
    id: 'e1q47',
    q: 'ソリューションアーキテクトとして、AWSを活用したアプリケーションの設計を行っている。このアプリケーションは、2つのリージョンにまたがるプライマリおよびセカンダリの構成を持ち、各リージョンにはELB、Auto Scaling、EC2インスタンスが配置されている。プライマリインフラストラクチャが障害を起こした際に備えて、適切なRoute 53のルーティングポリシーを設定することが求められている。その際、セカンダリ構成は普段は利用されない。これらの要件を満たすソリューションはどれか。',
    choices: [
      'ルーティングポリシーに加重ルーティングを設定する',
      'ルーティングポリシーにシンプルルーティングを設定する',
      'ルーティングポリシーにマルチバリュールーティングを設定する',
      'ルーティングポリシーにフェイルオーバールーティングを設定する',
    ],
    answer: 3,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td><strong>プライマリ</strong>および<strong>セカンダリ</strong>の構成</td><td>本命と控えという主従関係がある。対等に分け合う構成ではない</td></tr>
    <tr><td>プライマリが障害を起こした際に備えて</td><td>健康状態を見て、ダメなら切り替える仕組みが要る</td></tr>
    <tr><td>セカンダリ構成は<strong>普段は利用されない</strong></td><td><mark>平常時はセカンダリに1件も流してはいけない。ここが決め手</mark></td></tr>
    </table>

  <h2>ヘルスチェックを見て、必要なときだけ切り替える</h2>
  <div class="nodes v">
    <div class="node">
      <span class="ico"><img src="assets/icons/amazon-route-53.svg" alt=""></span>
      <span class="lbl">Amazon Route 53</span><span class="sub">フェイルオーバールーティング。プライマリとセカンダリを登録する</span>
    </div>
    <div class="link"><span>ヘルスチェックでプライマリの状態を常時監視</span><span class="l">↓</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/elastic-load-balancing.svg" alt=""></span>
      <span class="lbl">プライマリリージョンのELB</span><span class="sub">正常なら、アクセスは100％こちらへ</span>
    </div>
    <div class="link ng"><span>異常を検知したときだけ、宛先を切り替える</span><span class="l">↓</span></div>
    <div class="node dim">
      <span class="ico"><img src="assets/icons/elastic-load-balancing.svg" alt=""></span>
      <span class="lbl">セカンダリリージョンのELB</span><span class="sub">平常時はアクセスゼロ</span>
    </div>
  </div>
  <p class="caption">ヘルスチェックが「正常」を返しているあいだ、セカンダリには1件も届きません。</p>
  <p>これは<strong>病院の非常用発電機</strong>と同じです。ふだんは1ワットも使いませんが、停電を検知した瞬間に自動で切り替わります。「ふだんも少しだけ電気を分けて使う」とは違う設計です。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <table>
    <tr><th style="width:26%">ルーティングポリシー</th><th style="width:34%">どう振り分けるか</th><th>できないこと・向かないこと</th></tr>
    <tr><td class="good">フェイルオーバー</td><td class="good">ヘルスチェックで主を監視し、<strong>異常時だけ</strong>控えに切り替える</td><td>平常時に負荷を分散する用途には使えない（今回はそれで正しい）</td></tr>
    <tr><td>加重（Weighted）</td><td>「9対1」のように割合を決めて分ける。カナリアリリースやA/Bテストに使う</td><td><strong>平常時からセカンダリにも一定の割合が流れる。</strong>「普段は利用されない」に反する</td></tr>
    <tr><td>シンプル</td><td>1つのレコードに宛先を書くだけの基本形</td><td><strong>ヘルスチェックによる切り替えができない。</strong>障害時も同じ宛先を返し続ける</td></tr>
    <tr><td>マルチバリュー回答</td><td>正常な宛先を最大8件まとめて返し、クライアントが選ぶ</td><td>主従関係がない。<strong>平常時からセカンダリも候補として返される</strong></td></tr>
  </table>
  <p>参考までに、Route 53にはこのほか<strong>レイテンシー（応答が速いリージョンへ）</strong>、<strong>位置情報（アクセス元の国や地域で振り分け）</strong>もあります。どれも「主従」ではなく「使い分け」のための仕組みです。</p>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. 加重ルーティングを設定する</h3>
      <p>宛先ごとに重みを付けて、決めた割合でアクセスを振り分けます。新バージョンに10％だけ流して様子を見る、といった使い方に向きます。</p>
      <p class="why">割合をゼロにすればセカンダリに流れませんが、それでは障害時に切り替わりません。<strong>割合を持たせればヒント3に反します。</strong>どちらにしても要件を満たせません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. シンプルルーティングを設定する</h3>
      <p>1つのレコードに1つの宛先を書くだけの、いちばん基本的な設定です。</p>
      <p class="why">ヘルスチェックによる自動切り替えができません。プライマリが落ちても同じ宛先を返し続けるので、ヒント2を満たしません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. マルチバリュールーティングを設定する</h3>
      <p>正常な宛先を最大8件まとめて返し、アクセスする側がその中から選びます。簡易的な負荷分散として使えます。</p>
      <p class="why">主従の関係を作れません。<strong>平常時からセカンダリも候補として返される</strong>ため、ヒント1とヒント3の両方に反します。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>D. フェイルオーバールーティングを設定する</h3>
      <p>プライマリとセカンダリを登録し、ヘルスチェックでプライマリを監視します。正常なあいだは100％プライマリ、異常を検知したときだけセカンダリへ切り替わります。</p>
      <p class="why">ヒント1（主従）、ヒント2（障害時に切り替え）、ヒント3（平常時は使わない）をすべて満たします。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：D　ルーティングポリシーにフェイルオーバールーティングを設定する</strong></p>
    <p class="oboe">覚え方 —— <strong>Route 53のルーティングは、問題文のキーワードで一発で決まる。「プライマリ／セカンダリ」「障害時に切り替え」「普段は使わない」ならフェイルオーバー。「◯％ずつ」「カナリア」「段階的に移行」なら加重。「一番近い／速いリージョンへ」ならレイテンシー。「国・地域ごとに出し分け」なら位置情報。「複数の宛先を返して簡易分散」ならマルチバリュー。</strong>特に<strong>「普段は利用されない」という一文が出たら、その時点でフェイルオーバー以外は消える</strong>と覚えてください。</p>
  </div>`
  },

  {
    id: 'e1q48',
    q: 'ある企業は、AWS上でホストされている業務アプリケーションを活用し、日々の業務に関連する記録管理を行っている。業界の規定に従い、記録データは5年間保存する必要がある。これらの記録の大部分はあまりアクセスされないが、監査の要求に応じて、24時間以内にデータを提供する義務がある。この状況において、選択するべきコスト効率の良いストレージはどれか。',
    choices: [
      'Amazon S3 Glacier Flexible Retrieval',
      'Amazon S3 Glacier Deep Archive',
      'S3 Standard',
      'S3 One Zone-IA',
      'S3 Standard-IA',
    ],
    answer: 1,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>5年間保存する／大部分はあまりアクセスされない</td><td>長期保管が目的。読み出す前提で置く場所ではない</td></tr>
    <tr><td><strong>24時間以内</strong>にデータを提供する</td><td><mark>24時間も待てる。即座に読める必要はまったくない</mark>。ここが決め手</td></tr>
    <tr><td>コスト効率の良いストレージ</td><td>24時間という条件を満たす中で、いちばん安いものを選ぶ</td></tr>
  </table>
  <p>この問題のコツは<strong>「24時間以内」を制限ではなく余裕として読むこと</strong>です。取り出しに12時間かかっても間に合います。速さにお金を払う必要はありません。</p>

  <h2>保管料を比べる</h2>
  <div class="bars">
    <div class="barrow"><div class="name">S3 Standard<br>1GBあたり約0.023ドル／月</div><div class="bar red" style="width:100%"></div></div>
    <div class="barrow"><div class="name">S3 Standard-IA<br>約0.0125ドル</div><div class="bar red" style="width:54%"></div></div>
    <div class="barrow"><div class="name">S3 One Zone-IA<br>約0.01ドル</div><div class="bar red" style="width:43%"></div></div>
    <div class="barrow"><div class="name">Glacier Flexible Retrieval<br>約0.0036ドル</div><div class="bar red" style="width:16%"></div></div>
    <div class="barrow"><div class="name">Glacier Deep Archive<br>約0.00099ドル</div><div class="bar green" style="width:4%"></div></div>
  </div>
  <p class="caption">東京リージョンの目安です。Deep ArchiveはS3標準のおよそ23分の1。5年間ぶんの差は非常に大きくなります。</p>

  <h2>監査の依頼が来たとき、どう動くか</h2>
  <div class="nodes v">
    <div class="node">
      <span class="ico"><img src="assets/icons/gen-documents.svg" alt=""></span>
      <span class="lbl">監査から資料請求</span><span class="sub">「24時間以内に提出してください」</span>
    </div>
    <div class="link ok"><span>取り出しをリクエストする</span><span class="l">↓</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/res-amazon-simple-storage-service-s3-glacier-deep-archive.svg" alt=""></span>
      <span class="lbl">Glacier Deep Archive</span><span class="sub">標準取り出しで約12時間</span>
    </div>
    <div class="link ok"><span>残り12時間の余裕を持って</span><span class="l">↓</span></div>
    <div class="node ok">
      <span class="ico"><img src="assets/icons/gen-cold-storage.svg" alt=""></span>
      <span class="lbl">データを提出</span><span class="sub">24時間の期限に間に合う</span>
    </div>
  </div>
  <p class="caption">12時間 ＜ 24時間。余裕を持って間に合います。</p>
  <p>これは<strong>トランクルームに預けた季節家電</strong>のようなものです。取りに行くのに半日かかりますが、置き場所代は自宅のクローゼットよりずっと安い。「明日までに要る」程度の話なら、これで何の問題もありません。</p>

  <h2>まぎらわしい5つを区別する</h2>
  <table>
    <tr><th style="width:24%">クラス</th><th style="width:22%">取り出しにかかる時間</th><th style="width:18%">保管料</th><th>向かないこと</th></tr>
    <tr><td class="good">Glacier Deep Archive</td><td class="good">標準で約12時間</td><td class="good">最安</td><td>すぐ読みたい用途。最低保存期間は180日</td></tr>
    <tr><td>Glacier Flexible Retrieval</td><td>標準で3〜5時間</td><td>Deep Archiveの約3.6倍</td><td><strong>24時間も余裕があるのに、速さの代金を払っている</strong></td></tr>
    <tr><td>S3 Standard-IA</td><td>すぐ（ミリ秒）</td><td>Deep Archiveの約13倍</td><td>同じく、不要な即時性にお金を払っている</td></tr>
    <tr><td>S3 One Zone-IA</td><td>すぐ（ミリ秒）</td><td>Deep Archiveの約10倍</td><td>高いうえに<strong>1つのAZにしか置かれない。5年保管する重要な記録には危険</strong></td></tr>
    <tr><td>S3 Standard</td><td>すぐ（ミリ秒）</td><td>最も高い</td><td>ほとんど読まないデータの長期保管には最も不向き</td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. Amazon S3 Glacier Flexible Retrieval</h3>
      <p>アーカイブ用のクラスで、標準取り出しなら3〜5時間で読み出せます。「数時間以内に出したい」場合の答えです。</p>
      <p class="why">24時間も待てるのに、3〜5時間という速さに<strong>Deep Archiveの約3.6倍</strong>を払うことになります。ヒント2とヒント3を組み合わせると負けます。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>B. Amazon S3 Glacier Deep Archive</h3>
      <p>S3でいちばん安いクラスです。標準取り出しは約12時間かかりますが、24時間の期限には余裕で間に合います。</p>
      <p class="why">ヒント1（長期保管）、ヒント2（24時間でよい）、ヒント3（最安）をすべて満たします。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. S3 Standard</h3>
      <p>いつでも一瞬で読める、いちばん基本のクラスです。よく使うデータの置き場所としては最適です。</p>
      <p class="why">ほとんど読まないデータを5年間置くには高すぎます。Deep Archiveのおよそ23倍で、ヒント3に大きく反します。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. S3 One Zone-IA</h3>
      <p>1つのAZだけにデータを置くことで安くしたクラスです。再作成できるデータの置き場所に向きます。</p>
      <p class="why">Deep Archiveより10倍高いうえ、<strong>そのAZが失われるとデータも失われます</strong>。法令で5年保存する記録には使えません。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>E. S3 Standard-IA</h3>
      <p>あまり読まないが、読むときは一瞬で欲しいデータ向けのクラスです。</p>
      <p class="why">ここでも即時性は求められていません。要件にない速さに<strong>Deep Archiveの約13倍</strong>を払うことになり、ヒント3に反します。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：B　Amazon S3 Glacier Deep Archive</strong></p>
    <p class="oboe">覚え方 —— <strong>アーカイブ問題は「何時間待てるか」の数字だけで決まる。ミリ秒で欲しいならGlacier Instant Retrieval。数時間（3〜5時間）ならGlacier Flexible Retrieval。半日〜1日待てるならGlacier Deep Archive（約12時間・最安）。</strong>問題文の<strong>「24時間以内」「翌日まででよい」「数日以内」は、すべてDeep Archiveの合図</strong>です。また<strong>One Zone-IAは1つのAZにしか置かれない</strong>ので、法令保管・重要記録・削除できないデータの問題では常に不正解になります。</p>
  </div>`
  },

  {
    id: 'e1q49',
    q: 'ある企業は、Amazon Route 53パブリックホストゾーンで公開されている単一のAmazon EC2インスタンスにホストされたウェブアプリケーションを運用している。また同インスタンスはMySQLデータベースも同時に実行している。ソリューションアーキテクトは、アプリケーションをスケーラブルで高可用性なアーキテクチャに再構成して、MySQLの読み取りレイテンシーも削減することが求められている。これらの要件を満たすソリューションの組み合わせはどれか。（2つ選択）',
    choices: [
      '複数のアベイラビリティーゾーンにEC2インスタンスを展開するようにALBとAuto Scalingグループを設定する',
      '別リージョンに2つ目のEC2インスタンスを起動する。Route 53のフェイルオーバールーティングポリシーを使用して、両方のリージョン内のEC2インスタンスにルーティングを構成する',
      'データベースをAmazon Aurora MySQLのグローバルデータベースに移行して、クロスリージョンリードレプリカを構成する',
      'データベースをAmazon Aurora MySQLクラスターに移行して、プライマリDBインスタンスとリーダーDBインスタンスを別々のアベイラビリティーゾーンに作成する',
      'データベースをAmazon Aurora MySQLのグローバルデータベースに移行して、マルチAZ配置を有効化する',
    ],
    answer: [0, 3],
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td><strong>単一の</strong>EC2インスタンスに、ウェブもMySQLも同居している</td><td><mark>この1台が止まればすべてが止まる。Webとデータベースを分けるところから始まる</mark></td></tr>
    <tr><td>スケーラブルで高可用性なアーキテクチャに再構成</td><td>台数を増やせること、1か所が落ちても動くこと。AZをまたぐ構成にする</td></tr>
    <tr><td>MySQLの<strong>読み取りレイテンシー</strong>も削減</td><td>読み取り専用のコピーを用意して、読み取りを分ける</td></tr>
    </table>
  <p>直すべき弱点は2つ、Web層とDB層です。だから選ぶのも2つになります。</p>

  <h2>1台に全部載っている状態から、2層に分ける</h2>
  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ いまの構成</div>
      <div class="nodes v">
        <div class="node ng">
          <span class="ico"><img src="assets/icons/res-amazon-ec2-instance.svg" alt=""></span>
          <span class="lbl">EC2 1台</span><span class="sub">Webサーバー ＋ MySQL が同居</span>
        </div>
        <div class="link ng"><span>この1台が落ちたら</span><span class="l">↓</span></div>
        <div class="node ng">
          <span class="ico"><img src="assets/icons/gen-alert.svg" alt=""></span>
          <span class="lbl">全停止</span><span class="sub">台数も増やせない</span>
        </div>
      </div>
      <p class="note">1本しかない柱で建物を支えているような状態です。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ 再構成後</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/elastic-load-balancing.svg" alt=""></span>
          <span class="lbl">ALB ＋ Auto Scaling</span><span class="sub">複数AZにWebサーバーを分散</span>
        </div>
        <div class="link ok"><span>Web層とDB層を切り離す</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/amazon-aurora.svg" alt=""></span>
          <span class="lbl">Aurora MySQLクラスター</span><span class="sub">プライマリとリーダーを別AZに配置</span>
        </div>
      </div>
      <p class="note">どちらの層もAZをまたぐので、AZ1つの障害では止まりません。</p>
    </div>
  </div>
  <p class="caption">柱を増やし、さらに別々の基礎の上に立てるイメージです。</p>

  <h2>できあがる構成</h2>
  <div class="zone">
    <span class="zlbl"><img src="assets/icons/group-region.svg" alt="">1つのリージョン</span>
    <div class="zone">
      <span class="zlbl">アベイラビリティーゾーン A</span>
      <div class="zrow">
        <div class="node ok"><span class="ico"><img src="assets/icons/res-amazon-ec2-instances.svg" alt=""></span><span class="lbl">Webサーバー</span><span class="sub">Auto Scalingで増減</span></div>
        <div class="node ok"><span class="ico"><img src="assets/icons/amazon-aurora.svg" alt=""></span><span class="lbl">Aurora プライマリ</span><span class="sub">書き込みを受ける</span></div>
      </div>
    </div>
    <div class="zone">
      <span class="zlbl">アベイラビリティーゾーン B</span>
      <div class="zrow">
        <div class="node ok"><span class="ico"><img src="assets/icons/res-amazon-ec2-instances.svg" alt=""></span><span class="lbl">Webサーバー</span><span class="sub">同じくAuto Scalingで増減</span></div>
        <div class="node ok"><span class="ico"><img src="assets/icons/amazon-aurora.svg" alt=""></span><span class="lbl">Aurora リーダー</span><span class="sub">読み取りを引き受ける／障害時は昇格</span></div>
      </div>
    </div>
  </div>
  <p class="caption">リーダーは読み取りを分担しつつ、プライマリが倒れたときの控えも兼ねます。1台で2つの役割をこなすので無駄がありません。</p>

  <h2>まぎらわしい3つを区別する</h2>
  <table>
    <tr><th style="width:26%">名前</th><th style="width:34%">どこまでカバーするか</th><th>今回に向かないこと</th></tr>
    <tr><td class="good">Auroraクラスター（プライマリ＋リーダーを別AZ）</td><td class="good">同一リージョン内でAZをまたぐ。読み取り分散と高可用性を同時に実現</td><td>リージョンごとの災害には対応しない（今回は求められていない）</td></tr>
    <tr><td>Auroraグローバルデータベース</td><td><strong>別リージョン</strong>へ複製する。リージョン規模の災害に備える機能</td><td>問題文に別リージョンの要件はない。<strong>要件にない機能でコストだけが増える</strong></td></tr>
    <tr><td>別リージョンにEC2 ＋ Route 53フェイルオーバー</td><td>リージョン障害時に別リージョンへ切り替える</td><td><strong>スケーラビリティにならない。</strong>台数は増えず、控えは普段使われないまま費用だけかかる</td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>A. 複数のAZにEC2を展開するようにALBとAuto Scalingグループを設定する</h3>
      <p>Auto Scalingが負荷に応じて台数を増減し、ALBが複数AZのインスタンスへ振り分けます。1つのAZが落ちても残りのAZで動き続けます。</p>
      <p class="why">ヒント2の「スケーラブル」と「高可用性」の両方を、Web層について満たします。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>B. 別リージョンに2つ目のEC2を起動し、Route 53のフェイルオーバールーティングを構成する</h3>
      <p>リージョンごと落ちる災害に備える構成です。備え自体は有効ですが、求められていることとは違います。</p>
      <p class="why">EC2は結局1台ずつなので<strong>スケーラブルになりません</strong>。ヒント2の「台数を増やせること」を満たさず、待機分のコストだけが増えます。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. Auroraグローバルデータベースに移行して、クロスリージョンリードレプリカを構成する</h3>
      <p>別リージョンへ複製する機能です。世界中から低遅延で読みたい場合や、リージョン規模の災害に備える場合に使います。</p>
      <p class="why">問題文には別リージョンの要件が一切ありません。<strong>要件にない機能でコストを増やしている</strong>ので、過剰な構成です。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>D. Aurora MySQLクラスターに移行して、プライマリとリーダーを別々のAZに作成する</h3>
      <p>リーダーが読み取りを引き受けるので読み取りの待ち時間が減り、同時にプライマリが倒れたときの昇格先にもなります。</p>
      <p class="why">ヒント3（読み取りレイテンシーの削減）とヒント2（高可用性）を、1つの構成で同時に満たします。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>E. Auroraグローバルデータベースに移行して、マルチAZ配置を有効化する</h3>
      <p>Cと同じく、必要のない別リージョン複製を含んでいます。</p>
      <p class="why">要件にない機能でコストが増えるうえ、読み取りレイテンシーの削減という目的に対しても遠回りです。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：A・D　ALBとAuto Scalingグループで複数AZにEC2を展開し、Aurora MySQLクラスターのプライマリとリーダーを別々のAZに作成する</strong></p>
    <p class="oboe">覚え方 —— <strong>「スケーラブルで高可用性」と言われたら、Web層はALB＋Auto Scaling＋複数AZ、DB層はAuroraクラスター（プライマリ＋リーダーを別AZ）。これが定番の2点セット。</strong>判定のコツは範囲の確認です。<strong>問題文に「別リージョン」「クロスリージョン」「災害復旧」が書かれていなければ、グローバルデータベースは要件にない過剰構成として切る。</strong>AWSの試験では、必要以上に手厚い構成はコスト面で不正解になります。</p>
  </div>`
  },

  {
    id: 'e1q50',
    q: 'ある企業は、AWSを活用して社内文書の管理および保存を行うソリューションを構築している。保存されたデータは通常ほとんど使用されないが、必要に応じて管理者の指示に従い、10時間以内にデータを取得することが求められている。Amazon S3 Glacier Flexible Retrievalを利用して、データの利用要件を満たしつつコスト最適な設定をする必要がある。Glacier Flexible Retrievalクラスに必要な設定はどれか。',
    choices: [
      '迅速取り出し',
      '標準取り出し',
      '大容量取り出し',
      'ボールトロック',
    ],
    answer: 1,
    explain: `
  <h2>まず、問題文の中の「3つのヒント」</h2>
  <table>
    <tr><th style="width:34%">問題文のことば</th><th>ここから分かること</th></tr>
    <tr><td>通常はほとんど使用されない</td><td>ふだんは眠らせておくデータ。Glacierが適している</td></tr>
    <tr><td><strong>10時間以内</strong>にデータを取得する</td><td><mark>10時間は必ず守る線。1分でも超える可能性がある方式は選べない</mark></td></tr>
    <tr><td>コスト最適な設定</td><td>10時間を確実に守れる中で、いちばん安いものを選ぶ</td></tr>
    </table>
  <p>Glacier Flexible Retrievalには取り出し方法が3つあり、<strong>速いほど高い</strong>という関係になっています。</p>

  <h2>3つの取り出し方法と、10時間の線</h2>
  <div class="bars">
    <div class="barrow"><div class="name">迅速取り出し<br>1〜5分・最も高い</div><div class="bar red" style="width:5%"></div></div>
    <div class="barrow"><div class="name">標準取り出し</div><div class="bar green" style="width:42%">3〜5時間　← 10時間に確実に収まる</div></div>
    <div class="barrow"><div class="name">大容量取り出し</div><div class="bar red" style="width:100%">5〜12時間（最も安いが、12時間かかることがある）</div></div>
  </div>
  <p class="caption">大容量取り出しは安いのですが、上限が12時間。<strong>10時間を超える可能性があるので選べません。</strong></p>

  <h2>安さだけで選ぶと、締め切りを破る</h2>
  <div class="vs">
    <div class="pane bad">
      <div class="pane-h">✕ 大容量取り出し（いちばん安い）</div>
      <div class="nodes v">
        <div class="node ng">
          <span class="ico"><img src="assets/icons/res-amazon-simple-storage-service-glacier-archive.svg" alt=""></span>
          <span class="lbl">取り出しを依頼</span><span class="sub">かかる時間は5〜12時間</span>
        </div>
        <div class="link ng"><span>12時間かかった場合</span><span class="l">↓</span></div>
        <div class="node ng">
          <span class="ico"><img src="assets/icons/gen-alert.svg" alt=""></span>
          <span class="lbl">10時間を超える</span><span class="sub">要件を満たせない</span>
        </div>
      </div>
      <p class="note">運がよければ間に合いますが、要件は「必ず10時間以内」です。運に任せる設計は選べません。</p>
    </div>
    <div class="pane good">
      <div class="pane-h">◯ 標準取り出し</div>
      <div class="nodes v">
        <div class="node ok">
          <span class="ico"><img src="assets/icons/res-amazon-simple-storage-service-s3-glacier-flexible-retrieval.svg" alt=""></span>
          <span class="lbl">取り出しを依頼</span><span class="sub">かかる時間は3〜5時間</span>
        </div>
        <div class="link ok"><span>最も遅い5時間でも</span><span class="l">↓</span></div>
        <div class="node ok">
          <span class="ico"><img src="assets/icons/gen-cold-storage.svg" alt=""></span>
          <span class="lbl">10時間以内に完了</span><span class="sub">迅速取り出しより大幅に安い</span>
        </div>
      </div>
      <p class="note">条件を確実に守れる中で、いちばん安い選択です。</p>
    </div>
  </div>
  <p class="caption">選ぶ基準は「平均」ではなく「最悪でも間に合うか」です。</p>
  <p>宅配便にたとえると分かりやすくなります。<strong>翌朝10時までに必ず届けたい</strong>とき、「5〜12時間で届きます」という一番安い便は選べません。<mark>多少高くても「3〜5時間で確実に届く」便を選ぶ</mark>のが正しい判断です。</p>

  <h2>まぎらわしい4つを区別する</h2>
  <table>
    <tr><th style="width:24%">名前</th><th style="width:24%">かかる時間</th><th style="width:18%">料金</th><th>向かないこと</th></tr>
    <tr><td>迅速取り出し（Expedited）</td><td>1〜5分</td><td>最も高い</td><td><strong>10時間も余裕があるのに、分単位の速さに払っている</strong></td></tr>
    <tr><td class="good">標準取り出し（Standard）</td><td class="good">3〜5時間</td><td class="good">中間</td><td>数分で欲しい緊急時には遅い</td></tr>
    <tr><td>大容量取り出し（Bulk）</td><td>5〜12時間</td><td>最も安い（無料の場合もある）</td><td><strong>12時間かかる可能性がある。10時間という締め切りを守れない</strong></td></tr>
    <tr><td>ボールトロック</td><td>—</td><td>—</td><td><strong>そもそも取り出しオプションではない。</strong>保管庫のポリシーを固定して変更できなくする機能</td></tr>
  </table>

  <h2>選択肢を1つずつ丸つけする</h2>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>A. 迅速取り出し</h3>
      <p>1〜5分で読み出せる、いちばん速い方法です。緊急の調査などで数分以内に必要な場合に使います。</p>
      <p class="why">10時間も待てるのに分単位の速さを買っています。ヒント3のコスト最適に反します。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark o">◯</div>
    <div>
      <h3>B. 標準取り出し</h3>
      <p>3〜5時間で読み出せます。もっとも時間がかかった場合でも5時間なので、10時間の締め切りに確実に間に合います。</p>
      <p class="why">ヒント2（10時間以内を必ず守る）を満たしたうえで、迅速取り出しより大幅に安い。ヒント3も満たす唯一の選択肢です。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>C. 大容量取り出し</h3>
      <p>いちばん安い方法で、コスト最適という言葉だけを見るとこれを選びたくなります。</p>
      <p class="why">かかる時間が<strong>5〜12時間</strong>です。12時間かかれば10時間を超えるので、ヒント2を確実には満たせません。安さよりも締め切りが優先されます。</p>
    </div>
  </div>

  <div class="choice">
    <div class="mark x">✕</div>
    <div>
      <h3>D. ボールトロック</h3>
      <p>ボールトロックは、保管庫に適用したポリシーを二度と変更できないよう固定する機能です。法令順守のために使います。</p>
      <p class="why">取り出しの速さを決める設定ではありません。ヒント2にもヒント3にも答えていません。</p>
    </div>
  </div>

  <div class="kotae">
    <p><strong>答え：B　標準取り出し</strong></p>
    <p class="oboe">覚え方 —— <strong>Glacier Flexible Retrievalの取り出しは3つ。迅速（Expedited）＝1〜5分・最高額、標準（Standard）＝3〜5時間・中間、大容量（Bulk）＝5〜12時間・最安。</strong>判定ルールはひとつです。<strong>問題文の制限時間に「最悪の所要時間」が収まるものの中から、いちばん安いものを選ぶ。</strong>「10時間以内」なら大容量（最大12時間）は脱落し、標準が残ります。この考え方は<strong>Deep Archive（標準は約12時間、大容量は約48時間）</strong>でもそのまま使えます。</p>
  </div>`
  },
  ],
};
