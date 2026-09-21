/**
 * Where the screenshots, scans and recordings live.
 *
 * They are not shipped inside the Worker, and not kept in the repository
 * either: the public R2 bucket behind this host holds the only copy. To add
 * one, drop it under the app's gitignored `assets/` and run `npm run assets:push`
 * (scripts/push-assets.mjs) — every key is the file's path under `assets/`, so
 * `asset("/projects/x/01.png")` is what was at apps/<market>/assets/projects/x/01.png,
 * and a path is the same string on disk and in the URL. Fonts, the favicon and
 * the shared brand marks stay in `public/`, on the Worker.
 *
 * `next/image` only optimises a remote host it has been told about, so each
 * app's next.config.ts lists this host under `images.remotePatterns`.
 */
export const ASSET_ORIGIN = "https://assets.ballbot.dev";

/** The public address of a file under a market's `assets/`, from its path there. */
export function asset(path: `/${string}`): string {
	return `${ASSET_ORIGIN}${path}`;
}
