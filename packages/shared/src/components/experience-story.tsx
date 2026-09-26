import { ArrowLeft } from "lucide-react";

import type { ExperienceContent, ExperienceHighlight } from "../content-types";
import { page } from "./ui/layout";
import { StoryBody } from "./ui/story-body";

/** The column a story is read in: the measure, centred on the page. */
const COLUMN = "mx-auto w-full max-w-[760px]";

/**
 * And the figures on the same axis. A figure runs wider than the measure, so
 * it needs its own centring — left-aligned it would hang 160px off the column
 * it belongs to. Under `lg` it is a full-bleed scroll strip and there is
 * nothing to centre.
 */
const FIGURE = "lg:mx-auto lg:max-w-[var(--figure-w)]";

/**
 * One story from the Experience list, on a page of its own: the row the
 * reader clicked becomes the title, and the body sits under it at a reading
 * measure — paragraphs, sub-heads and lists in the centred column, figures
 * across the page, the way a project's essay is laid out.
 *
 * The bar at the top stands in for the site nav, whose links are `#section`
 * anchors that only resolve on the home page. It goes back to the list the
 * reader came from, not to the top of the site.
 *
 * `anim-in` on the header and <Reveal> (inside StoryBody) below it: the title
 * is what the page opens on, so it takes the hero's load-time entrance; a
 * story long enough to scroll has its blocks arrive as they are reached.
 */
export function ExperienceStory({ content, story }: { content: ExperienceContent; story: ExperienceHighlight }) {
	const company = content.company.name.replace(/\n/g, " ");
	const meta = [story.year, company].filter(Boolean).join(" · ");

	// `id="main"` is where the layout's skip link lands; `tabIndex={-1}` is what
	// lets a <main> take that focus at all.
	return (
		<main id="main" tabIndex={-1} className="flex min-h-svh flex-col">
			<div className="border-border border-b-[0.5px]">
				<div className={`${page} py-6`}>
					<a
						href="/#experience"
						className="group text-text-secondary hover:text-text-strong inline-flex items-center gap-1.5 font-mono text-[14px] transition-colors duration-300"
					>
						<ArrowLeft
							aria-hidden="true"
							strokeWidth={1.75}
							className="h-4 w-4 transition-transform duration-300 ease-[var(--ease-smooth)] group-hover:-translate-x-0.5"
						/>
						{content.label}
					</a>
				</div>
			</div>

			<article className={`${page} flex flex-1 flex-col gap-12 py-14 sm:gap-14 sm:py-20`}>
				<header className={`anim-in ${COLUMN} flex flex-col gap-3`} style={{ animationDelay: "60ms" }}>
					<p className="text-text-secondary text-meta font-mono font-light">{meta}</p>
					<h1 className="text-text-strong sm:text-title text-[26px] leading-[1.25] font-bold tracking-[-0.01em]">
						{story.title}
					</h1>
				</header>

				<StoryBody
					body={story.body}
					title={story.title}
					labels={content.gallery}
					prose={COLUMN}
					figure={FIGURE}
					headingAs="h2"
				/>
			</article>
		</main>
	);
}
