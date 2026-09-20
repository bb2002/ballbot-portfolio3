/**
 * The shape a market's content file has to fill.
 *
 * Components in this package read nothing but props typed from here — copy,
 * asset paths and section labels all arrive from the app — so a market build
 * is one content file plus a page that composes the sections it wants. That
 * is what lets the Japanese build drop a section, reorder the overview or
 * lead with a different figure without forking a single component.
 */

export type Media = {
	/** Path under /public. Leave undefined to render the placeholder tile. */
	src?: string;
	alt: string;
	/**
	 * Intrinsic pixel size. Only the gallery needs it, and not to lay the image
	 * out — the viewer fits it to the stage. It is the shape: the rail draws
	 * each thumbnail at its own proportions, and how much of the viewport a
	 * picture ends up covering (which is what the browser is told, so it can
	 * fetch a file that size) follows from the same ratio.
	 */
	width?: number;
	height?: number;
	/**
	 * One terse line naming the screen — where in the service it sits. It titles
	 * the viewer's panel, and names the slide on the thumbnail rail and to a
	 * screen reader whether the panel is open or not. The `alt` still carries the
	 * full description for a reader who cannot see the image; this is the label
	 * beside it, not a replacement.
	 */
	caption?: string;
	/**
	 * A sentence or two on what the screen is doing, shown beside the image.
	 *
	 * This is what opens the panel, and it is all or nothing per gallery: one
	 * `note` anywhere gives every slide in that set a panel — an image that grew
	 * and shrank as the reader paged past the slides that had one would be worse
	 * than a little repetition — and with none, the images go out on their own,
	 * with no caption line under them either.
	 */
	note?: string;
};

/** Section anchors. Market-independent — only the labels are translated. */
export type NavItemId = "projects" | "experience" | "certificates" | "journey";

export type NavItem = { id: NavItemId; label: string };

export type NavContent = {
	ariaLabel: string;
	items: readonly NavItem[];
};

export type ScrollCueContent = { ariaLabel: string; href: string };

export type FooterContent = {
	/** The year the copyright range opens on; it closes on the year of the build. */
	since: number;
	/** Rights holder and notice, in the market's language. */
	notice: string;
};

/* ------------------------------------------------------------------ *
 * Hero
 * ------------------------------------------------------------------ */

export type Highlight = { emphasis: string | null; detail: string };

/**
 * One figure in the Overview column: the number, the grey line under it and
 * the bulleted rows beneath. A block may carry `caption`, `items`, both or
 * neither — which is how a market decides what it leads with.
 */
export type OverviewBlock = {
	value: string;
	caption?: string;
	items?: readonly Highlight[];
};

export type OverviewContent = {
	label: string;
	blocks: readonly OverviewBlock[];
};

export type HeroAction = { label: string; href: string };

export type HeroContent = {
	ariaLabel: string;
	eyebrow: string;
	/** Line breaks are honoured. */
	headline: string;
	/**
	 * The line under the headline — who is speaking. Optional, because a market
	 * whose headline is already a whole sentence has nothing to finish; the
	 * Korean one is a 관형형 clause that only closes on this line, so there the
	 * two read as one statement broken across two type steps.
	 * Line breaks are honoured.
	 */
	subtitle?: string;
	actions: { primary: HeroAction; secondary: readonly HeroAction[] };
	/**
	 * Points a reader who landed on the wrong market at their own build,
	 * written in that market's language. The href goes through the apex
	 * router, which remembers the choice for the next visit.
	 */
	otherMarket: {
		/** BCP 47 tag for the line — "ja" on the Korean build, "ko" on the Japanese one. */
		lang: string;
		lead: string;
		emphasis: string;
		tail: string;
		href: string;
	};
};

/* ------------------------------------------------------------------ *
 * Projects
 * ------------------------------------------------------------------ */

/**
 * Where a shipped project actually lives: the domain a service runs on, or
 * each store an app is published to. `label` is what the card prints — a bare
 * domain reads as the address itself, a store name as the place to get it.
 */
export type ProjectLink = { label: string; href: string };

/**
 * One label standing in for several addresses — four repositories behind
 * "Github", say. It opens a short menu rather than going anywhere itself, so
 * the card keeps one row however many places the project actually lives in.
 * A single address stays a plain `ProjectLink`: a menu of one is a door that
 * opens onto a door.
 */
export type ProjectLinkGroup = { label: string; items: readonly ProjectLink[] };

export type ProjectLinkEntry = ProjectLink | ProjectLinkGroup;

export function isLinkGroup(entry: ProjectLinkEntry): entry is ProjectLinkGroup {
	return "items" in entry;
}

export type FeaturedProject = {
	period: string;
	title: string;
	description: string;
	stats: readonly { value: string; label: string }[];
	/**
	 * Omitted on a project with nothing public to open — the row disappears
	 * rather than leaving an empty foot under the copy.
	 */
	links?: readonly ProjectLinkEntry[];
	thumbnail: Media;
	appIcon: Media;
	/**
	 * Screens from the product, in the order a reader would walk through it.
	 * Given one, the card's thumbnail becomes the way in: it opens the viewer
	 * and the reader pages the flow from there. Omitted on a project with
	 * nothing to show, and the thumbnail stays a plain tile.
	 */
	gallery?: readonly Media[];
};

export type ArchiveProject = {
	period: string;
	title: string;
	description: string;
	/** As on a featured project: where the thing actually is, or its source. */
	links?: readonly ProjectLinkEntry[];
	thumbnail: Media;
	/** As on a featured project: given one, the thumbnail opens the viewer. */
	gallery?: readonly Media[];
};

/**
 * The viewer's own chrome, in the market's language. Every string here names a
 * control rather than describing content, so it lives beside the section label
 * instead of on each project.
 */
export type GalleryLabels = {
	/** Suffixed with the project's name on the thumbnail button and the dialog. */
	open: string;
	previous: string;
	next: string;
	close: string;
	/** Accessible name for the rail of thumbnails under the image. */
	pick: string;
};

export type ProjectsContent = {
	label: string;
	featured: readonly FeaturedProject[];
	archive: readonly ArchiveProject[];
	/** Required once any project in either row carries a `gallery`. */
	gallery?: GalleryLabels;
};

/* ------------------------------------------------------------------ *
 * Experience
 * ------------------------------------------------------------------ */

export type ExperienceContent = {
	label: string;
	company: {
		period: string;
		/** Line breaks are honoured. */
		name: string;
		role: string;
		teams: string;
		logos: readonly Media[];
		/** Omitted when the column has nothing to say under the logos — the block disappears, not just its text. */
		notes?: readonly string[];
	};
	/** One row each on the section's list; each opens its own page. */
	highlights: readonly ExperienceHighlight[];
};

export type ExperienceHighlight = {
	/** URL segment: the story lives at `/experience/<slug>`. */
	slug: string;
	/** Omitted while the story is undated. */
	year?: string;
	/** The whole list row, so it is one line — no authored breaks. */
	title: string;
	/** One quieter line under the title on the list row: the story in a sentence. */
	subtitle?: string;
	/** The story page body, one entry per paragraph. */
	paragraphs: readonly string[];
};

/* ------------------------------------------------------------------ *
 * Certificates
 * ------------------------------------------------------------------ */

export type CertificateCard = {
	period: string;
	/** Where it was won — the contest or programme. Sits above the title so the prize stays the headline. */
	event?: string;
	/** The prize, the certificate, the selection. Line breaks are honoured. */
	title: string;
	/**
	 * The line under the title: a prize's name, a level, a score. Sits at the
	 * issuer's type size, so the title stays the loudest thing on the card.
	 */
	detail?: string;
	/** Who issued or hosted it — the card's last line. */
	host?: string;
	/** One line of prose; `**…**` lifts a project's name out of the sentence. */
	description?: string;
	image: Media;
	/**
	 * The scans, opened from the tile. A card whose award came with two
	 * certificates carries both; one with a single page still gets a gallery,
	 * because a certificate cannot be read in a 144px tile. `image` stays the
	 * face of the card — it need not be the first page.
	 */
	gallery?: readonly Media[];
};

export type CertificatesContent = {
	label: string;
	/** Required once any card carries a `gallery`. The same strings Projects uses. */
	gallery?: GalleryLabels;
	/**
	 * Certifications, awards and selections together, three to a row and in
	 * the order they should be read. The grid draws six as two full rows;
	 * any other count leaves the last row short.
	 */
	items: readonly CertificateCard[];
};

/* ------------------------------------------------------------------ *
 * Journey
 * ------------------------------------------------------------------ */

export type JourneyEvent = {
	year: string;
	/** `**…**` lifts a project's name out of the title, where the title is the thing. */
	title: string;
	/**
	 * A chapter's turning point: set at the featured step, with the stack it
	 * was built on overhead and a line of prose under it. The rail marks it
	 * with a hollow ring instead of a dot.
	 */
	featured?: boolean;
	/** Mono caption above a featured title — what the thing was made with. */
	stack?: string;
	/** `**…**` lifts a project's name out of the line, as an award's does. */
	detail?: string;
};

export type JourneyChapter = {
	period: string;
	title: string;
	/** Course, team or title. Line breaks are honoured. */
	subtitle?: string;
	events: readonly JourneyEvent[];
};

export type JourneyContent = {
	label: string;
	chapters: readonly JourneyChapter[];
};
