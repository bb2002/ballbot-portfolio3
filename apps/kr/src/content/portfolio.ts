/**
 * Copy and asset paths for the Korean build. The text is written for the real
 * site; the artwork under /public/mock is stand-in vector art until real
 * screenshots and scans arrive — swap the `src` paths and nothing else moves.
 *
 * Every export here fills a type from @ballbot/shared, so a field the shared
 * components expect cannot go missing and the Japanese build cannot drift out
 * of shape from this one.
 */

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
	ScrollCueContent,
} from "@ballbot/shared";

/** Where the Japanese build lives. The apex router remembers the choice. */
const JAPANESE_BUILD = "https://ballbot.dev/go/ja";

export const nav: NavContent = {
	ariaLabel: "섹션 바로가기",
	items: [
		{ id: "projects", label: "Projects" },
		{ id: "experience", label: "Experience" },
		{ id: "certificates", label: "Certificates" },
		{ id: "journey", label: "Journey" },
	],
};

export const scrollCue: ScrollCueContent = {
	ariaLabel: "프로젝트 섹션으로 이동",
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
	ariaLabel: "소개",
	eyebrow: "ballbot.dev",
	/**
	 * The line break is deliberate in the design; it is kept on wide viewports.
	 * The headline is a 관형형 clause — it does not close on its own, `subtitle`
	 * is the noun it lands on. Reword one and the other has to follow.
	 */
	// TODO(placeholder): draft copy around the 816만 figure. The number and the
	// verb are both unconfirmed; it is still a 관형형 clause that lands on `subtitle`.
	headline: "816만 유저가 쓰는\n서비스를 지켜 온",
	subtitle: "소프트웨어 엔지니어 김수빈입니다.",
	actions: {
		primary: { label: "프로젝트 보기", href: "#projects" },
		secondary: [{ label: "GitHub ↗", href: "https://github.com/" }],
	},
	otherMarket: {
		lang: "ja",
		lead: "日本からご覧になっていますか？",
		emphasis: "日本語版",
		tail: "もご用意しております。",
		href: JAPANESE_BUILD,
	},
};

export const overview: OverviewContent = {
	label: "Overview",
	blocks: [
		{
			value: "2 Years",
			caption: "넛지헬스케어 타임스프레드, 링커리어 팀 백엔드",
			items: [
				{ emphasis: "19억 건의 테이블을", detail: "점검 시간 1시간내에 마이그레이션" },
				{ emphasis: "분당 1,500건의 요청을 받는", detail: "서비스 마이그레이션" },
				{ emphasis: "월 1천만원을 넘기던 AWS 비용을", detail: "30% 절감" },
				{ emphasis: "32GB 넘게 메모리를 점유하고 멈추던", detail: "API 서버 정상화" },
			],
		},
		{
			value: "2 Awards",
			items: [
				{ emphasis: "코스모의 노트,", detail: "전국 대회 최우수상 1위 달성" },
				{ emphasis: "HEALIX,", detail: "1,500명 규모 전국 해커톤 2위 달성" },
			],
		},
		{
			value: "4.43 / 4.5",
			caption: "강원대학교 컴퓨터공학과 재학",
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
		src: "/projects/cosmonote/01-landing.png",
		width: 1537,
		height: 763,
		caption: "랜딩",
		alt: '코스모의 노트 첫 화면. "동영상 강의에 끌려다니지 마세요" 문구 옆으로 요약노트·퀴즈·스크립트 카드가 떠 있다',
	},
	{
		src: "/projects/cosmonote/02-features.png",
		width: 1537,
		height: 763,
		caption: "기능",
		alt: "기능 소개 화면. 요약노트, 영상 타임라인, 퀴즈 자동 생성, 암기카드, 코멘트를 카드로 늘어놓았다",
	},
	{
		src: "/projects/cosmonote/03-note.png",
		width: 1537,
		height: 763,
		caption: "요약노트",
		alt: "노트 화면. 왼쪽에 강의 영상과 타임라인, 오른쪽에 EC2 인스턴스 배포 실습을 정리한 요약노트가 있다",
	},
	{
		src: "/projects/cosmonote/04-quiz-create.png",
		width: 1537,
		height: 763,
		caption: "퀴즈 만들기",
		alt: "퀴즈 만들기 대화상자. 문항 수와 선택형·단답형 같은 문항 유형을 고르는 중이다",
	},
	{
		src: "/projects/cosmonote/05-quiz-solve.png",
		width: 1537,
		height: 763,
		caption: "퀴즈 풀기",
		alt: "퀴즈 풀이 화면. 열 문항 중 첫 문항을 풀고 있고 진행률과 임시 저장 상태가 보인다",
	},
	{
		src: "/projects/cosmonote/06-flashcard-create.png",
		width: 1537,
		height: 763,
		caption: "암기카드 만들기",
		alt: "암기카드 만들기 대화상자. 노트 내용으로 자동 생성할지 빈 카드로 시작할지 고른다",
	},
	{
		src: "/projects/cosmonote/07-flashcard-study.png",
		width: 1537,
		height: 763,
		caption: "암기카드 학습",
		alt: "암기카드 학습 화면. 스물다섯 장짜리 덱의 첫 카드와 알아요·몰라요·건너뛰기 집계가 있다",
	},
	{
		src: "/projects/cosmonote/08-public-notes.png",
		width: 1537,
		height: 763,
		caption: "공개 노트",
		alt: "공개 노트 찾기 화면. 검색창 아래로 다른 사람이 공개한 노트가 카드로 깔려 있다",
	},
	{
		src: "/projects/cosmonote/09-api.png",
		width: 1537,
		height: 763,
		caption: "개발자 API",
		alt: "개발자 API 소개 화면. 자료 업로드부터 요약노트·퀴즈 조회까지의 엔드포인트를 터미널 모양 카드에 적어 두었다",
	},
];

/**
 * WATERFLAKE 화면, 터널 하나가 생겨서 붙기까지의 순서대로. 1280×654 / 1502×768 /
 * 1052×513 로 비율이 제각각이라 각자 자기 크기를 들고 간다.
 */
const WATERFLAKE_SCREENS: readonly Media[] = [
	{
		src: "/projects/waterflake/01-tunnel-create.png",
		width: 1280,
		height: 654,
		caption: "터널 만들기",
		alt: "WATERFLAKE 관리 화면. 서버 이름과 마인크래프트 자바 에디션, 서브도메인과 리전을 채워 터널을 만드는 폼",
	},
	{
		src: "/projects/waterflake/02-overview.png",
		width: 1502,
		height: 768,
		caption: "터널 대시보드",
		alt: "터널 개요 화면. 발급된 접속 주소와 연결 상태, 플러그인이 쓸 키 한 쌍과 트래픽 사용량이 보인다",
	},
	{
		src: "/projects/waterflake/03-server-connect.png",
		width: 1052,
		height: 513,
		caption: "서버 연결",
		alt: "게임 서버 콘솔. 플러그인이 터널 스무 개를 열고 터널링에 성공해 발급받은 도메인에 붙었다",
	},
];

/**
 * enqor 화면, 대화 한 통이 성사되기까지의 순서대로. 01 은 스토어 대표 이미지로,
 * 카드 타일이 그대로 갤러리의 첫 장이 된다. 가운데 아홉 장은 1080×2400 세로
 * 캡처라 뷰어가 높이로 잡아 주고, 10 만 두 대를 나란히 찍은 실물 사진이라 가로다.
 */
const ENQOR_SCREENS: readonly Media[] = [
	{
		src: "/projects/enqor/01-poster.png",
		width: 1024,
		height: 500,
		caption: "enqor",
		alt: 'enqor 스토어 대표 이미지. "나의 평범함이 빛나는 순간" 문구 아래로 앱 화면을 띄운 휴대폰 두 대가 놓여 있다',
	},
	{
		src: "/projects/enqor/02-login.jpg",
		width: 1080,
		height: 2400,
		caption: "로그인",
		alt: "enqor 로그인 화면. 휴대폰 번호와 Google, 카카오톡 로그인 버튼이 있다",
	},
	{
		src: "/projects/enqor/03-home.jpg",
		width: 1080,
		height: 2400,
		caption: "전문가 탐색",
		alt: "홈 화면. 주제별 전문가 카드가 가로로 놓이고 아래에 나와 연결된 전문가와 지금 대화 가능한 전문가가 있다",
	},
	{
		src: "/projects/enqor/04-profile.jpg",
		width: 1080,
		height: 2400,
		caption: "전문가 프로필",
		alt: "전문가 프로필 화면. 인증 타이틀과 해시태그가 붙어 있고 아래에 대화 요청 버튼이 있다",
	},
	{
		src: "/projects/enqor/05-request.jpg",
		width: 1080,
		height: 2400,
		caption: "대화 요청",
		alt: "대화 요청 시트. 보유 클랩과 초당 연결 비용을 보여 주고 영상이나 음성 중 하나를 고르게 한다",
	},
	{
		src: "/projects/enqor/06-clap-station.jpg",
		width: 1080,
		height: 2400,
		caption: "클랩 충전",
		alt: "클랩 스테이션. 500 클랩부터 25,000 클랩까지 묶음이 가격과 할인율과 함께 놓여 있다",
	},
	{
		src: "/projects/enqor/07-payment.jpg",
		width: 1080,
		height: 2400,
		caption: "결제",
		alt: "구글 플레이 인앱 결제 시트. 5,000 클랩 상품과 결제 수단이 올라와 있다",
	},
	{
		src: "/projects/enqor/08-connecting.jpg",
		width: 1080,
		height: 2400,
		caption: "연결 중",
		alt: "거는 쪽 화면. 카메라가 미리 열린 채 대화 연결 중이라 뜨고 남은 시간과 보유 클랩이 보인다",
	},
	{
		src: "/projects/enqor/09-incoming.jpg",
		width: 1080,
		height: 2220,
		caption: "요청 수신",
		alt: "받는 쪽 화면. 상대의 인증 타이틀과 해시태그가 붙은 요청 카드에 거절과 수락 버튼이 달려 있다",
	},
	{
		src: "/projects/enqor/10-call.jpg",
		width: 2000,
		height: 1500,
		caption: "통화",
		alt: "휴대폰 두 대를 나란히 놓고 실제로 영상 통화를 하는 사진. 양쪽 화면에 서로의 카메라가 떠 있다",
	},
	{
		src: "/projects/enqor/11-review.jpg",
		width: 1080,
		height: 2400,
		caption: "리뷰",
		alt: "대화가 끝난 뒤의 리뷰 화면. 통화 시간과 다섯 단계 평가, 좋았던 점을 고르는 태그가 있다",
	},
];

/**
 * HEALIX, 해커톤 발표자료에서 고른 세 장. 앱 화면은 슬라이드 안에 300px 남짓한
 * 목업으로 박혀 있어 떼어 내면 뷰어에서 뭉갠다 — 슬라이드째로 쓰되, 발표 순서가
 * 아니라 이야기 순서로 놓았다.
 *
 * 표지에서는 QR 을 지웠고, 본문 두 장은 진행 막대와 덱 내비게이션이 붙어 있던
 * 위쪽 52px 을 잘라 냈다. 덱의 껍데기지 내용이 아니라서 652 로 낮아졌다.
 */
const HEALIX_SCREENS: readonly Media[] = [
	{
		src: "/projects/healix/01-cover-5badd1f3.png",
		width: 1244,
		height: 701,
		caption: "HEALIX",
		alt: 'HEALIX 발표자료 표지. "증상 분석부터 나와 가까운 병원까지" 문구 옆으로 근처 병원과 예약 정보를 띄운 휴대폰이 놓여 있다',
	},
	{
		src: "/projects/healix/02-background-1e2c9b10.png",
		width: 1244,
		height: 652,
		caption: "기획 배경",
		alt: "기획 배경 슬라이드. 통증을 직접 검색해 보는 화면과 꾸준히 이어지는 검색량 그래프로 문제를 짚는다",
	},
	{
		src: "/projects/healix/03-flow-fb243485.png",
		width: 1244,
		height: 652,
		caption: "증상 입력과 병원 예약",
		alt: "서비스 흐름 슬라이드. 부위를 고르고 증상을 적는 화면과, 분석 결과에서 곧바로 근처 병원을 예약하는 화면이 나란히 있다",
	},
];

/**
 * 스크린 번역기 화면, 하는 일을 먼저 보여 주고 손잡이를 나중에 여는 순서대로.
 * 2018년 안드로이드 앱이라 넷 다 세로 캡처고, 뷰어가 높이로 잡아 준다.
 */
const SCREEN_TRANSLATOR_SCREENS: readonly Media[] = [
	{
		src: "/projects/screen-translator/01-game.jpg",
		width: 485,
		height: 996,
		caption: "게임 번역",
		alt: "일본어 게임 공지 위에 한국어 번역문이 덮여 있다. 원문 자리에 그대로 겹쳐 띄운다",
	},
	{
		src: "/projects/screen-translator/02-web.jpg",
		width: 560,
		height: 996,
		caption: "웹 번역",
		alt: "일본어 웹 문서 위에 한국어 번역문이 덮여 있고, 위쪽에 원어 감지와 번역할 언어를 고르는 줄이 있다",
	},
	{
		src: "/projects/screen-translator/03-settings.jpg",
		width: 560,
		height: 996,
		caption: "기본 설정",
		alt: "기본 설정 화면. 번역할 언어 쌍과 인식 정확도, 번역기 딜레이와 인공지능 번역 여부를 고른다",
	},
	{
		src: "/projects/screen-translator/04-sensitivity.jpg",
		width: 560,
		height: 996,
		caption: "감도 설정",
		alt: "감도 설정 화면. 얼마나 세게 흔들어야 인식할지 슬라이더로 맞추고 그 자리에서 흔들어 시험해 본다",
	},
];

export const projects: ProjectsContent = {
	label: "Projects",
	featured: [
		{
			period: "2025 ~ 현재",
			title: "코스모의 노트",
			description:
				"영상 강의를 올리면 화면과 음성을 분석해 요약 노트로 만들어주는 서비스입니다. 서버리스 구조라 대기 중에는 서버 비용이 들지 않고, 접속이 몰려도 자동으로 확장됩니다.",
			stats: [
				{ value: "1,300+", label: "누적 가입자" },
				{ value: "48만 원", label: "월 매출" },
				{ value: "160", label: "DAU" },
			],
			links: [{ label: "cosmonote.site", href: "https://cosmonote.site" }],
			// 갤러리 첫 장이 그대로 타일이 된다. 25:17 로 잘리지만 헤드라인과 떠 있는
			// 카드가 모두 그 안에 들어오고, 눌렀을 때 크게 뜨는 화면과 같은 그림이다.
			thumbnail: {
				src: "/projects/cosmonote/01-landing.png",
				alt: "코스모의 노트 첫 화면",
			},
			appIcon: { src: "/brand/cosmonote-icon.png", alt: "코스모의 노트 앱 아이콘" },
			// The order is the service's own: 들어와서(랜딩·기능) → 만들고(노트) →
			// 익히고(퀴즈·암기카드, 각각 만들기 다음에 푸는 화면) → 나누고(공개 노트)
			// → 붙인다(API). Paired screens stay adjacent so paging one step never
			// leaves a 만들기 화면 without the thing it made.
			gallery: COSMO_SCREENS,
		},
		{
			period: "2025 ~ 현재",
			title: "enqor",
			description:
				"실시간 영상·음성 통화 서비스입니다. 바이브 코딩을 처음 적용한 프로젝트며, AI 응답을 개선하기 위한 하네스, 통화 비용 정산을 위한 엔지니어링적 고민이 녹아있습니다.",
			stats: [
				{ value: "2,400+", label: "누적 학습 문장" },
				{ value: "31%", label: "7일 재방문율" },
				{ value: "90", label: "DAU" },
			],
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
				src: "/projects/enqor/01-poster.png",
				alt: "enqor 스토어 대표 이미지",
			},
			appIcon: { src: "/brand/enqor-icon.png", alt: "enqor 앱 아이콘" },
			// 들어가서 → 고르고 → 요청하고 → 충전·결제하고 → 걸고 → 받고 → 통화하고
			// → 남긴다. 08 과 09 는 같은 9초를 거는 쪽과 받는 쪽에서 각각 찍은 것이다.
			gallery: ENQOR_SCREENS,
		},
	],
	archive: [
		{
			period: "2024",
			title: "HEALIX",
			description:
				"증상을 말하면 가장 가까우면서 적절한 병원을 추천합니다. 공공데이터포털의 의료 정보와 앱 내 GPS 좌표를 함께 AI에게 전달하도록 설계했습니다.",
			// 공개된 저장소가 백엔드 하나뿐이라 메뉴 없이 바로 간다.
			links: [{ label: "Github", href: "https://github.com/bb2002/healix-backend" }],
			// 표지를 그대로 담으면 QR 과 팀 크레딧이 들어오고 워드마크가 바로 옆 카드
			// 제목과 겹친다. 표지에서 폰 목업만 205:141 로 떼어 냈다.
			thumbnail: {
				src: "/projects/healix/00-thumb-4ae26d2b.png",
				alt: "HEALIX 화면, 지도 아래로 근처 병원과 예약 정보가 늘어서 있다",
			},
			// 살아 있는 앱이 아니라 2024년 해커톤 결과물이다. 남은 건 발표자료뿐이라
			// 표지 → 왜 만들었나 → 어떻게 쓰나 세 장으로 줄였다.
			gallery: HEALIX_SCREENS,
		},
		{
			period: "2023",
			title: "WATERFLAKE",
			description:
				"플러그인만 설치하면 외부 접속이 막힌 게임 서버에 접속 가능한 도메인이 생깁니다. TCP 터널링과 SRV 레코드를 핵심으로 사용했습니다.",
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
				src: "/projects/waterflake/01-tunnel-create.png",
				alt: "WATERFLAKE 화면, 새 터널을 만드는 폼",
			},
			// 터널을 만들고 → 주소와 키를 받고 → 서버가 붙는다. 마지막 장이 터널링
			// 성공 로그라, 넘기다 보면 설명이 말한 도메인이 실제로 사는 걸로 끝난다.
			gallery: WATERFLAKE_SCREENS,
		},
		{
			period: "2018",
			title: "스크린 번역기",
			description:
				"중학생 때 처음 만들어 수익화까지 성공한 앱입니다. 휴대폰을 흔들면 화면을 캡처해 오버레이로 번역문을 띄웁니다.",
			// 저장소가 하나뿐이라 메뉴 없이 바로 간다.
			links: [{ label: "Github", href: "https://github.com/bb2002/ProjectScreenTranslator" }],
			// 넷 다 세로라 205:141 타일에 담기면 띠가 된다. 첫 장에서 게임 로고와 그
			// 위에 덮인 번역 팝업이 함께 들어오게 잘라 냈다 — 카드 문구가 말하는
			// 동작이 타일 안에서 그대로 보이고, 누르면 그 장이 먼저 뜬다.
			thumbnail: {
				src: "/projects/screen-translator/00-thumb.jpg",
				alt: "게임 화면 위에 한국어 번역문이 덮여 있다",
			},
			// 게임에서 쓰고 → 웹에서도 쓰고 → 그제서야 언어와 흔드는 세기를 어디서
			// 고치는지 보여 준다. 무엇을 하는 앱인지가 먼저고 설정은 그다음이다.
			gallery: SCREEN_TRANSLATOR_SCREENS,
		},
	],
	gallery: {
		open: "화면 크게 보기",
		previous: "이전 화면",
		next: "다음 화면",
		close: "닫기",
		pick: "화면 고르기",
	},
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
		teams: "타임스프레드, 링커리어 팀",
		logos: [
			{ src: "/brand/timespread.webp", alt: "타임스프레드 로고" },
			{ src: "/brand/linkareer.webp", alt: "링커리어 로고" },
		],
	},
	highlights: [
		{
			slug: "bigint-migration",
			year: "2023",
			title: "19억 건의 테이블을 점검 시간 1시간내에 마이그레이션",
			subtitle: "데이터에 우선순위를 정하고, 롤백 가능한 마이그레이션 스크립트를 작성했습니다.",
			paragraphs: [
				"타임스프레드의 랜덤 상자는 광고를 보면 캐시를 뽑는 기능입니다. 광고를 볼 때마다 등급과 당첨 금액, 시각이 테이블에 한 줄씩 쌓였고, 사용자가 점점 늘면서 레코드 개수가 19억 건에 닿았습니다. 기본 키가 INT로 선언되어 있어 한계인 21억 건까지 2개월밖에 남지 않은 상황이었습니다.",
				"먼저, 서비스의 특징을 조사했습니다. 상자는 24시간 뒤에 만료되고 랭킹 또한 한 달치까지만 사용하므로 최근 한 달치 데이터만 필요로 했습니다. 또한, MySQL에서 테이블 이름을 바꾸는 일은 용량에 무관하다는 사실도 알게 되었습니다.",
				"새벽에 서비스를 중지하고, 기존 테이블의 이름을 바꿔 연결을 끊은 뒤, BIGINT로 선언된 새 테이블을 만들었습니다. 준비된 MySQL 프로시저를 실행해 한 달치 데이터를 옮기고 서비스를 다시 오픈했습니다.",
				"마이그레이션 자체는 성공했으나, 안드로이드 앱이 BIGINT를 처리하지 못한다는 점을 알게 되었습니다. INT의 음수 영역을 쓰자고 팀장님께 제안드렸고, 채택되어 당장의 장애를 막았습니다. 이 조치로 여유롭게 랜덤 상자 서비스를 리팩토링할 수 있게 되었습니다.",
			],
		},
		{
			slug: "realtime-redesign",
			year: "2023",
			title: "분당 1,500건의 요청을 받는 서비스 마이그레이션",
			subtitle:
				"DynamoDB와 Redis로 서비스를 재설계하여 6시간에 한번 갱신되던 랭킹을 실시간으로 동작하게 최적화했습니다.",
			paragraphs: [
				"랜덤 상자 서비스의 마이그레이션을 끝내고 리팩토링까지 1년을 기다렸습니다. 앱이 ID 값을 정수로 다루고 있어 문자열로 바꾸는 업데이트를 내보냈고, 이 버전이 사용자의 99%까지 배포되는 데 시간이 걸렸기 때문입니다.",
				"리팩토링에서는 성능과 비용을 한 번에 해결하기 위해 저장소를 셋으로 나눴습니다. 당첨 확률과 일일 당첨 제한 같은 관리자 설정은 MySQL에 두고, 상자 기록은 DynamoDB에 저장했습니다. 랭킹은 Redis의 Sorted Set에 저장했습니다. 특히, DynamoDB는 파티션 키로 읽고 쓸 때 속도와 비용이 모두 좋았고, Sorted Set은 랭킹 구현에 최적화된 자료구조였습니다.",
				"그 결과, 6시간마다 엄청난 부하를 일으키며 동작하던 랭킹 배치는 완전히 사라지고, 실시간으로 바뀌었습니다. 상자 처리 로직에서 MySQL은 읽기만 하여 디비 인스턴스 비용도 크게 줄일 수 있었습니다.",
				"문제를 발견해 팀장님께 보고한 날부터 최종 리팩토링까지 1년 동안 이 서비스를 담당했습니다. 제가 쓴 코드가 조금씩 트래픽을 받아 100% 배포되는 것을 지켜본 경험은 아직도 잊을 수 없는 개발의 즐거움입니다.",
			],
		},
		{
			slug: "aws-cost",
			year: "2022",
			title: "월 1천만원을 넘기던 AWS 비용을 30% 절감",
			subtitle: "인스턴스 증감 규칙을 재설정하고 저렴하고 고성능의 Graviton 인스턴스를 도입했습니다.",
			// TODO(placeholder): the story is not written yet; each line names what goes there.
			paragraphs: [
				"자리표시 본문입니다. 어떤 비용이 월 1,000만 원을 넘겼고, 청구서에서 무엇이 가장 컸는지 적을 자리입니다.",
				"자리표시 본문입니다. 무엇을 줄이고 무엇을 옮겨서 30%를 덜어냈는지, 그 대가로 포기한 것은 없었는지 적을 자리입니다.",
			],
		},
		{
			slug: "api-memory",
			year: "2022",
			title: "32GB 넘게 메모리를 점유하고 멈추던 API 서버 정상화",
			subtitle:
				"아무 오류 없이 인스턴스의 메모리를 모두 소진하고 OOM이 발생하는 문제를 메모리 덤프 조사로 해결했습니다.",
			// TODO(placeholder): the story is not written yet; each line names what goes there.
			paragraphs: [
				"자리표시 본문입니다. 어떤 API가 어떤 상황에서 메모리를 32GB 넘게 점유하고 멈췄는지 적을 자리입니다.",
				"자리표시 본문입니다. 원인을 어떻게 좁혀 갔고, 무엇을 고쳐 정상화했는지 적을 자리입니다.",
			],
		},
	],
};

/* ------------------------------------------------------------------ *
 * Certificates
 * ------------------------------------------------------------------ */

export const certificates: CertificatesContent = {
	label: "Certificates",
	gallery: {
		open: "증서 크게 보기",
		previous: "이전 장",
		next: "다음 장",
		close: "닫기",
		pick: "장 고르기",
	},
	items: [
		{
			period: "2026.02",
			title: "JLPT N1",
			host: "일본국제교류기금",
			image: { src: "/certificates/02-jlpt-n1-f09f16ac.jpg", alt: "JLPT N1 합격증" },
			gallery: [
				{
					src: "/certificates/02-jlpt-n1-f09f16ac.jpg",
					width: 1400,
					height: 1988,
					caption: "JLPT N1",
					alt: "JLPT N1 일본어능력인정서. 생년월일과 증서·수험번호는 가렸다",
				},
			],
		},
		{
			period: "2026.09",
			title: "정보처리기사",
			host: "한국산업인력공단",
			image: { src: "/certificates/01-gisa-632fa275.jpg", alt: "정보처리기사 자격증" },
			gallery: [
				{
					src: "/certificates/01-gisa-632fa275.jpg",
					width: 1400,
					height: 1982,
					caption: "정보처리기사",
					alt: "국가기술자격증. 생년월일과 자격·관리번호는 가렸다",
				},
			],
		},
		{
			period: "2026",
			event: "제3회 전국대학 소프트웨어 성과 공유포럼",
			title: "최우수상 1등",
			detail: "동아대학교 총장상",
			description: "**코스모의 노트**로 전국 13개의 팀이 모인 대회에서 수상했습니다.",
			// 같은 수상에 상장이 둘이다. 카드에는 총장상을 세우고, 열면 둘 다 넘긴다.
			image: { src: "/certificates/01-chongjangsang-7e6f9199.jpg", alt: "동아대학교 총장상 상장" },
			gallery: [
				{
					src: "/certificates/01-chongjangsang-7e6f9199.jpg",
					width: 1400,
					height: 1980,
					caption: "총장상",
					alt: "동아대학교 총장 명의의 상장",
				},
				{
					src: "/certificates/02-choiwoosusang-f026e085.jpg",
					width: 1054,
					height: 1440,
					caption: "최우수상",
					alt: "동아대학교 소프트웨어혁신센터장 명의의 최우수상 상장",
				},
			],
		},
		{
			period: "2024",
			event: "멋쟁이사자처럼 대학 12기 중앙 해커톤",
			title: "최우수상 2등",
			detail: "영림원소프트랩 특별상",
			description: "**HEALIX**로 전국 55개 학교 1,500여 명이 모인 대회에서 수상했습니다.",
			image: { src: "/certificates/03-likelion-e9406103.jpg", alt: "영림원소프트랩 특별상 상장" },
			gallery: [
				{
					src: "/certificates/03-likelion-e9406103.jpg",
					width: 442,
					height: 585,
					caption: "최우수상",
					alt: "멋쟁이사자처럼 대학 12기 중앙 해커톤 최우수상, 영림원소프트랩 특별상 상장",
				},
			],
		},
		{
			period: "2024",
			title: "국가우수장학(이공계)",
			detail: "과학기술정보통신부장관 증서",
			description: "전국에서 약 1,000여 명만 선발되는 국가우수장학금(이공계)를 수여받았습니다.",
			image: { src: "/mock/scholarship.svg", alt: "국가우수장학(이공계) 증서" },
		},
		{
			period: "2025",
			title: "Daangn Builder’s Camp",
			detail: "당근마켓 수료증",
			description: "당근마켓에서 선발한 20여 명의 소수정예 해커톤에 선발되었습니다.",
			// Scan pending: an omitted `src` renders the design's placeholder tile.
			image: { alt: "당근 빌더스캠프 수료증" },
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
			title: "초·중학교",
			events: [
				{
					year: "2014",
					title: "리눅스 환경에서 마인크래프트 24시간 서버 구축",
					featured: true,
					detail: "VPS 서버를 빌려 서버를 구축하고, 120명의 최고 동시접속자를 달성했습니다.",
				},
				{
					year: "2015",
					title: "초등학교 졸업",
					detail: "컴퓨터 프로그래머를 장래희망으로 하여 지금까지 이어지고 있습니다.",
				},
				{
					year: "2015",
					title: "**택스팩 커뮤니티** 개발",
					featured: true,
					detail: "PHP로 동작하는 소모임 서비스를 개발하여 가입자 100여 명을 달성했습니다.",
				},
				{
					year: "2017",
					title: "**스크린번역기** 개발",
					featured: true,
					detail:
						"휴대폰을 흔들면 화면 위에 번역 오버레이를 띄워주는 앱을 개발해 1천 다운로드와 수익화를 경험했습니다.",
				},
			],
		},
		{
			period: "2018 – 2021",
			title: "선린인터넷고등학교",
			subtitle: "소프트웨어과",
			events: [
				{
					year: "2018",
					title: "모바일콘텐츠경진대회 수상",
					detail: "**스크린번역기**로 교내 대회에서 2등을 수상했습니다.",
				},
				{
					year: "2019",
					title: "VR 게임 개발",
					featured: true,
					detail: "언리얼 엔진을 활용해 **VRTetris**, **Tooth**, **Unrevived** VR 게임을 개발했습니다.",
				},
				{
					year: "2020",
					title: "모바일 게임 개발",
					featured: true,
					detail: "언리얼 엔진을 활용해 **RunCatGame**, **MyRunnerGame** 모바일 게임을 개발했습니다.",
				},
			],
		},
		{
			period: "2021",
			title: "강원대학교",
			subtitle: "컴퓨터공학과",
			events: [
				{
					year: "2021",
					title: "KNU 코딩플랫폼 개발",
					detail: "강원대학교 SW중심대학사업단에서 진행한 코딩 플랫폼 구축 사업에서 팀장 역할을 맡았습니다.",
				},
			],
		},
		{
			period: "2021.12 – 2023.12",
			title: "넛지헬스케어",
			subtitle: "Backend Engineer\n타임스프레드, 링커리어 팀",
			events: [
				{
					year: "2022",
					title: "32GB 넘게 메모리를 점유하고 멈추던 API 서버 정상화",
					detail:
						"아무 오류 없이 인스턴스의 메모리를 모두 소진하고 OOM이 발생하는 문제를 메모리 덤프 조사로 해결했습니다.",
				},
				{
					year: "2022",
					title: "월 1천만원을 넘기던 AWS 비용을 30% 절감",
					detail: "인스턴스 증감 규칙을 재설정하고 저렴하고 고성능의 Graviton 인스턴스를 도입했습니다.",
				},
				{
					year: "2023",
					title: "19억 건의 테이블을 점검 시간 1시간내에 마이그레이션",
					featured: true,
					detail: "데이터에 우선순위를 정하고, 롤백 가능한 마이그레이션 스크립트를 작성했습니다.",
				},
				{
					year: "2023",
					title: "분당 1,500건의 요청을 받는 서비스 마이그레이션",
					featured: true,
					detail:
						"DynamoDB와 Redis로 서비스를 재설계하여 6시간에 한번 갱신되던 랭킹을 실시간으로 동작하게 최적화했습니다.",
				},
			],
		},
		{
			period: "2024 – 현재",
			title: "강원대학교",
			subtitle: "컴퓨터공학과",
			events: [
				{
					year: "2024",
					title: "멋쟁이사자처럼 대학 12기 중앙 해커톤 2등",
					detail: "**HEALIX**로 전국 55개 학교 1,500여 명이 모인 대회에서 수상했습니다.",
				},
				{
					year: "2024",
					title: "국제교류처 버디 프로그램",
					detail:
						"일본에서 온 교환학생 한 명을 맡아 학교생활을 돕고, 동아리에서 좋은 추억을 만들 수 있도록 도왔습니다.",
				},
				{
					year: "2025",
					title: "국가우수장학(이공계)",
					detail: "전국에서 약 1,000여 명만 선발되는 국가우수장학금(이공계)를 수여받았습니다.",
				},
				{
					year: "2025",
					title: "일본 돗토리대학교 교환학생",
					featured: true,
					detail: "일본에서의 실제 생활을 체험하고, 다도부에서 전통 문화를 배웠습니다.",
				},
				{
					year: "2026",
					title: "제3회 전국대학 소프트웨어 성과 공유포럼 1등",
					featured: true,
					detail: "**코스모의 노트**로 전국 13개의 팀이 모인 대회에서 수상했습니다.",
				},
				{
					year: "2026",
					title: "enqor 개발",
					detail: "Align Networks에서 모든 개발 부문을 책임지고 있습니다.",
				},
			],
		},
	],
};
