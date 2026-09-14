import Image from "next/image";

import type { Media } from "../../content-types";

type Props = {
	media: Media;
	/** Extra classes for the outer box (sizing, radius, …). */
	className?: string;
	sizes?: string;
	priority?: boolean;
};

/**
 * The design's reusable "Image Placeholder" component: a surface-filled box
 * with a hairline border and a diagonal cross stretched to its bounds.
 * Once `media.src` is supplied the real image takes over, so dropping assets
 * into the market's content file is the only change needed later.
 */
export function ImagePlaceholder({ media, className = "", sizes, priority }: Props) {
	if (media.src) {
		return (
			<div className={`relative overflow-hidden ${className}`}>
				<Image
					src={media.src}
					alt={media.alt}
					fill
					sizes={sizes ?? "(max-width: 1024px) 100vw, 33vw"}
					priority={priority}
					// The optimizer refuses SVG by default; mock art is vector, so pass it through.
					unoptimized={media.src.endsWith(".svg")}
					className="object-cover"
				/>
			</div>
		);
	}

	// A tile with no image yet carries no information, so it stays out of the
	// a11y tree rather than being announced as a picture that is not there.
	return (
		<div aria-hidden="true" className={`border-placeholder-stroke bg-surface relative border ${className}`}>
			<svg
				aria-hidden="true"
				viewBox="0 0 100 100"
				preserveAspectRatio="none"
				className="absolute inset-0 h-full w-full"
			>
				<path
					d="M0 0l100 100m0-100l-100 100"
					fill="none"
					stroke="var(--color-placeholder-stroke)"
					strokeWidth={1}
					vectorEffect="non-scaling-stroke"
				/>
			</svg>
		</div>
	);
}

type FrameProps = {
	media: Media;
	/** Outer surface tile: sizing + corner radius. */
	className?: string;
	sizes?: string;
	priority?: boolean;
};

/**
 * Thumbnail tiles in the design are a `$surface` box with 8px padding wrapping
 * the placeholder — this reproduces that pairing and scales the inner art on
 * hover when the parent carries the `group` class.
 */
export function ThumbFrame({ media, className = "", sizes, priority }: FrameProps) {
	return (
		<div className={`bg-surface flex shrink-0 items-center justify-center overflow-hidden p-2 ${className}`}>
			<ImagePlaceholder
				media={media}
				sizes={sizes}
				priority={priority}
				className="h-full w-full transition-transform duration-500 ease-[var(--ease-smooth)] group-hover:scale-[1.04]"
			/>
		</div>
	);
}
