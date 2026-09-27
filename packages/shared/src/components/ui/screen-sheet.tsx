import Image from "next/image";

import type { Media } from "../../content-types";

/** The height, in px, a row of the sheet is laid out at before it stretches to the measure. */
const ROW_H = 170;

/** The tile's padding on each side (`p-2`), which the row has to leave room for. */
const PAD = 8;

/**
 * The rest of a gallery at once, for paper. On screen the gallery is a stage
 * the reader pages through (ScreenSlider); a printed sheet cannot be paged, so
 * the print document lays the flow out under the project's head instead — the
 * screens after the one the stage already prints large, in order, each on the
 * surface tile a picture sits on everywhere else, with its caption under it.
 * Only the print document renders it (ProjectStory's `bound`), and there it is
 * `hidden` until print and its images lazy, so /print on a screen fetches
 * none of them; the render script loads them before it prints.
 *
 * A set of mixed shapes is justified: every tile starts at `ROW_H` tall and
 * grows in proportion to its own shape, so each row fills the measure with
 * pictures of one height at their own proportions — a phone capture beside a
 * desktop one reads as the two things they are, as the rail under the stage
 * does. The empty last item takes up whatever a short last row leaves over,
 * so that row keeps about the height it was laid out at instead of stretching
 * to the edge: a little shorter than the full rows above it, which stretch a
 * few percent to meet the measure, a difference the mixed shapes hide. It
 * asks for 15% of the measure, so a last row with less than that to spare
 * pushes it onto a line of its own and stretches to the edge like the rows
 * above it: left short by a few pixels, a nearly full row read as a
 * misalignment rather than as a row that ends early.
 *
 * A set of one shape — every capture the same size, as CosmoNote's are — makes
 * columns as well as rows, and there that difference showed: justified, the
 * short last row's tiles came out narrower than the column above them and
 * started left of it. So such a set is laid on a grid instead. `auto-fill`
 * over the width a tile starts at makes as many columns as a justified row
 * holds, each as wide as a full row stretches its tiles, so the full rows
 * print exactly as they did and a short last row keeps to the columns above
 * it, at their size. `auto-fill` rather than `auto-fit`, which would drop the
 * empty columns and spread a set shorter than one row to the edge; and no
 * empty last item, which a grid would set in a cell of its own.
 */
export function ScreenSheet({ items, className = "" }: { items: readonly Media[]; className?: string }) {
	const tiles = items.map((item) => {
		const ratio = item.width && item.height ? item.width / item.height : 16 / 9;
		return { item, ratio, width: Math.round(ratio * ROW_H) };
	});
	// The width a column starts at when every tile is one shape; 0 for a mixed set.
	const column =
		tiles.length > 0 && tiles.every((tile) => tile.ratio === tiles[0].ratio) ? tiles[0].width + 2 * PAD : 0;
	return (
		<ol
			className={`hidden gap-x-3 gap-y-5 ${column ? "print:grid" : "flex-wrap print:flex"} ${className}`}
			style={column ? { gridTemplateColumns: `repeat(auto-fill, minmax(${column}px, 1fr))` } : undefined}
		>
			{tiles.map(({ item, ratio, width }, at) => (
				<li
					key={item.src ?? at}
					className="flex min-w-0 flex-col gap-2 print:break-inside-avoid"
					style={column ? undefined : { flex: `${ratio} 1 ${width + 2 * PAD}px` }}
				>
					<div className="bg-surface rounded-lg p-2">
						<div className="relative w-full" style={{ aspectRatio: ratio }}>
							{item.src ? (
								<Image
									src={item.src}
									alt={item.alt}
									fill
									// Sized for the tile a row leaves it, with room for the row
									// to stretch — not for the stage's two-thirds of the page.
									sizes={`${Math.round(width * 1.5)}px`}
									className="rounded-[4px] object-contain"
								/>
							) : null}
						</div>
					</div>
					{item.caption ? <p className="text-text-secondary text-[13px] leading-snug">{item.caption}</p> : null}
				</li>
			))}
			{column ? null : <li aria-hidden="true" className="grow-[1000] basis-[15%]" />}
		</ol>
	);
}
