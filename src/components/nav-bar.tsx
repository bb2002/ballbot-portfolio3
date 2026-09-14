"use client";

import { Award, Building2, FileText, FolderDot, Route, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { NAV_ITEMS, type NavItemId } from "@/data/portfolio";

const ICONS: Record<NavItemId, LucideIcon> = {
	projects: FolderDot,
	experience: Building2,
	certificates: Award,
	journey: Route,
	resume: FileText,
};

/**
 * The design draws this bar at the bottom of the hero and again at the top of
 * every following screen. Here it is rendered once and made sticky, so it
 * travels from the hero's lower edge to the top of the viewport on scroll —
 * which is what those repeated frames describe.
 */
export function NavBar() {
	const [active, setActive] = useState<NavItemId | null>(null);
	const [stuck, setStuck] = useState(false);
	const barRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
			(el): el is HTMLElement => el !== null,
		);
		if (sections.length === 0) return;

		let frame = 0;

		const measure = () => {
			frame = 0;
			// Whichever section straddles the band just below the nav wins.
			const line = window.innerHeight * 0.35;
			let current: NavItemId | null = null;
			for (const section of sections) {
				const { top, bottom } = section.getBoundingClientRect();
				if (top <= line && bottom > line) current = section.id as NavItemId;
			}
			setActive(current);
			// Shadow belongs to the bar, so measure the bar — not the section after it.
			const bar = barRef.current;
			if (bar) setStuck(bar.getBoundingClientRect().top <= 0);
		};

		const schedule = () => {
			if (frame) return;
			frame = requestAnimationFrame(measure);
		};

		measure();
		window.addEventListener("scroll", schedule, { passive: true });
		window.addEventListener("resize", schedule);
		return () => {
			if (frame) cancelAnimationFrame(frame);
			window.removeEventListener("scroll", schedule);
			window.removeEventListener("resize", schedule);
		};
	}, []);

	return (
		<div
			ref={barRef}
			className={`bg-bg border-border sticky top-0 z-50 border-y transition-shadow duration-300 ${
				stuck ? "shadow-[0_1px_12px_rgba(0,0,0,0.05)]" : ""
			}`}
		>
			<nav aria-label="섹션 바로가기" className="flex justify-center">
				<ul className="flex w-full items-center justify-center gap-0 px-1 py-2 sm:w-auto sm:gap-2.5 sm:px-0">
					{NAV_ITEMS.map((item) => {
						const Icon = ICONS[item.id];
						const isActive = active === item.id;
						return (
							<li key={item.id} className="flex min-w-0 flex-1 sm:flex-none">
								<a
									href={`#${item.id}`}
									aria-current={isActive ? "location" : undefined}
									className="group relative flex h-20 w-full min-w-0 flex-col items-center justify-center gap-1 px-0.5 sm:h-24 sm:w-24 sm:gap-0 sm:px-0"
								>
									<Icon
										aria-hidden="true"
										className={`h-5 w-5 transition-[transform,color] duration-300 ease-[var(--ease-smooth)] group-hover:-translate-y-0.5 sm:h-6 sm:w-6 ${
											isActive ? "text-text-strong" : "text-text-primary group-hover:text-text-strong"
										}`}
									/>
									<span
										className={`max-w-full truncate text-[11px] font-semibold tracking-[-0.02em] transition-colors duration-300 sm:text-[12px] sm:tracking-normal ${
											isActive ? "text-text-strong" : "text-text-primary group-hover:text-text-strong"
										}`}
									>
										{item.label}
									</span>
									<span
										aria-hidden="true"
										className={`bg-text-strong absolute inset-x-2 bottom-4 h-px origin-center sm:inset-x-3 sm:bottom-6 transition-transform duration-300 ease-[var(--ease-smooth)] ${
											isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
										}`}
									/>
								</a>
							</li>
						);
					})}
				</ul>
			</nav>
		</div>
	);
}
