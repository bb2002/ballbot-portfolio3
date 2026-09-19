import type { ResumeContent } from "../../content-types";
import { ResumeForm } from "../resume-form";
import { Reveal } from "../ui/reveal";
import { SectionLabel } from "../ui/section-label";

/**
 * The closing screen, built like every other screen on the page: a mono label
 * at the top, a full-bleed hairline under it, then the body on the 1512 canvas
 * split by a single 0.5px rule — the invitation on the left, the form that
 * answers it on the right.
 *
 * It used to be built like the hero instead: centred in the viewport, no label,
 * columns hung off the raw viewport edge. That put its copy 44px left of the
 * label on every screen above it at 1600 and read as a different site. The
 * columns now take `px-[var(--page-x)]` inside the capped wrapper, the way
 * Experience does, so the text lands on the page gutter while the rule between
 * them still reaches the full height of the body.
 *
 * `eyebrow` is the label: one "Resume" at the head of the screen, not a second
 * one 400px below the first.
 *
 * The halves are even, so the rule between them lands on the canvas centre —
 * the same x the hero splits on and the same x the Certificates grid divides
 * at. The page opens and closes on the same shape.
 *
 * Stacked below `lg` the rule turns horizontal and the invitation sits above
 * the form it is inviting you into — the same order the eye reads it in
 * side-by-side.
 */
const COLUMN = "flex flex-col justify-center px-[var(--page-x)] py-12 lg:py-10";
/** The 564px the .pen gives each column's content inside the 96px gutter. */
const MEASURE = "w-full max-w-[564px]";

export function Resume({ content }: { content: ResumeContent }) {
	return (
		<section id="resume" data-section aria-labelledby="resume-label">
			<SectionLabel id="resume-label" border="bottom-hairline">
				{content.eyebrow}
			</SectionLabel>

			{/* `flex-1`: this is the one block on the screen, so it takes everything
			    the label leaves over and the two columns centre in a full viewport
			    rather than stacking at the top of an empty one. */}
			<div className="mx-auto flex w-full max-w-[1512px] flex-1 flex-col lg:flex-row">
				{/* Invitation */}
				<div className={`${COLUMN} min-w-0 flex-1 gap-10 lg:gap-14`}>
					{/* `text-display`, the step Experience sets its company name at: this
					    is the closing statement, and at the 42px it used to take it left
					    a 1080-tall screen looking like a form someone forgot to fill. */}
					<Reveal className={`${MEASURE} flex flex-col gap-5`}>
						<h3 className="text-text-strong lg:text-display text-[32px] leading-[1.15] font-semibold tracking-[-0.02em] whitespace-pre-line sm:text-[40px]">
							{content.headline}
						</h3>
						<p className="text-text-secondary text-body leading-[1.7]">{content.lead}</p>
					</Reveal>

					<Reveal delay={120} className="flex flex-col gap-1">
						<p className="text-text-secondary text-meta font-mono font-light">{content.direct.label}</p>
						{/* The one address on the page that is always reachable, whatever the
						    form's delivery does — so it is a link, not a line of text. */}
						<a
							href={`mailto:${content.direct.address}`}
							className="group text-text-strong relative self-start text-[16px] font-bold break-all"
						>
							{content.direct.address}
							<span
								aria-hidden="true"
								className="bg-text-strong absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-300 ease-[var(--ease-smooth)] group-hover:scale-x-100"
							/>
						</a>
					</Reveal>
				</div>

				<div aria-hidden="true" className="bg-border h-[0.5px] w-full shrink-0 lg:h-auto lg:w-[0.5px]" />

				{/* Form */}
				<div className={`${COLUMN} min-w-0 flex-1`}>
					<Reveal delay={200} className={MEASURE}>
						<ResumeForm content={content} />
					</Reveal>
				</div>
			</div>
		</section>
	);
}
