"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { GalleryLabels, Media } from "../../content-types";
import { Lightbox } from "./lightbox";

type Props = {
  items: readonly Media[];
  /** What the screens belong to; the viewer names itself after it. */
  title: string;
  labels: GalleryLabels;
};

/** Horizontal travel, in px, that counts as a swipe rather than a tap. */
const SWIPE_PX = 48;

/**
 * The shape of the stage, from the shapes of the screens in it.
 *
 * The median, so one poster in a set of phone captures does not set the box
 * for all of them; then held between 4:3 and 2.2:1, so a set of portrait
 * screens does not turn the head of the page into a column taller than the
 * text beside it, and a set of wide ones is not cut down to a strip. Every
 * slide is fitted inside, and the surface takes up the slack.
 */
function boxRatio(items: readonly Media[]) {
  const ratios = items
    .map((item) =>
      item.width && item.height ? item.width / item.height : 16 / 9,
    )
    .sort((a, b) => a - b);
  const median = ratios[Math.floor(ratios.length / 2)] ?? 16 / 9;
  return Math.min(2.2, Math.max(4 / 3, median));
}

/**
 * The gallery laid into the page instead of over it: one stage the reader
 * pages through, the caption and count under it, and the rail of every screen
 * under those. The stage is the viewer's own track — every slide on one strip,
 * moved by whole widths — at the size the column allows, and a click on the
 * slide opens the viewer on it for a closer look.
 */
export function ScreenSlider({ items, title, labels }: Props) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const swipeFrom = useRef<number | null>(null);
  /** Set by a swipe, read by the click that follows it. */
  const swiped = useRef(false);

  const count = items.length;
  const ratio = boxRatio(items);

  // Paging wraps, as it does in the viewer: a gallery is a loop of one
  // product's flow, not a list with a dead end at each side.
  const go = (step: number) =>
    setIndex((current) => (current + step + count) % count);

  /* Keep the active thumbnail in the rail, which is narrower than the strip
	   on a phone. The rail's own scroller is moved, sideways only: `scrollIntoView`
	   also scrolls the *page* to bring the rail into the viewport, and on mount
	   that opened the page a screen down, on the rail, instead of at the top. */
  useEffect(() => {
    const rail = railRef.current;
    const tile = rail?.children[index];
    const scroller = rail?.parentElement;
    if (!tile || !scroller) return;

    const box = tile.getBoundingClientRect();
    const view = scroller.getBoundingClientRect();
    const left =
      box.left < view.left
        ? box.left - view.left - 4
        : box.right > view.right
          ? box.right - view.right + 4
          : 0;
    if (left === 0) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    scroller.scrollBy({ left, behavior: reduced ? "auto" : "smooth" });
  }, [index]);

  const current = items[index];
  if (!current) return null;

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div
        className="bg-surface relative w-full overflow-hidden rounded-lg"
        style={{ aspectRatio: ratio }}
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
      >
        <div
          className="flex h-full transition-transform duration-[450ms] ease-[var(--ease-smooth)] motion-reduce:transition-none"
          style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
        >
          {items.map((item, slide) => (
            <button
              key={item.src ?? slide}
              type="button"
              // `inert` on everything but the current slide: the off-screen
              // screens are still in the document, and without it a keyboard
              // reader tabs through nine buttons for one picture.
              inert={slide !== index}
              onClick={() => {
                // A swipe ends in a click on whatever it started on, so
                // without this the gesture that pages the strip also opens
                // the viewer.
                if (swiped.current) {
                  swiped.current = false;
                  return;
                }
                setOpen(slide);
              }}
              aria-label={`${labels.open} — ${item.caption ?? title}`}
              aria-haspopup="dialog"
              className="group/zoom relative h-full w-full shrink-0 cursor-zoom-in"
            >
              {item.src ? (
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 1024px) 92vw, 62vw"
                  // The first screen is the page's largest paint, so it is
                  // announced from <head> (`preload`) instead of being found
                  // when the parser reaches it — and it carries no `loading`
                  // at all: next/image throws when `preload` meets
                  // `loading="lazy"`, and the value below is recomputed as
                  // the reader pages, so the first slide would turn lazy two
                  // screens in. The others fetch their neighbours ahead so
                  // paging does not wait on a fetch; the rest stay lazy until
                  // they come round.
                  {...(slide === 0
                    ? { preload: true }
                    : { loading: Math.abs(slide - index) <= 1 ? "eager" : "lazy" })}
                  // Padded rather than the button: `object-fit` fits the
                  // picture to the content box, so the 8px the tile keeps
                  // around a thumbnail is kept here too.
                  className="object-contain p-2"
                />
              ) : null}

              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[#0d0d0d]/0 transition-colors duration-300 ease-[var(--ease-smooth)] group-hover/zoom:bg-[#0d0d0d]/12"
              />
              <span
                aria-hidden="true"
                className="text-text-inverse pointer-events-none absolute right-4 bottom-4 flex h-7 w-7 items-center justify-center rounded-md bg-[#0d0d0d]/45 backdrop-blur-[2px] transition-colors duration-300 ease-[var(--ease-smooth)] group-hover/zoom:bg-[#0d0d0d]/80"
              >
                <Maximize2
                  aria-hidden="true"
                  strokeWidth={2}
                  className="h-3.5 w-3.5"
                />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Caption, count, arrows: one line, the caption first because it is
			    the thing being looked at and the controls only serve it. */}
      <div className="flex items-center gap-3">
        <p className="text-text-secondary min-w-0 flex-1 truncate text-[13px]">
          {current.caption ?? current.alt}
        </p>
        <p
          aria-hidden="true"
          className="text-text-secondary shrink-0 font-mono text-[13px] font-light tabular-nums"
        >
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(count).padStart(2, "0")}
        </p>
        <div className="flex shrink-0 gap-1.5">
          <Arrow side="left" label={labels.previous} onClick={() => go(-1)} />
          <Arrow side="right" label={labels.next} onClick={() => go(1)} />
        </div>
      </div>

      {/* The rail. `w-max` inside a scroller rather than `justify-center`: a
			    centred flex container whose content overflows pushes the first item
			    past its own left edge, where no amount of scrolling reaches it. The
			    1px of padding is room for the active tile's ring. */}
      <div className="-mx-1 overflow-x-auto px-1 py-1">
        <div
          ref={railRef}
          role="group"
          aria-label={labels.pick}
          className="flex w-max gap-2"
        >
          {items.map((item, slide) => (
            <button
              key={item.src ?? slide}
              type="button"
              onClick={() => setIndex(slide)}
              aria-label={item.caption ?? item.alt}
              aria-current={slide === index}
              // One height, each its own width, so the rail says at a glance
              // which screens are a phone and which are a desktop.
              style={{
                aspectRatio:
                  item.width && item.height
                    ? `${item.width} / ${item.height}`
                    : "25 / 17",
              }}
              className={`bg-surface relative h-11 shrink-0 overflow-hidden rounded-[4px] transition-opacity duration-200 sm:h-14 ${
                slide === index
                  ? "ring-text-strong opacity-100 ring-2"
                  : "opacity-50 hover:opacity-90"
              }`}
            >
              {item.src ? (
                <Image
                  src={item.src}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover object-top"
                />
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {open !== null ? (
        <Lightbox
          items={items}
          index={open}
          title={title}
          labels={labels}
          // Paging in the viewer moves the strip too, so closing it lands on
          // the screen the reader was looking at rather than the one they left.
          onIndexChange={(next) => {
            setOpen(next);
            setIndex(next);
          }}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </div>
  );
}

/** The light-ground counterpart of the viewer's arrow: a hairline ring, ink on hover. */
function Arrow({
  side,
  label,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="border-border text-text-secondary hover:border-text-strong hover:text-text-strong flex h-9 w-9 items-center justify-center rounded-full border-[0.5px] transition-colors duration-200"
    >
      <Icon aria-hidden="true" strokeWidth={1.75} className="h-5 w-5" />
    </button>
  );
}
