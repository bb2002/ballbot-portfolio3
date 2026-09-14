import {
	certifications,
	featuredAwards,
	scholarship,
	subAwards,
	type AwardCard,
	type CompactCard,
} from "@/data/portfolio";
import { ThumbFrame } from "@/components/ui/image-placeholder";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { page } from "@/components/ui/layout";

/**
 * One set of column tracks draws every line on this screen.
 *
 * Four tracks at `xl`, two at `sm`, one below — with no gap, so a cell's left
 * border falls on a bare track edge and a cell's top border spans a whole
 * track. Column dividers therefore land on the exact quarter and half of the
 * page's content box, and the row separators of two neighbouring cells meet
 * rather than leaving a hole where a gap used to be. Because all four blocks
 * share this grid inside the same `page` container, the divider in one row sits
 * at the same x as the divider in every other row — which is the promise the
 * per-row padding this replaces could not keep.
 */
const GRID = "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4";
const CELL = "border-border flex min-w-0";
/** A featured card owns half the row: the whole width until there are 4 tracks. */
const WIDE_CELL = `${CELL} sm:col-span-2`;

/**
 * Cells give up 12px to the divider gutter — but never on the side that meets
 * the page gutter, so the outer cards stay flush with the mono label above them
 * while the rules keep running on the bare track edges.
 */
const COMPACT_PAD = ["sm:pr-3", "sm:pl-3 xl:pr-3", "sm:pr-3 xl:pl-3", "sm:pl-3"];
const WIDE_PAD = ["xl:pr-3", "xl:pl-3"];

/**
 * The only vertical on the screen is the one at the halfway track edge, so a
 * compact cell carries a rule on exactly two counts: that centre divider, and
 * the row separator that appears once the four wrap onto two lines or four.
 *   1 col  — separator above every item but the first
 *   2 cols — centre divider on the right column, separator above row two
 *   4 cols — centre divider on the third cell, nothing else
 */
const CELL_RULES = [
	"",
	"border-t-[0.5px] sm:border-t-0 sm:border-l-[0.5px] xl:border-l-0",
	"border-t-[0.5px] xl:border-t-0 xl:border-l-[0.5px]",
	"border-t-[0.5px] sm:border-l-[0.5px] xl:border-t-0 xl:border-l-0",
];

function FeaturedAward({ award }: { award: AwardCard }) {
	return (
		// `min-w-0`: the thumbnail is the card's min-content floor, and without
		// this the card spills past its track once the row goes two-up.
		<article className="group flex min-w-0 flex-1 flex-col items-start gap-2.5 py-6 sm:flex-row sm:items-center">
			<ThumbFrame
				media={award.image}
				sizes="(max-width: 640px) 60vw, 16vw"
				className="aspect-[3/4] w-[160px] shrink-0 rounded-lg sm:w-[clamp(120px,26%,170px)]"
			/>
			<div className="flex w-full min-w-0 flex-1 flex-col justify-center gap-3 py-2 sm:px-2.5">
				<p className="text-text-secondary text-meta font-mono">{award.period}</p>
				<h3 className="text-text-strong sm:text-title text-[26px] leading-tight font-bold">{award.title}</h3>
				<p className="text-text-secondary text-[14px]">{award.awardName}</p>
				<p className="text-text-secondary text-body leading-relaxed font-medium">{award.description}</p>
			</div>
		</article>
	);
}

function CompactAward({ item }: { item: CompactCard }) {
	// Top-aligned: one- and two-line titles must not stagger the row.
	return (
		<article className="group flex min-w-0 flex-1 items-start gap-2.5 py-6">
			{/* The four-up row is the tightest column on the site, so this tile holds
			    the design's 84×112 through the first half of the `xl` range and only
			    starts growing once there is width to spare. The text block gives up
			    its right padding there for the same reason — the cell already keeps
			    12px between the copy and the divider. */}
			<ThumbFrame
				media={item.image}
				sizes="(max-width: 1280px) 20vw, 6vw"
				className="h-[112px] w-[84px] shrink-0 rounded-[4px]"
			/>
			<div className="flex min-w-0 flex-1 flex-col gap-2 px-2.5 py-2 xl:pr-0">
				<p className="text-text-secondary text-meta font-mono">{item.period}</p>
				<h3 className="text-text-strong sm:text-card text-[17px] leading-snug font-bold whitespace-pre-line">
					{item.title}
				</h3>
				<p className="text-text-secondary text-[13px] font-medium">{item.host}</p>
			</div>
		</article>
	);
}

function CompactGrid({ items }: { items: CompactCard[] }) {
	return (
		<div className={page}>
			<div className={GRID}>
				{items.map((item, index) => (
					<div
						key={`${item.title}-${index}`}
						className={`${CELL} ${COMPACT_PAD[index % COMPACT_PAD.length]} ${
							CELL_RULES[index % CELL_RULES.length]
						}`}
					>
						<Reveal delay={index * 70} className="flex min-w-0 flex-1">
							<CompactAward item={item} />
						</Reveal>
					</div>
				))}
			</div>
		</div>
	);
}

/**
 * Rule inventory for the whole screen: five full-bleed 0.5px horizontals — one
 * under each of the three mono labels, one between the featured awards and the
 * four beneath them, and one closing the Awards group — plus one vertical per
 * grid at the halfway track, all of them on the same x. The section has no
 * closing rule of its own: the next screen's top border (globals.css) is it,
 * and a second line 16px above that read as a mistake.
 * Nothing divides a card from an empty slot, no label is boxed in by a pair of
 * rules 70px apart, and every vertical meets a horizontal at both ends.
 */
export function Certificates() {
	return (
		<section id="certificates" data-section aria-labelledby="awards-label">
			<SectionLabel id="awards-label">Awards</SectionLabel>

			<div className="border-border border-t-[0.5px]">
				<div className={page}>
					<div className={GRID}>
						{featuredAwards.map((award, index) => (
							<div
								key={award.title}
								className={`${WIDE_CELL} ${WIDE_PAD[index % WIDE_PAD.length]} ${
									index > 0 ? "border-t-[0.5px] xl:border-t-0 xl:border-l-[0.5px]" : ""
								}`}
							>
								<Reveal delay={index * 100} className="flex min-w-0 flex-1">
									<FeaturedAward award={award} />
								</Reveal>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* `border-y`: the top rule divides the two featured awards from the four
			    below them, the bottom one closes the Awards group — and terminates the
			    centre divider so it does not trail off under the next label. */}
			<div className="border-border border-y-[0.5px]">
				<CompactGrid items={subAwards} />
			</div>

			<SectionLabel>Scholarship</SectionLabel>

			{/* The design leaves the right half of this row empty. No divider goes
			    there: a rule with nothing on its far side is just a loose line. */}
			<div className="border-border border-t-[0.5px]">
				<div className={page}>
					<div className={GRID}>
						<div className={WIDE_CELL}>
							<Reveal className="flex min-w-0 flex-1">
								<FeaturedAward award={scholarship} />
							</Reveal>
						</div>
					</div>
				</div>
			</div>

			<SectionLabel>Certifications</SectionLabel>

			<div className="border-border border-t-[0.5px]">
				<CompactGrid items={certifications} />
			</div>

			<div className="h-4 shrink-0" />
		</section>
	);
}
