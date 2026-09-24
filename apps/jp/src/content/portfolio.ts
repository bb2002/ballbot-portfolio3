/**
 * Copy and asset paths for the Japanese build — the Korean build's copy,
 * translated line for line. Nothing is added, dropped or reordered: the same
 * sections, the same stories, the same figures and the same pictures, so an
 * edit to apps/kr/src/content/portfolio.ts has to be carried over here.
 *
 * Screenshots, scans and recordings come from the same asset bucket as the
 * Korean build through `asset()`; only the words around them are Japanese.
 * Institution names are given in their Japanese forms where one exists
 * (동아대학교 → 東亜大学校) and in katakana where it does not, with the product
 * brands left in their own spelling.
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
	 * As on the Korean build the headline is a relative clause that does not
	 * close on its own — `subtitle` is the noun it lands on. Reword one and the
	 * other has to follow.
	 */
	// TODO(placeholder): draft copy around the 816万 figure, carried over from the
	// Korean build. The number and the verb are both unconfirmed there too.
	headline: "816万人のユーザーが使う\nサービスを守ってきた",
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
			caption: "Nudge Healthcare の Timespread・Linkareer チームでバックエンドを担当",
			items: [
				{
					emphasis: "19億件のテーブルを",
					detail: "メンテナンス時間1時間以内にマイグレーション",
					href: "/experience/bigint-migration",
				},
				{ emphasis: "毎分1,500件のリクエストを受ける", detail: "サービスをリファクタリング", href: "/experience/realtime-redesign" },
				{ emphasis: "月1,000万ウォンを超えていた AWS 費用を", detail: "30%削減", href: "/experience/aws-cost" },
				{ emphasis: "32GB を超えるメモリを占有して止まっていた", detail: "API サーバーを正常化", href: "/experience/api-memory" },
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
		alt: "コスモのノートのトップ画面。「動画講義に振り回されないで」というコピーの横に、要約ノート・クイズ・スクリプトのカードが浮かんでいる",
	},
	{
		src: asset("/projects/cosmonote/02-features.png"),
		width: 1537,
		height: 763,
		caption: "機能",
		alt: "機能紹介の画面。要約ノート、動画タイムライン、クイズの自動生成、暗記カード、コメントをカードで並べている",
	},
	{
		src: asset("/projects/cosmonote/03-note.png"),
		width: 1537,
		height: 763,
		caption: "要約ノート",
		alt: "ノート画面。左に講義動画とタイムライン、右に EC2 インスタンスへのデプロイ実習をまとめた要約ノートがある",
	},
	{
		src: asset("/projects/cosmonote/04-quiz-create.png"),
		width: 1537,
		height: 763,
		caption: "クイズを作る",
		alt: "クイズ作成のダイアログ。問題数と、選択式・短答式などの出題形式を選んでいるところ",
	},
	{
		src: asset("/projects/cosmonote/05-quiz-solve.png"),
		width: 1537,
		height: 763,
		caption: "クイズを解く",
		alt: "クイズの解答画面。10問中1問目を解いていて、進み具合と一時保存の状態が見える",
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
		alt: "暗記カードの学習画面。25枚のデッキの1枚目と、「知ってる」「知らない」「スキップ」の集計がある",
	},
	{
		src: asset("/projects/cosmonote/08-public-notes.png"),
		width: 1537,
		height: 763,
		caption: "公開ノート",
		alt: "公開ノートを探す画面。検索欄の下に、ほかの人が公開したノートがカードで並んでいる",
	},
	{
		src: asset("/projects/cosmonote/09-api.png"),
		width: 1537,
		height: 763,
		caption: "開発者向け API",
		alt: "開発者向け API の紹介画面。資料のアップロードから要約ノート・クイズの取得までのエンドポイントを、ターミナル風のカードに記している",
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
		alt: "トンネルの概要画面。発行された接続アドレスと接続状態、プラグインが使うキーのペア、トラフィックの使用量が表示されている",
	},
	{
		src: asset("/projects/waterflake/03-server-connect.png"),
		width: 1052,
		height: 513,
		caption: "サーバーの接続",
		alt: "ゲームサーバーのコンソール。プラグインが20本のトンネルを開き、トンネリングに成功して、発行されたドメインにつながった",
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
		alt: "enqor のストア用メイン画像。「わたしの平凡さが輝く瞬間」というコピーの下に、アプリ画面を表示したスマホが2台置かれている",
	},
	{
		src: asset("/projects/enqor/02-login.jpg"),
		width: 1080,
		height: 2400,
		caption: "ログイン",
		alt: "enqor のログイン画面。電話番号と、Google・カカオトークのログインボタンがある",
	},
	{
		src: asset("/projects/enqor/03-home.jpg"),
		width: 1080,
		height: 2400,
		caption: "専門家を探す",
		alt: "ホーム画面。テーマ別の専門家カードが横に並び、その下に自分とつながっている専門家と、今すぐ話せる専門家がいる",
	},
	{
		src: asset("/projects/enqor/04-profile.jpg"),
		width: 1080,
		height: 2400,
		caption: "専門家のプロフィール",
		alt: "専門家のプロフィール画面。認証済みの肩書きとハッシュタグが付いていて、下に通話リクエストのボタンがある",
	},
	{
		src: asset("/projects/enqor/05-request.jpg"),
		width: 1080,
		height: 2400,
		caption: "通話リクエスト",
		alt: "通話リクエストのシート。保有クラップと1秒あたりの接続料金を示し、ビデオか音声かを選ばせる",
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
		alt: "発信側の画面。カメラが先に起動した状態で「接続中」と表示され、残り時間と保有クラップが見える",
	},
	{
		src: asset("/projects/enqor/09-incoming.jpg"),
		width: 1080,
		height: 2220,
		caption: "リクエストの受信",
		alt: "着信側の画面。相手の認証済みの肩書きとハッシュタグが付いたリクエストカードに、拒否と承諾のボタンがある",
	},
	{
		src: asset("/projects/enqor/10-call.jpg"),
		width: 2000,
		height: 1500,
		caption: "通話",
		alt: "スマホ2台を並べて、実際にビデオ通話をしている写真。両方の画面にお互いのカメラ映像が映っている",
	},
	{
		src: asset("/projects/enqor/11-review.jpg"),
		width: 1080,
		height: 2400,
		caption: "レビュー",
		alt: "通話が終わったあとのレビュー画面。通話時間と5段階の評価、良かった点を選ぶタグがある",
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
		alt: "HEALIX の発表資料の表紙。「症状の分析から近くの病院まで」というコピーの横に、近くの病院と予約情報を表示したスマホが置かれている",
	},
	{
		src: asset("/projects/healix/02-background-1e2c9b10.png"),
		width: 1244,
		height: 652,
		caption: "企画の背景",
		alt: "企画の背景のスライド。痛みを自分で検索する画面と、途切れず続く検索数のグラフで課題を示している",
	},
	{
		src: asset("/projects/healix/03-flow-fb243485.png"),
		width: 1244,
		height: 652,
		caption: "症状の入力と病院の予約",
		alt: "サービスの流れのスライド。部位を選んで症状を書く画面と、分析結果からそのまま近くの病院を予約する画面が並んでいる",
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
		note: "スマホを振るとすぐに画面をキャプチャし、画像を OCR にかけてテキストを抽出、翻訳エンジンで訳してオーバーレイで表示する翻訳サービスです。\n\n翻訳には Google 翻訳を使っていましたが、API キーの管理について知識がなく、キーをクライアントアプリにそのまま埋め込んでいました。1,000人ほどにダウンロードされた頃にキーが流出し、1日で数十万ウォンものサーバー代が発生しているのを見て、すぐにサービスを取り下げたというハプニングもありました。",
	},
	{
		src: asset("/projects/screen-translator/02-web.jpg"),
		width: 560,
		height: 996,
		alt: "日本語の Web ページの上に韓国語の訳文が重なり、上部に原語の検出と翻訳先の言語を選ぶ行がある",
	},
	{
		src: asset("/projects/screen-translator/03-settings.jpg"),
		width: 560,
		height: 996,
		alt: "基本設定の画面。翻訳する言語の組み合わせ、認識の精度、翻訳のディレイ、AI 翻訳を使うかどうかを選ぶ",
	},
	{
		src: asset("/projects/screen-translator/04-sensitivity.jpg"),
		width: 560,
		height: 996,
		alt: "感度設定の画面。どれくらい強く振ったら認識するかをスライダーで調整し、その場で振って試せる",
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
		caption: "コスモスダウンローダー",
		alt: "大学の講義サイトの動画ビューア。拡張機能が上部バーの右側に追加したダウンロードボタンが赤丸で囲まれている",
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
		caption: "Web から動画を読み込む",
		alt: "コスモのノートのトップ画面。大学の LMS と動画の URL、ID とパスワードを入力するフォームの横に大学の講義サイトのウィンドウが重なり、講義の URL がフォームに入る矢印が描かれている",
	},
	note: {
		src: asset("/projects/cosmonote/story/04-note-page.jpg"),
		width: 1280,
		height: 829,
		caption: "生成されたノート",
		alt: "ノート画面。左に講義動画とスクリプト、右に SSH で Linux サーバーに接続する授業をまとめた要約の目次がある",
	},
	renewal: {
		src: asset("/projects/cosmonote/story/05-renewal.png"),
		width: 1660,
		height: 897,
		caption: "リニューアルしたノート画面",
		alt: "リニューアル後のノート画面。左にアップロードした講義動画とタイムライン、右に EC2 インスタンスへのデプロイ実習をまとめた要約ノートと、クイズ・暗記カードのタブがある",
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
	caption: "アップロードからノート生成まで",
	alt: "コスモのノートの構成図。動画や PDF ファイルが R2 に入り、estimator と summarizer の2つのコンテナを経て、Worker と LLM がノートを作る流れが手描きの箱と矢印でつながっている。R2 から Worker までは cloudflare と書かれた点線の中にある",
};

/**
 * 코스모의 노트, 긴 글. 카드의 두 줄이 대신 서 있던 기록으로, /projects/cosmonote 에
 * 놓인다. 화면은 카드의 갤러리(COSMO_SCREENS)를 그대로 슬라이더로 넘긴다.
 */
const cosmoStory: ProjectStoryContent = {
	tagline: "動画や PDF などの授業資料を要約するサービス",
	highlights: [
		"動画ファイルの音声データだけでなく、映像の中のプレゼン資料まで解析するための試行錯誤",
		"ユーザー1人のために高性能マシンを24時間動かしておかなければならない、コスト最適化の問題",
	],
	facts: [
		{ term: "参加人数", detail: "個人" },
		{ term: "開発期間", detail: "2025.05 ~ 現在" },
		{ term: "主な技術", detail: "Cloudflare Workers, R2, Containers" },
	],
	motivation: [
		"副専攻のクラウド学科は、動画講義が中心の授業でした。基礎科目はすでに知っている内容がほとんどでしたが、試験や課題のために、分かっている講義をもう一度聞かなければならない非効率な状況がよくありました。",
		"最初は講義サイトから動画をダウンロードし、他社のサービスで要約していました。しかし、動画の要約には高すぎる費用がかかりました。ここに不便さを感じ、動画のダウンロードから要約までを低コストで一度に済ませられるサービスを作ろうと企画したのが、コスモのノートです。",
	],
	steps: [
		{
			// TODO(confirm): 원문은 "25. 09월"이었으나 다음 단계(25. 08월)보다 뒤라 개발
			// 기간의 시작(2025.05)에 맞췄다. 실제 달이 다르면 여기만 고친다.
			period: "2025.05",
			title: "コスモスダウンローダー",
			images: [COSMO_STEP_SCREENS.downloader],
			paragraphs: [
				"最初は、講義サイトの右側にダウンロードボタンを追加するブラウザ拡張機能を作ってみました。ダウンロードボタンを押すと、拡張機能が通信内容をもとにストリーミングファイルの実際の URL を割り出し、サーバーに送ります。サーバーは ts 形式のストリーミングファイルをダウンロードして mp4 にエンコードし、ユーザーに渡すというシンプルな構成でした。この拡張機能は、学生180人あまりから「いいね」をもらえるほど好評でした。",
			],
		},
		{
			period: "2025.08",
			title: "要約機能の追加",
			images: [COSMO_STEP_SCREENS.summary],
			paragraphs: [
				"AI ノートの生成機能を追加し、ダウンロードボタンを講義のホーム画面に移しました。ダウンロードボタンを押すと、Cloudflare Browser を通じてサーバーが直接講義サイトにアクセスする構成に変えました。ログインは、拡張機能から渡されたセッションキーをサーバー側のブラウザに埋め込んで突破するよう設計しました。この設計は、のちにブラウザ拡張機能を完全になくすための布石でした。AI ノートの生成機能には決済を連携し、収益化の仕組みまで作りました。",
			],
		},
		{
			period: "2026.04",
			title: "拡張機能の廃止",
			images: [COSMO_STEP_SCREENS.webImport, COSMO_STEP_SCREENS.note],
			paragraphs: [
				"ブラウザ拡張機能は使い勝手がよくありませんでした。ユーザーのブラウザに深くアクセスできる点は良かったものの、特定のブラウザに依存し、モバイルでは動かず、何より拡張機能を知っている人が多くありませんでした。そこで、拡張機能なしで Web サイトだけで動くよう、大幅に改善しました。",
				"Web サイトで大学サイトのログイン情報と講座の URL を受け取ると、Cloudflare Browser でサイトに直接ログインし、パケットを検出して動画を見つけ出す構成に変えました。ソフトウェアが複雑になった分バグは増えましたが、使い勝手は大きく向上しました。",
			],
		},
		{
			period: "2026.09",
			title: "汎用の動画要約サイトへリニューアル",
			images: [COSMO_STEP_SCREENS.renewal],
			paragraphs: [
				"これまでの構成は、大学のサイト以外からは動画を読み込めない、依存度のとても高いものでした。サービスの成長の妨げになるうえ、何より著作権のある大学の動画を加工して有料で販売することには法的なリスクがありました。ただ、サービスのアイデンティティである大学動画のダウンロードと読み込みの機能はなくしづらかったため拡張機能に移し、動画や PDF ファイルなどをアップロードしてもらう方式へとサービスをリニューアルしました。",
			],
		},
	],
	architecture: {
		label: "Architecture",
		items: [
			{
				title: "サービスのコストを最適化するための工夫",
				body: [
					"コスモのノートは ffmpeg で動画ファイルを処理する必要があるため、高性能なマシンが欠かせません。しかし初期はユーザーが多くなく、高性能なインスタンスを常に立ち上げておくのは非常に非効率でした。この問題を解決したのがサーバーレス構成です。サーバーレスは、必要なサイズのコンピューティングを使った分だけ費用を払えばよいので、このサービスにぴったりでした。",
					COSMO_ARCHITECTURE,
					"Workers は最大 100MB までしかアップロードを受け付けないため、ユーザーのファイルを自前のサーバー経由で受け取ることはできません。そこでサーバーは、ユーザーからリクエストがあるとバケットに直接アップロードできる Presigned URL を発行し、クライアントはこの URL を使って目的のファイルをアップロードします。",
					"アップロードされたファイルが正常かどうかは、estimator コンテナがチェックします。壊れたファイルや不正なファイルでないかを確認し、問題がなければファイルをサンプリングして、要約にかかる費用を見積もります。ユーザーがこの費用を支払うと、要約ノートの生成が始まります。",
					"リクエストを受けた summarizer は、ファイルを拡張子に応じて処理します。動画はフレームの変化を検出して最も重要だと判断したシーンを抜き出し、OCR でテキスト化します。音声は STT で書き起こします。OCR と STT の結果をうまくマージして、ひとつのタイムラインにまとめます。",
					"summarizer の結果は、ふたたび Worker が引き継ぎます。あらかじめ用意したプロンプトとテキスト化した資料を AI に渡し、ノートを生成します。開発初期は Claude のような高性能なフラッグシップモデルを使っていましたが、今は Gemini Flash や DeepSeek のようなコスト効率の高いモデルを使っています。ノートの品質が落ちないようにパイプラインを目次の生成、本文の生成、推敲に分け、高性能モデルにできるだけ近い結果が出るよう、ハーネスで定期的にチェックしながらアップデートしています。",
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
		caption: "Ping で定義した安定した通話",
		alt: "通話精算のシーケンス。発信者と受信者が両側に、サーバーが中央にあり、毎秒 Ping がやり取りされる間はサーバーが料金を請求し、Ping が3回途切れると請求を止め、戻ると再開し、7回途切れると通話を終了する",
	},
	balance: {
		src: asset("/projects/enqor/story/02-balance-session.png"),
		width: 2400,
		height: 1040,
		caption: "通話セッションの残高",
		alt: "残高処理の構成図。通話が始まると DB のキャッシュをロックし、Redis のセッションに複製する。残高は毎秒減り、チャージすると増え、プレゼントすると減る。残り時間は残高から計算してクライアントに返し、通話が終わると DB に書き戻す",
	},
	docs: {
		src: asset("/projects/enqor/story/03-docs-to-code.png"),
		width: 2400,
		height: 600,
		caption: "企画書からコードまで",
		alt: "PDF の企画書と Figma のデザインを手作業でひとつの Markdown にまとめ、そのドキュメントをエージェントがソースコードに落とし込む流れ",
	},
	harness: {
		src: asset("/projects/enqor/story/04-harness-loop.png"),
		width: 2400,
		height: 640,
		caption: "先に Web で画面を実装するハーネス",
		alt: "ハーネスのフロー図。エージェントが画面を expo web で実装すると、批判的エージェントが Figma と照らし合わせて評価し、直すべき点があればエージェントに差し戻し、合格すればアプリに移す",
	},
} as const satisfies Record<string, Media>;

/**
 * enqor, 긴 글. /projects/enqor 에 놓인다. 화면은 카드의 갤러리(ENQOR_SCREENS)를
 * 그대로 슬라이더로 넘긴다. 날짜별 이력은 없어 History 섹션이 빠진다.
 */
const enqorStory: ProjectStoryContent = {
	tagline: "1対1の専門家相談サービス",
	highlights: [
		"通話が安定してつながっているときだけ、秒単位で料金を精算しなければならないエンジニアリング上の課題",
		"AI エージェントの応答を、人がボトルネックにならずに検証しなければならない課題",
	],
	facts: [
		{ term: "参加人数", detail: "3名" },
		{ term: "担当", detail: "アプリおよびサーバーの開発" },
		{ term: "主な技術", detail: "Agora（ストリーミング）, NestJS（GraphQL）, Expo" },
	],
	motivation: [
		"最近は多くの人が ChatGPT などの生成 AI を使って、さまざまな質問や相談をしています。しかし悩み相談では、AI 特有の心のこもっていない会話にうんざりしてしまうことが多く、医療や受験相談のような専門分野では、AI はまだ力不足でした。医師のような専門家から、恋愛経験の長い人のような気軽なテーマまで、自分が自信のある分野の専門家として誰かの悩みを聞き、収益を得られるプラットフォームが必要だと感じ、Align Networks に加わってこのプロジェクトを開発しました。",
	],
	architecture: {
		label: "Architecture",
		items: [
			{
				title: "悩み1：通話が安定してつながっているときだけ、秒単位で料金を精算する",
				body: [
					"enqor は、ビデオ・音声通話が中核となる技術です。ストリーミングは Agora を使ったので苦労はありませんでしたが、精算パイプラインは自分たちで実装しなければならない重要な課題でした。とくにモバイルは通信状態が不安定なことが多いため、通話がきちんと成立した場合だけ精算する必要があり、秒単位の課金ロジックまで求められたので、技術的な難易度は高いものでした。",
					ENQOR_FIGURES.billing,
					"まずは「安定した通話」を定義する必要があります。これは、サーバーとクライアント間の Ping の状態を使って定義しました。どちらか一方でも Ping が3回以上途切れたら接続に問題があると判断し、料金の減算を止めます。7回途切れたら通話が切断されたとみなし、通話セッションを終了することにしました。",
					"通話中は毎秒、サーバー側で料金を精算する必要がありました。最初は単純に、通話時間から不安定だった時間を差し引き、通話終了後にデータベースを更新しようと考えていました。しかし要件として、通話の途中でキャッシュをチャージできなければならず、チャージしたキャッシュをお互いにプレゼントすることもできなければなりませんでした。さらに、通話できる時間が残り20秒以下になったら、まもなく通話が終わることをクライアントに知らせる必要もありました。リアルタイムにキャッシュをチャージ・消費・参照しなければならない以上、今残っているキャッシュをどこかに保存し、リアルタイムに更新するのが要件をすっきり満たせる方法だと判断しました。",
					ENQOR_FIGURES.balance,
					"通話が始まると、受信者と発信者のキャッシュは DB 上でロックされます。値を読み取り、Redis に保存した通話セッションに発信者のキャッシュを格納しておきます。ここからは、この値が使えるキャッシュの残高になります。この値を毎秒リアルタイムに更新します。チャージやプレゼントが発生したら、この値を更新し、DB には購入履歴だけを保存すれば済みます。残りの通話時間も、サーバー側で残りのキャッシュからすぐに計算してクライアントに伝えられます。通話が終わったら Redis に保存した残りのキャッシュを DB に書き戻せば、わずか2回のクエリで複雑なビジネス要件を満たせます。",
				],
			},
			{
				title: "悩み2：AI エージェントの応答をどう検証するか？",
				body: [
					"enqor は、人が直接プログラミングしたものではありません。事前に書かれた企画書をどうすれば AI にうまく渡せるか、どうすれば最良の応答を引き出せるか、そしてその応答をどう検証すべきかを、長いあいだ考え続けました。",
					ENQOR_FIGURES.docs,
					"企画チームが用意したのは、PDF の企画書と Figma で作られたデザインファイルです。最初は AI が読みやすいように、Markdown ファイルで Figma のノードと PDF のページを手作業で結びつけ、あちこちに説明も書き添えました。こうして完成した約800行の企画書を渡して、AI エージェントにプロジェクトを最後まで仕上げるよう指示しました。30分ほどでプロジェクトがひとつ出来上がりましたが、動かしてみると結果はめちゃくちゃでした。ある程度は予想していたものの、まさか起動すらしないとは思っておらず、なんとか直してログイン画面にたどり着くと、Figma で定義したデザインはまったく反映されておらず、ログインなどの機能はモックで実装された、まるででたらめなプロジェクトでした。",
					"でたらめな成果物を前に、どうすれば自分が求めるレベルの完成度を持つ応答を引き出せるのかを考えました。顧問が「ハーネスエンジニアリング」という概念を紹介してくださり、ネットで調べてみると「AI が正しく振る舞えるように環境を整えること」という曖昧な説明しか出てきませんでした。概念を完全には理解できなかったものの、ひとまず言われたとおりにフックや批判的レビュアー、テスターなどを設定していくうちに、いつの間にか自分だけのハーネスが出来上がっていました。",
					"ハーネスで一番難しいのは「成功条件」を定義することです。たとえば Figma で定義されたデザインどおりに画面を実装するとき、ハーネスの設定には、Figma のデザインと実装した画面が一致しているかを評価するロジックが必要です。最初はアプリの画面をキャプチャして、単に似ているかどうかだけをチェックしていました。比較は独立したサブエージェントが担当しました。悪くはありませんでしたが、良い成果物とも言えませんでした。あちこちでアイコンが違い、テキストの位置もずれていて、満足できるレベルではありませんでした。最大の問題は、アプリの画面をキャプチャして AI エージェントが Figma と比較する作業が非常に遅く、トークンを大量に消費することでした。",
					ENQOR_FIGURES.harness,
					"この問題は expo web で解決しました。まず、実装したい画面を expo web で作ります。Web ならヘッドレスブラウザを開いて、実装の状態を手軽に確認できます。レスポンシブのテストも簡単にでき、モバイルやタブレットの解像度に切り替えて崩れる箇所がないかを確かめるのも容易でした。こうして実装を終えたコードをアプリに移せば、効率よく評価できました。Figma と Web で実装した画面がどれだけ似ているかは批判的エージェントに評価させつつ、アイコンを勝手に生成できないようルールを加え、Figma MCP に不具合が起きて動かないときはハーネスごと止まる preflight の手順も追加しました。その結果、シンプルな画面はほぼ完璧な完成度に仕上がり、複雑な画面でも70%ほどの完成度で実装できるようになりました。",
					"今回の経験から、AI に良い資料を渡し、良い環境を整えてあげれば良い結果が出ることを学びました。AI が生み出した結果も、「どう」検証するかより「どこまで」検証するかを考えるほうが正しいと感じました。金融や宇宙産業、防衛産業のように、一度の事故が大惨事につながる領域では、すべてのコードを隅々まで検証する必要があるでしょう。しかし今回のプロジェクトのように、ほとんどはそうではありません。開発者は、AI がいま何をしていて、その作業が終わったらどこまで検証すべきか、どのファイルが変わるはずなのかを把握していれば十分だと考えています。そのなかでも、AI が単純な作業をしているなら何度か触ってみてテストを終えることもできますし、中核となるロジックなら設計から丁寧に議論する必要があります。開発者は、コードを書く人から、判断し責任を負う人へと変わったのだと実感しました。",
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
 * HEALIX, 긴 글. /projects/healix 에 놓인다. 화면은 카드의 갤러리(HEALIX_SCREENS)를
 * 그대로 슬라이더로 넘긴다. 두 달짜리 해커톤 결과물이라 날짜별 이력도, 따로 세울
 * 설계 고민도 없다 — Highlights 와 History 가 빠지고, 대신 발표 영상이 붙는다.
 */
const healixStory: ProjectStoryContent = {
	tagline: "症状から病院を探せるサービス",
	facts: [
		{ term: "参加人数", detail: "6名" },
		{ term: "開発期間", detail: "2024.07 ~ 2024.08" },
		{ term: "主な技術", detail: "ChatGPT API, NestJS" },
	],
	motivation: [
		"体のどこかが痛むとき、どの病院に行けばいいのか分からないことはよくあります。すぐに思いつくだけでも、熱の出る風邪をひいたら内科に行くべきか耳鼻咽喉科に行くべきか迷いますし、お尻のような普段なじみのない部位が痛み出したら、その悩みはさらに大きくなります。以前は、ネットで検索して適切な診療科を調べ、地図で病院を探さなければなりませんでした。HEALIX は、この不便さを解消するために開発されました。",
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
	alt: "WATERFLAKE の構成図。プレイヤーが test.example.com に接続すると SRV レコードが 1.1.1.1 の3000番ポートを指し、そのポートで動くトンネリングサーバーがマインクラフトのサーバーと20本の TCP ソケットでつながっている",
};

/**
 * WATERFLAKE, 긴 글. /projects/waterflake 에 놓인다. 화면은 카드의 갤러리
 * (WATERFLAKE_SCREENS)를 그대로 슬라이더로 넘긴다. 날짜별 이력은 없어 History 섹션이 빠진다.
 */
const waterflakeStory: ProjectStoryContent = {
	tagline: "かんたんなインストールだけで、マインクラフトのサーバーをドメイン付きで公開",
	highlights: [
		"SRV レコードを使い、サブドメインが特定の IP のポートを指すよう自動で設定",
		"ゲームサーバーとトンネリングサーバー間の TCP ソケットトンネリング",
	],
	facts: [
		{ term: "参加人数", detail: "個人" },
		{ term: "開発期間", detail: "2023.03 ~ 2023.05" },
		{ term: "主な技術", detail: "NestJS, Java" },
	],
	motivation: [
		"10年ほど前、マインクラフトというゲームにハマり、みんなで一緒に遊べるサーバーを開くことが一番の目標でした。コンピューターのことを何も知らない小学生が、ブログの記事だけを頼りに VPS を借り、Linux 環境でゲームサーバーを動かしました。さらに複雑なネットワーク設定までこなして、ついにサーバーを開きました。そのときの達成感は人生で一番大きな達成感で、決して忘れることのできない思い出です。そして今、「もし複雑な手順なしで、かんたんにゲームサーバーを開けるよう手助けしてくれるツールがあったらどうだろう？」という思いから、このプロジェクトは始まりました。",
	],
	architecture: {
		label: "Architecture",
		items: [
			{
				// TODO(confirm): 원문에는 절 제목이 없어 두 하이라이트를 그대로 제목으로 세웠다.
				title: "SRV レコードと TCP トンネリング",
				body: [
					WATERFLAKE_ARCHITECTURE,
					"ユーザーが Web サービス上でトンネルを作成すると、Cloudflare API を通じて SRV レコードを作成します。そして、トンネリングを担う仮想マシン上に、ランダムなポートでトンネリングサーバーを立ち上げます。トンネリングサーバーは2つの接続を受けます。ひとつは SRV レコードを経由して入ってくる接続、もうひとつはマインクラフトのサーバー側へ出ていく接続です。この2つの接続をパイプでつなぐことで、外から入ってきたパケットが自然にマインクラフトのサーバーへ流れていきます。ユーザーからは、ドメインを入力するだけで接続できるサーバーのように見えます。",
					"トンネリングサーバーとゲームサーバー間の TCP トンネルは、20本のソケットで管理します。プレイヤーがサーバーに接続すると、このソケットのうち1本を占有します。プレイヤーがゲームサーバーから抜けると、そのソケットは破棄され、新しいソケットが作られます。このサイクルを繰り返してソケットの数を管理します。幸い、マインクラフトのサーバー設定には最大接続人数が決まっているので、その数だけソケットを管理すれば運用に問題はありませんでした。",
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
			description:
				"動画講義をアップロードすると、画面と音声を解析して要約ノートにまとめるサービスです。サーバーレス構成なので待機中はサーバー費用がかからず、アクセスが集中しても自動でスケールします。",
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
			period: "2025 ~ 現在",
			title: "enqor",
			description:
				"リアルタイムのビデオ・音声通話サービスです。バイブコーディングを初めて取り入れたプロジェクトで、AI の応答を改善するためのハーネスや、通話料金の精算をめぐるエンジニアリング上の工夫が詰まっています。",
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
			description:
				"症状を伝えると、いちばん近くて適切な病院をおすすめします。公共データポータルの医療情報とアプリ内の GPS 座標をあわせて AI に渡すよう設計しました。",
			// 공개된 저장소가 백엔드 하나뿐이라 메뉴 없이 바로 간다.
			links: [{ label: "Github", href: "https://github.com/bb2002/healix-backend" }],
			// 표지를 그대로 담으면 QR 과 팀 크레딧이 들어오고 워드마크가 바로 옆 카드
			// 제목과 겹친다. 표지에서 폰 목업만 205:141 로 떼어 냈다.
			thumbnail: {
				src: asset("/projects/healix/00-thumb-4ae26d2b.png"),
				alt: "HEALIX の画面。地図の下に近くの病院と予約情報が並んでいる",
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
			description:
				"プラグインを入れるだけで、外部から接続できないゲームサーバーに、接続用のドメインが用意されます。TCP トンネリングと SRV レコードを中核に使っています。",
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
				"中学生のときに初めて作り、収益化まで成功したアプリです。スマホを振ると画面をキャプチャし、訳文をオーバーレイで表示します。",
			// 저장소가 하나뿐이라 메뉴 없이 바로 간다.
			links: [{ label: "Github", href: "https://github.com/bb2002/ProjectScreenTranslator" }],
			// 넷 다 세로라 205:141 타일에 담기면 띠가 된다. 첫 장에서 게임 로고와 그
			// 위에 덮인 번역 팝업이 함께 들어오게 잘라 냈다 — 카드 문구가 말하는
			// 동작이 타일 안에서 그대로 보이고, 누르면 그 장이 먼저 뜬다.
			thumbnail: {
				src: asset("/projects/screen-translator/00-thumb.jpg"),
				alt: "ゲーム画面の上に韓国語の訳文が重なっている",
			},
			// 게임에서 쓰고 → 웹에서도 쓰고 → 그제서야 언어와 흔드는 세기를 어디서
			// 고치는지 보여 준다. 무엇을 하는 앱인지가 먼저고 설정은 그다음이다.
			gallery: SCREEN_TRANSLATOR_SCREENS,
		},
	],
	gallery: {
		open: "画面を拡大表示",
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
	alt: "luckybox テーブルの図。id 列が INT で宣言されたまま19億件が積まれていて、上のほうの大半の行は期限切れで読まれず、下の直近1か月分の行だけがリアルタイムで使われている。右のゲージは INT の最大値21億のうち19億まで埋まった状態で、残りの余裕が2か月ほどであることを示している",
};

const BIGINT_TRIGGER: Media = {
	src: asset("/experience/bigint-migration/02-trigger.png"),
	width: 2400,
	height: 840,
	caption: "トリガーが PK を負の値に差し替える流れ",
	alt: "トリガーの構成図。サーバーが INSERT すると BEFORE INSERT トリガーがシーケンステーブルから次の値 n を読み、id を -n に差し替えて、luckybox テーブルには -2,200,000,001 のような負の id で保存される。アプリは SELECT でその値を読んでも INT の範囲内なので問題なく処理できる",
};

/**
 * realtime-redesign 의 그림 두 장. 위와 같은 규칙으로 Pencil 문서의 `realtime / 01 item` ·
 * `realtime / 02 open` 프레임(1200×420, 1200×440)에서 그려 2x 로 내보냈다.
 */
const REALTIME_ITEM: Media = {
	src: asset("/experience/realtime-redesign/01-item.png"),
	width: 2400,
	height: 840,
	caption: "パーティションキーひとつに、その日のボックスを配列で",
	alt: "DynamoDB のアイテムの図。パーティションキーはユーザーと日付の組み合わせで、その中の boxes 配列に id・cash・opened の値を持つボックスが並んでいる。サーバーは新しいボックスを配列に追加し、ボックスが開けられると該当する要素の opened を書き換える。その日の最初のアクセスでは配列を空にする",
};

const REALTIME_OPEN: Media = {
	src: asset("/experience/realtime-redesign/02-open.png"),
	width: 2400,
	height: 880,
	caption: "ボックスを開けるときに3つのストレージを回る順序",
	alt: "ボックスを開ける処理のフロー図。アプリがボックスを開けると、サーバーは MySQL から確率表を読み、Redis で直近の高額当選フラグを確認したあと、DynamoDB のボックスを開封済みに変え、Redis ZSET のランキングにキャッシュを加算する。高額当選なら TTL 付きのフラグを Redis に残し、最後にアプリへキャッシュが付与される",
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
	alt: "トラフィック分散の構成図。ユーザーのリクエストが Route 53 に届くと加重ルーティングで振り分けられ、従来の Intel x86 インスタンスで動く Beanstalk が90%、同じ Dockerfile で arm64 イメージをビルドして載せた Graviton インスタンスの Beanstalk が10%を受け持つ。Intel 側はピーク時に12台まで増える",
};

/**
 * api-memory 의 그림. 위와 같은 규칙으로 Pencil 문서의 `api / 01 leak` 프레임(1200×440)에서
 * 그려 2x 로 내보냈다.
 */
const API_MEMORY_CHART: Media = {
	src: asset("/experience/api-memory/01-leak.png"),
	width: 2400,
	height: 880,
	caption: "インスタンス1台のメモリが、5日で1GBから32GBまで",
	alt: "折れ線グラフ。インスタンス1台のメモリ使用量が初日の1GBから始まり、5日かけて32GBの上限線まで上がり、そこで OOM により強制終了されたあと再起動して、また1GBから始まる",
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
			title: "19億件のテーブルをメンテナンス時間1時間以内にマイグレーション",
			subtitle: "データに優先順位をつけ、ロールバックできるマイグレーションスクリプトを作成しました。",
			body: [
				{ heading: "背景" },
				"Timespread には「ランダムボックス」という機能があります。広告を見るとランダムな額のキャッシュが入ったボックスがもらえ、そのボックスを開けるとキャッシュが付与されるという、シンプルなサービスでした。このサービスの「ボックス」は、luckybox というテーブルに1行ずつ積み上がっていきました。ユーザーが増えるにつれてこのテーブルのレコードは19億件に達し、主キーが INT で宣言されていたため、推移から見て21億件に届くまで残り2か月ほどという状況でした。このテーブルを、BIGINT で宣言した新しいテーブルへマイグレーションする必要がありました。",
				{ heading: "1回目の試み" },
				"まず、サービスの特徴を調べました。ボックスは24時間後に期限切れになり、ランキングを処理するバッチプログラムも直近1か月分のデータしか読んでいません。つまり、メンテナンス時間内にこのデータだけを移せば、ひとまずサービスは再開できる状態でした。",
				BIGINT_TABLE,
				"チームリーダーと相談して、平日の深夜にサービスを1時間止め、あらかじめ用意したマイグレーションスクリプトを実行することにしました。スクリプトには、次の作業を順番に実行させました。",
				{
					items: [
						"既存テーブルの名前を RENAME して、接続を切り離します。",
						"新しいテーブルを BIGINT で作り直します。",
						"PK が22億から始まるようにします。万が一の重複を防ぐためです。",
						"1か月前のデータが何番の ID なのかを調べます。",
						"MySQL のプロシージャで、100件ずつバッチでデータをコピーします。",
					],
				},
				"マイグレーションスクリプトを書くうえで一番大事なのは、「ロールバックできるか？」です。作業中に問題が起きたらすぐに止められる必要があり、進み具合をモニタリングできる必要もありました。データの挿入はクエリ1本でも済みましたが、1時間以上かかるかどうか分からなかったので、作業を細かく分けました。",
				{ heading: "1回目の試みの結果" },
				"マイグレーションは無事に完了しました。1か月分のデータが挿入され、新しいボックスは22億から作られ始めました。ところが、なぜか Android アプリでクラッシュが起き始めました。残り時間がわずかだったので、落ち着いてロールバックを実行し、サービスは元の状態に戻りました。",
				{ heading: "原因の分析" },
				"理由は単純でした。アプリ側でも ID を INT で扱っていたため、21億を超える値を処理できなかったのです。サーバーを更新するだけでは解決できない問題でした。別の方法を探す必要がありました。",
				{ heading: "2回目の試み" },
				"チームリーダーと解決策を話し合っているとき、ふと INT には負の領域もあることを思い出しました。幸い unsigned では宣言されていなかったので、PK を負の値で保存する方法について話し合いました。チームリーダーからも「とても斬新でいい方法だ」と褒めていただき、すぐに作業に取りかかりました。",
				BIGINT_TRIGGER,
				"トリガーを使い、値が INSERT されるときにシーケンステーブルから PK の値を読み取って差し替えるという解決策を考えました。テストサーバーでサーバーとアプリの両方が負の PK を問題なく処理できることを確認し、深夜の時間帯にトリガーを設置しました。",
				{ heading: "2回目の試みの結果" },
				"挿入されるすべてのデータの PK が、負の値に置き換えられて挿入されました。アプリでも問題は起きませんでした。この対応で目の前の障害を防ぎ、約2年分のリファクタリングの時間を稼ぐことができました。",
			],
		},
		{
			slug: "realtime-redesign",
			year: "2023",
			title: "毎分1,500件のリクエストを受けるサービスのリファクタリング",
			subtitle:
				"DynamoDB と Redis でサービスを再設計し、6時間に1回更新されていたランキングがリアルタイムで動くよう最適化しました。",
			body: [
				"ランダムボックスのサービスをマイグレーションしてから、1年が経ちました。アプリが ID を整数で扱っていたのでこれを String に変更し、そのリリースがユーザーの99%に行き渡るまで待ちました。ちょうど運営チームからも、ランダムボックスの確率調整まわりの機能が把握しづらいのでリニューアルしたいという要望があり、代表の承認も得られたことで、ようやくリファクタリングに着手できました。",
				{ heading: "何をどこに保存するか？" },
				"まず、ボックスをどこに保存するかを考えました。以前の設計ではボックスをすべて MySQL に保存していたため、ボックスを作るときに INSERT、開けるときに UPDATE クエリが発生していました。これを DynamoDB に移し、パーティションキーによる読み書きが速いという強みを最大限に活かすことにしました。",
				REALTIME_ITEM,
				"ボックスが作られたら配列に値を追加し、ボックスが開けられたら配列の値を書き換えるだけで、シンプルに実装できました。見た目は MySQL と変わりませんが、パーティションキーで参照・更新するので、速度ははるかに向上しました。また、ユーザーがその日初めてアクセスしたときに、それまで溜まったデータを削除するロジックを加え、以前のように値が際限なく増え続けることを防ぎました。",
				REALTIME_OPEN,
				"ランキングシステムも一から作り直しました。Redis の ZSET は、重複しないキーに対してソート済みの値を O(log(n)) という非常に速い速度で提供します。また、高額当選者は一定期間当選できないようにするという要件がありましたが、高額当選のときに Redis にそのユーザーの ID を TTL 付きで登録すれば、データベースなしで実装できました。最後に、当選確率などの設定値は MySQL に保存しました。管理画面との連携を考慮する必要があったためです。ボックスを開けるロジックで MySQL へのアクセスが必要になるという欠点はあるものの、設定をリアルタイムに反映でき、読み取りだけなので大きな負担にはならないと判断しました。",
				{ heading: "結果" },
				"完成したシステムには、少しずつトラフィックを流しました。朝の時間帯は10%ほどのトラフィックを受けながらモニタリングし、問題がなかったので、午後にはトラフィックを100%受けるように切り替えました。MySQL の負荷は下がり、何よりランキングシステムに活気が出ました。これまで6時間に1回しか更新されなかった値が、リアルタイムで変わるようになったからです。運営チームからも、当選確率の設定が楽になったと喜ばれました。",
				"問題を見つけてチームリーダーに報告した日から最後のリファクタリングまで、まるまる1年かかりました。自分の書いたコードが少しずつトラフィックを受け、100%リリースされていく様子を見届けた経験は、今でも忘れられない開発の醍醐味です。",
			],
		},
		{
			slug: "aws-cost",
			year: "2022",
			title: "月1,000万ウォンを超えていた AWS 費用を30%削減",
			subtitle: "インスタンスの増減ルールを見直し、安価で高性能な Graviton インスタンスを導入しました。",
			body: [
				"Timespread は、月1,000万ウォンにのぼるサーバー費用を支出していました。チームリーダーから、この費用を削減する方法を探ってみようという提案がありました。",
				{ heading: "インフラの調整だけでコストを削減する" },
				"Cost Management で確認すると、最も費用がかかっているのは次の3つでした。",
				{ items: ["RDS", "Beanstalk (EC2)", "ネットワークトラフィック"] },
				"RDS は負荷率が高い状態だったので、EC2 でコストを削減できるポイントを探しました。ARM 系の Graviton インスタンスが新たにリリースされ、性能あたりのコストが20%ほど安いという AWS の発表を見て、このサービスにも適用してみることにしました。",
				"まず Graviton インスタンスを1台作り、サーバーを起動してみました。OS のバージョンとアーキテクチャが変わったため従来の方法では起動しませんでしたが、幸い Dockerfile でビルドすれば、ARM アーキテクチャでも安定してサービスが動きました。そこで既存の CI/CD パイプラインを修正して GitHub Actions のクロスビルドで ARM イメージを作るようにし、Graviton インスタンスで動く Beanstalk を作成して、新しくビルドしたイメージを使うようにしました。",
				AWS_ROUTE53,
				"テストサーバーで QA チームと一緒にサーバーが正しく動くかを確認し、結果として何の問題もありませんでした。Route 53 で新しく作ったサーバーにトラフィックの10%を振り分けるよう設定し、大きな問題が見つからなかったので、最終的にすべてのトラフィックを Graviton インスタンスで受けるよう切り替えました。",
				"数日後、CPU 使用率のデータをもとに、時間帯ごとのインスタンスのスケールアウトを調整しました。以前はピークタイムに最大12台まで増えていたインスタンスを8台に減らし、夜間は1台だけで動くようにして、最終的にコストを30%ほど削減できました。",
			],
		},
		{
			slug: "api-memory",
			year: "2022",
			title: "32GB を超えるメモリを占有して止まっていた API サーバーを正常化",
			subtitle:
				"エラーも出さずにインスタンスのメモリを使い切り、OOM が発生する問題を、メモリダンプの調査で解決しました。",
			body: [
				"入社して4か月ほど経った頃のことです。マシンごとのメモリ使用量が、不自然なほどばらばらでした。20GB 以上占有しているマシンもあれば、1GB ほどしか使っていないマシンもありました。そして、ほぼすべてのマシンが4日ほどで強制終了され、再起動されていました。",
				{ heading: "原因を探る" },
				"最初は、再起動のルールがあるのだと思っていました。実際、他チームのバックエンドサーバーは週に1回マシンを再起動しているそうです。しかし、インスタンスがメモリを20GB も使っているのは、明らかにおかしな状態でした。",
				API_MEMORY_CHART,
				"数日間モニタリングした結果、API サーバーのどこかでメモリリークが起きてインスタンスのメモリをすべて使い切り、最後は OOM で強制停止されていることが分かりました。しかし Sentry や AWS のモニタリングツールでは原因がつかめず、デバッグは難航しました。",
				"チームリーダーから、本番サーバーでメモリダンプを取って調べてみてはどうかというアイデアをもらいました。ただ、本番サーバーにアクセスしてダンプを取っている間にサービスの障害率が上がるかもしれず、ダンプを取ってきても読み方が分からないので、意味のある結果を得るのは難しいだろうと考えていました。それでもほかに手立てがなかったので、ひとまずやってみました。",
				"ネットで調べてみると、実際にいくつかのメモリダンプツールがありました。チームリーダーに共有したうえで本番サーバーに直接接続し、ダンプツールでメモリをスキャンしました。2つのツールを使い、1つ目のツールでは意味のある結果が得られなかったものの、2つ目のツールで、同じエラーが何度も起きていたと思われるダンプログを見つけました。",
				{ heading: "原因の解決" },
				"原因は、数週間前に退職した開発者が、アプリにプッシュ通知を送るロジックを並列化した部分でした。並列処理のためにスレッドを生成していましたが、スレッド内で例外が発生すると、スレッドが回収されないままさまよい続け、メモリリークを起こしていたのです。スレッド内の処理ロジックに try/catch を付けるようコードを修正し、デプロイ後はすべてのインスタンスがメモリを1GB ほどしか使わない正常な状態に戻りました。最初は解決策がまったく思い浮かばずストレスを感じましたが、結局は自分で開いて調べてみれば、答えは思ったより簡単なところにあるという教訓を得た作業でした。",
			],
		},
	],
	gallery: {
		open: "図を拡大表示",
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
		open: "証書を拡大表示",
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
					alt: "JLPT N1 の日本語能力認定書。生年月日と認定書番号・受験番号は伏せている",
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
					alt: "国家技術資格証。生年月日と資格番号・管理番号は伏せている",
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
					alt: "東亜大学校総長の名義による賞状",
				},
				{
					src: asset("/certificates/02-choiwoosusang-f026e085.jpg"),
					width: 1054,
					height: 1440,
					caption: "最優秀賞",
					alt: "東亜大学校ソフトウェア革新センター長の名義による最優秀賞の賞状",
				},
			],
		},
		{
			period: "2024",
			event: "LIKELION 大学12期 中央ハッカソン",
			title: "最優秀賞 2位",
			detail: "ヨンリムウォン・ソフトラボ 特別賞",
			description: "**HEALIX**で、全国55校・約1,500人が集まった大会で受賞しました。",
			links: [{ name: "HEALIX", href: "/projects/healix" }],
			image: { src: asset("/certificates/03-likelion-e9406103.jpg"), alt: "ヨンリムウォン・ソフトラボ 特別賞の賞状" },
			gallery: [
				{
					src: asset("/certificates/03-likelion-e9406103.jpg"),
					width: 442,
					height: 585,
					caption: "最優秀賞",
					alt: "LIKELION 大学12期 中央ハッカソンの最優秀賞、ヨンリムウォン・ソフトラボ特別賞の賞状",
				},
			],
		},
		{
			period: "2024",
			title: "国家優秀奨学金（理工系）",
			detail: "科学技術情報通信部長官 証書",
			description: "全国で約1,000人しか選ばれない国家優秀奨学金（理工系）を受給しました。",
			image: { src: "/mock/scholarship.svg", alt: "国家優秀奨学金（理工系）の証書" },
		},
		{
			period: "2025",
			title: "Daangn Builder’s Camp",
			detail: "タングンマーケット 修了証",
			description: "タングンマーケットが選抜した、20人ほどの少数精鋭のハッカソンに選ばれました。",
			// Scan pending: an omitted `src` renders the design's placeholder tile.
			image: { alt: "Daangn Builder’s Camp の修了証" },
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
		alt: "テクスチャパック コミュニティのメイン画面。緑の上部メニューの下に、掲示板の一覧と最近の投稿、バナーが並んでいる",
	},
	{
		src: asset("/journey/taxpack/02-boards.png"),
		width: 600,
		height: 348,
		caption: "マイ掲示板の一覧",
		alt: "あるユーザーが運営する掲示板の一覧。掲示板名と運営者、開設日が並び、管理・閉鎖のボタンが付いている",
	},
	{
		src: asset("/journey/taxpack/03-create.png"),
		width: 600,
		height: 374,
		caption: "掲示板の開設",
		alt: "掲示板の開設フォーム。タイトルと種類、アドレスを入力し、ロゴをアップロードする画面",
	},
	{
		src: asset("/journey/taxpack/04-new-board.png"),
		width: 600,
		height: 466,
		caption: "新しく作った掲示板",
		alt: "開設したばかりの掲示板。ロゴを登録するよう促す案内の下で、お知らせと掲示板の一覧はまだ空のまま",
	},
	{
		src: asset("/journey/taxpack/05-event.png"),
		width: 600,
		height: 563,
		caption: "イベントの管理",
		alt: "イベントの一覧と追加フォーム。タイトルと実施日、オン・オフのスイッチ、投稿エディタがある",
	},
	{
		src: asset("/journey/taxpack/06-gallery.png"),
		width: 600,
		height: 480,
		caption: "ギャラリー型の掲示板",
		alt: "あるユーザーが開いた Photoshop のギャラリー掲示板。天気ウィジェットの下に、絵がタイル状に並んでいる",
	},
	{
		src: asset("/journey/taxpack/07-admin.png"),
		width: 600,
		height: 635,
		caption: "掲示板の管理",
		alt: "掲示板の管理画面。ロゴの登録、掲示板の種類と名前の変更、会員数とブラックリストの管理が1ページにまとまっている",
	},
];

/** 초등학교 졸업식 사진 한 장. 무대 화면에 장래희망이 컴퓨터 프로그래머라고 적혀 있다. */
const DREAM_PHOTOS: readonly Media[] = [
	{
		src: asset("/journey/dream/01-note.jpg"),
		width: 2000,
		height: 1125,
		caption: "2015年2月、小学校の卒業式",
		alt: "卒業式のステージのスクリーンを撮った写真。「卒業おめでとう」の下に、進学先の学校とともに、将来の夢はコンピュータープログラマーと書かれている",
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
		alt: "MyRunnerGame のタイトル画面。畳の部屋を背景に、シングルプレイ・1対1マッチ・ランキング・クレジットのメニューとニックネームの入力欄、チュートリアルのボタンがある",
	},
	{
		src: asset("/journey/myrunnergame/02-tutorial.jpg"),
		width: 2400,
		height: 1080,
		caption: "操作方法",
		alt: "操作方法の画面。左から右へスライドすると右へ、右から左へスライドすると左へ動くという説明",
	},
	{
		src: asset("/journey/myrunnergame/03-play.jpg"),
		width: 2400,
		height: 1080,
		caption: "プレイ",
		alt: "プレイ画面。街なかの道路を走るキャラクターの前にゴミ箱の障害物があり、左上でスコアが上がっていく",
	},
	{
		src: asset("/journey/myrunnergame/04-result.jpg"),
		width: 2400,
		height: 1080,
		caption: "結果",
		alt: "結果画面。転んだキャラクターの上に、スコア152、ランキング12位、記録が表示されている",
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
		alt: "VRTetris のロビー。海の上の木の板に、TETRIS のロゴとニックネームの入力欄、仮想キーボードが浮かんでいる",
	},
	{
		src: asset("/journey/vrtetris/02-play.jpg"),
		width: 1154,
		height: 1154,
		caption: "プレイ",
		alt: "VRTetris のプレイ画面。夕焼けの野原に立てられた緑の盤面にブロックが積まれ、左にスコア2,290が浮かんでいる",
	},
	{
		src: asset("/journey/vrtetris/03-result.jpg"),
		width: 1154,
		height: 1154,
		caption: "結果とランキング",
		alt: "VRTetris の結果画面。自分のスコアと、グローバル・ローカルのランキングボードが野原に立っている",
	},
	{
		video: `${JOURNEY_VIDEO}/vrtetris.mp4`,
		src: asset("/journey/videos/vrtetris-poster.jpg"),
		width: 1280,
		height: 720,
		caption: "プレイ動画",
		alt: "VRTetris のプレイ動画。海辺のロビーでニックネームを入れてスタートすると、砂漠に立てられた盤面に VR コントローラーでブロックを落とし、列を消してスコアを伸ばしていく",
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
		alt: "Tooth のロビー。Tooth のロゴの下に名前の入力欄と PLAY ボタン、EASY から EXPERT までの難易度選択があり、横にサーバーランキングと自分のランキングのボードがある",
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
		alt: "島の上にびっしりと置かれた紫のブロックと木、柵を近くから見た画面",
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
		caption: "レベルの表示",
		alt: "曇り空の上に LEVEL: HARD、STAGE: 2 Lv と表示された画面",
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
		alt: "Unrevived のロビー。遺跡のあいだに浮かぶ板に、unrevived のロゴと名前の入力欄、マップの選択、仮想キーボードがある",
	},
	{
		src: asset("/journey/unrevived/02-village.jpg"),
		width: 1271,
		height: 711,
		caption: "村",
		alt: "月の出た夕暮れの中世風の村。石畳の上にキャラクターがひとり立っている",
	},
	{
		src: asset("/journey/unrevived/03-pistol.jpg"),
		width: 480,
		height: 479,
		caption: "ハンドガン",
		alt: "ハンドガンを構えた一人称視点。銃の横に Pistol という名前と残弾数100が表示されている",
	},
	{
		src: asset("/journey/unrevived/04-smg.jpg"),
		width: 480,
		height: 479,
		caption: "サブマシンガン",
		alt: "夕焼けの街で SMG11 を構えた一人称視点。弾数261と30が表示されている",
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
		alt: "お知らせの投稿をひとつ開いた画面。お知らせ・FAQ・全講座・コンテストのタブの下に、タイトルと投稿者、本文がある",
	},
	{
		src: asset("/journey/codeduri/03-contest.png"),
		width: 1800,
		height: 1080,
		caption: "大会ページ",
		alt: "江原大学校コーディングコンテストのページ。ジャガイモの写真のバナーの下に、大会紹介・問題・達成度・ロール・Q&A のタブがあり、Overview と Introduction、教員とお知らせの欄が続く",
	},
	{
		src: asset("/journey/codeduri/04-problem.png"),
		width: 1800,
		height: 1080,
		caption: "問題を解く",
		alt: "問題を解く画面。左に問題文と制約、入出力の例があり、右の暗いコードエディタに解答を書いて提出する",
	},
	{
		src: asset("/journey/codeduri/05-scores.png"),
		width: 1800,
		height: 1080,
		caption: "達成度",
		alt: "大会の達成度の画面。バナーの下に問題ごとの正解状況が緑の印で示され、参加者ごとのスコアと順位が表にまとまっている",
	},
	{
		src: asset("/journey/codeduri/06-roles.png"),
		width: 1800,
		height: 1080,
		caption: "ロールの管理",
		alt: "大会のロールのページ。参加者を検索し、学籍番号・学科・名前ごとにロールを割り当てる表",
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
					detail: "VPS を借りてサーバーを構築し、最大同時接続120人を達成しました。",
				},
				{
					year: "2015",
					title: "小学校を卒業",
					detail: "コンピュータープログラマーを**将来の夢**に掲げ、それが今も続いています。",
					links: [{ name: "将来の夢", gallery: DREAM_PHOTOS }],
				},
				{
					year: "2015",
					title: "**テクスチャパック コミュニティ**を開発",
					featured: true,
					detail: "PHP で動く小さなコミュニティサービスを開発し、登録者100人あまりを達成しました。",
					links: [{ name: "テクスチャパック コミュニティ", gallery: TAXPACK_SCREENS }],
				},
				{
					year: "2017",
					title: "**スクリーン翻訳機**を開発",
					featured: true,
					detail:
						"スマホを振ると画面の上に翻訳をオーバーレイで表示するアプリを開発し、1,000ダウンロードと収益化を経験しました。",
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
					detail: "**スクリーン翻訳機**で、校内コンテストの2位を受賞しました。",
					links: [{ name: "スクリーン翻訳機", gallery: SCREEN_TRANSLATOR_SCREENS }],
				},
				{
					year: "2019",
					title: "VR ゲームを開発",
					featured: true,
					detail: "Unreal Engine を使って、VR ゲーム **VRTetris**、**Tooth**、**Unrevived** を開発しました。",
					links: [
						{ name: "VRTetris", gallery: VRTETRIS_SCREENS },
						{ name: "Tooth", gallery: TOOTH_SCREENS },
						{ name: "Unrevived", gallery: UNREVIVED_SCREENS },
					],
				},
				{
					year: "2020",
					title: "モバイルゲームを開発",
					featured: true,
					detail: "Unreal Engine を使って、モバイルゲーム **MyRunnerGame** を開発しました。",
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
					title: "**KNU コーディングプラットフォーム**を開発",
					detail: "江原大学校 SW中心大学事業団が進めたコーディングプラットフォーム構築事業で、チームリーダーを務めました。",
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
					title: "32GB を超えるメモリを占有して止まっていた API サーバーを正常化",
					detail:
						"エラーも出さずにインスタンスのメモリを使い切り、OOM が発生する問題を、メモリダンプの調査で解決しました。",
				},
				{
					year: "2022",
					title: "月1,000万ウォンを超えていた AWS 費用を30%削減",
					detail: "インスタンスの増減ルールを見直し、安価で高性能な Graviton インスタンスを導入しました。",
				},
				{
					year: "2023",
					title: "19億件のテーブルをメンテナンス時間1時間以内にマイグレーション",
					featured: true,
					detail: "データに優先順位をつけ、ロールバックできるマイグレーションスクリプトを作成しました。",
				},
				{
					year: "2023",
					title: "毎分1,500件のリクエストを受けるサービスのリファクタリング",
					featured: true,
					detail:
						"DynamoDB と Redis でサービスを再設計し、6時間に1回更新されていたランキングがリアルタイムで動くよう最適化しました。",
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
					detail: "**HEALIX**で、全国55校・約1,500人が集まった大会で受賞しました。",
					links: [{ name: "HEALIX", href: "/projects/healix" }],
				},
				{
					year: "2024",
					title: "国際交流課のバディプログラム",
					detail:
						"日本から来た交換留学生を1人担当し、学校生活をサポートしながら、サークルで良い思い出を作れるよう手助けしました。",
				},
				{
					year: "2025",
					title: "国家優秀奨学金（理工系）",
					detail: "全国で約1,000人しか選ばれない国家優秀奨学金（理工系）を受給しました。",
				},
				{
					year: "2025",
					title: "鳥取大学に交換留学",
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
					detail: "**enqor** プロジェクトの開発全般を担当しています。",
					links: [{ name: "enqor", href: "/projects/enqor" }],
				},
			],
		},
	],
	gallery: {
		open: "写真を拡大表示",
		previous: "前の写真",
		next: "次の写真",
		close: "閉じる",
		pick: "写真を選ぶ",
	},
};
