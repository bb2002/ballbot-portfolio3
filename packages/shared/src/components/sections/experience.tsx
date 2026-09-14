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

						<div className="flex flex-col justify-center gap-1">
							{company.notes.map((note) => (
								<p key={note} className="text-text-secondary text-[15px]">
									{note}
								</p>
							))}
						</div>
					</div>
				</Reveal>

				<div aria-hidden="true" className="bg-border h-[0.5px] w-full shrink-0 lg:h-auto lg:w-[0.5px]" />

				<div className="flex min-w-0 flex-1 flex-col">
					{highlights.map((highlight, index) => (
						<Reveal
							key={highlight.year}
							delay={index * 110}
							className={`flex flex-1 flex-col gap-6 px-[var(--page-x)] py-8 min-[1400px]:flex-row min-[1400px]:gap-10 min-[1400px]:px-10 min-[1400px]:py-0 ${
								index > 0 ? "border-border border-t-[0.5px]" : ""
							}`}
						>
							{/* `justify-center`, not top-aligned: the row now owns half a viewport,
							    so both halves centre on the same line instead of hanging off the top.
							    The width tracks the viewport for the same reason the type does — the
							    authored two-line break needs the room once the title grows. */}
							<div className="flex flex-col justify-center gap-2.5 min-[1400px]:w-[clamp(320px,21vw,376px)] min-[1400px]:shrink-0 min-[1400px]:py-10">
								<p className="text-text-secondary text-meta font-mono font-light">{highlight.year}</p>
								<h4 className="text-text-strong sm:text-heading text-[22px] leading-snug font-semibold whitespace-pre-line">
									{highlight.title}
								</h4>
							</div>

							<div aria-hidden="true" className="bg-border hidden w-[0.5px] shrink-0 min-[1400px]:block" />

							<div className="flex min-w-0 flex-1 flex-col justify-center gap-2 min-[1400px]:py-10">
								{highlight.paragraphs.map((paragraph, paragraphIndex) => (
									<p
										key={paragraphIndex}
										className="text-text-secondary text-body indent-[1em] leading-[1.7]"
									>
										{paragraph}
									</p>
								))}
							</div>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
