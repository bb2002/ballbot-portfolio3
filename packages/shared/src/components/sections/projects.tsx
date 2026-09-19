import { Fragment } from "react";
import { ArrowUpRight } from "lucide-react";

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

					{/* `items-start`, and no `truncate` on the title: two-up between 1024
					    and 1280 the text column is ~165px wide, which cut "코스모의 노트"
					    to "코스모의 …". A project's own name is the one string on the card
					    that must never be clipped, so it wraps and the icon stays on the
					    first line of it. */}
					<div className="flex min-w-0 items-start gap-2.5">
						{/* The design draws a bare 32px placeholder here, not a padded surface tile. */}
						<ImagePlaceholder
							media={project.appIcon}
							sizes="32px"
							className="mt-0.5 h-8 w-8 shrink-0 rounded-lg"
						/>
						{/* `lg:text-[26px]`: lg is where the cards go two-up and the text
						    column drops to ~165px. Holding the title at the stacked layout's
						    32px there wrapped it and left the two stat feet off each other's
						    line; the display step comes back at xl, where the column is wide
						    enough to carry it on one line. */}
						<h3 className="text-text-strong sm:text-title xl:text-title min-w-0 text-[26px] leading-tight font-bold lg:text-[26px]">
							{project.title}
						</h3>
					</div>

					<p className="text-text-secondary text-body leading-relaxed font-medium">{project.description}</p>

					{/* Where the thing actually is. The design put the stack in pills
					    here; on a project that ships, the address is worth more to a
					    reader than the list of what it was built with — and a pill that
					    is also a link invites a click the stack name cannot honour. So
					    these read as links, borrowing the hero's sliding underline. */}
					{project.links?.length ? (
						<ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
							{project.links.map((link) => (
								<li key={link.href}>
									<a
										href={link.href}
										target="_blank"
										rel="noreferrer noopener"
										// The visible label leads, so the accessible name still
										// opens with the text on screen; the suffix is only there to
										// tell a reader tabbing a list of links which card it is in.
										aria-label={`${link.label} — ${project.title}`}
										className="group/link text-text-strong inline-flex items-center gap-1 text-[14px] font-semibold"
									>
										<span className="relative">
											{link.label}
											<span
												aria-hidden="true"
												className="bg-text-strong absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-300 ease-[var(--ease-smooth)] group-hover/link:scale-x-100"
											/>
										</span>
										<ArrowUpRight
											aria-hidden="true"
											strokeWidth={2}
											className="h-4 w-4 shrink-0 transition-transform duration-300 ease-[var(--ease-smooth)] group-hover/link:-translate-y-px group-hover/link:translate-x-px"
										/>
									</a>
								</li>
							))}
						</ul>
					) : null}
				</div>
			</div>

			{/* The numbers sit under image and copy as a full-width foot, so the text
			    column beside the thumbnail stays short and the two never fight for width.

			    `lg:mt-auto` is what keeps the two feet on one line once the cards go
			    two-up. The cards are equal height, but the copy inside them is not —
			    one description wrapping to a fourth line, or carrying a link row its
			    neighbour has not got yet, centred the shorter card 30px lower and
			    split the stat band across two lines. Pinning the foot to the bottom
			    lands both on the same baseline and tops the titles off each other.
			    Stacked, each card owns its own row and centring still reads better. */}
			<div className="border-border flex items-stretch border-t-[0.5px] px-1 pt-4 lg:mt-auto">
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

			{/* Three-up only from `xl`: at 1024 a third of the row leaves the card ~140px
			    of text column, which breaks a Korean title across the middle of a word.

			    `border-b` only: with no label between them this row sits straight
			    under the featured row's bottom hairline, and a top border here
			    would draw the same line twice. */}
			<div className="border-border flex flex-1 flex-col border-b-[0.5px]">
				<div className={`${page} flex flex-1 flex-col xl:flex-row xl:gap-3`}>
					{content.archive.map((project, index) => (
						<Fragment key={project.title}>
							{index > 0 ? <Rule stack="xl" /> : null}
							<Reveal delay={index * 90} className="flex min-w-0 flex-1">
								<ArchiveCard project={project} />
							</Reveal>
						</Fragment>
					))}
				</div>
			</div>
		</section>
	);
}
