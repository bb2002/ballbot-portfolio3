"use client";

import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { useState } from "react";

import type { GalleryLabels, Media } from "../../content-types";
import { ImagePlaceholder } from "./image-placeholder";
import { Lightbox } from "./lightbox";

type Props = {
	media: Media;
	/** What the picture belongs to; the viewer names itself after it when the media has no caption. */
	title: string;
	/**
	 * The viewer's controls, in the market's language. Without them there is
	 * no accessible name for a control, so the picture goes out as a plain
	 * figure that opens nothing.
	 */
	labels?: GalleryLabels;
	sizes?: string;
	className?: string;
};

/**
 * A picture laid into the page at its own proportions — a step's screenshot,
 * a diagram — that opens the viewer for a closer look.
 *
 * It sits on the same surface tile a thumbnail does, and it is never cropped:
 * the file's declared size sets the box, so the page reserves the right
 * height before the bytes land and the art keeps the shape it was cut to.
 * The chip in the corner is what a thumbnail carries too, and it is there
 * for the same reason — a phone has no hover to reveal it with.
 */
export function ZoomImage({ media, title, labels, sizes = "(max-width: 1024px) 92vw, 760px", className = "" }: Props) {
	const [open, setOpen] = useState(false);

	if (!media.src) {
		return <ImagePlaceholder media={media} className={`aspect-video w-full rounded-lg ${className}`} />;
	}

	const picture =
		media.width && media.height ? (
			<Image
				src={media.src}
				alt={media.alt}
				width={media.width}
				height={media.height}
				sizes={sizes}
				className="h-auto w-full rounded-[4px]"
			/>
		) : (
			<div className="relative aspect-video w-full">
				<Image src={media.src} alt={media.alt} fill sizes={sizes} className="object-contain" />
			</div>
		);

	const tile = `bg-surface relative block w-full overflow-hidden rounded-lg p-2 ${className}`;

	if (!labels) return <div className={tile}>{picture}</div>;

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				aria-label={`${labels.open} — ${media.caption ?? title}`}
				aria-haspopup="dialog"
				className={`group/zoom cursor-zoom-in ${tile}`}
			>
				{picture}

				{/* Hover veil. Under the chip, over the art. */}
				<span
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[#0d0d0d]/0 transition-colors duration-300 ease-[var(--ease-smooth)] group-hover/zoom:bg-[#0d0d0d]/12"
				/>

				<span
					aria-hidden="true"
					className="text-text-inverse pointer-events-none absolute right-4 bottom-4 flex h-7 w-7 items-center justify-center rounded-md bg-[#0d0d0d]/45 backdrop-blur-[2px] transition-colors duration-300 ease-[var(--ease-smooth)] group-hover/zoom:bg-[#0d0d0d]/80"
				>
					<Maximize2 aria-hidden="true" strokeWidth={2} className="h-3.5 w-3.5" />
				</span>
			</button>

			{open ? (
				<Lightbox
					items={[media]}
					index={0}
					title={media.caption ?? title}
					labels={labels}
					onIndexChange={() => {}}
					onClose={() => setOpen(false)}
				/>
			) : null}
		</>
	);
}
