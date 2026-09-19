import type { AwardCard, CertificatesContent, CompactCard } from "../../content-types";
import { Emphasised } from "../ui/emphasised";
import { ThumbFrame } from "../ui/image-placeholder";
import { Reveal } from "../ui/reveal";
import { SectionLabel } from "../ui/section-label";
import { page } from "../ui/layout";

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
/**
 * A group of three takes three tracks instead of four, so the row ends on a
 * card rather than a quarter of blank page. It costs the shared x of the
 * centre divider — the only grid on the screen whose verticals fall on thirds
 * — but a rule that lines up with the row below is worth less than a row that
 * does not look half-finished.
 */
const GRID_3 = "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3";
const CELL = "border-border flex min-w-0";
/** A featured card owns half the row: the whole width until there are 4 tracks. */
const WIDE_CELL = `${CELL} sm:col-span-2`;

/**
 * Cells give up 12px to the divider gutter — but never on the side that meets
 * the page gutter, so the outer cards stay flush with the mono label above them
 * while the rules keep running on the bare track edges.
 */
const COMPACT_PAD = ["sm:pr-3", "sm:pl-3 xl:pr-3", "sm:pr-3 xl:pl-3", "sm:pl-3"];
/** Same idea over three tracks: the middle card is the only one padded both sides. */
const COMPACT_PAD_3 = ["sm:pr-3", "sm:pl-3 xl:pr-3", "sm:pr-3 xl:pr-0 xl:pl-3"];
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
				{/* Contest above, prize below, the award itself between them at the
				    display step: a reader scanning the column sees what was won
				    first and can drop into where and from whom on either side. The
				    two flank the title at the same size so neither outranks it. */}
				<div className="flex min-w-0 flex-col gap-1.5">
					{award.event ? <p className="text-text-secondary text-[14px]">{award.event}</p> : null}
					{/* Off the shared `text-title` step (32–42px) and onto a quieter clamp:
					    at 42px the prize shouted down every other line on the screen,
					    and this block sits under Certifications, whose own titles have
					    come up a step. The ratio between the two is now ~1.3 instead of
					    ~1.9, so the award still leads its card without flattening the
					    certification titles below it. Projects keeps `text-title` — its
					    featured cards are the loudest thing on their own screen. */}
					<h3 className="text-text-strong text-[24px] leading-tight font-bold sm:text-[clamp(28px,2.1vw,38px)]">
						{award.title}
					</h3>
					<p className="text-text-secondary text-[14px]">{award.awardName}</p>
				</div>
				{award.description ? (
					<p className="text-text-secondary text-body leading-relaxed font-medium">
						<Emphasised text={award.description} />
					</p>
				) : null}
			</div>
		</article>
	);
}

function CompactAward({ item }: { item: CompactCard }) {
	// Top-aligned: one- and two-line titles must not stagger the row.
	return (
		<article className="group flex min-w-0 flex-1 items-start gap-2.5 py-6">
			{/* A certificate is a document: at 84×112 — the size this held while the
			    row was four-up — the scan was a stamp rather than something you could
			    read anything off. Three tracks leave the room to grow it, so the tile
			    steps with the column instead of holding one size. The narrowest step
			    is `sm`, where two cells share the row and the text beside it has the
			    least to spare; the widest is `xl`, where the row is three-up. The
			    text block gives up its right padding there — the cell already keeps
			    12px between the copy and the divider. 3:4 throughout, the proportion
			    the design drew. */}
			<ThumbFrame
				media={item.image}
				sizes="(max-width: 640px) 32vw, (max-width: 1280px) 16vw, 11vw"
				className="aspect-[3/4] w-[112px] shrink-0 rounded-[4px] sm:w-[100px] lg:w-[124px] xl:w-[144px]"
			/>
			<div className="flex min-w-0 flex-1 flex-col gap-2 px-2.5 py-2 xl:pr-0">
				<p className="text-text-secondary text-meta font-mono">{item.period}</p>
				{/* Title and detail are one unit — the name and the result it earned —
				    so they sit closer to each other than the card's 8px rhythm. At the
				    outer gap the score read as a separate field from the name it
				    belongs to. A card with no detail keeps the old spacing exactly. */}
				<div className="flex min-w-0 flex-col gap-1">
					{/* One ramp step up — `text-card` (18–21px) read as a caption beside a
					    144px scan, on the screen the section is *named* after. `text-subtitle`
					    is the step that holds its own against the award titles under it. */}
					<h3 className="text-text-strong sm:text-subtitle text-[19px] leading-snug font-bold whitespace-pre-line">
						{item.title}
					</h3>
					{item.detail ? <p className="text-text-primary text-[13px] font-medium">{item.detail}</p> : null}
				</div>
				<p className="text-text-secondary text-[13px] font-medium">{item.host}</p>
			</div>
		</article>
	);
}

/**
 * Three tracks put a divider on both inner edges instead of one at the centre.
 *   1 col  — separator above every item but the first
 *   2 cols — centre divider on the right column, separator above row two
 *   3 cols — a divider before the second and third cards, nothing else
 */
const CELL_RULES_3 = [
	"",
	"border-t-[0.5px] sm:border-t-0 sm:border-l-[0.5px]",
	"border-t-[0.5px] xl:border-t-0 xl:border-l-[0.5px]",
];

/**
 * The rule tables above describe one row and are indexed by position in it, so
 * they hold for up to as many items as there are tracks — three in the group of
 * three, four otherwise, which is every group either market ships. A fifth
 * compact card would wrap onto a second row and take the first cell's blank
 * entry with it, leaving that row open at the top; adding one means writing the
 * row-two case rather than lengthening the list.
 */
function CompactGrid({ items }: { items: readonly CompactCard[] }) {
	const three = items.length === 3;
	const grid = three ? GRID_3 : GRID;
	const pads = three ? COMPACT_PAD_3 : COMPACT_PAD;
	const rules = three ? CELL_RULES_3 : CELL_RULES;

	return (
		// `flex-1` all the way to the grid: the slack the group is handed has to
		// reach the tracks, or it stops at this wrapper and pools under it.
		<div className={`${page} flex flex-1 flex-col`}>
			<div className={`${grid} flex-1`}>
				{items.map((item, index) => (
					<div
						key={`${item.title}-${index}`}
						className={`${CELL} ${pads[index % pads.length]} ${rules[index % rules.length]}`}
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
 * Certifications first, because that is what the screen is called and what a
 * reader came here to check; the awards that decorate it follow, and the
 * scholarship closes. Each group opens on its mono label and closes on a rule,
 * so the label of the group below always has a line above it.
 *
 * Rule inventory: one full-bleed 0.5px horizontal under each mono label, one
 * closing the Certifications group, one closing the Awards group — and, when a
 * market fills the compact awards row, one more dividing it from the featured
 * pair — plus one vertical per grid at its inner track edges.
 * The last group has no closing rule of its own: the next screen's top border
 * (theme.css) is it, and a second line 16px above that read as a mistake.
 * Nothing divides a card from an empty slot, no label is boxed in by a pair of
 * rules 70px apart, and every vertical meets a horizontal at both ends.
 *
 * `flex-1` on each group, for the reason Projects carries it: on a display tall
 * enough to hold the whole screen (2560×1440 does), the slack goes into the
 * rows rather than pooling as a 200px blank foot under the last card.
 */
export function Certificates({ content }: { content: CertificatesContent }) {
	return (
		<section id="certificates" data-section aria-labelledby="certifications-label">
			<SectionLabel id="certifications-label">{content.certificationsLabel}</SectionLabel>

			{/* `border-y`: the top rule sits under the label, the bottom one closes the
			    group — and terminates the centre divider so it does not trail off under
			    the next label. */}
			<div className="border-border flex flex-1 flex-col border-y-[0.5px]">
				<CompactGrid items={content.certifications} />
			</div>

			<SectionLabel>{content.awardsLabel}</SectionLabel>

			{/* With the compact row below it, this block needs only a top rule — that
			    row's own top border is the divider between them. Without it, the
			    closing rule has to come from here, or the next label loses the line
			    above it. */}
			<div
				className={`border-border flex flex-1 flex-col ${
					content.sub?.length ? "border-t-[0.5px]" : "border-y-[0.5px]"
				}`}
			>
				<div className={`${page} flex flex-1 flex-col`}>
					<div className={`${GRID} flex-1`}>
						{content.featured.map((award, index) => (
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

			{/* The top rule divides the two featured awards from the ones below them,
			    the bottom one closes the Awards group. */}
			{content.sub?.length ? (
				<div className="border-border flex flex-1 flex-col border-y-[0.5px]">
					<CompactGrid items={content.sub} />
				</div>
			) : null}

			{/* A market where this carries no weight leaves it out of its content
			    file, and the label goes with it — an empty labelled block reads
			    worse than no block. */}
			{content.selections?.items.length ? (
				<>
					<SectionLabel>{content.selections.label}</SectionLabel>

					{/* Same half-row cells as the featured awards, and the same divider
					    between them. A single entry leaves the right half empty and takes
					    no rule with it: a line with nothing on its far side is a loose
					    line, not a divider. */}
					<div className="border-border flex flex-1 flex-col border-t-[0.5px]">
						<div className={`${page} flex flex-1 flex-col`}>
							<div className={`${GRID} flex-1`}>
								{content.selections.items.map((award, index) => (
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
				</>
			) : null}

			<div className="h-4 shrink-0" />
		</section>
	);
}
