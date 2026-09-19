import type { MetadataRoute } from "next";

import { LANGUAGE_ALTERNATES, MARKETS } from "@ballbot/shared/markets";

import { experience } from "@/content/portfolio";

/**
 * The home page carries the language map, which is how a crawler learns the
 * two market builds are the same document in two languages rather than
 * duplicates competing with each other. The story pages follow it, one per
 * row on the Experience list.
 */
export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: MARKETS.ko,
			alternates: { languages: LANGUAGE_ALTERNATES },
		},
		...experience.highlights.map(({ slug }) => ({ url: `${MARKETS.ko}/experience/${slug}` })),
	];
}
