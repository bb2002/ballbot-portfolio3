import type { Metadata } from "next";
import { ExperienceStory, PrintChapter, ProjectStory, projectStories } from "@ballbot/shared";
import { openGraphBase } from "@ballbot/shared/markets";

import { experience, hero, projects } from "@/content/portfolio";

import Home from "../page";

/**
 * The whole site on one page, for the PDF the hero's download link hands out
 * (packages/shared/scripts/render-pdf.mjs prints this route off the live
 * site, or off a local build of it with `--local`; docs/how-to-portfolio-to-pdf).
 * The home page comes first, as this market composes it — `Home` is
 * the app's own page, so its sections keep their order without a second copy
 * of it — then every project story and every experience story, in the order
 * the sections list them, each in a chapter the script can send a link to.
 * The footer is the layout's, once, at the end.
 *
 * It is a source to print from, not a page to read: what paper keeps and where
 * the sheets turn is the print rules' business — the document's in theme.css,
 * each component's own as its `print:` utilities — and on screen this is only
 * the pages one after another. Public, because the Worker has to serve it to
 * the script, but kept out of the index and out of the sitemap — a reader who
 * wants everything in one piece is handed the PDF.
 *
 * `alternates` and `openGraph` are set for the reason the story routes set
 * them (Next merges metadata shallowly): left to the layout, this page carried
 * the home page's canonical, its hreflang links and its og:url, and so told a
 * crawler it was a copy of the home page while asking to be left out of the
 * index. It has nothing to put there — a page kept out of the index needs no
 * canonical, and no reader is to be sent to the other market's copy of it —
 * so `alternates` is cleared, and a link to it previews as the document it
 * prints to.
 */
export const metadata: Metadata = {
	title: hero.actions.download.title,
	robots: { index: false, follow: false },
	alternates: null,
	openGraph: { ...openGraphBase("ko"), title: hero.actions.download.title, url: "/print", type: "website" },
};

export default function Print() {
	return (
		<>
			<Home />
			{projectStories(projects).map((project) => (
				<PrintChapter key={project.slug} path={`/projects/${project.slug}`}>
					<ProjectStory content={projects} project={project} story={project.story} bound />
				</PrintChapter>
			))}
			{experience.highlights.map((story) => (
				<PrintChapter key={story.slug} path={`/experience/${story.slug}`}>
					<ExperienceStory content={experience} story={story} />
				</PrintChapter>
			))}
		</>
	);
}
