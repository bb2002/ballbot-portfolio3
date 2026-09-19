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

Resume delivery is off until the mailbox is wired: `/api/resume` answers `503`
and the form hands the reader the direct address instead. Turning it on means
adding a `send_email` binding to the market's `wrangler.jsonc` and setting
`RESUME_FROM` — the route handler carries the details.

## Reference

- [OpenNext for Cloudflare](https://opennext.js.org/cloudflare)
- Next.js docs ship with the package: `node_modules/next/dist/docs/`
