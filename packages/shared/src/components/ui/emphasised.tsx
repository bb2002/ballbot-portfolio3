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
 */
const EMPHASIS = /\*\*([^*]+)\*\*/g;

export function Emphasised({ text }: { text: string }) {
	// `split` on a capturing pattern alternates plain, marked, plain, marked…
	const parts = text.split(EMPHASIS);
	if (parts.length === 1) return <>{text}</>;

	return (
		<>
			{parts.map((part, index) =>
				index % 2 === 0 ? (
					part
				) : (
					<span key={index} className="text-text-strong border-text-strong border-b font-bold">
						{part}
					</span>
				),
			)}
		</>
	);
}
