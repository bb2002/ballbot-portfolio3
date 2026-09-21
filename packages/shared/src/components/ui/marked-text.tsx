"use client";

import { useState } from "react";

import type { GalleryLabels, NameLink } from "../../content-types";
import { Emphasised, EMPHASIS_CLASS } from "./emphasised";
import { Lightbox } from "./lightbox";

type Props = {
	/** The line, with `**…**` around each name. */
	text: string;
	/** Where each name goes when pressed, matched by its text. A name with no entry stays plain. */
	links: readonly NameLink[];
	/** The viewer's controls. Without them a name's pictures cannot be opened, and that name stays plain. */
	labels?: GalleryLabels;
};

/** The look of a name that goes somewhere: the emphasis, plus a tint under the pointer. */
const CONTROL = `${EMPHASIS_CLASS} hover:bg-surface rounded-[2px] transition-colors duration-300`;

/**
 * A line of copy whose marked names go somewhere — to the project's own page
 * when it has one, or into the pictures of it: the screens of a game on a
 * Journey row, the one word of a sentence there is a photograph of. Each
 * name carries its own destination, so a line that names two games can open
 * one of them and leave the other plain.
 *
 * A name keeps the same ink as any other emphasis, so the rail stays one
 * rule; only the cursor and the hover tint say it opens something. A glyph
 * on the word was tried and read as clutter on a line this short. The viewer
 * is named after the name that was pressed, since that is what the pictures
 * are of.
 */
export function MarkedText({ text, links, labels }: Props) {
	const [opened, setOpened] = useState<string | null>(null);
	const [index, setIndex] = useState(0);
	const entry = (name: string) => links.find((link) => link.name === name);
	const current = opened !== null ? entry(opened) : undefined;
	const items = current && "gallery" in current ? current.gallery : undefined;

	return (
		<>
			<Emphasised
				text={text}
				mark={(name) => {
					const link = entry(name);
					if (link && "href" in link) {
						return (
							<a href={link.href} className={CONTROL}>
								{name}
							</a>
						);
					}
					if (!link || !link.gallery.length || !labels) return <span className={EMPHASIS_CLASS}>{name}</span>;
					return (
						<button
							type="button"
							onClick={() => {
								setIndex(0);
								setOpened(name);
							}}
							aria-label={`${labels.open} — ${name}`}
							aria-haspopup="dialog"
							className={`${CONTROL} inline cursor-zoom-in`}
						>
							{name}
						</button>
					);
				}}
			/>

			{opened !== null && items && labels ? (
				<Lightbox
					items={items}
					index={index}
					title={opened}
					labels={labels}
					onIndexChange={setIndex}
					onClose={() => setOpened(null)}
				/>
			) : null}
		</>
	);
}
