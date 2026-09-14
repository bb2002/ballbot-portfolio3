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
 */

const MARKETS = {
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
 * The request as it arrives at the edge: `cf` carries the geolocation, which
 * the bare `Request` type leaves as an open bag.
 */
type EdgeRequest = Request<unknown, IncomingRequestCfProperties>;

function isLocale(value: string | null | undefined): value is Locale {
	return value === "ko" || value === "ja";
}

function readCookie(header: string | null, name: string): string | null {
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

function decide(request: EdgeRequest): Decision {
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

export default {
	fetch(request: EdgeRequest): Response {
		const url = new URL(request.url);

		// One host decides, so www hands over to the apex rather than deciding
		// again with its own copy of the rules.
		if (url.hostname.startsWith("www.")) {
			url.hostname = url.hostname.slice("www.".length);
			return new Response(null, {
				status: 301,
				headers: { location: url.toString(), "cache-control": "no-store" },
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
				},
			});
		}

		const decision = decide(request);

		// `?geo` answers with the decision instead of acting on it. Country cannot
		// be faked from outside — Cloudflare overwrites the header at the edge —
		// so this is the only way to see what the edge actually reported for you.
		if (url.searchParams.has("geo")) {
			return Response.json(decision, { headers: { ...NO_STORE } });
		}

		// Path and query carry over, so a deep link into either build survives
		// being shared as an apex URL.
		const target = new URL(url.pathname + url.search, MARKETS[decision.locale]);
		return new Response(null, {
			status: 302,
			headers: {
				location: target.toString(),
				"x-bb-decision": decision.source,
				...NO_STORE,
			},
		});
	},
} satisfies ExportedHandler;
