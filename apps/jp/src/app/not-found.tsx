import Link from "next/link";
import { page } from "@ballbot/shared";

import { chrome } from "@/content/portfolio";

/**
 * The page behind a slug that does not exist, and behind any address nothing
 * matches. Next answers 404 and marks it `noindex` on its own; this only puts
 * the market's words on it, inside the root layout, so the footer and the skip
 * link's target are where every other page has them. `not-found` cannot export
 * metadata, so the tab keeps the layout's title.
 *
 * The copy is `chrome.notFound` in src/content, with the rest of the market's
 * words.
 */
export default function NotFound() {
	return (
		<main id="main" tabIndex={-1} className="flex min-h-svh flex-col">
			<div className={`${page} flex flex-1 flex-col justify-center gap-5 py-20`}>
				<p className="text-text-secondary text-meta font-mono font-light">404</p>
				<h1 className="text-text-strong sm:text-title text-[26px] leading-[1.25] font-bold tracking-[-0.01em]">{chrome.notFound.title}</h1>
				{/* <Link>, unlike the plain anchors the shared components use: this is
				    an app file, where the Next lint rule reaches, and a client-side
				    hop home is the right kind of navigation here anyway. */}
				<Link
					href="/"
					className="border-text-strong text-text-strong hover:bg-surface w-fit rounded-[2px] border-b text-[15px] font-semibold transition-colors duration-300"
				>
					{chrome.notFound.home}
				</Link>
			</div>
		</main>
	);
}
