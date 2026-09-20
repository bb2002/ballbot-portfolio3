"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * One shared IntersectionObserver drives every scroll reveal on the page,
 * so a long list of cards costs a single observer rather than dozens.
 */
let observer: IntersectionObserver | null = null;

/** Whether the head script's watchdog has been told React booted. */
let marked = false;

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
		// A 24px inset, not a viewport percentage: a percentage deep enough to be
		// worth having also holds back whatever sits in the last band of the
		// viewport a deep link lands on, and that row then stays invisible until
		// the reader scrolls past it.
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
		// `html.js` hiding rules are safe to keep. Once for the document, not once
		// per card — the page mounts several dozen of these.
		if (!marked) {
			marked = true;
			document.documentElement.classList.add("hydrated");
		}

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
