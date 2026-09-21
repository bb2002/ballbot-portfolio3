import { Fragment } from "react";

import type { ArchiveProject, FeaturedProject, GalleryLabels, ProjectsContent } from "../../content-types";
import { GalleryThumb } from "../ui/gallery-thumb";
import { ImagePlaceholder, ThumbFrame } from "../ui/image-placeholder";
import { ProjectLinks } from "../ui/project-links";
import { Reveal } from "../ui/reveal";
import { Rule } from "../ui/rule";
import { SectionLabel } from "../ui/section-label";
import { page } from "../ui/layout";

/**
 * Thumbnails take a fixed share of their card (never more than a third), so the
 * text beside them always has the wider column; `aspect-ratio` keeps the design's
 * 250×170 and 205×141 proportions without pinning a height.
 */
const FEATURED_THUMB = "aspect-[25/17] w-full max-w-[320px] rounded-lg sm:w-[clamp(200px,40%,300px)]";

const ARCHIVE_THUMB = "aspect-[205/141] w-full max-w-[280px] rounded-[4px] sm:w-[clamp(120px,32%,170px)]";

/**
 * A title that is also the way into the project's own page. It borrows the
 * hero's sliding underline and adds nothing else: the title reads as the
 * title, and the page behind it is found by the pointer, not announced.
 */
function StoryLink({ href, children }: { href: string; children: string }) {
	return (
		<a href={href} className="group/story relative inline-block">
			{children}
			<span
				aria-hidden="true"
				className="bg-text-strong absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 transition-transform duration-300 ease-[var(--ease-smooth)] group-hover/story:scale-x-100"
			/>
		</a>
	);
}

/** The title, as a link when the project has a page of its own and plain text when it has not. */
function Title({ project }: { project: FeaturedProject | ArchiveProject }) {
	return project.slug && project.story ? (
		<StoryLink href={`/projects/${project.slug}`}>{project.title}</StoryLink>
	) : (
		<>{project.title}</>
	);
}

function FeaturedCard({ project, galleryLabels }: { project: FeaturedProject; galleryLabels?: GalleryLabels }) {
	const thumbSizes = "(max-width: 640px) 90vw, 20vw";

	return (
		// `min-w-0` is what keeps the card inside its column: without it the fixed
		// thumbnail sets a min-content width the two-up row cannot honour at 1024,
		// and the card spills across the rule into its neighbour.
		<article className="group flex min-w-0 flex-1 flex-col justify-center gap-4 py-3">
			<div className="flex min-w-0 flex-col items-start gap-2.5 sm:flex-row">
				{/* The thumbnail is a door only when there is a room behind it: a
				    project with screens to page through gets the clickable tile, one
				    without keeps the plain frame rather than a control that opens
				    nothing. `galleryLabels` is what the market calls those controls —
				    with no labels there is no accessible name, so there is no button. */}
				{project.gallery?.length && galleryLabels ? (
					<GalleryThumb
						media={project.thumbnail}
						gallery={project.gallery}
						title={project.title}
						labels={galleryLabels}
						sizes={thumbSizes}
						className={`shrink-0 ${FEATURED_THUMB}`}
					/>
				) : (
					<ThumbFrame media={project.thumbnail} sizes={thumbSizes} className={FEATURED_THUMB} />
				)}

				<div className="flex w-full min-w-0 flex-1 flex-col justify-center gap-3 py-1 sm:px-2.5">
					<p className="text-text-secondary text-meta font-mono">{project.period}</p>

					{/* `items-start`, and no `truncate` on the title: two-up between 1024
					    and 1280 the text column is ~165px wide, which cut "코스모의 노트"
					    to "코스모의 …". A project's own name is the one string on the card
					    that must never be clipped, so it wraps and the icon stays on the
					    first line of it. */}
					<div className="flex min-w-0 items-start gap-2.5">
						{/* The design draws a bare 32px placeholder here, not a padded surface tile. */}
						<ImagePlaceholder media={project.appIcon} sizes="32px" className="mt-0.5 h-8 w-8 shrink-0 rounded-lg" />
						{/* `lg:text-[26px]`: lg is where the cards go two-up and the text
						    column drops to ~165px. Holding the title at the stacked layout's
						    32px there wrapped it onto a second line; the display step comes
						    back at xl, where the column is wide enough to carry it on one. */}
						<h3 className="text-text-strong sm:text-title xl:text-title min-w-0 text-[26px] leading-tight font-bold lg:text-[26px]">
							<Title project={project} />
						</h3>
					</div>

					<p className="text-text-secondary text-body leading-relaxed font-medium">{project.description}</p>

					<ProjectLinks links={project.links} title={project.title} />
				</div>
			</div>
		</article>
	);
}

function ArchiveCard({ project, galleryLabels }: { project: ArchiveProject; galleryLabels?: GalleryLabels }) {
	const thumbSizes = "(max-width: 1280px) 28vw, 14vw";

	return (
		<article className="group flex min-w-0 flex-1 flex-col items-start gap-2.5 py-6 sm:flex-row sm:items-center">
			{project.gallery?.length && galleryLabels ? (
				<GalleryThumb
					media={project.thumbnail}
					gallery={project.gallery}
					title={project.title}
					labels={galleryLabels}
					sizes={thumbSizes}
					className={`shrink-0 ${ARCHIVE_THUMB}`}
				/>
			) : (
				<ThumbFrame media={project.thumbnail} sizes={thumbSizes} className={ARCHIVE_THUMB} />
			)}

			<div className="flex w-full min-w-0 flex-1 flex-col justify-center gap-3 py-2 sm:px-2.5">
				<p className="text-text-secondary text-meta font-mono">{project.period}</p>
				<h3 className="text-text-strong sm:text-subtitle text-[20px] font-bold">
					<Title project={project} />
				</h3>
				<p className="text-text-secondary text-[14px] font-medium">{project.description}</p>
				<ProjectLinks links={project.links} title={project.title} />
			</div>
		</article>
	);
}

export function Projects({ content }: { content: ProjectsContent }) {
	return (
		<section id="projects" data-section aria-labelledby="projects-label">
			<SectionLabel id="projects-label">{content.label}</SectionLabel>

			{/* Two featured cards, side by side from `lg`. The rows are as tall as the
			    cards in them — the section no longer has a viewport to fill, so there is
			    no slack to hand out and nothing gets stretched to take it. */}
			<div className="border-border border-y-[0.5px]">
				<div className={`${page} flex flex-col lg:flex-row lg:gap-3`}>
					{content.featured.map((project, index) => (
						<Fragment key={project.title}>
							{index > 0 ? <Rule /> : null}
							<Reveal delay={index * 90} className="flex min-w-0 flex-1">
								<FeaturedCard project={project} galleryLabels={content.gallery} />
							</Reveal>
						</Fragment>
					))}
				</div>
			</div>

			{/* Three-up only from `xl`: at 1024 a third of the row leaves the card ~140px
			    of text column, which breaks a Korean title across the middle of a word.

			    `border-b` only: with no label between them this row sits straight
			    under the featured row's bottom hairline, and a top border here
			    would draw the same line twice. */}
			<div className="border-border border-b-[0.5px]">
				<div className={`${page} flex flex-col xl:flex-row xl:gap-3`}>
					{content.archive.map((project, index) => (
						<Fragment key={project.title}>
							{index > 0 ? <Rule stack="xl" /> : null}
							<Reveal delay={index * 90} className="flex min-w-0 flex-1">
								<ArchiveCard project={project} galleryLabels={content.gallery} />
							</Reveal>
						</Fragment>
					))}
				</div>
			</div>
		</section>
	);
}
