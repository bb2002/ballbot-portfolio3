/**
 * Copy and asset paths for every screen. The text is written for the real
 * site; the artwork under /public/mock is stand-in vector art until real
 * screenshots and scans arrive — swap the `src` paths and nothing else moves.
 */

export type Media = {
	/** Path under /public. Leave undefined to render the placeholder tile. */
	src?: string;
	alt: string;
};

export const NAV_ITEMS = [
	{ id: "projects", label: "Projects", icon: "folder-dot" },
	{ id: "experience", label: "Experience", icon: "building-2" },
	{ id: "certificates", label: "Certificates", icon: "award" },
	{ id: "journey", label: "Journey", icon: "route" },
	{ id: "resume", label: "Resume", icon: "file-text" },
] as const;

export type NavItemId = (typeof NAV_ITEMS)[number]["id"];

/* ------------------------------------------------------------------ *
 * Hero
 * ------------------------------------------------------------------ */

export const hero = {
	eyebrow: "ballbot.dev | Backend Engineer",
	/** The line break is deliberate in the design; it is kept on wide viewports. */
	headline: "19억 건을 무중단으로\n옮긴 백엔드 엔지니어",
	actions: {
		primary: { label: "프로젝트 보기", href: "#projects" },
		secondary: [
			{ label: "GitHub ↗", href: "https://github.com/" },
			{ label: "Resume ↗", href: "#" },
		],
	},
	japaneseNotice: {
		lead: "日本からご覧になっていますか？",
		emphasis: "日本語版",
		tail: "もご用意しております。",
		href: "/ja",
	},
} as const;

export const overview = {
	label: "Overview",
	career: {
		value: "2 Years",
		caption: "넛지헬스케어 타임스프레드 팀 백엔드 담당",
		highlights: [
			{ emphasis: "19억 건 규모 데이터 테이블", detail: " 무중단 마이그레이션" },
			{ emphasis: "분당 1,500건 요청", detail: " 레거시 서비스 이전, 서버 비용 40% 절감" },
		],
	},
	honors: {
		value: "3 Honors",
		items: [
			{ emphasis: "코스모의 노트", detail: " 동아대학교 총장상" },
			{ emphasis: "헬릭스", detail: " 영림소프트원장상" },
			{ emphasis: null, detail: "국가이공계 장학생, 과학기술정보통신부" },
		],
	},
	gpa: {
		value: "4.43 / 4.5",
		caption: "강원대학교 컴퓨터공학과 재학, 학과 석차 1위",
	},
} as const;

/* ------------------------------------------------------------------ *
 * Projects
 * ------------------------------------------------------------------ */

export type FeaturedProject = {
	period: string;
	title: string;
	description: string;
	stats: { value: string; label: string }[];
	tags: string[];
	thumbnail: Media;
	appIcon: Media;
	href?: string;
};

export const featuredProjects: FeaturedProject[] = [
	{
		period: "2025 ~ 현재",
		title: "코스모의 노트",
		description:
			"강의 녹음을 올리면 정리 노트와 복습 퀴즈를 만들어 주는 학습 서비스입니다. Cloudflare Workers와 D1, R2, Workers AI만으로 서버 없이 운영합니다.",
		stats: [
			{ value: "1,300+", label: "누적 가입자" },
			{ value: "48만 원", label: "월 매출" },
			{ value: "160", label: "DAU" },
		],
		tags: ["Cloudflare Workers", "D1 · R2", "Workers AI"],
		thumbnail: { src: "/mock/cosmo-thumb.svg", alt: "코스모의 노트 화면, 운영체제 5주차 정리 노트와 복습 퀴즈" },
		appIcon: { src: "/mock/cosmo-icon.svg", alt: "코스모의 노트 앱 아이콘" },
	},
	{
		period: "2025 ~ 현재",
		title: "enqor",
		description:
			"일본어 뉴스를 문장 단위로 받아쓰며 듣기를 훈련하는 웹앱입니다. NHK 이지 뉴스를 매일 자동 수집하고, 채점과 진도 관리는 브라우저에서 끝냅니다.",
		stats: [
			{ value: "2,400+", label: "누적 학습 문장" },
			{ value: "31%", label: "7일 재방문율" },
			{ value: "90", label: "DAU" },
		],
		tags: ["Next.js", "Cloudflare Pages", "Web Speech API"],
		thumbnail: { src: "/mock/enqor-thumb.svg", alt: "enqor 화면, 일본어 문장 받아쓰기 입력창" },
		appIcon: { src: "/mock/enqor-icon.svg", alt: "enqor 앱 아이콘" },
	},
];

export type ArchiveProject = {
	period: string;
	title: string;
	description: string;
	thumbnail: Media;
	href?: string;
};

export const archiveProjects: ArchiveProject[] = [
	{
		period: "2024",
		title: "헬릭스",
		description: "증상을 고르면 진료과와 가까운 병원을 찾아 주는 서비스. 전국 연합대회 2등.",
		thumbnail: { src: "/mock/helix-thumb.svg", alt: "헬릭스 화면, 증상 선택과 병원 목록" },
	},
	{
		period: "2021",
		title: "KNU 코딩 플랫폼",
		description: "교내 프로그래밍 과제를 브라우저에서 채점하는 온라인 저지. 창업경진대회 2등.",
		thumbnail: { src: "/mock/knu-judge-thumb.svg", alt: "KNU 코딩 플랫폼 화면, 코드 제출과 채점 결과" },
	},
	{
		period: "2018",
		title: "스크린 번역기",
		description: "화면을 캡처해 그 자리에서 번역을 띄우는 안드로이드 앱. 교내 해커톤 2등.",
		thumbnail: { src: "/mock/screen-translator-thumb.svg", alt: "스크린 번역기 화면, 영어 본문 위에 뜬 한국어 번역" },
	},
];

export type ProjectListItem = {
	year: string;
	title: string;
	summary: string;
	href?: string;
};

export const projectList: ProjectListItem[] = [
	{ year: "2020", title: "VR 게임 Tooth, Unrevived", summary: "언리얼 엔진으로 만든 VR 호러 게임. 레벨 스크립트와 상호작용을 맡았습니다." },
	{ year: "2019", title: "언리얼 엔진 2D 플랫포머", summary: "게임 개발 수업 결과물. 스팀 데모 배포까지 진행했습니다." },
	{ year: "2016", title: "키365 외주 프로젝트", summary: "처음 맡은 외주. PHP로 열쇠 매장의 예약 관리 페이지를 만들었습니다." },
	{ year: "2014", title: "Linux 마인크래프트 서버", summary: "직접 세운 첫 서버. 동시 접속 40명을 받으며 리눅스와 네트워크를 익혔습니다." },
];

/* ------------------------------------------------------------------ *
 * Experience
 * ------------------------------------------------------------------ */

export const experience = {
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
		] as Media[],
		notes: ["2년 동안 한계에 닿은 서비스 두 개를 무중단으로 옮겼고,", "서버 비용을 40% 줄인 뒤 학교로 돌아왔습니다."],
	},
	highlights: [
		{
			year: "2022",
			title: "약 19억 건의\n대규모 데이터 마이그레이션",
			paragraphs: [
				"타임스프레드의 활동 로그 테이블은 기본 키가 INT였고, 21억이라는 한계까지 2억 건이 남아 있었습니다. 이대로 두면 몇 달 안에 쓰기가 멈추는 상황이라, BIGINT 키를 가진 새 테이블로 옮기기로 했습니다.",
				"전체를 한 번에 복사하는 대신 최근 한 시간치만 먼저 옮기고 쓰기 경로를 새 테이블로 돌렸습니다. 나머지 19억 건은 야간에 배치로 따라 옮겼고, 서비스는 한 번도 멈추지 않았습니다.",
			],
		},
		{
			year: "2023",
			title: "분당 1,500개의 요청을 받는\n서비스 마이그레이션",
			paragraphs: [
				"링커리어의 오늘의 상자는 분당 1,500건의 요청을 받는 레거시 PHP 서비스였고, 전용 서버 세 대에서 따로 돌아가고 있었습니다. 이를 Node.js로 다시 쓰고 나머지 서비스와 같은 쿠버네티스 클러스터로 옮겼습니다.",
				"트래픽을 1%부터 단계적으로 흘리며 응답 시간과 오류율을 비교했고, 2주 만에 전환을 끝냈습니다. 비어 있던 서버를 반납해 월 1,000만 원이 넘던 인프라 비용을 40% 줄였습니다.",
			],
		},
	],
} as const;

/* ------------------------------------------------------------------ *
 * Certificates
 * ------------------------------------------------------------------ */

export type AwardCard = {
	period: string;
	title: string;
	awardName: string;
	description: string;
	image: Media;
};

export const featuredAwards: AwardCard[] = [
	{
		period: "2025",
		title: "부산 지역 대회 2등",
		awardName: "동아대학교 총장상",
		description: "코스모의 노트로 부산 지역 대회에서 2등을 차지했습니다. 수상작은 Projects 섹션에서 이어서 볼 수 있습니다.",
		image: { src: "/mock/award-donga.svg", alt: "동아대학교 총장상 상장" },
	},
	{
		period: "2024",
		title: "전국 연합대회 2등",
		awardName: "영림소프트원장상",
		description: "증상 기반 병원 탐색 서비스 헬릭스로 멋쟁이사자처럼 전국 연합대회에서 2등을 차지했습니다.",
		image: { src: "/mock/award-likelion.svg", alt: "영림소프트원장상 상장" },
	},
];

export type CompactCard = {
	period: string;
	/** Line breaks are intentional in the design. */
	title: string;
	host: string;
	image: Media;
};

export const subAwards: CompactCard[] = [
	{ period: "2018", title: "교내 해커톤 2등\n스크린 번역기", host: "선린인터넷고등학교", image: { src: "/mock/award-hackathon.svg", alt: "교내 해커톤 상장" } },
	{ period: "2021", title: "창업경진대회 2등\nKNU 코딩 플랫폼", host: "강원대학교", image: { src: "/mock/award-startup.svg", alt: "창업경진대회 상장" } },
	{ period: "2023", title: "공개SW 개발자대회\n입선", host: "정보통신산업진흥원", image: { src: "/mock/award-oss.svg", alt: "공개SW 개발자대회 상장" } },
	{ period: "2022", title: "학과 프로그래밍\n경진대회 금상", host: "강원대학교 컴퓨터공학과", image: { src: "/mock/award-dept.svg", alt: "학과 프로그래밍 경진대회 상장" } },
];

export const scholarship: AwardCard = {
	period: "2024",
	title: "국가이공계 장학생 선정",
	awardName: "과학기술정보통신부장관 장학증서",
	description: "강원대학교 컴퓨터공학과 재학 중 학부 성적을 기준으로 선발되는 국가이공계 장학생에 선정되었습니다.",
	image: { src: "/mock/scholarship.svg", alt: "국가이공계 장학증서" },
};

export const certifications: CompactCard[] = [
	{ period: "2025", title: "JLPT N1", host: "일본국제교류기금", image: { src: "/mock/cert-jlpt-n1.svg", alt: "JLPT N1 합격증" } },
	{ period: "2024", title: "JLPT N2", host: "일본국제교류기금", image: { src: "/mock/cert-jlpt-n2.svg", alt: "JLPT N2 합격증" } },
	{ period: "2025", title: "정보처리기사", host: "한국산업인력공단", image: { src: "/mock/cert-engineer.svg", alt: "정보처리기사 자격증" } },
	{ period: "2020", title: "프로그래밍기능사", host: "한국산업인력공단", image: { src: "/mock/cert-programming.svg", alt: "프로그래밍기능사 자격증" } },
];

/* ------------------------------------------------------------------ *
 * Journey
 * ------------------------------------------------------------------ */

export type JourneyEvent = {
	year: string;
	title: string;
	/**
	 * A chapter's turning point: set at the featured step, with the stack it
	 * was built on overhead and a line of prose under it. The rail marks it
	 * with a hollow ring instead of a dot.
	 */
	featured?: boolean;
	/** Mono caption above a featured title — what the thing was made with. */
	stack?: string;
	detail?: string;
};

export type JourneyChapter = {
	period: string;
	title: string;
	/** Course, team or title. Line breaks are honoured. */
	subtitle?: string;
	events: JourneyEvent[];
};

/**
 * The trunk carries the chapters — where I was — and each chapter branches
 * into what actually happened there. Enrolments and graduations are the
 * chapter heads themselves, so they are deliberately not repeated as events.
 */
export const journeyChapters: JourneyChapter[] = [
	{
		period: "2014 – 2018",
		title: "초·중학교",
		events: [
			{
				year: "2014",
				title: "Linux 마인크래프트 서버 구축",
				featured: true,
				stack: "Linux",
				detail: "가상 서버를 빌려 24시간 도는 서버를 올리고 리눅스와 네트워크를 익혔습니다.",
			},
			{ year: "2015", title: "PHP 텍스처팩 공유 사이트" },
			{ year: "2017", title: "안드로이드 스크린 번역기" },
		],
	},
	{
		period: "2018 – 2021",
		title: "선린인터넷고등학교",
		subtitle: "소프트웨어과",
		events: [
			{ year: "2018", title: "교내 해커톤 2등" },
			{
				year: "2019",
				title: "언리얼 엔진 게임 개발",
				featured: true,
				stack: "Unreal · C++",
				detail: "MyRunnerGame, 런 켓. 처음으로 팀을 이뤄 게임을 끝까지 완성했습니다.",
			},
			{ year: "2020", title: "VR 게임 Tooth, Unrevived" },
		],
	},
	{
		period: "2021",
		title: "강원대학교",
		subtitle: "컴퓨터공학과",
		events: [
			{
				year: "2021",
				title: "KNU 코딩 플랫폼 개발",
				featured: true,
				stack: "React",
				detail: "교내 프로그래밍 과제를 브라우저에서 채점하는 온라인 저지.",
			},
			{ year: "2021", title: "창업경진대회 2등" },
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
];

/** The open end of the trunk — the row the timeline stops on. */
export const journeyNow = {
	label: "현재",
	detail: "강원대학교 복학, 코스모의 노트와 enqor 운영 중",
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
export const resume = {
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
		"name-required": "이름을 입력해 주세요.",
		"name-too-long": "이름이 너무 깁니다.",
		"email-required": "메일 주소를 입력해 주세요.",
		"email-format": "메일 주소를 다시 확인해 주세요.",
		/** Delivery failed. The line hands the reader the address instead of a dead end. */
		send: "지금은 요청을 받을 수 없습니다. 이 주소로 직접 보내주세요.",
	},
	sent: {
		title: "요청을 받았습니다",
		detail: "주소로 이력서를 보내드리겠습니다.",
		again: "다시 보내기",
	},
} as const;
