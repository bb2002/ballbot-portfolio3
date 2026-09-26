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

/**
 * Redirects to whichever market the reader belongs to. The one page it renders
 * is the link-preview card a chat app's fetcher gets for the bare root (the
 * Japanese build's, apps/router).
 */
export const APEX = "https://ballbot.dev";

/**
 * A page's address on a market host. The root is the bare host: that is what
 * Next emits as the home canonical and what the sitemap has published all
 * along, so the home keeps its spelling. Any other path is simply appended.
 */
export function marketUrl(locale: MarketLocale, path: `/${string}` = "/"): string {
	return path === "/" ? MARKETS[locale] : `${MARKETS[locale]}${path}`;
}

/**
 * The `hreflang` map for one path, for `<link rel="alternate">` and for the
 * sitemap entry of that page. `x-default` is the apex at the same path — the
 * router carries the path over, so a crawler that follows it lands on the same
 * page in whichever market it belongs to — because it is the one URL that
 * decides for a reader instead of assuming.
 *
 * Every page needs its own map, not the home's: a page that sets `alternates`
 * replaces the layout's whole object (Next merges metadata shallowly), so a
 * story page that only restated its canonical carried no hreflang at all.
 * Both builds publish the same slugs, which scripts/slugs.test.mjs enforces.
 */
export function languageAlternates(path: `/${string}` = "/") {
	return {
		ko: marketUrl("ko", path),
		ja: marketUrl("ja", path),
		"x-default": path === "/" ? APEX : `${APEX}${path}`,
	} as const;
}

/** The home page's map — what the root layouts link. */
export const LANGUAGE_ALTERNATES = languageAlternates();

/** The Open Graph locale tag of each market. */
export const OG_LOCALES = {
	ko: "ko_KR",
	ja: "ja_JP",
} as const;

/**
 * Each build's card image: the file convention at src/app/opengraph-image.png,
 * which answers at this path on the market's own host (the path resolves
 * against the layout's `metadataBase`). The home page gets it from the file
 * itself, with a content hash; the story pages get it through `openGraphBase`.
 */
export const OG_IMAGE = { url: "/opengraph-image.png", width: 1200, height: 630, type: "image/png" } as const;

/**
 * The Open Graph fields every page shares: which site, which language, which
 * other language it is also written in, and the card image. Spread into each
 * page's `openGraph` for the same reason `languageAlternates` exists — the
 * page's object replaces the layout's, and `og:locale` and the image the root
 * segment's file convention supplies went missing with it.
 */
export function openGraphBase(locale: MarketLocale) {
	return {
		siteName: "ballbot.dev",
		locale: OG_LOCALES[locale],
		alternateLocale: (Object.keys(OG_LOCALES) as MarketLocale[])
			.filter((other) => other !== locale)
			.map((other) => OG_LOCALES[other]),
		images: [OG_IMAGE],
	};
}
