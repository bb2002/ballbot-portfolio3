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
 */
import { cp, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const shared = resolve(dirname(fileURLToPath(import.meta.url)), "../public");
const dest = resolve(process.cwd(), "public");

/** `[source, subdirectory of public/]` — later entries win. */
const sources = [[shared, ""], ...process.argv.slice(2).map((arg) => arg.split(":"))];

for (const [from, into = ""] of sources) {
	const src = resolve(from);
	try {
		await stat(src);
	} catch {
		throw new Error(`sync-public: no such source: ${src}`);
	}
	await cp(src, resolve(dest, into), { recursive: true, force: true });
}
