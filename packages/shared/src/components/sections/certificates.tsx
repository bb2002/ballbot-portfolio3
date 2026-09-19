import type { CertificateCard, CertificatesContent } from "../../content-types";
import { Emphasised } from "../ui/emphasised";
import { ThumbFrame } from "../ui/image-placeholder";
import { Reveal } from "../ui/reveal";
import { SectionLabel } from "../ui/section-label";
import { page } from "../ui/layout";

/**
 * One grid draws every line on this screen: three tracks at `xl`, two at `sm`,
 * one below — with no gap, so a cell's left border falls on a bare track edge
 * and the row separators of neighbouring cells meet instead of leaving a hole
 * where a gap would be. Six cards fill it exactly: two rows of three, three of
 * two, or one column.
 */
const GRID = "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3";

/**
 * Where a cell's rules go, from its position in the row at each width. A cell
 * draws a rule on two counts only: the divider on its left when it is not the
 * first in its row, and the separator above it when it is not in the first
 * row. Every vertical then meets a horizontal at both ends, and nothing
 * outlines the grid on the page-gutter side.
 */
function cellRules(index: number) {
	return [
		index > 0 ? "border-t-[0.5px]" : "border-t-0",
		index % 2 === 0 ? "sm:border-l-0" : "sm:border-l-[0.5px]",
		index >= 2 ? "sm:border-t-[0.5px]" : "sm:border-t-0",
		index % 3 === 0 ? "xl:border-l-0" : "xl:border-l-[0.5px]",
		index >= 3 ? "xl:border-t-[0.5px]" : "xl:border-t-0",
	].join(" ");
}

/**
 * Cells give 12px to the divider gutter on each side that meets another cell,
 * and none on a side that meets the page gutter, so the outer cards stay flush
 * with the mono label above them while the rules run on the bare track edges.
 */
function cellPads(index: number) {
	const two = index % 2 === 0 ? "sm:pr-3 sm:pl-0" : "sm:pl-3 sm:pr-0";
	const three = ["xl:pr-3 xl:pl-0", "xl:px-3", "xl:pl-3 xl:pr-0"][index % 3];
	return `${two} ${three}`;
}

function Card({ item }: { item: CertificateCard }) {
	// Top-aligned: a card with a description must not stagger the row.
	return (
		<article className="group flex min-w-0 flex-1 items-start gap-2.5 py-6">
			{/* A certificate is a document, so the scan is big enough to read
			    something off. The tile steps with the column: narrowest at `sm`,
			    where two cells share the row, widest at `xl`, where three do.
			    3:4 throughout, the proportion the design drew. */}
			<ThumbFrame
				media={item.image}
				sizes="(max-width: 640px) 32vw, (max-width: 1280px) 16vw, 11vw"
				className="aspect-[3/4] w-[112px] shrink-0 rounded-[4px] sm:w-[100px] lg:w-[124px] xl:w-[144px]"
			/>
			<div className="flex min-w-0 flex-1 flex-col gap-2 px-2.5 py-2 xl:pr-0">
				<p className="text-text-secondary text-meta font-mono">{item.period}</p>
				{/* Contest above, prize name below, the title between them: the two
				    flank it at the same size so neither outranks it, and they sit
				    closer to it than the card's 8px rhythm because the three are one
				    unit — what was won, where, and what it was called. */}
				<div className="flex min-w-0 flex-col gap-1">
					{item.event ? <p className="text-text-secondary text-[13px]">{item.event}</p> : null}
					<h3 className="text-text-strong sm:text-subtitle text-[19px] leading-snug font-bold whitespace-pre-line">
						{item.title}
					</h3>
					{item.detail ? <p className="text-text-primary text-[13px] font-medium">{item.detail}</p> : null}
				</div>
				{item.host ? <p className="text-text-secondary text-[13px] font-medium">{item.host}</p> : null}
				{item.description ? (
					<p className="text-text-secondary text-body leading-relaxed">
						<Emphasised text={item.description} />
					</p>
				) : null}
			</div>
		</article>
	);
}

/**
 * One label, one grid. The rule under the label opens the block; the grid's
 * own separators do the rest; the next screen's top border (theme.css) closes
 * it, so no closing rule is drawn here — a second line 16px above that one
 * read as a mistake.
 *
 * `flex-1` on the block: on a display tall enough to hold the whole screen the
 * slack goes into the rows rather than pooling as a blank foot under them.
 */
export function Certificates({ content }: { content: CertificatesContent }) {
	return (
		<section id="certificates" data-section aria-labelledby="certificates-label">
			<SectionLabel id="certificates-label">{content.label}</SectionLabel>

			<div className="border-border flex flex-1 flex-col border-t-[0.5px]">
				<div className={`${page} flex flex-1 flex-col`}>
					<div className={`${GRID} flex-1`}>
						{content.items.map((item, index) => (
							<div
								key={`${item.title}-${index}`}
								className={`border-border flex min-w-0 ${cellPads(index)} ${cellRules(index)}`}
							>
								<Reveal delay={index * 70} className="flex min-w-0 flex-1">
									<Card item={item} />
								</Reveal>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="h-4 shrink-0" />
		</section>
	);
}
