import { ArrowLeft } from "lucide-react";

import type { ExperienceContent, ExperienceHighlight } from "../content-types";
import { page } from "./ui/layout";

/**
 * One story from the Experience list, on a page of its own: the row the
 * reader clicked becomes the title, and the paragraphs the section used to
 * carry inline sit under it at a reading measure.
 *
 * The bar at the top stands in for the site nav, whose links are `#section`
 * anchors that only resolve on the home page. It goes back to the list the
 * reader came from, not to the top of the site.
 *
 * `anim-in` rather than <Reveal>: everything here is above the fold, so the
 * hero's load-time entrance is the right motion and needs no observer.
 */
export function ExperienceStory({ content, story }: { content: ExperienceContent; story: ExperienceHighlight }) {
	const company = content.company.name.replace(/\n/g, " ");
	const meta = [story.year, company].filter(Boolean).join(" · ");

	return (
		<main className="flex min-h-svh flex-col">
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

			<article className={`${page} flex flex-1 flex-col py-14 sm:py-20`}>
				<div className="mx-auto flex w-full max-w-[760px] flex-col gap-10">
					<header className="anim-in flex flex-col gap-3" style={{ animationDelay: "60ms" }}>
						<p className="text-text-secondary text-meta font-mono font-light">{meta}</p>
						<h1 className="text-text-strong sm:text-title text-[26px] leading-[1.25] font-bold tracking-[-0.01em]">
							{story.title}
						</h1>
					</header>

					<div className="anim-in flex flex-col gap-4" style={{ animationDelay: "160ms" }}>
						{story.paragraphs.map((paragraph, index) => (
							<p key={index} className="text-text-secondary text-body leading-[1.8]">
								{paragraph}
							</p>
						))}
					</div>
				</div>
			</article>
		</main>
	);
}
