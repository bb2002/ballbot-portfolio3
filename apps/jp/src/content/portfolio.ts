/**
 * Copy and asset paths for the Japanese build.
 *
 * Not a translation of the Korean one. The facts are the same and none of them
 * are restated differently, but what the page leads with is not: a Japanese
 * employer reading a Korean engineer's portfolio checks whether they can work
 * in Japanese before anything else, so the Overview column opens on N1 and the
 * exchange year rather than on the award count. The awards did not disappear —
 * they are where a reader looks for them, in Certificates.
 *
 * Institution names are given in their Japanese forms where one exists
 * (동아대학교 → 東亜大学校) and in katakana where it does not, with the product
 * brands left in their own spelling.
 */

import type {
	CertificatesContent,
	ExperienceContent,
	HeroContent,
	JourneyContent,
	NavContent,
	OverviewContent,
	ProjectsContent,
	ResumeContent,
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
		{ id: "resume", label: "Resume" },
	],
};

export const scrollCue: ScrollCueContent = {
	ariaLabel: "プロジェクトのセクションへ移動",
	href: "#projects",
};

/* ------------------------------------------------------------------ *
 * Hero
 * ------------------------------------------------------------------ */

export const hero: HeroContent = {
	ariaLabel: "自己紹介",
	eyebrow: "ballbot.dev | Backend Engineer",
	/** The line break is deliberate in the design; it is kept on wide viewports. */
	headline: "19億件を無停止で\n移行したエンジニア",
	actions: {
		primary: { label: "プロジェクトを見る", href: "#projects" },
		secondary: [
			{ label: "GitHub ↗", href: "https://github.com/" },
			{ label: "Resume ↗", href: "#resume" },
		],
	},
	otherMarket: {
		lang: "ko",
		lead: "한국에서 보고 계신가요? ",
		emphasis: "한국어판",
		tail: "도 준비되어 있습니다.",
		href: KOREAN_BUILD,
	},
};

/**
 * N1 first. On this market it is the line that decides whether the rest of the
 * page gets read, and it is the one figure the Korean build buries.
 */
export const overview: OverviewContent = {
	label: "Overview",
	blocks: [
		{
			value: "日本語 N1",
			caption: "JLPT N1 取得、鳥取大学に交換留学",
			items: [
				{ emphasis: "鳥取大学 交換留学", detail: " 国際交流課のバディとして留学生を支援" },
				{ emphasis: "enqor", detail: " 日本語ニュースのディクテーション学習アプリを開発・運営" },
			],
		},
		{
			value: "2 Years",
			caption: "Nudge Healthcare・Timespread チームでバックエンドを担当",
			items: [
				{ emphasis: "19億件規模のテーブル", detail: " を無停止でマイグレーション" },
				{ emphasis: "毎分1,500リクエスト", detail: " のレガシー移行、サーバー費用を40%削減" },
			],
		},
		{
			value: "4.43 / 4.5",
			caption: "江原大学校 コンピュータ工学科 在学、学科首席",
		},
	],
};

/* ------------------------------------------------------------------ *
 * Projects
 * ------------------------------------------------------------------ */

export const projects: ProjectsContent = {
	label: "Projects",
	archiveLabel: "Archive",
	featured: [
		{
			period: "2025 ~ 現在",
			title: "コスモのノート",
			description:
				"動画講義をアップロードすると、画面と音声を解析して要約ノートにまとめるサービスです。サーバーレス構成なので待機中はサーバー費用がかからず、アクセスが集中しても自動でスケールします。",
			stats: [
				{ value: "1,300+", label: "累計登録者" },
				{ value: "48万ウォン", label: "月間売上" },
				{ value: "160", label: "DAU" },
			],
			links: [{ label: "cosmonote.site", href: "https://cosmonote.site" }],
			thumbnail: { src: "/mock/cosmo-thumb.svg", alt: "コスモのノートの画面。オペレーティングシステム第5週のまとめノートと復習クイズ" },
			appIcon: { src: "/mock/cosmo-icon.svg", alt: "コスモのノートのアプリアイコン" },
		},
		{
			period: "2025 ~ 現在",
			title: "enqor",
			description:
				"リアルタイムの映像・音声通話サービスです。バイブコーディングを初めて取り入れたプロジェクトで、AI の応答を改善するためのハーネスや、通話料金の精算をめぐるエンジニアリング上の工夫が詰まっています。",
			stats: [
				{ value: "2,400+", label: "累計学習文" },
				{ value: "31%", label: "7日間再訪率" },
				{ value: "90", label: "DAU" },
			],
			// 韓国ストアのページ。ロケールなしの /app/id… は読み手のストアへ飛ぶため、
			// 未配信の地域では行き止まりになる。KR ビルドと同じ URL を使う。
			links: [
				{
					label: "App Store",
					href: "https://apps.apple.com/kr/app/%EC%97%94%EC%BD%94%EB%A5%B4-%EB%82%98%EB%A7%8C%EC%9D%84-%EC%9C%84%ED%95%9C-1-1-%EC%8B%A4%EC%8B%9C%EA%B0%84-%EC%A0%84%EB%AC%B8%EA%B0%80-%EC%83%81%EB%8B%B4/id6762182124",
				},
				{ label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.enqor.app" },
			],
			thumbnail: { src: "/mock/enqor-thumb.svg", alt: "enqor の画面。日本語の文を書き取る入力欄" },
			appIcon: { src: "/mock/enqor-icon.svg", alt: "enqor のアプリアイコン" },
		},
	],
	archive: [
		{
			period: "2025",
			title: "newtrospect",
			description:
				"ニュース本文から難しい用語・数値・煽情的な表現をハイライトする拡張機能です。ユーザーが訪れるすべてのページを検査するため、最適化を重点的に検討しました。",
			// No art yet: an omitted `src` renders the design's placeholder tile.
			thumbnail: { alt: "newtrospect の画面。ニュース記事の本文にハイライトが重なっている様子" },
		},
		{
			period: "2024",
			title: "HEALIX",
			description:
				"症状を伝えると、最も近くて適した病院を提案します。公共データポータルの医療情報とアプリ内の GPS 座標をまとめて AI に渡す設計です。",
			thumbnail: { src: "/mock/helix-thumb.svg", alt: "HEALIX の画面。症状の選択とおすすめ病院の一覧" },
		},
		{
			period: "2023",
			title: "WATERFLAKE",
			description:
				"プラグインを入れるだけで、外部から接続できないゲームサーバーに接続用のドメインが生まれます。TCP トンネリングと SRV レコードを軸にしています。",
			// No art yet: an omitted `src` renders the design's placeholder tile.
			thumbnail: { alt: "WATERFLAKE の画面。トンネルが張られた Minecraft サーバーのドメイン" },
		},
	],
	list: [
		{ year: "2023", platform: "NestJS", title: "toshort.video", summary: "ショート動画を作る動画編集サービスです。editly と Cloudflare を使いました。" },
		{ year: "2022", platform: "Node.js", title: "オートミリ", summary: "個人用に作った、毎朝10時に通勤バスの座席を代わりに予約してくれるマクロです。" },
		{ year: "2021", platform: "React", title: "KNU コーディングプラットフォーム", summary: "江原大学校 SW 中心大学の学内コーディング教育プラットフォーム構築プログラムに、チームリーダーとして参加しました。" },
		{ year: "2021", platform: "React", title: "スタートアップのサイト・管理コンソール", summary: "会社紹介ページと社内運用コンソールを受託で構築しました。" },
		{ year: "2020", platform: "Unreal Engine", title: "MyRunnerGame", summary: "マッチメイキングと専用サーバーでマルチプレイができるランニングゲームです。" },
		{ year: "2020", platform: "VR", title: "Unrevived", summary: "四方から迫る敵を倒す VR のサバイバルゲームです。" },
		{ year: "2020", platform: "Unreal Engine", title: "RunCatGame", summary: "高校の友人と協力して作ったランニングゲーム。Google Play での配信まで経験しました。" },
		{ year: "2020", platform: "Unreal Engine", title: "WebMediaPlayer", summary: "Unreal Engine での動画再生を助けるプラグインです。GitHub で公開し、スターを 12 いただきました。" },
		{ year: "2018", platform: "Android", title: "スクリーン翻訳機", summary: "中学生のときにはじめて作り、収益化まで到達したアプリです。端末を振ると画面をキャプチャし、オーバーレイで訳文を表示します。" },
	],
};

/* ------------------------------------------------------------------ *
 * Experience
 * ------------------------------------------------------------------ */

export const experience: ExperienceContent = {
	label: "Experiences",
	company: {
		period: "2021.12 ~ 2023.12",
		/** Line break is intentional in the design. */
		name: "Nudge\nHealthcare",
		role: "Backend Engineer",
		teams: "Timespread・Linkareer チーム",
		logos: [
			{ src: "/mock/logo-timespread.svg", alt: "Timespread のロゴ" },
			{ src: "/mock/logo-linkareer.svg", alt: "Linkareer のロゴ" },
		],
		notes: ["2年のあいだに限界を迎えていたサービスを2つ無停止で移し、", "サーバー費用を40%削減してから大学に戻りました。"],
	},
	highlights: [
		{
			year: "2022",
			title: "約19億件の\n大規模データマイグレーション",
			paragraphs: [
				"Timespread のランダムボックスは、広告を見るとキャッシュを引ける機能です。広告を見るたびに、等級と当選金額、時刻がテーブルに一行ずつ積まれ、ユーザーが次第に増え、レコード数は19億件に達しました。主キーが INT で宣言されていたため、上限である21億件まで2か月しか残っていない状況でした。",
				"まず、サービスの特徴を調べました。ボックスは24時間後に期限切れになり、ランキングも1か月分までしか使わないため、必要なのは直近1か月分のデータだけでした。また、MySQL でテーブル名を変える操作は容量に左右されないことも分かりました。",
				"深夜にサービスを止め、既存テーブルの名前を変えて接続を切ったうえで、BIGINT で宣言した新しいテーブルを作りました。用意しておいた MySQL のプロシージャを実行して1か月分のデータを移し、サービスを再開しました。",
				"マイグレーション自体は成功しましたが、Android アプリが BIGINT を処理できないことが分かりました。INT の負の領域を使おうとチームリーダーに提案し、採用されて目の前の障害を防げました。この対応で、ランダムボックスのリファクタリングに余裕を持って取りかかれるようになりました。",
			],
		},
		{
			year: "2023",
			title: "毎分1,500リクエストを受ける\nサービスのマイグレーション",
			paragraphs: [
				"ランダムボックスのマイグレーションを終えてから、リファクタリングまで1年待ちました。アプリが ID を整数として扱っていたため文字列に変えるアップデートを配信し、そのバージョンがユーザーの99%まで行き渡るのに時間がかかったからです。",
				"リファクタリングでは性能とコストを一度に解決するため、ストレージを3つに分けました。当選確率や1日の当選上限といった管理者設定は MySQL に置き、ボックスの記録は DynamoDB に保存しました。ランキングは Redis の Sorted Set に保存しました。とくに DynamoDB はパーティションキーで読み書きするときの速度とコストがどちらも良く、Sorted Set はランキングの実装に最適化された構造でした。",
				"その結果、6時間ごとに大きな負荷をかけながら動いていたランキングのバッチは完全になくなり、リアルタイムに変わりました。ボックスの処理で MySQL は読むだけになり、DB インスタンスの費用も大きく減らせました。",
				"問題を見つけてチームリーダーに報告した日から最後のリファクタリングまで、1年間このサービスを担当しました。自分の書いたコードが少しずつトラフィックを受け、100%まで展開されるのを見届けた経験は、今も忘れられない開発の楽しさです。",
			],
		},
	],
};

/* ------------------------------------------------------------------ *
 * Certificates
 * ------------------------------------------------------------------ */

export const certificates: CertificatesContent = {
	awardsLabel: "Awards",
	certificationsLabel: "Certifications",
	featured: [
		{
			period: "2026",
			event: "第3回 全国大学ソフトウェア成果共有フォーラム",
			title: "最優秀賞 1位",
			awardName: "東亜大学校 総長賞",
			image: { src: "/mock/award-donga.svg", alt: "東亜大学校 総長賞の賞状" },
		},
		{
			period: "2024",
			event: "LIKELION 大学12期 中央ハッカソン",
			title: "最優秀賞 2位",
			awardName: "ヨンリムウォンソフトラボ 特別賞",
			image: { src: "/mock/award-likelion.svg", alt: "ヨンリムウォンソフトラボ 特別賞の賞状" },
		},
	],
	selections: {
		label: "Selections",
		items: [
			{
				period: "2024",
				title: "国家理工系奨学生に選出",
				awardName: "科学技術情報通信部長官 奨学証書",
				description: "江原大学校 コンピュータ工学科の在学中、学部成績をもとに選抜される韓国の国家理工系奨学生に選ばれました。",
				image: { src: "/mock/scholarship.svg", alt: "国家理工系奨学証書" },
			},
			{
				period: "2025",
				title: "ビルダーズキャンプ 選抜",
				awardName: "Karrot（タングンマーケット）",
				description: "20名を選ぶ Karrot のビルダーズキャンプに選ばれました。",
				// Scan pending: an omitted `src` renders the design's placeholder tile.
				image: { alt: "ビルダーズキャンプの修了証" },
			},
		],
	},
	certifications: [
		{ period: "2026.02", title: "JLPT N1", host: "国際交流基金", image: { src: "/mock/cert-jlpt-n1.svg", alt: "JLPT N1 の合格証" } },
		{ period: "2026.09", title: "情報処理技師\n韓国国家資格", host: "韓国産業人力公団", image: { src: "/mock/cert-engineer.svg", alt: "情報処理技師の資格証" } },
		{ period: "2026.05", title: "TOPCIT", detail: "レベル4 / 677点", host: "情報通信企画評価院", image: { alt: "TOPCIT の成績表" } },
	],
};

/* ------------------------------------------------------------------ *
 * Journey
 * ------------------------------------------------------------------ */

/**
 * The trunk carries the chapters — where I was — and each chapter branches
 * into what actually happened there. Enrolments and graduations are the
 * chapter heads themselves, so they are deliberately not repeated as events.
 */
export const journey: JourneyContent = {
	label: "Journey",
	chapters: [
		{
			period: "2014 – 2018",
			title: "小・中学校",
			events: [
				{
					year: "2014",
					title: "Linux Minecraft サーバーの構築",
					featured: true,
					stack: "Linux",
					detail: "仮想サーバーを借りて24時間動くサーバーを立ち上げ、Linux とネットワークを覚えました。",
				},
				{ year: "2015", title: "PHP テクスチャパック共有サイト" },
				{ year: "2017", title: "Android スクリーン翻訳機" },
			],
		},
		{
			period: "2018 – 2021",
			title: "善隣インターネット高等学校",
			subtitle: "ソフトウェア科",
			events: [
				{ year: "2018", title: "校内ハッカソン 2位" },
				{
					year: "2019",
					title: "Unreal Engine でのゲーム開発",
					featured: true,
					stack: "Unreal · C++",
					detail: "MyRunnerGame、ラン・ケット。はじめてチームを組んでゲームを最後まで完成させました。",
				},
				{ year: "2020", title: "VRゲーム Tooth, Unrevived" },
			],
		},
		{
			period: "2021",
			title: "江原大学校",
			subtitle: "コンピュータ工学科",
			events: [
				{
					year: "2021",
					title: "KNU コーディングプラットフォームの開発",
					featured: true,
					stack: "React",
					detail: "学内のプログラミング課題をブラウザで採点するオンラインジャッジ。",
				},
				{ year: "2021", title: "起業コンテスト 2位" },
			],
		},
		{
			period: "2021.12 – 2023.12",
			title: "Nudge Healthcare",
			subtitle: "Backend Engineer\nTimespread・Linkareer チーム",
			events: [
				{ year: "2022", title: "「今日のボックス」のサービス移行" },
				{
					year: "2022",
					title: "19億件テーブルの無停止マイグレーション",
					featured: true,
					stack: "NestJS · MySQL",
					detail: "INT の上限に達したログテーブルを BIGINT へ移しました。サービスは止まっていません。",
				},
				{ year: "2022", title: "Linkareer 自己PR添削サービスの開発" },
				{
					year: "2023",
					title: "月1,000万ウォンを超えるサーバー費用を40%削減",
					featured: true,
					stack: "GraphQL · Node.js",
					detail: "レガシーの PHP サービスを移し、空いたサーバーを返却しました。",
				},
			],
		},
		{
			period: "2024 – 現在",
			title: "江原大学校に復学",
			events: [
				{ year: "2024", title: "LIKELION 連合ハッカソン 2位" },
				{ year: "2024", title: "学科首席 · GPA 4.5" },
				{
					year: "2025",
					title: "鳥取大学へ交換留学",
					featured: true,
					stack: "JLPT N1",
					detail: "3年後期に派遣。国際交流課のバディプログラムで日本人留学生の生活を支援しました。",
				},
				{
					year: "2025",
					title: "コスモのノートの開発",
					featured: true,
					stack: "Cloudflare Workers",
					detail: "サーバーを持たずに運用する学習サービス。釜山地域大会 2位。",
				},
			],
		},
	],
	now: {
		label: "現在",
		detail: "江原大学校に復学、コスモのノートと enqor を運営中",
	},
};

/* ------------------------------------------------------------------ *
 * Resume
 * ------------------------------------------------------------------ */

/**
 * The closing screen: an invitation on the left, the form that answers it on
 * the right. `sent` and `errors` are the states the .pen does not draw — the
 * frame shows the form at rest, and a form that only has a resting state is
 * not a form.
 */
export const resume: ResumeContent = {
	eyebrow: "Resume",
	/** The line break is deliberate in the design. */
	headline: "履歴書をメールで\nお送りします",
	lead: "お名前とメールアドレスをご記入いただければ、最新の履歴書を PDF でお送りします。",
	direct: { label: "Direct", address: "ballbot@alignnetworks.io" },
	fields: {
		name: { label: "お名前", placeholder: "山田 花子" },
		email: { label: "メールアドレス", placeholder: "hanako.yamada@gmail.com" },
	},
	submit: "履歴書を受け取る",
	submitting: "送信中",
	privacy: "ご記入いただいたアドレスは履歴書の送付にのみ使用し、保管はいたしません。",
	errors: {
		"name-required": "お名前をご記入ください。",
		"name-too-long": "お名前が長すぎます。",
		"email-required": "メールアドレスをご記入ください。",
		"email-format": "メールアドレスをもう一度ご確認ください。",
		/** Delivery failed. The line hands the reader the address instead of a dead end. */
		send: "ただいまリクエストを受け付けられません。こちらのアドレスへ直接お送りください。",
	},
	sent: {
		title: "リクエストを受け付けました",
		detail: "宛てに履歴書をお送りします。",
		again: "もう一度送る",
	},
};
