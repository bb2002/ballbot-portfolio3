import { page } from "./layout";

type Props = {
	children: string;
	/** Anchor id, when this label also acts as the section heading. */
	id?: string;
	/** Matches the per-section stroke weights used in the design. */
	border?: "none" | "bottom" | "bottom-hairline" | "y";
};

const borderClass: Record<NonNullable<Props["border"]>, string> = {
	none: "",
	bottom: "border-border border-b",
	"bottom-hairline": "border-border border-b-[0.5px]",
	y: "border-border border-y",
};

/**
 * The mono `Projects` / `Archive` / `Journey` … rail label — and, when it
 * carries an `id`, the head of a whole screen.
 *
 * Both kinds are set identically: IBM Plex Mono 600 at 18px, up from a 16px
 * light that read as a caption of the block above rather than the title of the
 * block below. The one thing that separates them is ink — a screen head is
 * black, a sub-group inside it stays grey — so the hierarchy survives even
 * where a sub-label happens to sit near the top of a viewport.
 */
export function SectionLabel({ children, id, border = "none" }: Props) {
	return (
		<div className={borderClass[border]}>
			<div className={`${page} py-6`}>
				<h2
					id={id}
					className={`font-mono text-[18px] font-semibold tracking-[-0.01em] ${
						id ? "text-text-strong" : "text-text-secondary"
					}`}
				>
					{children}
				</h2>
			</div>
		</div>
	);
}
