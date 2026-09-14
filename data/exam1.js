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

  ],
};
