import type { MetadataRoute } from "next";

import { languageAlternates, marketUrl } from "@ballbot/shared/markets";

import { experience, projects } from "@/content/portfolio";

/**
 * Every entry carries the language map for its own path, which is how a
 * crawler learns the two market builds are the same document in two languages
 * rather than duplicates competing with each other — the home page and the
 * story pages alike. One story per row on the Experience list, and one per
 * project that has a page of its own. Both builds publish the same slugs
 * (scripts/slugs.test.mjs holds them to it), so every map points at a page
 * that exists.
 */
export default function sitemap(): MetadataRoute.Sitemap {
	const entry = (path: `/${string}`) => ({
		url: marketUrl("ko", path),
		alternates: { languages: languageAlternates(path) },
	});
	return [
		entry("/"),
		...experience.highlights.map(({ slug }) => entry(`/experience/${slug}`)),
		...[...projects.featured, ...projects.archive]
			.filter((project) => project.slug && project.story)
			.map(({ slug }) => entry(`/projects/${slug}`)),
	];
}
