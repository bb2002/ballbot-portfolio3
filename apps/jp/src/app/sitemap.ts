import type { MetadataRoute } from "next";

import { LANGUAGE_ALTERNATES, MARKETS } from "@ballbot/shared/markets";

/**
 * One page, so one entry — but it carries the language map, which is how a
 * crawler learns the two market builds are the same document in two languages
 * rather than duplicates competing with each other.
 */
export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: MARKETS.ja,
			alternates: { languages: LANGUAGE_ALTERNATES },
		},
	];
}
