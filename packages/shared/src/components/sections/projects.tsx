import { Fragment } from "react";
import { ChevronRight } from "lucide-react";

import type { ArchiveProject, FeaturedProject, ProjectsContent } from "../../content-types";
import { ImagePlaceholder, ThumbFrame } from "../ui/image-placeholder";
import { Reveal } from "../ui/reveal";
import { Rule } from "../ui/rule";
import { SectionLabel } from "../ui/section-label";
import { page } from "../ui/layout";

/**
 * Thumbnails take a fixed share of their card (never more than a third), so the
 * text beside them always has the wider column; `aspect-ratio` keeps the design's
 * 250×170 and 205×141 proportions without pinning a height.
 */
const FEATURED_THUMB =
	"aspect-[25/17] w-full max-w-[320px] rounded-lg sm:w-[clamp(200px,40%,300px)]";

const ARCHIVE_THUMB = "aspect-[205/141] w-full max-w-[280px] rounded-[4px] sm:w-[clamp(120px,32%,170px)]";

function FeaturedCard({ project }: { project: FeaturedProject }) {
	return (
		// `min-w-0` is what keeps the card inside its column: without it the fixed
		// thumbnail sets a min-content width the two-up row cannot honour at 1024,
		// and the card spills across the rule into its neighbour.
		<article className="group flex min-w-0 flex-1 flex-col justify-center gap-4 py-3">
			<div className="flex min-w-0 flex-col items-start gap-2.5 sm:flex-row">
				<ThumbFrame
					media={project.thumbnail}
					sizes="(max-width: 640px) 90vw, 20vw"
					className={FEATURED_THUMB}
				/>

				<div className="flex w-full min-w-0 flex-1 flex-col justify-center gap-3 py-1 sm:px-2.5">
					<p className="text-text-secondary text-meta font-mono">{project.period}</p>

					<div className="flex min-w-0 items-center gap-2.5">
						{/* The design draws a bare 32px placeholder here, not a padded surface tile. */}
						<ImagePlaceholder media={project.appIcon} sizes="32px" className="h-8 w-8 shrink-0 rounded-lg" />
						<h3 className="text-text-strong sm:text-title min-w-0 truncate text-[26px] font-bold">
							{project.title}
						</h3>
					</div>

					<p className="text-text-secondary text-body leading-relaxed font-medium">{project.description}</p>

					<ul className="flex flex-wrap gap-1">
						{project.tags.map((tag) => (
							<li key={tag} className="bg-surface text-text-secondary rounded-[32px] p-2 text-[12px] font-semibold">
								{tag}
							</li>
						))}
					</ul>
				</div>
			</div>

			{/* The numbers sit under image and copy as a full-width foot, so the text
			    column beside the thumbnail stays short and the two never fight for width. */}
			<div className="border-border flex items-stretch border-t-[0.5px] px-1 pt-4">
				{project.stats.map((stat, index) => (
					<Fragment key={stat.label}>
						{index > 0 ? <div aria-hidden="true" className="bg-border mx-4 w-[0.5px] shrink-0" /> : null}
						<div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
							<p className="text-text-strong text-[20px] font-bold">{stat.value}</p>
							<p className="text-text-secondary text-[13px] leading-tight font-light">{stat.label}</p>
						</div>
					</Fragment>
				))}
			</div>
		</article>
	);
}

function ArchiveCard({ project }: { project: ArchiveProject }) {
	return (
		<article className="group flex min-w-0 flex-1 flex-col items-start gap-2.5 py-6 sm:flex-row sm:items-center">
			<ThumbFrame media={project.thumbnail} sizes="(max-width: 1280px) 28vw, 14vw" className={ARCHIVE_THUMB} />

			<div className="flex w-full min-w-0 flex-1 flex-col justify-center gap-3 py-2 sm:px-2.5">
				<p className="text-text-secondary text-meta font-mono">{project.period}</p>
				<h3 className="text-text-strong sm:text-subtitle text-[20px] font-bold">{project.title}</h3>
				<p className="text-text-secondary text-[14px] font-medium">{project.description}</p>
			</div>
		</article>
	);
}

export function Projects({ content }: { content: ProjectsContent }) {
	return (
		<section id="projects" data-section aria-labelledby="projects-label">
			<SectionLabel id="projects-label">{content.label}</SectionLabel>

			{/* The three blocks each take a share of whatever the labels leave over, so
			    a tall desktop viewport is spent on taller rows rather than a blank foot. */}
			<div className="border-border flex flex-1 flex-col border-y-[0.5px]">
				<div className={`${page} flex flex-1 flex-col lg:flex-row lg:gap-3`}>
					{content.featured.map((project, index) => (
						<Fragment key={project.title}>
							{index > 0 ? <Rule /> : null}
							<Reveal delay={index * 90} className="flex min-w-0 flex-1">
								<FeaturedCard project={project} />
							</Reveal>
						</Fragment>
					))}
				</div>
			</div>

			<SectionLabel>{content.archiveLabel}</SectionLabel>

			{/* Three-up only from `xl`: at 1024 a third of the row leaves the card ~140px
			    of text column, which breaks a Korean title across the middle of a word. */}
			<div className="border-border flex flex-1 flex-col border-y-[0.5px]">
				<div className={`${page} flex flex-1 flex-col xl:flex-row xl:gap-3`}>
					{content.archive.map((project, index) => (
						<Fragment key={index}>
							{index > 0 ? <Rule stack="xl" /> : null}
							<Reveal delay={index * 90} className="flex min-w-0 flex-1">
								<ArchiveCard project={project} />
							</Reveal>
						</Fragment>
					))}
				</div>
			</div>

			<div className={`${page} flex flex-1 flex-col py-3`}>
				{content.list.map((item, index) => (
					<Reveal key={index} delay={index * 60} className="flex flex-1">
						<a
							href={item.href ?? "#projects"}
							className="group hover:bg-surface/60 flex w-full min-w-0 items-center gap-2.5 px-2.5 py-1.5 transition-colors duration-300"
						>
							<span className="text-text-secondary w-16 shrink-0 text-[14px] font-light sm:text-[15px] md:w-24 lg:w-[clamp(120px,12vw,220px)]">
								{item.year}
							</span>
							<span className="text-text-strong min-w-0 flex-1 truncate text-[15px] font-semibold">
								{item.title}
							</span>
							<span className="text-text-secondary hidden min-w-0 flex-1 truncate text-[15px] lg:block">
								{item.summary}
							</span>
							<ChevronRight
								aria-hidden="true"
								strokeWidth={1.75}
								className="text-text-secondary group-hover:text-text-strong h-6 w-6 shrink-0 transition-transform duration-300 ease-[var(--ease-smooth)] group-hover:translate-x-1"
							/>
						</a>
					</Reveal>
				))}
			</div>

			{/* Enough to keep the last row off the boundary — the screen below now
			    opens on a hairline and ~98px of air, so the old 32px is double-paid. */}
		</section>
	);
}
