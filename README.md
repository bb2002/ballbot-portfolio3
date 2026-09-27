# ballbot-portfolio3

A one-page portfolio, built twice — once for Korea, once for Japan — plus the
apex that decides which of the two a reader belongs to. Every screen is
composed from the same components; the only thing a market owns is its content
file and the order it arranges the sections in.

## Layout

| Path               | What it is                                                                 |
| ------------------ | -------------------------------------------------------------------------- |
| `apps/kr`          | `kr.ballbot.dev` — Next.js on Cloudflare Workers via OpenNext               |
| `apps/jp`          | `jp.ballbot.dev` — the same build with its own content and font             |
| `apps/router`      | `ballbot.dev` — a bare Worker that redirects; renders nothing               |
| `packages/shared`  | Every component, the design tokens, the content schema, the shared `public/` |

`packages/shared` is consumed as TypeScript source, not as a build artefact —
the apps compile it. Its `build` script is a no-op that exists so Turborepo
folds the package's file hashes into the tasks that depend on it.

`public/` inside an app is **generated** and gitignored: `sync-public` mirrors
`packages/shared/public` into it and copies the market's font slices on top.
Edit the shared tree, never the app's copy.

## Working on it

```bash
npm install
npm run dev        # kr on :7770, jp on :7771
npm run lint
npm run typecheck
npm test           # node --test, no runner to install
npm run build
```

Every task runs through Turborepo, so a single app is `npx turbo run dev
--filter=@ballbot/kr`.

## Deploying

```bash
npm run deploy                          # all three Workers
npx turbo run deploy --filter=@ballbot/router
```

Each app previews on the real runtime with `npm run preview` inside it
(`opennextjs-cloudflare build && … preview`).

Deploy through these scripts, not a bare `wrangler deploy`: the OpenNext CLI's
deploy step is what copies the prerendered story pages into the Worker's
static assets (`open-next.config.ts`), and without it every `/projects/*` and
`/experience/*` answers 404 while the sitemap still lists them. After a deploy,
`npm run check:live` proves the live site from the outside — every sitemap URL
200 and served from that cache, hreflang in place, each market's PDF link
answering from the asset bucket under its own name, the apex redirecting.

Screenshots, scans and recordings live in the R2 bucket behind
`assets.ballbot.dev`, not in the repository or the Worker: stage a new file
under the app's gitignored `assets/` and send it up with `npm run assets:push`
(apps/kr).

### The PDF

The hero's `PDF ↓` link hands out the whole site as one A4 landscape PDF —
the home page, then every project and experience story — from the asset
bucket (`pdf/kr/portfolio.pdf`, `pdf/jp/portfolio.pdf`). It is not part of the
deploy: it is printed from the site as served and refreshed on its own, so it
can trail the site for a while. Bringing it back in step is two commands:

```bash
npm run pdf          # print both markets' live /print and check them (apps/*/pdf/)
npm run pdf:push     # upload the checked files to R2 and verify what is served
```

`npm run pdf -- --local` prints each app's own build instead, for changes not
yet deployed. The whole procedure — what the checks cover, what to look at by
eye, how to fix a page that breaks badly, and the CDN pitfalls — is
[docs/how-to-portfolio-to-pdf/SKILL.md](docs/how-to-portfolio-to-pdf/SKILL.md).

## Reference

- [OpenNext for Cloudflare](https://opennext.js.org/cloudflare)
- Next.js docs ship with the package: `node_modules/next/dist/docs/`
