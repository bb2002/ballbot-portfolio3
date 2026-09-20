import type { FooterContent } from "../content-types";
import { page } from "./ui/layout";

/**
 * The page's last line, on every page the market builds.
 *
 * The closing year is the year the page is rendered, which for these static
 * builds is the year they were built: the line goes stale on New Year's Day
 * and comes right again on the next deploy. That is the trade every server
 * -rendered copyright makes, and the alternative — correcting it on the
 * client — costs a hydration pass and a frame of the wrong year to save a
 * character that nobody is reading on 1 January.
 *
 * Mono, because everything else on the site that is a date or a piece of
 * metadata is mono; and `--label-y`, the same measure a section head carries,
 * so the air above the rule and under the line is the page's own rhythm
 * rather than a number picked for the footer alone.
 */
export function Footer({ content }: { content: FooterContent }) {
	return (
		<footer className="border-border border-t-[0.5px]">
			<div className={`${page} py-[var(--label-y)]`}>
				{/* Two atoms with one space between them, and the space is the only
				    place the line may turn. On a phone it does not fit on one line, and
				    left to itself the browser broke it wherever it ran out of room —
				    stranding "reserved." on a line of its own, or splitting the company's
				    name. `text-balance` only moved the damage. This way a narrow screen
				    gets the years on one line and the whole notice on the next.

				    Under 360px even the notice alone is wider than the column, so there
				    the hold is released and it wraps where it must — a nowrap span that
				    does not fit overflows, and `overflow-x: hidden` on the body would
				    clip the end of it rather than scroll to it. */}
				<p className="text-text-secondary text-center font-mono text-[13px] leading-[1.6] font-light">
					<span className="whitespace-nowrap">
						© {content.since} – {new Date().getFullYear()}
					</span>{" "}
					<span className="min-[360px]:whitespace-nowrap">{content.notice}</span>
				</p>
			</div>
		</footer>
	);
}
