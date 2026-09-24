/**
 * Copy and asset paths for the Korean build. The text is written for the real
 * site. Screenshots, scans and recordings come from the asset bucket through
 * `asset()` — the bucket holds the only copy; a new file is staged under the
 * gitignored apps/kr/assets and sent up with `npm run assets:push`. Brand marks
 * and what is left of the stand-in art under /public/mock stay on the Worker.
 *
 * Every export here fills a type from @ballbot/shared, so a field the shared
 * components expect cannot go missing and the Japanese build cannot drift out
 * of shape from this one.
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
	// 816만 is the service's cumulative sign-up count, so the line says 유저의
	// rather than 쓰는 — the number is not current users. 지탱 was chosen over
	// 지키다, which reads as guarding; the JP build's 支える is the same verb.
	headline: "816만 유저의\n서비스를 지탱해온",
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
				{ emphasis: "19억 건의 테이블을", detail: "점검 시간 1시간 내에 마이그레이션", href: "/experience/bigint-migration" },
				{ emphasis: "분당 1,500건의 요청을 받는", detail: "서비스 리팩토링", href: "/experience/realtime-redesign" },
				{ emphasis: "월 1천만 원을 넘기던 AWS 비용을", detail: "30% 절감", href: "/experience/aws-cost" },
				{ emphasis: "32GB 넘게 메모리를 점유하고 멈추던", detail: "API 서버 정상화", href: "/experience/api-memory" },
			],
		},
		{
			value: "2 Awards",
			items: [
				{ emphasis: "코스모의 노트,", detail: "전국 대회 최우수상 1위 달성", href: "/projects/cosmonote" },
				{ emphasis: "HEALIX,", detail: "1,500명 규모 전국 해커톤 2위 달성", href: "/projects/healix" },
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
		src: asset("/projects/cosmonote/01-landing.png"),
		width: 1537,
		height: 763,
		caption: "랜딩",
		alt: '코스모의 노트 첫 화면. "동영상 강의에 끌려다니지 마세요" 문구 옆으로 요약노트·퀴즈·스크립트 카드가 떠 있다',
	},
	{
		src: asset("/projects/cosmonote/02-features.png"),
		width: 1537,
		height: 763,
		caption: "기능",
		alt: "기능 소개 화면. 요약노트, 영상 타임라인, 퀴즈 자동 생성, 암기카드, 코멘트를 카드로 늘어놓았다",
	},
	{
		src: asset("/projects/cosmonote/03-note.png"),
		width: 1537,
		height: 763,
		caption: "요약노트",
		alt: "노트 화면. 왼쪽에 강의 영상과 타임라인, 오른쪽에 EC2 인스턴스 배포 실습을 정리한 요약노트가 있다",
	},
	{
		src: asset("/projects/cosmonote/04-quiz-create.png"),
		width: 1537,
		height: 763,
		caption: "퀴즈 만들기",
		alt: "퀴즈 만들기 대화상자. 문항 수와 선택형·단답형 같은 문항 유형을 고르는 중이다",
	},
	{
		src: asset("/projects/cosmonote/05-quiz-solve.png"),
		width: 1537,
		height: 763,
		caption: "퀴즈 풀기",
		alt: "퀴즈 풀이 화면. 열 문항 중 첫 문항을 풀고 있고 진행률과 임시 저장 상태가 보인다",
	},
	{
		src: asset("/projects/cosmonote/06-flashcard-create.png"),
		width: 1537,
		height: 763,
		caption: "암기카드 만들기",
		alt: "암기카드 만들기 대화상자. 노트 내용으로 자동 생성할지 빈 카드로 시작할지 고른다",
	},
	{
		src: asset("/projects/cosmonote/07-flashcard-study.png"),
		width: 1537,
		height: 763,
		caption: "암기카드 학습",
		alt: "암기카드 학습 화면. 스물다섯 장짜리 덱의 첫 카드와 알아요·몰라요·건너뛰기 집계가 있다",
	},
	{
		src: asset("/projects/cosmonote/08-public-notes.png"),
		width: 1537,
		height: 763,
		caption: "공개 노트",
		alt: "공개 노트 찾기 화면. 검색창 아래로 다른 사람이 공개한 노트가 카드로 깔려 있다",
	},
	{
		src: asset("/projects/cosmonote/09-api.png"),
		width: 1537,
		height: 763,
		caption: "개발자 API",
		alt: "개발자 API 소개 화면. 자료 업로드부터 요약노트·퀴즈 조회까지의 엔드포인트를 터미널 모양 카드에 적어 두었다",
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
		caption: "터널 만들기",
		alt: "WATERFLAKE 관리 화면. 서버 이름과 마인크래프트 자바 에디션, 서브도메인과 리전을 채워 터널을 만드는 폼",
	},
	{
		src: asset("/projects/waterflake/02-overview.png"),
		width: 1502,
		height: 768,
		caption: "터널 대시보드",
		alt: "터널 개요 화면. 발급된 접속 주소와 연결 상태, 플러그인이 쓸 키 한 쌍과 트래픽 사용량이 보인다",
	},
	{
		src: asset("/projects/waterflake/03-server-connect.png"),
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
		src: asset("/projects/enqor/01-poster.png"),
		width: 1024,
		height: 500,
		caption: "enqor",
		alt: 'enqor 스토어 대표 이미지. "나의 평범함이 빛나는 순간" 문구 아래로 앱 화면을 띄운 휴대폰 두 대가 놓여 있다',
	},
	{
		src: asset("/projects/enqor/02-login.jpg"),
		width: 1080,
		height: 2400,
		caption: "로그인",
		alt: "enqor 로그인 화면. 휴대폰 번호와 Google, 카카오톡 로그인 버튼이 있다",
	},
	{
		src: asset("/projects/enqor/03-home.jpg"),
		width: 1080,
		height: 2400,
		caption: "전문가 탐색",
		alt: "홈 화면. 주제별 전문가 카드가 가로로 놓이고 아래에 나와 연결된 전문가와 지금 대화 가능한 전문가가 있다",
	},
	{
		src: asset("/projects/enqor/04-profile.jpg"),
		width: 1080,
		height: 2400,
		caption: "전문가 프로필",
		alt: "전문가 프로필 화면. 인증 타이틀과 해시태그가 붙어 있고 아래에 대화 요청 버튼이 있다",
	},
	{
		src: asset("/projects/enqor/05-request.jpg"),
		width: 1080,
		height: 2400,
		caption: "대화 요청",
		alt: "대화 요청 시트. 보유 클랩과 초당 연결 비용을 보여 주고 영상이나 음성 중 하나를 고르게 한다",
	},
	{
		src: asset("/projects/enqor/06-clap-station.jpg"),
		width: 1080,
		height: 2400,
		caption: "클랩 충전",
		alt: "클랩 스테이션. 500 클랩부터 25,000 클랩까지 묶음이 가격과 할인율과 함께 놓여 있다",
	},
	{
		src: asset("/projects/enqor/07-payment.jpg"),
		width: 1080,
		height: 2400,
		caption: "결제",
		alt: "구글 플레이 인앱 결제 시트. 5,000 클랩 상품과 결제 수단이 올라와 있다",
	},
	{
		src: asset("/projects/enqor/08-connecting.jpg"),
		width: 1080,
		height: 2400,
		caption: "연결 중",
		alt: "거는 쪽 화면. 카메라가 미리 열린 채 대화 연결 중이라 뜨고 남은 시간과 보유 클랩이 보인다",
	},
	{
		src: asset("/projects/enqor/09-incoming.jpg"),
		width: 1080,
		height: 2220,
		caption: "요청 수신",
		alt: "받는 쪽 화면. 상대의 인증 타이틀과 해시태그가 붙은 요청 카드에 거절과 수락 버튼이 달려 있다",
	},
	{
		src: asset("/projects/enqor/10-call.jpg"),
		width: 2000,
		height: 1500,
		caption: "통화",
		alt: "휴대폰 두 대를 나란히 놓고 실제로 영상 통화를 하는 사진. 양쪽 화면에 서로의 카메라가 떠 있다",
	},
	{
		src: asset("/projects/enqor/11-review.jpg"),
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
 * 위쪽 52px 을 잘라 냈다. 덱의 껍데기지 내용이 아니라서 652 로 낮아졌다. 뷰어에는
 * 글이 없다 — 긴 글은 /projects/healix 에 있다.
 */
const HEALIX_SCREENS: readonly Media[] = [
	{
		src: asset("/projects/healix/01-cover-5badd1f3.png"),
		width: 1244,
		height: 701,
		caption: "HEALIX",
		alt: 'HEALIX 발표자료 표지. "증상 분석부터 나와 가까운 병원까지" 문구 옆으로 근처 병원과 예약 정보를 띄운 휴대폰이 놓여 있다',
	},
	{
		src: asset("/projects/healix/02-background-1e2c9b10.png"),
		width: 1244,
		height: 652,
		caption: "기획 배경",
		alt: "기획 배경 슬라이드. 통증을 직접 검색해 보는 화면과 꾸준히 이어지는 검색량 그래프로 문제를 짚는다",
	},
	{
		src: asset("/projects/healix/03-flow-fb243485.png"),
		width: 1244,
		height: 652,
		caption: "증상 입력과 병원 예약",
		alt: "서비스 흐름 슬라이드. 부위를 고르고 증상을 적는 화면과, 분석 결과에서 곧바로 근처 병원을 예약하는 화면이 나란히 있다",
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
		caption: "게임 번역",
		alt: "일본어 게임 공지 위에 한국어 번역문이 덮여 있다. 원문 자리에 그대로 겹쳐 띄운다",
		note: "휴대폰을 흔들면 즉시 화면을 캡처하고, 이미지를 OCR 해 텍스트를 추출하고, 번역기로 번역해 사용자에게 오버레이 형태로 표시해 주는 번역 서비스입니다.\n\n구글 번역기를 통해 번역을 제공했으나, API 키 관리 관련 지식이 없어 클라이언트 앱에 그대로 키를 저장했습니다. 1천여 명이 다운로드했을 때 즈음 키가 유출되었고, 하루에 수십만 원에 달하는 서버비가 발생한 것을 보고 즉시 서비스를 내려 버린 해프닝이 있었습니다.",
	},
	{
		src: asset("/projects/screen-translator/02-web.jpg"),
		width: 560,
		height: 996,
		alt: "일본어 웹 문서 위에 한국어 번역문이 덮여 있고, 위쪽에 원어 감지와 번역할 언어를 고르는 줄이 있다",
	},
	{
		src: asset("/projects/screen-translator/03-settings.jpg"),
		width: 560,
		height: 996,
		alt: "기본 설정 화면. 번역할 언어 쌍과 인식 정확도, 번역기 딜레이와 인공지능 번역 여부를 고른다",
	},
	{
		src: asset("/projects/screen-translator/04-sensitivity.jpg"),
		width: 560,
		height: 996,
		alt: "감도 설정 화면. 얼마나 세게 흔들어야 인식할지 슬라이더로 맞추고 그 자리에서 흔들어 시험해 본다",
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
		caption: "코스모스 다운로더",
		alt: "학교 강의 사이트의 동영상 뷰어. 익스텐션이 상단 바 오른쪽에 붙인 다운로드 버튼에 빨간 동그라미를 쳐 두었다",
	},
	summary: {
		src: asset("/projects/cosmonote/story/02-summary-button.jpg"),
		width: 898,
		height: 302,
		caption: "강의 홈의 요약 버튼",
		alt: "강의 홈 화면의 주차별 동영상 목록. 각 영상 아래에 다운로드 버튼과 AI 노트로 요약 버튼이 나란히 있다",
	},
	webImport: {
		src: asset("/projects/cosmonote/story/03-web-import.jpg"),
		width: 1280,
		height: 692,
		caption: "웹에서 영상 불러오기",
		alt: "코스모의 노트 첫 화면. 학교 LMS 와 동영상 URL, 아이디와 비밀번호를 받는 폼 옆에 학교 강의 사이트 창이 겹쳐 있고, 강의 주소가 폼으로 들어가는 화살표가 그려져 있다",
	},
	note: {
		src: asset("/projects/cosmonote/story/04-note-page.jpg"),
		width: 1280,
		height: 829,
		caption: "생성된 노트",
		alt:
			"노트 화면. 왼쪽에 강의 영상과 스크립트, 오른쪽에 SSH 로 리눅스 서버에 접속하는 수업을 정리한 요약 목차가 있다",
	},
	renewal: {
		src: asset("/projects/cosmonote/story/05-renewal.png"),
		width: 1660,
		height: 897,
		caption: "리뉴얼된 노트 화면",
		alt: "리뉴얼 뒤의 노트 화면. 왼쪽에 업로드한 강의 영상과 타임라인, 오른쪽에 EC2 인스턴스 배포 실습을 정리한 요약노트와 퀴즈·암기카드 탭이 있다",
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
	caption: "업로드 ~ 노트 생성까지 과정",
	alt: "코스모의 노트 구조도. 동영상이나 PDF 파일이 R2 로 들어가고, estimator 와 summarizer 두 컨테이너를 지나 Worker 와 LLM 이 노트를 만드는 흐름이 손으로 그린 상자와 화살표로 이어져 있다. R2 부터 Worker 까지는 cloudflare 라고 적힌 점선 안에 있다",
};

/**
 * 프레임 분석 그림. 구조도와 같은 손그림 규칙으로 Pencil 문서(`cosmo / 01 frames`)에서
 * 그려 2x 로 내보낸 1200×320 프레임이다 — 바꿀 일이 생기면 코드가 아니라 그 문서를 고친다.
 */
const COSMO_FRAMES: Media = {
	src: asset("/projects/cosmonote/story/07-frames.png"),
	width: 2400,
	height: 640,
	caption: "변화가 없는 구간을 묶어 오래 머문 화면만 읽는다",
	alt: "프레임 분석 흐름도. 왼쪽에 영상 프레임 열 장이 늘어서 있고 비슷한 것끼리 네 묶음으로 괄호가 쳐져 있다. 가운데에는 묶음마다 머문 시간이 78초, 42초, 19초, 3초 길이의 막대로 누워 있고, 위 세 줄만 top 70% 괄호 안에 들어간다. 오른쪽에는 그 화면을 OCR 로 읽은 상자가 있다",
};

/**
 * 노트 생성 파이프라인 그림. 같은 손그림 규칙으로 Pencil 문서(`cosmo / 02 pipeline`)에서
 * 그려 2x 로 내보낸 1200×320 프레임이다 — 바꿀 일이 생기면 코드가 아니라 그 문서를 고친다.
 */
const COSMO_PIPELINE: Media = {
	src: asset("/projects/cosmonote/story/08-pipeline.png"),
	width: 2400,
	height: 640,
	caption: "한 번에 시키지 않고 나눠 맡긴다",
	alt: "노트 생성 파이프라인. 타임라인 문서가 점선으로 묶인 세 단계 — 목차, 본문, 이미지 배치 — 를 지나 퇴고를 거쳐 노트가 된다. 오른쪽 아래의 하네스가 그 세 단계 묶음으로 프롬프트를 되먹인다",
};

/**
 * 코스모의 노트, 긴 글. 카드의 두 줄이 대신 서 있던 기록으로, /projects/cosmonote 에
 * 놓인다. 화면은 카드의 갤러리(COSMO_SCREENS)를 그대로 슬라이더로 넘긴다.
 */
const cosmoStory: ProjectStoryContent = {
	tagline: "동영상, PDF 등 수업 자료 요약 서비스",
	highlights: [
		"화면 속 슬라이드까지 읽어 하나의 타임라인으로 만들기",
		"사용자 한 명을 위해 24시간 고성능 머신을 띄워둬야 하는 비용 문제 해결하기",
		"플래그십 모델을 고효율 모델로 바꾸면서 노트 품질은 지켜내기",
	],
	facts: [
		{ term: "참가 인원", detail: "개인" },
		{ term: "개발 기간", detail: "2025.05 ~ 현재" },
		{ term: "주요 기술", detail: "Cloudflare Workers, R2, Containers" },
		{ term: "수상", detail: "전국대학 소프트웨어 성과 공유포럼 최우수상" },
	],
	motivation: [
		"부전공인 클라우드학과는 수업이 대부분 동영상 강의로 진행됐습니다. 기초 과목은 이미 아는 내용이 태반인데도, 시험과 과제 때문에 아는 강의를 처음부터 다시 틀어놓고 있어야 했습니다.",
		"한동안은 강의 영상을 내려받아 타사 요약 서비스에 넣어 썼습니다. 시험 2주 전에 몰아 쓰고 두 달을 손도 안 대는 게 학생의 사용 패턴인데, 월 구독제라 쓰지 않는 날에도 비용을 지불해야 했습니다. 영상을 불러오는 것부터 요약까지 한 번에 끝내면서, Pay As You Go 형태의 서비스를 만들어보자는 게 코스모의 노트의 시작이었습니다.",
	],
	steps: [
		{
			period: "2025.05",
			title: "코스모스 다운로더",
			images: [COSMO_STEP_SCREENS.downloader],
			paragraphs: [
				"처음에는 강의 시청 화면 오른쪽에 다운로드 버튼을 붙여주는 브라우저 익스텐션을 만들었습니다. 버튼을 누르면 익스텐션이 웹 통신 내용을 읽고, 스트리밍 파일의 주소를 서버로 보냅니다. 서버는 ts 스트리밍 파일을 내려받아 mp4 로 인코딩한 뒤, 다운로드 링크를 주는 간단한 구조였습니다.",
				"익스텐션을 만들어 배포한 뒤 커뮤니티에 게시하니, 학우 480명 이상이 좋아요를 눌렀습니다. 다운로드만 가능한 프로그램임에도 뜨거운 관심을 받았다는 점은 이 불편함이 저만의 문제는 아니라는 뜻이었습니다.",
			],
		},
		{
			period: "2025.08",
			title: "요약 기능 추가",
			images: [COSMO_STEP_SCREENS.summary],
			paragraphs: [
				"AI 노트 생성 기능을 붙이고, 다운로드 버튼을 강의 홈 화면으로 옮겼습니다. 버튼을 누르면 Cloudflare Browser 로 서버가 직접 강의 사이트에 접속하도록 바꿨습니다. 로그인은 익스텐션이 넘겨준 세션 키를 서버 쪽 브라우저에 심어 우회했습니다.",
				"익스텐션이 하던 일을 하나씩 서버로 옮겨두는 작업이었습니다. 익스텐션을 없애고 완전히 웹 서비스로 동작하게 만드는 게 목표였습니다. 더불어 결제를 연동해 수익화 구조도 만들어봤습니다.",
			],
		},
		{
			period: "2026.04",
			title: "익스텐션 제거",
			images: [COSMO_STEP_SCREENS.webImport, COSMO_STEP_SCREENS.note],
			paragraphs: [
				"교환학생을 다녀온 뒤, 다시 서비스를 업데이트하기 시작했습니다. 가장 큰 목표는 브라우저 익스텐션을 완전히 제거하는 일이었습니다. 브라우저 익스텐션은 사용자의 브라우저에 깊게 접근할 수 있다는 점은 좋지만, 모바일에서는 전혀 동작하지 않고 특정 브라우저에 종속되는 문제가 있습니다. 무엇보다 익스텐션을 아는 사람이 별로 많지 않았습니다.",
				"그래서 웹 사이트만으로 동작하도록 대대적으로 고쳤습니다. 학교 사이트 로그인 정보와 강좌 URL 을 입력받으면 Cloudflare Browser 로 직접 로그인하고, 패킷을 탐지해 영상을 찾아내는 구조입니다. 소프트웨어는 복잡해지고 버그도 늘었지만, 익스텐션을 없애니 사용성은 비교할 수 없이 나아졌습니다.",
			],
		},
		{
			period: "2026.09",
			title: "범용 영상 요약 사이트로 리뉴얼",
			images: [COSMO_STEP_SCREENS.renewal],
			paragraphs: [
				"기존 구조는 학교 사이트에서만 영상을 불러올 수 있었습니다. 성장에 걸림돌이기도 했지만, 저작권이 있는 학교 강의를 가공해 돈을 받는 일이라 법적인 리스크를 피할 수 없었습니다.",
				"비록 매출이 발생하기 시작해 기뻤지만, 학교 사이트 연동 기능을 폐기했습니다. 다만, 이 서비스의 정체성인 만큼 완전히 버리지는 못하고 익스텐션으로 되돌렸습니다. 동영상과 녹음본, 이미지, 문서를 직접 올리는 방식으로 리뉴얼하여 현재 모습에 이르렀습니다.",
			],
		},
	],
	architecture: {
		label: "Architecture",
		items: [
			{
				title: "화면 속 슬라이드까지 읽어 하나의 타임라인으로 만들기",
				body: [
					"대부분의 강의 요약 서비스는 음성을 STT 로 받아쓴 다음, 그 텍스트를 요약합니다. 그런데 수업 영상에서 정작 중요한 것은 프레젠테이션에 많이 있고, 강의자가 이를 읽지 않고 넘어가는 경우도 많습니다. 슬라이드에서 나온 수식, 도표가 그대로 유실되는 문제가 발생합니다.",
					COSMO_FRAMES,
					"따라서 코스모의 노트는 영상 프레임을 분석하는 로직을 넣었습니다. summarizer 는 ffmpeg 를 이용해 프레임의 변화를 추적합니다. 프레임의 변화율이 5% 미만이라면 같은 프레임으로 보고, 같은 프레임이 오랫동안 유지되는 경우를 랭킹으로 만듭니다. 그리고 상위 70% 에 해당하는 프레임을 찾아 OCR 을 수행합니다.",
					"STT 결과와 OCR 결과를 하나의 타임라인으로 병합합니다. 마지막으로 Worker 에 이 타임라인을 전달하고, 사전에 튜닝된 프롬프트로 요약 노트를 생성해냅니다.",
				],
			},
			{
				title: "사용자 한 명을 위해 24시간 고성능 머신을 띄워둬야 하는 비용 문제 해결하기",
				body: [
					"코스모의 노트는 ffmpeg 로 영상 프레임을 처리해야 하기 때문에, 그 순간에는 꽤 좋은 머신을 요구합니다. 고성능 인스턴스를 상시로 띄워두면 아무도 사용하지 않는 시간에도 비용이 발생합니다. 따라서 영상 처리 기능은 서버리스 구조를 채택하여 비용을 크게 절감했습니다.",
					COSMO_ARCHITECTURE,
					"Workers 는 최대 100MB 까지만 업로드를 받을 수 있습니다. 동영상이 100MB 미만인 경우는 거의 없으므로, 서버는 버킷에 바로 업로드할 수 있는 Presigned URL 을 발급해 클라이언트에 제공합니다. 파일은 클라이언트에서 R2 에 바로 업로드됩니다.",
					"업로드된 파일은 estimator 가 검사를 수행합니다. 깨지거나 잘못된 파일이 아닌지 확인하고 문제가 없으면 샘플링해 비용을 예측합니다. 사용자는 예측된 비용을 결제해야 노트 생성이 시작됩니다. 비록 예측된 금액보다 분석해야 할 양이 많으면 손해를 볼 수 있지만, 평균 비용에 배수를 곱하게 하여 이 문제를 최소화했습니다.",
					"이 구조가 그대로 요금제로 만들어졌습니다. 2시간 영상에 약 1,300원 정도가 듭니다. 타사 서비스가 3시간 영상을 분석하는 데 월 7,900원을 요구하니, 시험 기간에 몰아 쓰는 학생들 대상으로는 매우 합리적인 제도입니다. 인프라 또한 사용한 만큼만 청구되는 구조이기에 유지 가능한 시스템입니다.",
				],
			},
			{
				title: "플래그십 모델을 고효율 모델로 바꾸면서 노트 품질은 지켜내기",
				body: [
					"개발 초기에는 클로드 같은 플래그십 모델을 사용했습니다. 프롬프트 튜닝이나 타임라인을 크게 정리하지 않아도 만족스러운 결과가 나왔지만, 노트 한 편을 생성하는 데 돈이 너무 많이 들었습니다. 2시간짜리 영상을 클로드로 요약하는 데 1,300원은 자선단체가 아니면 어려운 일입니다.",
					COSMO_PIPELINE,
					"지금은 Gemini, DeepSeek 같은 저비용 고효율 모델을 사용하고 있습니다. 대신 한 번에 모든 작업을 시키지 않고 목차 생성, 본문 생성, 이미지 배치, 퇴고 등으로 파이프라인을 나눴습니다. 작은 모델은 특히 컨텍스트가 커지면 품질이 급격히 떨어지는데, 목차를 먼저 만들고 한 항목씩 쓰게 일을 나누면 품질이 크게 떨어지지 않습니다. 또한 캐싱을 통해 비용이 일부 절감되기도 합니다.",
					"컨텍스트 문제로 품질이 떨어지는 문제는 해결했지만, 사고 능력의 차이가 문제였습니다. 그래서 Fable 같은 플래그십 모델과 지금 파이프라인의 결과를 비교하는 하네스를 만들어 정기적으로 실행하고 있습니다. 비록 Fable 만큼의 성능이 나오지는 못하지만, 비용 대비 좋은 품질이 나오고 있습니다.",
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
		caption: "핑으로 정의한 안정적인 통화",
		alt: "통화 정산 시퀀스. 발신자와 수신자가 양쪽에, 서버가 가운데에 있고, 매초 핑이 오가는 동안 서버가 비용을 청구하다가 핑이 세 번 빠지면 청구를 멈추고, 다시 오면 재개하고, 일곱 번 빠지면 통화를 끝낸다",
	},
	balance: {
		src: asset("/projects/enqor/story/02-balance-session.png"),
		width: 2400,
		height: 1040,
		caption: "통화 세션의 잔액",
		alt: "잔액 처리 구조도. 통화가 시작되면 디비의 캐시를 잠그고 redis 세션으로 복제한다. 잔액은 매초 줄고, 충전하면 오르고, 선물하면 내려간다. 남은 시간은 잔액에서 계산해 클라이언트에 내려 주고, 통화가 끝나면 디비에 다시 쓴다",
	},
	docs: {
		src: asset("/projects/enqor/story/03-docs-to-code.png"),
		width: 2400,
		height: 600,
		caption: "기획서에서 코드까지",
		alt: "PDF 기획서와 Figma 디자인을 손으로 Markdown 하나로 엮고, 그 문서를 에이전트가 소스 코드로 옮기는 흐름",
	},
	harness: {
		src: asset("/projects/enqor/story/04-harness-loop.png"),
		width: 2400,
		height: 640,
		caption: "웹으로 먼저 퍼블리싱하는 하네스",
		alt: "하네스 흐름도. 에이전트가 화면을 expo web 으로 퍼블리싱하면 비판적 에이전트가 Figma 와 대조해 평가하고, 고칠 것이 있으면 에이전트에게 되돌리고, 통과하면 앱으로 옮긴다",
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
	tagline: "1:1 전문가 상담 서비스",
	highlights: [
		"안정적으로 통화가 연결된 경우만 초 단위로 비용 정산하기",
		"AI 의 응답을 사람 병목 없이 검증하기",
	],
	facts: [
		{ term: "참가 인원", detail: "3명" },
		{ term: "개발 기간", detail: "2026.04 ~ 현재" },
		{ term: "담당", detail: "앱 및 서버 개발" },
		{ term: "주요 기술", detail: "Agora(스트리밍), NestJS(GraphQL), Expo" },
	],
	motivation: [
		"요즘은 고민이 생기면 ChatGPT 에게 먼저 물어봅니다. 그런데 정작 마음이 복잡할 때는 AI 특유의 영혼 없는 대화에 금세 지치고, 의료나 입시처럼 책임이 따르는 상담에서는 AI 의 답을 그대로 믿기도 어려웠습니다. 몇몇 대화는 아직 사람과 해야 할 필요가 있습니다.",
		"의사 같은 전문가부터 연애를 오래 해 본 사람 같은 가벼운 주제까지, 내가 자신 있는 분야로 다른 사람의 고민을 들어주고 수익을 만드는 자리가 필요하다고 봤습니다. 대화 플랫폼을 개발하기 위해 Align Networks 에 합류해 앱과 서버 개발을 담당했습니다. 다만, 엔코르는 사람이 직접 프로그래밍하지 않았습니다. 기획서와 디자인을 AI 에이전트가 읽을 수 있게 만들고, 에이전트가 내놓은 결과물을 검증하는 환경을 만드는 게 제 일이었습니다.",
	],
	architecture: {
		label: "Architecture",
		items: [
			{
				title: "안정적으로 통화가 연결된 경우만 초 단위로 비용 정산하기",
				body: [
					"엔코르의 핵심 기능은 영상·음성 통화입니다. 스트리밍은 Agora 를 써서 어려움이 없었지만, 정산 파이프라인은 직접 만들어야 하는 과제였습니다. 모바일은 통신 상태가 나빠지는 일이 잦은 만큼, 정상적으로 이루어진 시간만 정산해야 했고, 초 단위 청구까지 요구되었습니다.",
					ENQOR_FIGURES.billing,
					"먼저 '안정적인 통화'가 무엇인지 정해야 합니다. 이는 서버와 클라이언트가 주고받는 핑으로 정의했습니다. 어느 한 참여자라도 핑이 3번 누락되면 연결에 문제가 있다고 판단하고 정산을 중단합니다. 7번 누락되면 통화가 끊어졌다고 판단하고 세션을 종료하게 만들었습니다.",
					"다음 문제는 매 초 정산이라는 요구사항입니다. 처음에는 전체 통화 시간에서 불안정했던 시간을 빼고, 통화가 끝난 뒤 데이터베이스를 한 번 업데이트할 생각이었습니다. 그런데, 요구사항이 생각 이상으로 복잡했습니다. 통화 중에 캐시를 충전할 수 있어야 했고, 충전한 캐시로 서로 선물도 할 수 있으며, 통화 가능 시간이 20초 미만으로 줄면 통화가 곧 끝난다고도 알려줘야 합니다. 충전, 소비, 조회가 모두 실시간으로 이뤄져야 하므로 남은 캐시를 읽기 쓰기가 가벼운 어딘가에 저장하고 처리하는 게 간단하겠다고 판단했습니다.",
					ENQOR_FIGURES.balance,
					"통화가 시작되면 발신자 캐시를 수정할 수 없게 만듭니다. 현재 캐시를 읽어 redis 의 통화 세션에 복제해두면 이 값이 발신자가 쓸 수 있는 캐시의 원본이 됩니다. 매 초마다 이 값을 줄여 정산하고, 충전이나 선물이 발생하면 이 값을 계속 업데이트합니다. 충전은 결제 기록을 남겨야 하므로 디비에 추가로 남깁니다. 남은 통화 시간도 이 값을 바탕으로 계산해 클라이언트에 내려 줍니다. 통화가 끝나면 디비에 남은 잔액을 업데이트합니다. 단 두 번의 디비 조작으로 복잡한 로직을 직관적으로 구현할 수 있게 되었습니다.",
				],
			},
			{
				title: "AI 의 응답을 사람 병목 없이 검증하기",
				body: [
					"기획팀이 작성한 파일은 PDF 로 된 기획서와, Figma 로 작성된 디자인 파일입니다. 사람이 읽고 수정하기에는 편하지만 에이전트에게 그대로 제공하면 어느 Figma 노드에 어떤 설명이 들어있는지 알 수 없습니다. 그래서 Figma 노드와 PDF 페이지를 직접 짝지어 Markdown 으로 작성했고, 곳곳에 메모도 적어봤습니다.",
					ENQOR_FIGURES.docs,
					"이렇게 완성한 약 800줄짜리 기획서를 가지고 AI 에이전트에게 프로젝트를 끝까지 완성하라고 했습니다. 30여 분 만에 프로젝트 하나가 나왔고, 실행해 보니 그 결과는 엉망이었습니다. 어느 정도 예상은 했지만 실행조차 안 될 줄은 몰랐고, 겨우 고쳐 로그인 화면에 진입하니 Figma 에 정의된 디자인은 전혀 반영되어 있지 않았습니다. 로그인 같은 기능도 전부 모킹으로 구현된 순 엉터리 프로젝트였습니다.",
					"이 문제를 고문님께 털어놓았는데, '하네스 엔지니어링'이라는 개념을 소개해주셨습니다. 인터넷에 검색해 보니 'AI 가 올바른 행동을 할 수 있게 환경을 만드는 것'이라는 모호한 답변만이 나왔습니다. 개념이 완전히 이해되지는 않았지만 고문님 조언을 듣고 훅, 비판적 리뷰어, 테스터를 하나씩 세팅하다 보니 어느새 나만의 하네스가 완성되어 있었습니다.",
					"하네스에서 가장 어려운 것은 '성공 조건'을 정의하는 일입니다. 예를 들어 Figma 에 선언된 디자인대로 퍼블리싱했는지 판정하려면, 그 디자인과 퍼블리싱된 화면이 일치하는지 평가하는 로직이 필요합니다. 처음에는 앱 화면을 캡처해 단순히 비슷한지만 검사했고, 독립적인 서브에이전트가 이 비교를 담당했습니다. 나쁘지 않았지만 그렇다고 좋은 결과물도 아니었습니다. 여기저기 아이콘이 다르고 텍스트 위치가 어긋났습니다. 무엇보다 앱 화면을 캡처해 Figma 와 대조하는 작업이 매우 느리고 토큰을 많이 소비했습니다.",
					ENQOR_FIGURES.harness,
					"이 문제는 expo web 으로 해결했습니다. 먼저 구현하려는 화면을 expo web 으로 퍼블리싱하면, headless 브라우저를 열어 퍼블리싱 상태를 어렵지 않게 확인할 수 있습니다. 창 크기만 바꾸면 모바일·태블릿 해상도에서 깨지는 영역이 있는지도 바로 보입니다. 이렇게 퍼블리싱이 끝난 코드를 앱으로 옮기는 순서로 바꾸니 평가가 훨씬 싸졌습니다. Figma 와 웹으로 퍼블리싱된 화면이 얼마나 비슷한지는 비판적 에이전트가 판정하되, 아이콘을 직접 생성하지 못하도록 규칙을 넣었고, Figma MCP 에 문제가 생겨 동작하지 않는 경우 하네스가 아예 멈추도록 하는 preflight 절차도 추가했습니다. 그 결과 간단한 화면은 거의 완벽한 수준으로, 복잡한 화면도 70% 정도의 완성도로 나왔습니다.",
				],
			},
		],
	},
	retrospective: {
		label: "Retrospective",
		paragraphs: [
			"이번 경험에서, AI 에게 좋은 자료를 주고 좋은 환경을 만들어 주면 좋은 결과가 나온다는 것을 알았습니다. 그리고 AI 가 만들어 낸 결과도 '어떻게' 검증하느냐보다는 '어디까지' 검증할지를 생각하는 방향이 옳다고 느꼈습니다.",
			"금융, 우주 산업, 방위 산업처럼 사고 한 번이 참사인 도메인은 모든 코드를 전부 꼼꼼히 검증해야 할 것입니다. 하지만 이번 프로젝트처럼 대부분은 그렇지 않습니다. 개발자는 AI 가 지금 무슨 일을 하고 있고, 이번 일이 끝나면 어디까지 검증해야 하고, 어떤 파일들이 바뀌길 기대하는지 정도만 알면 충분하다고 생각합니다. 그 안에서도 단순한 작업을 AI 가 하고 있다면 몇 번 눌러 보고 테스트를 마칠 수도 있고, 핵심 로직이면 설계까지 꼼꼼히 논해야 합니다.",
			"개발자가 코드를 작성하는 사람에서 판단하고 책임지는 사람으로 바뀌었다는 것을, 이 프로젝트에서 확인했습니다.",
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
	tagline: "증상 기반 병원 찾기 서비스",
	facts: [
		{ term: "참가 인원", detail: "6명" },
		{ term: "개발 기간", detail: "2024.07 ~ 2024.08" },
		{ term: "주요 기술", detail: "ChatGPT API, NestJS" },
	],
	motivation: [
		"사람들은 어디가 아플 때 어느 병원에 가야 할지 모르는 경우가 많습니다. 당장 생각해 봐도 열이 나는 감기에 걸리면 내과를 가야 할지 이비인후과를 가야 할지 모르겠고, 엉덩이 같은 생소한 부위가 아파 오면 그 고민은 더더욱 커집니다. 과거에는 인터넷에서 검색해 적절한 과를 찾고, 지도에서 병원을 찾아야 했습니다. HEALIX 는 이 불편함을 해결하고자 개발되었습니다.",
	],
	video: {
		label: "Video",
		youtubeId: "p3cPmhgZELg",
		title: "HEALIX 시연 영상",
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
	caption: "도메인에서 게임 서버까지",
	alt: "WATERFLAKE 구조도. 플레이어가 test.example.com 으로 접속하면 SRV 레코드가 1.1.1.1 의 3000번 포트를 가리키고, 그 포트에서 도는 터널링 서버가 마인크래프트 서버와 TCP 소켓 스무 개로 이어져 있다",
};

/**
 * WATERFLAKE, 긴 글. /projects/waterflake 에 놓인다. 화면은 카드의 갤러리
 * (WATERFLAKE_SCREENS)를 그대로 슬라이더로 넘긴다. 날짜별 이력은 없어 History 섹션이 빠진다.
 */
const waterflakeStory: ProjectStoryContent = {
	tagline: "간단한 설치만으로 마인크래프트 도메인 서버 열기",
	highlights: [
		"SRV 레코드로 서브도메인이 특정 IP 의 포트를 가리키도록 자동 설정하기",
		"게임 서버와 터널링 서버 사이를 TCP 소켓으로 터널링하기",
	],
	facts: [
		{ term: "참가 인원", detail: "개인" },
		{ term: "개발 기간", detail: "2023.03 ~ 2023.05" },
		{ term: "주요 기술", detail: "NestJS, Java" },
	],
	motivation: [
		"10여 년 전, 마인크래프트라는 게임에 빠져 모두와 함께할 수 있는 서버를 열어 보는 게 가장 큰 목적이었습니다. 컴퓨터는 전혀 모르는 초등학생이 블로그 글만 읽고 VPS 서버를 대여해 Linux 환경에서 게임 서버를 실행했습니다. 그리고 복잡한 네트워크 설정까지 해 마침내 서버를 열었습니다. 그때의 성취감은 평생 가장 큰 성취감으로, 절대 잊어버릴 수 없는 기억입니다. 지금으로 돌아와서, '만약 복잡한 과정 없이 쉽게 게임 서버를 열 수 있게 도와주는 도구가 있으면 어떨까?'라는 생각에서 시작했습니다.",
	],
	architecture: {
		label: "Architecture",
		items: [
			{
				// TODO(confirm): 원문에는 절 제목이 없어 두 하이라이트를 그대로 제목으로 세웠다.
				title: "SRV 레코드와 TCP 터널링",
				body: [
					WATERFLAKE_ARCHITECTURE,
					"사용자가 우리 웹 서비스에서 터널을 생성하면 Cloudflare API 를 통해 SRV 레코드를 생성합니다. 그리고 터널링을 담당하는 가상 머신에 랜덤한 포트로 터널링 서버를 띄웁니다. 터널링 서버는 두 개의 연결을 받는데, 한 개는 SRV 레코드를 통해 들어오는 연결, 한 개는 마인크래프트 서버 쪽으로 나가는 연결입니다. 이 두 연결을 파이프해 외부에서 들어오는 패킷이 자연스럽게 마인크래프트 서버로 나갈 수 있습니다. 사용자에게는 마치 도메인 주소를 입력하면 연결 가능한 서버로 보이게 됩니다.",
					"터널링 서버와 게임 서버 간 TCP 터널은 20개의 소켓으로 관리됩니다. 게임 플레이어가 서버에 접속하면 이 소켓 중 하나를 점유합니다. 플레이어가 게임 서버를 나가면 해당 소켓은 폐기되고, 새 소켓을 생성합니다. 이 주기가 반복되어 소켓의 개수를 관리합니다. 다행히 마인크래프트 서버 설정에는 최대 접속 가능한 인원이 정해져 있기 때문에, 이 값만큼만 소켓을 관리하면 운영에 문제가 없었습니다.",
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
			period: "2025 ~ 현재",
			title: "코스모의 노트",
			description: "밀린 동영상 강의를 빠르게 따라잡기 위한 영상 요약 서비스입니다. 음성뿐 아니라 화면 속 슬라이드까지 읽고, 구독료 없이 쓴 만큼만 받도록 만들었습니다.",
			links: [{ label: "cosmonote.site", href: "https://cosmonote.site" }],
			// 갤러리 첫 장이 그대로 타일이 된다. 25:17 로 잘리지만 헤드라인과 떠 있는
			// 카드가 모두 그 안에 들어오고, 눌렀을 때 크게 뜨는 화면과 같은 그림이다.
			thumbnail: {
				src: asset("/projects/cosmonote/01-landing.png"),
				alt: "코스모의 노트 첫 화면",
			},
			appIcon: { src: "/brand/cosmonote-icon.png", alt: "코스모의 노트 앱 아이콘" },
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
			period: "2026 ~ 현재",
			title: "enqor",
			description: "실시간 영상·음성을 통한 전문가 상담 서비스입니다. AI 응답을 개선하기 위한 하네스, 테스트와 복잡한 비용 정산 기능 구현을 위한 엔지니어링적 고민이 녹아있습니다.",
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
				alt: "enqor 스토어 대표 이미지",
			},
			appIcon: { src: "/brand/enqor-icon.png", alt: "enqor 앱 아이콘" },
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
			description: "증상을 바탕으로 가장 가깝고 적절한 병원을 추천하는 서비스입니다. 공공데이터포털과 앱 내 GPS 데이터를 AI 에 전달하게 만들었습니다.",
			// 공개된 저장소가 백엔드 하나뿐이라 메뉴 없이 바로 간다.
			links: [{ label: "Github", href: "https://github.com/bb2002/healix-backend" }],
			// 표지를 그대로 담으면 QR 과 팀 크레딧이 들어오고 워드마크가 바로 옆 카드
			// 제목과 겹친다. 표지에서 폰 목업만 205:141 로 떼어 냈다.
			thumbnail: {
				src: asset("/projects/healix/00-thumb-4ae26d2b.png"),
				alt: "HEALIX 화면, 지도 아래로 근처 병원과 예약 정보가 늘어서 있다",
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
			description: "간단한 설치로 외부 접속이 막힌 게임 서버에 접속 가능한 도메인을 발급해주는 서비스입니다. TCP 터널링과 SRV 레코드를 핵심으로 사용했습니다.",
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
				alt: "WATERFLAKE 화면, 새 터널을 만드는 폼",
			},
			// 터널을 만들고 → 주소와 키를 받고 → 서버가 붙는다. 마지막 장이 터널링
			// 성공 로그라, 넘기다 보면 설명이 말한 도메인이 실제로 사는 걸로 끝난다.
			gallery: WATERFLAKE_SCREENS,
			slug: "waterflake",
			story: waterflakeStory,
		},
		{
			period: "2018",
			title: "스크린 번역기",
			description:
				"휴대폰을 흔들면 화면을 캡처해 오버레이로 번역문을 보여줍니다. 중학생 때 처음 만들어 수익화까지 성공했습니다.",
			// 저장소가 하나뿐이라 메뉴 없이 바로 간다.
			links: [{ label: "Github", href: "https://github.com/bb2002/ProjectScreenTranslator" }],
			// 넷 다 세로라 205:141 타일에 담기면 띠가 된다. 첫 장에서 게임 로고와 그
			// 위에 덮인 번역 팝업이 함께 들어오게 잘라 냈다 — 카드 문구가 말하는
			// 동작이 타일 안에서 그대로 보이고, 누르면 그 장이 먼저 뜬다.
			thumbnail: {
				src: asset("/projects/screen-translator/00-thumb.jpg"),
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

/**
 * bigint-migration 의 그림 두 장. 프로젝트 구조도와 같은 손그림 규칙으로 Pencil 문서의
 * `bigint / 01 table` · `bigint / 02 trigger` 프레임(1200×440, 1200×420)에서 그려 2x 로
 * 내보냈다 — 바꿀 일이 생기면 코드가 아니라 그 문서를 고친다.
 */
const BIGINT_TABLE: Media = {
	src: asset("/experience/bigint-migration/01-table.png"),
	width: 2400,
	height: 880,
	caption: "19억 건 가운데 실제로 읽히는 것은 최근 한 달치뿐",
	alt: "luckybox 테이블 그림. id 열이 INT 로 선언된 채 19억 건이 쌓여 있고, 위쪽 대부분의 행은 만료되어 읽히지 않으며 아래쪽 최근 한 달치 행만 실시간으로 쓰인다. 오른쪽 게이지는 INT 최댓값 21억 가운데 19억까지 찬 상태로, 남은 여유가 두 달 정도임을 보여 준다",
};

const BIGINT_TRIGGER: Media = {
	src: asset("/experience/bigint-migration/02-trigger-12a883d63d8d.png"),
	width: 2400,
	height: 840,
	caption: "트리거가 PK 를 음수로 바꿔 끼우는 흐름",
	alt: "트리거 구조도. 서버가 INSERT 하면 BEFORE INSERT 트리거가 시퀀스 테이블에서 다음 값 n 을 읽어 id 를 -n 으로 바꿔 넣고, luckybox 테이블에는 -1, -2 처럼 음수 id 로 저장된다. 앱은 SELECT 로 그 값을 읽어도 INT 범위 안이라 문제없이 처리한다",
};

/**
 * realtime-redesign 의 그림 두 장. 위와 같은 규칙으로 Pencil 문서의 `realtime / 01 item` ·
 * `realtime / 02 open` 프레임(1200×420, 1200×440)에서 그려 2x 로 내보냈다.
 */
const REALTIME_ITEM: Media = {
	src: asset("/experience/realtime-redesign/01-item-6d1a661e4b30.png"),
	width: 2400,
	height: 700,
	caption: "파티션 키 하나에 상자를 배열로",
	alt: "DynamoDB 아이템 그림. 파티션 키는 사용자 하나로 잡히고, 그 안의 boxes 배열에 id·cash·opened 값을 가진 상자가 줄지어 있다. API 는 새 상자를 배열에 덧붙이고, 상자를 열면 그 항목에 캐시를 써 넣는다",
};

const REALTIME_OPEN: Media = {
	src: asset("/experience/realtime-redesign/02-open-267330550719.png"),
	width: 2400,
	height: 850,
	caption: "상자를 열 때 저장소 셋을 도는 순서",
	alt: "상자 열기 흐름도. 앱이 상자를 열면 서버가 MySQL 에서 설정을 읽고(read config), Redis 에서 고액 당첨 TTL 플래그를 확인한 뒤(check ttl), DynamoDB 의 상자를 열림으로 바꾸고 ZSET 랭킹을 갱신한다(set open & add rank). 마지막으로 앱에 캐시가 지급된다",
};

/**
 * aws-cost 의 그림. 위와 같은 규칙으로 Pencil 문서의 `aws / 01 route53` 프레임(1200×420)에서
 * 그려 2x 로 내보냈다.
 */
const AWS_ROUTE53: Media = {
	src: asset("/experience/aws-cost/01-route53.png"),
	width: 2400,
	height: 840,
	caption: "Route 53 가중치 라우팅으로 트래픽의 10% 만 새 인스턴스에",
	alt: "트래픽 분배 구조도. 사용자의 요청이 Route 53 에 닿으면 가중치 라우팅으로 갈라져, 기존 Intel x86 인스턴스로 도는 Beanstalk 이 90%, 같은 Dockerfile 로 arm64 이미지를 빌드해 올린 Graviton 인스턴스의 Beanstalk 이 10% 를 받는다. Intel 쪽은 피크에 12대까지 늘어난다",
};

/**
 * api-memory 의 그림. 위와 같은 규칙으로 Pencil 문서의 `api / 01 leak` 프레임(1200×440)에서
 * 그려 2x 로 내보냈다.
 */
const API_MEMORY_CHART: Media = {
	src: asset("/experience/api-memory/01-leak.png"),
	width: 2400,
	height: 880,
	caption: "인스턴스 한 대의 메모리, 닷새 만에 1GB 에서 32GB 까지",
	alt: "꺾은선 그래프. 인스턴스 한 대의 메모리 사용량이 첫날 1GB 에서 시작해 닷새에 걸쳐 32GB 한계선까지 올라가고, 거기서 OOM 으로 강제 종료된 뒤 재시작해 다시 1GB 부터 시작한다",
};

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
			title: "19억 건의 테이블을 점검 시간 1시간 내에 마이그레이션",
			subtitle: "옮길 데이터에 우선순위를 정하고, 언제든 되돌릴 수 있는 마이그레이션 스크립트를 준비했습니다.",
			body: [
				{ heading: "배경" },
				"타임스프레드에는 랜덤 상자라는 기능이 있습니다. 광고를 보면 캐시가 무작위로 담긴 상자가 지급되고, 그 상자를 열면 캐시가 들어오는 단순한 기능이었습니다. 상자 하나는 luckybox 테이블의 한 행이었습니다. 사용자가 늘면서 이 테이블에 19억 건이 쌓였는데, 기본 키가 INT 로 선언되어 있어 상한인 21억까지 두 달 정도밖에 남지 않은 상태였습니다. 이 테이블을 BIGINT 로 선언한 새 테이블로 옮겨야 했습니다.",
				{ heading: "첫 번째 시도" },
				"먼저 서비스의 특징을 조사했습니다. 상자는 24시간이 지나면 만료되고, 랭킹을 처리하는 배치 프로그램은 최근 1개월 데이터만 읽고 있었습니다. 점검 시간 안에 이 데이터만 옮기면 서비스를 다시 띄울 수 있다는 뜻이었습니다.",
				BIGINT_TABLE,
				"팀장님과 논의해 평일 새벽에 서비스를 1시간 멈추고, 미리 준비한 마이그레이션 스크립트를 실행하기로 했습니다. 스크립트는 아래 작업을 순서대로 수행합니다.",
				{
					items: [
						"기존 테이블의 이름을 RENAME 해 연결을 끊습니다.",
						"새 테이블을 BIGINT 로 다시 만듭니다.",
						"혹시 모를 중복을 막기 위해 PK 가 22억부터 시작하게 합니다.",
						"1개월 전 데이터가 몇 번 ID 인지 알아냅니다.",
						"MySQL 프로시저로 100건씩 배치로 데이터를 복사합니다.",
					],
				},
				"스크립트를 짜면서 가장 중요하게 본 것은 '롤백이 가능한가'였습니다. 작업 도중 문제가 생기면 즉시 멈출 수 있어야 했고, 진행 상황도 눈으로 볼 수 있어야 했습니다. 데이터 삽입은 쿼리 한 줄로도 작성할 수 있었지만, 진행 상황을 알 수 없고 중간에 멈출 수도 없어 작업을 잘게 쪼개기로 했습니다.",
				"마이그레이션은 무사히 진행됐습니다. 1개월치 데이터가 들어갔고, 새 상자는 22억부터 만들어지기 시작했습니다. 그런데 어째서인지 안드로이드 앱에서 크래시가 나기 시작했습니다. 남은 점검 시간이 많지 않아 준비해둔 순서대로 롤백했고, 서비스는 이전 모습으로 돌아갔습니다.",
				{ heading: "원인" },
				"이유는 단순했습니다. 앱에서도 ID 를 INT 로 다루고 있어 21억이 넘는 값을 처리하지 못한 것입니다. 서버만 고쳐서 될 문제가 아니었습니다. 다른 방법을 찾아야 했습니다.",
				{ heading: "두 번째 시도" },
				"팀장님과 해결책을 논의하다가 문득 INT 에는 음수 영역도 있다는 사실이 떠올랐습니다. 다행히 unsigned 로 선언되어 있지 않아, PK 를 음수로 저장하는 방법을 두고 이야기를 나눴습니다. 팀장님께서도 좋은 방법이라고 하셔서 곧바로 작업에 들어갔습니다.",
				BIGINT_TRIGGER,
				"BEFORE INSERT 트리거를 걸어, 값이 들어올 때 시퀀스 테이블에서 다음 값을 읽어 PK 를 음수로 바꿔 넣도록 했습니다. 테스트 서버에서 서버와 앱이 음수 PK 를 모두 문제없이 처리하는 것을 확인하고, 새벽에 트리거를 설치했습니다.",
				"그날 이후 삽입되는 모든 데이터의 PK 가 음수로 들어갔고, 앱에서도 문제가 생기지 않았습니다. 이 조치로 당장의 장애를 막고 약 2년의 리팩토링 시간을 벌었습니다.",
			],
		},
		{
			slug: "realtime-redesign",
			year: "2023",
			title: "분당 1,500건의 요청을 받는 서비스 리팩토링",
			subtitle: "DynamoDB 와 Redis 로 다시 설계해, 6시간에 한 번 갱신되던 랭킹을 실시간으로 움직이게 했습니다.",
			body: [
				{ heading: "배경" },
				"앞선 마이그레이션으로 시간을 벌고 1년이 지났습니다. 그동안 앱이 ID 를 정수로 다루던 것을 String 으로 바꿨고, 그 배포가 사용자의 99% 에 닿을 때까지 기다렸습니다. 마침 운영팀에서 랜덤 상자의 확률 조정 기능을 파악하기 어려우니 리뉴얼하자는 요청이 왔고, 대표님께서도 승인해주셔서 드디어 리팩토링에 착수할 수 있었습니다.",
				{ heading: "상자를 어디에 저장할 것인가" },
				"먼저 상자를 어디에 저장할지 고민했습니다. 예전 설계는 상자를 전부 MySQL 에 저장해, 상자를 만들 때마다 INSERT 가, 상자를 열 때마다 UPDATE 가 발생했습니다. 이를 DynamoDB 로 옮기고, 파티션 키로 읽고 쓰는 속도가 빠르다는 장점을 최대한 활용하기로 했습니다.",
				REALTIME_ITEM,
				"상자가 생기면 배열에 값을 더하고, 상자를 열면 그 항목만 고치면 됐습니다. 겉으로 보기에는 MySQL 과 다르지 않지만 파티션 키 하나로 조회하고 수정하기 때문에 훨씬 빨랐습니다. 또 사용자가 그날 처음 접속하면 쌓여 있던 데이터를 지우게 해, 이전처럼 값이 끝없이 늘어나는 일도 막았습니다.",
				"새로 생긴 정책으로, 한 사용자는 최대 20개의 상자만 열 수 있다는 제약사항도 있었습니다. 이 제약사항 또한 상자의 length 만 계산하면 깔끔하게 해결할 수 있어서 더욱 효율적이었습니다.",
				{ heading: "랭킹과 설정은 어디에 둘 것인가" },
				"랭킹 시스템도 새로 만들었습니다. Redis 의 ZSET 은 중복 없는 키를 점수 순으로 정렬해두고, 순위를 읽고 갱신하는 작업에 O(log n) 의 시간복잡도를 가집니다. 그리고, 고액 당첨자를 일정 기간 다시 당첨되지 못하게 막아야 한다는 요구사항도 있었는데, 당첨된 사용자의 ID 를 TTL 을 걸어 Redis 에 저장해두면 데이터베이스에서 당첨 기록을 조회할 필요 없이 간단하게 해결할 수 있었습니다.",
				"당첨 확률 같은 설정 값은 MySQL 에 남겼습니다. 관리자 콘솔과의 연동을 고려해야 했기 때문입니다. 상자를 열 때마다 MySQL 을 한 번 읽어야 한다는 단점이 있지만, 설정을 실시간으로 반영할 수 있고 조회만 하므로 큰 부담은 아니라고 판단했습니다.",
				REALTIME_OPEN,
				{ heading: "결과" },
				"완성된 시스템은 조금씩 트래픽을 받았습니다. 아침에는 10% 정도만 받으면서 지켜보다가, 문제가 없어 오후에 100% 로 올렸습니다. MySQL 의 부하가 내려갔고, 무엇보다 랭킹에 활기가 돌았습니다. 6시간에 한 번 갱신되던 값이 실시간으로 동작했기 때문입니다. 운영팀에서도 당첨 확률을 설정하기가 편해졌다며 만족스러워했습니다.",
				"문제를 발견해 팀장님께 보고한 날부터 마지막 리팩토링까지 꼬박 1년이 걸렸습니다. 제가 쓴 코드가 조금씩 트래픽을 받아 100% 까지 배포되는 모습을 지켜본 경험은 아직도 잊히지 않는 개발의 즐거움입니다.",
			],
		},
		{
			slug: "aws-cost",
			year: "2022",
			title: "월 1천만 원을 넘기던 AWS 비용을 30% 절감",
			subtitle: "값싸고 성능 좋은 Graviton 인스턴스로 옮기고, 인스턴스 증감 규칙을 다시 잡았습니다.",
			body: [
				{ heading: "배경" },
				"타임스프레드는 서버 비용으로 매달 1천만 원 가까이 쓰고 있었습니다. 팀장님께서 이 비용을 줄일 방법을 찾아보자고 하셨습니다.",
				{ heading: "어디에 돈이 나가고 있는가" },
				"Cost Management 에서 확인해보니 비용이 가장 많이 나가는 곳은 세 군데였습니다.",
				{ items: ["RDS", "Beanstalk (EC2)", "네트워크 트래픽"] },
				"RDS 는 이미 부하가 높아 손댈 여지가 없었으므로, EC2 에서 줄일 곳을 찾았습니다. 마침 ARM 계열의 Graviton 인스턴스가 새로 나왔고, 같은 성능을 20% 정도 싸게 낼 수 있다는 AWS 의 발표를 보고 우리 서비스에 적용해보기로 했습니다.",
				{ heading: "Graviton 으로 옮기기" },
				"먼저 Graviton 인스턴스를 한 대 만들어 서버를 띄워봤습니다. 운영체제 버전과 아키텍처가 바뀌어 기존 방식으로는 뜨지 않았지만, 다행히 Dockerfile 로 빌드하니 ARM 아키텍처에서도 안정적으로 동작했습니다. 그래서 기존 CI/CD 파이프라인을 고쳐 GitHub Actions 에서 크로스 빌드로 ARM 이미지를 만들게 했고, Graviton 인스턴스로 도는 Beanstalk 을 새로 만들어 그 이미지를 쓰게 했습니다.",
				AWS_ROUTE53,
				"테스트 서버에서 QA 팀과 함께 서버가 제대로 도는지 확인했고, 아무 문제가 없었습니다. Route 53 의 가중치 라우팅으로 새 서버에 트래픽의 10% 만 흘려보냈고, 큰 문제가 나오지 않아 최종적으로 모든 트래픽을 Graviton 인스턴스가 받도록 했습니다.",
				{ heading: "인스턴스 증감 규칙 다시 잡기" },
				"며칠 뒤에는 CPU 사용량 데이터를 보고 시간대별 스케일 아웃 규칙을 조정했습니다. 피크 타임에 최대 12대까지 늘어나던 인스턴스를 8대로 줄였고, 야간에는 1대만 돌게 했습니다. 인스턴스 교체와 스케일 규칙 조정을 합쳐 최종적으로 비용을 30% 정도 줄일 수 있었습니다.",
			],
		},
		{
			slug: "api-memory",
			year: "2022",
			title: "32GB 넘게 메모리를 점유하고 멈추던 API 서버 정상화",
			subtitle: "아무 오류도 남기지 않고 메모리를 모두 써버리던 문제를, 상용 서버의 메모리 덤프를 떠서 잡았습니다.",
			body: [
				{ heading: "배경" },
				"입사하고 4개월쯤 지난 시점이었습니다. 머신마다 메모리 사용량이 이상할 만큼 제각각이었습니다. 어떤 머신은 20GB 넘게 쓰고 있고, 어떤 머신은 1GB 정도만 쓰고 있었습니다. 그리고 거의 모든 머신이 나흘에서 닷새쯤 지나면 강제로 종료되고 재시작됐습니다.",
				{ heading: "원인 찾기" },
				"처음에는 재부팅 규칙이 있는 줄 알았습니다. 다른 팀의 백엔드 서버는 실제로 일주일에 한 번 머신을 재부팅한다고 했습니다. 하지만 인스턴스가 메모리를 20GB 씩 쓰는 것은 재부팅 규칙과 상관없이 무언가 잘못된 상태였습니다.",
				API_MEMORY_CHART,
				"며칠 동안 모니터링한 결과, API 서버 어딘가에서 메모리 누수가 일어나 인스턴스의 메모리를 전부 쓰고 마지막에 OOM 으로 강제 종료된다는 사실을 알았습니다. 그런데 Sentry 에도 AWS 모니터링 도구에도 원인이 될 만한 흔적이 남지 않아, 디버깅에 난항을 겪었습니다.",
				{ heading: "메모리 덤프 뜨기" },
				"팀장님께서 상용 서버에 메모리 덤프를 떠서 조사해보자는 아이디어를 주셨습니다. 솔직히 내키지 않았습니다. 덤프를 뜨는 동안 서비스 장애율이 올라갈 수도 있고, 덤프를 가져와도 읽을 줄 몰라 유의미한 결과를 찾기는 어려울 것 같았습니다. 그래도 달리 방법이 없어 우선 해보기로 했습니다.",
				"찾아보니 메모리 덤프 도구가 몇 가지 있었습니다. 팀장님께 공유드리고, 상용 서버에 직접 접속해 두 가지 도구로 메모리를 스캔했습니다. 첫 번째 도구에서는 건질 것이 없었지만, 두 번째 도구에서 같은 오류가 여러 번 발생한 것으로 보이는 덤프 로그를 발견했습니다.",
				{ heading: "원인과 해결" },
				"몇 주 전 퇴사한 개발자가 앱 푸시 발송을 병렬로 바꿔둔 코드가 문제였습니다. 병렬 처리를 위해 스레드를 만드는데, 스레드 안에서 exception 이 발생하면 그 스레드가 회수되지 않고 그대로 남아 메모리 누수가 쌓이고 있었습니다. 스레드 내부의 처리 로직에 try/catch 를 붙여 배포했고, 그 뒤로 모든 인스턴스가 1GB 정도만 쓰는 정상 상태로 돌아왔습니다.",
				"처음에는 해결책이 도저히 떠오르지 않아 스트레스를 받았습니다. 결국 직접 열어서 들여다보면 답은 생각보다 가까운 곳에 있다는 것을 배운 작업이었습니다.",
			],
		},
	],
	gallery: {
		open: "그림 크게 보기",
		previous: "이전 그림",
		next: "다음 그림",
		close: "닫기",
		pick: "그림 고르기",
	},
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
			image: { src: asset("/certificates/02-jlpt-n1-f09f16ac.jpg"), alt: "JLPT N1 합격증" },
			gallery: [
				{
					src: asset("/certificates/02-jlpt-n1-f09f16ac.jpg"),
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
			image: { src: asset("/certificates/01-gisa-632fa275.jpg"), alt: "정보처리기사 자격증" },
			gallery: [
				{
					src: asset("/certificates/01-gisa-632fa275.jpg"),
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
			links: [{ name: "코스모의 노트", href: "/projects/cosmonote" }],
			// 같은 수상에 상장이 둘이다. 카드에는 총장상을 세우고, 열면 둘 다 넘긴다.
			image: { src: asset("/certificates/01-chongjangsang-7e6f9199.jpg"), alt: "동아대학교 총장상 상장" },
			gallery: [
				{
					src: asset("/certificates/01-chongjangsang-7e6f9199.jpg"),
					width: 1400,
					height: 1980,
					caption: "총장상",
					alt: "동아대학교 총장 명의의 상장",
				},
				{
					src: asset("/certificates/02-choiwoosusang-f026e085.jpg"),
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
			links: [{ name: "HEALIX", href: "/projects/healix" }],
			image: { src: asset("/certificates/03-likelion-e9406103.jpg"), alt: "영림원소프트랩 특별상 상장" },
			gallery: [
				{
					src: asset("/certificates/03-likelion-e9406103.jpg"),
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
		caption: "메인 화면",
		alt: "택스팩 커뮤니티 메인 화면. 초록 상단 메뉴 아래 게시판 목록과 최근 글, 배너가 놓여 있다",
	},
	{
		src: asset("/journey/taxpack/02-boards.png"),
		width: 600,
		height: 348,
		caption: "내 게시판 목록",
		alt: "한 사용자가 운영하는 게시판 목록. 게시판 이름과 운영자, 개설일이 줄지어 있고 관리·폐쇄 버튼이 붙어 있다",
	},
	{
		src: asset("/journey/taxpack/03-create.png"),
		width: 600,
		height: 374,
		caption: "게시판 개설",
		alt: "게시판 개설 폼. 제목과 유형, 주소를 적고 로고를 올리는 화면",
	},
	{
		src: asset("/journey/taxpack/04-new-board.png"),
		width: 600,
		height: 466,
		caption: "새로 만든 게시판",
		alt: "막 개설된 게시판. 로고를 등록하라는 안내 아래 공지사항과 게시판 목록이 비어 있다",
	},
	{
		src: asset("/journey/taxpack/05-event.png"),
		width: 600,
		height: 563,
		caption: "이벤트 관리",
		alt: "이벤트 목록과 추가 폼. 제목과 실시 날짜, 켜고 끄는 스위치, 글 편집기가 있다",
	},
	{
		src: asset("/journey/taxpack/06-gallery.png"),
		width: 600,
		height: 480,
		caption: "갤러리형 게시판",
		alt: "한 사용자가 연 포토샵 갤러리 게시판. 날씨 위젯 아래 그림이 타일로 놓여 있다",
	},
	{
		src: asset("/journey/taxpack/07-admin.png"),
		width: 600,
		height: 635,
		caption: "게시판 관리",
		alt: "게시판 관리 화면. 로고 등록, 게시판 타입과 이름 변경, 회원 수와 블랙리스트 관리가 한 페이지에 있다",
	},
];

/** 초등학교 졸업식 사진 한 장. 무대 화면에 장래희망이 컴퓨터 프로그래머라고 적혀 있다. */
const DREAM_PHOTOS: readonly Media[] = [
	{
		src: asset("/journey/dream/01-note.jpg"),
		width: 2000,
		height: 1125,
		caption: "2015년 2월, 초등학교 졸업식",
		alt: "졸업식 무대 화면을 찍은 사진. '졸업을 축하합니다' 아래 진학 학교와 함께 장래희망이 컴퓨터 프로그래머라고 적혀 있다",
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
		caption: "제목 화면",
		alt: "MyRunnerGame 제목 화면. 다다미방 배경에 싱글 플레이 · 1대1 매치 · 랭킹 · 크레딧 메뉴와 닉네임 입력, 튜토리얼 버튼이 있다",
	},
	{
		src: asset("/journey/myrunnergame/02-tutorial.jpg"),
		width: 2400,
		height: 1080,
		caption: "조작법",
		alt: "조작법 화면. 좌에서 우로 슬라이드하면 오른쪽으로, 우에서 좌로 슬라이드하면 왼쪽으로 움직인다는 안내",
	},
	{
		src: asset("/journey/myrunnergame/03-play.jpg"),
		width: 2400,
		height: 1080,
		caption: "플레이",
		alt: "플레이 화면. 도심 도로 위를 달리는 캐릭터 앞에 쓰레기통 장애물이 있고, 왼쪽 위에 점수가 오른다",
	},
	{
		src: asset("/journey/myrunnergame/04-result.jpg"),
		width: 2400,
		height: 1080,
		caption: "결과",
		alt: "결과 화면. 넘어진 캐릭터 위로 점수 152, 랭킹 12위, 기록이 표시된다",
	},
	{
		src: asset("/journey/myrunnergame/05-ranking.jpg"),
		width: 2400,
		height: 1080,
		caption: "랭킹",
		alt: "랭킹 화면. 닉네임과 점수, 날짜가 순위대로 열 줄 늘어서 있다",
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
		caption: "로비",
		alt: "VRTetris 로비. 바다 위 나무 판에 TETRIS 로고와 닉네임 입력칸, 가상 키보드가 떠 있다",
	},
	{
		src: asset("/journey/vrtetris/02-play.jpg"),
		width: 1154,
		height: 1154,
		caption: "플레이",
		alt: "VRTetris 플레이 화면. 노을 진 들판에 세워진 초록 판 안에 블록이 쌓이고, 왼쪽에 점수 2,290 이 떠 있다",
	},
	{
		src: asset("/journey/vrtetris/03-result.jpg"),
		width: 1154,
		height: 1154,
		caption: "결과와 랭킹",
		alt: "VRTetris 결과 화면. 내 점수와 글로벌 · 로컬 랭킹 판이 들판 위에 세워져 있다",
	},
	{
		video: `${JOURNEY_VIDEO}/vrtetris.mp4`,
		src: asset("/journey/videos/vrtetris-poster.jpg"),
		width: 1280,
		height: 720,
		caption: "플레이 영상",
		alt: "VRTetris 플레이 영상. 바닷가 로비에서 닉네임을 넣고 시작하면, 사막 위에 세워진 판에 VR 컨트롤러로 블록을 내려 줄을 지우고 점수를 올린다",
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
		caption: "로비",
		alt: "Tooth 로비. Tooth 로고 아래 이름 입력과 PLAY 버튼, EASY 부터 EXPERT 까지 난이도 선택, 옆에 서버 랭킹과 내 랭킹 판이 있다",
	},
	{
		src: asset("/journey/tooth/02-island.jpg"),
		width: 831,
		height: 720,
		caption: "섬 전경",
		alt: "바다 위에 떠 있는 풀밭 섬과 그 위의 블록 더미, 하늘에 떠 있는 큐브를 내려다본 전경",
	},
	{
		src: asset("/journey/tooth/03-blocks.jpg"),
		width: 747,
		height: 710,
		caption: "블록",
		alt: "섬 위에 촘촘히 놓인 자주색 블록들과 나무, 울타리를 가까이서 본 화면",
	},
	{
		src: asset("/journey/tooth/04-cube.jpg"),
		width: 744,
		height: 706,
		caption: "큐브",
		alt: "어두운 하늘에 떠 있는 블록 큐브. 칸마다 색이 다른 블록이 쌓여 있다",
	},
	{
		src: asset("/journey/tooth/05-level.jpg"),
		width: 745,
		height: 705,
		caption: "레벨 안내",
		alt: "구름 낀 하늘 위에 LEVEL: HARD, STAGE: 2 Lv 라고 떠 있는 화면",
	},
	{
		src: asset("/journey/tooth/06-game-over.jpg"),
		width: 738,
		height: 702,
		caption: "게임 오버",
		alt: "GAME OVER 화면. 점수 180, 레벨 6 과 HOME 버튼이 있다",
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
		caption: "로비",
		alt: "Unrevived 로비. 유적 사이에 떠 있는 판에 unrevived 로고와 이름 입력칸, 맵 고르기와 가상 키보드가 있다",
	},
	{
		src: asset("/journey/unrevived/02-village.jpg"),
		width: 1271,
		height: 711,
		caption: "마을",
		alt: "달이 뜬 저녁의 중세풍 마을. 돌바닥 위에 캐릭터 하나가 서 있다",
	},
	{
		src: asset("/journey/unrevived/03-pistol.jpg"),
		width: 480,
		height: 479,
		caption: "권총",
		alt: "권총을 든 1인칭 시점. 총 옆에 Pistol 이라는 이름과 남은 탄 수 100 이 떠 있다",
	},
	{
		src: asset("/journey/unrevived/04-smg.jpg"),
		width: 480,
		height: 479,
		caption: "기관단총",
		alt: "노을 진 거리에서 SMG11 을 든 1인칭 시점. 탄 수 261 과 30 이 떠 있다",
	},
	{
		video: `${JOURNEY_VIDEO}/unrevived.mp4`,
		src: asset("/journey/videos/unrevived-poster.jpg"),
		width: 1280,
		height: 720,
		caption: "플레이 영상",
		alt: "Unrevived 플레이 영상. 폐허가 된 유적 사이를 VR 로 돌아다니며 SMG 로 적을 쏘는 1인칭 슈팅 게임",
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
		caption: "홈",
		alt: "KNU 코딩플랫폼 홈. 공지사항과 FAQ 상자 아래 프로그래밍 경진대회 카드 세 장이 놓여 있고, 아래에 강원대학교 푸터가 있다",
	},
	{
		src: asset("/journey/codeduri/02-notice.png"),
		width: 1800,
		height: 1080,
		caption: "공지사항",
		alt: "공지사항 글 하나를 연 화면. 공지사항 · FAQ · 전체 강좌 · 경진대회 탭 아래 제목과 작성자, 본문이 있다",
	},
	{
		src: asset("/journey/codeduri/03-contest.png"),
		width: 1800,
		height: 1080,
		caption: "대회 페이지",
		alt: "강원대 코딩 경진대회 페이지. 감자 사진의 배너 아래 대회 소개 · 문제 · 성취도 · 역할 · Q&A 탭이 있고, Overview 와 Introduction, 교수자와 공지 칸이 이어진다",
	},
	{
		src: asset("/journey/codeduri/04-problem.png"),
		width: 1800,
		height: 1080,
		caption: "문제 풀이",
		alt:
			"문제 풀이 화면. 왼쪽에 문제 설명과 제약 사항, 입출력 예시가 있고 오른쪽 어두운 코드 편집기에 답을 적어 제출한다",
	},
	{
		src: asset("/journey/codeduri/05-scores.png"),
		width: 1800,
		height: 1080,
		caption: "성취도",
		alt:
			"대회의 성취도 화면. 배너 아래 문제별 통과 여부가 초록 표시로 나오고, 참가자마다 점수와 순위가 표로 정리돼 있다",
	},
	{
		src: asset("/journey/codeduri/06-roles.png"),
		width: 1800,
		height: 1080,
		caption: "역할 관리",
		alt: "대회의 역할 페이지. 참가자를 검색해 학번과 학과, 이름별로 역할을 배정하는 표",
	},
];

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
					detail: "컴퓨터 프로그래머를 **장래희망**으로 하여 지금까지 이어지고 있습니다.",
					links: [{ name: "장래희망", gallery: DREAM_PHOTOS }],
				},
				{
					year: "2015",
					title: "**택스팩 커뮤니티** 개발",
					featured: true,
					detail: "PHP로 동작하는 소모임 서비스를 개발하여 가입자 100여 명을 달성했습니다.",
					links: [{ name: "택스팩 커뮤니티", gallery: TAXPACK_SCREENS }],
				},
				{
					year: "2017",
					title: "**스크린번역기** 개발",
					featured: true,
					detail:
						"휴대폰을 흔들면 화면 위에 번역 오버레이를 띄워주는 앱을 개발해 1천 다운로드와 수익화를 경험했습니다.",
					links: [{ name: "스크린번역기", gallery: SCREEN_TRANSLATOR_SCREENS }],
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
					links: [{ name: "스크린번역기", gallery: SCREEN_TRANSLATOR_SCREENS }],
				},
				{
					year: "2019",
					title: "VR 게임 개발",
					featured: true,
					detail: "언리얼 엔진을 활용해 **VRTetris**, **Tooth**, **Unrevived** VR 게임을 개발했습니다.",
					links: [
						{ name: "VRTetris", gallery: VRTETRIS_SCREENS },
						{ name: "Tooth", gallery: TOOTH_SCREENS },
						{ name: "Unrevived", gallery: UNREVIVED_SCREENS },
					],
				},
				{
					year: "2020",
					title: "모바일 게임 개발",
					featured: true,
					detail: "언리얼 엔진을 활용해 **MyRunnerGame** 모바일 게임을 개발했습니다.",
					links: [{ name: "MyRunnerGame", gallery: MYRUNNER_SCREENS }],
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
					title: "**KNU 코딩플랫폼** 개발",
					detail: "강원대학교 SW중심대학사업단에서 진행한 코딩 플랫폼 구축 사업에서 팀장 역할을 맡았습니다.",
					links: [{ name: "KNU 코딩플랫폼", gallery: CODEDURI_SCREENS }],
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
					detail: "아무 오류도 남기지 않고 메모리를 모두 써버리던 문제를, 상용 서버의 메모리 덤프를 떠서 잡았습니다.",
				},
				{
					year: "2022",
					title: "월 1천만 원을 넘기던 AWS 비용을 30% 절감",
					detail: "값싸고 성능 좋은 Graviton 인스턴스로 옮기고, 인스턴스 증감 규칙을 다시 잡았습니다.",
				},
				{
					year: "2023",
					title: "19억 건의 테이블을 점검 시간 1시간 내에 마이그레이션",
					featured: true,
					detail: "옮길 데이터에 우선순위를 정하고, 언제든 되돌릴 수 있는 마이그레이션 스크립트를 준비했습니다.",
				},
				{
					year: "2023",
					title: "분당 1,500건의 요청을 받는 서비스 리팩토링",
					featured: true,
					detail: "DynamoDB 와 Redis 로 다시 설계해, 6시간에 한 번 갱신되던 랭킹을 실시간으로 움직이게 했습니다.",
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
					links: [{ name: "HEALIX", href: "/projects/healix" }],
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
					links: [{ name: "코스모의 노트", href: "/projects/cosmonote" }],
				},
				{
					year: "2026",
					title: "Align Networks 리드 엔지니어",
					detail: "**enqor** 프로젝트 개발 전체를 담당하고 있습니다.",
					links: [{ name: "enqor", href: "/projects/enqor" }],
				},
			],
		},
	],
	gallery: {
		open: "사진 크게 보기",
		previous: "이전 사진",
		next: "다음 사진",
		close: "닫기",
		pick: "사진 고르기",
	},
};
