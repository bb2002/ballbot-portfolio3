import type { HeroContent, OverviewContent } from "../content-types";

/**
 * One viewport, minus the nav bar and scroll cue that close the hero frame —
 * so the hero screen as a whole is exactly as tall as every section below it.
 * `min-h` rather than `h`: below the design height the columns have to grow
 * instead of spilling their content behind the sticky nav. `svh` rather than
 * `dvh` for the same reason the sections use it — a height that holds still
 * while mobile browser chrome collapses.
 */
const HERO_VIEWPORT = "min-h-[calc(100svh-var(--nav-h)-var(--cue-h))]";

/**
 * The same 1512 canvas every screen below is laid out on. Without it the hero's
 * two columns hang off the raw viewport edge, so on a display wider than the
 * canvas its copy starts 44px left of the mono label on every screen under it,
 * and the page opens on a margin it never uses again. Capping here also pins
 * the rule between the columns to the canvas centre — the same x as the centre
 * divider in the Certificates grid.
 */
const CANVAS = "mx-auto flex w-full max-w-[1512px] flex-1 flex-col lg:flex-row";

/**
 * The 4px dot the Overview bullet rows are drawn with, in a 24px column.
 * The cell is exactly one line box tall — 15 × 1.35 and 17 × 1.35, the two
 * steps the row text takes — so that with `items-start` on the row the dot
 * centres on the *first* line. Height it any other way and a row that wraps
 * leaves the dot hanging in the gap between its two lines.
 */
function Bullet() {
	return (
		<span aria-hidden="true" className="flex h-[20px] w-6 shrink-0 items-center justify-center sm:h-[23px]">
			<span className="bg-text-strong h-1 w-1 rounded-full" />
		</span>
	);
}

/** Bullet row: an underlined emphasis fragment followed by lighter detail. */
function HighlightRow({ emphasis, detail }: { emphasis: string | null; detail: string }) {
	return (
		<li className="flex items-start">
			<Bullet />
			{/* `min-w-0`: a flex item's min-width is its min-content width, so without
			    this a long unbroken run (a Japanese line has no spaces to break at)
			    pushes the row past the viewport instead of wrapping inside it. */}
			<span className="text-text-strong min-w-0 text-[15px] leading-[1.35] sm:text-[17px]">
				{emphasis ? (
					<>
						<span className="border-text-strong border-b font-bold">{emphasis}</span>{" "}
					</>
				) : null}
				<span className={emphasis ? "font-light" : "font-normal"}>{detail.trim()}</span>
			</span>
		</li>
	);
}

/** The figure the Overview column is built from. */
function Value({ children }: { children: string }) {
	return <p className="text-text-strong text-[28px] font-semibold sm:text-[32px]">{children}</p>;
}

function Caption({ children }: { children: string }) {
	return <p className="text-text-secondary text-[15px] sm:text-[17px]">{children}</p>;
}

export function Hero({ content, overview }: { content: HeroContent; overview: OverviewContent }) {
	return (
		<section aria-label={content.ariaLabel} className={`flex flex-col ${HERO_VIEWPORT}`}>
			<div className={CANVAS}>
				{/* Intro */}
				<div className="@container flex min-h-[68svh] flex-1 flex-col justify-center gap-2.5 px-[var(--page-x)] py-16 lg:min-h-0 lg:py-2.5">
					<div className="flex flex-col gap-2.5">
						<p
							className="anim-in text-text-secondary font-mono text-[14px] font-light sm:text-[16px]"
							style={{ animationDelay: "60ms" }}
						>
							{content.eyebrow}
						</p>
						<h1
							className="anim-in text-text-primary text-[34px] leading-[1.1875] font-bold tracking-[-0.02em] whitespace-pre-line sm:text-[48px] lg:text-[clamp(40px,11.2cqw,64px)]"
							style={{ animationDelay: "140ms" }}
						>
							{content.headline}
						</h1>
						{/* Held inside the title block, so it inherits the same 10px the eyebrow
						    takes above the headline: this line finishes the headline's sentence
						    rather than answering it, and a wider gap would break the clause in
						    two. Grey on both sides of the black headline also frames it — the
						    mono eyebrow above and this below are the same weight of ink. */}
						{content.subtitle ? (
							<p
								className="anim-in text-text-secondary text-[17px] leading-[1.5] font-medium tracking-[-0.01em] whitespace-pre-line sm:text-[20px] lg:text-subtitle"
								style={{ animationDelay: "200ms" }}
							>
								{content.subtitle}
							</p>
						) : null}
					</div>

					<div className="anim-in flex flex-wrap items-center gap-1" style={{ animationDelay: "260ms" }}>
						<a
							href={content.actions.primary.href}
							className="bg-button-bg text-text-inverse rounded-[4px] px-4 py-3 text-[16px] font-bold transition-[transform,opacity] duration-300 ease-[var(--ease-smooth)] hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0"
						>
							{content.actions.primary.label}
						</a>
						{content.actions.secondary.map((action) => (
							<a
								key={action.label}
								href={action.href}
								target={action.href.startsWith("http") ? "_blank" : undefined}
								rel={action.href.startsWith("http") ? "noreferrer noopener" : undefined}
								className="group text-text-secondary hover:text-text-strong relative px-2 py-3 text-[16px] font-bold transition-colors duration-300 sm:px-4"
							>
								{action.label}
								<span
									aria-hidden="true"
									className="bg-text-strong absolute inset-x-2 bottom-2 h-px origin-left scale-x-0 transition-transform duration-300 ease-[var(--ease-smooth)] group-hover:scale-x-100 sm:inset-x-4"
								/>
							</a>
						))}
					</div>

					{/* The one line on the page written for the other market's reader. It
					    is not a translation of anything around it, so it carries its own
					    `lang` and the browser picks the right face for it. */}
					<p
						lang={content.otherMarket.lang}
						className="anim-in text-text-secondary flex min-h-10 items-end text-[14px]"
						style={{ animationDelay: "360ms" }}
					>
						{/* One flex item, not three: a flex container drops the whitespace
						    between its children, which silently eats the space a language
						    that writes them needs on either side of the link. Inside a
						    single inline run the copy spaces itself and wraps normally. */}
						<span>
							{content.otherMarket.lead}
							<a
								href={content.otherMarket.href}
								className="border-text-secondary hover:border-text-strong hover:text-text-strong border-b font-semibold transition-colors duration-300"
							>
								{content.otherMarket.emphasis}
							</a>
							{content.otherMarket.tail}
						</span>
					</p>
				</div>

				{/* Overview */}
				<div className="border-border flex flex-1 flex-col justify-center gap-14 border-t-[0.5px] px-[var(--page-x)] py-16 lg:border-t-0 lg:border-l-[0.5px] lg:py-2.5">
					<p
						className="anim-in text-text-strong font-mono text-[18px] font-bold tracking-[-0.01em]"
						style={{ animationDelay: "420ms" }}
					>
						{overview.label}
					</p>

					{/* The blocks are whatever the market put in them, in its own order —
					    so the stagger is computed off the index rather than authored. */}
					{overview.blocks.map((block, index) => (
						<div
							key={block.value}
							className={`anim-in flex flex-col ${block.items ? "gap-2.5" : "gap-1"}`}
							style={{ animationDelay: `${500 + index * 80}ms` }}
						>
							{block.caption && block.items ? (
								<div className="flex flex-col gap-1">
									<Value>{block.value}</Value>
									<Caption>{block.caption}</Caption>
								</div>
							) : (
								<>
									<Value>{block.value}</Value>
									{block.caption ? <Caption>{block.caption}</Caption> : null}
								</>
							)}

							{block.items ? (
								<ul className="flex flex-col gap-1">
									{block.items.map((item) => (
										<HighlightRow
											key={`${item.emphasis ?? ""}${item.detail}`}
											emphasis={item.emphasis}
											detail={item.detail}
										/>
									))}
								</ul>
							) : null}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
