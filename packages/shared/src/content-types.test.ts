/**
 * `projectStories` is the list the story route prerenders, the sitemap
 * publishes and the print document binds in, so a slip here is a page that
 * exists in one of the three and not the others. Plain data in, no React.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import type { ArchiveProject, FeaturedProject, ProjectsContent, ProjectStoryContent } from "./content-types.ts";
import { projectStories } from "./content-types.ts";

const story = {
	tagline: "",
	facts: [],
	motivation: [],
	labels: { highlights: "", motivation: "", process: "", back: "" },
} satisfies ProjectStoryContent;

const media = { alt: "" };

function featured(title: string, extra: Partial<FeaturedProject> = {}): FeaturedProject {
	return { period: "", title, description: "", thumbnail: media, appIcon: media, ...extra };
}

function archived(title: string, extra: Partial<ArchiveProject> = {}): ArchiveProject {
	return { period: "", title, description: "", thumbnail: media, ...extra };
}

test("the featured row comes first, then the archive, each in its own order", () => {
	const content: ProjectsContent = {
		label: "",
		featured: [featured("a", { slug: "a", story }), featured("b", { slug: "b", story })],
		archive: [archived("c", { slug: "c", story })],
	};
	assert.deepEqual(
		projectStories(content).map((project) => project.slug),
		["a", "b", "c"],
	);
});

test("a project needs both an address and a story to be listed", () => {
	const content: ProjectsContent = {
		label: "",
		featured: [featured("slug only", { slug: "x" }), featured("story only", { story })],
		archive: [archived("neither"), archived("both", { slug: "y", story })],
	};
	assert.deepEqual(
		projectStories(content).map((project) => project.title),
		["both"],
	);
});
