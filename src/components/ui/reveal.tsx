"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * One shared IntersectionObserver drives every scroll reveal on the page,
 * so a long list of cards costs a single observer rather than dozens.
 */
let observer: IntersectionObserver | null = null;

function getObserver() {
	if (typeof IntersectionObserver === "undefined") return null;
	observer ??= new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				entry.target.setAttribute("data-reveal", "shown");
				observer?.unobserve(entry.target);
			}
		},
		// A 24px inset, not a viewport percentage: the screens are exactly one
		// viewport tall, so a row sitting in the last 8% of a screen that has been
		// jumped to would never intersect and stay invisible until the reader
		// scrolled past it.
		{ rootMargin: "0px 0px -24px 0px", threshold: 0.08 },
	);
	return observer;
}

type Props = {
	children: ReactNode;
	/** Stagger, in milliseconds. */
	delay?: number;
	className?: string;
};

export function Reveal({ children, delay = 0, className = "" }: Props) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Proof of life for the head script's watchdog: React is running, so the
		// `html.js` hiding rules are safe to keep.
		document.documentElement.classList.add("hydrated");

		const el = ref.current;
		if (!el) return;

		const io = getObserver();
		if (!io) {
			// No IntersectionObserver (very old browser): show immediately.
			el.setAttribute("data-reveal", "shown");
			return;
		}

		// Already in view on mount — reveal without waiting for a scroll.
		const rect = el.getBoundingClientRect();
		if (rect.top < window.innerHeight && rect.bottom > 0) {
			el.setAttribute("data-reveal", "shown");
			return;
		}

		io.observe(el);
		return () => io.unobserve(el);
	}, []);

	return (
		<div
			ref={ref}
			data-reveal=""
			style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
			className={className}
		>
			{children}
		</div>
	);
}
