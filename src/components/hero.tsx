import { hero, overview } from "@/data/portfolio";

/**
 * One viewport, minus the nav bar and scroll cue that close the hero frame —
 * so the hero screen as a whole is exactly as tall as every section below it.
 * `min-h` rather than `h`: below the design height the columns have to grow
 * instead of spilling their content behind the sticky nav. `svh` rather than
 * `dvh` for the same reason the sections use it — a height that holds still
 * while mobile browser chrome collapses.
 */
const HERO_VIEWPORT = "min-h-[calc(100svh-var(--nav-h)-var(--cue-h))]";

/** A 4px dot in a 24×19 cell, as drawn in the Overview bullet rows. */
function Bullet() {
	return (
		<span aria-hidden="true" className="flex h-[19px] w-6 shrink-0 items-center justify-center">
			<span className="bg-text-strong h-1 w-1 rounded-full" />
		</span>
	);
}

/** Bullet row: an underlined emphasis fragment followed by lighter detail. */
function HighlightRow({ emphasis, detail }: { emphasis: string | null; detail: string }) {
	return (
		<li className="flex items-center">
			<Bullet />
			<span className="text-text-strong text-[15px] leading-[1.2]">
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

export function Hero() {
	return (
		<section aria-label="소개" className={`flex flex-col ${HERO_VIEWPORT} lg:flex-row`}>
			{/* Intro */}
			<div className="@container flex min-h-[68svh] flex-1 flex-col justify-center gap-2.5 px-[var(--page-x)] py-16 lg:min-h-0 lg:py-2.5">
				<div className="flex flex-col gap-2.5">
					<p
						className="anim-in text-text-secondary font-mono text-[14px] font-light sm:text-[16px]"
						style={{ animationDelay: "60ms" }}
					>
						{hero.eyebrow}
					</p>
					<h1
						className="anim-in text-text-primary text-[34px] leading-[1.1875] font-bold tracking-[-0.02em] whitespace-pre-line sm:text-[48px] lg:text-[clamp(40px,11.2cqw,64px)]"
						style={{ animationDelay: "140ms" }}
					>
						{hero.headline}
					</h1>
				</div>

				<div className="anim-in flex flex-wrap items-center gap-1" style={{ animationDelay: "260ms" }}>
					<a
						href={hero.actions.primary.href}
						className="bg-button-bg text-text-inverse rounded-[4px] px-4 py-3 text-[16px] font-bold transition-[transform,opacity] duration-300 ease-[var(--ease-smooth)] hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0"
					>
						{hero.actions.primary.label}
					</a>
					{hero.actions.secondary.map((action) => (
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

				<p
					lang="ja"
					className="anim-in text-text-secondary flex min-h-10 flex-wrap items-end text-[14px]"
					style={{ animationDelay: "360ms" }}
				>
					<span>{hero.japaneseNotice.lead}</span>
					<a
						href={hero.japaneseNotice.href}
						className="border-text-secondary hover:border-text-strong hover:text-text-strong border-b font-semibold transition-colors duration-300"
					>
						{hero.japaneseNotice.emphasis}
					</a>
					<span>{hero.japaneseNotice.tail}</span>
				</p>
			</div>

			{/* Overview */}
			<div className="border-border flex flex-1 flex-col justify-center gap-14 border-t-[0.5px] px-[var(--page-x)] py-16 lg:border-t-0 lg:border-l-[0.5px] lg:py-2.5">
				<p
					className="anim-in text-text-strong font-mono text-[18px] font-semibold tracking-[-0.01em]"
					style={{ animationDelay: "420ms" }}
				>
					{overview.label}
				</p>

				<div className="anim-in flex flex-col gap-2.5" style={{ animationDelay: "500ms" }}>
					<div className="flex flex-col gap-1">
						<p className="text-text-strong text-[28px] font-semibold sm:text-[32px]">{overview.career.value}</p>
						<p className="text-text-secondary text-[15px]">{overview.career.caption}</p>
					</div>
					<ul className="flex flex-col gap-1">
						{overview.career.highlights.map((item) => (
							<HighlightRow key={item.emphasis} emphasis={item.emphasis} detail={item.detail} />
						))}
					</ul>
				</div>

				<div className="anim-in flex flex-col gap-2.5" style={{ animationDelay: "580ms" }}>
					<p className="text-text-strong text-[28px] font-semibold sm:text-[32px]">{overview.honors.value}</p>
					<ul className="flex flex-col gap-1">
						{overview.honors.items.map((item) => (
							<HighlightRow key={item.detail} emphasis={item.emphasis} detail={item.detail} />
						))}
					</ul>
				</div>

				<div className="anim-in flex flex-col gap-1" style={{ animationDelay: "660ms" }}>
					<p className="text-text-strong text-[28px] font-semibold sm:text-[32px]">{overview.gpa.value}</p>
					<p className="text-text-secondary text-[15px]">{overview.gpa.caption}</p>
				</div>
			</div>
		</section>
	);
}
