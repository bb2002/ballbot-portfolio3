import { ArrowUpRight } from "lucide-react";

import type { ProjectLinkEntry } from "../../content-types";
import { isLinkGroup } from "../../content-types";
import { LinkMenu } from "./link-menu";

/**
 * Where the thing actually is: the domain a service runs on, each store an app
 * is published to, or the repositories it was built in — several of those
 * behind one label, as a menu. The design put the stack in pills here; on a
 * project that ships, the address is worth more to a reader than the list of
 * what it was built with — and a pill that is also a link invites a click the
 * stack name cannot honour. So these read as links, borrowing the hero's
 * sliding underline.
 *
 * Both cards and the story page draw the same row, so it lives here rather
 * than three times.
 */
export function ProjectLinks({ links, title }: { links?: readonly ProjectLinkEntry[]; title: string }) {
	if (!links?.length) return null;

	return (
		<ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
			{links.map((link) =>
				isLinkGroup(link) ? (
					<li key={link.label}>
						<LinkMenu group={link} title={title} />
					</li>
				) : (
					<li key={link.href}>
						<a
							href={link.href}
							target="_blank"
							rel="noreferrer noopener"
							// The visible label leads, so the accessible name still opens with
							// the text on screen; the suffix is only there to tell a reader
							// tabbing a list of links which card it is in.
							aria-label={`${link.label} — ${title}`}
							className="group/link text-text-strong inline-flex items-center gap-1 text-[14px] font-semibold"
						>
							<span className="relative">
								{link.label}
								<span
									aria-hidden="true"
									className="bg-text-strong absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-300 ease-[var(--ease-smooth)] group-hover/link:scale-x-100"
								/>
							</span>
							<ArrowUpRight
								aria-hidden="true"
								strokeWidth={2}
								className="h-4 w-4 shrink-0 transition-transform duration-300 ease-[var(--ease-smooth)] group-hover/link:-translate-y-px group-hover/link:translate-x-px"
							/>
						</a>
					</li>
				),
			)}
		</ul>
	);
}
