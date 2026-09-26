/**
 * The URLs a crawler is told about all come out of markets.ts — canonical,
 * hreflang, sitemap, Open Graph — so a slip here is a slip on every page of
 * both builds. These run under `node --test`, which strips the types and runs
 * the module as-is; nothing here needs React or Next.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import { APEX, LANGUAGE_ALTERNATES, MARKETS, OG_IMAGE, languageAlternates, marketUrl, openGraphBase } from "./markets.ts";

test("the root of a market is the bare host, as Next spells the home canonical", () => {
	assert.equal(marketUrl("ko"), "https://kr.ballbot.dev");
	assert.equal(marketUrl("ja", "/"), "https://jp.ballbot.dev");
});

test("any other path is appended to the market host as written", () => {
	assert.equal(marketUrl("ko", "/projects/cosmonote"), "https://kr.ballbot.dev/projects/cosmonote");
	assert.equal(marketUrl("ja", "/experience/aws-cost"), "https://jp.ballbot.dev/experience/aws-cost");
});

test("a page's language map names both markets and the apex at the same path", () => {
	assert.deepEqual(languageAlternates("/projects/cosmonote"), {
		ko: "https://kr.ballbot.dev/projects/cosmonote",
		ja: "https://jp.ballbot.dev/projects/cosmonote",
		"x-default": "https://ballbot.dev/projects/cosmonote",
	});
});

test("the home map is the root map, and its x-default is the apex itself", () => {
	assert.deepEqual(LANGUAGE_ALTERNATES, languageAlternates("/"));
	assert.equal(LANGUAGE_ALTERNATES["x-default"], APEX);
	assert.equal(LANGUAGE_ALTERNATES.ko, MARKETS.ko);
	assert.equal(LANGUAGE_ALTERNATES.ja, MARKETS.ja);
});

test("Open Graph names the site, the market's locale, the other market's as alternate, and the card image", () => {
	assert.deepEqual(openGraphBase("ko"), { siteName: "ballbot.dev", locale: "ko_KR", alternateLocale: ["ja_JP"], images: [OG_IMAGE] });
	assert.deepEqual(openGraphBase("ja"), { siteName: "ballbot.dev", locale: "ja_JP", alternateLocale: ["ko_KR"], images: [OG_IMAGE] });
	assert.deepEqual(OG_IMAGE, { url: "/opengraph-image.png", width: 1200, height: 630, type: "image/png" });
});

test("a market is never its own alternate locale", () => {
	for (const locale of ["ko", "ja"] as const) {
		const { locale: own, alternateLocale } = openGraphBase(locale);
		assert.ok(!alternateLocale.includes(own));
	}
});
