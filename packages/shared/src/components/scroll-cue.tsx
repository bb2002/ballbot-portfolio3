import { ChevronsDown } from "lucide-react";

import type { ScrollCueContent } from "../content-types";

/**
 * The rail directly under the hero nav. Clicking it jumps to Projects, which
 * is the motion the chevrons are hinting at. `--cue-h` is the height of this
 * whole block, because the hero subtracts it; the rail draws no line of its
 * own, because the 2px rule above the Projects head lands right under it.
 */
export function ScrollCue({ content }: { content: ScrollCueContent }) {
	return (
		<a
			href={content.href}
			aria-label={content.ariaLabel}
			className="group flex h-[var(--cue-h)] w-full items-center justify-center"
		>
			<ChevronsDown
				aria-hidden="true"
				className="text-text-primary anim-cue h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
			/>
		</a>
	);
}
