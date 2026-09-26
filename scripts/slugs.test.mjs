/**
 * Every story page on one market must exist on the other. The story pages and
 * the sitemap declare `hreflang` pairs by path (packages/shared/src/markets.ts),
 * so a slug present in only one content file points the other market's crawler
 * at a 404.
 *
 * The content files import the shared components, which Node cannot run, so
 * this reads them as text and compares the `slug: "…"` literals — the one place
 * a story's address is written. It runs from the root as a turbo task with
 * both files as its inputs (turbo.json), so editing either market invalidates
 * the cached result; a package-scoped test would only see its own package.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const MARKETS = ["kr", "jp"];
const SLUG = /\bslug:\s*"([^"]+)"/g;

async function slugsOf(market) {
	const file = fileURLToPath(new URL(`../apps/${market}/src/content/portfolio.ts`, import.meta.url));
	const source = await readFile(file, "utf8");
	return new Set([...source.matchAll(SLUG)].map((match) => match[1]));
}

test("both markets publish the same story slugs", async () => {
	const [kr, jp] = await Promise.all(MARKETS.map(slugsOf));
	// An empty set would pass a deepEqual against another empty set — and would
	// mean the `slug: "…"` spelling this test keys on has changed, not that
	// there are no stories.
	assert.ok(kr.size > 0, 'no slugs found in kr — has the `slug: "…"` spelling changed?');
	assert.deepEqual([...kr].sort(), [...jp].sort());
});
