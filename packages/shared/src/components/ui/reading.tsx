import { Fragment } from "react";

/**
 * Copy where `{base|reading}` sets the reading small over the base — a Korean
 * school's hanja, read the Japanese way, in a line that is not a Journey title
 * (those carry `titleRuby`). Returns an inline run, like `Emphasised`: the
 * caller owns the paragraph and its type step.
 *
 * The marker sits in the string for the same reason `**…**` does: a sentence
 * may carry a reading in the middle of it, and the words around it stay plain.
 * A line with no marker comes back untouched.
 */
const READING = /\{([^{}|]+)\|([^{}|]+)\}/g;

export function Reading({ text }: { text: string }) {
	// `split` on a two-group pattern cycles plain, base, reading, plain, base, reading…
	const parts = text.split(READING);
	if (parts.length === 1) return <>{text}</>;

	const run = [];
	for (let at = 0; at < parts.length; at += 3) {
		run.push(<Fragment key={at}>{parts[at]}</Fragment>);
		if (at + 2 < parts.length) {
			run.push(
				<ruby key={`${at}r`} className="reading">
					{parts[at + 1]}
					<rt>{parts[at + 2]}</rt>
				</ruby>,
			);
		}
	}
	return <>{run}</>;
}
