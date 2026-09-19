import type { NextConfig } from "next";

/**
 * Response headers for everything this build serves itself.
 *
 * `public/_headers` only reaches the static asset tree — the document, the
 * route handler and the metadata routes are rendered by the Worker, so their
 * headers have to come from here or they ship with none at all.
 *
 * No Content-Security-Policy: the App Router emits inline bootstrap scripts and
 * the root layout adds one of its own, so a policy worth having needs a nonce —
 * and a nonce makes every response dynamic, which costs this site its static
 * render for a page that embeds no third-party code. The headers below carry no
 * such trade.
 */
const SECURITY_HEADERS = [
	{ key: "X-Content-Type-Options", value: "nosniff" },
	{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
	/* One page, no embeds: nothing here is meant to be framed by anyone. */
	{ key: "X-Frame-Options", value: "DENY" },
	{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
	{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
	/* The framework version is not something a reader needs told. */
	poweredByHeader: false,
	async headers() {
		return [{ source: "/:path*", headers: SECURITY_HEADERS }];
	},
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
//
// Guarded on NODE_ENV: unguarded it also runs during `next build`, where it
// boots a Miniflare instance and loads `.dev.vars` into a production build for
// bindings that build never reads.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
if (process.env.NODE_ENV === "development") initOpenNextCloudflareForDev();
