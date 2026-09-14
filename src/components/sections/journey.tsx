import { journeyChapters, journeyNow } from "@/data/portfolio";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { page } from "@/components/ui/layout";

/**
 * The .pen "Journey v4 (Trunk + Branches)" frame.
 *
 * One black trunk runs the length of the section and carries the places —
 * school, school, university, the job, university again — as a filled mark
 * each. Out of every mark a grey branch peels off to the right and the work
 * that happened there ticks off it: a small dot for the ordinary rows, an
 * open ring and a larger heading for the one or two that mattered. The
 * trunk ends on an open ring, because the last chapter has not closed.
 *
 * All of the rail geometry lives in `globals.css` under `.jy` — the marks
 * are pseudo-elements positioned off the line box they have to meet, so
 * nothing here has to carry a pixel offset.
 */
export function Journey() {
	return (
		<section id="journey" data-section aria-labelledby="journey-label">
			<SectionLabel id="journey-label" border="bottom-hairline">
				Journey
			</SectionLabel>

			<div className={`${page} jy pt-12 pb-16`}>
				{journeyChapters.map((chapter, chapterIndex) => (
					<Reveal
						key={chapter.title}
						className={`jy-chapter${chapterIndex === 0 ? " jy-chapter--first" : ""}`}
					>
						<div aria-hidden="true" className="jy-trunk" />

						<div className="jy-head">
							<span aria-hidden="true" className="jy-arm" />
							<span aria-hidden="true" className="jy-drop" />

							<p className="text-text-secondary font-mono text-[15px] leading-[1.4] font-light">
								{chapter.period}
							</p>
							<h3 className="text-text-strong text-[26px] leading-[1.2] font-semibold lg:text-[32px]">
								{chapter.title}
							</h3>
							{chapter.subtitle ? (
								<p className="text-text-secondary text-[15px] leading-[1.5] whitespace-pre-line">
									{chapter.subtitle}
								</p>
							) : null}
						</div>

						<ol className="jy-right">
							{chapter.events.map((event, eventIndex) => (
								<li
									key={`${event.year}-${event.title}`}
									className="jy-event"
									data-featured={event.featured ? "" : undefined}
									data-stack={event.stack ? "" : undefined}
									data-last={eventIndex === chapter.events.length - 1 ? "" : undefined}
								>
									<span aria-hidden="true" className="jy-rail">
										<span className="jy-mark" />
									</span>

									<div className="jy-body">
										<div className="jy-text">
											<p className="jy-line text-text-secondary font-mono text-[13px] leading-[1.4] font-light">
												<span className="jy-year lg:text-[14px]">{event.year}</span>
												{event.stack ? <span>{event.stack}</span> : null}
											</p>

											<h4
												className={
													event.featured
														? "text-text-strong text-[20px] leading-[1.25] font-semibold lg:text-[24px]"
														: "text-text-strong text-[16px] leading-[1.4] font-semibold"
												}
											>
												{event.title}
											</h4>

											{event.detail ? (
												<p className="text-text-secondary max-w-[600px] text-[15px] leading-[1.6]">
													{event.detail}
												</p>
											) : null}
										</div>
									</div>
								</li>
							))}
						</ol>
					</Reveal>
				))}

				<Reveal className="jy-now">
					<div aria-hidden="true" className="jy-trunk" />

					<div className="jy-head">
						<p className="text-text-secondary font-mono text-[15px] leading-[1.4] font-light">
							{journeyNow.label}
						</p>
					</div>

					<div className="jy-right">
						<p className="text-text-secondary text-[15px] leading-[1.5]">{journeyNow.detail}</p>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
