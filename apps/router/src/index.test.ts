/**
 * The apex has no UI to check it by: apart from the card it writes for link
 * previews, every answer it gives is a status line and a `location` header, and
 * the one that matters most is the one it must never give — a redirect off
 * ballbot.dev. These run under `node --test`, which
 * strips the types and runs the module as-is; nothing here needs a Worker.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import worker, { CARD, MARKETS, carry, decide, escapeHtml, isLinkPreview, readCookie } from "./index.ts";

/** A request as the edge hands it over. `cf` is absent, as it is under `wrangler dev`. */
function edge(url: string, headers: Record<string, string> = {}, method = "GET") {
	return new Request(url, { headers, method }) as never;
}

function answer(url: string, headers: Record<string, string> = {}, method = "GET") {
	return worker.fetch(edge(url, headers, method));
}

/**
 * One User-Agent per fetcher family, as each sends it. The LINE, Telegram and
 * iMessage strings also carry another family's token, so each family's own
 * token is checked on its own as well.
 */
const PREVIEW_AGENTS = {
	facebookexternalhit: "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
	Facebot: "Facebot",
	iMessage:
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/601.2.4 (KHTML, like Gecko) Version/9.0.1 Safari/601.2.4 facebookexternalhit/1.1 Facebot Twitterbot/1.0",
	Twitterbot: "Twitterbot/1.0",
	LinkedInBot: "LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)",
	Slackbot: "Slackbot 1.0 (+https://api.slack.com/robots)",
	"Slackbot-LinkExpanding": "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)",
	Discordbot: "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)",
	"kakaotalk-scrap": "kakaotalk-scrap/1.0; +https://devtalk.kakao.com/t/scrap/33984",
	LINE: "facebookexternalhit/1.1;line-poker/1.0",
	"LINE, its own token": "line-poker/1.0",
	TelegramBot: "TelegramBot (like TwitterBot)",
	"TelegramBot, its own token": "TelegramBot",
	Teams: "Mozilla/5.0 (Windows NT 6.1; WOW64) SkypeUriPreview Preview/0.5 skype-url-preview@microsoft.com",
	WhatsApp: "WhatsApp/2.23.20.0 A",
	Pinterest: "Pinterest/0.2 (+https://www.pinterest.com/bot.html)",
	Pinterestbot: "Mozilla/5.0 (compatible; Pinterestbot/1.0; +https://www.pinterest.com/bot.html)",
	"any case": "SLACKBOT-LINKEXPANDING 1.0",
} as const;

/** People, including inside the chat apps' own browsers, and search engines. */
const OTHER_AGENTS = {
	Chrome:
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
	Safari:
		"Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1",
	// LINE's in-app browser: a person who tapped the link, not the preview.
	"LINE in-app, iOS":
		"Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari Line/15.12.0",
	"LINE in-app, Android":
		"Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/140.0.0.0 Mobile Safari/537.36 Line/15.12.0/IAB",
	"KakaoTalk in-app":
		"Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 KAKAOTALK 25.8.0",
	"Pinterest in-app":
		"Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [Pinterest/iOS]",
	Googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
	"Googlebot smartphone":
		"Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
	bingbot: "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
	"a bare bot": "bot",
	"some other bot": "Mozilla/5.0 (compatible; SomeBot/1.0)",
	"the live check": "ballbot-check-live/1 (+https://ballbot.dev)",
} as const;

test("carry never leaves the market host", () => {
	// `//evil.com` and `/\evil.com` are paths that resolve as authorities. This
	// is the open redirect the apex used to have; it must stay closed.
	for (const path of ["//evil.com/x", "/\\/evil.com", "///\\\\evil.com", "//evil.com"]) {
		const target = carry(new URL(`https://ballbot.dev${path}`), MARKETS.ko);
		assert.equal(target.host, "kr.ballbot.dev", `escaped via ${path}`);
		assert.equal(target.protocol, "https:");
	}
});

test("carry keeps the path and the query a deep link was shared with", () => {
	const target = carry(new URL("https://ballbot.dev/resume?ref=x#frag"), MARKETS.ja);
	assert.equal(target.toString(), "https://jp.ballbot.dev/resume?ref=x");
});

test("readCookie finds a value among its neighbours and ignores a prefix match", () => {
	assert.equal(readCookie("a=1; bb-locale=ja; z=2", "bb-locale"), "ja");
	assert.equal(readCookie("xx-bb-locale=ja", "bb-locale"), null);
	assert.equal(readCookie(null, "bb-locale"), null);
});

test("a reader's own choice outranks where they are sitting", () => {
	const d = decide(edge("https://ballbot.dev/", { cookie: "bb-locale=ja", "cf-ipcountry": "KR" }));
	assert.deepEqual(d, { locale: "ja", source: "cookie", country: "KR" });
});

test("a cookie that is not a market we publish is ignored", () => {
	const d = decide(edge("https://ballbot.dev/", { cookie: "bb-locale=fr", "cf-ipcountry": "JP" }));
	assert.equal(d.locale, "ja");
	assert.equal(d.source, "geo");
});

test("Japan gets the Japanese build; everywhere else gets the Korean one", () => {
	assert.equal(decide(edge("https://ballbot.dev/", { "cf-ipcountry": "JP" })).locale, "ja");
	assert.equal(decide(edge("https://ballbot.dev/", { "cf-ipcountry": "DE" })).locale, "ko");
	assert.equal(decide(edge("https://ballbot.dev/")).source, "default");
});

test("an apex hit redirects to a market and is never cached", async () => {
	const response = await answer("https://ballbot.dev/?ref=x", { "cf-ipcountry": "JP" });
	assert.equal(response.status, 302);
	assert.equal(response.headers.get("location"), "https://jp.ballbot.dev/?ref=x");
	assert.equal(response.headers.get("cache-control"), "no-store");
	// The root also answers per agent (the link card), so it says so.
	assert.equal(response.headers.get("vary"), "cookie, user-agent");
});

test("a deep link answers every agent alike, so it varies on the cookie alone", async () => {
	const response = await answer("https://ballbot.dev/projects/cosmonote", { "cf-ipcountry": "JP" });
	assert.equal(response.headers.get("vary"), "cookie");
});

test("a crafted path cannot turn the apex into an open redirect", async () => {
	const response = await answer("https://ballbot.dev//evil.com", { "cf-ipcountry": "KR" });
	assert.equal(new URL(response.headers.get("location")!).host, "kr.ballbot.dev");
});

test("/go/ja records the choice and sends the reader there", async () => {
	const response = await answer("https://ballbot.dev/go/ja");
	assert.equal(response.status, 302);
	assert.equal(response.headers.get("location"), "https://jp.ballbot.dev/");
	const cookie = response.headers.get("set-cookie")!;
	assert.match(cookie, /^bb-locale=ja;/);
	assert.match(cookie, /Domain=\.ballbot\.dev/);
	assert.match(cookie, /SameSite=Lax/);
	assert.match(cookie, /Secure/);
});

test("/go/fr is not a switch and falls through to the ordinary decision", async () => {
	const response = await answer("https://ballbot.dev/go/fr", { "cf-ipcountry": "KR" });
	assert.equal(response.headers.get("set-cookie"), null);
	assert.equal(response.headers.get("location"), "https://kr.ballbot.dev/go/fr");
});

test("www hands over to the apex rather than deciding with its own copy of the rules", async () => {
	const response = await answer("https://www.ballbot.dev/resume");
	assert.equal(response.status, 301);
	assert.equal(response.headers.get("location"), "https://ballbot.dev/resume");
});

test("?geo reports the decision instead of acting on it", async () => {
	const response = await answer("https://ballbot.dev/?geo", { "cf-ipcountry": "JP" });
	assert.equal(response.status, 200);
	assert.deepEqual(await response.json(), { locale: "ja", source: "geo", country: "JP" });
	assert.equal(response.headers.get("cache-control"), "no-store");
});

test("?geo answers with a body, and it stays out of the index", async () => {
	const response = await answer("https://ballbot.dev/?geo", { "cf-ipcountry": "JP" });
	assert.equal(response.headers.get("x-robots-tag"), "noindex");
	// A robots header on a bodyless redirect is read on its target, not here —
	// so the redirects carry none rather than a line that does nothing.
	const redirect = await answer("https://ballbot.dev/go/ja");
	assert.equal(redirect.headers.get("x-robots-tag"), null);
});

test("every answer pins the apex to https — and only the apex", async () => {
	for (const url of ["https://ballbot.dev/", "https://ballbot.dev/go/ja", "https://www.ballbot.dev/", "https://ballbot.dev/?geo"]) {
		const response = await answer(url, { "cf-ipcountry": "KR" });
		const hsts = response.headers.get("strict-transport-security");
		assert.equal(hsts, "max-age=63072000", url);
		// `includeSubDomains` from the apex would bind every *.ballbot.dev and
		// `preload` is all but permanent: neither is this Worker's call to make.
		assert.doesNotMatch(hsts!, /includeSubDomains|preload/i, url);
	}
});

test("every link-preview fetcher on the list is recognised, in any case", () => {
	for (const [family, agent] of Object.entries(PREVIEW_AGENTS)) {
		assert.equal(isLinkPreview(agent), true, family);
	}
});

test("a person, an in-app browser, a search engine or a bare bot is not a link preview", () => {
	for (const [who, agent] of Object.entries(OTHER_AGENTS)) {
		assert.equal(isLinkPreview(agent), false, who);
	}
	assert.equal(isLinkPreview(null), false);
});

test("a link preview of the root gets the Japanese card, not a redirect", async () => {
	// From Korea, where a reader would be sent to the Korean build.
	const response = await answer("https://ballbot.dev/", {
		"user-agent": PREVIEW_AGENTS.facebookexternalhit,
		"cf-ipcountry": "KR",
	});
	assert.equal(response.status, 200);
	assert.equal(response.headers.get("location"), null);
	assert.equal(response.headers.get("content-type"), "text/html; charset=utf-8");
	assert.equal(response.headers.get("cache-control"), "no-store");
	assert.equal(response.headers.get("vary"), "cookie, user-agent");
	assert.equal(response.headers.get("x-robots-tag"), "noindex");
	assert.equal(response.headers.get("strict-transport-security"), "max-age=63072000");

	const html = await response.text();
	assert.match(html, /<html lang="ja">/);
	assert.match(html, /<link rel="canonical" href="https:\/\/jp\.ballbot\.dev">/);
	assert.match(html, /<meta property="og:url" content="https:\/\/jp\.ballbot\.dev">/);
	assert.match(html, /<meta property="og:locale" content="ja_JP">/);
	assert.match(html, /<meta property="og:site_name" content="ballbot\.dev">/);
	assert.match(html, /<meta property="og:image" content="https:\/\/jp\.ballbot\.dev\/opengraph-image\.png">/);
	assert.match(html, /<meta property="og:image:width" content="1200">/);
	assert.match(html, /<meta property="og:image:height" content="630">/);
	assert.match(html, /<meta property="og:image:type" content="image\/png">/);
	assert.match(html, /<meta name="twitter:card" content="summary_large_image">/);
	assert.match(html, /<title>ballbot\.dev \| Software Engineer<\/title>/);
	assert.match(html, /ソフトウェアエンジニア ballbot のポートフォリオ。/);
	assert.doesNotMatch(html, /バックエンドエンジニア|kr\.ballbot\.dev|ko_KR/);
	// One way through for anything that renders it anyway: the Japanese build.
	assert.deepEqual([...html.matchAll(/<a href="([^"]+)"/g)].map((m) => m[1]), ["https://jp.ballbot.dev"]);
});

test("the card answers HEAD as it answers GET, and the query does not change it", async () => {
	const head = await answer("https://ballbot.dev/", { "user-agent": PREVIEW_AGENTS.Slackbot }, "HEAD");
	assert.equal(head.status, 200);
	assert.equal(head.headers.get("content-type"), "text/html; charset=utf-8");
	const shared = await answer("https://ballbot.dev/?utm_source=x", { "user-agent": PREVIEW_AGENTS.LINE });
	assert.equal(shared.status, 200);
});

test("a person and a search engine on the root are still redirected", async () => {
	for (const who of ["Chrome", "Safari", "LINE in-app, iOS", "Googlebot", "bingbot"] as const) {
		const response = await answer("https://ballbot.dev/", { "user-agent": OTHER_AGENTS[who], "cf-ipcountry": "KR" });
		assert.equal(response.status, 302, who);
		assert.equal(response.headers.get("location"), "https://kr.ballbot.dev/", who);
	}
});

test("the card is the root's alone: a fetcher anywhere else gets what everyone gets", async () => {
	const agent = { "user-agent": PREVIEW_AGENTS.Twitterbot, "cf-ipcountry": "KR" };

	const deep = await answer("https://ballbot.dev/projects/cosmonote", agent);
	assert.equal(deep.status, 302);
	assert.equal(deep.headers.get("location"), "https://kr.ballbot.dev/projects/cosmonote");

	const go = await answer("https://ballbot.dev/go/ja", agent);
	assert.equal(go.status, 302);
	assert.equal(go.headers.get("location"), "https://jp.ballbot.dev/");

	const geo = await answer("https://ballbot.dev/?geo", agent);
	assert.deepEqual(await geo.json(), { locale: "ko", source: "geo", country: "KR" });

	const post = await answer("https://ballbot.dev/", agent, "POST");
	assert.equal(post.status, 302);
});

test("every string on the card is escaped", () => {
	assert.equal(escapeHtml(`<a href="x">'&'</a>`), "&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;");
	// Every attribute value is closed by the quote that opened it.
	for (const tag of CARD.match(/<(meta|link|a) [^>]*>/g) ?? []) {
		assert.equal((tag.match(/"/g) ?? []).length % 2, 0, tag);
	}
});
