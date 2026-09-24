/**
 * Copy and asset paths for the Japanese build.
 *
 * A translation of the Korean content file: the same facts, in the same order,
 * with the sections composed the same way. Screenshots, scans and recordings
 * are the same files served from the same bucket through `asset()` — only the
 * copy around them is Japanese, so a picture added on one market is a caption
 * away from being on the other. Brand marks and what is left of the stand-in
 * art under /public/mock stay on the Worker.
 *
 * Institution names are given in their Japanese forms where one exists
 * (강원대학교 → 江原大学校) and in katakana where it does not, with the product
 * brands left in their own spelling.
 *
 * Every export here fills a type from @ballbot/shared, so a field the shared
 * components expect cannot go missing and this build cannot drift out of shape
 * from the Korean one.
 */

import { asset } from "@ballbot/shared";
import type {
	CertificatesContent,
	ExperienceContent,
	FooterContent,
	HeroContent,
	JourneyContent,
	Media,
	NavContent,
	OverviewContent,
	ProjectsContent,
	ProjectStoryContent,
	ScrollCueContent,
} from "@ballbot/shared";

/** Where the Korean build lives. The apex router remembers the choice. */
const KOREAN_BUILD = "https://ballbot.dev/go/ko";

export const nav: NavContent = {
	ariaLabel: "セクションへ移動",
	items: [
		{ id: "projects", label: "Projects" },
		{ id: "experience", label: "Experience" },
		{ id: "certificates", label: "Certificates" },
		{ id: "journey", label: "Journey" },
	],
};

export const scrollCue: ScrollCueContent = {
	ariaLabel: "プロジェクトのセクションへ移動",
	href: "#projects",
};

export const footer: FooterContent = {
	since: 2015,
	notice: "Ballbot Company, All rights reserved.",
};

/* ------------------------------------------------------------------ *
 * Hero
 * ------------------------------------------------------------------ */

export const hero: HeroContent = {
	ariaLabel: "自己紹介",
	eyebrow: "ballbot.dev",
	/**
	 * The line break is deliberate in the design; it is kept on wide viewports.
	 * As in the Korean build the headline is a 連体修飾節 — it does not close on
	 * its own, `subtitle` is the noun it lands on. Reword one and the other has
	 * to follow.
	 */
	// 816万 is the service's cumulative sign-up count, as on the Korean build,
	// so the line says ユーザーの rather than 使う — it is not current users.
	headline: "816万ユーザーの\nサービスを支えてきた",
	subtitle: "ソフトウェアエンジニアのキム・スビンです。",
	actions: {
		primary: { label: "プロジェクトを見る", href: "#projects" },
		secondary: [{ label: "GitHub ↗", href: "https://github.com/" }],
	},
	otherMarket: {
		lang: "ko",
		lead: "한국에서 보고 계신가요? ",
		emphasis: "한국어판",
		tail: "도 준비되어 있습니다.",
		href: KOREAN_BUILD,
	},
};

export const overview: OverviewContent = {
	label: "Overview",
	blocks: [
		{
			value: "2 Years",
			caption: "Nudge Healthcare / Timespread・Linkareer チームでバックエンドを担当",
			items: [
				{ emphasis: "19億件のテーブルを", detail: "メンテナンス1時間以内にマイグレーション", href: "/experience/bigint-migration" },
				{ emphasis: "毎分1,500件のリクエストを受ける", detail: "サービスのリファクタリング", href: "/experience/realtime-redesign" },
				{ emphasis: "月1,000万ウォンを超えていた AWS 費用を", detail: "30%削減", href: "/experience/aws-cost" },
				{ emphasis: "32GB を超えるメモリを占有して停止していた", detail: "API サーバーの正常化", href: "/experience/api-memory" },
			],
		},
		{
			value: "2 Awards",
			items: [
				{ emphasis: "コスモのノート、", detail: "全国大会で最優秀賞1位を獲得", href: "/projects/cosmonote" },
				{ emphasis: "HEALIX、", detail: "1,500名規模の全国ハッカソンで2位を獲得", href: "/projects/healix" },
			],
		},
		{
			value: "4.43 / 4.5",
			caption: "江原大学校 コンピュータ工学科 在学中",
		},
	],
};

/* ------------------------------------------------------------------ *
 * Projects
 * ------------------------------------------------------------------ */

/**
 * コスモのノートの画面。サービスを一周する順に並ぶ。All nine are 1537×763 captures
 * of the live site — the size is declared so the viewer reserves the right box
 * before the file lands. The caption is what the screen is; `alt` is what is on
 * it, for a reader who cannot see either.
 */
const COSMO_SCREENS: readonly Media[] = [
	{
		src: asset("/projects/cosmonote/01-landing.png"),
		width: 1537,
		height: 763,
		caption: "ランディング",
		alt: "コスモのノートの最初の画面。「動画講義に振り回されないでください」という見出しの横に、要約ノート・クイズ・スクリプトのカードが浮かんでいる",
	},
	{
		src: asset("/projects/cosmonote/02-features.png"),
		width: 1537,
		height: 763,
		caption: "機能",
		alt: "機能紹介の画面。要約ノート、動画のタイムライン、クイズの自動生成、暗記カード、コメントをカードで並べている",
	},
	{
		src: asset("/projects/cosmonote/03-note.png"),
		width: 1537,
		height: 763,
		caption: "要約ノート",
		alt: "ノートの画面。左に講義動画とタイムライン、右に EC2 インスタンスのデプロイ実習をまとめた要約ノートがある",
	},
	{
		src: asset("/projects/cosmonote/04-quiz-create.png"),
		width: 1537,
		height: 763,
		caption: "クイズの作成",
		alt: "クイズ作成のダイアログ。問題数と、選択式・記述式といった出題形式を選んでいるところ",
	},
	{
		src: asset("/projects/cosmonote/05-quiz-solve.png"),
		width: 1537,
		height: 763,
		caption: "クイズを解く",
		alt: "クイズを解く画面。10問のうち1問目を解いていて、進捗と一時保存の状態が見える",
	},
	{
		src: asset("/projects/cosmonote/06-flashcard-create.png"),
		width: 1537,
		height: 763,
		caption: "暗記カードの作成",
		alt: "暗記カード作成のダイアログ。ノートの内容から自動で作るか、白紙のカードから始めるかを選ぶ",
	},
	{
		src: asset("/projects/cosmonote/07-flashcard-study.png"),
		width: 1537,
		height: 763,
		caption: "暗記カードの学習",
		alt: "暗記カードの学習画面。25枚のデッキの1枚目と、わかる・わからない・スキップの集計がある",
	},
	{
		src: asset("/projects/cosmonote/08-public-notes.png"),
		width: 1537,
		height: 763,
		caption: "公開ノート",
		alt: "公開ノートを探す画面。検索窓の下に、ほかの人が公開したノートがカードで並んでいる",
	},
	{
		src: asset("/projects/cosmonote/09-api.png"),
		width: 1537,
		height: 763,
		caption: "開発者 API",
		alt: "開発者 API の紹介画面。資料のアップロードから要約ノート・クイズの取得までのエンドポイントを、ターミナル風のカードに書いている",
	},
];

/**
 * WATERFLAKE の画面。トンネルが一つ生まれて、つながるまでの順に。1280×654 /
 * 1502×768 / 1052×513 と比率がまちまちなので、それぞれ自分の大きさを持っていく。
 * ビューアに文はない。長い文は /projects/waterflake にある。
 */
const WATERFLAKE_SCREENS: readonly Media[] = [
	{
		src: asset("/projects/waterflake/01-tunnel-create.png"),
		width: 1280,
		height: 654,
		caption: "トンネルの作成",
		alt: "WATERFLAKE の管理画面。サーバー名と Minecraft Java Edition、サブドメインとリージョンを埋めてトンネルを作るフォーム",
	},
	{
		src: asset("/projects/waterflake/02-overview.png"),
		width: 1502,
		height: 768,
		caption: "トンネルのダッシュボード",
		alt:
			"トンネルの概要画面。発行された接続アドレスと接続の状態、プラグインが使うキーの組とトラフィックの使用量が見える",
	},
	{
		src: asset("/projects/waterflake/03-server-connect.png"),
		width: 1052,
		height: 513,
		caption: "サーバーの接続",
		alt: "ゲームサーバーのコンソール。プラグインがトンネルを20本開いてトンネリングに成功し、発行されたドメインにつながっている",
	},
];

/**
 * enqor の画面。会話が一件成立するまでの順に。01 はストア用のメイン画像で、カードの
 * タイルがそのままギャラリーの一枚目になる。あいだの九枚は 1080×2400 の縦の
 * キャプチャで、ビューアが高さで合わせる。10 だけは二台を並べて撮った実物の写真なので横。
 */
const ENQOR_SCREENS: readonly Media[] = [
	{
		src: asset("/projects/enqor/01-poster.png"),
		width: 1024,
		height: 500,
		caption: "enqor",
		alt: "enqor のストア用メイン画像。「わたしの平凡が輝く瞬間」という文の下に、アプリの画面を映したスマートフォンが2台置かれている",
	},
	{
		src: asset("/projects/enqor/02-login.jpg"),
		width: 1080,
		height: 2400,
		caption: "ログイン",
		alt: "enqor のログイン画面。携帯電話番号と Google、カカオトークのログインボタンがある",
	},
	{
		src: asset("/projects/enqor/03-home.jpg"),
		width: 1080,
		height: 2400,
		caption: "専門家を探す",
		alt: "ホーム画面。テーマ別の専門家カードが横に並び、その下に自分とつながっている専門家と、いま話せる専門家がいる",
	},
	{
		src: asset("/projects/enqor/04-profile.jpg"),
		width: 1080,
		height: 2400,
		caption: "専門家のプロフィール",
		alt: "専門家のプロフィール画面。認証タイトルとハッシュタグが付いていて、下に相談リクエストのボタンがある",
	},
	{
		src: asset("/projects/enqor/05-request.jpg"),
		width: 1080,
		height: 2400,
		caption: "相談のリクエスト",
		alt: "相談リクエストのシート。保有クラップと一秒あたりの接続費用を見せ、映像か音声かを選ばせる",
	},
	{
		src: asset("/projects/enqor/06-clap-station.jpg"),
		width: 1080,
		height: 2400,
		caption: "クラップの購入",
		alt: "クラップステーション。500 クラップから 25,000 クラップまでの束が、価格と割引率とともに並んでいる",
	},
	{
		src: asset("/projects/enqor/07-payment.jpg"),
		width: 1080,
		height: 2400,
		caption: "決済",
		alt: "Google Play のアプリ内決済シート。5,000 クラップの商品と支払い方法が出ている",
	},
	{
		src: asset("/projects/enqor/08-connecting.jpg"),
		width: 1080,
		height: 2400,
		caption: "接続中",
		alt: "かける側の画面。カメラがあらかじめ起動した状態で「接続中」と表示され、残り時間と保有クラップが見える",
	},
	{
		src: asset("/projects/enqor/09-incoming.jpg"),
		width: 1080,
		height: 2220,
		caption: "リクエストの受信",
		alt: "受ける側の画面。相手の認証タイトルとハッシュタグが付いたリクエストカードに、拒否と受諾のボタンがある",
	},
	{
		src: asset("/projects/enqor/10-call.jpg"),
		width: 2000,
		height: 1500,
		caption: "通話",
		alt: "スマートフォンを2台並べて実際にビデオ通話をしている写真。両方の画面に互いのカメラが映っている",
	},
	{
		src: asset("/projects/enqor/11-review.jpg"),
		width: 1080,
		height: 2400,
		caption: "レビュー",
		alt: "会話が終わったあとのレビュー画面。通話時間と五段階の評価、よかった点を選ぶタグがある",
	},
];

/**
 * HEALIX、ハッカソンの発表資料から選んだ三枚。アプリの画面はスライドの中に 300px
 * ほどのモックアップで埋まっていて、切り出すとビューアで潰れる — スライドごと使い、
 * 発表の順ではなく話の順に並べた。
 *
 * 表紙からは QR を消し、本文の二枚は進捗バーとデッキのナビゲーションが付いていた
 * 上の 52px を切り落とした。デッキの外枠であって中身ではないので 652 に下がっている。
 * ビューアに文はない。長い文は /projects/healix にある。
 */
const HEALIX_SCREENS: readonly Media[] = [
	{
		src: asset("/projects/healix/01-cover-5badd1f3.png"),
		width: 1244,
		height: 701,
		caption: "HEALIX",
		alt: "HEALIX の発表資料の表紙。「症状の分析から、自分に近い病院まで」という文の横に、近くの病院と予約の情報を映したスマートフォンが置かれている",
	},
	{
		src: asset("/projects/healix/02-background-1e2c9b10.png"),
		width: 1244,
		height: 652,
		caption: "企画の背景",
		alt: "企画背景のスライド。痛みを自分で検索してみる画面と、途切れずに続く検索数の推移グラフで問題を示している",
	},
	{
		src: asset("/projects/healix/03-flow-fb243485.png"),
		width: 1244,
		height: 652,
		caption: "症状の入力と病院の予約",
		alt: "サービスの流れのスライド。部位を選んで症状を書く画面と、分析の結果からそのまま近くの病院を予約する画面が並んでいる",
	},
];

/**
 * スクリーン翻訳機の画面。何をするアプリかを先に見せ、つまみは後ろで開く順に。
 * 2018年の Android アプリなので四枚とも縦のキャプチャで、ビューアが高さで合わせる。
 *
 * ページを持たないプロジェクトなので短い文はビューアのパネルにあり、それも一枚目に
 * 全部ある — 何をするアプリなのか、そしてどう終わったのか。残りの三枚にはキャプションも
 * ない。ビューアに文字が一つも出ず、サムネイルの読み上げ名は `alt` が代わりを務める。
 */
const SCREEN_TRANSLATOR_SCREENS: readonly Media[] = [
	{
		src: asset("/projects/screen-translator/01-game.jpg"),
		width: 485,
		height: 996,
		caption: "ゲームの翻訳",
		alt: "日本語のゲームの告知の上に韓国語の訳文が重なっている。原文の位置にそのまま重ねて出す",
		note: "スマートフォンを振ると即座に画面をキャプチャし、画像を OCR してテキストを取り出し、翻訳にかけてオーバーレイの形で見せる翻訳サービスです。\n\n翻訳には Google 翻訳を使っていましたが、API キーの扱いに関する知識がなく、クライアントのアプリにそのままキーを入れていました。1,000人あまりがダウンロードしたころにキーが流出し、一日に数十万ウォンものサーバー費用が発生しているのを見て、その場でサービスを取り下げた、という一件がありました。",
	},
	{
		src: asset("/projects/screen-translator/02-web.jpg"),
		width: 560,
		height: 996,
		alt: "日本語のウェブ文書の上に韓国語の訳文が重なっていて、上に原語の検出と翻訳先の言語を選ぶ行がある",
	},
	{
		src: asset("/projects/screen-translator/03-settings.jpg"),
		width: 560,
		height: 996,
		alt: "基本設定の画面。翻訳する言語の組み合わせと認識の精度、翻訳のディレイと AI 翻訳の有無を選ぶ",
	},
	{
		src: asset("/projects/screen-translator/04-sensitivity.jpg"),
		width: 560,
		height: 996,
		alt: "感度設定の画面。どのくらい強く振れば反応するかをスライダーで合わせ、その場で振って試す",
	},
];

/**
 * コスモのノートが通ってきた画面、開発の各段階に一枚ずつ。学校の LMS と
 * エクステンションのキャプチャなので大きさがまちまちで、ページはそれぞれ自分の比率で収める。
 */
const COSMO_STEP_SCREENS = {
	downloader: {
		src: asset("/projects/cosmonote/story/01-downloader.jpg"),
		width: 1280,
		height: 588,
		caption: "コスモス ダウンローダー",
		alt: "学校の講義サイトの動画ビューア。エクステンションが上部バーの右に追加したダウンロードボタンに、赤い丸が付けてある",
	},
	summary: {
		src: asset("/projects/cosmonote/story/02-summary-button.jpg"),
		width: 898,
		height: 302,
		caption: "講義ホームの要約ボタン",
		alt: "講義ホーム画面の週ごとの動画一覧。それぞれの動画の下に、ダウンロードボタンと AI ノートで要約するボタンが並んでいる",
	},
	webImport: {
		src: asset("/projects/cosmonote/story/03-web-import.jpg"),
		width: 1280,
		height: 692,
		caption: "ウェブから動画を読み込む",
		alt: "コスモのノートの最初の画面。学校の LMS と動画の URL、ID とパスワードを受け取るフォームの横に学校の講義サイトのウィンドウが重なっていて、講義のアドレスがフォームへ入っていく矢印が描かれている",
	},
	note: {
		src: asset("/projects/cosmonote/story/04-note-page.jpg"),
		width: 1280,
		height: 829,
		caption: "生成されたノート",
		alt: "ノートの画面。左に講義動画とスクリプト、右に SSH で Linux サーバーへ接続する授業をまとめた要約の目次がある",
	},
	renewal: {
		src: asset("/projects/cosmonote/story/05-renewal.png"),
		width: 1660,
		height: 897,
		caption: "リニューアル後のノート画面",
		alt: "リニューアル後のノートの画面。左にアップロードした講義動画とタイムライン、右に EC2 インスタンスのデプロイ実習をまとめた要約ノートと、クイズ・暗記カードのタブがある",
	},
} as const satisfies Record<string, Media>;

/**
 * サービスの構成図。Pencil 文書で手描き風の線と英単語だけで描き、2x で書き出した
 * 1200×320 のフレーム — 変えることになったら、コードではなくその文書を直す。
 */
const COSMO_ARCHITECTURE: Media = {
	src: asset("/projects/cosmonote/story/06-architecture.png"),
	width: 2400,
	height: 640,
	caption: "アップロードからノート生成までの流れ",
	alt: "コスモのノートの構成図。動画や PDF のファイルが R2 に入り、estimator と summarizer の二つのコンテナを経て、Worker と LLM がノートを作る流れが、手描きの箱と矢印でつながっている。R2 から Worker までは cloudflare と書かれた点線の中にある",
};

/**
 * フレーム分析の図。構成図と同じ手描きの決まりで Pencil 文書(`cosmo / 01 frames`)から
 * 描き、2x で書き出した 1200×320 のフレーム。
 */
const COSMO_FRAMES: Media = {
	src: asset("/projects/cosmonote/story/07-frames.png"),
	width: 2400,
	height: 640,
	caption: "変化のない区間をまとめ、長くとどまった画面だけを読む",
	alt: "フレーム分析の流れ図。左に動画のフレームが十枚並び、似たものどうしが四つの束に括られている。中央には束ごとの滞在時間が78秒、42秒、19秒、3秒の横棒グラフで示され、上の3本だけが top 70% の括弧に入る。右には、その画面を OCR で読んだ箱がある",
};

/**
 * ノート生成のパイプラインの図。同じ手描きの決まりで Pencil 文書(`cosmo / 02 pipeline`)から
 * 描き、2x で書き出した 1200×320 のフレーム。
 */
const COSMO_PIPELINE: Media = {
	src: asset("/projects/cosmonote/story/08-pipeline.png"),
	width: 2400,
	height: 640,
	caption: "一度にやらせず、分けて任せる",
	alt: "ノート生成のパイプライン。タイムラインの文書が点線で括られた三つの段階 — 目次、本文、画像の配置 — を通り、推敲を経てノートになる。右下のハーネスが、その三段階の束へプロンプトをフィードバックする",
};

/**
 * コスモのノート、長い文。カードの二行が代わりに立っていた記録で、/projects/cosmonote に
 * 置かれる。画面はカードのギャラリー(COSMO_SCREENS)をそのままスライダーで送る。
 */
const cosmoStory: ProjectStoryContent = {
	tagline: "動画・PDF など授業資料の要約サービス",
	highlights: [
		"画面の中のスライドまで読んで、一つのタイムラインにまとめる",
		"ユーザー一人のために高性能マシンを24時間動かし続ける、という費用の課題を解決する",
		"フラッグシップモデルを高効率モデルに替えても、ノートの品質は保つ",
	],
	facts: [
		{ term: "参加人数", detail: "個人" },
		{ term: "開発期間", detail: "2025.05 ~ 現在" },
		{ term: "主な技術", detail: "Cloudflare Workers, R2, Containers" },
		{ term: "受賞", detail: "全国大学ソフトウェア成果共有フォーラム 最優秀賞" },
	],
	motivation: [
		"副専攻のクラウド学科は、授業のほとんどが動画講義で進みました。基礎科目はすでに知っている内容が大半なのに、試験と課題のために、知っている講義を最初から再生しておかなければなりませんでした。",
		"しばらくは講義の動画をダウンロードして、他社の要約サービスに入れて使っていました。試験の二週間前にまとめて使い、二か月は手も付けないのが学生の使い方なのに、月額制なので使わない日にも費用を払うことになります。動画を読み込むところから要約までを一度に終わらせながら、Pay As You Go の形のサービスを作ってみよう、というのがコスモのノートの始まりでした。",
	],
	steps: [
		{
			period: "2025.05",
			title: "コスモス ダウンローダー",
			images: [COSMO_STEP_SCREENS.downloader],
			paragraphs: [
				"最初は、講義の視聴画面の右にダウンロードボタンを追加するブラウザエクステンションを作りました。ボタンを押すとエクステンションが通信の内容を読み、ストリーミングファイルのアドレスをサーバーへ送ります。サーバーは ts のストリーミングファイルをダウンロードして mp4 にエンコードし、ダウンロードのリンクを返すという簡単な構造でした。",
				"エクステンションを作って配布し、コミュニティに投稿したところ、同じ大学の学生480人以上が「いいね」を押しました。ダウンロードしかできないプログラムにこれだけの反応があったということは、この不便が自分だけの問題ではない証拠でした。",
			],
		},
		{
			period: "2025.08",
			title: "要約機能の追加",
			images: [COSMO_STEP_SCREENS.summary],
			paragraphs: [
				"AI のノート生成機能を付け、ダウンロードボタンを講義のホーム画面へ移しました。ボタンを押すと、Cloudflare Browser でサーバーが直接講義サイトへアクセスするように変えました。ログインの手間は、エクステンションが渡してきたセッションキーをサーバー側のブラウザに注入することで省きました。",
				"エクステンションがやっていたことを、一つずつサーバーへ移しておく作業でした。エクステンションをなくし、完全にウェブサービスとして動くようにするのが目標でした。あわせて決済を連携し、収益化の仕組みも作ってみました。",
			],
		},
		{
			period: "2026.04",
			title: "エクステンションの廃止",
			images: [COSMO_STEP_SCREENS.webImport, COSMO_STEP_SCREENS.note],
			paragraphs: [
				"交換留学から戻ったあと、またサービスの更新を始めました。いちばん大きな目標は、ブラウザエクステンションを完全に取り除くことでした。ブラウザエクステンションはユーザーのブラウザへ深く入り込めるのが良いところですが、モバイルではまったく動かず、特定のブラウザに縛られるという問題があります。なにより、エクステンションを知っている人があまり多くありませんでした。",
				"そこで、ウェブサイトだけで動くように大きく作り直しました。学校サイトのログイン情報と講座の URL を受け取ると、Cloudflare Browser で直接ログインし、パケットを見て動画を探し当てる構造です。ソフトウェアは複雑になりバグも増えましたが、エクステンションをなくしたことで、使い勝手は比べものにならないほど良くなりました。",
			],
		},
		{
			period: "2026.09",
			title: "汎用の動画要約サイトへリニューアル",
			images: [COSMO_STEP_SCREENS.renewal],
			paragraphs: [
				"これまでの構造では、学校のサイトからしか動画を読み込めませんでした。成長の妨げでもありましたが、著作権のある学校の講義を加工してお金を受け取ることになるため、法的なリスクを避けようがありませんでした。",
				"売上が立ち始めて嬉しくはあったものの、学校サイトとの連携機能は廃止しました。ただ、このサービスの本質でもあるので完全には捨てきれず、エクステンションの形に戻しました。動画や録音、画像、文書を直接アップロードする方式へリニューアルして、いまの姿になりました。",
			],
		},
	],
	architecture: {
		label: "Architecture",
		items: [
			{
				title: "画面の中のスライドまで読んで、一つのタイムラインにまとめる",
				body: [
					"多くの講義要約サービスは、音声を STT で書き起こしてから、そのテキストを要約します。ところが授業の動画で肝心なものはプレゼンテーションの中にあることが多く、講師がそれを読み上げずに進む場合も少なくありません。スライドに出てきた数式や図表が、そのまま失われてしまいます。",
					COSMO_FRAMES,
					"そこでコスモのノートには、動画のフレームを分析するロジックを入れました。summarizer は ffmpeg を使ってフレームの変化を追います。フレームの変化率が5%未満なら同じフレームとみなし、同じフレームが続いた時間の長い順に並べます。そのうち上位70%のフレームに OCR をかけます。",
					"STT の結果と OCR の結果は、一つのタイムラインに統合します。最後にそのタイムラインを Worker へ渡し、あらかじめ調整したプロンプトで要約ノートを生成します。",
				],
			},
			{
				title: "ユーザー一人のために高性能マシンを24時間動かし続ける、という費用の課題を解決する",
				body: [
					"コスモのノートは ffmpeg で動画のフレームを処理しなければならないため、その瞬間だけは高性能なマシンが必要になります。高性能なインスタンスを常に立てておくと、誰も使っていない時間にも費用が発生します。そこで動画処理の機能にはサーバーレス構成を採り、費用を大きく削減しました。",
					COSMO_ARCHITECTURE,
					"Workers は最大 100MB までしかアップロードを受けられません。動画が 100MB 未満であることはほとんどないので、サーバーはバケットへ直接アップロードできる Presigned URL を発行してクライアントに渡します。ファイルはクライアントから R2 へ直接アップロードされます。",
					"アップロードされたファイルは estimator が検査します。壊れていないか、おかしなファイルではないかを確かめ、問題がなければサンプリングして費用を見積もります。ユーザーが見積額を決済して初めて、ノートの生成が始まります。見積もりより分析すべき量が多ければ損をすることもありますが、平均の費用に倍率を掛けることで、この問題を最小限に抑えました。",
					"この構造が、そのまま料金の仕組みになりました。2時間の動画でおよそ1,300ウォンです。他社のサービスが 3時間の動画を分析するのに月7,900ウォンを請求することを思えば、試験期間にまとめて使う学生にとっては理にかなった料金体系です。インフラもまた使った分だけ請求される構造なので、持続可能な仕組みです。",
				],
			},
			{
				title: "フラッグシップモデルを高効率モデルに替えても、ノートの品質は保つ",
				body: [
					"開発の初期には Claude のようなフラッグシップモデルを使っていました。プロンプトを詰めたりタイムラインを大きく整理したりしなくても満足のいく結果が出ましたが、ノート一本を生成するのにお金がかかりすぎました。2時間の動画を Claude で要約して 1,300ウォンというのは、慈善事業でもない限り、成り立ちません。",
					COSMO_PIPELINE,
					"いまは Gemini や DeepSeek のような、低コストで高効率なモデルを使っています。代わりに、一度にすべてをやらせるのではなく、目次の生成、本文の生成、画像の配置、推敲へとパイプラインを分けました。小さいモデルはとくにコンテキストが大きくなると品質が急に落ちますが、先に目次を作らせて一項目ずつ書かせるように仕事を分ければ、品質はそれほど落ちません。さらにプロンプトキャッシュによって、費用の一部も抑えられます。",
					"コンテキストのせいで品質が落ちる問題は解決できましたが、思考能力の差が問題でした。そこで Fable のようなフラッグシップモデルと、いまのパイプラインの結果を比べるハーネスを作り、定期的に走らせています。Fable ほどの性能は出ませんが、費用のわりに良い品質が出ています。",
				],
			},
		],
	},
	labels: {
		highlights: "Highlights",
		motivation: "Motivation",
		process: "History",
		back: "Projects",
	},
};

/**
 * enqor の構成図、四枚。コスモのものと同じ手描きの決まりで Pencil 文書から描き、
 * 2x で書き出した — 変えることになったら、コードではなくその文書を直す。
 */
const ENQOR_FIGURES = {
	billing: {
		src: asset("/projects/enqor/story/01-billing-timeline.png"),
		width: 2400,
		height: 1040,
		caption: "ping で定義した「安定した通話」",
		alt: "通話の課金シーケンス。発信者と受信者が両側に、サーバーが中央にいて、毎秒 ping が行き交うあいだサーバーが費用を請求し、ping が3回届かなくなると請求を止め、また届けば再開し、7回届かなくなると通話を終える",
	},
	balance: {
		src: asset("/projects/enqor/story/02-balance-session.png"),
		width: 2400,
		height: 1040,
		caption: "通話セッションの残高",
		alt: "残高の処理の構成図。通話が始まると DB のクラップ残高をロックし、redis のセッションへ複製する。残高は毎秒減り、チャージすれば増え、ギフトを贈れば減る。残り時間は残高から計算してクライアントへ返し、通話が終わると DB へ書き戻す",
	},
	docs: {
		src: asset("/projects/enqor/story/03-docs-to-code.png"),
		width: 2400,
		height: 600,
		caption: "企画書からコードまで",
		alt: "PDF の企画書と Figma のデザインを手作業で一つの Markdown にまとめ、その文書をエージェントがソースコードへ移していく流れ",
	},
	harness: {
		src: asset("/projects/enqor/story/04-harness-loop.png"),
		width: 2400,
		height: 640,
		caption: "先にウェブへ公開するハーネス",
		alt: "ハーネスの流れ図。エージェントが画面を expo web で公開すると、批判的なエージェントが Figma と照らして評価し、直すところがあればエージェントへ差し戻し、通ればアプリへ移す",
	},
} as const satisfies Record<string, Media>;

/**
 * enqor、長い文。/projects/enqor に置かれる。画面はカードのギャラリー(ENQOR_SCREENS)を
 * そのままスライダーで送る。日付ごとの履歴はないので History のセクションは外れる。
 *
 * Highlights の二行と architecture.items の二編は、順番まで同じ一つの並びだ — 片方だけ
 * 増やすと、行ごとに掛かっているアンカーがまとめて死ぬ。二編のあとの Retrospective は
 * その並びの外に立つ。どこまで検証するかは二編が一緒に残した言葉であって、そのうち
 * 一編の答えではない。
 */
const enqorStory: ProjectStoryContent = {
	tagline: "1:1 専門家相談サービス",
	highlights: [
		"安定して通話がつながったときだけ、秒単位で課金する",
		"AI の応答を人のボトルネックなしに検証する",
	],
	facts: [
		{ term: "参加人数", detail: "3名" },
		{ term: "開発期間", detail: "2026.04 ~ 現在" },
		{ term: "担当", detail: "アプリおよびサーバーの開発" },
		{ term: "主な技術", detail: "Agora（ストリーミング）、NestJS（GraphQL）、Expo" },
	],
	motivation: [
		"いまは悩みができると、まず ChatGPT に聞きます。ところが本当に気持ちが複雑なときは、AI 特有の、心のこもらない受け答えにすぐ疲れてしまい、医療や進学のように責任の伴う相談では、AI の答えをそのまま信じるのも難しいものでした。ある種の相談は、やはり人を相手にしなければ成り立ちません。",
		"医師のような専門家への相談から、恋愛経験の豊富な人に聞いてもらう軽い相談まで、自分が自信のある分野で他人の悩みを聞き、収益を得られる場が必要だと考えました。会話のプラットフォームを作るために Align Networks に加わり、アプリとサーバーの開発を担当しました。ただし enqor は、人が直接プログラミングしたわけではありません。企画書とデザインを AI エージェントが読める形にし、エージェントが出してきた成果物を検証する環境を作るのが、私の仕事でした。",
	],
	architecture: {
		label: "Architecture",
		items: [
			{
				title: "安定して通話がつながったときだけ、秒単位で課金する",
				body: [
					"enqor の中心にある機能は、映像・音声の通話です。ストリーミングは Agora を使ったので難しくありませんでしたが、課金のパイプラインは自分で作らなければならない課題でした。モバイルは通信の状態が悪くなることが多いだけに、正常につながっていた時間だけを課金の対象とし、しかも秒単位で請求しなければなりませんでした。",
					ENQOR_FIGURES.billing,
					"まず「安定した通話」とは何かを決めなければなりませんでした。これは、サーバーとクライアントがやり取りする ping で定義しました。どちらか一方でも ping が3回届かなければ接続に問題があると判断し、課金を止めます。7回届かなければ通話が切れたと判断し、セッションを終了させました。",
					"次の問題は、毎秒課金という要件です。はじめは通話時間の全体から不安定だった時間を引き、通話が終わったあとにデータベースを一度更新すればよいと考えていました。ところが、要件は思った以上に複雑でした。通話中にクラップをチャージできなければならず、チャージしたクラップで互いにギフトも贈れて、通話できる残り時間が20秒を切ればもうすぐ終わると知らせる必要もあります。チャージも消費も参照もすべてリアルタイムで行われるので、残りのクラップを読み書きの軽いどこかに置いて処理するのが簡単だと判断しました。",
					ENQOR_FIGURES.balance,
					"通話が始まると、発信者のクラップ残高を変更できないようにします。いまの残高を読んで redis の通話セッションへ複製しておくと、この値が発信者の使えるクラップの原本になります。毎秒この値を減らして課金し、チャージやギフトが発生すればこの値を更新し続けます。チャージは決済の記録を残さなければならないので、DB にも追加で残します。通話の残り時間も、この値をもとに計算してクライアントへ返します。通話が終わると、残った残高を DB に更新します。たった二回の DB 操作で、複雑なロジックを見通しよく実装できるようになりました。",
				],
			},
			{
				title: "AI の応答を人のボトルネックなしに検証する",
				body: [
					"企画チームが作ったファイルは、PDF の企画書と Figma のデザインファイルです。人が読んで直すには楽ですが、そのままエージェントへ渡しても、どの Figma ノードにどの説明が入っているのかが分かりません。そこで Figma のノードと PDF のページを自分で突き合わせて Markdown に書き起こし、ところどころにメモも入れてみました。",
					ENQOR_FIGURES.docs,
					"こうして仕上げた800行ほどの企画書を持たせて、AI エージェントにプロジェクトを最後まで完成させるよう指示しました。30分あまりでプロジェクトが一つ出てきましたが、動かしてみるとその結果はひどいものでした。ある程度は予想していたとはいえ、起動すらしないとは思っておらず、どうにか直してログイン画面まで入ると、Figma に定義されたデザインはまったく反映されていませんでした。ログインのような機能もすべてモックで、まるで体裁だけを整えたようなプロジェクトでした。",
					"この問題を顧問に打ち明けたところ、「ハーネスエンジニアリング」という概念を教わりました。インターネットで調べてみると「AI が正しく振る舞えるように環境を作ること」という曖昧な答えしか出てきませんでした。概念が完全に飲み込めたわけではありませんでしたが、顧問の助言どおりフック、批判的なレビュアー、テスターを一つずつ整えていくうちに、いつのまにか自分なりのハーネスができあがっていました。",
					"ハーネスでいちばん難しいのは「成功条件」を決めることです。たとえば Figma に宣言されたデザインどおりに実装できたかを判定するには、そのデザインと公開された画面が一致しているかを評価するロジックが要ります。はじめはアプリの画面をキャプチャして、単に似ているかどうかだけを見ていて、独立したサブエージェントがこの比較を担当していました。悪くはありませんでしたが、良い成果物とも言えません。あちこちでアイコンが違い、テキストの位置がずれていました。なにより、アプリの画面をキャプチャして Figma と照らし合わせる作業はとても遅く、トークンも多く使いました。",
					ENQOR_FIGURES.harness,
					"この問題は expo web で解決しました。まず作ろうとしている画面を expo web で公開すれば、headless ブラウザを開いて表示を難なく確かめられます。ウィンドウの大きさを変えるだけで、モバイルやタブレットの解像度で崩れる箇所があるかどうかもすぐ見えます。こうしてウェブで作り込んだコードをアプリへ移す、という順番に変えると、評価のコストはずっと下がりました。Figma とウェブに公開された画面がどれだけ近いかは、批判的なエージェントに判定させます。あわせて、アイコンを自分で生成できないようルールを入れ、Figma MCP に問題が起きて動かない場合はハーネスごと止まる preflight の手順も足しました。その結果、簡単な画面はほぼ完璧な水準で、複雑な画面も70%ほどの完成度で出てくるようになりました。",
				],
			},
		],
	},
	retrospective: {
		label: "Retrospective",
		paragraphs: [
			"今回の経験で、AI に適切な資料を渡し、適切な環境を整えれば、結果は確かに良くなるということが分かりました。そして AI が出した結果についても、「どうやって」検証するかより「どこまで」検証するかを考える方向が正しい、と感じました。",
			"金融、宇宙産業、防衛産業のように、事故が一度でも惨事になる領域では、すべてのコードを隅々まで検証しなければならないでしょう。しかし今回のプロジェクトのように、たいていはそうではありません。開発者は、AI がいま何をしていて、この仕事が終わったらどこまで検証すべきで、どのファイルが変わるはずなのか — そこまで把握できていれば十分だと考えています。そのなかでも単純な作業を AI がしているなら、何度か押してみてテストを終えてもいいし、中心のロジックなら設計まで念入りに議論すべきです。",
			"開発者が、コードを書く人から、判断して責任を負う人へ変わったということを、このプロジェクトで確かめました。",
		],
	},
	labels: {
		highlights: "Highlights",
		motivation: "Motivation",
		process: "History",
		back: "Projects",
	},
};

/**
 * HEALIX、長い文。/projects/healix に置かれる。画面はカードのギャラリー(HEALIX_SCREENS)を
 * そのままスライダーで送る。二か月のハッカソンの成果物なので、日付ごとの履歴も、別に立てる
 * 設計の話もない — Highlights と History が外れ、代わりに発表の動画が付く。
 */
const healixStory: ProjectStoryContent = {
	tagline: "症状にもとづいて病院を探すサービス",
	facts: [
		{ term: "参加人数", detail: "6名" },
		{ term: "開発期間", detail: "2024.07 ~ 2024.08" },
		{ term: "主な技術", detail: "ChatGPT API, NestJS" },
	],
	motivation: [
		"人はどこか具合が悪いとき、どの病院へ行けばいいのか分からないことが多いものです。すぐ思いつくところでも、熱の出る風邪なら内科へ行くのか耳鼻咽喉科へ行くのか分かりませんし、お尻のような馴染みのない部位が痛み出せば、その迷いはなおさら大きくなります。以前はインターネットで検索して適切な科を探し、地図で病院を探さなければなりませんでした。HEALIX は、この不便を解こうとして作られました。",
	],
	video: {
		label: "Video",
		youtubeId: "p3cPmhgZELg",
		title: "HEALIX のデモ動画",
	},
	labels: {
		highlights: "Highlights",
		motivation: "Motivation",
		process: "History",
		back: "Projects",
	},
};

/**
 * WATERFLAKE の構成図。コスモ・enqor のものと同じ手描きの決まりで Pencil 文書から描き、
 * 2x で書き出した 1200×320 のフレーム。
 */
const WATERFLAKE_ARCHITECTURE: Media = {
	src: asset("/projects/waterflake/story/01-tunnel.png"),
	width: 2400,
	height: 640,
	caption: "ドメインからゲームサーバーまで",
	alt: "WATERFLAKE の構成図。プレイヤーが test.example.com へ接続すると SRV レコードが 1.1.1.1 の 3000番ポートを指し、そのポートで動くトンネリングサーバーが Minecraft サーバーと TCP ソケット20本でつながっている",
};

/**
 * WATERFLAKE、長い文。/projects/waterflake に置かれる。画面はカードのギャラリー
 * (WATERFLAKE_SCREENS)をそのままスライダーで送る。日付ごとの履歴はないので History の
 * セクションは外れる。
 */
const waterflakeStory: ProjectStoryContent = {
	tagline: "かんたんな導入だけで Minecraft サーバーに接続用のドメインを発行する",
	highlights: [
		"SRV レコードで、サブドメインが特定の IP のポートを指すよう自動で設定する",
		"ゲームサーバーとトンネリングサーバーのあいだを TCP ソケットでトンネリングする",
	],
	facts: [
		{ term: "参加人数", detail: "個人" },
		{ term: "開発期間", detail: "2023.03 ~ 2023.05" },
		{ term: "主な技術", detail: "NestJS, Java" },
	],
	motivation: [
		"十年ほど前、Minecraft というゲームに夢中で、みんなと一緒に遊べるサーバーを立ててみることが何よりの目的でした。コンピューターのことなどまったく知らない小学生が、ブログの記事だけを読んで VPS サーバーを借り、Linux 環境でゲームサーバーを動かしました。そして複雑なネットワークの設定までやり遂げて、ついにサーバーを立てました。あのときの達成感は生涯でいちばんのもので、絶対に忘れられない記憶です。話を現在に戻すと、「複雑な手順なしに、かんたんにゲームサーバーを立てられる道具があったらどうだろう」という考えから始まりました。",
	],
	architecture: {
		label: "Architecture",
		items: [
			{
				// TODO(confirm): the source has no section title, so the two highlights
				// were stood up as one, as on the Korean build.
				title: "SRV レコードと TCP トンネリング",
				body: [
					WATERFLAKE_ARCHITECTURE,
					"ユーザーが私たちのウェブサービスでトンネルを作ると、Cloudflare API を通じて SRV レコードを生成します。そしてトンネリングを担う仮想マシンに、ランダムなポートでトンネリングサーバーを立てます。トンネリングサーバーは二つの接続を受け持ちます。一つは SRV レコードを通って入ってくる接続、もう一つは Minecraft サーバーの方へ出ていく接続です。この二つをパイプでつなぐことで、外から入ってきたパケットが自然に Minecraft サーバーへ出ていけます。ユーザーには、まるでドメインのアドレスを入れれば接続できるサーバーがあるように見えます。",
					"トンネリングサーバーとゲームサーバーのあいだの TCP トンネルは、20本のソケットで管理します。ゲームのプレイヤーがサーバーへ接続すると、このソケットのうち一本を占有します。プレイヤーがゲームサーバーを出るとそのソケットは破棄され、新しいソケットを作ります。この周期が繰り返されてソケットの本数が保たれます。幸い Minecraft サーバーの設定には最大の接続人数が決まっているので、その数だけソケットを管理すれば運用に問題はありませんでした。",
				],
			},
		],
	},
	labels: {
		highlights: "Highlights",
		motivation: "Motivation",
		process: "History",
		back: "Projects",
	},
};

export const projects: ProjectsContent = {
	label: "Projects",
	featured: [
		{
			period: "2025 ~ 現在",
			title: "コスモのノート",
			description: "たまった動画講義に早く追いつくための、動画の要約サービスです。音声だけでなく画面の中のスライドまで読み、月額制ではなく、使った分だけの従量課金にしました。",
			links: [{ label: "cosmonote.site", href: "https://cosmonote.site" }],
			// The gallery's first slide is the tile itself. It crops to 25:17, but the
			// headline and the floating cards all fall inside that box, and it is the
			// same picture that opens large when pressed.
			thumbnail: {
				src: asset("/projects/cosmonote/01-landing.png"),
				alt: "コスモのノートの最初の画面",
			},
			appIcon: { src: "/brand/cosmonote-icon.png", alt: "コスモのノートのアプリアイコン" },
			// The order is the service's own: 入って(ランディング・機能) → 作り(ノート) →
			// 覚え(クイズ・暗記カード、どちらも作る画面のあとに解く画面) → 分け合い(公開ノート)
			// → つなぐ(API). Paired screens stay adjacent so paging one step never
			// leaves a 作成 screen without the thing it made.
			gallery: COSMO_SCREENS,
			// The long form behind the title. The slider reuses the gallery above.
			slug: "cosmonote",
			story: cosmoStory,
		},
		{
			period: "2026 ~ 現在",
			title: "enqor",
			description: "リアルタイムの映像・音声による専門家相談サービスです。AI の応答を良くするためのハーネス、テストと複雑な課金機能の実装をめぐる、エンジニアリング上の工夫が詰まっています。",
			// Both builds point at the Korean storefront. An /app/id… URL with no
			// locale redirects to whatever storefront the reader is in, which is a
			// dead end wherever the app is not sold; the kr page stays readable
			// from anywhere.
			links: [
				{
					label: "App Store",
					href: "https://apps.apple.com/kr/app/%EC%97%94%EC%BD%94%EB%A5%B4-%EB%82%98%EB%A7%8C%EC%9D%84-%EC%9C%84%ED%95%9C-1-1-%EC%8B%A4%EC%8B%9C%EA%B0%84-%EC%A0%84%EB%AC%B8%EA%B0%80-%EC%83%81%EB%8B%B4/id6762182124",
				},
				{ label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.enqor.app" },
			],
			// A portrait capture becomes a band in a 25:17 tile. The only picture
			// composed landscape is the storefront's main image, and that is also
			// the gallery's first slide.
			thumbnail: {
				src: asset("/projects/enqor/01-poster.png"),
				alt: "enqor のストア用メイン画像",
			},
			appIcon: { src: "/brand/enqor-icon.png", alt: "enqor のアプリアイコン" },
			// 入って → 選び → 頼み → チャージして決済し → かけ → 受け → 話し → 残す。
			// 08 and 09 are the same nine seconds, shot from the calling and the
			// receiving side.
			gallery: ENQOR_SCREENS,
			slug: "enqor",
			story: enqorStory,
		},
	],
	archive: [
		{
			period: "2024",
			title: "HEALIX",
			description: "症状をもとに、最も近くて適した病院をすすめるサービスです。韓国の公共データポータルとアプリ内の GPS データを AI に渡すようにしました。",
			// Only the backend repository is public, so the row goes straight there
			// rather than opening a menu of one.
			links: [{ label: "Github", href: "https://github.com/bb2002/healix-backend" }],
			// The cover as it stands brings in the QR and the team credits, and its
			// wordmark collides with the next card's title. Only the phone mockup was
			// lifted out of it, at 205:141.
			thumbnail: {
				src: asset("/projects/healix/00-thumb-4ae26d2b.png"),
				alt: "HEALIX の画面。地図の下に近くの病院と予約の情報が並んでいる",
			},
			// Not a live app but a 2024 hackathon result. The deck is all that is
			// left, so it is cut to three slides: 表紙 → なぜ作ったか → どう使うか.
			gallery: HEALIX_SCREENS,
			// The long form behind the title. The slider reuses the gallery above.
			slug: "healix",
			story: healixStory,
		},
		{
			period: "2023",
			title: "WATERFLAKE",
			description: "かんたんな導入で、外部から接続できないゲームサーバーに接続用のドメインを発行するサービスです。TCP トンネリングと SRV レコードを軸にしています。",
			// Four repositories, so one row opens a menu rather than standing four
			// rows up on the card.
			links: [
				{
					label: "Github",
					items: [
						{ label: "waterflake-api", href: "https://github.com/bb2002/waterflake-api" },
						{ label: "waterflake-front", href: "https://github.com/bb2002/waterflake-front" },
						{ label: "waterflake-tunnel", href: "https://github.com/bb2002/waterflake-tunnel" },
						{ label: "waterflake-plugin", href: "https://github.com/bb2002/waterflake-plugin" },
					],
				},
			],
			thumbnail: {
				src: asset("/projects/waterflake/01-tunnel-create.png"),
				alt: "WATERFLAKE の画面。新しいトンネルを作るフォーム",
			},
			// トンネルを作り → アドレスとキーを受け取り → サーバーがつながる。The last
			// slide is the tunnelling success log, so paging through ends on the
			// domain the description promised actually being alive.
			gallery: WATERFLAKE_SCREENS,
			slug: "waterflake",
			story: waterflakeStory,
		},
		{
			period: "2018",
			title: "スクリーン翻訳機",
			description: "スマートフォンを振ると画面をキャプチャし、オーバーレイで訳文を見せます。中学生のときにはじめて作り、収益化まで実現しました。",
			// One repository, so the row goes straight there.
			links: [{ label: "Github", href: "https://github.com/bb2002/ProjectScreenTranslator" }],
			// All four are portrait, so a 205:141 tile would make a band of them. The
			// crop takes the game's logo together with the translation popup over it —
			// what the card's copy describes is visible inside the tile, and pressing
			// it opens on that same slide.
			thumbnail: {
				src: asset("/projects/screen-translator/00-thumb.jpg"),
				alt: "ゲームの画面の上に韓国語の訳文が重なっている",
			},
			// ゲームで使い → ウェブでも使い → そこで初めて、言語と振る強さをどこで直すのかを
			// 見せる。What the app does comes first; the settings come after.
			gallery: SCREEN_TRANSLATOR_SCREENS,
		},
	],
	gallery: {
		open: "画面を大きく見る",
		previous: "前の画面",
		next: "次の画面",
		close: "閉じる",
		pick: "画面を選ぶ",
	},
};

/* ------------------------------------------------------------------ *
 * Experience
 * ------------------------------------------------------------------ */

/**
 * bigint-migration の図、二枚。プロジェクトの構成図と同じ手描きの決まりで、Pencil 文書の
 * `bigint / 01 table` ・ `bigint / 02 trigger` のフレーム(1200×440, 1200×420)から描き、
 * 2x で書き出した — 変えることになったら、コードではなくその文書を直す。
 */
const BIGINT_TABLE: Media = {
	src: asset("/experience/bigint-migration/01-table.png"),
	width: 2400,
	height: 880,
	caption: "19億件のうち、実際に読まれるのは直近一か月分だけ",
	alt: "luckybox テーブルの図。id 列が INT で宣言されたまま、行が19億件積み上がっていて、上のほとんどの行は期限切れで読まれず、下の直近一か月分の行だけがリアルタイムに使われる。右のゲージは INT の最大値21億のうち19億まで埋まった状態で、残りの余裕が二か月ほどであることを示している",
};

const BIGINT_TRIGGER: Media = {
	src: asset("/experience/bigint-migration/02-trigger-12a883d63d8d.png"),
	width: 2400,
	height: 840,
	caption: "トリガーが PK を負数に差し替える流れ",
	alt: "トリガーの構成図。サーバーが INSERT すると BEFORE INSERT トリガーがシーケンステーブルから次の値 n を読んで id を -n に差し替え、luckybox テーブルには -1、-2 のような負数の id で保存される。アプリは SELECT でその値を読んでも INT の範囲内なので問題なく処理できる",
};

/**
 * realtime-redesign の図、二枚。上と同じ決まりで Pencil 文書の `realtime / 01 item` ・
 * `realtime / 02 open` のフレーム(1200×420, 1200×440)から描き、2x で書き出した。
 */
const REALTIME_ITEM: Media = {
	src: asset("/experience/realtime-redesign/01-item-6d1a661e4b30.png"),
	width: 2400,
	height: 700,
	caption: "パーティションキー一つに、箱を配列で",
	alt: "DynamoDB のアイテムの図。パーティションキーはユーザー一つにまとまり、その中の boxes 配列に id・cash・opened の値を持つ箱が並んでいる。API は新しい箱を配列に足し、箱を開けるとその項目にキャッシュを書き込む",
};

const REALTIME_OPEN: Media = {
	src: asset("/experience/realtime-redesign/02-open-267330550719.png"),
	width: 2400,
	height: 850,
	caption: "箱を開けるとき、三つのストレージを回る順番",
	alt: "箱を開ける流れ図。アプリが箱を開けるとサーバーが MySQL から設定を読み（read config）、Redis で高額当選の TTL フラグを確かめたあと（check ttl）、DynamoDB の箱を開封済みに変えて ZSET ランキングを更新する（set open & add rank）。最後にアプリへキャッシュが支給される",
};

/**
 * aws-cost の図。上と同じ決まりで Pencil 文書の `aws / 01 route53` のフレーム(1200×420)から
 * 描き、2x で書き出した。
 */
const AWS_ROUTE53: Media = {
	src: asset("/experience/aws-cost/01-route53.png"),
	width: 2400,
	height: 840,
	caption: "Route 53 の加重ルーティングで、トラフィックの10%だけを新しいインスタンスへ",
	alt: "トラフィック分配の構成図。ユーザーのリクエストが Route 53 に届くと、加重ルーティングで2つに分かれる。従来の Intel x86 インスタンスで動く Beanstalk が90%、同じ Dockerfile から arm64 のイメージをビルドして載せた Graviton インスタンスの Beanstalk が10%を受ける。Intel 側はピークに12台まで増える",
};

/**
 * api-memory の図。上と同じ決まりで Pencil 文書の `api / 01 leak` のフレーム(1200×440)から
 * 描き、2x で書き出した。
 */
const API_MEMORY_CHART: Media = {
	src: asset("/experience/api-memory/01-leak.png"),
	width: 2400,
	height: 880,
	caption: "インスタンス一台のメモリ、5日で 1GB から 32GB まで",
	alt: "折れ線グラフ。インスタンス一台のメモリ使用量が初日の 1GB から始まり、5日かけて 32GB の限界線まで上がって、そこで OOM により強制終了されたあと、再起動してまた 1GB から始まる",
};

export const experience: ExperienceContent = {
	label: "Experiences",
	company: {
		period: "2021.12 ~ 2023.12",
		/** Line break is intentional in the design. */
		name: "Nudge\nHealthcare",
		role: "Backend Engineer",
		teams: "Timespread・Linkareer チーム",
		logos: [
			{ src: "/brand/timespread.webp", alt: "Timespread のロゴ" },
			{ src: "/brand/linkareer.webp", alt: "Linkareer のロゴ" },
		],
	},
	highlights: [
		{
			slug: "bigint-migration",
			year: "2023",
			title: "19億件のテーブルをメンテナンス1時間以内にマイグレーション",
			subtitle: "移すデータに優先順位をつけ、いつでも戻せるマイグレーションスクリプトを用意しました。",
			body: [
				{ heading: "背景" },
				"Timespread にはランダムボックスという機能があります。広告を見ると、アプリ内通貨（キャッシュ）がランダムに入った箱が支給され、その箱を開けるとキャッシュが手に入る、という単純な機能でした。箱ひとつは luckybox テーブルの一行です。ユーザーが増えるにつれてこのテーブルには19億件が積み上がり、主キーが INT で宣言されていたため、上限の21億まで二か月ほどしか残っていない状態でした。このテーブルを、BIGINT で宣言した新しいテーブルへ移さなければなりませんでした。",
				{ heading: "一度目の試み" },
				"まず、サービスの特徴を調べました。箱は24時間で期限切れになり、ランキングを処理するバッチプログラムは直近一か月分のデータしか読んでいません。メンテナンス枠のうちにこのデータだけを移せば、サービスは立て直せるということです。",
				BIGINT_TABLE,
				"チームリーダーと話し合い、平日の深夜にサービスを1時間止めて、あらかじめ用意したマイグレーションスクリプトを実行することにしました。スクリプトには、以下の作業を順番に行わせます。",
				{
					items: [
						"既存のテーブルの名前を RENAME して、接続を切ります。",
						"新しいテーブルを BIGINT で作り直します。",
						"万一の重複を防ぐため、PK が22億から始まるようにします。",
						"一か月前のデータが何番の ID なのかを調べます。",
						"MySQL のプロシージャで、100件ずつバッチでデータをコピーします。",
					],
				},
				"スクリプトを書くうえでいちばん重視したのは「ロールバックできるか」でした。作業の途中で問題が起きればすぐ止められなければならず、進み具合も目で追えなければなりません。データの挿入はクエリ一本でも書けますが、それでは進み具合が分からず、途中で止めることもできないので、作業を細かく分けることにしました。",
				"マイグレーションは無事に進みました。一か月分のデータが入り、新しい箱は22億から作られ始めました。ところがどういうわけか、Android アプリでクラッシュが出はじめました。残りのメンテナンス時間が少なかったので、用意しておいた手順どおりロールバックし、サービスは以前の姿に戻りました。",
				{ heading: "原因" },
				"理由は単純でした。アプリの側でも ID を INT で扱っていたため、21億を超える値を処理できなかったのです。サーバーだけを直して済む問題ではありませんでした。別の方法を探さなければなりません。",
				{ heading: "二度目の試み" },
				"チームリーダーと解決策を話しているうちに、ふと INT には負の領域もあることを思い出しました。幸い unsigned で宣言されていなかったので、PK を負数で保存する方法について話し合いました。チームリーダーからも良い方法だと言ってもらい、すぐ作業に取りかかりました。",
				BIGINT_TRIGGER,
				"BEFORE INSERT トリガーを仕掛け、値が入ってくるときにシーケンステーブルから次の値を読んで、PK を負数に差し替えるようにしました。テストサーバーでサーバーもアプリも負数の PK を問題なく処理することを確かめ、深夜にトリガーを設置しました。",
				"その日から挿入されるすべてのデータの PK が負数で入るようになり、アプリの側でも問題は起きませんでした。この対応で目の前の障害を防ぎ、およそ二年分のリファクタリングの時間を稼ぎました。",
			],
		},
		{
			slug: "realtime-redesign",
			year: "2023",
			title: "毎分1,500件のリクエストを受けるサービスのリファクタリング",
			subtitle: "DynamoDB と Redis で設計し直し、6時間に一度更新されていたランキングをリアルタイムで動かしました。",
			body: [
				{ heading: "背景" },
				"先のマイグレーションで時間を稼いでから一年が過ぎました。そのあいだにアプリが ID を整数で扱っていたのを String に変え、その配信がユーザーの99%に届くまで待ちました。ちょうど運営チームから、ランダムボックスの確率調整まわりの機能が把握しづらいのでリニューアルしようという要望があり、代表の承認も下りて、ようやくリファクタリングに着手できました。",
				{ heading: "箱をどこに保存するか" },
				"まず、箱をどこに保存するかを考えました。以前の設計は箱をすべて MySQL に保存していたので、箱を作るたびに INSERT が、箱を開けるたびに UPDATE が飛んでいました。これを DynamoDB へ移し、パーティションキーでの読み書きが速いという長所を最大限に活かすことにしました。",
				REALTIME_ITEM,
				"箱ができたら配列に値を足し、箱を開けたらその項目だけを書き換えれば済みます。見た目は MySQL と変わりませんが、パーティションキー一つで参照して書き換えるので、処理はずっと速くなりました。また、ユーザーがその日はじめてアクセスしたときに、溜まっていたデータを消すようにして、以前のように値が際限なく増えることも防ぎました。",
				"新しくできた方針で、一人のユーザーが開けられる箱は最大20個までという制約もありました。この制約も、箱の length を数えるだけできれいに片付いたので、いっそう効率的でした。",
				{ heading: "ランキングと設定をどこに置くか" },
				"ランキングのシステムも新しく作り直しました。Redis の ZSET は、重複しないキーをスコア順に並べておき、順位の参照と更新は O(log n) の時間計算量で済みます。そして、高額当選者を一定の期間また当選しないように止める、という要件もありましたが、当選したユーザーの ID を TTL 付きで Redis に保存しておけば、データベースから当選履歴を引くまでもなく、簡単に片付けられました。",
				"当選確率などの設定値は MySQL に残しました。管理者コンソールとの連携を考える必要があったからです。箱を開けるたびに MySQL を一度読む必要はありますが、設定をリアルタイムに反映でき、参照するだけなので大きな負担ではないと判断しました。",
				REALTIME_OPEN,
				{ heading: "結果" },
				"できあがったシステムは、少しずつトラフィックを受けました。朝は10%ほどだけ受けながら様子を見て、問題がなかったので午後に100%へ上げました。MySQL の負荷は下がり、なによりランキングに活気が戻りました。6時間に一度更新されていた値が、リアルタイムに動いたからです。運営チームからも、当選確率の設定が楽になったと喜ばれました。",
				"問題を見つけてチームリーダーに報告した日から最後のリファクタリングまで、まるまる一年かかりました。自分の書いたコードが少しずつトラフィックを受け、100%まで配信されていくのを見守った経験は、開発の楽しさとして、いまも忘れられません。",
			],
		},
		{
			slug: "aws-cost",
			year: "2022",
			title: "月1,000万ウォンを超えていた AWS 費用を30%削減",
			subtitle: "安くて性能の良い Graviton インスタンスへ移し、インスタンスの増減ルールを組み直しました。",
			body: [
				{ heading: "背景" },
				"Timespread はサーバー費用として毎月1,000万ウォン近くを払っていました。チームリーダーから、この費用を削る方法を探してみようという話がありました。",
				{ heading: "どこに費用がかかっているか" },
				"Cost Management で確かめると、いちばん費用がかかっているのは三か所でした。",
				{ items: ["RDS", "Beanstalk (EC2)", "ネットワークトラフィック"] },
				"RDS はすでに負荷が高く手を入れる余地がなかったので、EC2 で削れるところを探しました。ちょうど ARM 系の Graviton インスタンスが新しく出ていて、同じ性能を20%ほど安く出せるという AWS の発表を見て、私たちのサービスに適用してみることにしました。",
				{ heading: "Graviton へ移す" },
				"まず Graviton インスタンスを一台作って、サーバーを立ててみました。OS のバージョンとアーキテクチャが変わったので従来のやり方では立ち上がりませんでしたが、幸い Dockerfile でビルドすると ARM アーキテクチャでも安定して動きました。そこで既存の CI/CD パイプラインを直し、GitHub Actions のクロスビルドで ARM のイメージを作らせ、Graviton インスタンスで回る Beanstalk を新しく作ってそのイメージを使わせました。",
				AWS_ROUTE53,
				"テストサーバーで QA チームと一緒にサーバーがきちんと動くかを確かめ、問題は何もありませんでした。Route 53 の重み付けルーティングで新しいサーバーへトラフィックの10%だけを流し、大きな問題が出なかったので、最終的にすべてのトラフィックを Graviton インスタンスが受けるようにしました。",
				{ heading: "インスタンスの増減ルールを組み直す" },
				"何日か経ってから、CPU 使用量のデータを見て時間帯ごとのスケールアウトのルールを調整しました。ピークタイムに最大12台まで増えていたインスタンスを8台に減らし、夜間は1台だけで回るようにしました。インスタンスの入れ替えとスケールルールの調整を合わせて、最終的に費用を30%ほど削ることができました。",
			],
		},
		{
			slug: "api-memory",
			year: "2022",
			title: "32GB を超えるメモリを占有して停止していた API サーバーの正常化",
			subtitle: "何のエラーも残さずメモリを使い切ってしまう問題を、本番サーバーのメモリダンプを取って突き止めました。",
			body: [
				{ heading: "背景" },
				"入社して4か月ほど経ったころのことです。マシンごとにメモリ使用量がおかしいほどばらばらでした。あるマシンは20GB以上を使っていて、またあるマシンは1GBほどしか使っていません。そして、ほとんどすべてのマシンが四日から五日ほど経つと強制的に終了され、再起動していました。",
				{ heading: "原因を探す" },
				"はじめは再起動のルールがあるのだと思いました。ほかのチームのバックエンドサーバーは、実際に週に一度マシンを再起動しているそうです。しかし、インスタンスがメモリを20GBずつ使っているのは、再起動のルールとは関係なく、何かがおかしい状態でした。",
				API_MEMORY_CHART,
				"何日か監視した結果、API サーバーのどこかでメモリリークが起きてインスタンスのメモリを使い切り、最後に OOM で強制停止されている、と分かりました。ところが Sentry にも AWS の監視ツールにも原因になりそうな痕跡が残らず、デバッグは難航しました。",
				{ heading: "メモリダンプを取る" },
				"チームリーダーから、本番サーバーでメモリダンプを取って調べてみてはどうかという案が出ました。正直、気は進みませんでした。ダンプを取るあいだにサービスの障害率が上がるかもしれませんし、持ってきたところで読み方が分からず、意味のある結果は見つけられないだろうと思ったからです。それでもほかに手がないので、ひとまずやってみることにしました。",
				"調べてみると、メモリダンプのツールがいくつか見つかりました。チームリーダーに共有し、本番サーバーへ直接つないで二つのツールでメモリをスキャンしました。一つ目のツールでは拾えるものがありませんでしたが、二つ目のツールで、同じエラーが何度も起きたとみられるダンプのログを見つけました。",
				{ heading: "原因と解決" },
				"数週間前に退職した開発者が、アプリへのプッシュ送信を並列に書き換えていたコードが問題でした。並列処理のためにスレッドを作るのですが、スレッドの中で exception が発生するとそのスレッドが回収されずに残り続け、メモリリークが積み上がっていたのです。スレッド内部の処理ロジックに try/catch を付けてデプロイし、その後はすべてのインスタンスが1GBほどしか使わない正常な状態に戻りました。",
				"はじめは解決策がどうしても思いつかず、気が重くなりました。結局は自分で開けて覗いてみれば、答えは思ったより近いところにあると学んだ作業でした。",
			],
		},
	],
	gallery: {
		open: "図を大きく見る",
		previous: "前の図",
		next: "次の図",
		close: "閉じる",
		pick: "図を選ぶ",
	},
};

/* ------------------------------------------------------------------ *
 * Certificates
 * ------------------------------------------------------------------ */

export const certificates: CertificatesContent = {
	label: "Certificates",
	gallery: {
		open: "証書を大きく見る",
		previous: "前のページ",
		next: "次のページ",
		close: "閉じる",
		pick: "ページを選ぶ",
	},
	items: [
		{
			period: "2026.02",
			title: "JLPT N1",
			host: "国際交流基金",
			image: { src: asset("/certificates/02-jlpt-n1-f09f16ac.jpg"), alt: "JLPT N1 の合格証" },
			gallery: [
				{
					src: asset("/certificates/02-jlpt-n1-f09f16ac.jpg"),
					width: 1400,
					height: 1988,
					caption: "JLPT N1",
					alt: "JLPT N1 の日本語能力認定書。生年月日と証書番号・受験番号は伏せてある",
				},
			],
		},
		{
			period: "2026.09",
			title: "情報処理技士",
			host: "韓国産業人力公団",
			image: { src: asset("/certificates/01-gisa-632fa275.jpg"), alt: "情報処理技士の資格証" },
			gallery: [
				{
					src: asset("/certificates/01-gisa-632fa275.jpg"),
					width: 1400,
					height: 1982,
					caption: "情報処理技士",
					alt: "韓国の国家技術資格証。生年月日と資格番号・管理番号は伏せてある",
				},
			],
		},
		{
			period: "2026",
			event: "第3回 全国大学ソフトウェア成果共有フォーラム",
			title: "最優秀賞 1位",
			detail: "東亜大学校 総長賞",
			description: "**コスモのノート**で、全国13チームが集まった大会で受賞しました。",
			links: [{ name: "コスモのノート", href: "/projects/cosmonote" }],
			// One award, two certificates. The card stands the 総長賞 up; opening it
			// pages through both.
			image: { src: asset("/certificates/01-chongjangsang-7e6f9199.jpg"), alt: "東亜大学校 総長賞の賞状" },
			gallery: [
				{
					src: asset("/certificates/01-chongjangsang-7e6f9199.jpg"),
					width: 1400,
					height: 1980,
					caption: "総長賞",
					alt: "東亜大学校 総長の名義で出された賞状",
				},
				{
					src: asset("/certificates/02-choiwoosusang-f026e085.jpg"),
					width: 1054,
					height: 1440,
					caption: "最優秀賞",
					alt: "東亜大学校 ソフトウェア革新センター長の名義で出された最優秀賞の賞状",
				},
			],
		},
		{
			period: "2024",
			event: "LIKELION 大学12期 中央ハッカソン",
			title: "最優秀賞 2位",
			detail: "ヨンリムウォンソフトラボ 特別賞",
			description: "**HEALIX**で、全国55校・1,500名あまりが集まった大会で受賞しました。",
			links: [{ name: "HEALIX", href: "/projects/healix" }],
			image: { src: asset("/certificates/03-likelion-e9406103.jpg"), alt: "ヨンリムウォンソフトラボ 特別賞の賞状" },
			gallery: [
				{
					src: asset("/certificates/03-likelion-e9406103.jpg"),
					width: 442,
					height: 585,
					caption: "最優秀賞",
					alt: "LIKELION 大学12期 中央ハッカソンの最優秀賞、ヨンリムウォンソフトラボ 特別賞の賞状",
				},
			],
		},
		{
			period: "2024",
			title: "国家優秀奨学金（理工系）",
			detail: "科学技術情報通信部長官 証書",
			description: "全国で約1,000名のみが選抜される国家優秀奨学金（理工系）を授与されました。",
			image: { src: "/mock/scholarship.svg", alt: "国家優秀奨学金（理工系）の証書" },
		},
		{
			period: "2025",
			title: "Daangn Builder’s Camp",
			detail: "Daangn 修了証",
			description: "Daangn が20名あまりを選抜する少数精鋭のハッカソンに選ばれました。",
			// Scan pending: an omitted `src` renders the design's placeholder tile.
			image: { alt: "Daangn ビルダーズキャンプの修了証" },
		},
	],
};

/* ------------------------------------------------------------------ *
 * Journey
 * ------------------------------------------------------------------ */

/**
 * タックスパック コミュニティの画面。2015年に残したキャプチャなので 600px のものしかなく、
 * ビューアもその大きさのまま見せる。入って(メイン) → 自分の掲示板 → 開設 → 新しい掲示板 →
 * イベント → ギャラリー型の掲示板 → 管理 と、サービスを一周する順に。
 */
// TODO(confirm): 택스팩 is romanised `taxpack` in the asset paths, so the name is
// transliterated rather than read as "texture pack" — an earlier draft of this
// file had テクスチャパック. Correct the katakana here if the name was never TaxPack.
const TAXPACK_SCREENS: readonly Media[] = [
	{
		src: asset("/journey/taxpack/01-home.png"),
		width: 600,
		height: 417,
		caption: "メイン画面",
		alt:
			"タックスパック コミュニティのメイン画面。緑の上部メニューの下に掲示板の一覧と最近の投稿、バナーが置かれている",
	},
	{
		src: asset("/journey/taxpack/02-boards.png"),
		width: 600,
		height: 348,
		caption: "自分の掲示板の一覧",
		alt: "あるユーザーが運営する掲示板の一覧。掲示板の名前と運営者、開設日が並んでいて、管理・閉鎖のボタンが付いている",
	},
	{
		src: asset("/journey/taxpack/03-create.png"),
		width: 600,
		height: 374,
		caption: "掲示板の開設",
		alt: "掲示板の開設フォーム。タイトルと種類、アドレスを入力してロゴをアップロードする画面",
	},
	{
		src: asset("/journey/taxpack/04-new-board.png"),
		width: 600,
		height: 466,
		caption: "作ったばかりの掲示板",
		alt: "開設されたばかりの掲示板。ロゴを登録するよう促す案内の下に、お知らせと掲示板の一覧が空のまま並んでいる",
	},
	{
		src: asset("/journey/taxpack/05-event.png"),
		width: 600,
		height: 563,
		caption: "イベントの管理",
		alt: "イベントの一覧と追加フォーム。タイトルと実施の日付、オンオフのスイッチ、記事のエディタがある",
	},
	{
		src: asset("/journey/taxpack/06-gallery.png"),
		width: 600,
		height: 480,
		caption: "ギャラリー型の掲示板",
		alt: "あるユーザーが開いた Photoshop のギャラリー掲示板。天気のウィジェットの下に絵がタイルで並んでいる",
	},
	{
		src: asset("/journey/taxpack/07-admin.png"),
		width: 600,
		height: 635,
		caption: "掲示板の管理",
		alt: "掲示板の管理画面。ロゴの登録、掲示板の種類と名前の変更、会員数とブラックリストの管理が一つのページにある",
	},
];

/** 小学校の卒業式の写真、一枚。ステージの画面に、将来の夢がコンピュータープログラマーと書かれている。 */
const DREAM_PHOTOS: readonly Media[] = [
	{
		src: asset("/journey/dream/01-note.jpg"),
		width: 2000,
		height: 1125,
		caption: "2015年2月、小学校の卒業式",
		alt: "卒業式のステージの画面を撮った写真。「卒業おめでとうございます」の下に、進学する学校とともに、将来の夢がコンピュータープログラマーと書かれている",
	},
];

/**
 * MyRunnerGame の画面。2020年8月に携帯で撮った 20:9 のキャプチャをそのまま使う。
 * タイトル → 操作方法 → プレイ → 結果 → ランキングと、一戦を回る順に。
 */
const MYRUNNER_SCREENS: readonly Media[] = [
	{
		src: asset("/journey/myrunnergame/01-title.jpg"),
		width: 2400,
		height: 1080,
		caption: "タイトル画面",
		alt: "MyRunnerGame のタイトル画面。畳の部屋を背景に、シングルプレイ・1対1マッチ・ランキング・クレジットのメニューと、ニックネームの入力、チュートリアルのボタンがある",
	},
	{
		src: asset("/journey/myrunnergame/02-tutorial.jpg"),
		width: 2400,
		height: 1080,
		caption: "操作方法",
		alt: "操作方法の画面。左から右へスライドすると右へ、右から左へスライドすると左へ動くという案内",
	},
	{
		src: asset("/journey/myrunnergame/03-play.jpg"),
		width: 2400,
		height: 1080,
		caption: "プレイ",
		alt: "プレイ画面。市街地の道路を走るキャラクターの前にゴミ箱の障害物があり、左上でスコアが上がっていく",
	},
	{
		src: asset("/journey/myrunnergame/04-result.jpg"),
		width: 2400,
		height: 1080,
		caption: "結果",
		alt: "結果の画面。倒れたキャラクターの上に、スコア152、ランキング12位、プレイ記録が表示されている",
	},
	{
		src: asset("/journey/myrunnergame/05-ranking.jpg"),
		width: 2400,
		height: 1080,
		caption: "ランキング",
		alt: "ランキングの画面。ニックネームとスコア、日付が順位どおりに10行並んでいる",
	},
];

/**
 * VR ゲーム二編のプレイ動画。ポスターと一緒に R2 の journey/videos にある。ギャラリーで
 * 動画はいつも最後の一枚だ — 画面を先に送ってみて、最後に流す。
 */
const JOURNEY_VIDEO = asset("/journey/videos");

/**
 * VRTetris の VR 画面三枚とプレイ動画。元のキャプチャは両眼が並んだステレオなので、左目の
 * 半分だけを切り出して使った — 1154×1154。動画はいつも最後に置く。
 */
const VRTETRIS_SCREENS: readonly Media[] = [
	{
		src: asset("/journey/vrtetris/01-lobby.jpg"),
		width: 1154,
		height: 1154,
		caption: "ロビー",
		alt: "VRTetris のロビー。海の上の木の板に TETRIS のロゴとニックネームの入力欄、仮想キーボードが浮かんでいる",
	},
	{
		src: asset("/journey/vrtetris/02-play.jpg"),
		width: 1154,
		height: 1154,
		caption: "プレイ",
		alt: "VRTetris のプレイ画面。夕焼けの野原に立てられた緑の板の中にブロックが積まれ、左にスコア 2,290 が出ている",
	},
	{
		src: asset("/journey/vrtetris/03-result.jpg"),
		width: 1154,
		height: 1154,
		caption: "結果とランキング",
		alt: "VRTetris の結果の画面。自分のスコアと、グローバル・ローカルのランキングの板が野原に立っている",
	},
	{
		video: `${JOURNEY_VIDEO}/vrtetris.mp4`,
		src: asset("/journey/videos/vrtetris-poster.jpg"),
		width: 1280,
		height: 720,
		caption: "プレイ動画",
		alt: "VRTetris のプレイ動画。海辺のロビーでニックネームを入れて始めると、砂漠に立てられた板に VR のコントローラーでブロックを落とし、列を消してスコアを上げる",
	},
];

/**
 * Tooth の画面、六枚。2019年のキャプチャなので 700px 前後だ。ロビー → 島の全景 → ブロック →
 * キューブ → レベルの案内 → ゲームオーバーと、一戦を回る順に。
 */
const TOOTH_SCREENS: readonly Media[] = [
	{
		src: asset("/journey/tooth/01-lobby.jpg"),
		width: 1238,
		height: 605,
		caption: "ロビー",
		alt: "Tooth のロビー。Tooth のロゴの下に名前の入力と PLAY ボタン、EASY から EXPERT までの難易度の選択があり、横にサーバーのランキングと自分のランキングの板がある",
	},
	{
		src: asset("/journey/tooth/02-island.jpg"),
		width: 831,
		height: 720,
		caption: "島の全景",
		alt: "海の上に浮かぶ草地の島と、その上のブロックの山、空に浮かぶキューブを見下ろした全景",
	},
	{
		src: asset("/journey/tooth/03-blocks.jpg"),
		width: 747,
		height: 710,
		caption: "ブロック",
		alt: "島の上にびっしりと置かれた赤紫のブロックと木、柵を近くから見た画面",
	},
	{
		src: asset("/journey/tooth/04-cube.jpg"),
		width: 744,
		height: 706,
		caption: "キューブ",
		alt: "暗い空に浮かぶブロックのキューブ。マスごとに色の違うブロックが積まれている",
	},
	{
		src: asset("/journey/tooth/05-level.jpg"),
		width: 745,
		height: 705,
		caption: "レベルの案内",
		alt: "雲のかかった空の上に LEVEL: HARD、STAGE: 2 Lv と出ている画面",
	},
	{
		src: asset("/journey/tooth/06-game-over.jpg"),
		width: 738,
		height: 702,
		caption: "ゲームオーバー",
		alt: "GAME OVER の画面。スコア 180、レベル 6 と HOME ボタンがある",
	},
];

/**
 * Unrevived の画面四枚とプレイ動画。銃を持った二枚はステレオのキャプチャの左目の半分なので
 * 480px しかない。動画はいつも最後に置く。
 */
const UNREVIVED_SCREENS: readonly Media[] = [
	{
		src: asset("/journey/unrevived/01-lobby.jpg"),
		width: 1235,
		height: 673,
		caption: "ロビー",
		alt:
			"Unrevived のロビー。遺跡のあいだに浮かぶ板に unrevived のロゴと名前の入力欄、マップの選択と仮想キーボードがある",
	},
	{
		src: asset("/journey/unrevived/02-village.jpg"),
		width: 1271,
		height: 711,
		caption: "村",
		alt: "月の出た夕方の中世風の村。石畳の上にキャラクターが一人立っている",
	},
	{
		src: asset("/journey/unrevived/03-pistol.jpg"),
		width: 480,
		height: 479,
		caption: "拳銃",
		alt: "拳銃を持った一人称視点。銃の横に Pistol という名前と、残りの弾数 100 が出ている",
	},
	{
		src: asset("/journey/unrevived/04-smg.jpg"),
		width: 480,
		height: 479,
		caption: "サブマシンガン",
		alt: "夕焼けの街で SMG11 を持った一人称視点。弾数 261 と 30 が出ている",
	},
	{
		video: `${JOURNEY_VIDEO}/unrevived.mp4`,
		src: asset("/journey/videos/unrevived-poster.jpg"),
		width: 1280,
		height: 720,
		caption: "プレイ動画",
		alt: "Unrevived のプレイ動画。廃墟になった遺跡のあいだを VR で歩き回り、SMG で敵を撃つ一人称シューティングゲーム",
	},
];

/**
 * KNU コーディングプラットフォームの画面、六枚。2021年の 1800×1080 のキャプチャそのまま。
 * ホーム → お知らせ → 大会 → 問題を解く → 達成度 → 役割と、大会を一つ開く順に。
 */
const CODEDURI_SCREENS: readonly Media[] = [
	{
		src: asset("/journey/codeduri/01-home.png"),
		width: 1800,
		height: 1080,
		caption: "ホーム",
		alt: "KNU コーディングプラットフォームのホーム。お知らせと FAQ の箱の下にプログラミングコンテストのカードが三枚置かれていて、下に江原大学校のフッターがある",
	},
	{
		src: asset("/journey/codeduri/02-notice.png"),
		width: 1800,
		height: 1080,
		caption: "お知らせ",
		alt:
			"お知らせの記事を一つ開いた画面。お知らせ・FAQ・全講座・コンテストのタブの下に、タイトルと書いた人、本文がある",
	},
	{
		src: asset("/journey/codeduri/03-contest.png"),
		width: 1800,
		height: 1080,
		caption: "大会のページ",
		alt: "江原大コーディングコンテストのページ。じゃがいもの写真のバナーの下に、大会の紹介・問題・達成度・役割・Q&A のタブがあり、Overview と Introduction、教員とお知らせの欄が続く",
	},
	{
		src: asset("/journey/codeduri/04-problem.png"),
		width: 1800,
		height: 1080,
		caption: "問題を解く",
		alt: "問題を解く画面。左に問題の説明と制約、入出力の例があり、右の暗いコードエディタに答えを書いて提出する",
	},
	{
		src: asset("/journey/codeduri/05-scores.png"),
		width: 1800,
		height: 1080,
		caption: "達成度",
		alt: "大会の達成度の画面。バナーの下に問題ごとの通過の可否が緑の印で出ていて、参加者ごとに点数と順位が表にまとまっている",
	},
	{
		src: asset("/journey/codeduri/06-roles.png"),
		width: 1800,
		height: 1080,
		caption: "役割の管理",
		alt: "大会の役割のページ。参加者を検索して、学籍番号と学科、名前ごとに役割を割り当てる表",
	},
];

/**
 * The trunk carries the chapters — where I was — and each chapter branches
 * into what actually happened there. A chapter head is the place itself, so an
 * enrolment is never repeated as an event under it; a graduation is, but only
 * where it is the turn that the next chapter came out of.
 */
export const journey: JourneyContent = {
	label: "Journey",
	chapters: [
		{
			period: "2013 – 2018",
			title: "小・中学校",
			events: [
				{
					year: "2014",
					title: "Linux 環境で Minecraft の24時間サーバーを構築",
					featured: true,
					detail: "VPS を借りてサーバーを構築し、最大同時接続数120人を達成しました。",
				},
				{
					year: "2015",
					title: "小学校 卒業",
					detail: "**将来の夢**にコンピュータープログラマーと書き、それがいまも続いています。",
					links: [{ name: "将来の夢", gallery: DREAM_PHOTOS }],
				},
				{
					year: "2015",
					title: "**タックスパック コミュニティ**の開発",
					featured: true,
					detail: "PHP で動く小規模コミュニティのサービスを開発し、登録者100人あまりを集めました。",
					links: [{ name: "タックスパック コミュニティ", gallery: TAXPACK_SCREENS }],
				},
				{
					year: "2017",
					title: "**スクリーン翻訳機**の開発",
					featured: true,
					detail: "スマートフォンを振ると画面の上に翻訳のオーバーレイを出すアプリを開発し、1,000ダウンロードと収益化を経験しました。",
					links: [{ name: "スクリーン翻訳機", gallery: SCREEN_TRANSLATOR_SCREENS }],
				},
			],
		},
		{
			period: "2018 – 2021",
			title: "善隣インターネット高等学校",
			subtitle: "ソフトウェア科",
			events: [
				{
					year: "2018",
					title: "モバイルコンテンツコンテスト 受賞",
					detail: "**スクリーン翻訳機**により、校内大会で2位に入賞しました。",
					links: [{ name: "スクリーン翻訳機", gallery: SCREEN_TRANSLATOR_SCREENS }],
				},
				{
					year: "2019",
					title: "VR ゲームの開発",
					featured: true,
					detail: "Unreal Engine を使って **VRTetris**、**Tooth**、**Unrevived** の VR ゲームを開発しました。",
					links: [
						{ name: "VRTetris", gallery: VRTETRIS_SCREENS },
						{ name: "Tooth", gallery: TOOTH_SCREENS },
						{ name: "Unrevived", gallery: UNREVIVED_SCREENS },
					],
				},
				{
					year: "2020",
					title: "モバイルゲームの開発",
					featured: true,
					detail: "Unreal Engine を使って **MyRunnerGame** のモバイルゲームを開発しました。",
					links: [{ name: "MyRunnerGame", gallery: MYRUNNER_SCREENS }],
				},
			],
		},
		{
			period: "2021",
			title: "江原大学校",
			subtitle: "コンピュータ工学科",
			events: [
				{
					year: "2021",
					title: "**KNU コーディングプラットフォーム**の開発",
					detail:
						"江原大学校 SW 中心大学事業団が進めたコーディングプラットフォーム構築事業で、チームリーダーを務めました。",
					links: [{ name: "KNU コーディングプラットフォーム", gallery: CODEDURI_SCREENS }],
				},
			],
		},
		{
			period: "2021.12 – 2023.12",
			title: "Nudge Healthcare",
			subtitle: "Backend Engineer\nTimespread・Linkareer チーム",
			events: [
				{
					year: "2022",
					title: "32GB を超えるメモリを占有して停止していた API サーバーの正常化",
					detail:
						"何のエラーも残さずメモリを使い切ってしまう問題を、本番サーバーのメモリダンプを取って突き止めました。",
				},
				{
					year: "2022",
					title: "月1,000万ウォンを超えていた AWS 費用を30%削減",
					detail: "安くて性能の良い Graviton インスタンスへ移し、インスタンスの増減ルールを組み直しました。",
				},
				{
					year: "2023",
					title: "19億件のテーブルをメンテナンス1時間以内にマイグレーション",
					featured: true,
					detail: "移すデータに優先順位をつけ、いつでも戻せるマイグレーションスクリプトを用意しました。",
				},
				{
					year: "2023",
					title: "毎分1,500件のリクエストを受けるサービスのリファクタリング",
					featured: true,
					detail: "DynamoDB と Redis で設計し直し、6時間に一度更新されていたランキングをリアルタイムで動かしました。",
				},
			],
		},
		{
			period: "2024 – 現在",
			title: "江原大学校",
			subtitle: "コンピュータ工学科",
			events: [
				{
					year: "2024",
					title: "LIKELION 大学12期 中央ハッカソン 2位",
					detail: "**HEALIX**で、全国55校・1,500名あまりが集まった大会で受賞しました。",
					links: [{ name: "HEALIX", href: "/projects/healix" }],
				},
				{
					year: "2024",
					title: "国際交流センターのバディプログラム",
					detail:
						"日本から来た交換留学生を一人受け持ち、学校生活を支え、サークルで良い思い出をつくれるよう手伝いました。",
				},
				{
					year: "2025",
					title: "国家優秀奨学金（理工系）",
					detail: "全国で約1,000名のみが選抜される国家優秀奨学金（理工系）を授与されました。",
				},
				{
					year: "2025",
					title: "日本 鳥取大学へ交換留学",
					featured: true,
					detail: "日本での実際の暮らしを体験し、茶道部で伝統文化を学びました。",
				},
				{
					year: "2026",
					title: "第3回 全国大学ソフトウェア成果共有フォーラム 1位",
					featured: true,
					detail: "**コスモのノート**で、全国13チームが集まった大会で受賞しました。",
					links: [{ name: "コスモのノート", href: "/projects/cosmonote" }],
				},
				{
					year: "2026",
					title: "Align Networks リードエンジニア",
					detail: "**enqor** プロジェクトの開発全体を担当しています。",
					links: [{ name: "enqor", href: "/projects/enqor" }],
				},
			],
		},
	],
	gallery: {
		open: "写真を大きく見る",
		previous: "前の写真",
		next: "次の写真",
		close: "閉じる",
		pick: "写真を選ぶ",
	},
};
