import type { GalleryLabels, Media, StoryBlock, StoryList } from "../../content-types";
import { Reveal } from "./reveal";
import { ZoomImage } from "./zoom-image";

/** The reading measure. Prose stops here; a slider or a figure may run the page. */
export const PROSE = "max-w-[760px]";

/**
 * The 4px dot the hero's Overview rows are drawn with, in a 24px column one
 * line box tall, so with `items-start` on the row it centres on the *first*
 * line and a row that wraps does not leave it hanging between two. The
 * default heights are the highlight rows' — 15 × 1.5 and 17 × 1.5, the two
 * steps that text takes; a list set at another leading passes its own.
 */
export function Bullet({ className = "h-[22px] sm:h-[25px]" }: { className?: string }) {
	return (
		<span aria-hidden="true" className={`flex w-6 shrink-0 items-center justify-center ${className}`}>
			<span className="bg-text-strong h-1 w-1 rounded-full" />
		</span>
	);
}

export function Paragraphs({ text, className = PROSE }: { text: readonly string[]; className?: string }) {
	return (
		<div className={`flex flex-col gap-4 ${className}`}>
			{text.map((paragraph, index) => (
				<p key={index} className="text-text-secondary text-body leading-[1.8]">
					{paragraph}
				</p>
			))}
		</div>
	);
}

/** A bulleted run in the body. Set at the body's own size and colour: it is prose, in rows. */
function List({ items, className }: { items: readonly string[]; className: string }) {
	return (
		<ul className={`flex flex-col gap-2 ${className}`}>
			{items.map((item) => (
				<li key={item} className="flex items-start">
					<Bullet className="h-[22px] sm:h-6" />
					<span className="text-text-secondary text-body min-w-0 leading-[1.6]">{item}</span>
				</li>
			))}
		</ul>
	);
}

/**
 * A figure in the run of a body. It runs the width of the page rather than
 * the prose, because a diagram at a reading measure is a diagram nobody can
 * read. Under `lg` the same picture would be narrower still, so there it
 * keeps a floor of its own and the reader slides across it — the viewer
 * behind the click is the other way to read it close.
 */
export function Figure({ media, title, labels }: { media: Media; title: string; labels?: GalleryLabels }) {
	return (
		<figure className="flex flex-col gap-3">
			<div className="-mx-[var(--page-x)] overflow-x-auto px-[var(--page-x)]">
				<div className="min-w-[880px] lg:min-w-0">
					<ZoomImage media={media} title={title} labels={labels} sizes="(max-width: 1024px) 880px, 1320px" />
				</div>
			</div>
			{media.caption ? (
				<figcaption className="text-text-secondary font-mono text-[13px]">{media.caption}</figcaption>
			) : null}
		</figure>
	);
}

type Run = string[] | Media | StoryList;
type Part = { heading?: string; runs: Run[] };

/**
 * Consecutive paragraphs share one block so their spacing matches the prose
 * everywhere else on the page; a figure or a list stands on its own. A
 * sub-head opens a part that collects everything up to the next one, so the
 * page can set the parts further apart than the blocks inside them.
 */
function partition(body: readonly StoryBlock[]): Part[] {
	const parts: Part[] = [{ runs: [] }];
	for (const block of body) {
		const part = parts[parts.length - 1];
		const last = part.runs[part.runs.length - 1];
		if (typeof block === "string") {
			if (Array.isArray(last)) last.push(block);
			else part.runs.push([block]);
		} else if ("heading" in block) {
			parts.push({ heading: block.heading, runs: [] });
		} else {
			part.runs.push(block);
		}
	}
	return parts.filter((part) => part.heading || part.runs.length);
}

type Props = {
	body: readonly StoryBlock[];
	/** What the figures belong to; the viewer names itself after it when a figure has no caption. */
	title: string;
	/** The viewer's controls. Without them a figure goes out as a plain picture that opens nothing. */
	labels?: GalleryLabels;
	/**
	 * The width class prose takes: the measure, and on a page that centres
	 * its column, the margins that centre it. Figures ignore it and run the page.
	 */
	prose?: string;
	/** The element a sub-head renders as — one step under whatever heads the body. */
	headingAs?: "h2" | "h3" | "h4";
};

/**
 * The body of a story — an essay on a project's page, the whole of an
 * experience story — laid out block by block: paragraphs at the reading
 * measure, figures across the page, lists in rows, and a sub-head wherever
 * the content file put one. It renders siblings, not a box of its own, so
 * the page's flex gap is what parts the blocks; a part opened by a sub-head
 * is one sibling, its blocks set closer inside it.
 *
 * Every block arrives as it is scrolled to, like the sections on the home page.
 */
export function StoryBody({ body, title, labels, prose = PROSE, headingAs: Heading = "h3" }: Props) {
	const render = (run: Run, key: string) => (
		<Reveal key={key}>
			{Array.isArray(run) ? (
				<Paragraphs text={run} className={prose} />
			) : "items" in run ? (
				<List items={run.items} className={prose} />
			) : (
				<Figure media={run} title={title} labels={labels} />
			)}
		</Reveal>
	);

	return (
		<>
			{partition(body).map((part, at) =>
				part.heading ? (
					<section key={`p${at}`} className="flex flex-col gap-5 sm:gap-6">
						<Reveal>
							<Heading
								className={`text-text-strong text-[20px] leading-[1.3] font-bold tracking-[-0.01em] sm:text-[22px] ${prose}`}
							>
								{part.heading}
							</Heading>
						</Reveal>
						{part.runs.map((run, i) => render(run, `p${at}-${i}`))}
					</section>
				) : (
					part.runs.map((run, i) => render(run, `r${at}-${i}`))
				),
			)}
		</>
	);
}
