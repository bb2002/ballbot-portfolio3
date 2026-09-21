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
	FooterContent,
	HeroContent,
	JourneyContent,
	NavContent,
	OverviewContent,
	ProjectsContent,
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
	eyebrow: "ballbot.dev | Backend Engineer",
	/** The line break is deliberate in the design; it is kept on wide viewports. */
	headline: "19億件を無停止で\n移行したエンジニア",
	actions: {
		primary: { label: "プロジェクトを見る", href: "#projects" },
		secondary: [
			{ label: "GitHub ↗", href: "https://github.com/" },
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
				{ emphasis: "19億件のテーブルを", detail: "点検時間1時間以内にマイグレーション" },
				{ emphasis: "毎分1,500件のリクエストを受ける", detail: "サービスをマイグレーション" },
				{ emphasis: "月1,000万ウォンを超えていた AWS 費用を", detail: "30%削減" },
				{ emphasis: "32GB を超えるメモリを占有して停止していた", detail: "API サーバーを正常化" },
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
	featured: [
		{
			period: "2025 ~ 現在",
			title: "コスモのノート",
			description:
				"動画講義をアップロードすると、画面と音声を解析して要約ノートにまとめるサービスです。サーバーレス構成なので待機中はサーバー費用がかからず、アクセスが集中しても自動でスケールします。",
			links: [{ label: "cosmonote.site", href: "https://cosmonote.site" }],
			thumbnail: { src: "/mock/cosmo-thumb.svg", alt: "コスモのノートの画面。オペレーティングシステム第5週のまとめノートと復習クイズ" },
			appIcon: { src: "/brand/cosmonote-icon.png", alt: "コスモのノートのアプリアイコン" },
		},
		{
			period: "2025 ~ 現在",
			title: "enqor",
			description:
				"リアルタイムの映像・音声通話サービスです。バイブコーディングを初めて取り入れたプロジェクトで、AI の応答を改善するためのハーネスや、通話料金の精算をめぐるエンジニアリング上の工夫が詰まっています。",
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
			appIcon: { src: "/brand/enqor-icon.png", alt: "enqor のアプリアイコン" },
		},
	],
	archive: [
		{
			period: "2024",
			title: "HEALIX",
			description:
				"症状を伝えると、最も近くて適した病院を提案します。公共データポータルの医療情報とアプリ内の GPS 座標をまとめて AI に渡す設計です。",
			// 공개된 저장소가 백엔드 하나뿐이라 메뉴 없이 바로 간다.
			links: [{ label: "Github", href: "https://github.com/bb2002/healix-backend" }],
			thumbnail: { src: "/mock/helix-thumb.svg", alt: "HEALIX の画面。症状の選択とおすすめ病院の一覧" },
		},
		{
			period: "2023",
			title: "WATERFLAKE",
			description:
				"プラグインを入れるだけで、外部から接続できないゲームサーバーに接続用のドメインが生まれます。TCP トンネリングと SRV レコードを軸にしています。",
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
			// No art yet: an omitted `src` renders the design's placeholder tile.
			thumbnail: { alt: "WATERFLAKE の画面。トンネルが張られた Minecraft サーバーのドメイン" },
		},
		{
			period: "2018",
			title: "スクリーン翻訳機",
			description:
				"中学生のときにはじめて作り、収益化まで到達したアプリです。端末を振ると画面をキャプチャし、オーバーレイで訳文を表示します。",
			// 저장소가 하나뿐이라 메뉴 없이 바로 간다.
			links: [{ label: "Github", href: "https://github.com/bb2002/ProjectScreenTranslator" }],
			// No art yet: an omitted `src` renders the design's placeholder tile.
			thumbnail: { alt: "スクリーン翻訳機の画面。キャプチャした画面の上にオーバーレイで訳文が重なっている様子" },
		},
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
			slug: "bigint-migration",
			year: "2023",
			title: "19億件のテーブルを点検時間1時間以内にマイグレーション",
			subtitle: "データに優先順位をつけ、ロールバック可能なマイグレーションスクリプトを用意しました。",
			body: [
				"Timespread のランダムボックスは、広告を見るとキャッシュを引ける機能です。広告を見るたびに、等級と当選金額、時刻がテーブルに一行ずつ積まれ、ユーザーが次第に増え、レコード数は19億件に達しました。主キーが INT で宣言されていたため、上限である21億件まで2か月しか残っていない状況でした。",
				"まず、サービスの特徴を調べました。ボックスは24時間後に期限切れになり、ランキングも1か月分までしか使わないため、必要なのは直近1か月分のデータだけでした。また、MySQL でテーブル名を変える操作は容量に左右されないことも分かりました。",
				"深夜にサービスを止め、既存テーブルの名前を変えて接続を切ったうえで、BIGINT で宣言した新しいテーブルを作りました。用意しておいた MySQL のプロシージャを実行して1か月分のデータを移し、サービスを再開しました。",
				"マイグレーション自体は成功しましたが、Android アプリが BIGINT を処理できないことが分かりました。INT の負の領域を使おうとチームリーダーに提案し、採用されて目の前の障害を防げました。この対応で、ランダムボックスのリファクタリングに余裕を持って取りかかれるようになりました。",
			],
		},
		{
			slug: "realtime-redesign",
			year: "2023",
			title: "毎分1,500件のリクエストを受けるサービスのマイグレーション",
			subtitle: "DynamoDB と Redis でサービスを再設計し、6時間ごとに更新されていたランキングをリアルタイムで動くよう最適化しました。",
			body: [
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
	label: "Certificates",
	items: [
		{ period: "2026.02", title: "JLPT N1", host: "国際交流基金", image: { src: "/mock/cert-jlpt-n1.svg", alt: "JLPT N1 の合格証" } },
		{ period: "2026.09", title: "情報処理技師\n韓国国家資格", host: "韓国産業人力公団", image: { src: "/mock/cert-engineer.svg", alt: "情報処理技師の資格証" } },
		{
			period: "2026",
			event: "第3回 全国大学ソフトウェア成果共有フォーラム",
			title: "最優秀賞 1位",
			detail: "東亜大学校 総長賞",
			description: "**コスモのノート**で、全国13チームが集まった大会で受賞しました。",
			image: { src: "/mock/award-donga.svg", alt: "東亜大学校 総長賞の賞状" },
		},
		{
			period: "2024",
			event: "LIKELION 大学12期 中央ハッカソン",
			title: "最優秀賞 2位",
			detail: "ヨンリムウォンソフトラボ 特別賞",
			description: "**HEALIX**で、全国55校・約1,500名が集まった大会で受賞しました。",
			image: { src: "/mock/award-likelion.svg", alt: "ヨンリムウォンソフトラボ 特別賞の賞状" },
		},
		{
			period: "2024",
			title: "国家優秀奨学金（理工系）",
			detail: "科学技術情報通信部長官 証書",
			description: "全国で約1,000名のみが選抜される韓国の国家優秀奨学金（理工系）を授与されました。",
			image: { src: "/mock/scholarship.svg", alt: "国家優秀奨学金（理工系）の証書" },
		},
		{
			period: "2025",
			title: "Daangn Builder’s Camp",
			detail: "Karrot 修了証",
			description: "Karrot が選抜した20名ほどの少数精鋭ハッカソンに選ばれました。",
			// Scan pending: an omitted `src` renders the design's placeholder tile.
			image: { alt: "ビルダーズキャンプの修了証" },
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
					detail: "VPS を借りてサーバーを構築し、最高同時接続120人を記録しました。",
				},
				{
					year: "2015",
					title: "小学校 卒業",
					detail: "将来の夢をコンピュータープログラマーと決め、それが今まで続いています。",
				},
				{
					year: "2015",
					title: "**テクスチャパック コミュニティ**の開発",
					featured: true,
					detail: "PHP で動く小規模コミュニティを開発し、登録者100人あまりを集めました。",
				},
				{
					year: "2017",
					title: "**スクリーン翻訳機**の開発",
					featured: true,
					detail: "スマホを振ると画面の上に翻訳を重ねて表示するアプリを開発し、1,000ダウンロードと収益化を経験しました。",
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
					detail: "**スクリーン翻訳機**で校内コンテストの2位を受賞しました。",
				},
				{
					year: "2019",
					title: "VR ゲームの開発",
					featured: true,
					detail: "Unreal Engine を使って **VRTetris**、**Tooth**、**Unrevived** の VR ゲームを開発しました。",
				},
				{
					year: "2020",
					title: "モバイルゲームの開発",
					featured: true,
					detail: "Unreal Engine を使って **MyRunnerGame** のモバイルゲームを開発しました。",
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
					title: "KNU コーディングプラットフォームの開発",
					detail: "江原大学校 SW 中心大学事業団が進めたコーディングプラットフォーム構築事業で、チームリーダーを務めました。",
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
					detail: "エラーも出さずにインスタンスのメモリを使い切って OOM が起きる問題を、メモリダンプの調査で解決しました。",
				},
				{
					year: "2022",
					title: "月1,000万ウォンを超えていた AWS 費用を30%削減",
					detail: "インスタンスの増減ルールを見直し、安価で高性能な Graviton インスタンスを導入しました。",
				},
				{
					year: "2023",
					title: "19億件のテーブルを点検時間1時間以内にマイグレーション",
					featured: true,
					detail: "データに優先順位をつけ、ロールバック可能なマイグレーションスクリプトを用意しました。",
				},
				{
					year: "2023",
					title: "毎分1,500件のリクエストを受けるサービスのマイグレーション",
					featured: true,
					detail: "DynamoDB と Redis でサービスを再設計し、6時間ごとに更新されていたランキングをリアルタイムで動くよう最適化しました。",
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
					detail: "**HEALIX**で、全国55校・約1,500名が集まった大会で受賞しました。",
				},
				{
					year: "2024",
					title: "国際交流課のバディプログラム",
					detail: "日本から来た交換留学生を一人受け持ち、学校生活を支え、サークルで良い思い出をつくれるよう手伝いました。",
				},
				{
					year: "2025",
					title: "国家優秀奨学金（理工系）",
					detail: "全国で約1,000名のみが選抜される韓国の国家優秀奨学金（理工系）を授与されました。",
				},
				{
					year: "2025",
					title: "鳥取大学へ交換留学",
					featured: true,
					detail: "日本での実際の暮らしを体験し、茶道部で伝統文化を学びました。",
				},
				{
					year: "2026",
					title: "第3回 全国大学ソフトウェア成果共有フォーラム 1位",
					featured: true,
					detail: "**コスモのノート**で、全国13チームが集まった大会で受賞しました。",
				},
				{
					year: "2026",
					title: "enqor の開発",
					detail: "Align Networks で開発部門のすべてを任されています。",
				},
			],
		},
	],
};
