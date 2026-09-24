import type { MetadataRoute } from "next";

import { LANGUAGE_ALTERNATES, MARKETS } from "@ballbot/shared/markets";

import { experience, projects } from "@/content/portfolio";

/**
 * The home page carries the language map, which is how a crawler learns the
 * two market builds are the same document in two languages rather than
 * duplicates competing with each other. The story pages follow it: one per
 * row on the Experience list, and one per project that has a page of its own.
 */
export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: MARKETS.ja,
			alternates: { languages: LANGUAGE_ALTERNATES },
		},
		...experience.highlights.map(({ slug }) => ({ url: `${MARKETS.ja}/experience/${slug}` })),
		...[...projects.featured, ...projects.archive]
			.filter((project) => project.slug && project.story)
			.map(({ slug }) => ({ url: `${MARKETS.ja}/projects/${slug}` })),
	];
}
