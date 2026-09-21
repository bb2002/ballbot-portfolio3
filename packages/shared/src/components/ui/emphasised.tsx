import { Fragment, type ReactNode } from "react";

/**
 * Copy where `**…**` marks the fragments to lift out of the sentence: bold,
 * underlined, at the strong ink, so a project's name reads before the prose
 * around it. Returns an inline run rather than a paragraph — each caller owns
 * its own type step, and a run drops straight into the copy it belongs to.
 *
 * The marker sits in the string rather than in a shape of its own because a
 * sentence often names more than one thing ("**VRTetris**, **Tooth**,
 * **Unrevived**"), and the separators between them must stay plain — the
 * commas and spaces are not part of any name. A `{lead, emphasis, tail}`
 * shape can carry exactly one fragment, and a list of runs makes the line
 * unreadable in the content file, which is the file that gets edited most.
 *
 * `mark` swaps the plain span for something else at each fragment — the
 * control a name becomes when there are pictures behind it — and is handed
 * the fragment's text. The look stays `EMPHASIS_CLASS` either way, so a name
 * that opens something and a name that does not sit on the same rule.
 */
const EMPHASIS = /\*\*([^*]+)\*\*/g;

export const EMPHASIS_CLASS = "text-text-strong border-text-strong border-b font-bold";

export function Emphasised({ text, mark }: { text: string; mark?: (fragment: string) => ReactNode }) {
	// `split` on a capturing pattern alternates plain, marked, plain, marked…
	const parts = text.split(EMPHASIS);
	if (parts.length === 1) return <>{text}</>;

	return (
		<>
			{parts.map((part, index) =>
				index % 2 === 0 ? (
					part
				) : mark ? (
					<Fragment key={index}>{mark(part)}</Fragment>
				) : (
					<span key={index} className={EMPHASIS_CLASS}>
						{part}
					</span>
				),
			)}
		</>
	);
}
