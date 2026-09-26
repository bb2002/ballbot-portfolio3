/**
 * ballbot.dev — the apex. For a reader it renders nothing; it decides which
 * market build they belong to and sends them there.
 *
 * The one page it writes is a link card. A chat app or a social network handed
 * a ballbot.dev link sends a preview fetcher, which reads the Open Graph tags of
 * wherever it lands — and a redirect decided by country lands it, from almost
 * anywhere, on the Korean build. So the root answers those fetchers, and only
 * them, with a bare page carrying the Japanese build's card (`CARD`). Search
 * engines are not among them: Googlebot follows the redirect as a reader does,
 * so the hreflang map the builds publish stays the one account of which page
 * is which.
 *
 * The order is deliberate: a choice the reader made themselves beats where
 * they happen to be sitting. Cloudflare tells us the country at the edge, so
 * the guess costs nothing, but it stays a guess — Korea is the default for
 * everywhere that is not Japan, including every country we do not publish for.
 *
 * Nothing here may be cached. One URL answers differently per reader, and a
 * redirect held in a shared cache would pin whoever asked first on everyone
 * after them.
 *
 * The decision rules are exported alongside the handler so `index.test.ts` can
 * exercise them without a Worker runtime. Wrangler reads the default export and
 * nothing else, so the extra names cost the bundle nothing.
 */

export const MARKETS = {
	ko: "https://kr.ballbot.dev",
	ja: "https://jp.ballbot.dev",
} as const;

type Locale = keyof typeof MARKETS;

/** Everywhere that is not Japan. */
const DEFAULT_LOCALE: Locale = "ko";

/** The country that gets its own build. */
const JAPAN = "JP";

const COOKIE = "bb-locale";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
/** Set on the parent so both market builds and the apex read the same choice. */
const COOKIE_DOMAIN = ".ballbot.dev";

const NO_STORE = {
	"cache-control": "no-store",
	vary: "cookie",
} as const;

/**
 * The root answers per user agent as well as per cookie — the card for a
 * preview fetcher, the redirect for everyone else — so both its answers say
 * so. A deep link answers every agent alike and keeps `NO_STORE`.
 */
const NO_STORE_BY_AGENT = {
	"cache-control": "no-store",
	vary: "cookie, user-agent",
} as const;

/**
 * On every answer. HSTS pins the apex itself to https for two years and stops
 * there on purpose: `includeSubDomains` sent from this host would bind every
 * current and future *.ballbot.dev — the asset bucket's domain included — and
 * `preload` is an entry on a list that is all but permanent. The market builds
 * send both for their own subtrees; widening the apex is the owner's call.
 */
const STRICT = {
	"strict-transport-security": "max-age=63072000",
} as const;

/**
 * Only on the two answers with a body a crawler could index: `?geo` and the
 * link card. The redirects carry no such header: a robots directive on a
 * bodyless 302 is read on the target, not here, so it would be a line that
 * does nothing.
 */
const NOINDEX = {
	"x-robots-tag": "noindex",
} as const;

/**
 * The request as it arrives at the edge: `cf` carries the geolocation, which
 * the bare `Request` type leaves as an open bag.
 */
type EdgeRequest = Request<unknown, IncomingRequestCfProperties>;

export function isLocale(value: string | null | undefined): value is Locale {
	return value === "ko" || value === "ja";
}

export function readCookie(header: string | null, name: string): string | null {
	if (!header) return null;
	for (const part of header.split(";")) {
		const eq = part.indexOf("=");
		if (eq === -1) continue;
		if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
	}
	return null;
}

type Decision = {
	locale: Locale;
	/** What settled it — reported by `?geo`, which is the only way to see this from outside. */
	source: "cookie" | "geo" | "default";
	country: string | null;
};

export function decide(request: EdgeRequest): Decision {
	// `cf.country` is set at the edge; the header is the same value and covers
	// the local `wrangler dev` case where `cf` is not populated.
	const country = request.cf?.country ?? request.headers.get("cf-ipcountry") ?? null;

	const chosen = readCookie(request.headers.get("cookie"), COOKIE);
	if (isLocale(chosen)) return { locale: chosen, source: "cookie", country };

	if (country === JAPAN) return { locale: "ja", source: "geo", country };

	return { locale: DEFAULT_LOCALE, source: country ? "geo" : "default", country };
}

function remember(locale: Locale): string {
	return `${COOKIE}=${locale}; Domain=${COOKIE_DOMAIN}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure`;
}

/**
 * The requested path and query, re-hung on a market host.
 *
 * The host is taken from MARKETS and never from the request: `//evil.com` and
 * `/\evil.com` are legal *paths*, and resolving one against a base — as
 * `new URL(url.pathname, base)` does — reads it as a protocol-relative
 * authority and yields `https://evil.com/`. That would make the apex an open
 * redirect for anyone who can get a reader to click a ballbot.dev link.
 * Setting `pathname` on a URL that already has a host cannot move the host, and
 * the leading separators are collapsed so the path never reads as one either.
 */
export function carry(url: URL, base: string): URL {
	const target = new URL(base);
	target.pathname = url.pathname.replace(/^[/\\]+/, "/");
	target.search = url.search;
	return target;
}

/**
 * The link-preview fetchers the root writes its card for, matched anywhere in
 * the User-Agent, in any case. Each is the fetcher's own token and never a bare
 * "bot": Googlebot, bingbot and every other search crawler keep the redirect,
 * and so does a person — including one inside a chat app's in-app browser.
 *
 * - facebookexternalhit, Facebot: Facebook, Messenger, Instagram. iMessage
 *   sends both, with Twitterbot, in one string.
 * - line-poker: LINE's preview fetcher, `facebookexternalhit/1.1;line-poker/1.0`.
 *   Not `Line/`: that is LINE's in-app browser (`… Safari Line/15.12.0`, or
 *   `… Line/15.12.0/IAB` on Android), which is a person opening the link.
 * - pinterest/<n>, pinterestbot/<n>: the crawler is `Pinterest/0.2` or
 *   `Pinterestbot/1.0`; Pinterest's in-app browser says `[Pinterest/iOS]`.
 * - whatsapp/: the fetcher is `WhatsApp/2.x`.
 * - twitterbot, linkedinbot, slackbot (`Slackbot-LinkExpanding` too),
 *   discordbot, kakaotalk-scrap, telegrambot: each app's fetcher, named as it
 *   names itself; none of their in-app browsers carries the token.
 * - skypeuripreview: Microsoft Teams and Skype, `… SkypeUriPreview Preview/0.5 …`.
 */
export const LINK_PREVIEW_AGENTS =
	/facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|discordbot|kakaotalk-scrap|line-poker|telegrambot|skypeuripreview|whatsapp\/|pinterest(?:bot)?\/\d/i;

export function isLinkPreview(userAgent: string | null): boolean {
	return userAgent !== null && LINK_PREVIEW_AGENTS.test(userAgent);
}

/** For element text and double-quoted attribute values alike. */
export function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

/**
 * The apex's card is the Japanese build's home card, restated: the title,
 * description and Open Graph title/description of apps/jp/src/app/layout.tsx,
 * and the image Next serves for apps/jp/src/app/opengraph-image.png. A file
 * convention in the root segment answers at `/opengraph-image.png`; the build's
 * own tag adds a `?<content hash>` this Worker cannot know, and the file
 * answers without it. Like MARKETS, a copy on purpose — when the jp layout's
 * wording changes, this changes with it.
 */
const PREVIEW = {
	title: "ballbot.dev | Software Engineer",
	description:
		"ソフトウェアエンジニア ballbot のポートフォリオ。プロジェクト、経歴、受賞歴と、これまでの歩みを紹介します。",
	ogTitle: "ballbot.dev | Software Engineer",
	ogDescription: "ソフトウェアエンジニア ballbot のポートフォリオ。",
	image: { url: `${MARKETS.ja}/opengraph-image.png`, width: 1200, height: 630, type: "image/png" },
} as const;

/**
 * The whole page: the tags a preview fetcher reads, and one link to the build
 * for anything that renders it anyway. The canonical and `og:url` name the
 * Japanese build, so a fetcher that follows them lands on the same card.
 */
function card(): string {
	const meta = (key: "name" | "property", name: string, content: string | number) =>
		`<meta ${key}="${name}" content="${escapeHtml(String(content))}">`;
	return [
		"<!doctype html>",
		'<html lang="ja">',
		"<head>",
		'<meta charset="utf-8">',
		`<title>${escapeHtml(PREVIEW.title)}</title>`,
		meta("name", "description", PREVIEW.description),
		`<link rel="canonical" href="${escapeHtml(MARKETS.ja)}">`,
		meta("property", "og:type", "website"),
		meta("property", "og:url", MARKETS.ja),
		meta("property", "og:site_name", "ballbot.dev"),
		meta("property", "og:locale", "ja_JP"),
		meta("property", "og:title", PREVIEW.ogTitle),
		meta("property", "og:description", PREVIEW.ogDescription),
		meta("property", "og:image", PREVIEW.image.url),
		meta("property", "og:image:width", PREVIEW.image.width),
		meta("property", "og:image:height", PREVIEW.image.height),
		meta("property", "og:image:type", PREVIEW.image.type),
		meta("name", "twitter:card", "summary_large_image"),
		"</head>",
		`<body><a href="${escapeHtml(MARKETS.ja)}">${escapeHtml(new URL(MARKETS.ja).host)}</a></body>`,
		"</html>",
		"",
	].join("\n");
}

export const CARD = card();

export default {
	fetch(request: EdgeRequest): Response {
		const url = new URL(request.url);

		// One host decides, so www hands over to the apex rather than deciding
		// again with its own copy of the rules.
		if (url.hostname.startsWith("www.")) {
			url.hostname = url.hostname.slice("www.".length);
			return new Response(null, {
				status: 301,
				headers: { location: url.toString(), "cache-control": "no-store", ...STRICT },
			});
		}

		// `/go/ko` and `/go/ja` are what the language links on both builds point
		// at. They are the only way a reader's choice gets recorded — which is
		// why the market builds themselves never have to touch a cookie.
		const switching = /^\/go\/(ko|ja)\/?$/.exec(url.pathname);
		if (switching) {
			const locale = switching[1] as Locale;
			return new Response(null, {
				status: 302,
				headers: {
					location: `${MARKETS[locale]}/`,
					"set-cookie": remember(locale),
					...NO_STORE,
					...STRICT,
				},
			});
		}

		const decision = decide(request);

		// `?geo` answers with the decision instead of acting on it. Country cannot
		// be faked from outside — Cloudflare overwrites the header at the edge —
		// so this is the only way to see what the edge actually reported for you.
		if (url.searchParams.has("geo")) {
			return Response.json(decision, { headers: { ...NO_STORE, ...STRICT, ...NOINDEX } });
		}

		// The root, fetched for a link preview, gets the card instead of a
		// redirect. GET and HEAD only, since a preview is a read — and HEAD is
		// answered as GET is, as `?geo` is: some fetchers ask HEAD first, and the
		// runtime drops the body from a HEAD answer. A deep link is left to the
		// redirect, which carries its path to the page the link is about.
		const root = url.pathname === "/";
		if (
			root &&
			(request.method === "GET" || request.method === "HEAD") &&
			isLinkPreview(request.headers.get("user-agent"))
		) {
			return new Response(CARD, {
				headers: {
					"content-type": "text/html; charset=utf-8",
					...NO_STORE_BY_AGENT,
					...STRICT,
					...NOINDEX,
				},
			});
		}

		// Path and query carry over, so a deep link into either build survives
		// being shared as an apex URL.
		const target = carry(url, MARKETS[decision.locale]);
		return new Response(null, {
			status: 302,
			headers: {
				location: target.toString(),
				"x-bb-decision": decision.source,
				...(root ? NO_STORE_BY_AGENT : NO_STORE),
				...STRICT,
			},
		});
	},
} satisfies ExportedHandler;
