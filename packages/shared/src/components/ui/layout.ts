/**
 * Shared layout atoms.
 *
 * The .pen canvas is 1512 wide with a 96px gutter. `page` reproduces that
 * and centres it on wider screens; `--page-x` (globals.css) steps the
 * gutter down responsively. Section wrappers stay full-bleed so the
 * design's edge-to-edge hairlines keep reaching both sides.
 */
export const page = "mx-auto w-full max-w-[1512px] px-[var(--page-x)]";
