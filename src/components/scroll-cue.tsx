import { ChevronsDown } from "lucide-react";

/**
 * The rail directly under the hero nav. Clicking it jumps to Projects, which
 * is the motion the chevrons are hinting at. `--cue-h` is the height of this
 * whole block — the closing hairline included — because the hero subtracts it.
 */
export function ScrollCue() {
	return (
		<div className="border-border border-b">
			<a
				href="#projects"
				aria-label="프로젝트 섹션으로 이동"
				className="group flex h-[calc(var(--cue-h)-1px)] w-full items-center justify-center"
			>
				<ChevronsDown
					aria-hidden="true"
					className="text-text-primary anim-cue h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
				/>
			</a>
		</div>
	);
}
