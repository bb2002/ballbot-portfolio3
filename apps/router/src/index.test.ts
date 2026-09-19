/**
 * The apex has no UI to check it by: every answer it gives is a status line and
 * a `location` header, and the one that matters most is the one it must never
 * give — a redirect off ballbot.dev. These run under `node --test`, which
 * strips the types and runs the module as-is; nothing here needs a Worker.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import worker, { MARKETS, carry, decide, readCookie } from "./index.ts";

/** A request as the edge hands it over. `cf` is absent, as it is under `wrangler dev`. */
function edge(url: string, headers: Record<string, string> = {}) {
	return new Request(url, { headers }) as never;
}

function answer(url: string, headers: Record<string, string> = {}) {
	return worker.fetch(edge(url, headers));
}

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
