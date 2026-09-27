import type { ReactNode } from "react";

/**
 * One story page bound into the print document — the app's /print route, which
 * packages/shared/scripts/render-pdf.mjs prints to the PDF the hero hands out.
 * The story renders as it does at its own address — a project's with the rest
 * of its screens set out after the head, which the print route asks for with
 * ProjectStory's `bound` — and this is only the element the render script
 * keys on.
 *
 * `data-chapter` is the path the story is published at, which is how the
 * script sends a link to that path here instead of off the document, and the
 * id is where it sends it. Every id inside is namespaced under this one at the
 * same step, since each story brings its own `main` and `story-…` anchors.
 * A `div`, not an `article`: the story's own <main> may not sit inside one.
 * Each chapter opens a new sheet (theme.css).
 */
export function PrintChapter({ path, children }: { path: `/${string}`; children: ReactNode }) {
	return (
		<div data-chapter={path} id={`chapter${path.replace(/\//g, "-")}`}>
			{children}
		</div>
	);
}
