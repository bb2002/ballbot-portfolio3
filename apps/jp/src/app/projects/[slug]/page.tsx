import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectStory, type ArchiveProject, type FeaturedProject, type ProjectStoryContent } from "@ballbot/shared";

import { projects } from "@/content/portfolio";

type Params = { slug: string };

type Project = FeaturedProject | ArchiveProject;
type Told = Project & { slug: string; story: ProjectStoryContent };

/** A project with a page of its own: it has an address, and something to put at it. */
function isTold(project: Project): project is Told {
	return Boolean(project.slug && project.story);
}

const told: readonly Told[] = [...projects.featured, ...projects.archive].filter(isTold);

/** Every page is known at build time: they prerender, and any other slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
	return told.map(({ slug }) => ({ slug }));
}

function findProject(slug: string) {
	return told.find((project) => project.slug === slug);
}

/**
 * `alternates` is set here on purpose: the root layout's canonical is `/`, and
 * a page that inherited it would tell a crawler it is a copy of the home page.
 */
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
	const { slug } = await params;
	const project = findProject(slug);
	if (!project) return {};
	const path = `/projects/${slug}`;
	const description = project.story.tagline;
	return {
		title: `${project.title} | ballbot.dev`,
		description,
		alternates: { canonical: path },
		openGraph: { title: project.title, description, url: path, type: "article" },
	};
}

export default async function ProjectStoryPage({ params }: { params: Promise<Params> }) {
	const { slug } = await params;
	const project = findProject(slug);
	if (!project) notFound();
	return <ProjectStory content={projects} project={project} story={project.story} />;
}
