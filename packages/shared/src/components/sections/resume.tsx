import type { ResumeContent } from "../../content-types";
import { ResumeForm } from "../resume-form";
import { Reveal } from "../ui/reveal";

/**
 * The closing screen, and the only one built like the hero rather than like a
 * list: two columns split by a single 0.5px rule, each centred in its own
 * half, with no mono section label above them. The .pen draws it that way
 * deliberately — the page opens and closes on the same shape.
 *
 * The columns take `px-[var(--page-x)]` directly instead of the `page`
 * wrapper, for the reason the hero does: the rule between them has to reach
 * the full height of the screen, which a centred max-width container would
 * cut short. The content inside each half is capped at the 564px the .pen
 * gives the form column, so the fields do not stretch into a letterbox on a
 * wide display.
 *
 * Stacked below `lg` the rule turns horizontal and the invitation sits above
 * the form it is inviting you into — the same order the eye reads it in
 * side-by-side.
 */
const COLUMN = "flex flex-1 flex-col justify-center px-[var(--page-x)] py-16 lg:py-2.5";
/** The 564px the .pen gives each column's content inside the 96px gutter. */
const MEASURE = "w-full max-w-[564px]";
/**
 * Stacked, the form takes the whole column instead: a 564px field under a
 * full-width hairline on a 768px tablet leaves a third of the row empty and
 * reads as a mistake. The cap returns with the side-by-side layout, where the
 * column is 564px wide anyway and it only binds on a display wider than the
 * canvas.
 */
const FORM_MEASURE = "w-full lg:max-w-[564px]";

export function Resume({ content }: { content: ResumeContent }) {
	return (
		<section id="resume" data-section className="screen--centered" aria-labelledby="resume-heading">
			<div className="flex flex-1 flex-col lg:flex-row">
				{/* Invitation */}
				<div className={`${COLUMN} gap-12`}>
					<Reveal className={`${MEASURE} flex flex-col gap-6`}>
						<div className="flex flex-col gap-2.5">
							<p className="text-text-secondary font-mono text-[14px] font-light sm:text-[16px]">
								{content.eyebrow}
							</p>
							<h2
								id="resume-heading"
								className="text-text-primary text-[34px] leading-[1.1875] font-bold tracking-[-0.02em] whitespace-pre-line sm:text-[48px]"
							>
								{content.headline}
							</h2>
						</div>
						<p className="text-text-secondary text-[15px] leading-[1.6] sm:text-[16px]">{content.lead}</p>
					</Reveal>

					<Reveal delay={120} className="flex flex-col gap-1">
						<p className="text-text-secondary font-mono text-[14px] font-light">{content.direct.label}</p>
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

				{/* Form */}
				<div className={`border-border ${COLUMN} border-t-[0.5px] lg:border-t-0 lg:border-l-[0.5px]`}>
					<Reveal delay={200} className={FORM_MEASURE}>
						<ResumeForm content={content} />
					</Reveal>
				</div>
			</div>
		</section>
	);
}
