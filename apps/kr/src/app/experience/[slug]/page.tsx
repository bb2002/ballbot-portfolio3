import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExperienceStory } from "@ballbot/shared";

import { experience } from "@/content/portfolio";

type Params = { slug: string };

/** Every story is known at build time: the pages prerender, and any other slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
	return experience.highlights.map(({ slug }) => ({ slug }));
}

function findStory(slug: string) {
	return experience.highlights.find((story) => story.slug === slug);
}

/**
 * `alternates` is set here on purpose: the root layout's canonical is `/`, and
 * a story that inherited it would tell a crawler it is a copy of the home page.
 */
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
	const { slug } = await params;
	const story = findStory(slug);
	if (!story) return {};
	const path = `/experience/${slug}`;
	const description = story.subtitle ?? story.body.find((block): block is string => typeof block === "string");
	return {
		title: `${story.title} | ballbot.dev`,
		description,
		alternates: { canonical: path },
		openGraph: { title: story.title, description, url: path, type: "article" },
	};
}

export default async function ExperienceStoryPage({ params }: { params: Promise<Params> }) {
	const { slug } = await params;
	const story = findStory(slug);
	if (!story) notFound();
	return <ExperienceStory content={experience} story={story} />;
}
