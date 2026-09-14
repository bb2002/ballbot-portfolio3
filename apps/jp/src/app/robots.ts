import type { MetadataRoute } from "next";

import { MARKETS } from "@ballbot/shared/markets";

/**
 * Each market is its own host, so each one serves its own robots.txt naming
 * its own sitemap. Nothing is disallowed: the site is one public page.
 */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: { userAgent: "*", allow: "/" },
		sitemap: `${MARKETS.ja}/sitemap.xml`,
		host: MARKETS.ja,
	};
}
