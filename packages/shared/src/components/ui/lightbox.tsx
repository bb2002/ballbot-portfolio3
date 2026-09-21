"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

import type { GalleryLabels, Media } from "../../content-types";

type Props = {
	items: readonly Media[];
	/** The slide the viewer opens on, and the one it pages from. */
	index: number;
	/** What the gallery belongs to — the dialog's accessible name is built off it. */
	title: string;
	labels: GalleryLabels;
	onIndexChange: (index: number) => void;
	onClose: () => void;
};

/** Horizontal travel, in px, that counts as a swipe rather than a tap. */
const SWIPE_PX = 48;

/**
 * What share of the viewport an image actually covers, which is what `sizes`
 * has to describe or the optimizer ships the wrong file.
 *
 * Only a wide capture is held by the stage's width. Anything squarer is held
 * by its *height*, and the narrower the shape the less width it ends up
 * taking: a 9:20 phone screen lands near a fifth of a desktop viewport, where
 * asking for 88vw fetches a file four times wider than the box it goes in.
 * `sizes` cannot read viewport height, so each band is written for the taller
 * screen in its range and rounded up — over-fetching a step costs bytes,
 * under-fetching is visibly soft.
 */
function sizesFor(media: Media, withPanel: boolean) {
	const ratio = media.width && media.height ? media.width / media.height : 16 / 9;

	/* Phone captures, stood on end. Held by height either way, so the panel —
	   which only takes width, and only from `lg` — barely moves them. */
	if (ratio < 1) return "(max-width: 640px) 75vw, (max-width: 1024px) 50vw, 30vw";

	/* Photographs and 4:3 screens: wide, but not wide enough to reach the edges. */
	if (ratio < 1.7) {
		return withPanel
			? "(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 48vw"
			: "(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 65vw";
	}

	/* Desktop screenshots, which do reach them. */
	return withPanel
		? "(max-width: 640px) 92vw, (max-width: 1024px) 80vw, 62vw"
		: "(max-width: 640px) 92vw, (max-width: 1024px) 80vw, 88vw";
}

/**
 * The image viewer behind a project card's thumbnail.
 *
 * It is a modal dialog rendered into `document.body`: the card it opens from
 * sits inside a `transform`-animated reveal, and a fixed element inside a
 * transformed ancestor is positioned against *that* ancestor rather than the
 * viewport — so anything rendered in place would be pinned to the card instead
 * of covering the page.
 *
 * Every slide is mounted on one track that translates by whole viewport widths,
 * which is what makes paging read as a slide rather than a swap. Only the
 * current image and its two neighbours are fetched eagerly; the rest stay lazy
 * until they come round.
 */
export function Lightbox({ items, index, title, labels, onIndexChange, onClose }: Props) {
	const dialogRef = useRef<HTMLDivElement>(null);
	const railRef = useRef<HTMLDivElement>(null);
	const swipeFrom = useRef<number | null>(null);
	/** Set by a swipe, read by the click that follows it. */
	const swiped = useRef(false);
	const headingId = useId();

	const count = items.length;
	const current = items[index];

	/* A note anywhere turns the panel on for the set — a caption alone never
	   does, so a gallery of bare screens shows no text at all. Within a set that
	   has notes, a slide with nothing of its own to say gives the column back
	   (see the figure below): the image growing on that slide is the lesser
	   evil next to an empty column pushing it off centre. */
	const withPanel = items.some((item) => Boolean(item.note));

	/* A certificate has one page. Paging controls for a set of one are chrome
	   pointing at nothing — no counter, no arrows, no rail of a single tile. */
	const single = count === 1;

	// Paging wraps: at the last screen "next" comes back to the first. A gallery
	// is a loop of one product's flow, not a list with a dead end at each side.
	const go = useCallback(
		(step: number) => onIndexChange((index + step + count) % count),
		[count, index, onIndexChange],
	);

	/* Keyboard: the arrows page, Escape closes, Home/End jump to the ends.
	   Bound to the document rather than the dialog so it works whichever
	   control inside happens to hold focus. */
	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			switch (event.key) {
				case "Escape":
					onClose();
					break;
				case "ArrowRight":
					event.preventDefault();
					go(1);
					break;
				case "ArrowLeft":
					event.preventDefault();
					go(-1);
					break;
				case "Home":
					event.preventDefault();
					onIndexChange(0);
					break;
				case "End":
					event.preventDefault();
					onIndexChange(count - 1);
					break;
			}
		}

		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [count, go, onClose, onIndexChange]);

	/* Hold the page still underneath, and give back the width the scrollbar was
	   taking so the layout behind does not shift a pixel as it locks. */
	useEffect(() => {
		const { body, documentElement } = document;
		const gutter = window.innerWidth - documentElement.clientWidth;
		const overflow = body.style.overflow;
		const padding = body.style.paddingRight;

		body.style.overflow = "hidden";
		if (gutter > 0) body.style.paddingRight = `${gutter}px`;

		return () => {
			body.style.overflow = overflow;
			body.style.paddingRight = padding;
		};
	}, []);

	/* Focus goes into the dialog on open and back to the thumbnail on close, and
	   Tab is kept inside it in between — a dialog whose focus escapes leaves a
	   keyboard reader tabbing a page they cannot see. */
	useEffect(() => {
		const opener = document.activeElement as HTMLElement | null;
		dialogRef.current?.focus();

		function onKeyDown(event: KeyboardEvent) {
			if (event.key !== "Tab") return;

			const root = dialogRef.current;
			if (!root) return;

			const focusable = root.querySelectorAll<HTMLElement>("button:not([disabled])");
			if (focusable.length === 0) return;

			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			const active = document.activeElement;

			if (event.shiftKey && (active === first || active === root)) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && active === last) {
				event.preventDefault();
				first.focus();
			}
		}

		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
			opener?.focus?.();
		};
	}, []);

	/* Keep the active thumbnail in the rail, which is narrower than the strip on
	   a phone. `nearest` rather than `center` — it only scrolls when it has to. */
	useEffect(() => {
		railRef.current?.children[index]?.scrollIntoView({
			block: "nearest",
			inline: "nearest",
		});
	}, [index]);

	/* A recording keeps playing off-screen once paged away from, its sound
	   with it. Paging pauses every video but the current slide's; closing
	   unmounts them all, which is its own stop. */
	useEffect(() => {
		dialogRef.current?.querySelectorAll("video").forEach((video, slide) => {
			if (slide !== index) video.pause();
		});
	}, [index]);

	// The viewer is only ever mounted by a click, so `document` is always there
	// by the time it renders and the portal needs no round trip through state to
	// wait for one. The guard is for a caller that renders it some other way.
	if (typeof document === "undefined" || !current) return null;

	return createPortal(
		<div
			ref={dialogRef}
			role="dialog"
			aria-modal="true"
			aria-labelledby={headingId}
			tabIndex={-1}
			// The backdrop is the dialog: a click anywhere that is not a control or
			// the image itself closes it, which is what a reader expects of a
			// full-screen viewer. Children that must survive the click stop it.
			onClick={() => {
				// A swipe ends in a click on whatever it started on, so without this
				// the gesture that pages the gallery also closes it.
				if (swiped.current) {
					swiped.current = false;
					return;
				}
				onClose();
			}}
			onPointerDown={(event) => {
				swipeFrom.current = event.clientX;
				swiped.current = false;
			}}
			onPointerUp={(event) => {
				const from = swipeFrom.current;
				swipeFrom.current = null;
				if (from === null) return;

				const travel = event.clientX - from;
				if (Math.abs(travel) < SWIPE_PX) return;

				swiped.current = true;
				go(travel < 0 ? 1 : -1);
			}}
			className="animate-lightbox-in fixed inset-0 z-50 flex flex-col bg-[#0d0d0d]/95 backdrop-blur-md outline-none"
		>
			{/* Head: what is being looked at, where in the set, and the way out. */}
			<div className="flex shrink-0 items-center gap-4 px-[var(--page-x)] pt-5 pb-4 sm:pt-7">
				<h2 id={headingId} className="text-text-inverse min-w-0 truncate text-[15px] font-bold">
					{title}
				</h2>

				{single ? null : (
					<p aria-hidden="true" className="ml-auto shrink-0 font-mono text-[13px] text-white/55 tabular-nums">
						{String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
					</p>
				)}

				<button
					type="button"
					onClick={onClose}
					aria-label={labels.close}
					className="text-text-inverse -mr-2 ml-auto shrink-0 rounded-full p-2 transition-colors duration-200 hover:bg-white/12"
				>
					<X aria-hidden="true" strokeWidth={1.75} className="h-5 w-5" />
				</button>
			</div>

			{/* Stage. The arrows are columns of the row rather than tiles floating on
			    top of it: the page gutter is 40px at `sm` and a 44px control pinned
			    inside it sat *on* the screen it pages. As flex items they take their
			    own width out of the track's, so the image is never underneath one at
			    any viewport. */}
			<div className="flex min-h-0 flex-1 items-center gap-2 px-4 sm:gap-4 sm:px-5">
				{single ? null : (
					<Arrow side="left" label={labels.previous} onClick={() => go(-1)} className="hidden shrink-0 sm:flex" />
				)}

				{/* `self-stretch` is what gives the track a height to measure against.
				    The row centres its items, so without it this box is sized by its
				    own content — and the slides inside ask for `h-full` of it, which
				    resolves back to that content. A portrait capture then grew the
				    track past the viewport instead of being held by it. */}
				<div className="min-h-0 w-full min-w-0 flex-1 self-stretch overflow-hidden">
					<div
						className="flex h-full transition-transform duration-[450ms] ease-[var(--ease-smooth)] motion-reduce:transition-none"
						style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
					>
						{items.map((item, slide) => {
							/* The column is only laid out when there is text to put in it. An
							   empty one still took its width, and the picture sat left of centre
							   on every slide that had nothing to say. */
							const panel = withPanel && Boolean(item.caption || item.note);

							return (
							<figure
								key={item.src ?? slide}
								// `inert` on everything but the current slide: the off-screen
								// images are still in the document, and without it a screen
								// reader walks all nine of them as one run of pictures.
								inert={slide !== index}
								className={`flex h-full w-full shrink-0 flex-col items-center justify-center ${
									// `lg:items-stretch` is what gives the image box a height in the
									// row layout. Centred, its height is its own content's — and its
									// only child is the `fill` image, absolutely positioned, which
									// contributes none. The panel opts back out with `self-center`.
									panel ? "gap-4 lg:flex-row lg:items-stretch lg:gap-8" : ""
								}`}
							>
								{/* The image gets a box of its own rather than sizing against the
								    figure: `max-h-full` there measures the whole column, caption
								    included, so a portrait capture — held by height, not width —
								    took all of it and pushed its own caption off the bottom of the
								    screen. `flex-1 min-h-0` hands it exactly what is left once the
								    caption and the gap have been paid for. */}
								<div className="relative flex min-h-0 w-full min-w-0 flex-1 items-center justify-center">
									{item.video ? (
										/* The browser's own controls, on a player fitted to the stage
										   the way a picture is. Pointer events stop here as well as
										   clicks: a drag along the timeline is scrubbing, and read by
										   the dialog it was a swipe that paged the gallery. Only the
										   neighbours fetch their metadata ahead; the rest wait to be
										   paged to, since a recording is the heaviest thing in the set. */
										<video
											src={item.video}
											poster={item.src}
											controls
											playsInline
											preload={Math.abs(slide - index) <= 1 ? "metadata" : "none"}
											aria-label={item.alt}
											onClick={(event) => event.stopPropagation()}
											onPointerDown={(event) => event.stopPropagation()}
											onPointerUp={(event) => event.stopPropagation()}
											className="max-h-full max-w-full drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
										/>
									) : item.src ? (
										<Image
											src={item.src}
											alt={item.alt}
											fill
											sizes={sizesFor(item, panel)}
											// Neighbours load ahead so paging does not wait on a
											// fetch; the rest stay lazy, which on a ten-screen
											// gallery is most of the weight left on the shelf.
											loading={Math.abs(slide - index) <= 1 ? "eager" : "lazy"}
											// The click that opens a slide must not also close the
											// dialog, and neither must the one that lands on it.
											onClick={(event) => event.stopPropagation()}
											// `fill` + `object-contain`: the box is the whole stage and the
											// picture is fitted inside it. Sized to its own pixels instead,
											// every image was capped at whatever it happened to be saved at —
											// a 1024px store graphic sat in the middle of a 1280px stage with
											// air all round it. `drop-shadow` rather than `shadow`, because a
											// filter follows the fitted picture's own edge while a box-shadow
											// would outline the letterbox around it.
											className="object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
										/>
									) : null}
								</div>

								{/* The panel is the only text the stage carries. With no note
								    anywhere in the set the image goes out on its own, no caption
								    line under it; `caption` still names the slide on the rail and
								    to a screen reader either way. Beside the image where there is
								    room, under it where there is not — `self-center` rather than
								    stretching, or a two-line note pinned to the top of a 685px
								    column would read as a caption that had floated away from its
								    picture. */}
								{panel ? (
									<figcaption className="w-full shrink-0 text-center lg:w-[clamp(260px,28%,380px)] lg:self-center lg:text-left">
										{item.caption ? <p className="text-text-inverse text-[17px] font-bold">{item.caption}</p> : null}
										{item.note ? (
											<p className="mt-3 text-[15px] leading-[1.7] whitespace-pre-line text-white/70">{item.note}</p>
										) : null}
									</figcaption>
								) : null}
							</figure>
							);
						})}
					</div>
				</div>

				{single ? null : (
					<Arrow side="right" label={labels.next} onClick={() => go(1)} className="hidden shrink-0 sm:flex" />
				)}
			</div>

			{/* On a phone there is no margin beside the image to hold the arrows —
			    a 2:1 desktop capture fills the width — and pinned to its edges they
			    would cover the screen they page. Below the stage there is nothing but
			    the letterbox the capture's proportions leave behind, so they go
			    there, in thumb's reach, and the sides stay clear. */}
			<div className={`shrink-0 items-center justify-center gap-5 pt-2 sm:hidden ${single ? "hidden" : "flex"}`}>
				<Arrow side="left" label={labels.previous} onClick={() => go(-1)} className="flex" />
				<Arrow side="right" label={labels.next} onClick={() => go(1)} className="flex" />
			</div>

			{/* The rail. Nine screens is more than a counter can orient anyone in,
			    so the whole flow stays visible and any step is one click away. */}
			{single ? (
				<div className="h-5 shrink-0 sm:h-7" />
			) : (
				<div
					onClick={(event) => event.stopPropagation()}
					// A sideways drag here is the rail being scrolled, not the stage
					// being swiped — the dialog's swipe handler must not see it.
					onPointerDown={(event) => event.stopPropagation()}
					onPointerUp={(event) => event.stopPropagation()}
					className="shrink-0 overflow-x-auto pt-4 pb-5 sm:pb-7"
				>
					{/* `mx-auto` on a shrink-wrapped track, not `justify-center` on the
				    scroller: a centred flex container whose content overflows pushes
				    the first item past its own left edge, where no amount of
				    scrolling reaches it. Auto margins on an overflowing block
				    resolve to zero instead, so the rail centres while it fits and
				    starts flush once it does not. */}
					<div
						ref={railRef}
						role="group"
						aria-label={labels.pick}
						className="mx-auto flex w-max gap-2 px-[var(--page-x)]"
					>
						{items.map((item, slide) => (
							<button
								key={item.src ?? slide}
								type="button"
								onClick={() => onIndexChange(slide)}
								aria-label={item.caption ?? item.alt}
								aria-current={slide === index}
								// One height, each its own width: a rail of fixed 25:17 tiles turns
								// a 9:20 phone capture into a strip of its status bar. Matching each
								// image's own shape also makes the rail say at a glance which
								// screens are a phone and which are a desktop.
								style={{
									aspectRatio: item.width && item.height ? `${item.width} / ${item.height}` : "25 / 17",
								}}
								className={`relative h-11 shrink-0 overflow-hidden rounded-[4px] bg-white/10 transition-opacity duration-200 sm:h-14 ${
									slide === index ? "opacity-100 ring-2 ring-white" : "opacity-45 hover:opacity-80"
								}`}
							>
								{item.src ? (
									<Image src={item.src} alt="" fill sizes="80px" className="object-cover object-top" />
								) : null}
								{/* A recording's tile carries the glyph a player does, so the rail
								    says which step plays rather than shows. */}
								{item.video ? (
									<span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
										<Play strokeWidth={0} className="h-3.5 w-3.5 fill-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
									</span>
								) : null}
							</button>
						))}
					</div>
				</div>
			)}
		</div>,
		document.body,
	);
}

/**
 * `className` carries the placement, because the same control sits at the edge
 * of the stage on a wide screen and under it on a phone. Hidden rather than
 * unmounted at each breakpoint: `display: none` takes a button out of the tab
 * order too, so the focus trap never lands on the pair that is not on screen.
 */
function Arrow({
	side,
	label,
	onClick,
	className = "",
}: {
	side: "left" | "right";
	label: string;
	onClick: () => void;
	className?: string;
}) {
	const Icon = side === "left" ? ChevronLeft : ChevronRight;

	return (
		<button
			type="button"
			aria-label={label}
			onClick={(event) => {
				event.stopPropagation();
				onClick();
			}}
			className={`text-text-inverse h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors duration-200 hover:bg-white/22 ${className}`}
		>
			<Icon aria-hidden="true" strokeWidth={1.75} className="h-6 w-6" />
		</button>
	);
}
