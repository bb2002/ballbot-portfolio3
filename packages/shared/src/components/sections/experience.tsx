import { ChevronRight } from "lucide-react";

import type { ExperienceContent } from "../../content-types";
import { ImagePlaceholder } from "../ui/image-placeholder";
import { Reveal } from "../ui/reveal";
import { SectionLabel } from "../ui/section-label";

export function Experience({ content }: { content: ExperienceContent }) {
	const { company, highlights } = content;

	return (
		<section id="experience" data-section aria-labelledby="experience-label">
			<SectionLabel id="experience-label" border="bottom-hairline">
				{content.label}
			</SectionLabel>

			{/* Company column | rule | highlight entries, capped to the 1512 canvas so the
			    body stays aligned with the section label above it.
			    `flex-1` hands this body everything the label leaves over: it is the one
			    block on the screen, so the two highlight rows below split a full viewport
			    between them rather than stacking at the top of an empty screen. */}
			<div className="mx-auto flex w-full max-w-[1512px] flex-1 flex-col lg:flex-row">
				<Reveal className="flex flex-col justify-center px-[var(--page-x)] lg:shrink-0">
					<div className="flex flex-col gap-2.5 py-6">
						<p className="text-text-strong text-meta font-mono font-light">{company.period}</p>

						<div className="flex flex-col gap-2 py-10">
							<h3 className="text-text-strong lg:text-display text-[36px] leading-[1.15] font-semibold whitespace-pre-line sm:text-[48px]">
								{company.name}
							</h3>
							<p className="text-text-strong text-subtitle font-semibold">{company.role}</p>
							<p className="text-text-secondary text-lead">{company.teams}</p>
							<div className="flex gap-2.5">
								{company.logos.map((logo) => (
									<ImagePlaceholder
										key={logo.alt}
										media={logo}
										sizes="56px"
										className="h-10 w-10 lg:h-[clamp(40px,3.4vw,56px)] lg:w-[clamp(40px,3.4vw,56px)]"
									/>
								))}
							</div>
						</div>

						{company.notes?.length ? (
							<div className="flex flex-col justify-center gap-1">
								{company.notes.map((note) => (
									<p key={note} className="text-text-secondary text-[15px]">
										{note}
									</p>
								))}
							</div>
						) : null}
					</div>
				</Reveal>

				<div aria-hidden="true" className="bg-border h-[0.5px] w-full shrink-0 lg:h-auto lg:w-[0.5px]" />

				{/* One row per story. The body that used to sit here lives on the story's
				    own page now, so the column is a list: title, chevron, hairline. The
				    rows are centred in the column the same way the company block is. */}
				<div className="flex min-w-0 flex-1 flex-col justify-center px-[var(--page-x)] py-8 lg:px-10 lg:py-10">
					<ul className="flex flex-col">
						{highlights.map((story, index) => (
							<li key={story.slug} className={index > 0 ? "border-border border-t-[0.5px]" : ""}>
								<Reveal delay={index * 70}>
									<a
										href={`/experience/${story.slug}`}
										className="group hover:bg-surface/60 flex items-center gap-4 px-2.5 py-5 transition-colors duration-300"
									>
										<span className="flex min-w-0 flex-1 flex-col gap-1">
											<span className="text-text-strong sm:text-card text-[17px] leading-snug font-semibold">
												{story.title}
											</span>
											{story.subtitle ? (
												<span className="text-text-secondary text-[14px] leading-snug">{story.subtitle}</span>
											) : null}
										</span>
										<ChevronRight
											aria-hidden="true"
											strokeWidth={1.75}
											className="text-text-secondary group-hover:text-text-strong h-6 w-6 shrink-0 transition-transform duration-300 ease-[var(--ease-smooth)] group-hover:translate-x-1"
										/>
									</a>
								</Reveal>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}
