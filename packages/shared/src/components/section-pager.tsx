"use client";

import { useEffect } from "react";

/**
 * One jump, not fullpage paging: while the hero is on show, a downward wheel
 * notch or key on a fine pointer is swallowed and replaced with a rAF glide to
 * the first screen below it. Everywhere else the scroller is native — paging
 * inside a section taller than the viewport yanked readers past the part they
 * were trying to reach.
 *
 * Touch devices are never intercepted: hijacking touch scrolling breaks
 * momentum and pull-to-refresh, and the hero overflows a phone viewport
 * anyway, so there is no single screen to jump off.
 *
 * In-page anchors run through the same animator on every device, so a nav
 * click and the hero jump land identically.
 */

/** Desktop only: coarse pointers keep native scrolling. */
const DESKTOP = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
const DURATION = 700;
/** Wheel events closer together than this belong to one gesture (trackpad inertia fires every frame). */
const GESTURE_GAP = 120;
/** Longest the inertial tail is swallowed after a landing, so a held mouse wheel is never locked out. */
const SWALLOW_MAX = 1500;
/** A resting finger produces 1-3px deltas; those must not launch the jump. */
const MIN_DELTA = 8;
const EPS = 2;

/** Keys these own outright: typing, activating a control, moving a caret. */
const TYPING = "input, textarea, select, button, [role='button'], [contenteditable]";

/** Expo-out — the JS twin of the `--ease-smooth` cubic-bezier(0.16, 1, 0.3, 1). */
function easeOut(t: number) {
	return t === 1 ? 1 : 1 - 2 ** (-10 * t);
}

export function SectionPager() {
	useEffect(() => {
		const root = document.documentElement;
		const desktop = window.matchMedia(DESKTOP);
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

		let frame = 0;
		let animating = false;
		let swallowUntil = 0;
		let lastWheelAt = 0;

		const navHeight = () => parseFloat(getComputedStyle(root).getPropertyValue("--nav-h")) || 0;
		const sections = () => Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));

		/** Where the scroller must sit for `el` to be the screen on show. */
		const snapOf = (el: HTMLElement, nav: number) =>
			Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - nav));

		/** The screen below the hero — but only while the hero is still on show. */
		const landing = () => {
			const next = sections()[1];
			if (!next) return null;
			return window.scrollY < snapOf(next, navHeight()) - EPS ? next : null;
		};

		/** A modal, code block or any overflowing widget keeps its own wheel. */
		const scrollableUnder = (node: EventTarget | null, dir: number) => {
			let el = node instanceof Element ? node : null;
			while (el && el !== document.body && el !== root) {
				const { overflowY } = getComputedStyle(el);
				if (/auto|scroll|overlay/.test(overflowY) && el.scrollHeight > el.clientHeight) {
					const room =
						dir > 0 ? el.scrollHeight - el.clientHeight - el.scrollTop > 1 : el.scrollTop > 1;
					if (room) return true;
				}
				el = el.parentElement;
			}
			return false;
		};

		const stop = () => {
			if (frame) cancelAnimationFrame(frame);
			frame = 0;
			animating = false;
			delete root.dataset.paging;
		};

		const animateTo = (y: number) => {
			const limit = Math.max(0, root.scrollHeight - window.innerHeight);
			const to = Math.max(0, Math.min(y, limit));
			stop();

			if (reduced.matches) {
				window.scrollTo({ top: to, behavior: "instant" });
				swallowUntil = performance.now() + SWALLOW_MAX;
				return;
			}

			const from = window.scrollY;
			const distance = to - from;
			if (Math.abs(distance) < 1) return;

			const startedAt = performance.now();
			animating = true;
			// Native smooth scrolling stands down while this loop owns the
			// scroller — its timing is browser-defined and would fight a
			// per-frame scrollTo.
			root.dataset.paging = "";

			const step = (now: number) => {
				const t = Math.min(1, (now - startedAt) / DURATION);
				window.scrollTo({ top: from + distance * easeOut(t), behavior: "instant" });
				if (t < 1) {
					frame = requestAnimationFrame(step);
					return;
				}
				stop();
				swallowUntil = performance.now() + SWALLOW_MAX;
			};
			frame = requestAnimationFrame(step);
		};

		/**
		 * `push` is what an intercepted link gets and a gesture does not.
		 *
		 * Neither writes the hash the anchor's own jump would have — that is what
		 * would yank the scroller mid-animation — but a click still has to leave
		 * the history entry the browser would have left, or Back walks the reader
		 * off the site instead of back up the page they were reading. A wheel
		 * notch is not a navigation, so the hero jump only rewrites the entry it
		 * is already on. Going back fires `hashchange`, which lands the reader
		 * through the same animator.
		 */
		const goTo = (el: HTMLElement, { push = false } = {}) => {
			animateTo(snapOf(el, navHeight()));
			const hash = el.id ? `#${el.id}` : "";
			if (location.hash === hash) return;
			const url = hash || location.pathname + location.search;
			if (push) history.pushState(null, "", url);
			else history.replaceState(null, "", url);
		};

		const onWheel = (e: WheelEvent) => {
			// Pinch-zoom and anything already handled stay untouched.
			if (e.ctrlKey || e.defaultPrevented || e.deltaY === 0) return;

			const dir = e.deltaY > 0 ? 1 : -1;
			const now = performance.now();
			const gap = now - lastWheelAt;
			lastWheelAt = now;

			// Eat the inertial tail of the gesture that launched the jump rather
			// than let it carry the scroller past the landing. A pause longer
			// than GESTURE_GAP is a new gesture, and that one is the reader's.
			if (animating || (now < swallowUntil && gap < GESTURE_GAP)) {
				if (!scrollableUnder(e.target, dir)) e.preventDefault();
				return;
			}
			swallowUntil = 0;

			if (dir < 0 || Math.abs(e.deltaY) < MIN_DELTA) return;
			const next = landing();
			if (!next || scrollableUnder(e.target, dir)) return;

			e.preventDefault();
			goTo(next);
		};

		const onKeyDown = (e: KeyboardEvent) => {
			// Escape hands the scroller back, wherever the jump came from.
			if (e.key === "Escape") {
				stop();
				swallowUntil = 0;
				return;
			}
			if (!desktop.matches || e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
			const down = e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey);
			if (!down) return;

			const target = e.target instanceof Element ? e.target : null;
			if (target?.closest(TYPING)) return;

			const next = landing();
			if (!next || scrollableUnder(target, 1)) return;

			e.preventDefault();
			goTo(next);
		};

		const onClick = (e: MouseEvent) => {
			if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

			const link = e.target instanceof Element ? e.target.closest("a[href]") : null;
			if (!(link instanceof HTMLAnchorElement) || link.target === "_blank") return;

			const url = new URL(link.href, location.href);
			const samePage =
				url.origin === location.origin && url.pathname === location.pathname && url.search === location.search;
			if (!samePage || !url.hash) return;

			const target = document.getElementById(url.hash.slice(1));
			if (!target?.hasAttribute("data-section")) return;

			e.preventDefault();
			goTo(target, { push: true });
			// An intercepted anchor still has to move the keyboard's place in the
			// document, which preventDefault would otherwise cost us. The attribute
			// comes off again on blur: a section left permanently focusable is a
			// stop on the tab order that nothing on the page asked for.
			target.setAttribute("tabindex", "-1");
			target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
			target.focus({ preventScroll: true });
		};

		const onHashChange = () => {
			const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
			if (target?.hasAttribute("data-section")) animateTo(snapOf(target, navHeight()));
		};

		// A deep link lands before hydration, so re-settle once the fonts and
		// images have finished shifting the layout under it.
		const settle = requestAnimationFrame(() => {
			const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
			if (target?.hasAttribute("data-section")) {
				window.scrollTo({ top: snapOf(target, navHeight()), behavior: "instant" });
			}
		});

		// passive: false is what lets the handler preventDefault, so it is only
		// ever attached where the jump actually applies.
		const syncWheel = () => {
			window.removeEventListener("wheel", onWheel);
			if (desktop.matches) window.addEventListener("wheel", onWheel, { passive: false });
		};

		syncWheel();
		desktop.addEventListener("change", syncWheel);
		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("hashchange", onHashChange);
		document.addEventListener("click", onClick);

		return () => {
			cancelAnimationFrame(settle);
			stop();
			window.removeEventListener("wheel", onWheel);
			desktop.removeEventListener("change", syncWheel);
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("hashchange", onHashChange);
			document.removeEventListener("click", onClick);
		};
	}, []);

	return null;
}
