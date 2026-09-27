/**
 * Post-deploy smoke: proves the live site is what the build meant to publish.
 *
 * For each market — robots.txt names its sitemap; every URL in the sitemap is
 * 200 and served from the prerender cache (`x-nextjs-cache: HIT`; a 200 that
 * is a MISS means the static-assets cache was not populated, which is what a
 * bare `wrangler deploy` does — see apps/kr/open-next.config.ts), declares
 * itself canonical, carries the three hreflang links and a JSON-LD block that
 * parses; an unknown story is a 404; the PDF the hero links to is the
 * market's one key in the asset bucket and answers as a PDF saved under the
 * name the link gives it (the file is pushed on its own, `npm run pdf:push`,
 * so a link can ship before its file does — docs/how-to-portfolio-to-pdf).
 * For the apex — a 302 to a market that is never cached, the deep-link path
 * carried over, `/go/ja` setting its cookie, `?geo` answering and staying out
 * of the index, a link-preview fetcher on the root getting the Japanese card,
 * whose image answers, instead, preload-ready HSTS, and plain http going to
 * https on the apex itself first.
 *
 * The sitemap listing all eight story pages while every one of them was a 404
 * is how a broken deploy went unnoticed for days; this is what would have
 * caught it. Read-only GETs and HEADs, no dependencies. Exit 1 if anything
 * fails, with the failing check named.
 *
 *   npm run check:live
 */

const MARKETS = {
	ko: "https://kr.ballbot.dev",
	ja: "https://jp.ballbot.dev",
};
const APEX = "https://ballbot.dev";
/**
 * Where the site's PDFs live: the asset bucket, one folder per market, and in
 * it the one key the site's owner approved for that market's file — the only
 * one `npm run pdf:push` ever writes (render-pdf.mjs, `downloadLink`). A link
 * to any other address is failed without being fetched: the bucket's host
 * caches a 404 for hours, so an address is asked for only once it is known to
 * be one a push fills.
 */
const PDF_HOME = "https://assets.ballbot.dev/pdf/";
const pdfKey = (host) => `${PDF_HOME}${new URL(host).hostname.split(".")[0]}/portfolio.pdf`;
/** What the apex and both builds send, and what the preload list asks of the apex. */
const HSTS = "max-age=63072000; includeSubDomains; preload";
const USER_AGENT = "ballbot-check-live/1 (+https://ballbot.dev)";
/** A link-preview fetcher, for the one apex answer that depends on who asks. */
const PREVIEW_AGENT = "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)";

let failed = 0;

function check(condition, what, detail) {
	if (condition) {
		console.log(`ok    ${what}`);
	} else {
		failed += 1;
		console.log(`FAIL  ${what}${detail ? ` — ${detail}` : ""}`);
	}
}

async function get(url, userAgent = USER_AGENT) {
	const response = await fetch(url, {
		redirect: "manual",
		headers: { "user-agent": userAgent },
		signal: AbortSignal.timeout(20_000),
	});
	return { status: response.status, headers: response.headers, body: await response.text() };
}

/** Runs one group of checks; a network failure fails the group instead of ending the run. */
async function group(what, run) {
	try {
		await run();
	} catch (error) {
		check(false, what, error instanceof Error ? error.message : String(error));
	}
}

/**
 * The name a `Content-Disposition` header gives its file: the `filename*`
 * parameter (RFC 6266), decoded from its UTF-8 percent-encoding (RFC 8187).
 * Read back rather than compared with an encoding made here, which would be
 * the same code as the one that wrote the header and pass whatever it got wrong.
 */
function savedAs(disposition) {
	const value = /filename\*=UTF-8''([^;\s]+)/i.exec(disposition)?.[1];
	if (!value) return null;
	try {
		return decodeURIComponent(value);
	} catch {
		return null;
	}
}

/** An attribute's value as React writes it into HTML, read back. */
function unescapeHtml(value) {
	return value.replace(/&(amp|quot|#x27|#39|lt|gt);/g, (_, entity) => ({ amp: "&", quot: '"', "#x27": "'", "#39": "'", lt: "<", gt: ">" })[entity]);
}

function locations(sitemap) {
	return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

async function checkPage(url) {
	const { status, headers, body } = await get(url);
	check(status === 200, `${url} → 200`, `got ${status}`);
	check(
		headers.get("x-nextjs-cache") === "HIT",
		`${url} served from the prerender cache`,
		`x-nextjs-cache: ${headers.get("x-nextjs-cache")} — the static-assets cache was not populated; deploy through opennextjs-cloudflare, not bare wrangler`,
	);
	check(body.includes(`rel="canonical" href="${url}"`), `${url} is its own canonical`);
	const hreflang = (body.match(/rel="alternate" hreflang="/gi) ?? []).length;
	check(hreflang === 3, `${url} carries three hreflang links`, `found ${hreflang}`);
	const ld = body.match(/<script type="application\/ld\+json">([^<]*)<\/script>/);
	let parses = false;
	try {
		parses = Boolean(ld) && JSON.parse(ld[1])["@context"] === "https://schema.org";
	} catch {
		parses = false;
	}
	check(parses, `${url} JSON-LD parses`);
}

async function checkMarket(host) {
	await group(`${host} robots.txt`, async () => {
		const robots = await get(`${host}/robots.txt`);
		check(
			robots.status === 200 && robots.body.includes(`Sitemap: ${host}/sitemap.xml`),
			`${host}/robots.txt names its sitemap`,
			`got ${robots.status}`,
		);
	});

	let urls = [];
	await group(`${host} sitemap.xml`, async () => {
		const sitemap = await get(`${host}/sitemap.xml`);
		check(sitemap.status === 200, `${host}/sitemap.xml → 200`, `got ${sitemap.status}`);
		urls = locations(sitemap.body);
		check(urls.length >= 9, `${host} sitemap lists the home and the story pages`, `found ${urls.length}`);
	});

	for (const url of urls) {
		await group(url, () => checkPage(url));
	}

	await group(`${host} unknown story`, async () => {
		const missing = await get(`${host}/projects/does-not-exist`);
		check(missing.status === 404, `${host}/projects/does-not-exist → 404`, `got ${missing.status}`);
	});

	// The file and its name are read off the hero's download link, which is
	// where the content file puts them. HEAD, not GET: the answer is the check,
	// and the body is several megabytes of PDF.
	await group(`${host} PDF`, async () => {
		const home = await get(`${host}/`);
		const link = home.body.match(/<a [^>]*\bdownload="([^"]+)"[^>]*>/);
		const href = link?.[0].match(/\bhref="([^"]+)"/)?.[1];
		check(
			Boolean(link && href),
			`${host}/ links its PDF`,
			"the live home page has no download link: the site has not been deployed since the PDF link was added — deploying is the owner's decision (npm run deploy)",
		);
		if (!link || !href) return;
		const url = new URL(unescapeHtml(href), host).href;
		const name = unescapeHtml(link[1]);
		check(url === pdfKey(host), `${host}/ links its PDF at ${pdfKey(host)}`, `${url} — not this market's key, the one pdf:push writes; not fetched`);
		if (url !== pdfKey(host)) return;
		const pdf = await fetch(url, {
			method: "HEAD",
			redirect: "manual",
			headers: { "user-agent": USER_AGENT },
			signal: AbortSignal.timeout(20_000),
		});
		check(
			pdf.status === 200 && pdf.headers.get("content-type") === "application/pdf",
			`${url} → 200 application/pdf`,
			`${pdf.status} ${pdf.headers.get("content-type")}`,
		);
		// Across origins a browser ignores `download`: the object's own header
		// has to save it, under the same name.
		const disposition = pdf.headers.get("content-disposition") ?? "";
		check(
			/^attachment\b/i.test(disposition) && savedAs(disposition) === name,
			`${url} is saved as ${name}`,
			disposition || "no Content-Disposition — push it with npm run pdf:push",
		);
	});
}

async function checkApex() {
	await group(`${APEX}/`, async () => {
		const home = await get(`${APEX}/`);
		const target = home.headers.get("location") ?? "";
		check(
			home.status === 302 && Object.values(MARKETS).some((market) => target === `${market}/`),
			`${APEX}/ → 302 to a market`,
			`${home.status} ${target}`,
		);
		check(
			home.headers.get("cache-control") === "no-store" && home.headers.get("vary") === "cookie, user-agent",
			`${APEX}/ is never cached`,
		);
		check(
			home.headers.get("strict-transport-security") === HSTS,
			`${APEX}/ sends preload-ready HSTS`,
			home.headers.get("strict-transport-security") ?? "none",
		);
	});

	// The preload list's first requirement, met by the zone's "Always Use
	// HTTPS", not by the Worker: plain http goes to https on the same host
	// before anything decides where the reader belongs.
	await group(`http://${new URL(APEX).host}/`, async () => {
		const plain = await get(`http://${new URL(APEX).host}/`);
		const target = plain.headers.get("location") ?? "";
		check(
			plain.status === 301 && target === `${APEX}/`,
			`http://${new URL(APEX).host}/ → 301 to ${APEX}/`,
			`${plain.status} ${target}`,
		);
	});

	await group(`${APEX}/ link preview`, async () => {
		const card = await get(`${APEX}/`, PREVIEW_AGENT);
		const image = card.body.match(/<meta property="og:image" content="([^"]+)">/)?.[1] ?? "";
		check(
			card.status === 200 &&
				!card.headers.has("location") &&
				image === `${MARKETS.ja}/opengraph-image.png` &&
				card.body.includes('<meta property="og:locale" content="ja_JP">'),
			`${APEX}/ gives a link preview the Japanese card`,
			`${card.status} ${card.headers.get("location") ?? ""} og:image ${image}`,
		);
		const served = image ? await get(image) : { status: 0, headers: new Headers() };
		check(
			served.status === 200 && served.headers.get("content-type") === "image/png",
			`${APEX}/ card's og:image answers`,
			`${served.status} ${served.headers.get("content-type")}`,
		);
	});

	await group(`${APEX} deep link`, async () => {
		const deep = await get(`${APEX}/projects/cosmonote?x=1`);
		check(
			deep.status === 302 && /\/projects\/cosmonote\?x=1$/.test(deep.headers.get("location") ?? ""),
			`${APEX} carries a deep link's path and query`,
			`${deep.status} ${deep.headers.get("location")}`,
		);
	});

	await group(`${APEX}/go/ja`, async () => {
		const go = await get(`${APEX}/go/ja`);
		check(
			go.status === 302 &&
				go.headers.get("location") === `${MARKETS.ja}/` &&
				/^bb-locale=ja;/.test(go.headers.get("set-cookie") ?? ""),
			`${APEX}/go/ja remembers the choice and sends the reader there`,
			`${go.status} ${go.headers.get("location")}`,
		);
	});

	await group(`${APEX}/?geo`, async () => {
		const geo = await get(`${APEX}/?geo`);
		check(
			geo.status === 200 && geo.headers.get("x-robots-tag") === "noindex",
			`${APEX}/?geo answers and stays out of the index`,
			`${geo.status} x-robots-tag: ${geo.headers.get("x-robots-tag")}`,
		);
	});
}

for (const host of Object.values(MARKETS)) {
	await checkMarket(host);
}
await checkApex();

console.log(failed ? `\n${failed} check(s) failed` : "\nall checks passed");
process.exit(failed ? 1 : 0);
