/**
 * Copies the shared static tree into the calling app's `public/`.
 *
 * Next serves `public/` from inside the app, and a monorepo has no way to point
 * it somewhere else — so the fonts, the mock artwork and `_headers` are kept in
 * one place here and mirrored into each app before every build and dev run.
 * The app's own `public/` is generated output and is not committed.
 *
 * Run from an app directory:  node ../../packages/shared/scripts/sync-public.mjs
 * Extra sources (the JP font build, say) are passed as arguments and copied on
 * top, in order, so a market can override a shared file.
 *
 * A market's screenshots and recordings do not come through here: its `assets/`
 * tree goes to R2 by push-assets.mjs and is served from assets.ballbot.dev.
 * Anything else an app has to ship itself is passed as a source the same way —
 * dropped straight into `public/` it would not survive the next run, since the
 * first thing this does is empty it.
 */
import { cp, rm, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const shared = resolve(dirname(fileURLToPath(import.meta.url)), "../public");
const dest = resolve(process.cwd(), "public");

/**
 * `source:subdirectory-of-public` — later entries win. Split on the *last*
 * colon: a Windows source path opens with a drive letter, and splitting on the
 * first one would hand `cp` the bare letter as its source.
 */
function parseSource(arg) {
	const cut = arg.lastIndexOf(":");
	return cut === -1 ? [arg, ""] : [arg.slice(0, cut), arg.slice(cut + 1)];
}

const sources = [[shared, ""], ...process.argv.slice(2).map(parseSource)];

// Emptied first, because `cp` only ever adds: a file dropped from the shared
// tree — or left behind by a font package that changed its slice names — would
// otherwise sit in every app's public/ forever, get picked up by the turbo
// cache as an output, and ship. The whole directory is generated and
// gitignored, so there is nothing here to lose.
await rm(dest, { recursive: true, force: true });

for (const [from, into] of sources) {
	const src = resolve(from);
	try {
		await stat(src);
	} catch {
		throw new Error(`sync-public: no such source: ${src}`);
	}
	await cp(src, resolve(dest, into), { recursive: true, force: true });
}
