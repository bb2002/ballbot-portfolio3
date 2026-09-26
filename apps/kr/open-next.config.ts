import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * The prerendered pages have to be found somewhere at request time. Left at
 * its default (`dummy`) the incremental cache holds nothing: `/` was still
 * rendered on demand, but every `/projects/[slug]` and `/experience/[slug]` —
 * prerendered under `dynamicParams = false` — answered 404 in production while
 * the sitemap kept advertising them.
 *
 * This cache is the Workers static-asset tree itself. `opennextjs-cloudflare
 * deploy|upload|preview` copy `.open-next/cache` into
 * `.open-next/assets/cdn-cgi/_next_cache/` (a path only the Worker can read),
 * and a page lookup becomes one ASSETS fetch. Read-only, no bucket, no extra
 * binding — right for a site that never revalidates.
 *
 * Two things follow. A bare `wrangler deploy` skips that copy and the story
 * pages go back to 404 without a build error, so deploy through the scripts in
 * package.json and run `npm run check:live` after — it asserts
 * `x-nextjs-cache: HIT`, not just a 200. And this cache throws on composable
 * (`"use cache"`) reads, which nothing here does today.
 */
export default defineCloudflareConfig({
	incrementalCache: staticAssetsIncrementalCache,
});
