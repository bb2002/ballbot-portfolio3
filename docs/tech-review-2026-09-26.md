# 기술 리뷰 — 설계·SEO·성능·접근성·운영 (2026-09-26)

**범위.** 코드와 배포 설정만 본다. `apps/*/src/content/portfolio.ts` 의 한국어·일본어 문구는 별도 계획서(`work-plan-2026-09-26.md`)에서 검토 중이므로 여기서는 손대지 않는다.

**상태 기록 (조사 시점).** `npm run lint` 통과 · `npm run typecheck` 통과 · `npm test` 12/12 통과(router 만 테스트가 있다). 작업 트리의 미커밋 변경 3개 파일(jp page.tsx, jp portfolio.ts, hero.tsx)은 사용자의 의도적 변경이라 그대로 둔다.

**dev 서버.** :7770/:7771 은 조사 시점에 떠 있지 않았다(프로세스 없음, `connection refused`). 다시 띄우지 말라는 지시가 있어 브라우저 확인은 `npm run build` 뒤 `next start` 를 **다른 포트(:7780/:7781)** 에 잠깐 띄워서 한다. 그 프로세스는 확인이 끝나면 내가 내린다.

**심각도.** P0 = 배포된 사이트에서 실제로 깨져 있음 · P1 = 확실한 결함 · P2 = 개선 · P3 = 기록만.

---

## 0. 요청 흐름 (이 문서가 다루는 층)

```
  reader ──► ballbot.dev (router Worker)
              │  cookie bb-locale > cf.country==JP > default ko
              │  302 + no-store + Vary: cookie
              ▼
        kr.ballbot.dev / jp.ballbot.dev (OpenNext Worker)
              │
              ├─ /_next/static, /fonts, /brand, /mock ── Workers static assets (_headers 로 캐시)
              ├─ /_next/image ─────────────────────── IMAGES 바인딩
              └─ 문서 요청 ──► Next server (minimal mode)
                                 │
                                 ├─ "/"                → 요청마다 렌더 (지금)  ← prerender 결과를 캐시에서 못 찾음
                                 └─ /projects/[slug]   → 404 (지금)           ← dynamicParams=false + 캐시 없음
                                                          ▲
                                     .open-next/cache/<buildId>/projects/cosmonote.cache 가 있지만
                                     incrementalCache 가 "dummy" 라 어디에도 올라가지 않는다
```

---

## 1. 발견 사항

### P0-1 · 프로젝트·경험 스토리 페이지가 프로덕션에서 전부 404

- **근거.** 2026-09-26 `curl` 로 확인: `https://kr.ballbot.dev/projects/cosmonote` → `404`, `/experience/bigint-migration` → `404`, jp 도 동일. 그런데 같은 호스트의 `/sitemap.xml` 은 스토리 8개 URL 을 모두 실어 보낸다 — 즉 배포된 빌드에 페이지가 들어 있는데 라우팅이 404 를 낸다. 404 본문은 Next 기본 페이지(`404: This page could not be found.`)다.
- **원인.** `apps/*/open-next.config.ts` 가 `defineCloudflareConfig({})` — `incrementalCache` 가 기본값 `dummy`. OpenNext 는 프리렌더 결과를 `.open-next/cache/<buildId>/…​.cache` 로 내놓고(로컬 9/24 빌드에 `projects/cosmonote.cache` 등이 실제로 있다) 배포 시 `populateCache` 로 캐시 저장소에 올리는데, `dummy` 면 아무 데도 올리지 않는다. 라이브 응답이 그걸 그대로 보여 준다: 홈도 스토리도 `x-nextjs-cache: MISS` + `x-nextjs-prerender: 1`. 캐시 miss 뒤의 정확한 분기(minimal mode 에서는 miss 가 곧장 404 가 아니라 요청 시 렌더로 떨어지고, `dynamicParams = false` 인 `[slug]` 의 그 렌더가 not-found 로 끝난다 — 리뷰 OV-1)는 Next 소스에서 끝까지 짚지 못했지만, 결론은 같다: 프리렌더 결과를 캐시에서 찾게 하면 miss 자체가 사라진다. `/` 는 정적 라우트라 miss 여도 요청마다 다시 렌더해 살아 있고(응답의 `cache-control: s-maxage=31536000` 이 그 경로다), 같은 수정으로 `/` 도 HIT 가 된다.
- **제안.** 두 앱의 `open-next.config.ts` 에 `incrementalCache: staticAssetsIncrementalCache` (`@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache`). 재검증이 없는 완전 정적 사이트용 읽기 전용 캐시로, `opennextjs-cloudflare deploy` 가 `populateCache` 단계에서 `.open-next/cache` 를 `.open-next/assets/cdn-cgi/_next_cache/` 로 복사해 Workers 정적 자산으로 함께 올린다(`cdn-cgi/` 는 Worker 만 읽을 수 있다). 새 바인딩·버킷이 필요 없고 `wrangler.jsonc` 는 그대로다.
- **테스트.** 로컬에서 `npm run preview` (apps/kr) 로 `.open-next` 를 띄워 `/projects/cosmonote` 가 **200 + `x-nextjs-cache: HIT`** 인지(200 이지만 MISS 면 캐시가 아니라 다른 경로가 살린 것이다), `/projects/nope` 가 404 + 마켓 언어 문구인지(OpenNext 라우팅이 `/404` 로 보내는 경로라 `next start` 로는 못 본다) 확인 → 배포 → `npm run check:live`. **이 세션은 preview/deploy 가 금지라 코드 변경까지만 하고, 확인은 사용자가 한다. 아래 4절 10 의 `next start` 는 minimal mode 도 ASSETS 바인딩도 아니라 P0 를 검증하지 못한다(리뷰 OV-3).** 캐시는 `opennextjs-cloudflare deploy|upload|preview` 가 `populateCache` 로 채운다 — 맨 `wrangler deploy` 나 Workers Builds 로 배포하면 소리 없이 지금의 404 로 돌아간다(리뷰 OV-2). 그 사실을 `open-next.config.ts` 주석에 적는다.

### P1-1 · 스토리 페이지에 `hreflang` 이 없고, 사이트맵의 스토리 항목에도 없다

- **근거.** `projects/[slug]/page.tsx`·`experience/[slug]/page.tsx` 의 `generateMetadata` 가 `alternates: { canonical: path }` 만 돌려준다. Next 의 메타데이터 병합은 **얕은 병합**이라(`generate-metadata.md` › Merging) 페이지가 `alternates` 를 정의하는 순간 레이아웃의 `languages` 는 통째로 사라진다. `sitemap.ts` 도 홈 항목에만 `alternates` 를 단다. 두 빌드의 슬러그는 8개 모두 같으므로(확인함) 짝이 있는데 선언만 빠진 상태다.
- **제안.** `packages/shared/src/markets.ts` 에 경로를 받는 `languageAlternates(path)` 를 두고(`ko`/`ja` 는 각 마켓 호스트 + 경로, `x-default` 는 apex + 경로 — router 의 `carry` 가 경로를 그대로 넘기므로 `https://ballbot.dev/projects/cosmonote` 도 살아 있다, 라이브에서 확인), 스토리 페이지 메타데이터와 사이트맵 항목 양쪽에 붙인다. 기존 `LANGUAGE_ALTERNATES` 는 `languageAlternates("/")` 로 유지.
- **테스트.** `packages/shared/src/markets.test.ts` (node --test) 로 헬퍼를, 빌드 후 `curl` 로 `/projects/cosmonote` 의 `<link rel="alternate" hreflang=…>` 3개와 `/sitemap.xml` 의 `xhtml:link` 를 확인.

### P1-2 · 스토리 페이지의 `og:locale`·`siteName` 유실

- **근거.** 같은 얕은 병합 문제: 페이지가 `openGraph` 를 정의하면 레이아웃의 `locale` 이 빠진다. 라이브 홈에는 `og:locale=ko_KR` 이 있고 `og:site_name` 은 어디에도 없다.
- **제안.** `markets.ts` 에 `openGraphBase(locale)` (siteName, locale, alternateLocale) 를 두고 레이아웃·스토리 페이지가 펼쳐 쓴다.
- **테스트.** 빌드 후 `curl` 로 `og:locale`, `og:locale:alternate`, `og:site_name`.

### P1-3 · 스킵 링크 부재

- **근거.** 첫 탭 포커스가 히어로의 "프로젝트 보기". 키보드 사용자는 히어로 링크 3개를 지나야 nav 에 닿고, 본문까지는 더 멀다.
- **제안.** 레이아웃 `<body>` 첫 자식으로 `<a href="#main" class="skip-link">` — 포커스 전엔 화면 밖, 포커스 시 좌상단에 나타남(`theme.css`). 홈의 `<main>`(kr/jp page.tsx), 스토리 페이지의 `<main>`(project-story.tsx, experience-story.tsx), 404 의 `<main>` 에 `id="main"` **과 `tabIndex={-1}`** — `<main>` 은 포커스 가능한 요소가 아니라서 `#main` 으로 뛰어도 `activeElement` 는 `<body>` 에 남는다(OV-7). 프로그램 포커스에는 외곽선을 그리지 않도록 `#main:focus-visible { outline: none }`. 링크 문구는 UI 카피라 마켓별로 한 줄 필요 — **결정 D-1** 참고. jp `page.tsx` 의 `<main>` 줄은 사용자의 미커밋 hunk 바로 옆이라 같은 hunk 로 묶인다 — 기존 줄은 그대로 두고 속성만 더한다(OV-8, 오케스트레이터가 허용한 방식).
- **테스트.** 브라우저에서 Tab 한 번 → 링크가 보이고 Enter 로 `document.activeElement` 가 `<main>` 이 되는지.

### P1-4 · 프로젝트 스토리의 LCP 이미지가 지연 로드

- **근거.** dev 콘솔의 LCP 경고(HEALIX 의 `01-cover-5badd1f3.png` = 슬라이더 첫 장). `screen-slider.tsx` 는 모든 슬라이드에 `loading` 만 주고 첫 장을 미리 알리지 않는다. `lg` 이상에서 슬라이더는 첫 화면 오른쪽 열이고, 폰에서도 제목 바로 아래라 첫 뷰포트다.
- **제안.** 첫 슬라이드(`slide === 0`)에 `preload` — Next 16 은 `priority` 를 **deprecated** 하고 `preload` 로 갈아탔다(`image.md` › preload). **첫 장에서는 `loading` prop 을 반드시 뺀다(권고가 아니라 요건):** `get-img-props.js:400` 은 `preload` 와 `loading="lazy"` 가 같이 오면 렌더 시점에 throw 하는데, 지금 `loading` 은 `index` 로 매 렌더 계산되므로 독자가 세 번째 장으로 넘기는 순간 첫 장이 `lazy` 가 되어 클라이언트가 죽는다(OV-6). 나머지 장은 지금대로. 같은 이유로 `image-placeholder.tsx` 의 (아무도 안 쓰는) `priority` prop 을 `preload` 로 이름만 바꾼다.
- **테스트.** 빌드 후 `curl` 로 `/projects/healix` 의 `<link rel="preload" as="image">` 존재 확인, 브라우저 콘솔에 LCP 경고 없음.

### P2-1 · JSON-LD 없음

- **제안.** 각 레이아웃 `<head>` 에 `@graph: [Person, WebSite]` 한 개. Person 은 `name`(마켓 언어), `alternateName: "ballbot"`, `jobTitle: "Software Engineer"`, `url`, `sameAs`(히어로 보조 버튼 중 http 링크; 지금 GitHub 이 `https://github.com/` 자리표시자라 경로가 없는 링크는 거른다 — 작업 계획서 A1 이 고치면 자동으로 들어간다). WebSite 는 `name`, `url`, `inLanguage`. `JSON.stringify(...).replace(/</g, "\\u003c")` (Next json-ld 가이드).
- **테스트.** 빌드 후 `curl` 로 `application/ld+json` 블록 파싱.

### P2-2 · 404 페이지가 Next 기본(영문)

- **근거.** 라이브 404 본문: `404: This page could not be found.` 에 `<title>` 두 개(기본 컴포넌트 것 + 레이아웃 것). 슬러그 오타·옛 링크가 이 화면으로 온다.
- **제안.** `apps/*/src/app/not-found.tsx` — 제목 한 줄과 홈 링크, 레이아웃(푸터 포함) 안에서 렌더. Next 가 404 에 `noindex` 를 자동으로 넣으므로 메타는 추가하지 않는다(`not-found.tsx` 는 `metadata` export 를 지원하지 않는다; `global-not-found` 만 가능). 문구는 **결정 D-1**.
- **테스트.** `next start` 로 `/projects/nope` → 404 + 마켓 언어 문구.

### P2-3 · Architecture 절의 소제목 레벨

- **근거.** `project-story.tsx` 의 에세이 제목이 `h3`, 그 본문 `StoryBody` 의 `headingAs` 기본값도 `h3` → 소제목이 에세이 제목의 형제가 된다.
- **제안.** `Architecture` 에서 `headingAs="h4"`. (ExperienceStory 는 이미 `h2` 로 맞춰 준다.)
- **테스트.** `/projects/cosmonote` 의 헤딩 아웃라인.

### P2-4 · router: `/go/*`·`?geo` 에 `noindex` 없음, apex 에 HSTS 없음

- **근거.** 라이브 `https://ballbot.dev/go/ja` 응답에 `x-robots-tag` 없음. `https://ballbot.dev/` 응답에 `strict-transport-security` 없음 — 마켓 빌드는 `includeSubDomains; preload` 를 보내는데 preload 목록은 **등록 도메인(apex)** 이 그 헤더를 보내야 받아준다. `http://ballbot.dev/` 는 곧장 `https://kr.ballbot.dev/` 로 302 (같은 호스트 https 로 먼저 올리지 않음).
- **제안 (리뷰 후 수정).** `?geo` 응답(본문이 있는 200 JSON)에만 `x-robots-tag: noindex` — `/go/*` 는 본문 없는 302 라 로봇 지시는 리다이렉트 대상에 적용되므로 헤더가 무의미하다(OV-5). HSTS 는 apex 의 모든 응답에 **`max-age=63072000` 만** — `includeSubDomains` 는 apex 에서 보내면 `assets.ballbot.dev` 를 포함한 현재·미래의 모든 서브도메인을 브라우저에 https 로 고정하고, `preload` 는 목록 등재 후 사실상 되돌릴 수 없다(OV-4). 마켓 빌드가 자기 서브트리에 보내는 `includeSubDomains; preload` 는 그대로 둔다. preload 등재를 정말 원하면 D-3(Always Use HTTPS) 뒤에 apex 값을 올리면 된다.
- **테스트.** `apps/router/src/index.test.ts` 에 케이스 추가(`?geo` noindex, 302·301 응답의 HSTS 값).

### P2-5 · README 의 `/api/resume` 잔재

- **근거.** README "Deploying" 절이 `/api/resume` 가 503 을 낸다고 설명하지만 라우트·폼은 2026-09-19 에 삭제됐다(코드에 흔적 없음, router 테스트의 `/resume` 는 임의 경로 예시일 뿐).
- **제안.** 그 문단을 지우고, 자산은 R2 로 간다는 한 줄(`npm run assets:push`)로 바꾼다.

### P2-6 · 마켓 간 슬러그 불일치를 잡는 장치가 없다

- **근거.** hreflang 을 스토리 페이지에 달면 "상대 마켓에 같은 슬러그가 있다" 는 게 약속이 된다. 지금은 8개가 같지만 타입이 강제하지 않는다.
- **제안 (리뷰 후 수정).** 루트 `scripts/slugs.test.mjs` — 두 `portfolio.ts` 를 텍스트로 읽어 `slug: "…"` 집합이 같은지 비교(컴포넌트(.tsx)를 끌어오지 않으려고 import 대신 텍스트). `apps/kr` 안에 두면 turbo 가 kr 패키지 입력만 해시해서 jp 의 `portfolio.ts` 를 고쳐도 캐시된 "통과" 를 재생한다(OV-10, `turbo.json` 첫 주석이 말하는 바로 그 함정). 그래서 루트 작업 `//#check:slugs` 로 두고 `inputs` 에 두 파일을 적는다; 루트 `npm test` 가 `turbo run test check:slugs` 로 같이 돈다.

### P3 · 기록만 (문제 아님 또는 설계 결정)

- **`nodejs_compat` 플래그가 없다** — wrangler 4.129 는 `compatibility_date >= 2026-08-04` 면 기본 활성(`NODEJS_COMPAT_DEFAULT_ON_DATE`). 이 프로젝트는 `2026-09-03`. OpenNext 템플릿은 명시하지만 없어도 같다. 바꾸지 않는다.
- **apex 리다이렉트가 크롤러에 보이는 방식** — `302 + cache-control: no-store + vary: cookie + x-bb-decision`. Googlebot 은 대개 미국에서 오므로 kr 을 받고, x-default 가 apex 를 가리키는 건 Google 이 허용하는 "선택/리다이렉트 페이지" 용법. 각 마켓이 자기 canonical 을 선언하므로 apex 가 canonical 로 뽑힐 일은 없다. **단, hreflang 검사 도구와 Search Console 은 "x-default URL 이 200 이 아니다" 경고를 낼 것이다 — 색인에는 영향이 없고 예상된 소음이다(OV-9).**
- **`canonical`/`hreflang`/사이트맵의 홈 URL 표기** — 라이브 canonical 은 `https://kr.ballbot.dev`(Next 가 루트의 슬래시를 떼어 낸다), hreflang·`<loc>` 도 `https://kr.ballbot.dev`. 헬퍼는 루트 경로에서 슬래시를 붙이지 않아 **홈 URL 출력은 한 글자도 바뀌지 않는다**(OV-9 의 우려 반영).
- **HTML 응답의 `cache-control: s-maxage=31536000`** — OpenNext 가 프리렌더 페이지에 붙이는 값. Cloudflare 는 기본으로 HTML 을 엣지 캐시하지 않아(`cf-cache-status` 없음) 지금은 무해하다. 나중에 HTML Cache Rule 을 켜면 배포 후 퍼지 없이는 1년간 옛 HTML 이 남을 수 있으니 그때 `cachePurge` 설정을 같이 볼 것.
- **헤딩 계층** — 이전 리뷰 메모(2026-09-14)의 "id 없는 SectionLabel 이 h2" 는 해소됐다. 홈 4개·스토리 6개 SectionLabel 이 모두 id 를 갖고, 카드·챕터가 h3, 이벤트가 h4 로 내려간다. 컴포넌트는 그대로 둔다.
- **대비** — `--color-text-placeholder: #8f8f8f` 는 어떤 컴포넌트도 쓰지 않는다(토큰만 남음). 본문 회색 `#474747` 은 흰 배경에 약 9:1. 뷰어의 `white/55` 카운터는 `aria-hidden` 장식.
- **0.5px hairline** — 1배율에서 흐릿할 수 있으나 디자인 언어의 일부. 바꾸지 않는다.
- **`prefers-reduced-motion`** — `theme.css` 가 reveal·hero 등장·큐·라이트박스 애니메이션과 `scroll-behavior` 를 전부 끈다. 슬라이더·라이트박스 트랙은 `motion-reduce:transition-none`. 빠진 곳 없음.
- **폰트** — Pretendard 동적 서브셋 92개 슬라이스 전부 `font-display: swap`, 스타일시트는 React 19 가 `preload as=style` 로 올린다(라이브 확인). 슬라이스는 `unicode-range` 로 브라우저가 고르므로 preload 대상이 아니다. IBM Plex Mono 는 next/font 가 woff2 3개를 preload.
- **클라이언트 경계** — `"use client"` 는 NavBar, Reveal, Lightbox, ScreenSlider, ZoomImage, GalleryThumb, LinkMenu, MarkedText — 전부 상호작용이 있는 것들이다. 섹션·스토리·푸터는 서버 컴포넌트.
- **라이트박스·슬라이더 접근성** — `role=dialog`/`aria-modal`/포커스 트랩/Escape·화살표·Home/End, 비활성 슬라이드 `inert`, 레일 `aria-current`. 트랩이 `button` 만 순회해 `<video controls>` 가 트랩 밖으로 나갈 수 있는 정도가 남는다(녹화가 있는 갤러리에서만, 기록).
- **보안 헤더** — 라이브에서 `nosniff`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy`, HSTS 확인. CSP 없음은 `next.config.ts` 에 이유가 적혀 있다(nonce 가 정적 렌더를 깬다). 바꾸지 않는다.
- **트레일링 슬래시** — `/projects/cosmonote/` → 308 → `/projects/cosmonote`. 사이트맵·canonical 모두 슬래시 없음.
- **`TODO(confirm)`** — `portfolio.ts` 두 곳(kr:712, jp:714), 콘텐츠 검토 항목이라 여기서 다루지 않는다.
- **OG 이미지 없음** — 1200×630 자산이 있어야 한다. **결정 D-2**.
- **`untitled.md`** (루트, 빈 파일, 미추적) — 사용자 파일. 손대지 않는다.

---

## 2. 바꾸지 않을 것과 이유

| 항목 | 이유 |
|---|---|
| `nodejs_compat` 추가 | 날짜 기본 활성. 넣어도 같은 동작, 안 넣어도 같다. |
| CSP | `next.config.ts` 의 판단(정적 렌더 유지)이 타당. |
| `title.template` 리팩토링 | 결과 HTML 이 같다. |
| 사이트맵 `lastModified`/`priority` | 8개 URL 에는 신호가 없다. |
| router 의 `MARKETS` 복제 | 파일 주석대로 빌드 스텝보다 싼 의존. |
| `x-default` → apex | Google 허용 용법, 라이브에서 경로까지 살아 있음. |
| OG 이미지 | 디자인 자산 필요 (D-2). |
| 다크 모드, 디자인, 섹션 순서 | 지시. |
| `Experiences`/`Certifications` 라벨 | 콘텐츠(작업 계획서 A2). |
| dev 서버 재기동 | 지시. `next start` 를 다른 포트에 잠깐 쓴다. |
| `SectionLabel` 의 `id` 를 필수로 | 지금 모든 호출이 id 를 넘겨서 잃는 게 없고, 하위 라벨을 다시 쓸 여지를 남긴다. |
| `output: "export"` + 정적 자산만 올리는 Worker | 서버가 없어지면 이번 P0 같은 캐시·배포 순서 문제가 사라지지만, `next/image` 가 IMAGES 바인딩을 타고 `headers()` 를 `_headers` 로 옮겨야 한다. 별도 검토 항목으로 기록(OV 전략 노트). |
| apex 의 `includeSubDomains; preload` HSTS | 되돌릴 수 없는 결정이라 사용자 몫. apex 는 `max-age` 만(D18). |
| `/go/*` 에 `x-robots-tag` | 본문 없는 302 에는 무의미(D19). `?geo` 에만 단다. |
| `apps/kr/src/content/slugs.test.ts` 위치 | turbo 캐시가 jp 변경을 못 본다(D20). 루트 작업으로 옮김. |

---

## 3. 사용자 결정 (자동 선택은 `(recommended)`)

- **D-1 스킵 링크·404 문구의 위치.** (a) `(recommended)` 앱 레이아웃·`not-found.tsx` 에 상수로 둔다 — `portfolio.ts` 가 별도 검토 중이라 줄 번호를 흔들지 않는다. 나중에 `portfolio.ts` 로 옮기기 쉽다. (b) `portfolio.ts` 끝에 새 export 추가. 문구(초안, 사용자 검토 대상): kr "본문으로 건너뛰기" / "페이지를 찾을 수 없습니다." / "홈으로", jp 「本文へ移動」 / 「ページが見つかりません。」 / 「ホームへ」.
- **D-2 OG 이미지.** 1200×630 PNG 한 장(마켓별 또는 공용)을 주면 `app/opengraph-image.png` 로 넣는다. 없으면 텍스트 카드만 뜬다.
- **D-3 apex http→https.** Cloudflare 존 설정 "Always Use HTTPS" 를 켜야 `http://ballbot.dev` 가 같은 호스트 https 로 먼저 간다(HSTS preload 제출 요건). 코드로는 못 한다.
- **D-4 P0 검증.** `apps/kr` 에서 `npm run preview` → `curl -I http://localhost:8787/projects/cosmonote` 가 200 인지 확인한 뒤 배포. 이 세션은 preview 를 실행하지 않는다.

---

## 4. 구현 순서

1. P0-1 `open-next.config.ts` ×2
2. P1-1/P1-2 `markets.ts` 헬퍼 + 테스트, 스토리 페이지 ×4, 사이트맵 ×2, 레이아웃 ×2
3. P2-1 JSON-LD (레이아웃 ×2)
4. P1-3 스킵 링크 (레이아웃 ×2, page.tsx ×2, project-story, experience-story, theme.css)
5. P2-2 `not-found.tsx` ×2
6. P2-3 `headingAs="h4"`
7. P1-4 `preload` (screen-slider, image-placeholder)
8. P2-4 router + 테스트
9. P2-6 슬러그 테스트, P2-5 README
10. `npm run lint` · `typecheck` · `test` · `build` → `next start :7780/:7781` → `$B` 로 홈·스토리 확인 → 서버 내림

---

# /plan-eng-review — 리뷰 기록 (2026-09-26)

**대상.** 이 문서(`docs/tech-review-2026-09-26.md`), 호출 인자로 명시됨. 브랜치 `main`, HEAD `d9e28b4`, REPO_MODE solo.
**질문 처리.** 이 세션에는 AskUserQuestion 도구가 없고 사람이 읽지 않는다. 오케스트레이터 지시대로 모든 결정 브리프는 `(recommended)` 옵션을 자동 선택했고, 파괴적·되돌리기 어려운 옵션은 없었다. 각 브리프는 아래 결정 장부에 그대로 남긴다.
**적용한 이전 학습.** `bash-tool-coreutils-not-found` (coreutils 절대 경로), `portfolio3-dev-ports` (:7770/:7771 재사용 — 이번엔 내려가 있어 `next start` 별도 포트), `portfolio3-next-image-cold-stampede` (스토리 첫 로드의 /_next/image 500 은 콘텐츠 버그가 아님), `portfolio3-no-prettier` (prettier 돌리지 말 것, 탭 유지).
**설계 문서.** 없음. `/office-hours` 선행 제안은 건너뜀(D1) — 기존 사이트의 기술 감사라 기능 설계 문서가 만들어 줄 입력이 없다.
**웹 리서치.** Aside 없음, WebSearch 는 쓰지 않음 — 근거는 전부 `node_modules` 의 Next 16.3.4 문서·OpenNext 1.20.6 소스·wrangler 4.129 소스와 라이브 `curl` 이다. "Search unavailable — proceeding with in-distribution knowledge only."

## Step 0 — Scope Challenge

### A. 평가

- **이미 있는 것.** `packages/shared/src/markets.ts` 가 호스트·`LANGUAGE_ALTERNATES` 를 한 곳에 둔다(홈 전용). OpenNext 가 `staticAssetsIncrementalCache` 를 내장한다 **[Layer 1]**. Next 가 `not-found.tsx` 규약, `preload` prop, `robots`/`sitemap` 규약을 내장한다 **[Layer 1]**. router 는 `node --test` 테스트 12개가 이미 있다. 스킵 링크는 CSS 로 충분하다(JS 불필요) **[Layer 1]**.
- **최소 변경.** P0 는 설정 두 줄. P1 은 헬퍼 한 개 + 호출 8곳. 나머지는 각각 한 파일 안의 작은 diff.
- **복잡도.** 손대는 파일 약 24개(설정 2, shared 6, kr 앱 8, jp 앱 7, router 2, README, 루트 스크립트 1). 새 클래스·서비스 0. **8+ 파일 → B 게이트 발동.**
- **검색.** 새 아키텍처 패턴 없음 — 전부 프레임워크 내장 기능 사용.
- **TODOS.md.** 없음.
- **완전성.** 테스트를 붙일 수 있는 곳(markets 헬퍼, router, 슬러그 짝, 라이브 스모크)에는 전부 붙인다.
- **배포 경로.** 새 산출물은 `.open-next/assets/cdn-cgi/_next_cache/*` (populateCache 가 `deploy`·`upload` 양쪽에서 복사 — `cli/commands/deploy.js:22`, `upload.js:23` 확인). CI 없음, `npm run deploy` 수동.

### B. 복잡도 선택 (게이트 발동)

기능 삭제·연기 제안 없음(완전성 원칙). 구조 질문만.

**D2 결과 — 구조: A) Original arrangement 채택.** 기능 답: 없음(삭제 제안 없음); 구조: A (auto, recommended); accepted scope: 계획서 4절 1~10 전체; pending remedies: D3~D16 (아래에서 각각 결정).

### C. 발견 사항

1. **[P0] (10/10)** P0-1 은 이 세션에서 끝까지 검증할 수 없다(`preview`/deploy 금지). 처리: 코드 변경 + 사용자 검증 절차(계획서 D-4). 보류 중인 remedy 없음(절차 사실).
2. **[P2] (9/10)** 슬러그 짝 테스트가 `apps/kr` 에서 `apps/jp` 파일을 상대 경로로 읽는다 — 앱 간 결합. → D14 에서 결정.
3. **[P3] (8/10)** TODOS.md 없음. 미구현 항목은 이 문서에 기록. → D17.

## 1. Architecture review

- **ARCH-1 [P0] (9/10)** `apps/kr/open-next.config.ts:3` `export default defineCloudflareConfig({` — `incrementalCache` 없음 → `dist/api/config.js:45` `function resolveIncrementalCache(value = "dummy")`. 프리렌더 결과 `apps/kr/.open-next/cache/d13fbPBA-uNEVwnF9qNAM/projects/cosmonote.cache` 는 존재하지만 `.open-next/assets/cdn-cgi` 는 없다. 라이브 404 와 일치. → **D3**.
- **ARCH-2 [P2] (8/10)** 배포 시 실패 모드: `populateStaticAssetsIncrementalCache` (`populate-cache.js:532`) 는 `cpSync(outputDir/cache → assets/cdn-cgi/_next_cache)` 뿐이라, 빌드가 캐시를 안 만들었거나 buildId 가 어긋나면 Worker 는 **조용히** 다시 404 를 낸다. 지금 이 P0 가 며칠간 안 보인 게 그 증거. → **D4** (라이브 스모크 스크립트).
- **ARCH-3 [P1] (9/10)** `apps/kr/src/app/projects/[slug]/page.tsx:43` `alternates: { canonical: path },` — 얕은 병합으로 레이아웃의 `languages` 유실(`generate-metadata.md` Merging 절 인용: "nested fields such as openGraph and robots that are defined in an earlier segment are overwritten by the last segment"). 같은 줄 `:44` `openGraph: { title: project.title, description, url: path, type: "article" }` 가 `locale` 유실. → **D5**.
- **ARCH-4 [P2] (8/10)** `apps/router/src/index.ts:124-131` `/go/*` 응답 헤더에 `x-robots-tag` 없음; `:37-40` `NO_STORE` 에 HSTS 없음. 라이브 `https://ballbot.dev/` 응답에 `strict-transport-security` 부재 확인. → **D6**.
- **ARCH-5 [P3] (8/10)** 경로별 `x-default` 는 `index.ts:97-102` `carry()` 에 기댄다 — 라이브 `https://ballbot.dev/projects/cosmonote?x=1` → `https://kr.ballbot.dev/projects/cosmonote?x=1` 확인. 변경 없음.
- **ARCH-6 [P3] (7/10)** HSTS preload 제출 요건 중 "apex http→https 같은 호스트" 는 존 설정. 사용자 결정(계획서 D-3). 미해결로 남김.
- **보안 경계.** 변경은 응답 헤더·메타데이터·정적 캐시뿐. 인증·데이터 접근 없음. JSON-LD 는 `JSON.stringify(...).replace(/</g, "\\u003c")` 로 삽입.

핵심 흐름 다이어그램(수정 후):

```
deploy: next build ──► .next/server/app/**/*.html + prerender-manifest
        opennextjs-cloudflare build ──► .open-next/cache/<buildId>/**/*.cache
        populateCache(static-assets) ──► .open-next/assets/cdn-cgi/_next_cache/<buildId>/**   (D3)
        wrangler deploy ──► Worker + assets

request /projects/cosmonote
  ──► Next (minimal) ──► incrementalCache.get("projects/cosmonote")
        ──► ASSETS.fetch("http://assets.local/cdn-cgi/_next_cache/<buildId>/projects/cosmonote.cache")
              ├─ 200 → HTML+RSC 그대로 응답 (s-maxage 유지)
              └─ 404 → dynamicParams=false → 404   ← D4 스모크가 배포 직후 잡는다
```

**D3~D6 결과.** 전부 A (auto, recommended). 장부는 아래.

## 2. Code quality review

- **CQ-1 [P1] (9/10)** `apps/kr/src/app/layout.tsx:88-92` `<body className="antialiased">{children}…` — 스킵 링크 없음. `apps/kr/src/app/page.tsx:48` `<main>`, `project-story.tsx:133` `<main className="flex min-h-svh flex-col">`, `experience-story.tsx:37` 동일 — id 없음. → **D7** (스킵 링크), **D8** (문구 위치).
- **CQ-2 [P2] (9/10)** `apps/kr/src/app/` 에 `not-found.tsx` 없음(파일 목록 확인). 라이브 404 본문에 `<title>` 두 개. → **D9**. 엣지: not-found 페이지에도 스킵 링크 대상이 있어야 하므로 `<main id="main">` 으로 감싼다.
- **CQ-3 [P2] (9/10)** `project-story.tsx:54` `<h3 …>{essay.title}</h3>` 와 `:60` `<StoryBody body={essay.body} title={title} labels={labels} />`; `story-body.tsx:146` `headingAs: Heading = "h3"` → 소제목이 에세이 제목과 같은 레벨. → **D10**.
- **CQ-4 [P1] (9/10)** `screen-slider.tsx:146` `loading={Math.abs(slide - index) <= 1 ? "eager" : "lazy"}` — 첫 장 preload 없음. `image-placeholder.tsx:10` `priority?: boolean;` — Next 16 deprecated (`image.md:291-293`), 호출자 없음. → **D11**.
- **CQ-5 [P2] (8/10)** `layout.tsx:68-87` `<head>` 에 icon·stylesheet·watchdog script 뿐, JSON-LD 없음. 엣지: `hero.actions.secondary` 가 비거나 전부 자리표시자면 `sameAs` 키를 생략. → **D12**.
- **CQ-6 [P2] (9/10)** `README.md:49-52` "Resume delivery is off until the mailbox is wired: `/api/resume` answers `503`…" — 라우트 삭제됨(코드 grep 결과 없음). → **D13**.
- **CQ-7 [P2] (8/10)** 슬러그 짝 보장 없음(`sitemap.ts:19-22` 는 자기 마켓만 본다). → **D14**.
- **공유 코드 평가 (D5 헬퍼).** 호출자(실존): `apps/kr/src/app/layout.tsx:43-46` `alternates: { canonical: "/", languages: LANGUAGE_ALTERNATES }`, `apps/jp/src/app/layout.tsx:46-49` 동일, `apps/kr/src/app/sitemap.ts:15-18` `alternates: { languages: LANGUAGE_ALTERNATES }`, `apps/jp/src/app/sitemap.ts:15-18`. 제안 호출자: 스토리 페이지 4개(ARCH-3 요구). 계약: `languageAlternates(path = "/") → { ko, ja, "x-default" }`, `openGraphBase(locale) → { siteName, locale, alternateLocale }`, 순수 함수. 규모: markets.ts +18줄(구현) / 테스트 +30줄; 인라인 대안은 페이지·사이트맵 6곳 × 약 6줄 = 36줄 + 사이트맵 map 안 3줄 × 2. 구현 순절감 약 20줄, 호스트 변경 지점 1곳. 실패 반경: 헬퍼 오류는 두 빌드의 모든 hreflang 에 번지지만 테스트 4개가 막는다.
- **부채·취약성.** 텍스트 기반 슬러그 테스트는 `slug: "…"` 표기에 묶인다 — 테스트 안에 그 가정을 적는다. `not-found.tsx` 는 `metadata` export 불가(문서) — 제목은 레이아웃 것.

**D7~D14 결과.** 전부 A (auto, recommended). 장부는 아래.

## 3. Test review

프레임워크: `node --test` (router `package.json` `"test": "node --test \"src/**/*.test.ts\""`, Node v24.19.0 타입 스트리핑). 컴포넌트(.tsx)는 node 가 못 돌리므로 페이지·사이트맵·컴포넌트 변경은 빌드 후 `curl`/`$B` 와 라이브 스모크로 본다.

```
CODE PATHS                                                      USER FLOWS
[+] packages/shared/src/markets.ts                              [+] 크롤러 — 스토리 페이지
  ├── marketUrl(locale, path)                                     ├── [GAP] [→E2E] /projects/x 200 + canonical + hreflang×3 — check-live (D4/D16)
  │   ├── [GAP] path 기본값 "/" → https://kr.ballbot.dev/          ├── [GAP] [→E2E] /sitemap.xml 항목마다 xhtml:link×3 — build curl
  │   └── [GAP] 중첩 경로 → …/projects/x                           └── [GAP] [→E2E] og:locale / og:locale:alternate / og:site_name — build curl
  ├── languageAlternates(path)                                  [+] apex
  │   ├── [GAP] 3키(ko/ja/x-default) + x-default=apex+path        ├── [GAP] [→E2E] https://ballbot.dev/ → 302 kr, no-store — check-live
  │   └── [GAP] LANGUAGE_ALTERNATES === languageAlternates("/")     └── [GAP] [→E2E] /go/ja → 302 + set-cookie + x-robots-tag — check-live
  └── openGraphBase(locale)                                     [+] 키보드 사용자
      ├── [GAP] locale ko_KR / ja_JP                               ├── [GAP] Tab 1회 → 스킵 링크 표시 → Enter → main 포커스 — $B/수동
      └── [GAP] alternateLocale 가 자기 자신을 제외                 └── [GAP] not-found 에서도 스킵 링크 대상 존재 — curl 404 본문
[+] apps/router/src/index.ts                                    [+] 404
  ├── /go/(ko|ja) ── [★★★ TESTED] :72-81 + [GAP] x-robots-tag        ├── [GAP] [→E2E] /projects/nope → 404 + 마켓 언어 문구 — next start curl
  ├── ?geo ──────── [★★★ TESTED] :95-100 + [GAP] x-robots-tag        └── [GAP] [→E2E] 스토리 ↔ 홈 링크 왕복 — $B
  ├── www 301 ───── [★★  TESTED] :89-93 + [GAP] HSTS              [+] LCP
  └── 302 market ── [★★★ TESTED] :59-70 + [GAP] HSTS                └── [GAP] [→E2E] /projects/healix 에 <link rel=preload as=image> — build curl
[+] apps/kr/src/content/slugs.test.ts (신규)
  └── [GAP] kr/jp slug 집합 동일 (텍스트 파싱, 빈 집합이면 실패)
[+] scripts/check-live.mjs (신규, 실행은 사용자)
  └── [GAP] [→E2E] 사이트맵 URL 전부 200 + canonical + hreflang×3; apex 302; /go 헤더

COVERAGE: 4/24 paths tested (17%)  |  Code paths: 4/12 (33%)  |  User flows: 0/12 (0%)
QUALITY: ★★★:3 ★★:1  |  GAPS: 20 (10 E2E, 0 eval)
```

Legend: ★★★ behavior + edge + error | ★★ happy path | ★ smoke check | [→E2E] = needs integration test

**회귀 계약 (IRON RULE, D16).** 스토리 페이지 메타데이터를 손대므로 보존할 기존 동작: `canonical` = 자기 경로, `<title>` = `${제목} | ballbot.dev`, `description`, `og:type=article`, `og:url`. 의도한 차이: `hreflang` 3개, `og:locale`, `og:locale:alternate`, `og:site_name` 추가. 수용 기준: 빌드 후 `curl` 로 kr/jp 스토리 페이지 각 1개의 위 태그 확인 + `check-live.mjs` 가 사이트맵의 모든 URL 에서 canonical·hreflang×3 을 확인.

**D15 (단위 테스트 범위) · D16 (회귀 계약) 결과.** 전부 A (auto, recommended). 테스트 계획 아티팩트: `~/.gstack/projects/bb2002-ballbot-portfolio3/ballbot-main-eng-review-test-plan-20260926-003605.md`.

LLM/eval 범위: 해당 없음.

## 4. Performance review

- **PERF-1 [P3] (8/10)** 정적 자산 캐시로 바꾸면 `/` 도 요청마다 SSR 하던 것(라이브 `cache-control: s-maxage=31536000` 경로)이 `ASSETS.fetch` 한 번으로 바뀐다 — 개선. `assets.fetch` 는 Worker 내부 호출이라 네트워크 왕복이 아니다.
- **PERF-2 [P3] (9/10)** JSON-LD 약 0.5KB, 스킵 링크 한 줄, preload `<link>` 한 줄 — 무시할 수준.
- **PERF-3 [P3] (7/10)** `cdn-cgi/_next_cache` 로 캐시 파일 약 12개(HTML+RSC, 합계 수 MB 이하)가 자산 업로드에 더해진다. Workers 정적 자산 한도(파일 20,000개, 25MiB/파일)에 한참 못 미친다.
- N+1·DB 없음. 결정 없음.

## Decision ledger

> 공통: 이 세션은 AskUserQuestion 이 없어 각 브리프의 `(recommended)` 를 자동 선택했다(오케스트레이터 지시). "Actual answer" 의 `auto` 는 그 뜻이다. 브랜치 `main`.

### R0: /office-hours 선행 여부
Finding: 설정 — 설계 문서 없음(Design Doc Check "No design doc found")
Plan baseline: 없음(설정 질문)
Runtime evidence: 해당 없음
Comparison grid:

| Choice | Current | A | B |
|---|---|---|---|
| R0 선행 스킬 | 없음 | /office-hours 실행 후 리뷰 | 바로 표준 리뷰 |

Question D1:
D1 — 리뷰 전에 /office-hours 를 돌릴까?
Project/branch/task: ballbot-portfolio3 `main`, 기술 리뷰 계획서 검토.
ELI10: /office-hours 는 "무엇을 왜 만드나" 를 정리하는 문서를 만든다. 이번 대상은 새 기능이 아니라 이미 있는 사이트의 결함 목록이라, 그 문서가 줄 새 입력이 없다.
Stakes if we pick wrong: 10분을 쓰고도 리뷰 입력이 같다.
Recommendation: B because 대상이 기능 설계가 아닌 기술 감사다.
Note: options differ in kind, not coverage — no completeness score.
Pros / cons:
A) Run /office-hours now
  ✅ 문제 정의·대안 탐색이 구조화된 문서로 남아 후속 리뷰 입력이 선명해진다
  ✅ 전제(예: "정적 사이트여야 한다")를 명시적으로 다시 묻는다
  ❌ 이 계획서는 이미 근거·대안·바꾸지 않을 것을 담고 있어 중복이다
B) Skip — proceed with standard review (recommended)
  ✅ 계획서의 라이브 증거와 소스 인용을 바로 리뷰한다
  ✅ 세션 시간이 코드 변경과 검증에 간다
  ❌ 전제 재검토는 리뷰 본문 안에서만 이뤄진다
Net: 설계 문서가 더해 줄 게 없는 감사에는 표준 리뷰가 맞다.
Header: 선행 스킬
Options:
A) Run /office-hours now
/office-hours 를 인라인 실행해 설계 문서를 만든 뒤 리뷰를 이어간다.
B) Skip — proceed with standard review
설계 문서 없이 표준 리뷰를 진행한다.

State: approved
Actual answer: B (auto, recommended)
Accepted scope: 표준 리뷰 진행
History: 없음

### R1: 구조 — 파일 배치
Finding: Scope Challenge B — 24개 파일, 새 클래스 0
Plan baseline: 계획서 4절의 원안 배치(헬퍼는 shared, 나머지는 각 앱·컴포넌트)
Runtime evidence: `packages/shared/src/markets.ts` 가 이미 두 앱 6곳에서 import 됨
Comparison grid:

| Choice | Current | A | B |
|---|---|---|---|
| R1 배치 | 원안 | shared 헬퍼 + 앱별 파일 + 테스트 3종 + 스모크 스크립트 | 헬퍼를 각 앱에 인라인, 슬러그 테스트·스모크 생략 |
| 기능 목록 | 계획서 1~10 | 동일 | 동일(테스트만 축소) |
| 보류 remedy | D3~D16 | 미결 | 미결 |

Question D2:
D2 — 파일 배치: 원안 대로 갈까, 더 작게 갈까?
Project/branch/task: ballbot-portfolio3 `main`, 기술 리뷰 구현 범위.
ELI10: 24개 파일을 건드린다. 대부분은 두 마켓에 같은 변경을 한 번씩 하는 것이라 파일 수가 많아 보일 뿐이고, 공유 헬퍼 하나가 8곳의 중복을 막는다. 더 작게 가면 헬퍼를 각 앱에 복붙하고 테스트를 줄이게 된다.
Stakes if we pick wrong: 헬퍼를 인라인하면 호스트가 바뀔 때 8곳을 고쳐야 하고, 테스트를 줄이면 이번 P0 같은 조용한 404 를 또 놓친다.
Recommendation: A because 파일 수는 두 마켓 대칭 때문이고, 공유 헬퍼와 테스트가 오히려 변경을 줄인다.
Completeness: A=10/10, B=6/10
Pros / cons:
A) Original arrangement (recommended)
  ✅ hreflang·og 값이 `markets.ts` 한 곳에서 나와 두 빌드가 어긋날 수 없다 (human: ~1일 / CC: ~40분)
  ✅ 슬러그 짝 테스트와 라이브 스모크가 배포 후 404 를 기계적으로 잡는다
  ❌ 새 파일 5개(테스트 3, not-found 2)와 루트 스크립트 1개가 늘어난다
B) Smaller arrangement
  ✅ shared 를 건드리지 않아 diff 가 앱 안에 머문다
  ✅ 새 파일이 not-found 2개뿐이다
  ❌ 같은 3키 맵을 6곳에 복붙하고, 마켓 간 슬러그 불일치를 잡을 방법이 없다
Net: 파일 수를 줄이는 대신 중복과 사각지대를 산다 — 이 저장소의 "한 곳에 쓴다" 원칙과 반대다.
Pending remedies not decided here: D3~D16.
Header: 파일 배치
Options:
A) Original arrangement
`packages/shared/src/markets.ts`(헬퍼 + `markets.test.ts`), `packages/shared/package.json`(test 스크립트), `apps/{kr,jp}/open-next.config.ts`, `apps/{kr,jp}/src/app/{layout,sitemap,not-found,page}.tsx`, `apps/{kr,jp}/src/app/{projects,experience}/[slug]/page.tsx`, `packages/shared/src/components/{project-story,experience-story}.tsx`, `packages/shared/src/components/ui/{screen-slider,image-placeholder}.tsx`, `packages/shared/styles/theme.css`, `apps/router/src/index.ts` + `index.test.ts`, `apps/kr/src/content/slugs.test.ts` + `apps/kr/package.json`, `scripts/check-live.mjs` + 루트 `package.json`, `README.md`.
B) Smaller arrangement
위에서 `markets.ts` 변경·`markets.test.ts`·`slugs.test.ts`·`check-live.mjs` 를 빼고 맵을 각 앱 파일에 인라인.

State: approved
Actual answer: A (auto, recommended)
Accepted scope: A 의 파일 목록 전체; 각 remedy 는 D3~D16 에서 개별 승인
History: 없음

### R2: P0 — incremental cache 선택
Finding: ARCH-1 [P0] (9/10) `apps/kr/open-next.config.ts:3`, `apps/jp/open-next.config.ts:3`
Plan baseline: 계획서 P0-1 제안(staticAssetsIncrementalCache)
Runtime evidence: 라이브 `/projects/cosmonote` 404 (kr·jp), `.open-next/cache/**/*.cache` 존재, `.open-next/assets/cdn-cgi` 부재, `config.js:45` 기본값 dummy
Comparison grid:

| Choice | Current | A | B | C |
|---|---|---|---|---|
| R2 캐시 | dummy | static-assets (읽기 전용, populateCache 가 assets 로 복사) | R2 incremental cache (버킷+바인딩 추가) | `dynamicParams = true` 로 요청 시 렌더 |
| wrangler 변경 | 없음 | 없음 | `r2_buckets` 추가 + 버킷 생성 | 없음 |
| 프리렌더 사용 | 아니오 | 예 | 예 | 아니오(매 요청 SSR) |

Question D3:
D3 — 스토리 페이지 404 를 어떤 캐시로 고칠까?
Project/branch/task: ballbot-portfolio3 `main`, P0 배포 결함.
ELI10: 빌드는 스토리 페이지 HTML 을 다 만들어 두는데, Worker 가 그걸 꺼내 볼 서랍(incremental cache)이 "없음" 으로 설정돼 있다. 서랍이 비어 있으면 Next 는 "그런 페이지 없음" 이라고 답한다. 서랍을 정적 자산으로 두면 배포 때 HTML 이 같이 올라간다.
Stakes if we pick wrong: 프로젝트·경험 페이지 8개가 계속 404 — 채용 담당자가 카드를 눌러도 아무것도 못 본다.
Recommendation: A because 재검증이 없는 완전 정적 사이트에 맞는 내장 옵션이고 새 바인딩이 없다.
Completeness: A=10/10, B=9/10, C=6/10
Pros / cons:
A) staticAssetsIncrementalCache (recommended)
  ✅ `wrangler.jsonc` 무변경, `deploy`/`upload` 가 populateCache 로 자동 복사 (human: ~1h / CC: ~5분)
  ✅ 읽기 전용이라 캐시가 오염되거나 비용이 생길 경로가 없다
  ❌ ISR/revalidate 를 나중에 쓰려면 다른 캐시로 갈아타야 한다(지금은 안 쓴다)
B) R2 incremental cache
  ✅ OpenNext 템플릿 기본형이라 문서가 가장 많다
  ✅ 나중에 ISR 을 켤 수 있다
  ❌ 버킷 생성·바인딩·`populateCache remote` 업로드가 배포마다 붙고, 이 사이트는 재검증을 쓰지 않는다
C) `dynamicParams = true`
  ✅ 설정 무변경, 알 수 없는 슬러그는 `notFound()` 로 처리된다
  ✅ 캐시 계층 없이 동작이 단순하다
  ❌ 8개 페이지가 매 요청 SSR 이 되고, 프리렌더 결과는 버려진다
Net: 정적 사이트에 정적 캐시. 재검증이 필요해지는 날 B 로 옮기면 된다.
Header: 캐시 종류
Options:
A) staticAssetsIncrementalCache
두 앱 `open-next.config.ts` 에 `incrementalCache: staticAssetsIncrementalCache` (import `@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache`). 주석에 이유(왜 dummy 가 404 를 냈는지)를 적는다.
B) R2 incremental cache
`r2IncrementalCache` + `wrangler.jsonc` `r2_buckets` + 버킷 생성.
C) dynamicParams = true
4개 `[slug]/page.tsx` 의 `dynamicParams` 를 `true` 로.

State: approved
Actual answer: A (auto, recommended)
Accepted scope: A 그대로. 검증은 사용자가 `npm run preview` 로(계획서 D-4).
History: 없음

### R3: 배포 후 라이브 스모크
Finding: ARCH-2 [P2] (8/10) `populate-cache.js:532-536`
Plan baseline: 계획서에 없던 항목(리뷰에서 추가 제안)
Runtime evidence: 스토리 404 가 사이트맵과 함께 며칠 배포돼 있었음(라이브 확인)
Comparison grid:

| Choice | Current | A | B | C |
|---|---|---|---|---|
| R3 스모크 | 없음 | `scripts/check-live.mjs` (사이트맵 URL 전부 200 + canonical + hreflang×3, apex 302, /go 헤더) + 루트 `check:live` 스크립트 | README 에 수동 curl 체크리스트 | 연기 |
| 실행 시점 | — | 사용자가 배포 직후 수동 실행 | 수동 | — |

Question D4:
D4 — 배포 뒤 "다 살아 있나" 를 스크립트로 확인할까?
Project/branch/task: ballbot-portfolio3 `main`, 배포 검증.
ELI10: 이번 404 는 사이트맵이 멀쩡해서 아무도 몰랐다. 배포 직후 사이트맵의 URL 을 전부 열어 200 인지, hreflang 이 3개인지, apex 가 302 인지 확인하는 40줄짜리 스크립트를 두면 같은 사고가 몇 초 만에 드러난다.
Stakes if we pick wrong: 다음 배포에서 같은 종류의 조용한 404 가 다시 며칠 숨는다.
Recommendation: A because 사고의 재발 방지 장치이고 의존성 없이 `fetch` 만 쓴다.
Completeness: A=10/10, B=5/10, C=0/10
Pros / cons:
A) check-live.mjs 추가 (recommended)
  ✅ 배포 후 `npm run check:live` 한 번으로 8개 스토리 + hreflang + apex 를 기계적으로 검사한다 (human: ~2h / CC: ~10분)
  ✅ 회귀 계약(D16)의 수용 기준을 코드로 고정한다
  ❌ 루트에 스크립트 파일과 npm 스크립트가 하나씩 는다
B) README 체크리스트
  ✅ 코드가 늘지 않는다
  ✅ 무엇을 봐야 하는지는 남는다
  ❌ 사람이 잊으면 끝이고, 8개 URL 을 손으로 돌려야 한다
C) 연기
  ✅ 지금 diff 가 줄어든다
  ✅ 없음
  ❌ 재발 방지책이 없다
Net: 3am 의 사람 대신 스크립트가 본다.
Header: 라이브 스모크
Options:
A) check-live.mjs 추가
`scripts/check-live.mjs`(Node 24 `fetch`, 인자 없이 두 마켓 + apex) + 루트 `package.json` `"check:live"`. README 에 한 줄.
B) README 체크리스트
README "Deploying" 에 curl 명령 목록.
C) 연기
아무것도 안 함.

State: approved
Actual answer: A (auto, recommended)
Accepted scope: A. 이 세션에서 스크립트를 라이브에 한 번 실행해 현재 상태(404) 를 잡아내는지 본다(읽기 전용 GET).
History: 없음

### R4: hreflang / og 헬퍼
Finding: ARCH-3 [P1] (9/10) `apps/{kr,jp}/src/app/{projects,experience}/[slug]/page.tsx:43-44`, `sitemap.ts:19-22`
Plan baseline: 계획서 P1-1, P1-2
Runtime evidence: 라이브 홈에 hreflang 3개·`og:locale` 있음, 스토리는 404 라 미확인(코드상 유실 확실)
Comparison grid:

| Choice | Current | A | B | C |
|---|---|---|---|---|
| R4 hreflang 스토리 | 없음 | `languageAlternates(path)` 헬퍼 → 페이지 4곳 + 사이트맵 2곳 | 각 파일에 3키 맵 인라인 | 없음 유지 |
| R4 og locale/siteName | 스토리에서 유실 | `openGraphBase(locale)` 헬퍼 → 레이아웃 2 + 페이지 4 | 인라인 | 유지 |
| 홈 URL 표기 | `https://kr.ballbot.dev` | 헬퍼가 `…/` 로 통일 | 그대로 | 그대로 |

Question D5:
D5 — 스토리 페이지 hreflang·og 를 어떻게 채울까?
Project/branch/task: ballbot-portfolio3 `main`, SEO 결함 P1-1/P1-2.
ELI10: 페이지가 자기 `alternates`/`openGraph` 를 쓰면 레이아웃 것은 통째로 사라진다(Next 병합은 얕다). 그래서 스토리 페이지엔 "이 글의 일본어판은 여기" 표시와 `og:locale` 이 없다. 경로를 받는 헬퍼 하나로 8곳을 채운다.
Stakes if we pick wrong: 크롤러가 kr/jp 스토리를 별개 문서로 보고, 공유 카드에 언어 정보가 빠진다.
Recommendation: A because 호스트가 한 곳에 있어야 두 빌드가 어긋나지 않고, 테스트를 붙일 수 있다.
Completeness: A=10/10, B=8/10, C=2/10
Pros / cons:
A) markets.ts 헬퍼 (recommended)
  ✅ `languageAlternates`·`openGraphBase` 를 node 테스트 4개로 고정하고 8곳이 같은 값을 쓴다 (human: ~3h / CC: ~15분)
  ✅ `LANGUAGE_ALTERNATES` 는 `languageAlternates("/")` 로 남아 기존 호출자가 안 깨진다
  ❌ shared 패키지에 `test` 스크립트를 새로 붙인다
B) 인라인
  ✅ shared 무변경
  ✅ 파일마다 값이 눈에 보인다
  ❌ 같은 맵이 6곳에 복붙되고 테스트할 수 없다
C) 유지
  ✅ 변경 없음
  ✅ 없음
  ❌ P1 결함이 남는다
Net: 이 저장소 원칙 그대로 — canonical·hreflang·사이트맵은 한 곳에서 나온다.
Header: hreflang 헬퍼
Options:
A) markets.ts 헬퍼
`marketUrl`, `languageAlternates(path)`, `openGraphBase(locale)` 추가 + `markets.test.ts` + shared `test` 스크립트; 레이아웃·스토리 페이지·사이트맵이 사용.
B) 인라인
각 파일에 맵 리터럴.
C) 유지
변경 없음.

State: approved
Actual answer: A (auto, recommended)
Accepted scope: A 전체
History: 없음

### R5: router 헤더
Finding: ARCH-4 [P2] (8/10) `apps/router/src/index.ts:37-40, :124-131, :139-141`
Plan baseline: 계획서 P2-4
Runtime evidence: 라이브 `/go/ja`·`/` 응답 헤더에 x-robots-tag·HSTS 없음
Comparison grid:

| Choice | Current | A | B | C |
|---|---|---|---|---|
| R5 noindex | 없음 | `/go/*` + `?geo` 에 `x-robots-tag: noindex` | 동일 | 없음 |
| R5 HSTS | 없음 | 모든 router 응답에 마켓과 같은 값 | 없음 | 없음 |
| 테스트 | 12개 | +3 | +2 | 0 |

Question D6:
D6 — apex 응답에 noindex·HSTS 를 붙일까?
Project/branch/task: ballbot-portfolio3 `main`, router Worker.
ELI10: `/go/ja` 는 쿠키를 심고 보내는 기계 장치라 검색에 뜰 이유가 없다. HSTS 는 "이 도메인은 항상 https" 라는 약속인데, 서브도메인은 하는데 apex 는 안 하고 있어 preload 목록 요건에 맞지 않는다.
Stakes if we pick wrong: 검색 결과에 `/go/ja` 가 뜨거나, preload 제출이 거절된다. 둘 다 작지만 확실하다.
Recommendation: A because 헤더 두 줄과 테스트 세 개로 끝나고 부작용이 없다.
Completeness: A=10/10, B=7/10, C=0/10
Pros / cons:
A) noindex + HSTS (recommended)
  ✅ 마켓 빌드와 apex 의 HSTS 값이 같아져 preload 요건의 코드 쪽 절반을 채운다 (human: ~1h / CC: ~5분)
  ✅ `/go/*`·`?geo` 가 색인 후보에서 빠진다
  ❌ HSTS 는 http 응답에서는 무시된다(해는 없다)
B) noindex 만
  ✅ 최소 변경
  ✅ 색인 문제는 해결
  ❌ apex HSTS 부재가 남는다
C) 유지
  ✅ 변경 없음
  ✅ 없음
  ❌ 둘 다 남는다
Net: 상수 하나를 응답 셋에 펼치는 일이다.
Header: router 헤더
Options:
A) noindex + HSTS
`NOINDEX`·`HSTS` 상수 추가, `/go`·`?geo` 에 noindex, 세 응답 모두 HSTS; 테스트 3개.
B) noindex 만
`/go`·`?geo` 에 noindex; 테스트 2개.
C) 유지
변경 없음.

State: approved
Actual answer: A (auto, recommended)
Accepted scope: A 전체
History: 없음

### R6: 스킵 링크
Finding: CQ-1 [P1] (9/10) `apps/{kr,jp}/src/app/layout.tsx:88-92`; `<main>` 3곳
Plan baseline: 계획서 P1-3
Runtime evidence: 라이브 홈 HTML 에 `skip` 문자열 없음, 첫 포커스는 히어로 버튼
Comparison grid:

| Choice | Current | A | B |
|---|---|---|---|
| R6 스킵 링크 | 없음 | `<a href="#main" class="skip-link">` (body 첫 자식) + `.skip-link` CSS + `id="main"` 4곳(홈 2, 스토리 2 + not-found) | 없음 유지 |

Question D7:
D7 — 스킵 링크를 넣을까?
Project/branch/task: ballbot-portfolio3 `main`, 접근성.
ELI10: 키보드로만 쓰는 사람은 Tab 을 눌러 링크를 하나씩 지난다. 첫 Tab 에 "본문으로" 링크가 나오면 히어로와 nav 를 건너뛸 수 있다. CSS 만으로 되고, 보이지 않다가 포커스 때만 나타난다.
Stakes if we pick wrong: 키보드·스크린리더 사용자가 페이지마다 링크 7개를 지나야 본문에 닿는다.
Recommendation: A because WCAG 2.4.1 의 표준 해법이고 코드가 열 줄이다.
Completeness: A=10/10, B=0/10
Pros / cons:
A) 스킵 링크 추가 (recommended)
  ✅ 첫 Tab 에 링크가 보이고 Enter 로 `<main>` 에 간다 — 홈·스토리·404 전부 (human: ~1h / CC: ~10분)
  ✅ 시각적으로는 포커스 전까지 아무것도 바뀌지 않는다(디자인 무변경)
  ❌ `<main>` 에 id 를 붙이는 파일이 4개다
B) 유지
  ✅ 변경 없음
  ✅ 없음
  ❌ P1 접근성 결함이 남는다
Net: 열 줄로 키보드 사용자의 첫 경험이 바뀐다.
Header: 스킵 링크
Options:
A) 스킵 링크 추가
레이아웃 2곳 + theme.css `.skip-link` + `id="main"` (page.tsx 2, project-story, experience-story, not-found 2).
B) 유지
변경 없음.

State: approved
Actual answer: A (auto, recommended)
Accepted scope: A 전체 (문구 위치는 D8)
History: 없음

### R7: 스킵 링크·404 문구의 위치
Finding: CQ-1/CQ-2 부속 — 계획서 결정 D-1
Plan baseline: 계획서 D-1 (a) 앱 레이아웃·not-found 상수
Runtime evidence: `portfolio.ts` 는 작업 계획서가 줄 번호로 참조 중(`work-plan-2026-09-26.md` "줄번호" 절)
Comparison grid:

| Choice | Current | A | B |
|---|---|---|---|
| R7 문구 위치 | — | `layout.tsx`·`not-found.tsx` 상수 | `portfolio.ts` 끝에 새 export + content-types 필드 |
| portfolio.ts 변경 | 없음 | 없음 | 있음(끝에 추가, 줄 번호 무변경) |

Question D8:
D8 — 스킵 링크·404 문구를 어디에 둘까?
Project/branch/task: ballbot-portfolio3 `main`, 카피 위치.
ELI10: 사이트 원칙은 "카피는 content 파일에" 다. 그런데 그 파일은 지금 다른 계획서가 줄 번호로 검토 중이라 손대면 번거롭다. 레이아웃 파일은 이미 설명 문구(`description`)를 들고 있으니 거기 두고, 검토가 끝나면 옮기면 된다.
Stakes if we pick wrong: 콘텐츠 검토 중인 파일을 흔들거나, 카피가 두 곳으로 갈라진다(둘 다 되돌리기 쉽다).
Recommendation: A because 콘텐츠 검토와 충돌하지 않고, 옮기는 비용이 몇 줄이다.
Note: options differ in kind, not coverage — no completeness score.
Pros / cons:
A) 앱 레이아웃·not-found 상수 (recommended)
  ✅ `portfolio.ts` 를 건드리지 않아 콘텐츠 계획서의 줄 번호가 유효하다
  ✅ 레이아웃이 이미 `description` 카피를 드는 자리라 낯설지 않다
  ❌ 카피가 content 파일 밖에 6줄 생긴다(나중에 옮길 것)
B) portfolio.ts export
  ✅ "카피는 content 파일에" 원칙을 지킨다
  ✅ 타입으로 두 빌드가 같은 모양을 강제한다
  ❌ 검토 중인 파일과 `content-types.ts` 를 같이 손댄다
Net: 지금은 충돌 회피, 콘텐츠 검토가 끝나면 B 로 옮기는 게 정답.
Header: 문구 위치
Options:
A) 앱 레이아웃·not-found 상수
kr: "본문으로 건너뛰기" / "페이지를 찾을 수 없습니다." / "홈으로"; jp: 「本文へ移動」 / 「ページが見つかりません。」 / 「ホームへ」. 사용자 검토 대상으로 보고서에 명시.
B) portfolio.ts export
`SiteChrome` 타입 + `siteChrome` export.

State: approved
Actual answer: A (auto, recommended)
Accepted scope: A. 문구는 사용자 검토 대상.
History: 없음

### R8: not-found 페이지
Finding: CQ-2 [P2] (9/10) `apps/{kr,jp}/src/app/` 에 `not-found.tsx` 없음
Plan baseline: 계획서 P2-2
Runtime evidence: 라이브 404 본문 `404: This page could not be found.`, `<title>` 2개
Comparison grid:

| Choice | Current | A | B |
|---|---|---|---|
| R8 404 UI | Next 기본(영문) | 마켓별 `not-found.tsx` (h1 + 홈 링크, `<main id="main">`) | 유지 |

Question D9:
D9 — 마켓 언어의 404 페이지를 만들까?
Project/branch/task: ballbot-portfolio3 `main`, 404.
ELI10: 지금 잘못된 주소로 오면 영어 기본 화면이 뜬다. 한 줄 제목과 홈 링크만 있는 페이지를 마켓 언어로 두면 푸터까지 같은 레이아웃 안에서 뜬다. 상태 코드는 그대로 404 고 noindex 도 Next 가 자동으로 넣는다.
Stakes if we pick wrong: 옛 링크·오타로 온 사람이 영어 에러 화면에서 끝난다.
Recommendation: A because 파일 하나에 열 줄이고 레이아웃이 나머지를 다 해 준다.
Completeness: A=10/10, B=3/10
Pros / cons:
A) not-found.tsx 추가 (recommended)
  ✅ 마켓 언어 제목 + 홈 링크, 푸터·폰트·스킵 링크 대상까지 일관된다 (human: ~1h / CC: ~5분)
  ✅ `<title>` 중복이 사라진다
  ❌ 카피 3줄이 앱 파일에 생긴다(D8)
B) 유지
  ✅ 변경 없음
  ✅ 없음
  ❌ 영문 기본 화면과 `<title>` 두 개가 남는다
Net: 사이트의 마지막 화면도 사이트처럼 보이게 한다.
Header: 404 페이지
Options:
A) not-found.tsx 추가
`apps/{kr,jp}/src/app/not-found.tsx` — `<main id="main">` 안에 h1 + `<a href="/">`.
B) 유지
변경 없음.

State: approved
Actual answer: A (auto, recommended)
Accepted scope: A
History: 없음

### R9: Architecture 소제목 레벨
Finding: CQ-3 [P2] (9/10) `project-story.tsx:54,60`; `story-body.tsx:146`
Plan baseline: 계획서 P2-3
Runtime evidence: 코드 인용대로 h3 아래 h3
Comparison grid:

| Choice | Current | A | B |
|---|---|---|---|
| R9 headingAs | 기본 h3 | Architecture 에서 `headingAs="h4"` | 유지 |

Question D10:
D10 — 에세이 소제목을 h4 로 내릴까?
Project/branch/task: ballbot-portfolio3 `main`, 헤딩 계층.
ELI10: 에세이 제목이 h3 인데 그 안의 소제목도 h3 라 스크린리더 목차에서 형제로 보인다. prop 하나로 h4 가 된다. 화면은 CSS 클래스가 정하므로 안 바뀐다.
Stakes if we pick wrong: 보조기술의 문서 아웃라인이 평평하다(작지만 확실).
Recommendation: A because 한 줄이고 시각 변화가 없다.
Completeness: A=10/10, B=0/10
Pros / cons:
A) headingAs="h4" (recommended)
  ✅ 아웃라인이 h1 › h2(절) › h3(에세이) › h4(소제목)으로 정렬된다
  ✅ 스타일은 클래스가 정하므로 화면 변화 없음
  ❌ 없음에 가깝다 — prop 한 줄
B) 유지
  ✅ 변경 없음
  ✅ 없음
  ❌ 아웃라인 결함이 남는다
Net: 한 줄.
Header: 소제목 레벨
Options:
A) headingAs="h4"
`Architecture` 의 `<StoryBody … headingAs="h4" />`.
B) 유지
변경 없음.

State: approved
Actual answer: A (auto, recommended)
Accepted scope: A
History: 없음

### R10: LCP preload
Finding: CQ-4 [P1] (9/10) `screen-slider.tsx:139-151`; `image-placeholder.tsx:10,25,70,84`
Plan baseline: 계획서 P1-4
Runtime evidence: dev 콘솔 LCP 경고(이전 세션, HEALIX `01-cover-5badd1f3.png`); `image.md:291-293` "priority … deprecated in favor of preload"
Comparison grid:

| Choice | Current | A | B | C |
|---|---|---|---|---|
| R10 첫 슬라이드 | `loading="eager"` | `preload` (loading 제거) | `fetchPriority="high"` + loading 유지 | 유지 |
| `<head>` preload 링크 | 없음 | 있음 | 없음 | 없음 |
| ImagePlaceholder prop | `priority`(미사용) | `preload` 로 개명 | 개명 | 유지 |

Question D11:
D11 — 슬라이더 첫 장을 어떻게 앞당길까?
Project/branch/task: ballbot-portfolio3 `main`, 프로젝트 스토리 LCP.
ELI10: 브라우저는 HTML 을 다 읽고 나서야 첫 화면 이미지를 발견한다. `preload` 는 `<head>` 에 "이 이미지 먼저" 링크를 넣어 그 시간을 없앤다. Next 16 은 예전 `priority` 대신 이 이름을 쓰라고 한다.
Stakes if we pick wrong: 스토리 페이지의 가장 큰 그림이 늦게 뜨고 LCP 점수가 깎인다.
Recommendation: A because 문서가 권하는 현행 API 이고, `loading` 과 겹치지 말라는 주의를 그대로 따른다.
Completeness: A=10/10, B=8/10, C=0/10
Pros / cons:
A) preload (recommended)
  ✅ `<link rel="preload" as="image">` 가 head 에 실려 발견 지연이 사라진다 (human: ~30분 / CC: ~5분)
  ✅ deprecated `priority` 를 코드베이스에서 걷어낸다
  ❌ 첫 장만 `loading` 을 빼는 분기가 한 줄 생긴다
B) fetchPriority="high"
  ✅ 우선순위는 올라간다
  ✅ 분기가 없다
  ❌ head preload 가 없어 발견 자체는 늦다
C) 유지
  ✅ 변경 없음
  ✅ 없음
  ❌ 경고와 LCP 손해가 남는다
Net: 문서의 "LCP 이미지에는 preload" 를 그대로.
Header: LCP preload
Options:
A) preload
`ScreenSlider` 첫 슬라이드에 `preload`, 나머지는 기존 `loading`; `ImagePlaceholder`/`ThumbFrame` 의 `priority` → `preload`.
B) fetchPriority="high"
첫 슬라이드에 `fetchPriority="high"`.
C) 유지
변경 없음.

State: approved
Actual answer: A (auto, recommended)
Accepted scope: A
History: 없음

### R11: JSON-LD
Finding: CQ-5 [P2] (8/10) `apps/{kr,jp}/src/app/layout.tsx:68-87`
Plan baseline: 계획서 P2-1
Runtime evidence: 라이브 홈 HTML 에 `ld+json` 없음
Comparison grid:

| Choice | Current | A | B | C |
|---|---|---|---|---|
| R11 JSON-LD | 없음 | `@graph` [Person, WebSite], sameAs 는 히어로 http 링크(자리표시자 제외) | WebSite 만 | 없음 |
| sameAs 비었을 때 | — | 키 생략 | — | — |

Question D12:
D12 — Person·WebSite JSON-LD 를 넣을까?
Project/branch/task: ballbot-portfolio3 `main`, 구조화 데이터.
ELI10: 검색엔진에 "이 사이트는 김수빈이라는 소프트웨어 엔지니어의 것" 이라고 기계가 읽는 형식으로 말해 주는 태그다. 이름·직함·URL·GitHub 링크 정도다. GitHub 은 지금 자리표시자라 걸러지고, 작업 계획서 A1 이 고치면 자동으로 들어간다.
Stakes if we pick wrong: 이름으로 검색될 때 엔진이 사람과 사이트를 잇지 못한다(작지만 포트폴리오엔 의미 있다).
Recommendation: A because 포트폴리오 사이트의 표준 구조화 데이터이고 데이터가 이미 content 에 있다.
Completeness: A=10/10, B=6/10, C=0/10
Pros / cons:
A) Person + WebSite (recommended)
  ✅ 이름(마켓 언어)·`alternateName: ballbot`·직함·URL·sameAs 가 한 블록에 (human: ~1h / CC: ~10분)
  ✅ 자리표시자(경로 없는 링크)는 걸러 잘못된 sameAs 를 내보내지 않는다
  ❌ 이름 문자열이 레이아웃에 상수로 놓인다(D8 과 같은 이유)
B) WebSite 만
  ✅ 카피 없이 URL·언어만
  ✅ 최소
  ❌ 사람 엔티티가 없어 포트폴리오로서 의미가 반감된다
C) 유지
  ✅ 변경 없음
  ✅ 없음
  ❌ 구조화 데이터 부재
Net: 데이터는 이미 있으니 형식만 붙인다.
Header: JSON-LD
Options:
A) Person + WebSite
레이아웃 `<head>` 에 `<script type="application/ld+json">`; `JSON.stringify(...).replace(/</g, "\\u003c")`.
B) WebSite 만
동일 자리, Person 없이.
C) 유지
변경 없음.

State: approved
Actual answer: A (auto, recommended)
Accepted scope: A
History: 없음

### R12: README 정리
Finding: CQ-6 [P2] (9/10) `README.md:49-52`
Plan baseline: 계획서 P2-5
Runtime evidence: `/api/resume` grep 결과 코드 없음
Comparison grid:

| Choice | Current | A | B |
|---|---|---|---|
| R12 README | resume 문단 | R2 자산 한 줄 + `check:live` 한 줄로 교체 | 유지 |

Question D13:
D13 — README 의 지워진 기능 설명을 정리할까?
Project/branch/task: ballbot-portfolio3 `main`, 문서 정확성.
ELI10: README 가 없는 API 를 설명한다. 그 자리에 실제로 있는 것(자산은 R2, 배포 후 스모크)을 적는다.
Stakes if we pick wrong: 다음 사람이 없는 라우트를 찾는다.
Recommendation: A because 사실 정정이다.
Completeness: A=10/10, B=0/10
Pros / cons:
A) 교체 (recommended)
  ✅ README 가 현재 코드와 일치한다
  ✅ 새 스크립트(`check:live`)의 존재를 알린다
  ❌ 없음
B) 유지
  ✅ 변경 없음
  ✅ 없음
  ❌ 틀린 문서
Net: 정정.
Header: README
Options:
A) 교체
문단 삭제, `npm run assets:push` 와 `npm run check:live` 한 줄씩.
B) 유지
변경 없음.

State: approved
Actual answer: A (auto, recommended)
Accepted scope: A
History: 없음

### R13: 마켓 간 슬러그 짝 테스트
Finding: CQ-7 [P2] (8/10), Scope C-2
Plan baseline: 계획서 P2-6
Runtime evidence: kr·jp `slug:` 8쌍 일치(grep)
Comparison grid:

| Choice | Current | A | B |
|---|---|---|---|
| R13 짝 보장 | 없음 | `apps/kr/src/content/slugs.test.ts` (두 파일 텍스트에서 `slug: "…"` 집합 비교, 빈 집합이면 실패) + kr `test` 스크립트 | `sitemap.ts` 주석만 |

Question D14:
D14 — 두 마켓의 슬러그가 같다는 걸 테스트로 지킬까?
Project/branch/task: ballbot-portfolio3 `main`, hreflang 전제.
ELI10: 스토리 페이지에 "일본어판은 /projects/x" 라고 적으려면 jp 에도 /projects/x 가 있어야 한다. 지금은 같지만 지켜 주는 건 없다. content 파일은 컴포넌트를 끌어와 node 로 import 할 수 없어, 텍스트에서 `slug: "…"` 를 뽑아 비교한다.
Stakes if we pick wrong: 한쪽에만 스토리를 추가하면 다른 쪽 hreflang 이 404 를 가리킨다.
Recommendation: A because 20줄 테스트가 P1 결함의 전제를 지킨다.
Completeness: A=10/10, B=3/10
Pros / cons:
A) 텍스트 짝 테스트 (recommended)
  ✅ `npm test` 가 kr/jp 슬러그 집합 불일치를 즉시 잡는다 (human: ~1h / CC: ~5분)
  ✅ import 가 아니라 텍스트라 .tsx 의존성이 없다
  ❌ `slug: "…"` 표기에 묶인다 — 테스트 안에 가정을 적는다
B) 주석만
  ✅ 코드 없음
  ✅ 의도는 남는다
  ❌ 아무것도 강제하지 않는다
Net: 가정을 문서가 아니라 테스트에 적는다.
Header: 슬러그 테스트
Options:
A) 텍스트 짝 테스트
`apps/kr/src/content/slugs.test.ts` + `apps/kr/package.json` `"test"`.
B) 주석만
`sitemap.ts` 주석.

State: approved
Actual answer: A (auto, recommended)
Accepted scope: A
History: 없음

### R14: 단위 테스트 범위
Finding: Test review — markets 헬퍼 6 분기, router 3 헤더 GAP
Plan baseline: 계획서 각 항목의 "테스트" 줄
Runtime evidence: router 테스트 12개 통과, shared 테스트 없음
Comparison grid:

| Choice | Current | A | B |
|---|---|---|---|
| R14 markets.test.ts | 없음 | 6 케이스(기본 경로, 중첩 경로, x-default, LANGUAGE_ALTERNATES 동치, og locale, alternateLocale 자기 제외) | 2 케이스(happy path) |
| R14 router 테스트 | 12 | +3 (/go noindex, ?geo noindex, HSTS on 302/301) | +1 |

Question D15:
D15 — 새 헬퍼·router 헤더 테스트를 어디까지 쓸까?
Project/branch/task: ballbot-portfolio3 `main`, 테스트.
ELI10: 헬퍼는 순수 함수라 케이스 하나가 한 줄이다. 전부 쓰는 것과 절반만 쓰는 것의 차이가 몇 분이다.
Stakes if we pick wrong: 경로 결합이나 x-default 가 틀려도 빌드가 통과한다.
Recommendation: A because 비용이 분 단위고 두 빌드의 SEO 값이 여기서 나온다.
Completeness: A=10/10, B=6/10
Pros / cons:
A) 전부 (recommended)
  ✅ 경로·x-default·alternateLocale 의 엣지까지 고정 (human: ~1h / CC: ~5분)
  ✅ router 세 응답의 헤더가 각각 검증된다
  ❌ 없음에 가깝다
B) happy path 만
  ✅ 짧다
  ✅ 없음
  ❌ 엣지가 비어 있다
Net: 분 단위 비용, 전부.
Header: 테스트 범위
Options:
A) 전부
위 표의 A 열.
B) happy path 만
위 표의 B 열.

State: approved
Actual answer: A (auto, recommended)
Accepted scope: A
History: 없음

### R15: 회귀 계약 (스토리 메타데이터)
Finding: Test review IRON RULE — `[slug]/page.tsx` `generateMetadata` 4곳 변경
Plan baseline: 없음(리뷰에서 신설)
Runtime evidence: 코드상 canonical/title/description/og:type/og:url 존재; 라이브는 404 라 미확인
Comparison grid:

| Choice | Current | A | B |
|---|---|---|---|
| R15 보존 동작 | canonical 경로, `${제목} \| ballbot.dev`, description, og:type article, og:url | 동일 보존 | 동일 보존 |
| R15 의도한 차이 | — | hreflang×3, og:locale, og:locale:alternate, og:site_name 추가 | 동일 |
| R15 수용 기준 | — | 빌드 후 curl(kr/jp 각 1페이지 태그 확인) + `check-live.mjs` 가 사이트맵 전 URL 의 canonical·hreflang×3 검사 | 빌드 후 curl 만 |

Question D16:
D16 — 스토리 메타데이터 회귀를 무엇으로 막을까?
Project/branch/task: ballbot-portfolio3 `main`, 회귀 계약.
ELI10: 페이지의 `alternates`·`openGraph` 를 다시 쓰면서 기존 태그(canonical, 제목, 설명)를 깨뜨리면 안 된다. 빌드 결과를 curl 로 한 번 보고, 배포 후엔 스모크 스크립트가 모든 URL 에서 canonical 과 hreflang 을 센다.
Stakes if we pick wrong: canonical 이 홈으로 되돌아가는 식의 회귀가 조용히 배포된다.
Recommendation: A because 스모크 스크립트(D4)에 검사 두 줄만 더하면 된다.
Completeness: A=10/10, B=7/10
Pros / cons:
A) curl + check-live (recommended)
  ✅ 배포마다 8개 URL 의 canonical·hreflang 을 기계가 센다
  ✅ 이 세션의 curl 이 첫 증거를 남긴다
  ❌ 제목·설명은 스크립트가 아니라 curl 로만 본다(값이 콘텐츠라 스크립트가 알 수 없다)
B) curl 만
  ✅ 코드 없음
  ✅ 이번 변경은 검증된다
  ❌ 다음 변경은 아무도 안 본다
Net: 계약을 스크립트에 적어 둔다.
Header: 회귀 계약
Options:
A) curl + check-live
보존 동작·차이·수용 기준은 위 표 A 열.
B) curl 만
위 표 B 열.

State: approved
Actual answer: A (auto, recommended)
Accepted scope: A
History: 없음

## Outside Voice — 독립 2차 의견

Codex CLI 미설치(`CODEX_MODE: not_installed`) → 네이티브 대체(Claude `Plan` 서브에이전트, 같은 하네스, 모델 정체 미상). **외부 커버리지로 치지 않는다**(outside_status: unavailable, source: in-host). 이 세션엔 TaskOutput 도구가 없어 Agent 완료 알림을 대기 수단으로 썼다(14분, 도구 호출 50회). 아래는 전문.

```
OUTSIDE VOICE (Claude subagent):
════════════════════════════════════════════════════════════
## Findings the earlier review missed

### 1. P0-1 diagnosis: right fix, wrong mechanism, and one unverified cheaper alternative
Verified: `.open-next/cache/d13fbPBA-uNEVwnF9qNAM/projects/cosmonote.cache` exists locally; `.open-next/assets/` has no `cdn-cgi/`; `defineCloudflareConfig({})` resolves `incrementalCache` to `"dummy"`; `populateCache()` only calls `populateStaticAssetsIncrementalCache` (a plain `fs.cpSync` of `cache/` into `assets/cdn-cgi/_next_cache/`) when the override's `name` is `cf-static-assets-incremental-cache`; and `deploy.js`, `upload.js`, `preview.js` all invoke `populateCache` before wrangler. Live: `kr.ballbot.dev/projects/cosmonote` and both jp stories are 404 with `x-nextjs-cache: MISS`, `x-nextjs-prerender: 1`; home is 200 with `x-nextjs-cache: MISS`. Key layout (`<buildId>/<key>.cache`, `OPEN_NEXT_BUILD_ID = NextConfig.deploymentId ?? BuildId`) matches the copied tree. The fix will work.
But the plan's stated mechanism is wrong. The `NoFallbackError`/404 branch in `app-page-runtime.js:705` is gated on `!isMinimalMode`. In the Worker, a cache miss does not short-circuit to 404; it falls through to an on-demand render, and that render returns the not-found page. OpenNext's own `handleFallbackFalse` lets the 8 pregenerated paths through. Consequence: the review never considered removing `export const dynamicParams = false` as a zero-infra alternative. I could not locate the runtime enforcement of `dynamicParams=false` in Next 16's server code, so I can't prove that alternative works; it also keeps every story rendering per request. The cache fix is still the better choice because it also turns `/` (currently MISS on every hit) into a HIT.

### 2. P0-1 deploy-time risk nobody wrote down
`populateCache` is not part of `opennextjs-cloudflare build`. It runs only inside `deploy`, `upload`, `preview`, or an explicit `populateCache`. Any deploy via bare `wrangler deploy`, Workers Builds, or a future CI step silently reverts to the current 404 with no build error. Minimum: the post-deploy check must assert `x-nextjs-cache: HIT` on a story page, not just `200`. Better: a one-line comment in `open-next.config.ts`.

### 3. P0-1 verification gap in this session
`next start` is not minimal mode and does not exercise OpenNext, the ASSETS binding, or the cache; it cannot confirm or refute P0. The user's `npm run preview` is the first and only test.

### 4. P2-4 HSTS on the apex is a one-way door
`includeSubDomains` from the apex pins every current and future `*.ballbot.dev` host (including `assets.ballbot.dev`) to HTTPS; `preload` invites submission to a list that is effectively irreversible. Recommend: apex HSTS with `max-age` only (or `includeSubDomains` without `preload`) unless the user explicitly wants list submission; D-3 is a prerequisite for the preload form anyway.

### 5. P2-4 `x-robots-tag: noindex` on `/go/*` is a no-op
`/go/ja` is a 302 with no body. Search engines apply robots directives of the redirect target. The `?geo` JSON case is the only one where the header does anything.

### 6. P1-4 has a runtime trap
`get-img-props.js:400` throws at render time when `preload` and `loading="lazy"` coexist. In `screen-slider.tsx` the `loading` value is computed per render from `index`: slide 0 becomes `"lazy"` as soon as the reader pages to slide 2. Dropping `loading` on slide 0 must be a hard requirement.

### 7. P1-3 skip link test will not pass as written
`<main>` is not focusable. `href="#main"` scrolls and sets the sequential focus starting point, but `document.activeElement` stays on `<body>`; add `tabIndex={-1}` on all three `<main>` elements.

### 8. P1-3 / step 4 edits a file with uncommitted user changes
`apps/jp/src/app/page.tsx` has an uncommitted Journey reorder from the user (lines 50-56). Adding `id="main"` mixes the user's unfinished work and the plan's work in one hunk. Say so, or do the jp `<main>` edit last and separately.

### 9. P1-1 x-default: validator noise and canonical drift
x-default resolving to a `302 + no-store + vary: cookie` URL will be flagged by hreflang validators and Search Console. It does not break indexing because each market declares its own canonical, but say the warnings are expected. Separately, `languageAlternates("/")` would flip the home `<loc>`/hreflang from `https://kr.ballbot.dev` to `https://kr.ballbot.dev/`; verify Search Console does not treat it as a new URL.

### 10. P2-6 slug test is fine; the live smoke script is not in the plan
The turbo `test` task hashes only `^build`, so editing jp's `portfolio.ts` does not invalidate kr's test cache. The smoke script should assert `x-nextjs-cache: HIT` and the three hreflang links per story.

### 11. P2-2 test is against the wrong runtime
`/projects/nope` in production is 404'd by OpenNext's routing layer (`handleFallbackFalse` rewrites to `/404`) before Next sees it. The custom page will render, but `next start` does not exercise this. Fold it into the user's `preview` check.

### 12. Small correctness notes
- `nodejs_compat` claim checks out (wrangler `NODEJS_COMPAT_DEFAULT_ON_DATE = "2026-08-04"`).
- `next/image` `priority` is `@deprecated` in favor of `preload` in 16.3.4.
- Next injects `<meta name="robots" content="noindex">` for 404 renders.
- Static-assets cache throws on `composable` cache reads; no `"use cache"` in source, so safe today. Add a comment.

### Strategic note (not a blocker)
`output: "export"` plus assets-only Workers would remove the server, the cache, the per-request render of `/`, and the deploy-order dependency. Out of scope because `next/image` runs through the `IMAGES` binding and `headers()` would need to move to `_headers`, but it belongs in the "not doing, and why" table.

Recommendation: proceed with the plan after amending it, because the P0 fix is sound but the plan's stated mechanism is wrong, the deploy-path dependency and `HIT` assertion are missing, apex `includeSubDomains; preload` is an irreversible commitment nobody scoped, and the P1-4 `loading`/`preload` conflict is a client crash if the ternary survives.
════════════════════════════════════════════════════════════
```

### Cross-model tension — 처리

| OV | 판정 | 처리 |
|---|---|---|
| 1 기전 오기 | 사실 정정. 결론(정적 자산 캐시) 유지 | 계획서 P0-1 "원인" 문단 정정. R2 History 에 기록 |
| 2 배포 경로 의존 + HIT 단언 | 새 보장 | **D17** (check-live 가 `x-nextjs-cache: HIT` 단언) + `open-next.config.ts` 주석(R2 accepted scope 확장) |
| 3 next start 는 P0 검증 불가 | 사실 정정 | P0-1 "테스트" 문단 정정 |
| 4 apex HSTS 일방향 문 | 새 위험 → R5 재개 | **D18** (보수적 선택: `max-age` 만) |
| 5 `/go/*` noindex 무의미 | 사실 정정 → R5 재개 | **D19** (`?geo` 에만) |
| 6 preload/lazy 충돌 | 사실(요건 강화) | R10 accepted scope 에 하드 요건 명시 |
| 7 `<main>` tabIndex | 필요 구현 | R6 accepted scope 확장(`tabIndex={-1}`, `#main:focus-visible`) |
| 8 jp page.tsx hunk | 절차 | 오케스트레이터가 "기존 hunk 보존 + 추가" 를 허용. 속성만 더한다 |
| 9 x-default 검증 도구 경고, 홈 URL 표기 | 사실 정정 | P3 노트 정정; 헬퍼가 루트에 슬래시를 붙이지 않게 R4 accepted scope 조정 |
| 10 turbo 캐시 | 구체적 새 위험 → R13 재개 | **D20** (루트 작업 `//#check:slugs`) |
| 11 `/projects/nope` 는 preview 로 | 사실 | D-4 체크리스트에 추가 |
| 12 composable 캐시 주석 등 | 확인 | `open-next.config.ts` 주석 |
| 전략 노트 | 기록 | "바꾸지 않을 것" 표에 추가 |

### R2 — 정정 기록 (OV-1/2/12)
History: 최초 근거 "캐시에 없으면 그대로 404" 는 기전을 단정한 표현이었다. 라이브 헤더(`x-nextjs-cache: MISS`, `x-nextjs-prerender: 1`)와 OpenNext 소스로 확인되는 사실은 "프리렌더 결과가 캐시에 없다" 까지이고, miss 이후 not-found 로 끝나는 분기는 Next 소스에서 특정하지 못했다. 결정 D3 는 그대로(캐시가 채워지면 miss 자체가 사라지고 `/` 도 HIT). Accepted scope 확장: 설정 주석에 (a) `populateCache` 는 CLI 의 deploy/upload/preview 만 실행하므로 맨 `wrangler deploy` 는 스토리를 404 로 되돌린다, (b) 이 캐시는 composable(`"use cache"`) 읽기에서 throw 한다 — 를 적는다.

### R4 — 조정 기록 (OV-9)
Accepted scope 조정: `marketUrl(locale, "/")` 는 슬래시 없는 호스트를 돌려 준다(라이브 canonical·`<loc>` 과 동일). 홈 출력 무변경. 테스트 케이스에 그 사실을 고정.

### R6 — 확장 기록 (OV-7/8)
Accepted scope 확장: `<main id="main" tabIndex={-1}>` ×5(홈 2, 스토리 2, 404 2 중 공유 컴포넌트 기준 4 파일 + not-found 2), `theme.css` 에 `#main:focus-visible { outline: none }`. jp `page.tsx` 는 사용자 hunk 의 줄을 바꾸지 않고 `<main>` 여는 태그에 속성만 더한다.

### R10 — 요건 강화 기록 (OV-6)
Accepted scope 명시: 첫 슬라이드는 `preload` 만, `loading` prop 없음(있으면 인덱스 이동 시 `get-img-props.js:400` throw). 구현 후 `$B` 로 슬라이더를 세 장 넘겨 콘솔 오류가 없는지 본다.

### R16: check-live 의 HIT 단언
Finding: OV-2 [P1] (9/10) `populate-cache.js` 호출자는 deploy/upload/preview 뿐 — 리뷰어: Claude Plan 서브에이전트
Plan baseline: D4 승인 범위(200 + canonical + hreflang×3)
Runtime evidence: 라이브 홈·스토리 모두 `x-nextjs-cache: MISS`
Comparison grid:

| Choice | Current | A | B |
|---|---|---|---|
| R16 스토리 검사 | 200 만 | 200 **and** `x-nextjs-cache: HIT` | 200 만 |
| 배포 경로 오류 탐지 | 못 함 | 함(MISS 면 실패) | 못 함 |

Question D17:
D17 — 스모크가 "캐시에서 나왔는지" 까지 볼까?
Project/branch/task: ballbot-portfolio3 `main`, 배포 검증.
ELI10: 캐시가 안 채워져도 다른 경로로 200 이 나올 수 있다. 그러면 스크립트는 통과하지만 원인은 그대로다. 응답의 `x-nextjs-cache` 가 `HIT` 인지까지 보면 "캐시가 실제로 채워졌다" 를 확인한다.
Stakes if we pick wrong: 맨 `wrangler deploy` 로 배포한 날, 200 이 나오는 동안 스토리는 요청마다 렌더되거나 다시 404 로 돌아가도 아무도 모른다.
Recommendation: A because 헤더 한 줄 비교로 배포 경로 오류를 잡는다.
Completeness: A=10/10, B=6/10
Pros / cons:
A) HIT 단언 (recommended)
  ✅ 정적 자산 캐시가 실제로 채워졌는지를 배포마다 확인한다
  ✅ 코드 한 줄, 라이브에서 지금 MISS 라 즉시 의미가 있다
  ❌ OpenNext 가 헤더 이름을 바꾸면 스크립트를 따라 고쳐야 한다
B) 200 만
  ✅ 단순
  ✅ 없음
  ❌ 배포 경로 오류를 못 잡는다
Net: 한 줄로 "살아 있다" 와 "제대로 살아 있다" 를 구분한다.
Header: HIT 단언
Options:
A) HIT 단언
`check-live.mjs` 가 스토리 URL 마다 `x-nextjs-cache: HIT` 를 요구.
B) 200 만
상태 코드만.

State: approved
Actual answer: A (auto, recommended)
Accepted scope: A
History: 없음

### R5 — 재개: HSTS 범위 (OV-4)
Finding: OV-4 [P2] (8/10) 리뷰어: Claude Plan 서브에이전트 — apex `includeSubDomains; preload` 는 일방향 문
Plan baseline: D6 승인값 "모든 router 응답에 마켓과 같은 HSTS"
Runtime evidence: 라이브 apex 응답에 HSTS 없음; `assets.ballbot.dev` 등 다른 서브도메인 존재
Comparison grid:

| Choice | Current | A | B | C |
|---|---|---|---|---|
| R5 apex HSTS 값 | 없음 | `max-age=63072000` | `max-age=63072000; includeSubDomains; preload` (D6 원안) | 없음 |
| 서브도메인 고정 | 안 함 | 안 함 | 모든 `*.ballbot.dev` 고정 | 안 함 |
| preload 등재 가능 | — | 아니오 | 예(되돌리기 사실상 불가) | — |

Question D18:
D18 — apex HSTS 를 어느 범위로 보낼까?
Project/branch/task: ballbot-portfolio3 `main`, router.
ELI10: HSTS 는 브라우저에 "이 도메인은 https 만" 이라고 오래 기억시키는 헤더다. apex 에서 `includeSubDomains` 를 보내면 미래에 만들 어떤 서브도메인도 https 가 아니면 열리지 않고, `preload` 는 브라우저 목록에 박혀 되돌리기 어렵다. 그건 코드 리뷰가 아니라 소유자가 결정할 일이다.
Stakes if we pick wrong: 되돌릴 수 없는 약속을 사용자 모르게 한다.
Recommendation: A because 되돌릴 수 있는 형태로 apex 도 https 를 약속하고, 등재 여부는 사용자에게 남긴다.
Note: options differ in kind, not coverage — no completeness score.
Pros / cons:
A) max-age 만 (recommended)
  ✅ apex 자체는 https 로 고정되면서 서브도메인·preload 목록에 손대지 않는다
  ✅ 나중에 값을 올리는 건 헤더 한 줄이다
  ❌ preload 목록 등재 요건은 채우지 못한다(사용자가 원하면 D-3 뒤에 올린다)
B) includeSubDomains; preload
  ✅ 마켓 빌드와 값이 같아 preload 등재 요건의 코드 쪽을 채운다
  ✅ 없음
  ❌ 모든 서브도메인 고정 + 사실상 되돌릴 수 없는 등재를 리뷰가 대신 결정한다
C) 없음
  ✅ 변경 없음
  ✅ 없음
  ❌ apex 만 HSTS 가 없는 상태가 남는다
Net: 되돌릴 수 있는 만큼만.
Header: HSTS 범위
Options:
A) max-age 만
router 모든 응답에 `strict-transport-security: max-age=63072000`.
B) includeSubDomains; preload
마켓 빌드와 같은 값.
C) 없음
HSTS 안 넣음.

State: approved
Actual answer: A (auto, recommended — 파괴적·비가역 옵션 B 는 자동 선택 대상이 아니다)
Accepted scope: A
History: D6 이 B 값을 승인했으나 OV-4 의 비가역성 지적으로 재개, A 로 대체.

### R5 — 재개: `/go/*` noindex (OV-5)
Finding: OV-5 [P3] (8/10) 리뷰어: Claude Plan 서브에이전트 — 본문 없는 302 의 로봇 헤더는 무효
Plan baseline: D6 승인값 "`/go/*` + `?geo` 에 noindex"
Runtime evidence: `/go/ja` 응답은 `Response(null, { status: 302 … })` (`index.ts:124`)
Comparison grid:

| Choice | Current | A | B |
|---|---|---|---|
| R5 noindex 대상 | 없음 | `?geo` 만 | `/go/*` + `?geo` |
| 테스트 | — | +1 | +2 |

Question D19:
D19 — noindex 를 `?geo` 에만 둘까?
Project/branch/task: ballbot-portfolio3 `main`, router.
ELI10: 검색엔진은 리다이렉트를 따라가 도착지의 규칙을 본다. `/go/ja` 는 본문 없는 302 라 여기 붙인 noindex 는 아무도 읽지 않는다. `?geo` 는 200 JSON 이라 의미가 있다.
Stakes if we pick wrong: 효과 없는 코드와 테스트가 남는다(작다).
Recommendation: A because 효과 없는 헤더는 문서화가 아니라 오해다.
Completeness: A=10/10, B=10/10 (B 는 효과 없는 줄이 더 있을 뿐)
Pros / cons:
A) ?geo 만 (recommended)
  ✅ 효과 있는 곳에만 헤더가 있어 읽는 사람이 오해하지 않는다
  ✅ 테스트도 의미 있는 하나만 남는다
  ❌ `/go/*` 의 의도는 주석으로만 남는다
B) 둘 다
  ✅ "색인 원치 않음" 의도가 코드에 보인다
  ✅ 없음
  ❌ 302 응답 헤더는 무시되므로 죽은 코드다
Net: 죽은 헤더를 넣지 않는다.
Header: noindex 대상
Options:
A) ?geo 만
`?geo` 응답에만 `x-robots-tag: noindex`; `/go` 는 주석으로 이유 기록.
B) 둘 다
D6 원안.

State: approved
Actual answer: A (auto, recommended)
Accepted scope: A
History: D6 원안 B 에서 OV-5 로 재개.

### R13 — 재개: 슬러그 테스트 위치 (OV-10)
Finding: OV-10 [P2] (9/10) 리뷰어: Claude Plan 서브에이전트 — turbo 가 kr 패키지 입력만 해시
Plan baseline: D14 승인값 `apps/kr/src/content/slugs.test.ts`
Runtime evidence: `turbo.json` `test: { dependsOn: ["^build"] }`, 입력 목록 없음 — 첫 주석이 같은 함정을 설명함
Comparison grid:

| Choice | Current | A | B |
|---|---|---|---|
| R13 위치 | — | 루트 `scripts/slugs.test.mjs` + `//#check:slugs` (`inputs`: 두 portfolio.ts, 스크립트) + 루트 `npm test` 가 함께 실행 | `apps/kr` + README 에 `--force` 안내 |
| jp 변경 시 캐시 무효화 | — | 됨 | 안 됨 |
| tsc/eslint 커버 | — | 아니오(.mjs, 30줄) | 예 |

Question D20:
D20 — 슬러그 짝 테스트를 어디에 둘까?
Project/branch/task: ballbot-portfolio3 `main`, 테스트 캐시.
ELI10: turbo 는 패키지 안 파일이 안 바뀌면 지난 결과를 재생한다. kr 안의 테스트가 jp 파일을 읽으면, jp 를 고쳐도 "통과" 가 재생된다. 루트 작업으로 두고 두 파일을 입력으로 적으면 어느 쪽을 고쳐도 다시 돈다.
Stakes if we pick wrong: 테스트가 있는데도 불일치를 놓친다 — 없는 것보다 나쁘다.
Recommendation: A because 캐시 정합성이 테스트의 존재 이유다.
Completeness: A=10/10, B=5/10
Pros / cons:
A) 루트 작업 (recommended)
  ✅ `inputs` 에 두 파일이 있어 어느 마켓을 고쳐도 다시 돈다
  ✅ 루트 `npm test` 한 번에 같이 돈다
  ❌ 30줄 .mjs 는 tsc·eslint 밖이다
B) apps/kr + --force 안내
  ✅ 타입·린트 커버
  ✅ 없음
  ❌ 사람이 `--force` 를 기억해야 맞는 답이 나온다
Net: 캐시가 틀리는 테스트는 테스트가 아니다.
Header: 슬러그 테스트 위치
Options:
A) 루트 작업
`scripts/slugs.test.mjs`, `turbo.json` `"//#check:slugs": { "inputs": [...] }`, 루트 `package.json` `check:slugs` + `test: "turbo run test check:slugs"`.
B) apps/kr + --force 안내
D14 원안 + README.

State: approved
Actual answer: A (auto, recommended)
Accepted scope: A
History: D14 원안에서 OV-10 으로 재개.

### R17: TODO — OG 이미지 자산
Finding: 계획서 D-2 (사용자 결정)
Plan baseline: 없음
Runtime evidence: 라이브 홈 `og:image` 없음
Comparison grid:

| Choice | Current | A | B | C |
|---|---|---|---|---|
| R17 기록 위치 | — | 새 `TODOS.md` | 이 문서 "미구현·사용자 결정 필요" | 지금 만들기(자산 없음) |

Question D21:
D21 — OG 이미지 항목을 어디에 남길까?
Project/branch/task: ballbot-portfolio3 `main`, 후속 항목.
ELI10: 소셜 카드 이미지는 디자인 자산이 있어야 한다. 지금은 없으니 "필요하다" 를 어디에 적어 둘지만 정한다. 저장소에 TODOS.md 가 없고, 새 문서 파일은 만들지 말라는 지시가 있다.
Stakes if we pick wrong: 항목을 잃거나, 불필요한 파일이 생긴다.
Recommendation: B because 이 문서가 이미 결정 목록을 들고 있고 새 .md 는 만들지 않는다.
Note: options differ in kind, not coverage — no completeness score.
Pros / cons:
A) TODOS.md 추가
  ✅ /retro 등 도구가 읽는 표준 위치다
  ✅ 없음
  ❌ 새 문서 파일 생성 금지 지시와 충돌한다
B) 이 문서에 기록 (recommended)
  ✅ 사용자가 이미 읽을 문서에 결정 항목으로 남는다
  ✅ 파일이 늘지 않는다
  ❌ 도구가 자동 수집하지 않는다
C) 지금 만들기
  ✅ 없음
  ✅ 없음
  ❌ 자산이 없어 만들 수 없다
Net: 있는 문서에.
Header: TODO 위치
Options:
A) TODOS.md 추가
루트에 TODOS.md 생성.
B) 이 문서에 기록
"미구현·사용자 결정 필요" 절.
C) 지금 만들기
불가.

State: approved
Actual answer: B (auto, recommended)
Accepted scope: B
History: 없음

### R18: TODO — 존 설정 Always Use HTTPS
Finding: 계획서 D-3, ARCH-6
Plan baseline: 없음
Runtime evidence: `http://ballbot.dev/` → 302 `https://kr.ballbot.dev/` (같은 호스트 https 로 먼저 가지 않음)
Comparison grid: R17 과 동일 구조(A TODOS.md / B 이 문서 / C 지금 — 코드로 불가)
Question D22:
D22 — 존 설정 항목을 어디에 남길까?
Project/branch/task: ballbot-portfolio3 `main`, 후속 항목.
ELI10: apex 의 http→https 는 Cloudflare 대시보드 설정이라 코드로 못 한다. 적어 둘 곳만 정한다.
Stakes if we pick wrong: 항목을 잃는다.
Recommendation: B because R17 과 같은 이유.
Note: options differ in kind, not coverage — no completeness score.
Pros / cons:
A) TODOS.md 추가
  ✅ 표준 위치
  ✅ 없음
  ❌ 새 .md 금지
B) 이 문서에 기록 (recommended)
  ✅ 결정 목록 옆에 남는다
  ✅ 파일 증가 없음
  ❌ 도구 자동 수집 없음
C) 지금 하기
  ✅ 없음
  ✅ 없음
  ❌ 대시보드 권한 밖
Net: 있는 문서에.
Header: TODO 위치
Options:
A) TODOS.md 추가
B) 이 문서에 기록
C) 지금 하기

State: approved
Actual answer: B (auto, recommended)
Accepted scope: B
History: 없음

### R19: TODO — 스킵 링크·404 문구를 portfolio.ts 로 이전
Finding: D8 의 후속
Plan baseline: D8 = 앱 레이아웃 상수
Runtime evidence: 콘텐츠 계획서가 portfolio.ts 를 줄 번호로 검토 중
Comparison grid: R17 과 동일 구조
Question D23:
D23 — "콘텐츠 검토 뒤 문구를 portfolio.ts 로 옮긴다" 를 어디에 남길까?
Project/branch/task: ballbot-portfolio3 `main`, 후속 항목.
ELI10: 지금은 충돌을 피해 레이아웃에 뒀다. 검토가 끝나면 원칙대로 content 파일로 옮겨야 한다.
Stakes if we pick wrong: 카피가 두 곳으로 갈라진 채 굳는다.
Recommendation: B because 같은 이유.
Note: options differ in kind, not coverage — no completeness score.
Pros / cons:
A) TODOS.md 추가
  ✅ 표준 위치
  ✅ 없음
  ❌ 새 .md 금지
B) 이 문서에 기록 (recommended)
  ✅ D8 바로 옆에 남는다
  ✅ 파일 증가 없음
  ❌ 도구 자동 수집 없음
C) 지금 하기
  ✅ 원칙 준수
  ✅ 없음
  ❌ D8 이 피하려 한 충돌을 지금 일으킨다
Net: 있는 문서에.
Header: TODO 위치
Options:
A) TODOS.md 추가
B) 이 문서에 기록
C) 지금 하기

State: approved
Actual answer: B (auto, recommended)
Accepted scope: B
History: 없음

### R20: TODO — HTML 엣지 캐시 규칙을 켤 때의 cachePurge
Finding: P3 기록 항목
Plan baseline: 없음
Runtime evidence: 라이브 HTML `cache-control: s-maxage=31536000`, `cf-cache-status` 없음
Comparison grid: R17 과 동일 구조
Question D24:
D24 — "HTML Cache Rule 을 켜면 cachePurge 를 같이" 를 어디에 남길까?
Project/branch/task: ballbot-portfolio3 `main`, 후속 항목.
ELI10: 지금은 Cloudflare 가 HTML 을 엣지에 안 담아 1년짜리 s-maxage 가 무해하다. 담기 시작하면 배포 후 퍼지가 필요하다.
Stakes if we pick wrong: 미래의 설정 변경이 옛 HTML 을 1년 고정한다.
Recommendation: B because 같은 이유.
Note: options differ in kind, not coverage — no completeness score.
Pros / cons:
A) TODOS.md 추가
  ✅ 표준 위치
  ✅ 없음
  ❌ 새 .md 금지
B) 이 문서에 기록 (recommended)
  ✅ P3 노트 옆에 남는다
  ✅ 파일 증가 없음
  ❌ 도구 자동 수집 없음
C) 지금 하기
  ✅ 없음
  ✅ 없음
  ❌ 켜지도 않은 규칙에 대한 설정이다
Net: 있는 문서에.
Header: TODO 위치
Options:
A) TODOS.md 추가
B) 이 문서에 기록
C) 지금 하기

State: approved
Actual answer: B (auto, recommended)
Accepted scope: B
History: 없음

### R21: TODO — `output: "export"` 검토
Finding: OV 전략 노트
Plan baseline: 없음
Runtime evidence: `next.config.ts` 에 `images.remotePatterns` + `headers()`; wrangler 에 IMAGES 바인딩
Comparison grid: R17 과 동일 구조
Question D25:
D25 — "정적 export 로 서버를 없앨지" 를 어디에 남길까?
Project/branch/task: ballbot-portfolio3 `main`, 후속 항목.
ELI10: 서버가 없으면 이번 같은 캐시 사고 자체가 없다. 대신 이미지 최적화와 헤더를 다른 방식으로 옮겨야 해 이번 범위 밖이다.
Stakes if we pick wrong: 구조 대안이 기록 없이 사라진다.
Recommendation: B because 같은 이유.
Note: options differ in kind, not coverage — no completeness score.
Pros / cons:
A) TODOS.md 추가
  ✅ 표준 위치
  ✅ 없음
  ❌ 새 .md 금지
B) 이 문서에 기록 (recommended)
  ✅ "바꾸지 않을 것" 표와 함께 남는다
  ✅ 파일 증가 없음
  ❌ 도구 자동 수집 없음
C) 지금 하기
  ✅ 없음
  ✅ 없음
  ❌ 범위 밖의 재구조화
Net: 있는 문서에.
Header: TODO 위치
Options:
A) TODOS.md 추가
B) 이 문서에 기록
C) 지금 하기

State: approved
Actual answer: B (auto, recommended)
Accepted scope: B
History: 없음

Approval readiness: PASS — D2, D3(+R2 정정), D4, D5(+R4 조정), D6→D18/D19 로 대체, D7(+R6 확장), D8, D9, D10, D11(+R10 요건), D12, D13, D14→D20 으로 대체, D15, D16, D17, D21–D25. 답 참조: 전부 "auto (recommended)"; D18 은 비가역 옵션을 피한 보수적 선택.

## NOT in scope

- OG 이미지: 디자인 자산이 있어야 한다(D-2, R17).
- apex http→https 같은 호스트 리다이렉트: Cloudflare 존 설정(D-3, R18).
- apex `includeSubDomains; preload`: 비가역이라 사용자 몫(D18).
- `output: "export"` 재구조화: IMAGES 바인딩·`headers()` 이전이 따라온다(R21).
- 콘텐츠 문구 일체(`Experiences` 라벨, `TODO(confirm)` 두 곳): 작업 계획서 소관.
- 다크 모드·디자인·섹션 순서: 지시.
- `npm run preview`/deploy 로 P0 최종 확인: 이 세션 금지(D-4).

## What already exists

- `packages/shared/src/markets.ts` — 호스트·`LANGUAGE_ALTERNATES`(홈 전용). **재사용·확장**: 경로 헬퍼를 여기에 더한다(D5).
- `@opennextjs/cloudflare` `staticAssetsIncrementalCache` — 내장 override. **재사용**(D3).
- `next/image` `preload` prop, `not-found.tsx` 규약, `robots`/`sitemap` 규약 — **재사용**(D9, D11).
- `apps/router/src/index.test.ts` — `node --test` 패턴. **확장**(D6/D18/D19).
- `theme.css` `:focus-visible` 규칙 — 스킵 링크가 같은 외곽선을 쓴다(D7).
- 새로 짓는 것: `markets.test.ts`, `scripts/slugs.test.mjs`, `scripts/check-live.mjs`, `not-found.tsx` ×2 — 각각 재사용할 기존 코드가 없다.

## Diagrams

배포·요청 흐름은 1절(Architecture)의 다이어그램. 메타데이터 병합:

```
layout.tsx  metadata { title, description, alternates{canonical:"/", languages}, openGraph{locale,…} }
     │  shallow merge (키 단위로 덮어씀)
     ▼
[slug]/page.tsx  generateMetadata → { title, description, alternates: {canonical: path}, openGraph: {…} }
                                          └─ 이 키가 통째로 대체 → languages 유실 (지금)
수정 후: alternates: { canonical: path, languages: languageAlternates(path) }
        openGraph:  { ...openGraphBase(locale), title, description, url: path, type: "article" }
```

인라인 다이어그램이 필요한 파일: 없음(헬퍼는 순수 함수 세 개).

## Failure modes

| 경로 | 현실적 장애 | 테스트/에러 처리 | 사용자가 보는 것 |
|---|---|---|---|
| 정적 자산 캐시 (D3) | CLI 가 아닌 경로로 배포되어 캐시 미채움 | `check-live.mjs` HIT 단언(D17) + 설정 주석 | 배포 직후 스크립트 실패 — 조용하지 않음 |
| 정적 자산 캐시 | buildId 불일치(캐시 키 ≠ 요청) | 같은 스모크 | 위와 같음 |
| hreflang 헬퍼 (D5) | 경로 결합 오류로 전 페이지 hreflang 오염 | `markets.test.ts` 6 케이스 + 스모크의 hreflang×3 | 테스트 실패 |
| preload (D11) | `loading` 이 남아 세 번째 장에서 throw | 코드 구조(첫 장 `loading` 없음) + `$B` 로 3장 넘김 확인 | 확인 없이는 클라이언트 크래시 — 이 세션에서 E2E 로 본다 |
| 스킵 링크 (D7) | 페이지에 `#main` 없음 | 404 포함 전 페이지에 `id="main"`; curl 404 본문 확인 | 링크가 아무 데도 안 감(조용) — 확인으로 막음 |
| JSON-LD (D12) | 문자열에 `</script>` 포함 | `<` 이스케이프 + 스모크가 JSON.parse | 파싱 실패 시 스크립트 실패 |
| router (D18/19) | 헤더 누락 | 테스트 3개 | 없음(무해) |
| 슬러그 테스트 (D20) | jp 만 고쳤는데 캐시 재생 | 루트 작업 `inputs` | `npm test` 실패 |

**critical gap: 0** — 조용히 실패하면서 테스트도 처리도 없는 경로는 없다(preload 경로는 이 세션의 E2E 확인이 처리다).

## Worktree parallelization strategy

| Step | Modules touched | Depends on |
|------|----------------|------------|
| S1 캐시 설정 | apps/*/open-next.config | — |
| S2 markets 헬퍼+테스트 | packages/shared/src/markets | — |
| S3 앱 메타데이터(레이아웃·페이지·사이트맵·JSON-LD·스킵 링크·404) | apps/*/src/app | S2 |
| S4 공유 컴포넌트(main id, headingAs, preload, theme.css) | packages/shared/src/components, packages/shared/styles | — |
| S5 router | apps/router | — |
| S6 루트 스크립트·turbo·README | scripts, turbo.json, package.json, README | — |

Lane A: S2 → S3 (apps/*/src/app 는 shared 헬퍼에 의존) / Lane B: S4 / Lane C: S5 / Lane D: S1 + S6. 실행: 단일 에이전트라 순차 구현(S1, S2, S3, S4, S5, S6). 충돌 플래그: S3 와 S4 가 `apps/*/src/app/page.tsx`(S3) 와 `project-story.tsx`(S4) 를 각각 만지므로 겹치지 않는다; `theme.css` 는 S4 만.

## Implementation Tasks
Synthesized from this review's findings. Each task derives from a specific finding above. Run with Claude Code or Codex; checkbox as you ship.

- [ ] **T1 (P1, human: ~1h / CC: ~5min)** — apps/kr, apps/jp open-next config — `staticAssetsIncrementalCache` 로 전환하고 배포 경로·composable 주의를 주석에 적는다
  - Surfaced by: Architecture — ARCH-1, OV-2, OV-12
  - Files: apps/kr/open-next.config.ts, apps/jp/open-next.config.ts
  - Verify: 사용자 `npm run preview` → `/projects/cosmonote` 200 + `x-nextjs-cache: HIT`
- [ ] **T2 (P1, human: ~2h / CC: ~10min)** — packages/shared markets — `marketUrl`·`languageAlternates(path)`·`openGraphBase(locale)` + 테스트 6개 + `test` 스크립트
  - Surfaced by: Architecture — ARCH-3; Code quality — 공유 코드 평가; Test — D15
  - Files: packages/shared/src/markets.ts, packages/shared/src/markets.test.ts, packages/shared/package.json
  - Verify: `npm test`
- [ ] **T3 (P1, human: ~1h / CC: ~5min)** — story pages ×4 — `alternates.languages` + `openGraphBase` 스프레드
  - Surfaced by: Architecture — ARCH-3
  - Files: apps/{kr,jp}/src/app/{projects,experience}/[slug]/page.tsx
  - Verify: 빌드 후 curl — hreflang×3, og:locale, og:site_name, canonical 유지
- [ ] **T4 (P1, human: ~30min / CC: ~3min)** — sitemap ×2 — 스토리 항목마다 `alternates.languages`
  - Surfaced by: Architecture — ARCH-3
  - Files: apps/{kr,jp}/src/app/sitemap.ts
  - Verify: 빌드 후 curl /sitemap.xml
- [ ] **T5 (P1, human: ~2h / CC: ~10min)** — layout ×2 — `openGraphBase` 적용, JSON-LD Person+WebSite, 스킵 링크
  - Surfaced by: Architecture — ARCH-3; Code quality — CQ-1, CQ-5
  - Files: apps/{kr,jp}/src/app/layout.tsx
  - Verify: 빌드 후 curl — ld+json 파싱, og:locale:alternate; `$B` Tab → 링크 표시
- [ ] **T6 (P1, human: ~30min / CC: ~3min)** — theme.css — `.skip-link`, `#main:focus-visible`
  - Surfaced by: Code quality — CQ-1, OV-7
  - Files: packages/shared/styles/theme.css
  - Verify: `$B` 포커스 시 좌상단 노출, main 외곽선 없음
- [ ] **T7 (P1, human: ~30min / CC: ~3min)** — `<main id="main" tabIndex={-1}>` ×4 파일
  - Surfaced by: Code quality — CQ-1, OV-7/8
  - Files: apps/{kr,jp}/src/app/page.tsx, packages/shared/src/components/{project-story,experience-story}.tsx
  - Verify: `$B` Enter 후 `document.activeElement.id === "main"`
- [ ] **T8 (P2, human: ~1h / CC: ~5min)** — not-found.tsx ×2 — 마켓 언어 h1 + 홈 링크, `<main id="main" tabIndex={-1}>`
  - Surfaced by: Code quality — CQ-2
  - Files: apps/{kr,jp}/src/app/not-found.tsx
  - Verify: `next start` curl `/projects/nope` → 404 + 문구; 사용자 preview 로 OpenNext 라우팅 경로 확인
- [ ] **T9 (P2, human: ~10min / CC: ~1min)** — project-story Architecture `headingAs="h4"`
  - Surfaced by: Code quality — CQ-3
  - Files: packages/shared/src/components/project-story.tsx
  - Verify: `$B` js 로 헤딩 아웃라인
- [ ] **T10 (P1, human: ~1h / CC: ~5min)** — screen-slider 첫 장 `preload`(loading 없음), image-placeholder `priority`→`preload`
  - Surfaced by: Code quality — CQ-4, OV-6
  - Files: packages/shared/src/components/ui/screen-slider.tsx, packages/shared/src/components/ui/image-placeholder.tsx
  - Verify: 빌드 후 curl `<link rel="preload" as="image">`; `$B` 로 3장 넘기고 콘솔 오류 0
- [ ] **T11 (P2, human: ~1h / CC: ~5min)** — router — `?geo` noindex, 모든 응답 HSTS `max-age` 만, 테스트 3개
  - Surfaced by: Architecture — ARCH-4, D18, D19
  - Files: apps/router/src/index.ts, apps/router/src/index.test.ts
  - Verify: `npm test`
- [ ] **T12 (P2, human: ~1h / CC: ~10min)** — 루트 `scripts/slugs.test.mjs` + turbo `//#check:slugs` + 루트 스크립트
  - Surfaced by: Code quality — CQ-7, D20
  - Files: scripts/slugs.test.mjs, turbo.json, package.json
  - Verify: `npm test` (루트 작업 포함), `npx turbo run check:slugs --dry` 로 inputs 확인
- [ ] **T13 (P2, human: ~2h / CC: ~10min)** — 루트 `scripts/check-live.mjs` + `check:live`
  - Surfaced by: Architecture — ARCH-2, D4, D16, D17
  - Files: scripts/check-live.mjs, package.json
  - Verify: 지금 라이브에 한 번 실행 → 스토리 8×2 에서 실패(현 상태) 를 잡는지
- [ ] **T14 (P2, human: ~20min / CC: ~2min)** — README — resume 문단 교체, `check:live`·배포 경로 한 줄
  - Surfaced by: Code quality — CQ-6, OV-2
  - Files: README.md
  - Verify: 읽기
- [ ] **T15 (P3, human: ~2h / CC: ~20min)** — 검증 — lint/typecheck/test/build, `next start` :7780/:7781, `$B` 홈·스토리·404
  - Surfaced by: 계획서 4절 10, D16
  - Files: —
  - Verify: 결과를 "구현 내역" 에 기록
- [ ] **T16 (P3, human: ~30min / CC: ~5min)** — 이 문서에 "구현 내역"·"미구현·사용자 결정 필요" 추가
  - Surfaced by: 오케스트레이터 절차 6
  - Files: docs/tech-review-2026-09-26.md
  - Verify: 읽기

효율 가정: 설정·문서 ~10x, 테스트 ~10x, 기능 ~10x — 이 저장소는 파일이 작고 패턴이 정해져 있어 기본 비율보다 압축이 작다.

## Unresolved decisions that may bite you later

- **D-2** OG 이미지 자산 — 사용자. 없으면 소셜 카드에 이미지가 없다.
- **D-3** 존 "Always Use HTTPS" — 사용자. 없으면 preload 등재 불가(D18 이 `max-age` 만 보내므로 지금은 무관).
- **D-4** `npm run preview` → 배포 → `npm run check:live` — 사용자. **P0 는 이 답 없이는 닫히지 않는다.**
- (승인됐지만 검토 요청) D8 의 문구 초안 6줄.

## Suppressed findings (appendix)

- [P3] (5/10) `lightbox.tsx:161` 포커스 트랩이 `button` 만 순회 — `<video controls>` 가 트랩 밖으로 나갈 수 있음. 녹화가 있는 갤러리에서만. 미변경.
- [P3] (4/10) `dynamicParams = false` 를 제거하면 요청 시 렌더로 P0 가 우회될 가능성 — 리뷰어도 Next 16 소스에서 강제 지점을 못 찾음. 검증 불가, 채택 안 함.
- [P3] (4/10) OpenNext 가 `x-nextjs-cache` 헤더 이름을 바꿀 가능성 — 스모크가 따라가야 한다.

## Completion summary

- Step 0: Scope Challenge — scope accepted as-is (구조 A, 삭제 제안 없음)
- Architecture Review: 6 issues found
- Code Quality Review: 7 issues found
- Test Review: diagram produced, 20 gaps identified
- Performance Review: 3 issues found (전부 P3, 결정 없음)
- NOT in scope: written
- What already exists: written
- TODOS.md updates: 5 items proposed to user (전부 "이 문서에 기록" — D21–D25)
- Failure modes: 0 critical gaps flagged
- Unresolved decisions: 3 in this review (D-2, D-3, D-4 — 사용자 소관)
- Outside voice: provider codex — unavailable (not installed); native Claude Plan subagent completed with 12 findings (source in-host, outside coverage none)
- Parallelization: 4 lanes, 3 parallel / 1 sequential (단일 에이전트라 순차 실행)
- Lake Score: 16/16 = 10/10 choices / answered coverage choices (D2, D3, D4, D5, D7, D9, D10, D11, D12, D13, D14, D15, D16, D17, D19, D20; kind 선택 D1, D6, D8, D18, D21–D25 제외)

## 구현 내역 (2026-09-26)

작업 트리에만 반영 — 커밋·푸시·배포·preview 없음. 사용자의 미커밋 변경 3개 파일(jp page.tsx, jp portfolio.ts, hero.tsx)은 그대로 두었고, jp `page.tsx` 는 사용자 hunk 의 줄을 바꾸지 않고 `<main>` 여는 태그에 속성만 더했다(`git diff apps/jp/src/app/page.tsx` 로 확인).

| 파일 | 요지 |
|---|---|
| `apps/{kr,jp}/open-next.config.ts` | **P0.** `incrementalCache: staticAssetsIncrementalCache`. 배포 경로 의존(CLI 의 deploy/upload/preview 만 `populateCache`)과 composable 캐시 미지원을 주석에. |
| `packages/shared/src/markets.ts` | `marketUrl`(루트는 슬래시 없는 호스트 — 홈 URL 출력 무변경), `languageAlternates(path)`, `OG_LOCALES`, `openGraphBase(locale)`. `LANGUAGE_ALTERNATES` 는 `languageAlternates()` 로 유지. |
| `packages/shared/src/markets.test.ts` (신규), `packages/shared/package.json` | node --test 6개, `test` 스크립트. |
| `apps/{kr,jp}/src/app/{projects,experience}/[slug]/page.tsx` | `alternates.languages` + `openGraphBase` 스프레드. 경로는 `as const` 로 템플릿 리터럴 타입. |
| `apps/{kr,jp}/src/app/sitemap.ts` | 항목마다 `alternates.languages`; `entry(path)` 헬퍼. |
| `apps/{kr,jp}/src/app/layout.tsx` | `openGraphBase` 적용(`og:site_name`, `og:locale:alternate`), `<head>` 에 JSON-LD `@graph` [Person, WebSite] (sameAs 는 히어로 http 링크 중 경로 있는 것만 — 지금은 자리표시자라 생략됨), `<body>` 첫 자식 스킵 링크. 문구 상수 `PERSON_NAME`/`SKIP_LINK` (D8). |
| `apps/{kr,jp}/src/app/not-found.tsx` (신규) | 마켓 언어 h1 + `next/link` 홈 링크, `<main id="main" tabIndex={-1}>`. 문구 상수 `TITLE`/`HOME` (D8). |
| `apps/{kr,jp}/src/app/page.tsx`, `packages/shared/src/components/{project-story,experience-story}.tsx` | `<main id="main" tabIndex={-1}>`. project-story 의 Architecture `StoryBody` 에 `headingAs="h4"` (오늘은 에세이에 소제목이 없어 출력 무변경; 경험 스토리의 16개 소제목은 종전대로 h2). |
| `packages/shared/styles/theme.css` | `.skip-link`(fixed, 포커스 전 화면 밖), `.skip-link:focus-visible`, `#main:focus-visible { outline: none }`. |
| `packages/shared/src/components/ui/screen-slider.tsx` | 첫 슬라이드 `preload` — `loading` prop 없음(있으면 `get-img-props.js:400` throw). 나머지는 종전 `loading`. |
| `packages/shared/src/components/ui/image-placeholder.tsx` | deprecated `priority` prop → `preload` (호출자 없음). |
| `apps/router/src/index.ts`, `index.test.ts` | `STRICT`(HSTS `max-age=63072000` 만, 모든 응답), `NOINDEX`(`?geo` 만). 테스트 +2 (14개). |
| `scripts/slugs.test.mjs` (신규), `turbo.json`, `package.json` | 루트 작업 `//#check:slugs` (`inputs`: 두 portfolio.ts + 스크립트, `--dry=json` 으로 확인), 루트 `npm test` = `turbo run test check:slugs`. |
| `scripts/check-live.mjs` (신규), `package.json` | `npm run check:live`: 마켓별 robots/sitemap/모든 URL(200 + `x-nextjs-cache: HIT` + canonical + hreflang×3 + JSON-LD 파싱)/미존재 404, apex 302·no-store·HSTS·딥링크·`/go/ja` 쿠키·`?geo` noindex. |
| `README.md` | resume 문단 삭제 → 배포 경로 주의·`check:live`·R2 자산 한 줄씩. |
| `docs/work-plan-2026-09-26.md` E 절 | 요약 추가(그 절이 예고한 대로). |

**검증.**

- `npm run lint` 통과 · `npm run typecheck` 통과 · `npm test` 통과(router 14, shared 6, 루트 슬러그 1) · `npm run build` 통과(kr·jp 각각 `/`, `_not-found`, 스토리 8개 ●SSG, robots, sitemap). `next build` 는 CLAUDE.md/AGENTS.md 를 다시 쓰지 않았다.
- `next start` :7780(kr)·:7781(jp) 에 잠깐 띄워 확인 후 내림(사용자 dev 포트 :7770/:7771 미접촉, 확인 시점에 리스너 0):
  - curl — 홈: canonical·hreflang×3·`og:locale`·`og:locale:alternate`·`og:site_name`·JSON-LD·스킵 링크·`<main id="main" tabindex="-1">`. 홈 URL 표기는 종전과 동일(`https://kr.ballbot.dev`).
  - curl — `/projects/healix`, `/experience/bigint-migration` (kr·jp): canonical 자기 경로, hreflang×3(x-default = `https://ballbot.dev/<path>`), `og:type=article` + locale/site_name, 제목·설명 유지.
  - curl — `/projects/nope`: 404, `noindex`, 마켓 언어 h1(kr "페이지를 찾을 수 없습니다." / jp 「ページが見つかりません。」), `<main id="main">`, `<title>` 하나.
  - curl — `/sitemap.xml`: 항목마다 `xhtml:link` 3개.
  - `$B` — kr 홈 콘솔 오류 0; Tab 1회 → `A.skip-link`(화면 안, 좌상단) → Enter → `document.activeElement` = `MAIN#main`, outline none. JSON-LD·OG 파싱 확인. jp 홈: Tab → 「本文へ移動」. 404 페이지에서도 스킵 → `MAIN#main`.
  - `$B` — `/projects/healix`: 첫 장 `<img>` 에 `loading` 없음, 둘째 장 eager, 셋째 lazy; 다음 버튼 3회 → 카운터 01/03 로 순환, 콘솔 오류 0(WebGPU 경고는 브라우저 것). 헤딩 아웃라인 H1 › H2.
  - **관찰.** 스토리 페이지 `<head>` 의 `<link rel="preload" as="image">` 는 2개(첫 장과 둘째 장). 둘째 장은 `preload` 없이 `loading="eager"` 인데도 링크가 있다 — next/image 는 그 장에 preload 를 내지 않지만(`get-img-props.js:587` `preload: preload || priority`), React 19 의 SSR 이 lazy 가 아닌 `<img>` 를 스스로 preload 한다(Next 에 번들된 `react-dom-server.*.production.js` 의 `<img>` 처리에 `"lazy" === props.loading` 분기). 변경 전(첫 두 장 모두 eager)에도 같은 두 링크가 있었을 것이다. 따라서 이 변경의 `<head>` 출력 효과는 사실상 없고, 얻은 것은 Next 16 문서가 지정하는 명시적 API(`preload`)와 deprecated `priority` 경로 제거다. dev 서버가 내려가 있어 원래의 LCP 콘솔 경고는 재현하지 못했다.
  - 스크린샷: 스크래치패드 `shots/` (kr 홈 스킵 링크, healix, 404, jp 홈, jp aws-cost).
- `npm run check:live` 를 **현재 프로덕션**에 한 번 실행: 70개 실패 — 스토리 8×2 의 404·MISS·canonical, 홈의 MISS·JSON-LD 부재, apex HSTS·`?geo` noindex 부재. 즉 오늘의 결함을 정확히 잡는다. 배포 후 0 실패가 목표.

## 미구현·사용자 결정 필요

1. **D-4 · P0 검증과 배포(사용자).** `apps/kr` 에서 `npm run preview` → `curl -I http://localhost:8787/projects/cosmonote` 가 `200` + `x-nextjs-cache: HIT`, `/projects/nope` 가 404 + 한국어 문구인지 확인 → `npm run deploy`(세 Worker) → `npm run check:live` 가 0 실패. **맨 `wrangler deploy` 로 배포하면 스토리가 다시 404 가 된다.**
2. **D-2 · OG 이미지(사용자).** 1200×630 이미지가 있으면 `apps/{kr,jp}/src/app/opengraph-image.png` 로 넣는다(파일 규약). 없으면 텍스트 카드만.
3. **D-3 · 존 설정 "Always Use HTTPS"(사용자).** `http://ballbot.dev` 가 같은 호스트 https 로 먼저 가야 HSTS preload 등재 요건을 채운다. apex HSTS 는 `max-age` 만 보냈다(D18) — 등재를 원하면 그 뒤에 `includeSubDomains; preload` 로 올린다(비가역).
4. **문구 검토(D8).** 레이아웃·not-found 의 상수 6줄: kr "본문으로 건너뛰기" / "페이지를 찾을 수 없습니다." / "홈으로", jp 「本文へ移動」 / 「ページが見つかりません。」 / 「ホームへ」. 콘텐츠 검토가 끝나면 `portfolio.ts` 로 옮기는 것이 원칙(R19).
5. JSON-LD `sameAs` 는 GitHub 링크가 `https://github.com/` 자리표시자라 비어 있다 — 작업 계획서 A1 이 고치면 자동으로 들어간다.
6. HTML Cache Rule 을 켤 때 `cachePurge` 설정(R20), `output: "export"` 재구조화 검토(R21) — 기록만.
7. `TODO(confirm)` 2곳(portfolio.ts kr:712, jp:714) — 콘텐츠 검토 소관.

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | — |
| Outside Review | codex `/plan-eng-review` outside voice (native fallback: Claude Plan subagent, in-host) | Independent 2nd opinion | 1 (this run) | unavailable (codex not installed; native fallback issues_found) | 12 findings, 12 dispositioned (5 new decisions D17–D20 + records) |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 (this run; logged after read-back) | ISSUES OPEN | 36 issues, 0 critical gaps |
| Design Review | `/plan-design-review` | UI/UX gaps | 0 | — | — |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 | — | — |

- **OUTSIDE COVERAGE:** provider codex, phase plan-review, completion state unavailable (CLI not installed); native Claude Plan subagent (same harness, model identity unknown) completed with 12 findings — does not count as outside coverage.
- **VERDICT:** No review CLEAR — Eng Review ISSUES OPEN (all 36 mapped to T1–T16, 3 user-owned decisions remain); eng review required.

**UNRESOLVED DECISIONS:**
- D-2 OG 이미지 자산 (사용자)
- D-3 Cloudflare 존 "Always Use HTTPS" (사용자)
- D-4 `npm run preview` 로 P0 확인 후 배포·`npm run check:live` (사용자)
