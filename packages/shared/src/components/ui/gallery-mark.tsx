"use client";

import { useState } from "react";

import type { GalleryLabels, Media } from "../../content-types";
import { Emphasised, EMPHASIS_CLASS } from "./emphasised";
import { Lightbox } from "./lightbox";

type Props = {
	/** The line, with `**…**` around the word the pictures belong to. */
	text: string;
	gallery: readonly Media[];
	/** What the pictures are of; the viewer names itself after it. */
	title: string;
	labels: GalleryLabels;
};

/**
 * A line of copy whose marked word opens a gallery — the name on a Journey
 * row that has the screens of the thing behind it, or the one word of a
 * sentence there is a photograph of.
 *
 * The word keeps the same ink as any other emphasis, so the rail stays one
 * rule; only the cursor and the hover tint say it opens something. A glyph
 * on the word was tried and read as clutter on a line this short.
 */
export function GalleryMark({ text, gallery, title, labels }: Props) {
	const [index, setIndex] = useState<number | null>(null);

	return (
		<>
			<Emphasised
				text={text}
				mark={(fragment) => (
					<button
						type="button"
						onClick={() => setIndex(0)}
						aria-label={`${labels.open} — ${fragment}`}
						aria-haspopup="dialog"
						className={`${EMPHASIS_CLASS} hover:bg-surface inline cursor-zoom-in rounded-[2px] transition-colors duration-300`}
					>
						{fragment}
					</button>
				)}
			/>

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
