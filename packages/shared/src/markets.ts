/**
 * Where each market build lives, and the apex that decides between them.
 *
 * Canonical URLs, hreflang maps and sitemap entries all have to agree on these
 * — a crawler reads a mismatch as two unrelated sites rather than one document
 * in two languages — so they are written once here.
 *
 * apps/router keeps its own copy on purpose: it is a separate Worker with no
 * shared bundle behind it, and two strings are a cheaper dependency than a
 * build step it would otherwise not need.
 */

export const MARKETS = {
	ko: "https://kr.ballbot.dev",
	ja: "https://jp.ballbot.dev",
} as const;

export type MarketLocale = keyof typeof MARKETS;

/** Renders nothing — it redirects to whichever market the reader belongs to. */
export const APEX = "https://ballbot.dev";

/**
 * The `hreflang` map for `<link rel="alternate">` and for sitemap entries.
 * `x-default` is the apex because it is the one URL that decides for a reader
 * instead of assuming.
 */
export const LANGUAGE_ALTERNATES = {
	ko: MARKETS.ko,
	ja: MARKETS.ja,
	"x-default": APEX,
} as const;
