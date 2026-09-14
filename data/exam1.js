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

  ],
};
