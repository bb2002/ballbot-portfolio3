---
name: how-to-portfolio-to-pdf
description: ballbot.dev 포트폴리오(kr·jp) 전체를 A4 가로 PDF 한 권으로 다시 인쇄·검증해 R2(assets.ballbot.dev)에 올리고, 히어로의 「PDF ↓」가 내려주는 파일을 사이트와 맞출 때 쓴다. 사이트 내용이나 인쇄 레이아웃이 바뀌어 PDF 가 뒤처졌을 때, 또는 PDF 를 처음 올릴 때.
---

# 포트폴리오를 PDF 로 — 인쇄 · 검증 · R2 반영

이 문서 하나만 읽고 끝까지 할 수 있게 썼다. 순서대로 따라가면 된다. PDF 는 **배포와 별개**다(2026-09-27 사이트 주인 결정). 사이트를 배포해도 PDF 는 그대로이고, 둘이 잠시 어긋나는 건 괜찮다. 이 절차가 그 어긋남을 빨리 메우는 도구다.

## 0. 요약 — 이 순서를 건너뛰지 않는다

```bash
# 저장소 루트에서
npm install                          # 처음 한 번
npx playwright install chromium      # 처음 한 번 (브라우저 내려받기)
brew install poppler                 # 처음 한 번 (쪽 PNG·두 번째 리더 — 없으면 FAIL)
npx wrangler r2 bucket list          # ballbot-assets 가 보이면 R2 권한 OK (CDN 은 건드리지 않음)
T=$(mktemp -d)                       # 임시 폴더. 에이전트는 자기 scratchpad 를 T 로 써도 된다
                                     #   에이전트: 셸 변수는 도구 호출 사이에 남지 않는다. T 의 실제 경로를 적어 두고
                                     #   매 호출 맨 앞에 T=<그 경로>; : "${T:?}" 를 붙인다 (mktemp 를 다시 부르면 새 빈 폴더다)

npm run pdf                          # kr·jp 라이브 사이트의 /print 를 인쇄하고 자동 검사
                                     #   사이트가 아직 배포 전이면: npm run pdf -- --local
# 1) 공개본을 R2 API 로 받아 쪽별 비교 (§4-5)
# 2) 쪽 PNG 를 원본 크기로 본다 (§4-4) — 달라진 쪽은 반드시, 처음이면 전 쪽
# 3) §6 의 눈·수동 열을 끝낸다 (§4-6) — 담긴 미커밋 변경 확인(§5), 남은 프로세스, 독립 검토
# 4) 공개본과 인쇄 날짜만 다르면(§4-7) 주인이 요청하지 않은 한 올리지 않는다
npm run pdf:push                     # 검증을 통과한 그 파일만 R2 에 올리고, 공개 주소로 다시 받아 대조
                                     #   두 시장 다 통과·검토했을 때만 루트에서. 한 시장이라도 인쇄 실패·보류(§5)면
                                     #   통과한 시장만 앱 폴더에서: cd apps/<시장> && npm run pdf:push
rm -rf "$T"                          # 끝나면 — 위에서 mktemp 로 만든 T 만 (scratchpad 를 T 로 썼으면 그 안의 내 파일만)
```

요약 표에 `FAIL` 이 하나라도 있으면 올리지 않는다(도구가 거부한다). `WARN` 은 읽고 판단한다(§9). 인쇄가 오류로 멈추거나 끊긴 시장은 표가 나오지 않고, 폴더에 이전 PDF·쪽 PNG 가 남아도 `report.json` 이 "인쇄 중" 스텁이라 올릴 수 없다 — 그 시장만 다시 인쇄한다(§4-3).

## 1. 무엇을 만드나

| 시장 | 공개 주소 (히어로 링크) | R2 키 (버킷 `ballbot-assets`) | 받으면 저장되는 이름 | PDF 제목 | 2026-09-27 기준 |
| --- | --- | --- | --- | --- | --- |
| kr | `https://assets.ballbot.dev/pdf/kr/portfolio.pdf` | `pdf/kr/portfolio.pdf` | `김수빈_포트폴리오.pdf` | 김수빈 포트폴리오 | 38쪽, 3.8 MiB |
| jp | `https://assets.ballbot.dev/pdf/jp/portfolio.pdf` | `pdf/jp/portfolio.pdf` | `キム・スビン_ポートフォリオ.pdf` | キム・スビン ポートフォリオ | 41쪽, 4.7 MiB |

- **읽는 사람이 받는 것.** 히어로 버튼 줄 끝의 「PDF ↓」(두 시장 같은 문구, 용량은 적지 않는다 — 주인 결정)를 누르면 같은 탭에서 파일이 저장된다. 버킷은 다른 오리진이라 브라우저가 `download` 속성을 무시하므로, **객체 자체의 헤더**가 저장 이름을 정한다.
- **객체 헤더.** `Content-Type: application/pdf` · `Content-Disposition: attachment; filename="portfolio.pdf"; filename*=UTF-8''<시장별 이름 퍼센트 인코딩>` · `Cache-Control: public, max-age=300`. 방문자가 실제로 받는 `Cache-Control` 은 존의 Browser Cache TTL 때문에 `public, max-age=14400` 이다(§8, 실측).
- **내용.** 1쪽 표지(히어로만) → 홈의 각 화면(kr: Projects · Experience · Certificates · Journey, jp: Journey 가 먼저) → 프로젝트 스토리 4편 → 경험 스토리 4편 → 맨 끝에 푸터. 문서 안 링크(홈 → 각 장, Highlights → 해당 에세이), 바깥 링크(GitHub·저장소 메뉴의 주소·스토어·YouTube 등) 전부 살아 있다. 표지 빼고 모든 쪽 아래 가운데에 `n / N` 쪽번호.
- **기준값(두 시장 같음, 2026-09-27).** 책갈피 88개 = 단계별 9 / 33 / 28 / 18. 바깥 주소 19개, 호스트는 `github.com`, `cosmonote.site`, `apps.apple.com`, `play.google.com`, `www.youtube.com` 뿐. 사이트의 링크·동영상 35개(그중 8개는 WATERFLAKE 카드와 스토리의 저장소 메뉴 안) 전부 PDF 의 제 부분에 짝이 있다. 사이트 글 줄 kr 304 / jp 307, 그림 62.
- **2026-09-27 기준 장별 쪽.** kr: 1–7 홈 · 8–16 코스모의 노트 · 17–23 enqor · 24–25 HEALIX · 26–28 WATERFLAKE · 29–31 / 32–34 / 35–36 / 37–38 경험 4편. jp: 1–7 홈 · 8–16 · 17–24 · 25–26 · 27–30 · 31–33 / 34–36 / 37–38 / 39–41.

## 2. 어떻게 동작하나

각 앱에는 `/print` 라우트가 있어 홈 화면과 스토리 8편을 한 페이지에 이어 붙인다(색인 제외, 사이트맵 제외). `packages/shared/scripts/render-pdf.mjs` 가 그 페이지를 Playwright 의 Chromium 으로 **A4 가로, scale 0.85(데스크톱 1320px 레이아웃)** 로 인쇄한다. 인쇄 전에 페이지 안에서 장마다 id 를 이름공간으로 나누고(`chapter-projects-enqor--story-essay-0`), 스토리 주소로 가는 링크는 PDF 안의 해당 장(주소에 `#자리` 가 있으면 그 장 안의 그 자리)으로, 나머지 같은 호스트 링크는 공개 주소로 바꾼다. 사진은 JPEG 로 바꿔 넣어 용량을 절반으로 줄인다(투명 PNG 는 그대로). 인쇄 뒤 `printed-pdf.mjs` 가 Chromium 이 틀리게 쓴 부분을 증분 업데이트로 고친다 — 문서 안 링크의 도착 위치(scale·위 여백 미반영), 책갈피 제목(줄바꿈 공백·후리가나). 그다음 파일·쪽·링크·책갈피·글꼴을 읽어 검사하고, 사이트의 각 페이지(화면 모드, 링크 메뉴는 하나씩 열어 본다)를 따로 열어 글·링크·그림이 인쇄 문서(`/print` 의 DOM)의 **그 페이지 부분**에 다 있는지 대조한다. poppler 로 쪽 PNG 를 만들고, 두 번째 리더로 다시 읽고, 일본어 줄 머리·끝 규칙(禁則)을 본다. 결과는 앱의 `pdf/` 폴더에 남고, `--push` 는 그 폴더의 검증된 파일만 wrangler 로 R2 에 올린 뒤 공개 주소에서 다시 받아 대조한다.

| 파일 | 역할 |
| --- | --- |
| `apps/{kr,jp}/src/app/print/page.tsx` | `/print` — 홈 + 스토리 8편을 한 문서로 |
| `packages/shared/src/components/print-chapter.tsx` | 장 하나(`data-chapter`=스토리 경로, id=`chapter-…`) |
| `packages/shared/src/components/ui/screen-sheet.tsx` | 인쇄 전용: 슬라이더의 나머지 화면을 한 판에 |
| `packages/shared/styles/theme.css` 맨 끝 "Print" 절 | `@page`(A4 가로, 여백 10mm/0/12mm, 쪽번호), 표지(`@page cover`), 화면·장마다 새 쪽 |
| 각 컴포넌트의 `print:` 유틸리티 | 무엇을 숨기고, 어디서 쪽이 끊기지 않게 할지 (`project-story.tsx`, `experience-story.tsx`, `ui/story-body.tsx`, `ui/screen-slider.tsx`, `ui/project-links.tsx`, `hero.tsx`, `nav-bar.tsx` …) |
| `packages/shared/scripts/render-pdf.mjs` | 인쇄 · 검사 · 쪽 PNG · 업로드 · 원격 대조 (`npm run pdf`, `npm run pdf:push`) |
| `packages/shared/scripts/printed-pdf.mjs` | 의존성 없는 PDF 리더 + 교정(증분 업데이트) + 측정 |
| `apps/{kr,jp}/src/content/portfolio.ts` → `hero.actions.download` | `{ label: "PDF ↓", href: asset("/pdf/<시장>/portfolio.pdf"), filename, title }` — 저장 이름·PDF 제목은 **여기 한 곳**에만 쓴다. 도구는 저장 이름을 렌더된 링크에서, 제목을 `/print` 의 `<title>`(인쇄 라우트가 같은 항목으로 만든다)에서 읽는다. 키는 코드에도 고정돼 있어(`downloadLink`) 링크가 다른 키를 가리키면 인쇄도 업로드도 거부한다 |
| `packages/shared/src/content-types.ts` → `HeroDownload` | 위 필드의 타입과 설명 |
| `scripts/check-live.mjs` | 배포 뒤 라이브 홈의 PDF 링크 → 버킷 객체 200·PDF·저장 이름 확인 |
| `apps/{kr,jp}/pdf/` (gitignore) | 결과물: `portfolio.pdf`, `report.json`, `pages/page-NN.png`, `contact-N.png`. 인쇄가 도는 동안과, 실패·중단 뒤에는 `report.json` 이 스텁이다(`rendering`: pid·시작 시각, 마지막 업로드 기록 `lastPush`, `render.incomplete` FAIL) — 올릴 수 없고, 같은 폴더로 두 번째 인쇄도 거부된다. 올리는 동안에는 `report.json` 에 `pushing`(pid·시작 시각)이 붙어, 그 폴더로 인쇄도 두 번째 업로드도 거부된다 |
| 루트 `package.json` / `turbo.json` | `npm run pdf`·`npm run pdf:push` 가 두 시장을 동시에 (`--` 뒤 플래그는 두 작업에 다 전달, `--continue` 라 한 시장이 실패해도 다른 쪽은 끝까지 간다 — 종료 코드는 0 이 아님) |

**도구와 이 문서는 커밋·배포돼 있다**(2026-09-27). 그러니 `git status --short` 에 보이는 변경은 모두 누군가의 미커밋 편집이다. 무엇이 PDF 에 담기는지는 파일 개수가 아니라 **콘텐츠 diff** 로 판단한다(§5).

## 3. 준비물

1. **Node·의존성.** 저장소 루트에서 `npm install`. Playwright 는 `packages/shared` 에 **1.62.1 고정**(이 버전의 Chromium 이 쓰는 PDF 모양만 읽는다 — 올리지 말 것).
2. **Chromium.** `npx playwright install chromium` — 기계마다 한 번. 없으면 도구가 `Chromium would not start` 로 멈춘다.
3. **poppler.** `brew install poppler` (Linux: `apt install poppler-utils`). `pdftoppm` 으로 쪽 PNG·한눈에 보기를, `pdfinfo` 로 두 번째 리더 검사(쪽수·제목·문서 안 링크의 목적지)를, `pdftotext` 로 禁則 검사를 한다. **없으면 `file.poppler` 가 FAIL** 이라 올릴 수 없다 — 볼 이미지도, 두 번째 리더도 없기 때문이다.
4. **wrangler 로그인.** `npx wrangler login`(OAuth) 또는 R2 쓰기 권한이 있는 `CLOUDFLARE_API_TOKEN`. 확인은 **API 로만**: `npx wrangler r2 bucket list` 에 `ballbot-assets` 가 보이면 된다. `assets.ballbot.dev` 주소를 열어서 확인하지 말 것(§8).
5. 선택: `python3` + PyMuPDF(`pip install pymupdf`) — §6 의 쪽별 비교·책갈피 트리·세 번째 리더 스니펫. macOS 의 `swift`(PDFKit) — 네 번째 리더.

## 4. 빠른 갱신 절차

1. **소스를 정한다** (§5). 사이트가 배포돼 있고 최신이면 기본(라이브). 배포 전 변경을 담아야 하거나 라이브에 `/print` 가 없으면 `--local`.
2. **인쇄·검증.** 루트에서 `npm run pdf` (또는 `npm run pdf -- --local`). 한 시장만: `cd apps/kr && npm run pdf`. 로컬 빌드 포함 두 시장 합쳐 보통 1분 안팎(빌드 캐시가 없으면 몇 분). **같은 앱을 두 번 동시에 돌리지 않는다** — `.open-next/`·`.wrangler/`·`pdf/` 를 같이 쓴다. 같은 결과 폴더로 두 번째 인쇄가 시작되면 도구가 거부한다(`another render is writing to …` — 먼저 것의 pid·시작 시각). 그 폴더를 `pdf:push` 가 올리는 중이어도 거부한다(`a push from … is under way` — 올리는 파일을 지우고 업로드 기록을 옛 기록으로 덮게 되므로). 다른 `--out` 으로 같은 앱을 `--local` 두 번 돌리는 건 도구가 막지 못한다.
3. **요약 표를 읽는다.** 줄마다 `상태 항목번호 검사id 설명`. 마지막 줄에 쪽수와 이전 인쇄와의 비교(`the same bytes` / `the same but for its print date` — Chromium 이 인쇄마다 새로 찍는 날짜만 다른 같은 문서 / `different bytes`), 용량, sha256 앞 12자리, FAIL·WARN 수. `FAIL` → §7·§9 로 고치고 다시 2. `WARN` → §9 에서 판단. 전체 기록은 `apps/<시장>/pdf/report.json` (검사마다 status·detail, `sha256`, 날짜를 뺀 `undated`, 소스 URL, 시각, 장별 쪽, 그리고 `git` — `--local`(빌드 포함)일 때만: 빌드 직전의 HEAD·dirty·이 시장 콘텐츠의 미커밋 diff(`git.content`: sha256·파일·바뀐 줄). 라이브·`--url`·`--no-build` 는 무엇으로 빌드된 서버인지 도구가 알 수 없어 `git` 이 `null` 이고, 같은 내용이 `checkout` 에 들어간다 — 작업 트리일 뿐, 인쇄된 것이 아니다).
   **인쇄가 오류로 멈추면** 표 대신 오류 한 줄이 나오고(루트 실행이면 turbo 끝줄 `Failed: @ballbot/<시장>#pdf`), `--local` 이면 `every process this run started has stopped` 한 줄이 따른다. 그 시장의 폴더에는 이전 인쇄의 PDF·쪽 PNG 가 그대로 있지만 `report.json` 은 스텁이라 `pdf:push` 가 거부한다 — 그 시장만 다시 인쇄해 성공시킨 뒤 4 부터 다시 한다. 실패·Ctrl+C 뒤에는 §6 "남은 프로세스" 스니펫을 돌린다.
4. **쪽을 원본 크기로 본다 — 생략 금지.** `apps/<시장>/pdf/pages/page-NN.png`(110dpi)를 한 장씩 연다(에이전트는 Read 도구로 PNG 를 볼 수 있다). `contact-N.png`(한 장에 16쪽)는 흐름을 훑는 용도일 뿐, 그 크기에서는 본문 글자가 몇 픽셀이라 잘림·겹침·흐린 블록·禁則을 볼 수 없다. **어느 쪽을 봐야 하나:** 공개본이 없거나(처음 올림) 쪽수가 바뀌었으면 전 쪽. 아니면 5 의 비교에서 달라진 쪽 전부 + 그 앞뒤 쪽 + 표지. 픽셀·글자가 공개본과 같은 쪽은 공개할 때 이미 검토된 것이다. 더 크게: `pdftoppm -r 200 -png -f 12 -l 12 apps/kr/pdf/portfolio.pdf "$T/kr-p12"`. 볼 것은 §6 항목 2·3.
5. **공개본과 쪽별 비교 — 필수(공개본이 있으면).** 폴더에는 마지막 결과만 남으므로 공개본은 **R2 API 로** 받는다. 공개 주소(`https://assets.ballbot.dev/…`)를 curl 하지 않는다: 올리기 전의 키라면 404 가 4시간 박히고, 있는 키라도 그 요청이 응답한 colo 에 옛 사본을 300초 더 붙잡아둔다(§8).
   ```bash
   (cd apps/kr && npx wrangler r2 object get ballbot-assets/pdf/kr/portfolio.pdf --remote --file "$T/old-kr.pdf")
   shasum -a 256 "$T/old-kr.pdf"          # R2 에 지금 있는 파일 — report.json 의 lastPush.sha256 과 같아야 정상
   ```
   키가 아직 없으면 `The specified key does not exist.` 로 끝날 뿐 아무 해가 없다(= 처음 올림, 4 에서 전 쪽을 본다). 받은 파일로 §6 의 "쪽별 비교" 스니펫을 돌린다. 달라진 쪽마다 **왜** 달라졌는지 설명할 수 있어야 한다(콘텐츠 변경이면 어느 커밋 또는 어느 미커밋 편집(§5)에서 왔는지).
6. **§6 의 눈·수동 열을 끝낸다.** 2·3(쪽 확인, 위 4), 담긴 미커밋 콘텐츠 변경이 없는지(§5), 10(남은 프로세스·임시 폴더), 사이트 코드를 바꿨으면 11, 12(독립 검토). 이걸 끝내기 전에는 7 로 가지 않는다.
7. **올린다.** 두 시장 다 통과·검토했으면 루트에서 `npm run pdf:push`. 한 시장만: `cd apps/jp && npm run pdf:push` — 바뀐 시장만 올려도 되고, **한 시장이라도 인쇄가 실패했거나 보류(§5)면 루트 명령을 쓰지 않고** 통과한 시장만 이렇게 올린다(루트 명령은 두 시장을 다 올린다). 도구는 `report.json` 이 없거나, 다른 시장의 것이거나(`--out` 으로 다른 시장 폴더를 줌), 그 폴더의 인쇄가 도는 중이거나 끝나지 않았거나(스텁 — 폴더의 PDF 는 그 전 인쇄의 것), 같은 폴더를 다른 `pdf:push` 가 올리는 중이거나, FAIL 이 있거나, `--url` 로 찍은 것이거나, PDF 의 sha256 이 보고서와 다르면(검증 뒤 파일이 바뀜) **올리지 않는다**. 키는 링크에서 읽고, 승인된 `pdf/<앱 폴더 이름>/portfolio.pdf` 가 아니면 거부한다. 푸시 첫 줄의 `rendered <시각>` 이 방금 검토한 인쇄의 시각인지 본다. 실패하면 최대 4번 시도(재시도 3번, 1·3·9초 간격). 올리자마자(되받기 전에) `report.json` 의 `push` 에 기록하고, `lastPush` 는 올리지 않은 인쇄·실패한 인쇄를 몇 번 거쳐도 다음 보고서로 넘어간다. 그래도 **R2 에 무엇이 있는지의 기준은 R2 자신이다** — 5 의 `wrangler r2 object get` + `shasum`. 폴더는 "마지막 인쇄", R2 는 "마지막으로 올린 것".
   **날짜만 다르면 올릴 필요가 없다.** 5 의 비교에서 달라진 쪽이 없고, 인쇄 요약 끝에 `the same document as the one pushed at … but for its print date` 가 나오면(또는 `cmp -l` 로 공개본과 8바이트 안팎, `pdfinfo` 의 날짜만 다름) 올려도 PDF 속 날짜만 바뀐다. 주인이 올리라고 하지 않았으면 올리지 않고 그렇게 보고한다.
8. **원격 대조 결과를 읽는다.** `remote.object` PASS 필수 — `?v=<sha 앞 12자리>-<올린 시각(밀리초, 36진법)>`(실제 주소는 `report.json` 의 `remote.busted.url`)으로 캐시를 피해 받은 바이트의 sha256·`application/pdf`·저장 이름이 우리 것과 같다. `remote.edge` 는 쿼리 없는 공개 주소를 **한 번** 받아 본 결과다. 엣지 캐시는 데이터센터(colo)마다 따로라, PASS 는 "응답한 colo(예: SJC)는 새 파일을 준다"는 뜻이고, 다른 colo 는 옛 사본을 마지막으로 받아 간 때부터 최대 300초 더 줄 수 있다. 괄호 안의 캐시 상태가 `MISS`·`HIT`·`EXPIRED`·`REVALIDATED` 중 무엇이든 새 파일이면 정상이다(`EXPIRED` = 그 colo 가 300초 지난 사본을 갖고 있다가 R2 에서 새로 받아 옴, 다시 올린 직후 흔하다, §8). WARN = 응답한 colo 가 아직 옛 사본(최대 5분). FAIL = 200 이 아닌 응답(업로드 전에 박힌 404 등, §8). 받은 헤더(`cf-ray` 포함)는 `report.json` 의 `remote` 에 있다.
9. **주인에게 보고** (§12 양식). 그리고 §0 에서 `mktemp` 로 만든 `T` 를 지운다(`rm -rf "$T"` — 공개본 사본·스니펫 결과가 들어 있다. scratchpad 를 T 로 썼으면 그 안의 내 파일만).

## 5. 소스 고르기 — 라이브 vs `--local`

| 플래그 | 무엇을 인쇄하나 | 언제 |
| --- | --- | --- |
| (없음) | `https://kr.ballbot.dev/print`, `https://jp.ballbot.dev/print` — 읽는 사람이 보는 그 사이트 | 사이트가 배포돼 있고 PDF 만 뒤처졌을 때. 기본 |
| `--local` | 앱을 직접 빌드(`npm run sync-public` → `opennextjs-cloudflare build`)하고 `opennextjs-cloudflare preview` 를 빈 포트에 띄워 인쇄 | ① 라이브에 `/print` 가 없을 때 — 도구가 `/print answered 404 … npm run pdf -- --local` 로 알려준다(처음 올릴 때가 이 경우였다) ② 배포 전 변경을 PDF 에 먼저 담을 때. 이때 PDF 가 사이트보다 **앞서므로** 주인에게 알린다 |
| `--local --no-build` | 이미 있는 `.open-next` 를 그대로 | 방금 같은 트리로 빌드했을 때만. 오래된 빌드를 찍을 위험이 있어 기본은 늘 새로 빌드한다 |
| `--url <base>` | 이미 떠 있는 서버 | 인쇄 CSS 를 고치며 빠르게 볼 때: `npm run dev`(kr :7770, jp :7771) 후 `cd apps/kr && npm run pdf -- --url http://localhost:7770 --out "$T/pdf-try"`. **`pdf:push` 는 `--url` 로 찍은 보고서를 거부한다** — 올릴 파일은 라이브나 `--local` 로 다시 찍는다 |
| `--out <dir>` | 결과 폴더 변경 (`--push` 도 그 폴더에서 읽는다 — 요약 끝의 안내가 `-- --out <dir>` 을 붙여준다) | 실험용. **앱 폴더에서 한 시장에만, 저장소 밖 절대 경로로**(`--out "$T/pdf-try"`) 쓴다. turbo 는 시장마다 그 앱 폴더에서 작업을 돌리므로, 루트에서 절대 경로를 주면 두 시장이 같은 폴더를 받아 서로의 결과를 지우고, 상대 경로는 (루트에서든 앱 폴더에서든) 앱 폴더 안에 생겨 gitignore(`/apps/*/pdf/` 만) 밖이다 |

`--local` 은 `.wrangler/` 와 `.open-next/` 를 앱 폴더에 만든다(둘 다 gitignore). 로컬 인쇄 결과도 사이트와 한 빌드에서 나오므로 내용 대조(§6-7)는 **같은 서버의 화면 페이지**와 비교한다.

**주의 — `--local` 은 작업 트리를 있는 그대로 찍는다.** 커밋하지 않은 편집까지 PDF 에 들어간다. 올리기 전에 `report.json` 의 `git.content.lines`(이 시장 `src/content` 의 미커밋 diff 줄 — 빌드 직전 그대로)를 본다. 비어 있어야 정상이다. 라이브·`--url`(그리고 `--no-build`)로 찍었으면 `git` 은 `null` 이다 — 배포된 사이트(또는 그 서버, 이미 있던 빌드)를 찍었으므로 이 대조는 해당 없고, `checkout` 은 작업 트리일 뿐 PDF 에 무엇이 담겼는지 말해주지 않는다. 그때는 공개본과의 쪽별 비교(§4-5)로 판단한다.

**`git.content.lines` 에 줄이 있으면**(누군가의 미커밋 콘텐츠 편집이 PDF 에 들어갔다): 주인에게 물을 수 있으면 그 편집을 PDF 에 담아도 되는지 묻는다. 물을 수 없으면(하위 에이전트, 무인 실행) — 공개본과의 쪽별 비교(§4-5)에서 달라진 쪽이 없는 시장(주석만 바뀐 경우 등)만 올리고, 나머지 시장은 **보류**한다. 보류한 시장이 있으면 루트의 `npm run pdf:push` 는 쓰지 않는다 — 두 시장을 다 올린다. 올릴 수 있는 시장만 앱 폴더에서 올린다(`cd apps/<시장> && npm run pdf:push`). 보류한 시장과 그 이유(달라진 쪽 번호, `git.content.lines` 의 줄)를 §12 보고서의 "보류" 줄에 적는다. 남의 미커밋 편집을 되돌리거나 커밋하지 않는다.

## 6. 검증 체크리스트

이 세션에서 한 검증 전부다. **자동**은 `npm run pdf`/`pdf:push` 가 하고, **눈·수동**은 에이전트가 직접 한다. 둘 다 끝나야 올린다(§4-6).

| # | 내용 | 자동 (검사 id · 실패 시) | 눈으로 / 수동 |
| --- | --- | --- | --- |
| 1 | PDF 모양: A4 가로, 쪽수, 용량 예산(15 MiB), 제목 = `/print` 의 `<title>`(= 콘텐츠의 `hero.actions.download.title` 로 만든 것 — 둘이 한 값에서 나오므로 이 검사는 Chromium 이 제목을 옮겨 적었는지를 본다) | `pdf.shape` `pdf.pages` `pdf.size` `pdf.title` · FAIL | 쪽수가 이전과 다르면 바뀐 장을 특히 본다. 제목 문자열이 §1 표와 같은지 눈으로 |
| 2 | 모든 쪽 확인 | `cover.chrome`(화면 전용 요소 9종이 종이에 없음) `sheets.breaks`(표지는 히어로만, 화면·장마다 새 쪽) `sheets.folios`(표지 빼고 쪽번호) `page.reveal`(등장 애니메이션 중간에 멈춘 블록 없음) · FAIL / `page.images`(그림을 인쇄 폭의 2배 이상으로 요청) `text.kinsoku`(줄 머리에 `、。）」ー` 작은 가나 등, 줄 끝에 `（「` 등 없음 — poppler 글자로) · WARN | `pages/page-NN.png` **원본 크기로** 한 쪽씩(§4-4): 표지가 히어로뿐(내비·스크롤 큐·건너뛰기 링크·「PDF ↓」·다른 시장 안내 줄 없음) · 글자 잘림/겹침 없음 · 흐린(반투명)·투명해 빈칸처럼 보이는 블록 없음 · 그림이 다 있고 빈칸·깨짐·뭉개짐 없음 · Journey 세로선이 쪽을 넘어 끊기지 않음(kr 5–7쪽, jp 2–4쪽) · 쪽번호 `n / N` · 마지막 쪽 푸터 위 여백 · **jp**: 전부 일본어 글꼴(두부 □ 없음), 禁則, Journey 제목 후리가나 — 善隣 위 ソンリン, 江原 위 カンウォン(두 곳), 「善隣インターネット⏎高等学校」 줄바꿈 |
| 3 | 쪽 채움: 몇 줄만 남은 쪽, 쪽 끝에 홀로 남은 가로줄·제목 | `sheets.short` `sheets.rules` `sheets.headings` · WARN | 반쯤 빈 쪽은 **장 끝이거나, 다음 쪽으로 통째로 넘어간 그림 또는 `break-inside-avoid` 블록(회고 절·목록 항목·카드 등, §7 목록) 앞**이면 괜찮다. 공개본에서도 같은 모양인 쪽(§4-5 비교에서 안 달라진 쪽)은 이미 받아들여진 것이다. 새로 생긴 반쯤 빈 쪽만 따진다 |
| 4 | 링크: 문서 안 링크는 목적지가 있고 그 제목이 있는 쪽·위치에 도착 / 바깥 링크는 절대 https, localhost·상대경로 없음, 호스트는 §1 의 다섯 곳뿐 / 사이트의 모든 링크(홈 → 각 장, 프로젝트·GitHub·스토어, **링크 메뉴 안의 저장소 주소**, 동영상 줄)가 PDF 의 **그 페이지 부분**에 짝이 있음 / 사이트가 링크하지 않는 주소가 PDF 에 없음 | `links.internal` `links.external` `links.counterparts`(메뉴는 하나씩 열어 주소를 모은다; 짝은 PDF 의 링크여야 하고, 문서 전체가 아니라 그 페이지의 장 안에 **보이는** 앵커여야 한다 — `visibility:hidden`·`opacity:0` 인 앵커는 Chromium 이 링크를 쓰지 않으므로 없는 것으로 본다. 장 안인지는 PDF 의 쪽이 아니라 `/print` 의 DOM 으로 판단한다 — 조상에 잘려(`overflow:hidden`·줄 수 제한·`clip-path`) 종이에 안 나오는 앵커는 이 검사가 보지 못하고, 2 의 눈 검토가 잡는다) · FAIL / `links.unexpected` · WARN. 인쇄 전 페이지 안 검사(id 중복, 로컬 인쇄에서 렌더 호스트로 가는 링크, 없는 곳으로 가는 `#` 링크)는 걸리면 즉시 중단 | `links.external` 요약의 호스트 목록이 §1 과 같은지 본다. 선택: 뷰어에서 몇 개 눌러 보기 |
| 5 | 책갈피: 88개, 계층이 자연스럽고(단계별 9/33/28/18) 제목 = 화면의 제목(줄바꿈 자리 공백 유지, 한자·가나 사이는 붙임, 후리가나 미포함) | `outline` · FAIL / `outline.shape`(단계별 개수가 마지막으로 올린 것 — 없으면 이전 인쇄 — 과 다르면) · WARN | 아래 "책갈피 트리" 스니펫으로 트리를 읽는다: 장 제목(1단계) 9개 = 표지 제목 + 스토리 8편, 각 장 아래 절이 화면의 순서대로 |
| 6 | 글꼴: PretendardVariable·PretendardJPVariable(jp)·IBMPlexMono 만, 전부 임베드 (그 밖의 글꼴 = 글리프가 시스템 글꼴로 대체됨) | `fonts` · FAIL | 아래 "글꼴" 스니펫 두 줄 — 이름 목록, 임베드 안 된 줄 없음 |
| 7 | 내용 완결: 사이트맵의 모든 페이지(홈 + 스토리 8)가 문서에 있고, 각 페이지의 모든 글 줄·그림이 문서의 해당 부분에 있다 (의도적으로 뺀 화면 요소 제외) | `content.pages` `content.images`(그림은 그 부분에 **보여야** 한다 — `visibility:hidden`·`opacity:0` 은 없는 것) · FAIL / `content.text` · FAIL — 줄 단위로, **한 줄 전체**가 그 부분의 한 줄로 있어야 하고 사이트에 두 번 있으면 두 번 있어야 한다(짧은 제목·연도·"GitHub" 가 다른 줄 속 글자로 대신 통과하지 않게). 인쇄 쪽 글·그림은 PDF 의 글자층이 아니라 `/print` 의 DOM(`innerText`)에서 읽는다 — 투명(`opacity:0`)하거나 조상에 잘린 글, 조상에 잘린 그림은 종이에 안 나와도 통과하므로, 그건 2 의 원본 크기 눈 검토가 잡는다 / `content.dropped`(뺀 요소 목록이 사이트와 맞는지) · WARN | 뺀 요소 목록은 `render-pdf.mjs` 의 `DROPPED` — 건너뛰기 링크, 내비, 스크롤 큐, PDF 링크, 다른 시장 안내 줄, 스토리의 "목록으로" 링크, 슬라이더 쪽수 "01 / 12", 링크 메뉴 버튼, 동영상 플레이어 |
| 8 | 파일 무결성: 복구 없이 열리고, 두 번째 리더에서도 열리며 문서 안 링크가 풀린다 | `file.structure`(모든 객체 위치·스트림 길이·압축) `file.poppler`(poppler 가 같은 쪽수·제목으로 불평 없이 읽고, 링크가 쓰는 모든 목적지를 우리 리더와 같은 쪽·높이로 찾음 — `pdfinfo -dests`; poppler 가 없으면 FAIL) · FAIL | 선택(있으면): 아래 PyMuPDF(`is_repaired` False, 안 풀린 링크 0), PDFKit 스니펫 |
| 9 | 올린 파일: 공개 주소의 바이트 = 검증한 파일(sha256), `application/pdf`, 저장 이름이 시장별 이름으로 풀림, 방문자가 받는 캐시 헤더와 옛 사본이 남을 수 있는 시간 | `pdf:push` 의 `remote.object` · FAIL / `remote.edge` · PASS·WARN(응답한 colo 가 새/옛 사본) 또는 FAIL(200 이 아님), `report.json` 의 `remote` | 올린 **뒤에만**, 새 쿼리로: `curl -sI "https://assets.ballbot.dev/pdf/kr/portfolio.pdf?v=check-$(date +%s)"` — 바이트 길이·`content-type`·`content-disposition`·`etag` 확인. `cache-control` 은 여기서도 `public, max-age=14400` 으로 보인다(존의 Browser Cache TTL, §8) — 객체 자신의 `public, max-age=300` 은 `report.json` 의 `push.headers`(업로드 인자)로 확인하고, 엣지가 그걸 따르는지는 §8 의 `REVALIDATED` 실측으로 안다. 쿼리 없는 주소를 반복해 받으면 받을 때마다 그 colo 에 사본을 채운다 — 필요할 때만 |
| 10 | 프로세스·임시 폴더 정리: 성공·실패·Ctrl+C 어느 경우에도 preview/workerd/wrangler/Chromium 이 남지 않음, 0 이 아닌 종료 코드, 새 임시 폴더 없음 | `process.cleanup`(`--local` — 도구가 띄운 프로세스 그룹만 본다. 오류로 멈추면 표 대신 `every process this run started has stopped` 한 줄). 빌드·preview·Chromium 에는 실행마다 자기 임시 폴더(`$TMPDIR/render-pdf-*` — 루트 실행도 같은 곳: `turbo.json` 이 `pdf` 작업에 TMPDIR 를 넘긴다)를 주고 끝날 때 지운다 — miniflare·OpenNext 빌드가 남기던 `miniflare-*`·`open-next-tmp*` 도 그 안에 생겼다 사라진다 | 아래 "남은 프로세스" 스니펫(실패·Ctrl+C 뒤에도 반드시): 기계 전체를 보여주므로 **내가 띄운 것만** 판단한다. `npm run dev` 도 workerd 를 띄운다(개발 서버의 플랫폼 프록시). 내 것이 아니면 절대 죽이지 않는다. "임시 폴더" 스니펫: 인쇄 전후 목록의 차이. 다 끝나면 §0 의 `T` 를 지운다(§4-9) |
| 11 | 페이지 깨짐을 고치느라 **사이트 코드를 바꿨다면** | — | `npm run lint && npm run typecheck && npm test` · 아래 "사이트 코드를 바꿨을 때" 스니펫: 인쇄 전용 마크업이 공개 페이지에 없음(명령), 화면 회귀(5개 폭 × 홈 + 스토리 × 로컬/운영 스크린숏을 나란히 본다), 상호작용 목록 · 라이브 소스로 찍으려면 사이트가 먼저 배포돼야 한다 — **배포는 주인의 결정**이고 평소의 `npm run deploy` 로 한다. 그 전엔 `--local` 로 찍는다 |
| 12 | 독립 검토 | — | 하위 에이전트를 띄울 수 있으면: 검토자를 나눠(시각 kr, 시각 jp, 내용+링크, 그리고 이번에 사이트 코드를 고쳤으면(11) 코드) 각자 찾게 하고, **회의론자**가 각 지적을 재현·반박해 본 뒤 살아남은 것만 고친다 |

**독립 검토(12) 하는 법.** 검토자마다 자기 몫만 준다 — 시각 kr: `apps/kr/pdf/pages/` 원본 크기와 §6 항목 2·3 목록 / 시각 jp: 같은 것 + jp 항목 / 내용·링크: 두 `report.json` 과 §6 스니펫 / 코드: 이번 실행에서 내가 고친 부분만 — 11 을 했을 때만(`git diff` 에는 남의 미커밋 편집이 섞여 있을 수 있다, §2). 코드를 안 고쳤으면 코드 검토자는 없다. 각자 "문제, 쪽 번호, 근거(이미지·명령 출력)" 목록을 낸다. 그다음 회의론자 하나에게 그 목록 전부를 주고 **각 지적을 직접 재현해보고 반박하라**고 시킨다. 재현되지 않은 것은 버리고, 재현된 것만 §7 로 고친 뒤 다시 인쇄·검토한다. 하위 에이전트가 없으면 스스로 같은 순서로 한 번 더 본다.

수동 확인 스니펫 (모두 실행해 확인한 명령. 저장소 루트에서, `T` 는 §0 의 임시 폴더 — 에이전트는 호출마다 `T=<그 경로>; : "${T:?}"` 로 다시 정한다. 비어 있으면 `"$T/…"` 가 `/…` 가 된다):

```bash
# 남은 프로세스 — 기계 전체의 해당 프로세스를 보여준다. 내가 띄운 것만 판단한다.
# ([x] 표기는 이 명령 자신이 걸리지 않게 하는 것. 명령줄에 이 단어들을 쓴 내 셸(zsh -c …)이 보이면 그건 남은 게 아니다)
ps -axo pid,ppid,pgid,lstart,command | grep -E '[w]orkerd|[w]rangler|[o]pennextjs|[c]hrome-headless-shell'
lsof -a -d cwd -p <pid>              # 그 프로세스가 어느 폴더에서 떴는지 (apps/kr 이면 kr 앱의 preview·dev)
# 시작 시각(lstart)·폴더·부모(ppid)로 내 실행이 아니면 두고, 주인이나 다른 에이전트의 것일 수 있다고 보고만 한다.
# 임시 폴더 — 인쇄 전에 목록을 떠 두고, 뒤에 새로 생긴 것만 본다
ls -1 "${TMPDIR:-/tmp}" | sort > "$T/tmp-before"; ls apps/*/.wrangler/tmp      # 인쇄 전
ls -1 "${TMPDIR:-/tmp}" | sort | comm -13 "$T/tmp-before" -; ls apps/*/.wrangler/tmp   # 인쇄 뒤
# 기대: 도구 몫으로 새로 생긴 것은 없다. render-pdf-* 가 새로 보이면 SIGKILL 로 끊긴 내 실행의 것 — 지워도 된다.
# com.apple.* 등 다른 프로그램이 그사이 만든 항목이 섞일 수 있다 — 이름으로 가린다.
# swift(아래 PDFKit)는 TemporaryDirectory.* 를 남기므로 TMPDIR="$T" 로 돌린다.
# 이미 있던 miniflare-*·open-next-tmp* 는 예전 실행이나 주인의 wrangler dev 것일 수 있다 — 지우지 않고 보고만 한다.
# .wrangler/tmp 의 dev-*/bundle-* 도 같다: 인쇄 뒤 새로 생긴 것(내 실행이 강제 종료로 남긴 것)만 지우고, 인쇄 전부터 있던 것은 두고 보고만 한다.
# 다 끝나면 §0 의 T 를 지운다: rm -rf "$T" (T 안의 TemporaryDirectory.* 도 함께 — scratchpad 를 T 로 썼으면 그 안의 내 파일만)

# 글꼴 — 이름(PretendardVariable-*·PretendardJPVariable-*(jp)·IBMPlexMono-* 만), 그리고 임베드 안 된 줄(출력 없어야 함)
pdffonts apps/jp/pdf/portfolio.pdf | awk 'NR>2 {print $1}' | sed -E 's/^[A-Z]{6}\+//' | sort | uniq -c
pdffonts apps/jp/pdf/portfolio.pdf | awk 'NR>2 && $(NF-4)!="yes"'

# 책갈피 트리 (들여쓰기 = 단계, 끝 숫자 = 쪽)
python3 -c "import sys,fitz; [print('  '*(l-1)+t, p) for l,t,p in fitz.open(sys.argv[1]).get_toc()]" apps/kr/pdf/portfolio.pdf

# 공개본과 쪽별 비교 (40dpi 흑백 픽셀 + 글자) — 공개본은 §4-5 의 wrangler r2 object get 으로 받은 것
python3 - "$T/old-kr.pdf" apps/kr/pdf/portfolio.pdf <<'EOF'
import sys, fitz
a, b = fitz.open(sys.argv[1]), fitz.open(sys.argv[2])
print("pages", len(a), len(b))
for i in range(min(len(a), len(b))):
    pa, pb = (x[i].get_pixmap(dpi=40, colorspace=fitz.csGRAY) for x in (a, b))
    diff = sum(1 for x, y in zip(pa.samples, pb.samples) if abs(x - y) > 24)
    ta, tb = a[i].get_text().split(), b[i].get_text().split()
    if diff or ta != tb:
        gone, new = [w for w in ta if w not in tb], [w for w in tb if w not in ta]
        print("page", i + 1, "pixels", diff, "text same" if ta == tb else f"TEXT DIFFERS -{''.join(gone)[:60]} +{''.join(new)[:60]}")
EOF
# 출력이 "pages N N" 한 줄뿐이면 모든 쪽이 같다. 파일이 인쇄 날짜만 다른지는 인쇄 요약(undated 해시) 또는 cmp -l(8바이트 안팎)로 본다(§4-7).

# 禁則 교차 확인 — PyMuPDF 로 (자동 검사 text.kinsoku 는 poppler 로 같은 것을 본다; 둘 다 0 이어야 정상)
python3 - apps/jp/pdf/portfolio.pdf <<'EOF'
import sys, re, fitz
head = re.compile(r'^[、。，．・：；？！ー）」』】〕ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮヵヶ々〜]')
tail = re.compile(r'[（「『【〔]$')
hits = []
for i, page in enumerate(fitz.open(sys.argv[1])):
    for block in page.get_text("dict")["blocks"]:
        for line in block.get("lines", []):
            text = "".join(span["text"] for span in line["spans"]).strip()
            if text and (head.search(text) or tail.search(text)): hits.append((i + 1, text[:30]))
print(len(hits), hits[:10])
EOF

# 세 번째 리더 — PyMuPDF (pip install pymupdf)
python3 - apps/kr/pdf/portfolio.pdf <<'EOF'
import sys, fitz
d = fitz.open(sys.argv[1])
print("pages", d.page_count, "| title", d.metadata["title"], "| repaired", d.is_repaired)
print("bookmarks", len(d.get_toc()))
links = [l for p in d for l in p.get_links()]
inside = [l for l in links if l["kind"] in (fitz.LINK_GOTO, fitz.LINK_NAMED)]
print("links", len(links), "| inside", len(inside), "| unresolved", sum(1 for l in inside if l.get("page", -1) < 0))
EOF

# 네 번째 리더 — macOS PDFKit
cat > "$T/pdfkit.swift" <<'EOF'
import PDFKit
let url = URL(fileURLWithPath: CommandLine.arguments[1])
guard let doc = PDFDocument(url: url) else { print("PDFKit could not open it"); exit(1) }
var inside = 0, resolved = 0
for i in 0..<doc.pageCount {
    for a in doc.page(at: i)!.annotations where a.type == "Link" {
        if let d = a.destination ?? (a.action as? PDFActionGoTo)?.destination { inside += 1; if d.page != nil { resolved += 1 } }
    }
}
print("pages", doc.pageCount, "| title", doc.documentAttributes?[PDFDocumentAttribute.titleAttribute] ?? "none",
      "| bookmarks", doc.outlineRoot?.numberOfChildren ?? 0, "top-level | links inside", resolved, "of", inside, "resolve")
EOF
TMPDIR="$T" swift "$T/pdfkit.swift" apps/jp/pdf/portfolio.pdf     # TMPDIR: swift 가 남기는 TemporaryDirectory.* 를 $T 안에
```

**사이트 코드를 바꿨을 때 (항목 11).** 로컬 서버: `--local` 로 방금 빌드했다면 `cd apps/kr && npx opennextjs-cloudflare preview --port 7780 --ip 127.0.0.1` 을 백그라운드로 띄운다(빌드 없이 `.open-next` 를 그대로). 다 보면 그 프로세스 그룹을 내리고 항목 10 으로 확인한다.

```bash
# 인쇄 전용 마크업(ScreenSheet)이 공개 페이지에 실리지 않음 — 모든 줄이 0 이어야 하고, /print 만 0 보다 크다
BASE=http://127.0.0.1:7780
for p in $(curl -s $BASE/sitemap.xml | grep -o '<loc>[^<]*' | sed -E 's#<loc>https?://[^/]+/?#/#'); do
  echo "$(curl -s "$BASE$p" | grep -o 'hidden gap-x-3 gap-y-5' | wc -l | tr -d ' ') $p"
done
echo "print: $(curl -s $BASE/print | grep -o 'hidden gap-x-3 gap-y-5' | wc -l | tr -d ' ')"   # 2026-09-27: 8

# 화면 회귀 — 5개 폭 × 사이트맵의 모든 페이지 × 로컬/운영, 전체 페이지 스크린숏 (약 2분 반, 90장)
mkdir -p "$T/shots" && cd packages/shared && LOCAL=http://127.0.0.1:7780 LIVE=https://kr.ballbot.dev OUT="$T/shots" node --input-type=module - <<'EOF'
import { chromium } from "playwright";
const { LOCAL, LIVE, OUT } = process.env;
const sitemap = await (await fetch(`${LOCAL}/sitemap.xml`)).text();
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
const browser = await chromium.launch();
try {
	for (const width of [375, 768, 1024, 1280, 1512]) {
		const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
		for (const path of paths) {
			for (const [side, base] of [["local", LOCAL], ["live", LIVE]]) {
				await page.goto(base + path, { waitUntil: "load" });
				await page.waitForFunction(() => document.documentElement.classList.contains("hydrated"));
				await page.evaluate(async () => {
					for (let y = 0; y < document.body.scrollHeight; y += 600) {
						scrollTo(0, y);
						await new Promise((done) => setTimeout(done, 60));
					}
					scrollTo(0, 0);
				});
				await page.waitForLoadState("networkidle");
				const name = `${width}-${path === "/" ? "home" : path.slice(1).replace(/\//g, "-")}-${side}.png`;
				await page.screenshot({ path: `${OUT}/${name}`, fullPage: true });
			}
		}
		await page.close();
	}
} finally {
	await browser.close();
}
console.log(`${paths.length} pages × 5 widths × local/live → ${OUT}`);
EOF
```

`<폭>-<페이지>-local.png` 와 `-live.png` 를 나란히 본다. 운영에 아직 배포 안 된 변경만큼은 달라야 정상이다. 그 밖의 차이는 회귀다. jp 는 `apps/jp` 와 `LIVE=https://jp.ballbot.dev` 로 한 번 더.

상호작용 — 로컬 서버에서 직접 눌러 보고 결과를 적는다(1280 폭 한 번, 375 폭 한 번):

| 무엇을 | 어떻게 | 기대 |
| --- | --- | --- |
| 슬라이더 | 프로젝트 스토리 위 무대의 → 버튼, 레일의 썸네일 | 쪽수 `01 / NN` → `02 / NN`, 큰 화면이 바뀌고 레일 썸네일에 `aria-current` |
| 라이트박스 | 무대의 화면·갤러리 썸네일을 누름 | 전체 화면 보기가 열리고 ←/→ 로 넘기며, Esc 로 닫히면 포커스가 누른 자리로 |
| 확대 | 스토리 본문 그림(`ZoomImage`)을 누름 | 라이트박스로 크게 열리고 Esc 로 닫힘 |
| 저장소 링크 메뉴 | WATERFLAKE 카드·스토리의 GitHub(▾) | 저장소 4개 메뉴가 열리고, ↓ 로 첫 항목에 포커스, Esc 로 닫힘, 바깥을 누르면 닫힘 |
| 내비 활성 표시 | 홈에서 각 화면까지 스크롤 | 해당 내비 항목에 `aria-current="location"` |
| PDF 링크 | 히어로 「PDF ↓」 | `href` = `https://assets.ballbot.dev/pdf/<시장>/portfolio.pdf`, `download` = 시장별 파일 이름(§1) |

## 7. 쪽이 깨졌을 때 고치는 법

증상: `sheets.*` WARN, 또는 눈으로 본 반쯤 빈 쪽 · 쪽 끝에 홀로 남은 제목·가로줄 · 장의 마지막 몇 줄만 다음 쪽에 · 다음 장 제목이 밀려 내려감. 공개본에서도 같은 모양인 쪽은 이미 받아들여진 것이니 새로 생긴 것만 고친다. 내용(카피)을 고치지 말고 **인쇄 규칙**(`print:` 유틸리티, theme.css Print 절)을 고친다. 이 세션에서 효과가 확인된 지렛대:

- **그림은 인쇄에서 760px 읽기 폭까지만** — `ui/story-body.tsx` `Figure`: `print:max-w-[760px] print:break-inside-avoid`. 전체 폭이면 들어가지 못한 그림이 통째로 넘어가 쪽을 비운다.
- **에세이 사이 가로줄은 제목 쪽 래퍼에** — `project-story.tsx` `Architecture`: 줄·위 여백을 제목의 `<Reveal>` 에(`print:border-t-[0.5px] print:pt-8`, `print:break-inside-avoid print:break-after-avoid`), `article` 의 원래 테두리는 인쇄에서 끈다. 안 그러면 줄만 앞 쪽 끝에 남는다.
- **덩어리는 `print:break-inside-avoid`** — 목록 항목, 카드, 자격증 칸, 경험 목록 항목, `ZoomImage` 타일, 회고 절, Journey `.jy-event`. **머리는 `print:break-after-avoid`** — `SectionLabel`, `StoryBody` 소제목, 에세이 제목.
- **History(과정) 그림** — 2장 이상이면 `print:grid print:grid-cols-2 print:items-start`, 1장이면 `print:max-w-[600px]`.
- **블록 끝은 padding 이 아니라 margin** — `CLOSE = "pb-14 print:mb-14 print:pb-0"`. Chromium 은 padding 안에서 쪽을 끊지 않아, 마지막 줄은 들어가는데 padding 이 안 들어가면 블록 전체가 넘어간다. margin 은 쪽 경계에서 그냥 사라진다.
- **flex 컨테이너는 margin 을 가둔다 → `print:block`** — 스토리의 `<main>`(`print:block print:min-h-0`)과 Architecture 열. flex 안의 margin 은 쪽 경계까지 못 가서 다음 장 첫 쪽으로 넘쳤다.
- **에세이 블록 간격은 인쇄에서 32px** (`print:gap-8 print:mb-8`, 화면은 40px) — 40 에서는 장의 끝 줄이 새 쪽으로 넘어갔다.
- **효과 없는 것: `SCALE`(0.85) 바꾸기.** 모든 쪽 경계가 한꺼번에 움직이고, 0.9 는 `xl` 아래로 내려가 아카이브·자격증 줄이 접히며, 0.8 은 본문이 9pt 로 작아진다. 건드리지 않는다.

순서: WARN 이 알려주는 쪽·장을 `pages/page-NN.png` 와 앞뒤 쪽으로 본다 → 원인 블록을 찾는다 → 위 지렛대를 해당 컴포넌트에 적용 → `--url` 로 빠르게 반복(§5) → `--local` 로 최종 인쇄·검증 → §6 항목 11 → 올린다. 사이트 배포 여부는 주인에게 묻는다.

## 8. R2 · CDN 함정

- **올리기 전의 키 주소는 절대 요청하지 않는다.** 없는 객체를 한 번이라도 GET/HEAD 하면 엣지가 404 를 약 4시간(`max-age=14400`) 캐시하고, wrangler 로그인 토큰은 존 읽기 권한뿐이라 퍼지할 수 없다. `pdf/portfolio-kr.pdf` 는 이렇게 막혀 버린 키다 — 쓰지 말 것. `render-pdf.mjs` 는 업로드가 끝난 뒤에만 공개 주소를 받는다. `check:live` 는 라이브 홈에 링크가 있을 때만, 그것도 그 시장의 승인된 키(`https://assets.ballbot.dev/pdf/<시장>/portfolio.pdf`)일 때만 요청한다 — 다른 주소면 요청하지 않고 FAIL. **R2 에 무엇이 있는지 보려면 API 로:** `npx wrangler r2 object get ballbot-assets/<키> --remote --file <파일>` — CDN 을 거치지 않고, 없는 키여도 오류로 끝날 뿐이다.
- **승인된 키는 두 개뿐:** `pdf/kr/portfolio.pdf`, `pdf/jp/portfolio.pdf`. 도구에도 고정돼 있다(`render-pdf.mjs` 의 `downloadLink`). 다른 키가 필요하면(파일명 변경 등) 주인 승인 → 코드의 고정값 변경 → 먼저 올리고 → 그다음 링크를 바꿔 배포.
- **엣지 캐시는 colo(데이터센터)마다 따로다.** 같은 기계에서도 요청이 SJC·LAX 등 다른 colo 로 갈 수 있다(2026-09-27 실측: 번갈아 응답). colo 는 응답 헤더 `cf-ray` 끝 세 글자. 그래서 `remote.edge` PASS 는 "응답한 colo 는 새 파일"일 뿐이고, 옛 사본을 받아 간 다른 colo 는 그때부터 최대 300초 더 줄 수 있다. **올리기 직전에 쿼리 없는 공개 주소를 받지 않는다** — 그 요청이 닿은 colo 에 옛 사본을 300초 새로 채워, 올린 뒤에도 그만큼 옛 파일을 주게 만든다(2026-09-27 실제로 있었다: 올리기 53초 전의 curl 때문에 LAX 가 PASS 뒤 4분 동안 옛 파일을 줬다). `npm run check:live` 도 사이트 배포 뒤에는 이 주소를 HEAD 하므로, `pdf:push` 전 5분 안에는 돌리지 않는다.
- **Browser Cache TTL 4시간.** 존 설정이 더 짧은 `max-age` 를 `max-age=14400` 으로 올려서 내보낸다(2026-09-27 실측: 객체는 `max-age=300`, 응답은 `max-age=14400`). 그래서 4시간 안에 이미 받아 간 사람은 새로 눌러도 자기 브라우저 사본을 받을 수 있다. 엣지는 객체의 `max-age=300` 을 따른다 — 2026-09-27 실측: 올린 직후 `cf-cache-status: MISS` → 다음 요청 `HIT`(Age 12–19초) → 6분 뒤 `REVALIDATED`(300초가 지나 ETag 로 R2 에 다시 물음). 다시 올린 직후에는 `EXPIRED` 도 나온다 — 그 colo 가 300초 지난 옛 사본을 갖고 있다가 R2 에서 새로 받아 온 것으로, 새 파일이면 정상이다(2026-09-27 재업로드 때 SJC). 즉 파일을 바꾸면 모든 colo 가 늦어도 5분 안에 새 파일을 준다(올리기 전 5분 동안 쿼리 없는 주소를 건드리지 않았다면 올린 순간부터 5분).
- **검증은 캐시를 피하는 쿼리로.** `?v=<sha 앞 12자리>-<올린 시각(밀리초, 36진법)>`(예: `?v=6f13d2fa06c9-muj9f0qi`, `report.json` 의 `remote.busted.url`)은 아무도 요청한 적 없는 주소라 엣지가 원본(R2)을 준다. 사람이 확인할 때도 `?v=check-$(date +%s)` 처럼 새 쿼리를 붙인다.
- **엣지에 틀린 사본·404 가 박혔을 때 빠른 해결은 하나뿐:** 주인이 Cloudflare 대시보드 → ballbot.dev 존 → Caching → Configuration → Purge Cache → Custom Purge 로 그 URL 을 퍼지. 아니면 기다린다(404 는 최대 4시간, 옛 PDF 는 최대 5분). `remote.edge` 가 FAIL(200 이 아님)이면 404 쪽이다.
- **wrangler 동시 업로드는 2개까지.** kr·jp 동시(=2)는 안전하다. 4개 병렬은 "fetch failed" 가 무더기로 났다.
- `npm run assets:push`(apps/kr/assets → 버킷)는 스크린샷용이고 이 절차와 무관하다. `pdf/` 키를 건드리지 않는다.

## 9. 문제 해결

| 증상 | 원인·해결 |
| --- | --- |
| `Chromium would not start` | `npx playwright install chromium` |
| `…/print answered 404: the live site does not have the print route yet` | 라이브 사이트가 `/print` 를 넣은 뒤로 배포되지 않았다 → `npm run pdf -- --local` |
| `the preview server stopped before it answered` / `did not answer within 120s` | 출력된 로그 꼬리를 본다. 같은 앱의 인쇄가 이미 돌고 있지 않은지(§4-2). 죽다 남은 `workerd` 가 있으면(§6 "남은 프로세스") **내가 띄운 것인지 확인한 뒤에만**(시작 시각·`lsof` 폴더·부모) `kill`. 주인의 `npm run dev` 도 workerd 를 띄운다 — 건드리지 않는다. `.wrangler/` 를 지우고 `--no-build` 없이 다시. 포트·디버거 포트는 도구가 빈 것을 고른다(`--inspector-port 0`) — 두 시장 동시 실행도 충돌 없음 |
| `the page did not finish loading: image …` | 그림 요청이 실패했다. 로컬 preview 의 `/_next/image` 는 `assets.ballbot.dev` 가 준 상태를 그대로 넘기므로 5xx 도 4xx 도 나온다(2026-09-27: 가끔 500, 두 시장 동시 실행 중 403 한 번). 도구는 연결 실패·5xx·403·429 이면 두 번 더 받는다(모두 3번) — 400·404 등은 다시 받아도 같아서 바로 넘긴다. 다시 실행한다 — 두 시장을 같이 돌렸다면 실패한 시장만 앱 폴더에서. 계속되면 출력의 `refused or failed requests` 에 나온 그림 키가 버킷에 있는지 **R2 API 로** 본다: `(cd apps/kr && npx wrangler r2 object get ballbot-assets/<키> --remote --file "$T/probe")`. 공개 주소로 확인하지 않는다 — 없는 키면 404 가 4시간 박힌다(§8) |
| `the page did not finish loading: font …` / `fonts` FAIL | 글꼴 파일이 없다(`public/` 은 생성물 — `--local` 이 `sync-public` 을 돌린다, `--no-build` 를 빼고 다시) 또는 Pretendard 에 없는 글자가 들어갔다: `pdffonts` 로 낯선 글꼴 확인 → 그 글자를 찾아 주인에게 문구 수정을 제안 |
| `another render is writing to … (pid …, since …)` | 같은 결과 폴더로 인쇄가 이미 돌고 있다 — 끝나길 기다린다. 그 pid 가 이미 없거나(`ps -p <pid> -o command=` 가 비었거나 render-pdf 가 아님) 스스로 끝났다면 다시 실행하면 된다(죽은 인쇄의 스텁은 도구가 알아보고 넘어간다) |
| `a push from … is under way (pid …, since …)` (`npm run pdf` 가 거부) | 그 폴더를 `pdf:push` 가 올리는 중이다 — 끝나길 기다린다(되받기까지 보통 1분 안). 그 pid 가 이미 없거나 render-pdf 가 아니면 다시 실행하면 된다(죽은 업로드의 표시는 도구가 알아보고 넘어간다) |
| `pdf:push`: `a push from … is already under way` | 같은 폴더를 다른 `pdf:push` 가 올리고 있다 — 두 번 올리지 않는다. 먼저 것의 원격 대조(`remote`)를 기다린다 |
| `pdf:push`: `… is a render of jp, not of kr` (또는 그 반대) | `--out` 으로 다른 시장의 폴더를 줬다. 콘텐츠는 고치지 않는다 — 그 시장의 앱 폴더에서 올린다(`cd apps/jp && npm run pdf:push`) |
| `pdf:push`: `the last render into … did not finish` / `… is still running` | 그 폴더의 마지막 인쇄가 실패했거나 끊겼다(또는 아직 돈다). 폴더의 PDF·쪽 PNG 는 그 전 인쇄의 것이고 `report.json` 은 스텁이다 — 다시 인쇄해 성공한 뒤 검토하고 올린다 |
| `the link menu "…" opened no items` | 사이트의 링크 메뉴가 눌러도 항목을 그리지 않는다 — `link-menu.tsx` 가 바뀌었는지(항목은 `role="menuitem"` 인 `<a>`) |
| `sheets.short` / `sheets.rules` / `sheets.headings` WARN | §7 |
| `text.kinsoku` WARN | 나열된 쪽을 원본 크기로 본다. 줄 머리의 `、。ー` 등은 대개 인쇄 규칙이 `line-break`/`word-break` 를 덮어쓴 것(theme.css 의 `html[lang="ja"] body { line-break: strict }` 참고) |
| `content.text` FAIL (사이트의 줄이 PDF 에 없음) | 뒤에 붙는 설명으로 가른다. `not in the PDF` — 새로 `print:hidden` 이 됐거나 화면에서만 보이는 요소. 의도한 것이면 `render-pdf.mjs` 의 `DROPPED` 에 이유를 주석으로 달아 추가, 아니면 인쇄 규칙을 고친다. `only inside another` — 그 줄이 종이에서 사라지고 같은 글자만 다른 줄 속에 남았다(제목·연도가 숨었을 때), 또는 인쇄 규칙이 두 줄을 한 줄로 합쳤다. `printed N of the M times` — 두 번 있는 줄 중 하나가 빠졌다 |
| `content.images` FAIL | 인쇄에서 숨었거나 그려지지 않는 그림(`display:none`·`visibility:hidden`·`opacity:0`). 슬라이더(`ScreenSlider`)·`ScreenSheet`·`print:hidden` 확인 |
| `content.dropped` WARN | `DROPPED` 의 선택자가 사이트의 어떤 요소와도 안 맞는다 — 컴포넌트가 바뀌었다. 선택자를 고친다 |
| `links.counterparts` FAIL | `not in the PDF` — 사이트의 링크가 PDF 에 없다: 메뉴 안 링크(`ProjectLinks` 는 인쇄에서 `hidden print:block` 으로 펼친다)나 새 컴포넌트가 인쇄에서 숨었는지. `in the PDF, but not in this page's part of it` — 같은 주소가 다른 장(예: 홈 카드)에만 남고 그 페이지의 장에서는 빠졌거나 그려지지 않는다(`visibility:hidden`·`opacity:0` — 글자는 보여도 누를 수 없다) |
| `links.unexpected` WARN | PDF 에 사이트가 링크하지 않는 주소가 있다 — 화면에서 숨긴 줄이 인쇄에서 보이거나(다른 시장 호스트 등), 인쇄 전용 링크를 새로 넣었다. 의도한 것이 아니면 인쇄 규칙을 고친다 |
| `links.internal` FAIL | 목적지 위치 교정이 어긋났다 — `render-pdf.mjs` 의 `SCALE`·`MARGIN` 이 theme.css `@page` 여백(위 10mm·아래 12mm, 표지 0)과 같은지. 제목이 인쇄에서 숨어 장 첫 쪽이 비어도 이렇게 걸린다 |
| `outline` FAIL | 책갈피와 제목 짝이 안 맞는다 — 제목 구조가 바뀌었는지(`retitleOutline`) |
| `outline.shape` WARN | 단계별 책갈피 수가 마지막으로 올린 것과 다르다 — §6 "책갈피 트리" 로 읽고, 제목이 사라지거나 단계가 바뀐 곳을 찾는다. 콘텐츠를 바꿔 제목이 늘거나 준 것이면 정상(보고서에 적는다) |
| `file.poppler` FAIL | `pdftoppm is not on PATH` → poppler 설치(§3). `poppler lands #… on sheet …` → 증분 업데이트한 목적지를 poppler 가 다르게 읽는다 — `printed-pdf.mjs` 의 `placeDestinations`/`amendPdf` 를 본다 |
| `Chromium's output has changed shape` | Playwright/Chromium 이 바뀌어 PDF 구조가 달라졌다 → `packages/shared/package.json` 의 `playwright` 를 1.62.1 로 되돌리고 `npm install` |
| `pdf:push`: `no report.json` / `the last render failed …` / `is not the file the report checked` | 먼저 `npm run pdf`, FAIL 해결, 렌더 뒤 PDF 를 손대지 말 것 |
| `pdf:push`: `… is of a render off … (url)` | `--url` 로 찍은 보고서는 올리지 않는다 → 라이브나 `--local` 로 다시 찍는다 |
| `the download link's href … is not https://assets.ballbot.dev/pdf/<시장>/portfolio.pdf` | 콘텐츠의 `hero.actions.download.href` 를 `asset("/pdf/<시장>/portfolio.pdf")` 로. 다른 키가 필요하면 주인에게(§8) |
| `wrangler r2 object put failed 4 times` | `npx wrangler login` 다시, `npx wrangler r2 bucket list` 로 권한 확인. API 토큰을 쓰면 turbo 가 `CLOUDFLARE_API_TOKEN`·`CLOUDFLARE_ACCOUNT_ID` 는 넘겨준다 |
| `remote.object` FAIL | 올린 것과 받은 것이 다르다 — 다시 `npm run pdf:push`. `could not be fetched back` 이면 업로드는 이미 됐고(`report.json` 의 `push` 에 기록) 대조만 못 한 것 — 네트워크를 확인하고 다시 `npm run pdf:push`. 계속되면 키·버킷 확인 |
| `remote.edge` WARN | 응답한 colo 가 옛 사본을 준다 — 5분 기다린다. 확인은 새 쿼리로(§6-9). 급하면 대시보드 퍼지(§8) |
| `remote.edge` FAIL (`answers 404 …`) | 업로드 전에 누군가 공개 주소를 요청해 404 가 박혔다 — 1분 뒤 새 쿼리 없이 `curl -sI` 로 한 번 더 보고, 그대로면 주인에게 Custom Purge 를 요청(§8). 4시간이면 저절로 풀린다 |
| `npm run check:live` 의 `links its PDF — the live home page has no download link` | 사이트가 PDF 링크를 넣은 뒤로 배포되지 않았다. PDF 는 올라가 있어도 된다. 배포는 주인의 결정 |
| 루트 `npm run pdf`/`pdf:push` 에서 한 시장만 실패 | `--continue` 라 다른 시장은 끝까지 간다(끝줄 `Failed: @ballbot/<시장>#…`). 인쇄가 실패한 시장의 폴더는 이전 PDF 를 보여주지만 스텁 보고서라 올릴 수 없다 — 그 시장만 앱 폴더에서 다시(`cd apps/jp && npm run pdf …`) 인쇄해 성공시키고, §4-4 부터 다시 본다. 통과한 시장을 먼저 올리려면 그 앱 폴더에서(`cd apps/kr && npm run pdf:push`) — 루트 `pdf:push` 는 쓰지 않는다. 올릴 때 푸시 줄의 `rendered <시각>` 이 검토한 인쇄의 시각인지 본다 |

## 10. 되돌리면 안 되는 결정 (이유 포함)

- **표지에 다른 시장 안내 줄이 없다.** 그 줄은 잘못 들어온 방문자를 위한 출구인데, 한 언어로 건네는 문서에는 떠날 잘못된 호스트가 없다. 내비·스크롤 큐·건너뛰기 링크·「PDF ↓」도 종이에서 뺀다(종이에 저장 버튼은 의미 없음).
- **슬라이더의 첫 화면은 인쇄 한 판(`ScreenSheet`)에서 뺀다.** 무대(stage)가 첫 화면을 이미 크게 싣기 때문이다. 판은 `/print` 에서만(`ProjectStory` 의 `bound`) 그린다 — 공개 스토리 페이지에 넣으면 브라우저에서 인쇄하는 사람은 그림을 안 받아 온 빈 칸을 받고, 모든 방문자가 쓸모없는 마크업을 싣는다.
- **동영상은 종이에서 한 줄 링크**(`https://www.youtube.com/watch?v=…`) — no-cookie 호스트는 임베드만 준다. **링크 메뉴는 인쇄에서 항목을 펼친다.** 누를 수 없는 종이에서도 모든 저장소로 가게.
- **표지는 `@page cover`(이름 붙은 쪽)** 이지 `:first` 가 아니다 — 스토리 한 편을 제 주소에서 인쇄할 때 첫 쪽이 여백·쪽번호 없이 나왔다.
- **A4 가로 · scale 0.85 · 여백 10mm/0/12mm · 쪽번호 IBM Plex Mono 7.5pt.** 0.85 의 이유는 §7.
- **불투명 그림은 JPEG 로, 투명 그림은 그대로.** WebP 를 그대로 넣으면 Chromium 이 무손실로 풀어 넣어 두 배가 된다.
- **책갈피 제목:** 쓰인 줄바꿈 자리는 공백, 단 한자·가나끼리는 붙임(善隣インターネット高等学校), 후리가나는 빼고.
- **PDF 는 배포에 들어가지 않는다.** `deploy`/`upload`/`preview` 스크립트는 원래대로(`opennextjs-cloudflare build && opennextjs-cloudflare deploy|upload|preview`). 둘의 어긋남은 허용, 맞추는 건 이 절차.
- **`Content-Disposition: attachment`** — 다른 오리진에서는 `download` 속성이 무시되므로 객체가 이름을 정한다. `download` 속성은 도구와 `check:live` 가 링크를 찾는 표식이라 남긴다.
- **버튼 문구는 「PDF ↓」, 용량 표기 없음**(주인).
- **jp Overview 의 「希望勤務地 日本全国」 삭제는 주인 지시**(2026-09-27). 되살리지 않는다.
- **제목의 한두 글자 넘김은 그대로 둔다** — 예: jp 16쪽 에세이 제목 「…ノートの品質は守り抜⏎く」, jp Overview 의 「マイグレー⏎ション」. 주인이 `text-wrap: balance` 를 넣지 않기로 했다. 禁則 위반이 아니면 고치지 않는다.

## 11. 하지 말 것

- 이 절차에서 **Worker 를 배포·업로드하지 않는다** (`npm run deploy`, `opennextjs-cloudflare deploy|upload`, `wrangler deploy` 금지). 사이트 배포는 주인의 결정이고 평소 스크립트로 한다.
- 시키지 않으면 **커밋·푸시하지 않는다.** 남의 미커밋 편집을 되돌리지 않는다(§5). 루트의 `untitled.md` 는 건드리지 않는다.
- R2 에는 **`pdf/kr/portfolio.pdf`, `pdf/jp/portfolio.pdf` 두 키만 쓴다.** 다른 키에 쓰지 않고, **어떤 객체도 지우지 않는다.**
- 올리기 전의 키 주소를 열지 않는다. 올리기 직전에 쿼리 없는 공개 주소도 받지 않는다(§8). 공개본이 필요하면 `wrangler r2 object get … --remote`.
- FAIL 이 있는 PDF, 렌더 뒤 손댄 PDF, `--url` 로 찍은 PDF 를 올리지 않는다(도구도 거부한다).
- 같은 앱의 인쇄를 두 번 동시에 돌리지 않고, 올리는 중인 시장을 인쇄하지 않는다(같은 결과 폴더면 도구도 거부한다). `--out` 은 앱 폴더에서, 저장소 밖 절대 경로로만 준다(§5).
- 인쇄가 실패한 시장이나 보류한 시장이 있을 때 루트의 `npm run pdf:push` 를 쓰지 않는다(§4-7).
- 띄운 프로세스는 다 내린다. **내가 띄우지 않은 프로세스는 죽이지 않는다**(§6 "남은 프로세스").

## 12. 주인에게 보고하는 양식

```
PDF 갱신 — kr / jp
- 소스: 라이브 https://kr.ballbot.dev/print  (또는 --local, 커밋 <git HEAD 앞 7자리>)
- 담긴 미커밋 콘텐츠 변경: 없음 (또는 report.json git.content.lines 에서 옮겨 적기) (라이브·--url: 해당 없음 — 배포본/그 서버를 찍음)
- kr <N>쪽 <x.x> MiB sha256 <앞 12자리>, jp <N>쪽 <x.x> MiB sha256 <앞 12자리>  (이전: <N>쪽 / <N>쪽)
- 자동 검사: kr 0 FAIL 0 WARN, jp 0 FAIL 0 WARN  (WARN 이 있으면 내용과 판단)
- 공개본 대비: kr 달라진 쪽 없음 / jp 달라진 쪽 없음  — 달라진 쪽이 있으면 쪽마다 이유 (없으면 인쇄 날짜만 다름 — 올렸는지, 주인 요청이 없어 올리지 않았는지)
- 눈 검토: 달라진 쪽과 앞뒤·표지를 원본 크기로 확인, 이상 없음 (처음이면 전 쪽) (또는 발견 사항)
- 반영: https://assets.ballbot.dev/pdf/kr/portfolio.pdf, …/jp/portfolio.pdf
  원본(?v=) 바이트 = 검증 파일, application/pdf, 저장 이름 김수빈_포트폴리오.pdf / キム・スビン_ポートフォリオ.pdf
  엣지: 응답한 colo <XXX> 는 새 파일, 다른 colo 도 최대 5분 안에 교체. 브라우저 캐시 최대 4시간.
- 보류: 없음 (또는 jp — 이유: 달라진 쪽, git.content.lines 의 줄)
- 사이트와의 차이: 없음 (또는 --local 로 찍어 PDF 가 배포 전 변경을 먼저 담고 있음 — 배포 여부는 결정해 주세요)
```
