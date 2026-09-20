"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { ProjectLinkGroup } from "../../content-types";

type Props = {
	group: ProjectLinkGroup;
	/** What the menu belongs to, so a reader tabbing a page of links knows. */
	title: string;
};

/**
 * A card's link row when one label covers several addresses.
 *
 * The trigger carries a chevron rather than the arrow a plain link gets: the
 * two sit side by side on the same row, and the reader should be able to tell
 * which one leaves the page before pressing it.
 */
export function LinkMenu({ group, title }: Props) {
	const [open, setOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);

	/* Escape closes and hands focus back; a press anywhere else closes without
	   taking it, so clicking straight from one card's menu to another's works in
	   a single press rather than one to dismiss and one to open. */
	useEffect(() => {
		if (!open) return;

		function onKeyDown(event: KeyboardEvent) {
			if (event.key !== "Escape") return;
			setOpen(false);
			triggerRef.current?.focus();
		}

		function onPointerDown(event: PointerEvent) {
			if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
		}

		document.addEventListener("keydown", onKeyDown);
		document.addEventListener("pointerdown", onPointerDown);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.removeEventListener("pointerdown", onPointerDown);
		};
	}, [open]);

	/** Up and down walk the menu; Home and End jump to its ends. */
	function onMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
		const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
		if (!keys.includes(event.key)) return;

		const items = Array.from(rootRef.current?.querySelectorAll<HTMLAnchorElement>("[role='menuitem']") ?? []);
		if (items.length === 0) return;

		event.preventDefault();
		const at = items.indexOf(document.activeElement as HTMLAnchorElement);
		const next =
			event.key === "Home"
				? 0
				: event.key === "End"
					? items.length - 1
					: (at + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
		items[next]?.focus();
	}

	return (
		<div ref={rootRef} className="relative">
			<button
				ref={triggerRef}
				type="button"
				aria-haspopup="menu"
				aria-expanded={open}
				aria-label={`${group.label} — ${title}`}
				onClick={() => setOpen((was) => !was)}
				onKeyDown={(event) => {
					if (event.key !== "ArrowDown") return;
					event.preventDefault();
					setOpen(true);
					// The menu is not mounted yet on the press that opens it.
					requestAnimationFrame(() =>
						rootRef.current?.querySelector<HTMLAnchorElement>("[role='menuitem']")?.focus(),
					);
				}}
				className="group/link text-text-strong inline-flex items-center gap-1 text-[14px] font-semibold"
			>
				<span className="relative">
					{group.label}
					<span
						aria-hidden="true"
						className="bg-text-strong absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-300 ease-[var(--ease-smooth)] group-hover/link:scale-x-100"
					/>
				</span>
				<ChevronDown
					aria-hidden="true"
					strokeWidth={2}
					className={`h-4 w-4 shrink-0 transition-transform duration-300 ease-[var(--ease-smooth)] ${
						open ? "rotate-180" : ""
					}`}
				/>
			</button>

			{open ? (
				<div
					role="menu"
					aria-label={`${group.label} — ${title}`}
					onKeyDown={onMenuKeyDown}
					// `top-full` with a small offset rather than a portal: the row sits
					// well inside the card, and nothing between here and the page has
					// `overflow: hidden` for the menu to be clipped by.
					className="border-border bg-bg absolute top-full left-0 z-20 mt-2 min-w-[208px] rounded-lg border-[0.5px] py-1.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.25)]"
				>
					{group.items.map((item) => (
						<a
							key={item.href}
							role="menuitem"
							href={item.href}
							target="_blank"
							rel="noreferrer noopener"
							onClick={() => setOpen(false)}
							className="text-text-primary hover:bg-surface block px-3.5 py-2 text-[14px] font-medium whitespace-nowrap transition-colors duration-150"
						>
							{item.label}
						</a>
					))}
				</div>
			) : null}
		</div>
	);
}
