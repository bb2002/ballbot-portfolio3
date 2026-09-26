/**
 * ballbot.dev — the apex. It renders nothing; it decides which market build a
 * reader belongs to and sends them there.
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
 * Only on `?geo`, which answers with a body a crawler could index. The
 * redirects carry no such header: a robots directive on a bodyless 302 is read
 * on the target, not here, so it would be a line that does nothing.
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

		// Path and query carry over, so a deep link into either build survives
		// being shared as an apex URL.
		const target = carry(url, MARKETS[decision.locale]);
		return new Response(null, {
			status: 302,
			headers: {
				location: target.toString(),
				"x-bb-decision": decision.source,
				...NO_STORE,
				...STRICT,
			},
		});
	},
} satisfies ExportedHandler;
