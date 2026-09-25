/**
 * Copy and asset paths for the Japanese build — the Korean content file
 * (apps/kr/src/content/portfolio.ts) translated line for line: the same facts,
 * in the same order, with the sections composed the same way. Screenshots,
 * scans and recordings are the same files served from the same bucket through
 * `asset()`; only the copy around them is Japanese. Brand marks and what is left
 * of the stand-in art under /public/mock stay on the Worker.
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
	// so the line says ユーザーの rather than 使う — the number is not current users.
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
			caption: "Nudge Healthcare Timespread・Linkareer チームのバックエンド",
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
				{ emphasis: "HEALIX、", detail: "1,500人規模の全国ハッカソンで2位を獲得", href: "/projects/healix" },
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
 * 코스모의 노트 화면, 서비스를 훑는 순서대로. All nine are 1537×763 captures of
 * the live site — the size is declared so the viewer reserves the right box
 * before the file lands. The caption is what the screen is; `alt` is what is
 * on it, for a reader who cannot see either.
 */
const COSMO_SCREENS: readonly Media[] = [
	{
		src: asset("/projects/cosmonote/01-landing.png"),
		width: 1537,
		height: 763,
		caption: "ランディング",
		alt: "コスモのノートのトップ画面。「動画講義に振り回されないでください」という文言の横に、要約ノート・クイズ・スクリプトのカードが浮かんでいる",
	},
	{
		src: asset("/projects/cosmonote/02-features.png"),
		width: 1537,
		height: 763,
		caption: "機能",
		alt: "機能紹介の画面。要約ノート、動画タイムライン、クイズ自動生成、暗記カード、コメントをカードで並べている",
	},
	{
		src: asset("/projects/cosmonote/03-note.png"),
		width: 1537,
		height: 763,
		caption: "要約ノート",
		alt: "ノート画面。左に講義動画とタイムライン、右に EC2 インスタンスのデプロイ実習をまとめた要約ノートがある",
	},
	{
		src: asset("/projects/cosmonote/04-quiz-create.png"),
		width: 1537,
		height: 763,
		caption: "クイズを作る",
		alt: "クイズ作成のダイアログ。問題数と、選択式・短答式などの問題形式を選んでいるところ",
	},
	{
		src: asset("/projects/cosmonote/05-quiz-solve.png"),
		width: 1537,
		height: 763,
		caption: "クイズを解く",
		alt: "クイズの解答画面。10問中1問目を解いていて、進捗率と一時保存の状態が見える",
	},
	{
		src: asset("/projects/cosmonote/06-flashcard-create.png"),
		width: 1537,
		height: 763,
		caption: "暗記カードを作る",
		alt: "暗記カード作成のダイアログ。ノートの内容から自動生成するか、空のカードから始めるかを選ぶ",
	},
	{
		src: asset("/projects/cosmonote/07-flashcard-study.png"),
		width: 1537,
		height: 763,
		caption: "暗記カードで学習",
		alt: "暗記カードの学習画面。25枚のデッキの1枚目と、知ってる・知らない・スキップの集計がある",
	},
	{
		src: asset("/projects/cosmonote/08-public-notes.png"),
		width: 1537,
		height: 763,
		caption: "公開ノート",
		alt: "公開ノートを探す画面。検索窓の下に、他の人が公開したノートがカードで並んでいる",
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
 * WATERFLAKE 화면, 터널 하나가 생겨서 붙기까지의 순서대로. 1280×654 / 1502×768 /
 * 1052×513 로 비율이 제각각이라 각자 자기 크기를 들고 간다. 뷰어에는 글이 없다 —
 * 긴 글은 /projects/waterflake 에 있다.
 */
const WATERFLAKE_SCREENS: readonly Media[] = [
	{
		src: asset("/projects/waterflake/01-tunnel-create.png"),
		width: 1280,
		height: 654,
		caption: "トンネルを作る",
		alt: "WATERFLAKE の管理画面。サーバー名とマインクラフト Java Edition、サブドメインとリージョンを入力してトンネルを作るフォーム",
	},
	{
		src: asset("/projects/waterflake/02-overview.png"),
		width: 1502,
		height: 768,
		caption: "トンネルのダッシュボード",
		alt: "トンネルの概要画面。発行された接続アドレスと接続状態、プラグインが使うキーのペア、トラフィック使用量が見える",
	},
	{
		src: asset("/projects/waterflake/03-server-connect.png"),
		width: 1052,
		height: 513,
		caption: "サーバー接続",
		alt: "ゲームサーバーのコンソール。プラグインがトンネルを20本開き、トンネリングに成功して、発行されたドメインにつながった",
	},
];

/**
 * enqor 화면, 대화 한 통이 성사되기까지의 순서대로. 01 은 스토어 대표 이미지로,
 * 카드 타일이 그대로 갤러리의 첫 장이 된다. 가운데 아홉 장은 1080×2400 세로
 * 캡처라 뷰어가 높이로 잡아 주고, 10 만 두 대를 나란히 찍은 실물 사진이라 가로다.
 */
const ENQOR_SCREENS: readonly Media[] = [
	{
		src: asset("/projects/enqor/01-poster.png"),
		width: 1024,
		height: 500,
		caption: "enqor",
		alt: "enqor のストア用メイン画像。「私の平凡さが輝く瞬間」という文言の下に、アプリ画面を映したスマートフォンが2台置かれている",
	},
	{
		src: asset("/projects/enqor/02-login.jpg"),
		width: 1080,
		height: 2400,
		caption: "ログイン",
		alt: "enqor のログイン画面。電話番号と Google、カカオトークのログインボタンがある",
	},
	{
		src: asset("/projects/enqor/03-home.jpg"),
		width: 1080,
		height: 2400,
		caption: "専門家を探す",
		alt: "ホーム画面。テーマ別の専門家カードが横に並び、その下に自分とつながった専門家と、今話せる専門家がいる",
	},
	{
		src: asset("/projects/enqor/04-profile.jpg"),
		width: 1080,
		height: 2400,
		caption: "専門家のプロフィール",
		alt: "専門家のプロフィール画面。認証タイトルとハッシュタグが付いていて、下に会話リクエストのボタンがある",
	},
	{
		src: asset("/projects/enqor/05-request.jpg"),
		width: 1080,
		height: 2400,
		caption: "会話リクエスト",
		alt: "会話リクエストのシート。保有クラップと1秒あたりの接続費用を示し、ビデオか音声かを選ばせる",
	},
	{
		src: asset("/projects/enqor/06-clap-station.jpg"),
		width: 1080,
		height: 2400,
		caption: "クラップのチャージ",
		alt: "クラップステーション。500クラップから25,000クラップまでのパックが、価格と割引率とともに並んでいる",
	},
	{
		src: asset("/projects/enqor/07-payment.jpg"),
		width: 1080,
		height: 2400,
		caption: "決済",
		alt: "Google Play のアプリ内決済シート。5,000クラップの商品と支払い方法が表示されている",
	},
	{
		src: asset("/projects/enqor/08-connecting.jpg"),
		width: 1080,
		height: 2400,
		caption: "接続中",
		alt: "発信側の画面。カメラがあらかじめ開いたまま会話の接続中と表示され、残り時間と保有クラップが見える",
	},
	{
		src: asset("/projects/enqor/09-incoming.jpg"),
		width: 1080,
		height: 2220,
		caption: "リクエストの受信",
		alt: "受信側の画面。相手の認証タイトルとハッシュタグが付いたリクエストカードに、拒否と承諾のボタンがある",
	},
	{
		src: asset("/projects/enqor/10-call.jpg"),
		width: 2000,
		height: 1500,
		caption: "通話",
		alt: "スマートフォン2台を並べて、実際にビデオ通話をしている写真。両方の画面に互いのカメラ映像が映っている",
	},
	{
		src: asset("/projects/enqor/11-review.jpg"),
		width: 1080,
		height: 2400,
		caption: "レビュー",
		alt: "会話が終わった後のレビュー画面。通話時間と5段階の評価、良かった点を選ぶタグがある",
	},
];

/**
 * HEALIX, 해커톤 발표자료에서 고른 세 장. 앱 화면은 슬라이드 안에 300px 남짓한
 * 목업으로 박혀 있어 떼어 내면 뷰어에서 뭉갠다 — 슬라이드째로 쓰되, 발표 순서가
 * 아니라 이야기 순서로 놓았다.
 *
 * 표지에서는 QR 을 지웠고, 본문 두 장은 진행 막대와 덱 내비게이션이 붙어 있던
 * 위쪽 52px 을 잘라 냈다. 덱의 껍데기지 내용이 아니라서 652 로 낮아졌다. 뷰어에는
 * 글이 없다 — 긴 글은 /projects/healix 에 있다.
 */
const HEALIX_SCREENS: readonly Media[] = [
	{
		src: asset("/projects/healix/01-cover-5badd1f3.png"),
		width: 1244,
		height: 701,
		caption: "HEALIX",
		alt: "HEALIX の発表資料の表紙。「症状の分析から近くの病院まで」という文言の横に、近くの病院と予約情報を表示したスマートフォンが置かれている",
	},
	{
		src: asset("/projects/healix/02-background-1e2c9b10.png"),
		width: 1244,
		height: 652,
		caption: "企画の背景",
		alt: "企画の背景のスライド。痛みを自分で検索してみる画面と、途切れずに続く検索数のグラフで課題を示している",
	},
	{
		src: asset("/projects/healix/03-flow-fb243485.png"),
		width: 1244,
		height: 652,
		caption: "症状の入力と病院の予約",
		alt: "サービスの流れのスライド。部位を選んで症状を書く画面と、分析結果からすぐに近くの病院を予約する画面が並んでいる",
	},
];

/**
 * 스크린 번역기 화면, 하는 일을 먼저 보여 주고 손잡이를 나중에 여는 순서대로.
 * 2018년 안드로이드 앱이라 넷 다 세로 캡처고, 뷰어가 높이로 잡아 준다.
 *
 * 페이지가 따로 없는 프로젝트라 짧은 글은 뷰어 패널에 있고, 첫 장에 다 있다 —
 * 무엇을 하는 앱인지, 그리고 어떻게 끝났는지. 나머지 장에는 캡션도 없다: 뷰어에
 * 글자가 하나도 뜨지 않고, 썸네일의 접근성 이름은 `alt` 가 대신한다.
 */
const SCREEN_TRANSLATOR_SCREENS: readonly Media[] = [
	{
		src: asset("/projects/screen-translator/01-game.jpg"),
		width: 485,
		height: 996,
		caption: "ゲームの翻訳",
		alt: "日本語のゲームのお知らせの上に、韓国語の訳文が重なっている。原文の位置にそのまま重ねて表示する",
		note: "スマートフォンを振るとすぐに画面をキャプチャし、画像を OCR にかけてテキストを抽出し、翻訳機で翻訳してオーバーレイの形でユーザーに表示する翻訳サービスです。\n\nGoogle 翻訳で翻訳を提供していましたが、API キーの管理に関する知識がなく、クライアントアプリにそのままキーを保存していました。1,000人ほどがダウンロードした頃にキーが流出し、1日に数十万ウォンものサーバー費用が発生しているのを見て、すぐにサービスを取り下げてしまったというハプニングがありました。",
	},
	{
		src: asset("/projects/screen-translator/02-web.jpg"),
		width: 560,
		height: 996,
		alt: "日本語のウェブ文書の上に韓国語の訳文が重なり、上部に原語の検出と、翻訳先の言語を選ぶ行がある",
	},
	{
		src: asset("/projects/screen-translator/03-settings.jpg"),
		width: 560,
		height: 996,
		alt: "基本設定の画面。翻訳する言語の組み合わせと認識精度、翻訳機のディレイ、AI 翻訳を使うかどうかを選ぶ",
	},
	{
		src: asset("/projects/screen-translator/04-sensitivity.jpg"),
		width: 560,
		height: 996,
		alt: "感度設定の画面。どれくらい強く振れば認識するかをスライダーで合わせ、その場で振って試してみる",
	},
];

/**
 * 코스모의 노트가 지나온 화면, 개발 과정의 각 단계에 하나씩. 학교 LMS 와 익스텐션의
 * 캡처라 크기가 제각각이고, 페이지는 각자 제 비율로 담는다.
 */
const COSMO_STEP_SCREENS = {
	downloader: {
		src: asset("/projects/cosmonote/story/01-downloader.jpg"),
		width: 1280,
		height: 588,
		caption: "コスモス ダウンローダー",
		alt: "学校の講義サイトの動画ビューア。エクステンションが上部バーの右側に付けたダウンロードボタンに、赤い丸を付けてある",
	},
	summary: {
		src: asset("/projects/cosmonote/story/02-summary-button.jpg"),
		width: 898,
		height: 302,
		caption: "講義ホームの要約ボタン",
		alt: "講義ホーム画面の週ごとの動画一覧。各動画の下に、ダウンロードボタンと「AI ノートで要約」ボタンが並んでいる",
	},
	webImport: {
		src: asset("/projects/cosmonote/story/03-web-import.jpg"),
		width: 1280,
		height: 692,
		caption: "ウェブから動画を読み込む",
		alt: "コスモのノートのトップ画面。学校の LMS と動画 URL、ID とパスワードを受け取るフォームの横に学校の講義サイトのウィンドウが重なり、講義のアドレスがフォームに入る矢印が描かれている",
	},
	note: {
		src: asset("/projects/cosmonote/story/04-note-page.jpg"),
		width: 1280,
		height: 829,
		caption: "生成されたノート",
		alt:
			"ノート画面。左に講義動画とスクリプト、右に SSH で Linux サーバーに接続する授業をまとめた要約の目次がある",
	},
	renewal: {
		src: asset("/projects/cosmonote/story/05-renewal.png"),
		width: 1660,
		height: 897,
		caption: "リニューアルしたノート画面",
		alt: "リニューアル後のノート画面。左にアップロードした講義動画とタイムライン、右に EC2 インスタンスのデプロイ実習をまとめた要約ノートと、クイズ・暗記カードのタブがある",
	},
} as const satisfies Record<string, Media>;

/**
 * 서비스 구조도. Pencil 문서에서 손으로 그린 듯한 선과 영어 낱말 몇 개로만 그려
 * 2x 로 내보낸 1200×320 프레임이다 — 바꿀 일이 생기면 코드가 아니라 그 문서를 고친다.
 */
const COSMO_ARCHITECTURE: Media = {
	src: asset("/projects/cosmonote/story/06-architecture.png"),
	width: 2400,
	height: 640,
	caption: "アップロードからノート生成までの流れ",
	alt: "コスモのノートの構成図。動画や PDF ファイルが R2 に入り、estimator と summarizer の2つのコンテナを経て、Worker と LLM がノートを作る流れが、手描きの箱と矢印でつながっている。R2 から Worker までは cloudflare と書かれた点線の中にある",
};

/**
 * 프레임 분석 그림. 구조도와 같은 손그림 규칙으로 Pencil 문서(`cosmo / 01 frames`)에서
 * 그려 2x 로 내보낸 1200×320 프레임이다 — 바꿀 일이 생기면 코드가 아니라 그 문서를 고친다.
 */
const COSMO_FRAMES: Media = {
	src: asset("/projects/cosmonote/story/07-frames.png"),
	width: 2400,
	height: 640,
	caption: "変化のない区間をまとめ、長く映っていた画面だけを読む",
	alt: "フレーム分析のフロー図。左に動画のフレームが10枚並び、似たもの同士が4つのまとまりに括弧でくくられている。中央にはまとまりごとの表示時間が78秒、42秒、19秒、3秒の長さの棒で横たわり、上の3本だけが top 70% の括弧に入る。右には、その画面を OCR で読んだ箱がある",
};

/**
 * 노트 생성 파이프라인 그림. 같은 손그림 규칙으로 Pencil 문서(`cosmo / 02 pipeline`)에서
 * 그려 2x 로 내보낸 1200×320 프레임이다 — 바꿀 일이 생기면 코드가 아니라 그 문서를 고친다.
 */
const COSMO_PIPELINE: Media = {
	src: asset("/projects/cosmonote/story/08-pipeline.png"),
	width: 2400,
	height: 640,
	caption: "一度に任せず、分けて任せる",
	alt: "ノート生成のパイプライン。タイムライン文書が点線でくくられた3つの段階 — 目次、本文、画像の配置 — を通り、推敲を経てノートになる。右下のハーネスが、その3段階のまとまりにプロンプトをフィードバックする",
};

/**
 * 코스모의 노트, 긴 글. 카드의 두 줄이 대신 서 있던 기록으로, /projects/cosmonote 에
 * 놓인다. 화면은 카드의 갤러리(COSMO_SCREENS)를 그대로 슬라이더로 넘긴다.
 */
const cosmoStory: ProjectStoryContent = {
	tagline: "動画、PDF などの授業資料の要約サービス",
	highlights: [
		"画面の中のスライドまで読んで、一つのタイムラインにする",
		"ユーザー一人のために高性能マシンを24時間動かしておかなければならない、というコストの問題を解決する",
		"フラッグシップモデルを高効率モデルに替えながら、ノートの品質は守り抜く",
	],
	facts: [
		{ term: "参加人数", detail: "個人" },
		{ term: "開発期間", detail: "2025.05 ~ 現在" },
		{ term: "主な技術", detail: "Cloudflare Workers, R2, Containers" },
		{ term: "受賞", detail: "全国大学ソフトウェア成果共有フォーラム 最優秀賞" },
	],
	motivation: [
		"副専攻のクラウド学科は、授業のほとんどが動画講義で行われていました。基礎科目はすでに知っている内容が大半なのに、試験と課題のために、知っている講義を最初から流し直さなければなりませんでした。",
		"しばらくは講義動画をダウンロードして、他社の要約サービスに入れて使っていました。試験の2週間前にまとめて使い、その後2か月は手もつけないのが学生の使い方なのに、月額のサブスクリプションなので、使わない日にも料金を払わなければなりませんでした。動画の読み込みから要約までを一度に済ませつつ、Pay As You Go 型のサービスを作ってみよう、というのがコスモのノートの始まりでした。",
	],
	steps: [
		{
			period: "2025.05",
			title: "コスモス ダウンローダー",
			images: [COSMO_STEP_SCREENS.downloader],
			paragraphs: [
				"最初は、講義の視聴画面の右側にダウンロードボタンを付けるブラウザエクステンションを作りました。ボタンを押すとエクステンションがウェブの通信内容を読み、ストリーミングファイルのアドレスをサーバーに送ります。サーバーは ts のストリーミングファイルをダウンロードして mp4 にエンコードし、ダウンロードリンクを返す、というシンプルな構成でした。",
				"エクステンションを作って公開し、コミュニティに投稿すると、480人以上の学友が「いいね」を押してくれました。ダウンロードしかできないプログラムなのに大きな関心を集めたということは、この不便さが自分だけの問題ではないということでした。",
			],
		},
		{
			period: "2025.08",
			title: "要約機能の追加",
			images: [COSMO_STEP_SCREENS.summary],
			paragraphs: [
				"AI ノートの生成機能を付け、ダウンロードボタンを講義のホーム画面に移しました。ボタンを押すと、Cloudflare Browser でサーバーが直接講義サイトにアクセスするように変えました。ログインは、エクステンションが渡したセッションキーをサーバー側のブラウザに埋め込んで回避しました。",
				"エクステンションがしていた仕事を、一つずつサーバーに移していく作業でした。エクステンションをなくし、完全にウェブサービスとして動かすことが目標でした。あわせて決済を連携し、収益化の仕組みも作ってみました。",
			],
		},
		{
			period: "2026.04",
			title: "エクステンションの廃止",
			images: [COSMO_STEP_SCREENS.webImport, COSMO_STEP_SCREENS.note],
			paragraphs: [
				"交換留学から戻った後、再びサービスのアップデートを始めました。最大の目標は、ブラウザエクステンションを完全になくすことでした。ブラウザエクステンションはユーザーのブラウザに深くアクセスできる点は良いのですが、モバイルではまったく動かず、特定のブラウザに依存するという問題があります。何より、エクステンションを知っている人があまり多くありませんでした。",
				"そこで、ウェブサイトだけで動くように大がかりに作り直しました。学校サイトのログイン情報と講座の URL を受け取ると、Cloudflare Browser で直接ログインし、パケットを検知して動画を見つけ出す仕組みです。ソフトウェアは複雑になりバグも増えましたが、エクステンションをなくしたことで、使いやすさは比べものにならないほど良くなりました。",
			],
		},
		{
			period: "2026.09",
			title: "汎用の動画要約サイトへリニューアル",
			images: [COSMO_STEP_SCREENS.renewal],
			paragraphs: [
				"従来の構成では、学校のサイトからしか動画を読み込めませんでした。成長の妨げでもありましたが、著作権のある学校の講義を加工してお金を受け取ることになるため、法的なリスクを避けられませんでした。",
				"売上が出始めたところで嬉しかったのですが、学校サイトとの連携機能は廃止しました。ただ、このサービスのアイデンティティでもあるので完全には捨てきれず、エクステンションに戻しました。動画や録音、画像、文書を直接アップロードする方式にリニューアルし、現在の形になりました。",
			],
		},
	],
	architecture: {
		label: "Architecture",
		items: [
			{
				title: "画面の中のスライドまで読んで、一つのタイムラインにする",
				body: [
					"ほとんどの講義要約サービスは、音声を STT で書き起こしてから、そのテキストを要約します。ところが授業動画で本当に大事なものはプレゼンテーションの中に多くあり、講師がそれを読まずに進んでしまうことも少なくありません。スライドに出てきた数式や図表が、そのまま失われるという問題が起きます。",
					COSMO_FRAMES,
					"そこでコスモのノートには、動画のフレームを分析するロジックを入れました。summarizer は ffmpeg を使ってフレームの変化を追跡します。フレームの変化率が5%未満であれば同じフレームとみなし、同じフレームが長く続いたものをランキングにします。そして、上位70%に当たるフレームを見つけて OCR を行います。",
					"STT の結果と OCR の結果を、一つのタイムラインにマージします。最後にこのタイムラインを Worker に渡し、事前にチューニングしたプロンプトで要約ノートを生成します。",
				],
			},
			{
				title: "ユーザー一人のために高性能マシンを24時間動かしておかなければならない、というコストの問題を解決する",
				body: [
					"コスモのノートは ffmpeg で動画のフレームを処理する必要があるため、その瞬間はかなり良いマシンを必要とします。高性能なインスタンスを常時動かしておくと、誰も使っていない時間にも費用がかかります。そこで動画処理の機能にはサーバーレス構成を採用し、費用を大きく削減しました。",
					COSMO_ARCHITECTURE,
					"Workers は最大100MB までしかアップロードを受け付けられません。100MB 未満の動画はほとんどないので、サーバーはバケットに直接アップロードできる Presigned URL を発行してクライアントに渡します。ファイルはクライアントから R2 に直接アップロードされます。",
					"アップロードされたファイルは、estimator が検査します。壊れたファイルや不正なファイルでないかを確認し、問題がなければサンプリングして費用を見積もります。ユーザーが見積もられた金額を支払うと、ノートの生成が始まります。見積もりより分析すべき量が多いと損をすることもありますが、平均コストに倍率を掛けることで、この問題を最小限に抑えました。",
					"この構成が、そのまま料金プランになりました。2時間の動画で、およそ1,300ウォンほどかかります。他社のサービスが3時間分の動画を分析するのに月7,900ウォンを求めることを考えると、試験期間にまとめて使う学生にとってはとても合理的な仕組みです。インフラも使った分だけ請求される構成なので、持続可能なシステムです。",
				],
			},
			{
				title: "フラッグシップモデルを高効率モデルに替えながら、ノートの品質は守り抜く",
				body: [
					"開発初期は、Claude のようなフラッグシップモデルを使っていました。プロンプトのチューニングやタイムラインの整理をあまりしなくても満足できる結果が出ましたが、ノートを1本生成するのにお金がかかりすぎました。2時間の動画を Claude で要約するのに1,300ウォンというのは、慈善団体でもなければ難しい話です。",
					COSMO_PIPELINE,
					"今は Gemini や DeepSeek のような、低コストで高効率のモデルを使っています。その代わり、一度にすべての作業を任せず、目次の生成、本文の生成、画像の配置、推敲などにパイプラインを分けました。小さなモデルは特にコンテキストが大きくなると品質が急激に落ちますが、先に目次を作って1項目ずつ書かせるように仕事を分ければ、品質はそれほど落ちません。また、キャッシングによって費用が一部削減されることもあります。",
					"コンテキストのせいで品質が落ちる問題は解決しましたが、思考力の差が問題でした。そこで Fable のようなフラッグシップモデルと今のパイプラインの結果を比較するハーネスを作り、定期的に実行しています。Fable ほどの性能は出せませんが、コストのわりに良い品質が出ています。",
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
 * enqor 의 구조도 네 장. 코스모의 것과 같은 손그림 규칙으로 Pencil 문서에서 그려
 * 2x 로 내보냈다 — 바꿀 일이 생기면 코드가 아니라 그 문서를 고친다.
 */
const ENQOR_FIGURES = {
	billing: {
		src: asset("/projects/enqor/story/01-billing-timeline.png"),
		width: 2400,
		height: 1040,
		caption: "ピンで定義した安定した通話",
		alt: "通話の精算シーケンス。発信者と受信者が両側に、サーバーが中央にあり、毎秒ピンがやり取りされる間はサーバーが料金を請求し、ピンが3回抜けると請求を止め、再び届けば再開し、7回抜けると通話を終える",
	},
	balance: {
		src: asset("/projects/enqor/story/02-balance-session.png"),
		width: 2400,
		height: 1040,
		caption: "通話セッションの残高",
		alt: "残高処理の構成図。通話が始まると DB のキャッシュをロックし、redis のセッションに複製する。残高は毎秒減り、チャージすると増え、プレゼントすると減る。残り時間は残高から計算してクライアントに返し、通話が終わると DB に書き戻す",
	},
	docs: {
		src: asset("/projects/enqor/story/03-docs-to-code.png"),
		width: 2400,
		height: 600,
		caption: "企画書からコードまで",
		alt: "PDF の企画書と Figma のデザインを手作業で1つの Markdown にまとめ、その文書をエージェントがソースコードに落とし込む流れ",
	},
	harness: {
		src: asset("/projects/enqor/story/04-harness-loop.png"),
		width: 2400,
		height: 640,
		caption: "ウェブで先にパブリッシュするハーネス",
		alt: "ハーネスのフロー図。エージェントが画面を expo web でパブリッシュすると、批判的エージェントが Figma と照らし合わせて評価し、直すところがあればエージェントに差し戻し、合格すればアプリに移す",
	},
} as const satisfies Record<string, Media>;

/**
 * enqor, 긴 글. /projects/enqor 에 놓인다. 화면은 카드의 갤러리(ENQOR_SCREENS)를
 * 그대로 슬라이더로 넘긴다. 날짜별 이력은 없어 History 섹션이 빠진다.
 *
 * Highlights 두 줄과 architecture.items 두 편은 순번까지 같은 한 목록이다 — 한쪽만
 * 늘리면 줄마다 걸린 앵커가 통째로 죽는다. 두 편 뒤의 Retrospective 는 그 목록 밖에
 * 선다: 검증을 어디까지 할 것인가는 두 편이 함께 남긴 말이지 그중 한 편의 답이 아니다.
 */
const enqorStory: ProjectStoryContent = {
	tagline: "1:1の専門家相談サービス",
	highlights: [
		"安定して通話がつながっているときだけ、秒単位で料金を精算する",
		"AI の応答を、人のボトルネックなしに検証する",
	],
	facts: [
		{ term: "参加人数", detail: "3人" },
		{ term: "開発期間", detail: "2026.04 ~ 現在" },
		{ term: "担当", detail: "アプリおよびサーバーの開発" },
		{ term: "主な技術", detail: "Agora(ストリーミング), NestJS(GraphQL), Expo" },
	],
	motivation: [
		"最近は、悩みがあるとまず ChatGPT に聞きます。ところが、いざ心が複雑なときは AI 特有の魂のこもっていない会話にすぐ疲れてしまい、医療や受験のように責任が伴う相談では、AI の答えをそのまま信じるのも難しいものでした。いくつかの会話は、まだ人とする必要があります。",
		"医師のような専門家から、恋愛経験が豊富な人のような気軽なテーマまで、自分が自信のある分野で他の人の悩みを聞き、収益を得られる場が必要だと考えました。会話プラットフォームを開発するために Align Networks に参加し、アプリとサーバーの開発を担当しました。ただし、enqor は人が直接プログラミングしたものではありません。企画書とデザインを AI エージェントが読めるようにし、エージェントが出した成果物を検証する環境を作ることが私の仕事でした。",
	],
	architecture: {
		label: "Architecture",
		items: [
			{
				title: "安定して通話がつながっているときだけ、秒単位で料金を精算する",
				body: [
					"enqor の中核となる機能は、ビデオ・音声通話です。ストリーミングは Agora を使ったので難しくありませんでしたが、精算のパイプラインは自分で作らなければならない課題でした。モバイルは通信状態が悪くなることが多いため、正常に行われた時間だけを精算する必要があり、さらに秒単位の請求まで求められました。",
					ENQOR_FIGURES.billing,
					"まず、「安定した通話」とは何かを決めなければなりません。これは、サーバーとクライアントがやり取りするピンで定義しました。どちらか一方の参加者でもピンが3回抜けたら接続に問題があると判断し、精算を止めます。7回抜けたら通話が切れたと判断し、セッションを終了するようにしました。",
					"次の問題は、毎秒の精算という要件です。最初は、通話時間全体から不安定だった時間を引き、通話が終わった後にデータベースを一度だけ更新するつもりでした。ところが、要件が思った以上に複雑でした。通話中にキャッシュをチャージできる必要があり、チャージしたキャッシュで互いにプレゼントもでき、通話可能な時間が20秒未満になれば、もうすぐ通話が終わることも知らせなければなりません。チャージ、消費、照会がすべてリアルタイムで行われる必要があるため、残りのキャッシュを読み書きの軽いどこかに保存して処理するのが簡単だと判断しました。",
					ENQOR_FIGURES.balance,
					"通話が始まると、発信者のキャッシュを変更できないようにします。現在のキャッシュを読んで redis の通話セッションに複製しておくと、この値が発信者が使えるキャッシュの原本になります。毎秒この値を減らして精算し、チャージやプレゼントがあればこの値を更新し続けます。チャージは決済の記録を残す必要があるので、DB にも別途残します。残りの通話時間も、この値をもとに計算してクライアントに返します。通話が終わったら、DB に残りの残高を更新します。たった2回の DB 操作で、複雑なロジックを直感的に実装できるようになりました。",
				],
			},
			{
				title: "AI の応答を、人のボトルネックなしに検証する",
				body: [
					"企画チームが作成したファイルは、PDF の企画書と、Figma で作られたデザインファイルです。人が読んで直すには便利ですが、そのままエージェントに渡すと、どの Figma ノードにどんな説明が入っているのかがわかりません。そこで Figma のノードと PDF のページを自分で対応づけて Markdown で書き、ところどころにメモも書き込みました。",
					ENQOR_FIGURES.docs,
					"こうして完成した約800行の企画書をもとに、AI エージェントにプロジェクトを最後まで完成させるよう指示しました。30分ほどでプロジェクトが一つできあがりましたが、実行してみると結果はめちゃくちゃでした。ある程度は予想していましたが、起動すらしないとは思わず、なんとか直してログイン画面に入ると、Figma で定義したデザインはまったく反映されていませんでした。ログインのような機能もすべてモックで実装された、まったくのでたらめなプロジェクトでした。",
					"この問題を顧問の方に打ち明けたところ、「ハーネスエンジニアリング」という概念を紹介してくださいました。ネットで検索してみると、「AI が正しい行動を取れるように環境を作ること」という曖昧な答えしか出てきませんでした。概念を完全には理解できませんでしたが、顧問の方の助言を受けてフック、批判的レビュアー、テスターを一つずつセットアップしていくうちに、いつの間にか自分だけのハーネスができあがっていました。",
					"ハーネスで一番難しいのは、「成功条件」を定義することです。たとえば Figma に宣言されたデザインどおりにパブリッシュしたかを判定するには、そのデザインとパブリッシュされた画面が一致しているかを評価するロジックが必要です。最初はアプリの画面をキャプチャして似ているかどうかだけを調べ、独立したサブエージェントがこの比較を担当しました。悪くはありませんでしたが、良い成果物とも言えませんでした。あちこちでアイコンが違い、テキストの位置がずれていました。何より、アプリの画面をキャプチャして Figma と照らし合わせる作業がとても遅く、トークンを大量に消費しました。",
					ENQOR_FIGURES.harness,
					"この問題は expo web で解決しました。まず実装したい画面を expo web でパブリッシュすれば、headless ブラウザを開いて、パブリッシュの状態を難なく確認できます。ウィンドウサイズを変えるだけで、モバイル・タブレットの解像度で崩れる部分がないかもすぐにわかります。こうしてパブリッシュが終わったコードをアプリに移す順番に変えると、評価がずっと安くなりました。Figma とウェブでパブリッシュされた画面がどれだけ似ているかは批判的エージェントが判定しますが、アイコンを自分で生成できないようにルールを入れ、Figma MCP に問題が起きて動かない場合はハーネスがそもそも止まるようにする preflight の手順も追加しました。その結果、シンプルな画面はほぼ完璧なレベルで、複雑な画面も70%ほどの完成度で仕上がりました。",
				],
			},
		],
	},
	retrospective: {
		label: "Retrospective",
		paragraphs: [
			"今回の経験で、AI に良い資料を与え、良い環境を作ってあげれば良い結果が出るということがわかりました。そして AI が生み出した結果も、「どう」検証するかより「どこまで」検証するかを考えるほうが正しいと感じました。",
			"金融、宇宙産業、防衛産業のように、一度の事故が惨事になるドメインでは、すべてのコードを隅々まで検証しなければならないでしょう。しかし今回のプロジェクトのように、ほとんどはそうではありません。開発者は、AI が今何をしていて、この作業が終わったらどこまで検証すべきで、どのファイルが変わることを期待しているのか、その程度を把握していれば十分だと考えています。その中でも、AI がしているのが単純な作業であれば何度か触ってみてテストを終えることもできますし、中核のロジックであれば設計まで細かく議論する必要があります。",
			"開発者がコードを書く人から、判断して責任を負う人へと変わったことを、このプロジェクトで確かめました。",
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
 * HEALIX, 긴 글. /projects/healix 에 놓인다. 화면은 카드의 갤러리(HEALIX_SCREENS)를
 * 그대로 슬라이더로 넘긴다. 두 달짜리 해커톤 결과물이라 날짜별 이력도, 따로 세울
 * 설계 고민도 없다 — Highlights 와 History 가 빠지고, 대신 발표 영상이 붙는다.
 */
const healixStory: ProjectStoryContent = {
	tagline: "症状にもとづく病院探しサービス",
	facts: [
		{ term: "参加人数", detail: "6人" },
		{ term: "開発期間", detail: "2024.07 ~ 2024.08" },
		{ term: "主な技術", detail: "ChatGPT API, NestJS" },
	],
	motivation: [
		"人は体のどこかが痛いとき、どの病院に行けばいいのかわからないことがよくあります。すぐに思いつくだけでも、熱の出る風邪をひいたら内科に行くべきか耳鼻咽喉科に行くべきかわかりませんし、お尻のような馴染みのない部位が痛くなってくると、その悩みはさらに大きくなります。以前は、ネットで検索して適切な診療科を探し、地図で病院を探さなければなりませんでした。HEALIX は、この不便さを解決するために開発されました。",
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
 * WATERFLAKE 의 구조도. 코스모·enqor 의 것과 같은 손그림 규칙으로 Pencil 문서에서
 * 그려 2x 로 내보낸 1200×320 프레임이다 — 바꿀 일이 생기면 코드가 아니라 그 문서를 고친다.
 */
const WATERFLAKE_ARCHITECTURE: Media = {
	src: asset("/projects/waterflake/story/01-tunnel.png"),
	width: 2400,
	height: 640,
	caption: "ドメインからゲームサーバーまで",
	alt: "WATERFLAKE の構成図。プレイヤーが test.example.com に接続すると、SRV レコードが 1.1.1.1 の3000番ポートを指し、そのポートで動くトンネリングサーバーが、マインクラフトのサーバーと20本の TCP ソケットでつながっている",
};

/**
 * WATERFLAKE, 긴 글. /projects/waterflake 에 놓인다. 화면은 카드의 갤러리
 * (WATERFLAKE_SCREENS)를 그대로 슬라이더로 넘긴다. 날짜별 이력은 없어 History 섹션이 빠진다.
 */
const waterflakeStory: ProjectStoryContent = {
	tagline: "簡単なインストールだけで、マインクラフトのドメインサーバーを開く",
	highlights: [
		"SRV レコードで、サブドメインが特定の IP のポートを指すよう自動で設定する",
		"ゲームサーバーとトンネリングサーバーの間を、TCP ソケットでトンネリングする",
	],
	facts: [
		{ term: "参加人数", detail: "個人" },
		{ term: "開発期間", detail: "2023.03 ~ 2023.05" },
		{ term: "主な技術", detail: "NestJS, Java" },
	],
	motivation: [
		"10年ほど前、マインクラフトというゲームにはまり、みんなで遊べるサーバーを開いてみることが一番の目標でした。コンピューターのことなどまったく知らない小学生が、ブログの記事だけを読んで VPS サーバーを借り、Linux 環境でゲームサーバーを動かしました。そして複雑なネットワークの設定までこなして、ついにサーバーを開きました。そのときの達成感は人生で最も大きな達成感で、決して忘れられない思い出です。今に戻って、「もし複雑な手順なしに、簡単にゲームサーバーを開けるよう手助けしてくれるツールがあったらどうだろう？」という考えから始めました。",
	],
	architecture: {
		label: "Architecture",
		items: [
			{
				// TODO(confirm): 원문에는 절 제목이 없어 두 하이라이트를 그대로 제목으로 세웠다.
				title: "SRV レコードと TCP トンネリング",
				body: [
					WATERFLAKE_ARCHITECTURE,
					"ユーザーが私たちのウェブサービスでトンネルを作成すると、Cloudflare API を通じて SRV レコードを作成します。そして、トンネリングを担当する仮想マシン上に、ランダムなポートでトンネリングサーバーを立ち上げます。トンネリングサーバーは2つの接続を受けます。1つは SRV レコードを通じて入ってくる接続、もう1つはマインクラフトのサーバー側へ出ていく接続です。この2つの接続をパイプでつなぐことで、外部から入ってくるパケットが自然にマインクラフトのサーバーへ流れていきます。ユーザーには、まるでドメインのアドレスを入力すれば接続できるサーバーのように見えます。",
					"トンネリングサーバーとゲームサーバーの間の TCP トンネルは、20個のソケットで管理されます。プレイヤーがサーバーに接続すると、このソケットのうち1つを占有します。プレイヤーがゲームサーバーから抜けると、そのソケットは破棄され、新しいソケットが作られます。このサイクルを繰り返して、ソケットの数を管理します。幸い、マインクラフトのサーバー設定には最大接続人数が決まっているため、この値の分だけソケットを管理すれば、運用に問題はありませんでした。",
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
			description: "溜まった動画講義に素早く追いつくための、動画要約サービスです。音声だけでなく画面の中のスライドまで読み、サブスクリプションなしで、使った分だけ支払う仕組みにしました。",
			links: [{ label: "cosmonote.site", href: "https://cosmonote.site" }],
			// 갤러리 첫 장이 그대로 타일이 된다. 25:17 로 잘리지만 헤드라인과 떠 있는
			// 카드가 모두 그 안에 들어오고, 눌렀을 때 크게 뜨는 화면과 같은 그림이다.
			thumbnail: {
				src: asset("/projects/cosmonote/01-landing.png"),
				alt: "コスモのノートのトップ画面",
			},
			appIcon: { src: "/brand/cosmonote-icon.png", alt: "コスモのノートのアプリアイコン" },
			// The order is the service's own: 들어와서(랜딩·기능) → 만들고(노트) →
			// 익히고(퀴즈·암기카드, 각각 만들기 다음에 푸는 화면) → 나누고(공개 노트)
			// → 붙인다(API). Paired screens stay adjacent so paging one step never
			// leaves a 만들기 화면 without the thing it made.
			gallery: COSMO_SCREENS,
			// 제목을 누르면 열리는 긴 글. 갤러리는 저 위의 것을 그대로 슬라이더로 쓴다.
			slug: "cosmonote",
			story: cosmoStory,
		},
		{
			period: "2026 ~ 現在",
			title: "enqor",
			description: "リアルタイムのビデオ・音声による専門家相談サービスです。AI の応答を改善するためのハーネス、テスト、そして複雑な料金精算機能を実装するための、エンジニアリング上の工夫が詰まっています。",
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
			// 세로 캡처는 25:17 타일에 담기면 띠가 된다. 가로로 짜인 그림은 스토어
			// 대표 이미지뿐이고, 그게 갤러리의 첫 장이기도 하다.
			thumbnail: {
				src: asset("/projects/enqor/01-poster.png"),
				alt: "enqor のストア用メイン画像",
			},
			appIcon: { src: "/brand/enqor-icon.png", alt: "enqor のアプリアイコン" },
			// 들어가서 → 고르고 → 요청하고 → 충전·결제하고 → 걸고 → 받고 → 통화하고
			// → 남긴다. 08 과 09 는 같은 9초를 거는 쪽과 받는 쪽에서 각각 찍은 것이다.
			gallery: ENQOR_SCREENS,
			slug: "enqor",
			story: enqorStory,
		},
	],
	archive: [
		{
			period: "2024",
			title: "HEALIX",
			description: "症状をもとに、最も近くて適切な病院をおすすめするサービスです。公共データポータルとアプリ内の GPS データを、AI に渡すようにしました。",
			// 공개된 저장소가 백엔드 하나뿐이라 메뉴 없이 바로 간다.
			links: [{ label: "Github", href: "https://github.com/bb2002/healix-backend" }],
			// 표지를 그대로 담으면 QR 과 팀 크레딧이 들어오고 워드마크가 바로 옆 카드
			// 제목과 겹친다. 표지에서 폰 목업만 205:141 로 떼어 냈다.
			thumbnail: {
				src: asset("/projects/healix/00-thumb-4ae26d2b.png"),
				alt: "HEALIX の画面。地図の下に、近くの病院と予約情報が並んでいる",
			},
			// 살아 있는 앱이 아니라 2024년 해커톤 결과물이다. 남은 건 발표자료뿐이라
			// 표지 → 왜 만들었나 → 어떻게 쓰나 세 장으로 줄였다.
			gallery: HEALIX_SCREENS,
			// 제목을 누르면 열리는 긴 글. 갤러리는 저 위의 것을 그대로 슬라이더로 쓴다.
			slug: "healix",
			story: healixStory,
		},
		{
			period: "2023",
			title: "WATERFLAKE",
			description: "簡単なインストールで、外部からの接続がふさがれたゲームサーバーに、接続できるドメインを発行するサービスです。TCP トンネリングと SRV レコードを中核に使いました。",
			// 저장소가 넷이라 카드에 네 줄을 세우는 대신 한 줄이 메뉴를 연다.
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
			// 터널을 만들고 → 주소와 키를 받고 → 서버가 붙는다. 마지막 장이 터널링
			// 성공 로그라, 넘기다 보면 설명이 말한 도메인이 실제로 사는 걸로 끝난다.
			gallery: WATERFLAKE_SCREENS,
			slug: "waterflake",
			story: waterflakeStory,
		},
		{
			period: "2018",
			title: "スクリーン翻訳機",
			description:
				"スマートフォンを振ると画面をキャプチャし、オーバーレイで訳文を表示します。中学生のときに初めて作り、収益化まで成功しました。",
			// 저장소가 하나뿐이라 메뉴 없이 바로 간다.
			links: [{ label: "Github", href: "https://github.com/bb2002/ProjectScreenTranslator" }],
			// 넷 다 세로라 205:141 타일에 담기면 띠가 된다. 첫 장에서 게임 로고와 그
			// 위에 덮인 번역 팝업이 함께 들어오게 잘라 냈다 — 카드 문구가 말하는
			// 동작이 타일 안에서 그대로 보이고, 누르면 그 장이 먼저 뜬다.
			thumbnail: {
				src: asset("/projects/screen-translator/00-thumb.jpg"),
				alt: "ゲーム画面の上に、韓国語の訳文が重なっている",
			},
			// 게임에서 쓰고 → 웹에서도 쓰고 → 그제서야 언어와 흔드는 세기를 어디서
			// 고치는지 보여 준다. 무엇을 하는 앱인지가 먼저고 설정은 그다음이다.
			gallery: SCREEN_TRANSLATOR_SCREENS,
		},
	],
	gallery: {
		open: "画面を拡大して見る",
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
 * bigint-migration 의 그림 두 장. 프로젝트 구조도와 같은 손그림 규칙으로 Pencil 문서의
 * `bigint / 01 table` · `bigint / 02 trigger` 프레임(1200×440, 1200×420)에서 그려 2x 로
 * 내보냈다 — 바꿀 일이 생기면 코드가 아니라 그 문서를 고친다.
 */
const BIGINT_TABLE: Media = {
	src: asset("/experience/bigint-migration/01-table.png"),
	width: 2400,
	height: 880,
	caption: "19億件のうち、実際に読まれるのは直近1か月分だけ",
	alt: "luckybox テーブルの図。id 列が INT で宣言されたまま19億件が積み上がっていて、上のほとんどの行は期限切れで読まれず、下の直近1か月分の行だけがリアルタイムで使われる。右のゲージは INT の最大値21億のうち19億まで埋まった状態で、残りの余裕が2か月ほどであることを示している",
};

const BIGINT_TRIGGER: Media = {
	src: asset("/experience/bigint-migration/02-trigger-12a883d63d8d.png"),
	width: 2400,
	height: 840,
	caption: "トリガーが PK を負数に差し替える流れ",
	alt: "トリガーの構成図。サーバーが INSERT すると、BEFORE INSERT トリガーがシーケンステーブルから次の値 n を読んで id を -n に替えて入れ、luckybox テーブルには -1、-2 のように負の id で保存される。アプリは SELECT でその値を読んでも INT の範囲内なので、問題なく処理する",
};

/**
 * realtime-redesign 의 그림 두 장. 위와 같은 규칙으로 Pencil 문서의 `realtime / 01 item` ·
 * `realtime / 02 open` 프레임(1200×420, 1200×440)에서 그려 2x 로 내보냈다.
 */
const REALTIME_ITEM: Media = {
	src: asset("/experience/realtime-redesign/01-item-6d1a661e4b30.png"),
	width: 2400,
	height: 700,
	caption: "1つのパーティションキーに、ボックスを配列で",
	alt: "DynamoDB のアイテムの図。パーティションキーはユーザー1人に割り当てられ、その中の boxes 配列に id・cash・opened の値を持つボックスが並んでいる。API は新しいボックスを配列に追加し、ボックスを開けるとその項目にキャッシュを書き込む",
};

const REALTIME_OPEN: Media = {
	src: asset("/experience/realtime-redesign/02-open-267330550719.png"),
	width: 2400,
	height: 850,
	caption: "ボックスを開けるときに、3つのストアを回る順序",
	alt: "ボックスを開けるフロー図。アプリがボックスを開けると、サーバーが MySQL から設定を読み(read config)、Redis で高額当選の TTL フラグを確認したあと(check ttl)、DynamoDB のボックスを開封済みに変えて ZSET のランキングを更新する(set open & add rank)。最後に、アプリにキャッシュが付与される",
};

/**
 * aws-cost 의 그림. 위와 같은 규칙으로 Pencil 문서의 `aws / 01 route53` 프레임(1200×420)에서
 * 그려 2x 로 내보냈다.
 */
const AWS_ROUTE53: Media = {
	src: asset("/experience/aws-cost/01-route53.png"),
	width: 2400,
	height: 840,
	caption: "Route 53 の加重ルーティングで、トラフィックの10%だけを新しいインスタンスへ",
	alt: "トラフィック分配の構成図。ユーザーのリクエストが Route 53 に届くと加重ルーティングで分かれ、既存の Intel x86 インスタンスで動く Beanstalk が90%を、同じ Dockerfile で arm64 イメージをビルドして載せた Graviton インスタンスの Beanstalk が10%を受け取る。Intel 側はピーク時に12台まで増える",
};

/**
 * api-memory 의 그림. 위와 같은 규칙으로 Pencil 문서의 `api / 01 leak` 프레임(1200×440)에서
 * 그려 2x 로 내보냈다.
 */
const API_MEMORY_CHART: Media = {
	src: asset("/experience/api-memory/01-leak.png"),
	width: 2400,
	height: 880,
	caption: "インスタンス1台のメモリ、5日で1GB から32GB まで",
	alt: "折れ線グラフ。インスタンス1台のメモリ使用量が初日に1GB から始まり、5日かけて32GB の上限線まで上がり、そこで OOM により強制終了されたあと再起動して、また1GB から始まる",
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
			subtitle: "移すデータに優先順位をつけ、いつでも元に戻せるマイグレーションスクリプトを用意しました。",
			body: [
				{ heading: "背景" },
				"Timespread には、ランダムボックスという機能があります。広告を見るとキャッシュがランダムに入ったボックスがもらえ、そのボックスを開けるとキャッシュが入るというシンプルな機能でした。ボックス1つは、luckybox テーブルの1行でした。ユーザーが増えるにつれてこのテーブルに19億件が積み上がりましたが、主キーが INT で宣言されていたため、上限の21億まで2か月ほどしか残っていない状態でした。このテーブルを、BIGINT で宣言した新しいテーブルに移す必要がありました。",
				{ heading: "1回目の試み" },
				"まず、サービスの特徴を調べました。ボックスは24時間が過ぎると期限切れになり、ランキングを処理するバッチプログラムは直近1か月のデータしか読んでいませんでした。メンテナンス時間内にこのデータだけを移せば、サービスを再開できるということでした。",
				BIGINT_TABLE,
				"チームリーダーと相談し、平日の明け方にサービスを1時間止めて、あらかじめ用意したマイグレーションスクリプトを実行することにしました。スクリプトは、次の作業を順番に行います。",
				{
					items: [
						"既存テーブルの名前を RENAME して、接続を切ります。",
						"新しいテーブルを BIGINT で作り直します。",
						"万一の重複を防ぐため、PK が22億から始まるようにします。",
						"1か月前のデータが何番の ID なのかを調べます。",
						"MySQL のプロシージャで、100件ずつバッチでデータをコピーします。",
					],
				},
				"スクリプトを書くうえで最も重視したのは、「ロールバックできるか」でした。作業の途中で問題が起きたらすぐに止められなければならず、進捗も目で確認できる必要がありました。データの挿入はクエリ1行でも書けましたが、進捗がわからず途中で止めることもできないため、作業を細かく分けることにしました。",
				"マイグレーションは無事に進みました。1か月分のデータが入り、新しいボックスは22億から作られ始めました。ところが、なぜか Android アプリでクラッシュが起き始めました。残りのメンテナンス時間が少なかったため、用意しておいた手順どおりにロールバックし、サービスは元の状態に戻りました。",
				{ heading: "原因" },
				"理由は単純でした。アプリでも ID を INT で扱っていたため、21億を超える値を処理できなかったのです。サーバーだけ直せば済む問題ではありませんでした。別の方法を探す必要がありました。",
				{ heading: "2回目の試み" },
				"チームリーダーと解決策を話し合っているうちに、ふと INT には負の領域もあることを思い出しました。幸い unsigned で宣言されていなかったので、PK を負数で保存する方法について話し合いました。チームリーダーも良い方法だと言ってくださったので、すぐに作業に取りかかりました。",
				BIGINT_TRIGGER,
				"BEFORE INSERT トリガーを設定し、値が入ってくるときにシーケンステーブルから次の値を読んで、PK を負数に替えて入れるようにしました。テストサーバーで、サーバーとアプリの両方が負の PK を問題なく処理できることを確認し、明け方にトリガーを設置しました。",
				"その日以降に挿入されるすべてのデータの PK は負数で入り、アプリでも問題は起きませんでした。この対応で目の前の障害を防ぎ、約2年分のリファクタリングの時間を稼ぎました。",
			],
		},
		{
			slug: "realtime-redesign",
			year: "2023",
			title: "毎分1,500件のリクエストを受けるサービスのリファクタリング",
			subtitle: "DynamoDB と Redis で設計し直し、6時間に一度更新されていたランキングを、リアルタイムで動くようにしました。",
			body: [
				{ heading: "背景" },
				"先のマイグレーションで時間を稼いでから、1年が経ちました。その間に、アプリで ID を整数として扱っていたのを String に変え、そのリリースがユーザーの99%に行き渡るまで待ちました。ちょうど運営チームから、ランダムボックスの確率調整機能がわかりにくいのでリニューアルしてほしいという要望があり、代表も承認してくださったので、ようやくリファクタリングに着手できました。",
				{ heading: "ボックスをどこに保存するか" },
				"まず、ボックスをどこに保存するかを考えました。以前の設計ではボックスをすべて MySQL に保存していたため、ボックスを作るたびに INSERT が、開けるたびに UPDATE が発生していました。これを DynamoDB に移し、パーティションキーで読み書きする速度が速いという長所を、最大限に活かすことにしました。",
				REALTIME_ITEM,
				"ボックスができたら配列に値を追加し、ボックスを開けたらその項目だけを直せば済みました。見た目は MySQL と変わりませんが、1つのパーティションキーで照会・更新するので、はるかに速くなりました。また、ユーザーがその日初めてアクセスしたときに溜まっていたデータを消すようにして、以前のように値が際限なく増え続けることも防ぎました。",
				"新たにできたポリシーで、1人のユーザーが開けられるボックスは最大20個までという制約もありました。この制約もボックスの length を数えるだけですっきり解決でき、さらに効率的でした。",
				{ heading: "ランキングと設定はどこに置くか" },
				"ランキングシステムも新しく作りました。Redis の ZSET は重複のないキーをスコア順に並べておき、順位の読み取りと更新を O(log n) の時間計算量で行えます。さらに、高額当選者が一定期間ふたたび当選できないようにする必要があるという要件もありましたが、当選したユーザーの ID に TTL をかけて Redis に保存しておけば、データベースで当選記録を照会しなくても簡単に解決できました。",
				"当選確率のような設定値は、MySQL に残しました。管理者コンソールとの連携を考慮する必要があったからです。ボックスを開けるたびに MySQL を一度読まなければならないという短所はありますが、設定をリアルタイムに反映でき、読み取りだけなので大きな負担にはならないと判断しました。",
				REALTIME_OPEN,
				{ heading: "結果" },
				"完成したシステムは、少しずつトラフィックを受けていきました。朝は10%ほどだけ受けながら様子を見て、問題がなかったので午後に100%まで上げました。MySQL の負荷が下がり、何よりランキングに活気が出ました。6時間に一度更新されていた値が、リアルタイムで動くようになったからです。運営チームも、当選確率を設定しやすくなったと満足していました。",
				"問題を見つけてチームリーダーに報告した日から最後のリファクタリングまで、まる1年かかりました。自分の書いたコードが少しずつトラフィックを受け、100%までリリースされていく様子を見守った経験は、今でも忘れられない開発の楽しさです。",
			],
		},
		{
			slug: "aws-cost",
			year: "2022",
			title: "月1,000万ウォンを超えていた AWS 費用を30%削減",
			subtitle: "安くて性能の良い Graviton インスタンスに移し、インスタンスの増減ルールを組み直しました。",
			body: [
				{ heading: "背景" },
				"Timespread は、サーバー費用として毎月1,000万ウォン近くを使っていました。チームリーダーから、この費用を減らす方法を探してみようと言われました。",
				{ heading: "どこにお金がかかっているのか" },
				"Cost Management で確認すると、費用が最もかかっているのは3か所でした。",
				{ items: ["RDS", "Beanstalk (EC2)", "ネットワークトラフィック"] },
				"RDS はすでに負荷が高く手を入れる余地がなかったので、EC2 で減らせるところを探しました。ちょうど ARM 系の Graviton インスタンスが新しく登場し、同じ性能を20%ほど安く出せるという AWS の発表を見て、自分たちのサービスに適用してみることにしました。",
				{ heading: "Graviton に移す" },
				"まず Graviton インスタンスを1台作り、サーバーを立ち上げてみました。OS のバージョンとアーキテクチャが変わったため、従来の方法では起動しませんでしたが、幸い Dockerfile でビルドすると ARM アーキテクチャでも安定して動きました。そこで既存の CI/CD パイプラインを直して GitHub Actions でクロスビルドにより ARM イメージを作るようにし、Graviton インスタンスで動く Beanstalk を新たに作って、そのイメージを使うようにしました。",
				AWS_ROUTE53,
				"テストサーバーで QA チームと一緒にサーバーが正しく動くかを確認し、何の問題もありませんでした。Route 53 の加重ルーティングで新しいサーバーにトラフィックの10%だけを流し、大きな問題が出なかったので、最終的にすべてのトラフィックを Graviton インスタンスが受けるようにしました。",
				{ heading: "インスタンスの増減ルールを組み直す" },
				"数日後には、CPU 使用率のデータを見て、時間帯ごとのスケールアウトのルールを調整しました。ピーク時に最大12台まで増えていたインスタンスを8台に減らし、夜間は1台だけ動くようにしました。インスタンスの切り替えとスケールルールの調整を合わせて、最終的に費用を30%ほど削減できました。",
			],
		},
		{
			slug: "api-memory",
			year: "2022",
			title: "32GB を超えるメモリを占有して停止していた API サーバーの正常化",
			subtitle: "何のエラーも残さずにメモリを使い切ってしまう問題を、本番サーバーのメモリダンプを取って突き止めました。",
			body: [
				{ heading: "背景" },
				"入社して4か月ほど経った頃のことでした。マシンごとのメモリ使用量が、不自然なほどばらばらでした。あるマシンは20GB 以上を使い、あるマシンは1GB ほどしか使っていませんでした。そして、ほぼすべてのマシンが4〜5日ほど経つと強制終了され、再起動していました。",
				{ heading: "原因を探す" },
				"最初は、再起動のルールがあるのだと思っていました。他チームのバックエンドサーバーは、実際に週に一度マシンを再起動していると聞きました。しかし、インスタンスがメモリを20GB も使うのは、再起動のルールとは関係なく、何かがおかしい状態でした。",
				API_MEMORY_CHART,
				"数日間モニタリングした結果、API サーバーのどこかでメモリリークが起きてインスタンスのメモリを使い切り、最後に OOM で強制終了されていることがわかりました。ところが Sentry にも AWS のモニタリングツールにも原因になりそうな痕跡が残っておらず、デバッグは難航しました。",
				{ heading: "メモリダンプを取る" },
				"チームリーダーから、本番サーバーのメモリダンプを取って調べてみようというアイデアをもらいました。正直、気が進みませんでした。ダンプを取っている間にサービスの障害率が上がるかもしれず、ダンプを持ってきても読み方がわからないので、意味のある結果を見つけるのは難しそうでした。それでも他に方法がなく、ひとまずやってみることにしました。",
				"調べてみると、メモリダンプのツールがいくつかありました。チームリーダーに共有し、本番サーバーに直接アクセスして、2つのツールでメモリをスキャンしました。1つ目のツールでは何も得られませんでしたが、2つ目のツールで、同じエラーが何度も発生したと思われるダンプログを見つけました。",
				{ heading: "原因と解決" },
				"数週間前に退職した開発者が、アプリのプッシュ送信を並列に変えたコードが問題でした。並列処理のためにスレッドを作るのですが、スレッドの中で exception が発生すると、そのスレッドが回収されずにそのまま残り、メモリリークが積み重なっていました。スレッド内部の処理ロジックに try/catch を付けてデプロイすると、それ以降すべてのインスタンスが1GB ほどしか使わない正常な状態に戻りました。",
				"最初は解決策がまったく思い浮かばず、ストレスを感じていました。結局、自分で開いて中をのぞいてみれば、答えは思ったより近くにあるということを学んだ作業でした。",
			],
		},
	],
	gallery: {
		open: "図を拡大して見る",
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
		open: "証書を拡大して見る",
		previous: "前の証書",
		next: "次の証書",
		close: "閉じる",
		pick: "証書を選ぶ",
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
					alt: "JLPT N1 の日本語能力認定書。生年月日と認定書番号・受験番号は隠している",
				},
			],
		},
		{
			period: "2026.09",
			title: "情報処理技師",
			host: "韓国産業人力公団",
			image: { src: asset("/certificates/01-gisa-632fa275.jpg"), alt: "情報処理技師の資格証" },
			gallery: [
				{
					src: asset("/certificates/01-gisa-632fa275.jpg"),
					width: 1400,
					height: 1982,
					caption: "情報処理技師",
					alt: "国家技術資格証。生年月日と資格番号・管理番号は隠している",
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
			// 같은 수상에 상장이 둘이다. 카드에는 총장상을 세우고, 열면 둘 다 넘긴다.
			image: { src: asset("/certificates/01-chongjangsang-7e6f9199.jpg"), alt: "東亜大学校 総長賞の賞状" },
			gallery: [
				{
					src: asset("/certificates/01-chongjangsang-7e6f9199.jpg"),
					width: 1400,
					height: 1980,
					caption: "総長賞",
					alt: "東亜大学校 総長名義の賞状",
				},
				{
					src: asset("/certificates/02-choiwoosusang-f026e085.jpg"),
					width: 1054,
					height: 1440,
					caption: "最優秀賞",
					alt: "東亜大学校 ソフトウェア革新センター長名義の最優秀賞の賞状",
				},
			],
		},
		{
			period: "2024",
			event: "LIKELION 大学12期 中央ハッカソン",
			title: "最優秀賞 2位",
			detail: "Younglimwon Soft Lab 特別賞",
			description: "**HEALIX**で、全国55校から1,500人あまりが集まった大会で受賞しました。",
			links: [{ name: "HEALIX", href: "/projects/healix" }],
			image: { src: asset("/certificates/03-likelion-cf3e21eb.jpg"), alt: "Younglimwon Soft Lab 特別賞の賞状" },
			gallery: [
				{
					src: asset("/certificates/03-likelion-cf3e21eb.jpg"),
					width: 1400,
					height: 1980,
					caption: "最優秀賞",
					alt: "LIKELION 大学12期 中央ハッカソン 最優秀賞、Younglimwon Soft Lab 特別賞の賞状",
				},
			],
		},
		{
			period: "2025",
			title: "国家優秀奨学金(理工系)",
			detail: "科学技術情報通信部長官 証書",
			description: "全国で約1,000人しか選ばれない国家優秀奨学金(理工系)を受給しました。",
			image: { src: asset("/certificates/04-scholarship-06cee5e1.jpg"), alt: "国家優秀奨学金(理工系)の証書" },
			gallery: [
				{
					src: asset("/certificates/04-scholarship-06cee5e1.jpg"),
					width: 1400,
					height: 1986,
					caption: "奨学証書",
					alt: "科学技術情報通信部長官名義の国家優秀(理工系)奨学証書。生年月日と証書番号は隠している",
				},
			],
		},
		{
			period: "2025",
			title: "Daangn Builder’s Camp",
			detail: "Daangn Market 修了証",
			description: "Daangn Market が選抜した、20人ほどの少数精鋭のハッカソンに選ばれました。",
			image: { src: asset("/certificates/05-daangn-2d3fb1c4.jpg"), alt: "Daangn Builder’s Camp の修了証" },
			gallery: [
				{
					src: asset("/certificates/05-daangn-2d3fb1c4.jpg"),
					width: 1400,
					height: 2052,
					caption: "修了証",
					alt: "株式会社 Daangn Market 名義の 2025 Daangn Builder’s Camp 修了証",
				},
			],
		},
	],
};

/* ------------------------------------------------------------------ *
 * Journey
 * ------------------------------------------------------------------ */

/**
 * The trunk carries the chapters — where I was — and each chapter branches
 * into what actually happened there. A chapter head is the place itself, so an
 * enrolment is never repeated as an event under it; a graduation is, but only
 * where it is the turn that the next chapter came out of.
 */
/**
 * 택스팩 커뮤니티의 화면. 2015년에 남긴 캡처라 600px 짜리뿐이고, 뷰어도 그 크기
 * 그대로 보여 준다. 들어와서(메인) → 내 게시판 → 개설 → 새 게시판 → 이벤트 →
 * 갤러리형 게시판 → 관리 순으로, 서비스를 한 바퀴 도는 차례다.
 */
const TAXPACK_SCREENS: readonly Media[] = [
	{
		src: asset("/journey/taxpack/01-home.png"),
		width: 600,
		height: 417,
		caption: "メイン画面",
		alt: "タックスパック コミュニティのメイン画面。緑の上部メニューの下に、掲示板の一覧と最新の投稿、バナーが並んでいる",
	},
	{
		src: asset("/journey/taxpack/02-boards.png"),
		width: 600,
		height: 348,
		caption: "自分の掲示板一覧",
		alt: "あるユーザーが運営する掲示板の一覧。掲示板名と運営者、開設日が並び、管理・閉鎖ボタンが付いている",
	},
	{
		src: asset("/journey/taxpack/03-create.png"),
		width: 600,
		height: 374,
		caption: "掲示板の開設",
		alt: "掲示板開設のフォーム。タイトルと種類、アドレスを入力し、ロゴをアップロードする画面",
	},
	{
		src: asset("/journey/taxpack/04-new-board.png"),
		width: 600,
		height: 466,
		caption: "新しく作った掲示板",
		alt: "開設したばかりの掲示板。ロゴを登録するよう促す案内の下で、お知らせと掲示板一覧が空になっている",
	},
	{
		src: asset("/journey/taxpack/05-event.png"),
		width: 600,
		height: 563,
		caption: "イベント管理",
		alt: "イベントの一覧と追加フォーム。タイトルと実施日、オン・オフのスイッチ、エディタがある",
	},
	{
		src: asset("/journey/taxpack/06-gallery.png"),
		width: 600,
		height: 480,
		caption: "ギャラリー型掲示板",
		alt: "あるユーザーが開いた Photoshop ギャラリー掲示板。天気ウィジェットの下に、絵がタイル状に並んでいる",
	},
	{
		src: asset("/journey/taxpack/07-admin.png"),
		width: 600,
		height: 635,
		caption: "掲示板の管理",
		alt: "掲示板の管理画面。ロゴの登録、掲示板のタイプと名前の変更、会員数とブラックリストの管理が1ページにまとまっている",
	},
];

/** 초등학교 졸업식 사진 한 장. 무대 화면에 장래희망이 컴퓨터 프로그래머라고 적혀 있다. */
const DREAM_PHOTOS: readonly Media[] = [
	{
		src: asset("/journey/dream/01-note.jpg"),
		width: 2000,
		height: 1125,
		caption: "2015年2月、小学校の卒業式",
		alt: "卒業式の舞台スクリーンを撮った写真。「卒業おめでとうございます」の下に、進学先の学校とともに、将来の夢がコンピュータープログラマーと書かれている",
	},
];

/**
 * MyRunnerGame 의 화면. 2020년 8월 폰에서 찍은 20:9 캡처를 그대로 쓴다.
 * 제목 → 조작법 → 플레이 → 결과 → 랭킹, 한 판을 도는 차례다.
 */
const MYRUNNER_SCREENS: readonly Media[] = [
	{
		src: asset("/journey/myrunnergame/01-title.jpg"),
		width: 2400,
		height: 1080,
		caption: "タイトル画面",
		alt: "MyRunnerGame のタイトル画面。畳の部屋を背景に、シングルプレイ・1対1マッチ・ランキング・クレジットのメニューとニックネーム入力、チュートリアルボタンがある",
	},
	{
		src: asset("/journey/myrunnergame/02-tutorial.jpg"),
		width: 2400,
		height: 1080,
		caption: "操作方法",
		alt: "操作方法の画面。左から右にスライドすると右へ、右から左にスライドすると左へ動くという案内",
	},
	{
		src: asset("/journey/myrunnergame/03-play.jpg"),
		width: 2400,
		height: 1080,
		caption: "プレイ",
		alt: "プレイ画面。都会の道路を走るキャラクターの前にゴミ箱の障害物があり、左上でスコアが上がっていく",
	},
	{
		src: asset("/journey/myrunnergame/04-result.jpg"),
		width: 2400,
		height: 1080,
		caption: "結果",
		alt: "結果画面。倒れたキャラクターの上に、スコア152、ランキング12位、記録が表示される",
	},
	{
		src: asset("/journey/myrunnergame/05-ranking.jpg"),
		width: 2400,
		height: 1080,
		caption: "ランキング",
		alt: "ランキング画面。ニックネームとスコア、日付が順位どおりに10行並んでいる",
	},
];

/**
 * VR 게임 두 편의 플레이 영상. 포스터와 같이 R2 의 journey/videos 에 있다. 갤러리에서
 * 영상은 늘 맨 뒤 장이다 — 화면을 먼저 넘겨 보고, 마지막에 튼다.
 */
const JOURNEY_VIDEO = asset("/journey/videos");

/**
 * VRTetris 의 VR 화면 세 장과 플레이 영상. 원본 캡처는 양안이 나란한 스테레오라 왼쪽 눈
 * 절반만 잘라 썼다 — 1154×1154. 영상은 늘 맨 뒤에 둔다.
 */
const VRTETRIS_SCREENS: readonly Media[] = [
	{
		src: asset("/journey/vrtetris/01-lobby.jpg"),
		width: 1154,
		height: 1154,
		caption: "ロビー",
		alt: "VRTetris のロビー。海の上の木の板に、TETRIS のロゴとニックネーム入力欄、仮想キーボードが浮かんでいる",
	},
	{
		src: asset("/journey/vrtetris/02-play.jpg"),
		width: 1154,
		height: 1154,
		caption: "プレイ",
		alt: "VRTetris のプレイ画面。夕焼けの野原に立てられた緑の板の中にブロックが積み上がり、左にスコア2,290が浮かんでいる",
	},
	{
		src: asset("/journey/vrtetris/03-result.jpg"),
		width: 1154,
		height: 1154,
		caption: "結果とランキング",
		alt: "VRTetris の結果画面。自分のスコアと、グローバル・ローカルのランキングボードが野原に立てられている",
	},
	{
		video: `${JOURNEY_VIDEO}/vrtetris.mp4`,
		src: asset("/journey/videos/vrtetris-poster.jpg"),
		width: 1280,
		height: 720,
		caption: "プレイ動画",
		alt: "VRTetris のプレイ動画。海辺のロビーでニックネームを入れて始めると、砂漠に立てられた板に VR コントローラーでブロックを落として列を消し、スコアを上げていく",
	},
];

/**
 * Tooth 의 화면 여섯 장. 2019년 캡처라 700px 안팎이다. 로비 → 섬 전경 → 블록 →
 * 큐브 → 레벨 안내 → 게임 오버, 한 판을 도는 차례다.
 */
const TOOTH_SCREENS: readonly Media[] = [
	{
		src: asset("/journey/tooth/01-lobby.jpg"),
		width: 1238,
		height: 605,
		caption: "ロビー",
		alt: "Tooth のロビー。Tooth のロゴの下に名前の入力と PLAY ボタン、EASY から EXPERT までの難易度選択があり、横にサーバーランキングと自分のランキングのボードがある",
	},
	{
		src: asset("/journey/tooth/02-island.jpg"),
		width: 831,
		height: 720,
		caption: "島の全景",
		alt: "海に浮かぶ草原の島と、その上のブロックの山、空に浮かぶキューブを見下ろした全景",
	},
	{
		src: asset("/journey/tooth/03-blocks.jpg"),
		width: 747,
		height: 710,
		caption: "ブロック",
		alt: "島の上にぎっしり置かれた紫色のブロックと木、柵を近くから見た画面",
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
		caption: "レベル案内",
		alt: "曇り空の上に LEVEL: HARD, STAGE: 2 Lv と浮かんでいる画面",
	},
	{
		src: asset("/journey/tooth/06-game-over.jpg"),
		width: 738,
		height: 702,
		caption: "ゲームオーバー",
		alt: "GAME OVER の画面。スコア180、レベル6と HOME ボタンがある",
	},
];

/**
 * Unrevived 의 화면 네 장과 플레이 영상. 총을 든 두 장은 스테레오 캡처의 왼쪽 눈 절반이라
 * 480px 밖에 안 된다. 영상은 늘 맨 뒤에 둔다.
 */
const UNREVIVED_SCREENS: readonly Media[] = [
	{
		src: asset("/journey/unrevived/01-lobby.jpg"),
		width: 1235,
		height: 673,
		caption: "ロビー",
		alt: "Unrevived のロビー。遺跡の間に浮かぶ板に、unrevived のロゴと名前の入力欄、マップ選択と仮想キーボードがある",
	},
	{
		src: asset("/journey/unrevived/02-village.jpg"),
		width: 1271,
		height: 711,
		caption: "村",
		alt: "月の出た夕暮れの、中世風の村。石畳の上にキャラクターが1人立っている",
	},
	{
		src: asset("/journey/unrevived/03-pistol.jpg"),
		width: 480,
		height: 479,
		caption: "拳銃",
		alt: "拳銃を持った一人称視点。銃の横に Pistol という名前と、残弾数100が浮かんでいる",
	},
	{
		src: asset("/journey/unrevived/04-smg.jpg"),
		width: 480,
		height: 479,
		caption: "サブマシンガン",
		alt: "夕焼けの通りで SMG11 を持った一人称視点。弾数261と30が浮かんでいる",
	},
	{
		video: `${JOURNEY_VIDEO}/unrevived.mp4`,
		src: asset("/journey/videos/unrevived-poster.jpg"),
		width: 1280,
		height: 720,
		caption: "プレイ動画",
		alt: "Unrevived のプレイ動画。廃墟となった遺跡の間を VR で歩き回り、SMG で敵を撃つ一人称シューティングゲーム",
	},
];

/**
 * KNU 코딩플랫폼의 화면 여섯 장. 2021년 1800×1080 캡처 그대로. 홈 → 공지 → 대회 →
 * 문제 풀이 → 성취도 → 역할, 대회 하나를 여는 차례다.
 */
const CODEDURI_SCREENS: readonly Media[] = [
	{
		src: asset("/journey/codeduri/01-home.png"),
		width: 1800,
		height: 1080,
		caption: "ホーム",
		alt: "KNU コーディングプラットフォームのホーム。お知らせと FAQ のボックスの下にプログラミングコンテストのカードが3枚並び、その下に江原大学校のフッターがある",
	},
	{
		src: asset("/journey/codeduri/02-notice.png"),
		width: 1800,
		height: 1080,
		caption: "お知らせ",
		alt: "お知らせの記事を1つ開いた画面。お知らせ・FAQ・全講座・コンテストのタブの下に、タイトルと作成者、本文がある",
	},
	{
		src: asset("/journey/codeduri/03-contest.png"),
		width: 1800,
		height: 1080,
		caption: "コンテストのページ",
		alt: "江原大学校コーディングコンテストのページ。ジャガイモの写真のバナーの下に、大会紹介・問題・達成度・役割・Q&A のタブがあり、Overview と Introduction、教員とお知らせの欄が続く",
	},
	{
		src: asset("/journey/codeduri/04-problem.png"),
		width: 1800,
		height: 1080,
		caption: "問題を解く",
		alt:
			"問題を解く画面。左に問題の説明と制約、入出力の例があり、右の暗いコードエディタに答えを書いて提出する",
	},
	{
		src: asset("/journey/codeduri/05-scores.png"),
		width: 1800,
		height: 1080,
		caption: "達成度",
		alt:
			"コンテストの達成度画面。バナーの下に問題ごとの合否が緑の印で表示され、参加者ごとのスコアと順位が表にまとめられている",
	},
	{
		src: asset("/journey/codeduri/06-roles.png"),
		width: 1800,
		height: 1080,
		caption: "役割の管理",
		alt: "コンテストの役割ページ。参加者を検索し、学籍番号と学科、名前ごとに役割を割り当てる表",
	},
];

export const journey: JourneyContent = {
	label: "Journey",
	chapters: [
		{
			period: "2013 – 2018",
			title: "小・中学校",
			events: [
				{
					year: "2014",
					title: "Linux 環境でマインクラフトの24時間サーバーを構築",
					featured: true,
					detail: "VPS サーバーを借りてサーバーを構築し、最大同時接続者数120人を達成しました。",
				},
				{
					year: "2015",
					title: "小学校を卒業",
					detail: "コンピュータープログラマーを**将来の夢**に掲げ、それが今も続いています。",
					links: [{ name: "将来の夢", gallery: DREAM_PHOTOS }],
				},
				{
					year: "2015",
					title: "**タックスパック コミュニティ**の開発",
					featured: true,
					detail: "PHP で動く少人数グループ向けのサービスを開発し、会員数100人ほどを達成しました。",
					links: [{ name: "タックスパック コミュニティ", gallery: TAXPACK_SCREENS }],
				},
				{
					year: "2017",
					title: "**スクリーン翻訳機**の開発",
					featured: true,
					detail:
						"スマートフォンを振ると画面の上に翻訳のオーバーレイを表示するアプリを開発し、1,000ダウンロードと収益化を経験しました。",
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
					title: "モバイルコンテンツコンテストで受賞",
					detail: "**スクリーン翻訳機**で、校内大会で2位を受賞しました。",
					links: [{ name: "スクリーン翻訳機", gallery: SCREEN_TRANSLATOR_SCREENS }],
				},
				{
					year: "2019",
					title: "VR ゲームの開発",
					featured: true,
					detail: "Unreal Engine を使って、**VRTetris**、**Tooth**、**Unrevived** の VR ゲームを開発しました。",
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
					detail: "Unreal Engine を使って、**MyRunnerGame** というモバイルゲームを開発しました。",
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
					detail: "江原大学校 SW 中心大学事業団が進めたコーディングプラットフォームの構築事業で、チームリーダーを務めました。",
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
					detail: "何のエラーも残さずにメモリを使い切ってしまう問題を、本番サーバーのメモリダンプを取って突き止めました。",
				},
				{
					year: "2022",
					title: "月1,000万ウォンを超えていた AWS 費用を30%削減",
					detail: "安くて性能の良い Graviton インスタンスに移し、インスタンスの増減ルールを組み直しました。",
				},
				{
					year: "2023",
					title: "19億件のテーブルをメンテナンス1時間以内にマイグレーション",
					featured: true,
					detail: "移すデータに優先順位をつけ、いつでも元に戻せるマイグレーションスクリプトを用意しました。",
				},
				{
					year: "2023",
					title: "毎分1,500件のリクエストを受けるサービスのリファクタリング",
					featured: true,
					detail: "DynamoDB と Redis で設計し直し、6時間に一度更新されていたランキングを、リアルタイムで動くようにしました。",
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
					detail: "**HEALIX**で、全国55校から1,500人あまりが集まった大会で受賞しました。",
					links: [{ name: "HEALIX", href: "/projects/healix" }],
				},
				{
					year: "2024",
					title: "国際交流処のバディプログラム",
					detail:
						"日本から来た交換留学生1人を担当して学校生活をサポートし、サークルで良い思い出を作れるよう手助けしました。",
				},
				{
					year: "2025",
					title: "国家優秀奨学金(理工系)",
					detail: "全国で約1,000人しか選ばれない国家優秀奨学金(理工系)を受給しました。",
				},
				{
					year: "2025",
					title: "日本・鳥取大学へ交換留学",
					featured: true,
					detail: "日本での実際の生活を体験し、茶道部で伝統文化を学びました。",
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
		open: "写真を拡大して見る",
		previous: "前の写真",
		next: "次の写真",
		close: "閉じる",
		pick: "写真を選ぶ",
	},
};
