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
				"講義の録音をアップロードすると、まとめノートと復習クイズを生成する学習サービスです。Cloudflare Workers と D1、R2、Workers AI だけで、サーバーを持たずに運用しています。",
			stats: [
				{ value: "1,300+", label: "累計登録者" },
				{ value: "48万ウォン", label: "月間売上" },
				{ value: "160", label: "DAU" },
			],
			tags: ["Cloudflare Workers", "D1 · R2", "Workers AI"],
			thumbnail: { src: "/mock/cosmo-thumb.svg", alt: "コスモのノートの画面。オペレーティングシステム第5週のまとめノートと復習クイズ" },
			appIcon: { src: "/mock/cosmo-icon.svg", alt: "コスモのノートのアプリアイコン" },
		},
		{
			period: "2025 ~ 現在",
			title: "enqor",
			description:
				"日本語ニュースを一文ずつ書き取りながらリスニングを鍛えるウェブアプリです。NHK やさしい日本語のニュースを毎日自動で収集し、採点と進捗の管理はブラウザ側で完結します。",
			stats: [
				{ value: "2,400+", label: "累計学習文" },
				{ value: "31%", label: "7日間再訪率" },
				{ value: "90", label: "DAU" },
			],
			tags: ["Next.js", "Cloudflare Pages", "Web Speech API"],
			thumbnail: { src: "/mock/enqor-thumb.svg", alt: "enqor の画面。日本語の文を書き取る入力欄" },
			appIcon: { src: "/mock/enqor-icon.svg", alt: "enqor のアプリアイコン" },
		},
	],
	archive: [
		{
			period: "2024",
			title: "ヘリックス",
			description: "症状を選ぶと診療科と近くの病院を探してくれるサービス。全国連合大会 2位。",
			thumbnail: { src: "/mock/helix-thumb.svg", alt: "ヘリックスの画面。症状の選択と病院の一覧" },
		},
		{
			period: "2021",
			title: "KNU コーディングプラットフォーム",
			description: "学内のプログラミング課題をブラウザで採点するオンラインジャッジ。起業コンテスト 2位。",
			thumbnail: { src: "/mock/knu-judge-thumb.svg", alt: "KNU コーディングプラットフォームの画面。コードの提出と採点結果" },
		},
		{
			period: "2018",
			title: "スクリーン翻訳機",
			description: "画面をキャプチャしてその場に翻訳を重ねる Android アプリ。校内ハッカソン 2位。",
			thumbnail: { src: "/mock/screen-translator-thumb.svg", alt: "スクリーン翻訳機の画面。英語の本文の上に表示された翻訳" },
		},
	],
	list: [
		{ year: "2020", title: "VRゲーム Tooth, Unrevived", summary: "Unreal Engine で作った VR ホラーゲーム。レベルスクリプトとインタラクションを担当しました。" },
		{ year: "2019", title: "Unreal Engine 2Dプラットフォーマー", summary: "ゲーム開発の授業の成果物。Steam でのデモ配信まで進めました。" },
		{ year: "2016", title: "キー365 受託プロジェクト", summary: "はじめての受託。PHP で鍵店の予約管理ページを作りました。" },
		{ year: "2014", title: "Linux Minecraft サーバー", summary: "自分で立てた最初のサーバー。同時接続40人を捌きながら Linux とネットワークを覚えました。" },
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
				"Timespread の行動ログテーブルは主キーが INT で、21億という上限まで2億件しか残っていませんでした。放置すれば数か月で書き込みが止まる状況だったため、BIGINT の主キーを持つ新しいテーブルへ移すことにしました。",
				"全体を一度にコピーするのではなく、直近1時間分だけを先に移して書き込み経路を新テーブルへ切り替えました。残りの19億件は夜間バッチで追いかけ、サービスは一度も停止していません。",
			],
		},
		{
			year: "2023",
			title: "毎分1,500リクエストを受ける\nサービスのマイグレーション",
			paragraphs: [
				"Linkareer の「今日のボックス」は毎分1,500件のリクエストを受けるレガシーの PHP サービスで、専用サーバー3台の上で独立して動いていました。これを Node.js で書き直し、ほかのサービスと同じ Kubernetes クラスタへ移しました。",
				"トラフィックを1%から段階的に流しながら応答時間とエラー率を比較し、2週間で切り替えを終えました。空いたサーバーを返却し、月1,000万ウォンを超えていたインフラ費用を40%削減しています。",
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
			period: "2025",
			title: "釜山地域大会 2位",
			awardName: "東亜大学校 総長賞",
			description: "コスモのノートで釜山地域大会の2位を受賞しました。受賞作は Projects のセクションで続けてご覧いただけます。",
			image: { src: "/mock/award-donga.svg", alt: "東亜大学校 総長賞の賞状" },
		},
		{
			period: "2024",
			title: "全国連合大会 2位",
			awardName: "ヨンリムソフト 院長賞",
			description: "症状から病院を探すサービス ヘリックスで、LIKELION 全国連合大会の2位を受賞しました。",
			image: { src: "/mock/award-likelion.svg", alt: "ヨンリムソフト 院長賞の賞状" },
		},
	],
	sub: [
		{ period: "2018", title: "校内ハッカソン 2位\nスクリーン翻訳機", host: "善隣インターネット高等学校", image: { src: "/mock/award-hackathon.svg", alt: "校内ハッカソンの賞状" } },
		{ period: "2021", title: "起業コンテスト 2位\nKNU コーディングプラットフォーム", host: "江原大学校", image: { src: "/mock/award-startup.svg", alt: "起業コンテストの賞状" } },
		{ period: "2023", title: "オープンソース開発者大会\n入選", host: "情報通信産業振興院", image: { src: "/mock/award-oss.svg", alt: "オープンソース開発者大会の賞状" } },
		{ period: "2022", title: "学科プログラミング\nコンテスト 金賞", host: "江原大学校 コンピュータ工学科", image: { src: "/mock/award-dept.svg", alt: "学科プログラミングコンテストの賞状" } },
	],
	scholarship: {
		label: "Scholarship",
		award: {
			period: "2024",
			title: "国家理工系奨学生に選出",
			awardName: "科学技術情報通信部長官 奨学証書",
			description: "江原大学校 コンピュータ工学科の在学中、学部成績をもとに選抜される韓国の国家理工系奨学生に選ばれました。",
			image: { src: "/mock/scholarship.svg", alt: "国家理工系奨学証書" },
		},
	},
	certifications: [
		{ period: "2025", title: "JLPT N1", host: "国際交流基金", image: { src: "/mock/cert-jlpt-n1.svg", alt: "JLPT N1 の合格証" } },
		{ period: "2024", title: "JLPT N2", host: "国際交流基金", image: { src: "/mock/cert-jlpt-n2.svg", alt: "JLPT N2 の合格証" } },
		{ period: "2025", title: "情報処理技師\n韓国国家資格", host: "韓国産業人力公団", image: { src: "/mock/cert-engineer.svg", alt: "情報処理技師の資格証" } },
		{ period: "2020", title: "プログラミング技能士\n韓国国家資格", host: "韓国産業人力公団", image: { src: "/mock/cert-programming.svg", alt: "プログラミング技能士の資格証" } },
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
