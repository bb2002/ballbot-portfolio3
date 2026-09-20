"use client";

import { Maximize2 } from "lucide-react";
import { useState } from "react";

import type { GalleryLabels, Media } from "../../content-types";
import { Lightbox } from "./lightbox";
import { ThumbFrame } from "./image-placeholder";

type Props = {
	/** The tile itself — the project's own thumbnail art. */
	media: Media;
	/** The screens behind it. */
	gallery: readonly Media[];
	/** What the gallery belongs to; the viewer names itself after it. */
	title: string;
	labels: GalleryLabels;
	/** Sizing and radius for the tile, as `ThumbFrame` takes them. */
	className?: string;
	sizes?: string;
};

/**
 * A project thumbnail that opens its gallery.
 *
 * The tile is the one the card already drew — this only makes it a control and
 * hangs the viewer off it, so a project with no screens to show keeps the plain
 * `ThumbFrame` and nothing about the row changes.
 *
 * The chip in the corner is there rather than only on hover because a phone
 * has no hover to reveal it with, and a picture that silently happens to be a
 * button is one nobody presses.
 */
export function GalleryThumb({ media, gallery, title, labels, className = "", sizes }: Props) {
	const [index, setIndex] = useState<number | null>(null);

	return (
		<>
			<button
				type="button"
				onClick={() => setIndex(0)}
				aria-label={`${labels.open} — ${title}`}
				aria-haspopup="dialog"
				// The sizing lives on the button so the tile keeps the exact box it
				// had as a plain frame; the frame inside just fills it and inherits
				// the corner, which is what keeps the veil and the chip clipped to it.
				className={`group/zoom relative block cursor-zoom-in ${className}`}
			>
				<ThumbFrame media={media} sizes={sizes} className="h-full w-full rounded-[inherit]" />

				{/* Hover veil. Under the chip, over the art. */}
				<span
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[#0d0d0d]/0 transition-colors duration-300 ease-[var(--ease-smooth)] group-hover/zoom:bg-[#0d0d0d]/12"
				/>

				<span
					aria-hidden="true"
					className="text-text-inverse pointer-events-none absolute right-2 bottom-2 flex h-7 w-7 items-center justify-center rounded-md bg-[#0d0d0d]/45 backdrop-blur-[2px] transition-colors duration-300 ease-[var(--ease-smooth)] group-hover/zoom:bg-[#0d0d0d]/80"
				>
					<Maximize2 aria-hidden="true" strokeWidth={2} className="h-3.5 w-3.5" />
				</span>
			</button>

			{index !== null ? (
				<Lightbox
					items={gallery}
					index={index}
					title={title}
					labels={labels}
					onIndexChange={setIndex}
					onClose={() => setIndex(null)}
				/>
			) : null}
		</>
	);
}
