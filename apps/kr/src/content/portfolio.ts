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
	HeroContent,
	JourneyContent,
	NavContent,
	OverviewContent,
	ProjectsContent,
	ResumeContent,
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
		{ id: "resume", label: "Resume" },
	],
};

export const scrollCue: ScrollCueContent = {
	ariaLabel: "프로젝트 섹션으로 이동",
	href: "#projects",
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
	headline: "변화에 맞추고,\n제품에 집중하는",
	subtitle: "소프트웨어 엔지니어 김수빈입니다.",
	actions: {
		primary: { label: "프로젝트 보기", href: "#projects" },
		secondary: [
			{ label: "GitHub ↗", href: "https://github.com/" },
			{ label: "Resume ↗", href: "#resume" },
		],
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
				{ emphasis: "19억 건 규모 데이터 테이블을", detail: "점검 시간 1시간 내에 마이그레이션" },
				{ emphasis: "분당 1,500건의 요청을 받는", detail: "기능 리팩토링" },
			],
		},
		{
			value: "3 Honors",
			items: [
				{ emphasis: "코스모의 노트,", detail: "전국 대회에서 동아대학교 총장상 수상" },
				{ emphasis: "HEALIX,", detail: "멋쟁이사자처럼 12기 중앙 해커톤 2위" },
				{ emphasis: null, detail: "국가우수장학(이공계) 선발, 과학기술정보통신부장관 증서" },
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

export const projects: ProjectsContent = {
	label: "Projects",
	archiveLabel: "Archive",
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
			thumbnail: { src: "/mock/cosmo-thumb.svg", alt: "코스모의 노트 화면, 운영체제 5주차 정리 노트와 복습 퀴즈" },
			appIcon: { src: "/mock/cosmo-icon.svg", alt: "코스모의 노트 앱 아이콘" },
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
			thumbnail: { src: "/mock/enqor-thumb.svg", alt: "enqor 화면, 일본어 문장 받아쓰기 입력창" },
			appIcon: { src: "/mock/enqor-icon.svg", alt: "enqor 앱 아이콘" },
		},
	],
	archive: [
		{
			period: "2025",
			title: "newtrospect",
			description:
				"뉴스 본문에서 어려운 용어, 수치, 자극적 표현을 하이라이팅하는 익스텐션입니다. 사용자가 방문하는 모든 페이지를 검사하기 위해 최적화에 대한 고민을 했습니다.",
			// No art yet: an omitted `src` renders the design's placeholder tile.
			thumbnail: { alt: "newtrospect 화면, 뉴스 기사 본문에 하이라이트가 얹힌 모습" },
		},
		{
			period: "2024",
			title: "HEALIX",
			description:
				"증상을 말하면 가장 가까우면서 적절한 병원을 추천합니다. 공공데이터포털의 의료 정보와 앱 내 GPS 좌표를 함께 AI에게 전달하도록 설계했습니다.",
			thumbnail: { src: "/mock/helix-thumb.svg", alt: "HEALIX 화면, 증상 선택과 추천 병원 목록" },
		},
		{
			period: "2023",
			title: "WATERFLAKE",
			description:
				"플러그인만 설치하면 외부 접속이 막힌 게임 서버에 접속 가능한 도메인이 생깁니다. TCP 터널링과 SRV 레코드를 핵심으로 사용했습니다.",
			// No art yet: an omitted `src` renders the design's placeholder tile.
			thumbnail: { alt: "WATERFLAKE 화면, 터널이 연결된 마인크래프트 서버 도메인" },
		},
	],
	list: [
		{ year: "2023", platform: "NestJS", title: "toshort.video", summary: "숏츠 영상을 만들어주는 영상 편집 서비스입니다. editly와 Cloudflare를 사용했습니다." },
		{ year: "2022", platform: "Node.js", title: "오토미리", summary: "개인적 사용으로, 매일 오전 10시에 통근버스 좌석을 대신 예약해주는 매크로입니다." },
		{ year: "2021", platform: "React", title: "KNU 코딩 플랫폼", summary: "강원대 SW중심대학에서 진행한 교내 코딩 교육 플랫폼 구축 프로그램에 팀장으로 참여했습니다." },
		{ year: "2021", platform: "React", title: "스타트업 홈페이지·관리자 콘솔", summary: "회사 소개 페이지와 내부 운영 콘솔을 외주로 받아 구축했습니다." },
		{ year: "2020", platform: "Unreal Engine", title: "MyRunnerGame", summary: "매치메이킹, 데디케이티드 서버로 멀티플레이가 가능한 달리기 게임입니다." },
		{ year: "2020", platform: "VR", title: "Unrevived", summary: "사방에서 오는 적을 처치하는 VR 기반 서바이벌 게임입니다." },
		{ year: "2020", platform: "Unreal Engine", title: "RunCatGame", summary: "고등학교 친구와 협업하여 만든 달리기 게임입니다. 구글 스토어에 출시까지 경험했습니다." },
		{ year: "2020", platform: "Unreal Engine", title: "WebMediaPlayer", summary: "언리얼 엔진에서 영상 재생을 돕는 플러그인입니다. GitHub에 공개해 스타 12개를 받았습니다." },
		{ year: "2019", platform: "VR", title: "VRTetris", summary: "VR에서 동작하는 간단한 테트리스 게임입니다." },
		{ year: "2019", platform: "VR", title: "Tooth", summary: "위아래에 울퉁불퉁한 블록이 있어, 천장이 떨어지기 전에 틈으로 캐릭터를 옮겨 살아남는 아케이드 게임입니다." },
		{ year: "2018", platform: "Android", title: "스크린 번역기", summary: "중학생 때 처음 만들어 수익화까지 성공한 앱입니다. 휴대폰을 흔들면 화면을 캡처해 오버레이로 번역문을 띄웁니다." },
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
		teams: "타임스프레드, 링커리어 팀",
		logos: [
			{ src: "/mock/logo-timespread.svg", alt: "타임스프레드 로고" },
			{ src: "/mock/logo-linkareer.svg", alt: "링커리어 로고" },
		],
		notes: ["2년 동안 한계에 닿은 서비스 두 개를 무중단으로 옮겼고,", "서버 비용을 40% 줄인 뒤 학교로 돌아왔습니다."],
	},
	highlights: [
		{
			year: "2022",
			title: "약 19억 건의\n대규모 데이터 마이그레이션",
			paragraphs: [
				"타임스프레드의 랜덤 상자는 광고를 보면 캐시를 뽑는 기능입니다. 광고를 볼 때마다 등급과 당첨 금액, 시각이 테이블에 한 줄씩 쌓였고, 사용자가 점점 늘면서 레코드 개수가 19억 건에 닿았습니다. 기본 키가 INT로 선언되어 있어 한계인 21억 건까지 2개월밖에 남지 않은 상황이었습니다.",
				"먼저, 서비스의 특징을 조사했습니다. 상자는 24시간 뒤에 만료되고 랭킹 또한 한 달치까지만 사용하므로 최근 한 달치 데이터만 필요로 했습니다. 또한, MySQL에서 테이블 이름을 바꾸는 일은 용량에 무관하다는 사실도 알게 되었습니다.",
				"새벽에 서비스를 중지하고, 기존 테이블의 이름을 바꿔 연결을 끊은 뒤, BIGINT로 선언된 새 테이블을 만들었습니다. 준비된 MySQL 프로시저를 실행해 한 달치 데이터를 옮기고 서비스를 다시 오픈했습니다.",
				"마이그레이션 자체는 성공했으나, 안드로이드 앱이 BIGINT를 처리하지 못한다는 점을 알게 되었습니다. INT의 음수 영역을 쓰자고 팀장님께 제안드렸고, 채택되어 당장의 장애를 막았습니다. 이 조치로 여유롭게 랜덤 상자 서비스를 리팩토링할 수 있게 되었습니다.",
			],
		},
		{
			year: "2023",
			title: "분당 1,500개의 요청을 받는\n서비스 마이그레이션",
			paragraphs: [
				"랜덤 상자 서비스의 마이그레이션을 끝내고 리팩토링까지 1년을 기다렸습니다. 앱이 ID 값을 정수로 다루고 있어 문자열로 바꾸는 업데이트를 내보냈고, 이 버전이 사용자의 99%까지 배포되는 데 시간이 걸렸기 때문입니다.",
				"리팩토링에서는 성능과 비용을 한 번에 해결하기 위해 저장소를 셋으로 나눴습니다. 당첨 확률과 일일 당첨 제한 같은 관리자 설정은 MySQL에 두고, 상자 기록은 DynamoDB에 저장했습니다. 랭킹은 Redis의 Sorted Set에 저장했습니다. 특히, DynamoDB는 파티션 키로 읽고 쓸 때 속도와 비용이 모두 좋았고, Sorted Set은 랭킹 구현에 최적화된 자료구조였습니다.",
				"그 결과, 6시간마다 엄청난 부하를 일으키며 동작하던 랭킹 배치는 완전히 사라지고, 실시간으로 바뀌었습니다. 상자 처리 로직에서 MySQL은 읽기만 하여 디비 인스턴스 비용도 크게 줄일 수 있었습니다.",
				"문제를 발견해 팀장님께 보고한 날부터 최종 리팩토링까지 1년 동안 이 서비스를 담당했습니다. 제가 쓴 코드가 조금씩 트래픽을 받아 100% 배포되는 것을 지켜본 경험은 아직도 잊을 수 없는 개발의 즐거움입니다.",
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
			event: "제3회 전국대학 소프트웨어 성과 공유포럼",
			title: "최우수상 1등",
			awardName: "동아대학교 총장상",
			description: "**코스모의 노트**로 전국 13개의 팀이 모인 대회에서 수상했습니다.",
			image: { src: "/mock/award-donga.svg", alt: "동아대학교 총장상 상장" },
		},
		{
			period: "2024",
			event: "멋쟁이사자처럼 대학 12기 중앙 해커톤",
			title: "최우수상 2등",
			awardName: "영림원소프트랩 특별상",
			description: "**HEALIX**로 전국 55개 학교 1,500여 명이 모인 대회에서 수상했습니다.",
			image: { src: "/mock/award-likelion.svg", alt: "영림원소프트랩 특별상 상장" },
		},
	],
	selections: {
		label: "Selections",
		items: [
			{
				period: "2024",
				title: "국가우수장학(이공계)",
				awardName: "과학기술정보통신부장관 증서",
				description: "전국에서 약 1,000여 명만 선발되는 국가우수장학금(이공계)를 수여받았습니다.",
				image: { src: "/mock/scholarship.svg", alt: "국가우수장학(이공계) 증서" },
			},
			{
				period: "2025",
				title: "Daangn Builder’s Camp",
				awardName: "당근마켓 수료증",
				description: "당근마켓에서 선발한 20여 명의 소수정예 해커톤에 선발되었습니다.",
				// Scan pending: an omitted `src` renders the design's placeholder tile.
				image: { alt: "당근 빌더스캠프 수료증" },
			},
		],
	},
	certifications: [
		{ period: "2026.02", title: "JLPT N1", host: "일본국제교류기금", image: { src: "/mock/cert-jlpt-n1.svg", alt: "JLPT N1 합격증" } },
		{ period: "2026.09", title: "정보처리기사", host: "한국산업인력공단", image: { src: "/mock/cert-engineer.svg", alt: "정보처리기사 자격증" } },
		{ period: "2026.05", title: "TOPCIT", detail: "수준 4 / 677점", host: "정보통신기획평가원", image: { alt: "TOPCIT 성적표" } },
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
					detail: "휴대폰을 흔들면 화면 위에 번역 오버레이를 띄워주는 앱을 개발해 1천 다운로드와 수익화를 경험했습니다.",
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
					title: "IWOP 동아리 활동",
					detail: "3년간 웹 개발 동아리에서 멘토링 등 활동을 했습니다.",
				},
				{
					year: "2018",
					title: "모바일콘텐츠경진대회 수상",
					featured: true,
					detail: "**스크린번역기**로 교내 대회에서 2등을 수상했습니다.",
				},
				{
					year: "2019",
					title: "VR 게임 개발",
					featured: true,
					detail: "언리얼 엔진을 활용해 **VRTetris**, **Tooth**, **Unrevived** VR 게임을 개발했습니다.",
				},
				{
					year: "2019",
					title: "선린해커톤 수상",
					detail: "서울 시내 빈 주차 자리 찾기 프로젝트로 교내 대회에서 3등을 수상했습니다.",
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
					featured: true,
					detail: "강원대학교 SW중심대학사업단에서 진행한 코딩 플랫폼 구축 사업에서 팀장 역할을 맡았습니다.",
				},
				{
					year: "2021",
					title: "SW창업도전챌린지 수상",
					detail: "PLACEHOLDER — 대회 내용과 수상 내역 확인 필요.",
				},
			],
		},
		{
			period: "2021.12 – 2023.12",
			title: "넛지헬스케어",
			subtitle: "Backend Engineer\n타임스프레드, 링커리어 팀",
			events: [
				{ year: "2022", title: "오늘의 상자 서비스 마이그레이션" },
				{
					year: "2022",
					title: "19억 건 테이블 무중단 마이그레이션",
					featured: true,
					stack: "NestJS · MySQL",
					detail: "INT 한계에 닿은 로그 테이블을 BIGINT로 옮겼습니다. 서비스는 멈추지 않았습니다.",
				},
				{ year: "2022", title: "링커리어 자소서 서비스 개발" },
				{
					year: "2023",
					title: "월 1,000만 원이 넘는 서버 비용 40% 절감",
					featured: true,
					stack: "GraphQL · Node.js",
					detail: "레거시 PHP 서비스를 옮기고 비어 있던 서버를 반납했습니다.",
				},
			],
		},
		{
			period: "2024 – 현재",
			title: "강원대학교 복학",
			events: [
				{ year: "2024", title: "멋쟁이사자처럼 연합 해커톤 2등" },
				{ year: "2024", title: "학과 석차 1위 · GPA 4.5" },
				{
					year: "2025",
					title: "일본 돗토리대학 교환학생",
					featured: true,
					detail: "3학년 2학기 파견, 국제교류처 버디 프로그램에서 일본인 유학생을 도왔습니다.",
				},
				{
					year: "2025",
					title: "코스모의 노트 개발",
					featured: true,
					stack: "Cloudflare Workers",
					detail: "서버 없이 운영하는 학습 서비스. 부산 지역 대회 2등.",
				},
			],
		},
	],
	now: {
		label: "현재",
		detail: "강원대학교 복학, 코스모의 노트와 enqor 운영 중",
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
 *
 * The .pen names this frame Contact and sets the eyebrow to match. It is
 * called Resume here because that is what the screen actually hands over —
 * the address below the form is the contact route, not the screen's subject.
 */
export const resume: ResumeContent = {
	eyebrow: "Resume",
	/** The line break is deliberate in the design. */
	headline: "이력서를 메일로\n보내드립니다",
	lead: "이름과 메일 주소를 남겨주시면 가장 최근 이력서를 PDF로 보내드립니다.",
	direct: { label: "Direct", address: "ballbot@alignnetworks.io" },
	fields: {
		name: { label: "이름", placeholder: "김서연" },
		email: { label: "메일 주소", placeholder: "seoyeon.kim@gmail.com" },
	},
	submit: "이력서 받기",
	submitting: "보내는 중",
	privacy: "입력한 주소는 이력서 발송에만 사용하고 따로 보관하지 않습니다.",
	errors: {
		"name-required": "이름을 입력해주세요.",
		"name-too-long": "이름이 너무 깁니다.",
		"email-required": "메일 주소를 입력해주세요.",
		"email-format": "메일 주소를 다시 확인해주세요.",
		/** Delivery failed. The line hands the reader the address instead of a dead end. */
		send: "지금은 요청을 받을 수 없습니다. 다음 주소로 직접 보내주세요.",
	},
	sent: {
		title: "요청을 받았습니다",
		detail: "주소로 이력서를 보내드리겠습니다.",
		again: "다시 보내기",
	},
};
