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
};

/** Section anchors. Market-independent — only the labels are translated. */
export type NavItemId = "projects" | "experience" | "certificates" | "journey" | "resume";

export type NavItem = { id: NavItemId; label: string };

export type NavContent = {
	ariaLabel: string;
	items: readonly NavItem[];
};

export type ScrollCueContent = { ariaLabel: string; href: string };

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

export type FeaturedProject = {
	period: string;
	title: string;
	description: string;
	stats: readonly { value: string; label: string }[];
	/**
	 * Omitted on a project with nothing public to open — the row disappears
	 * rather than leaving an empty foot under the copy.
	 */
	links?: readonly ProjectLink[];
	thumbnail: Media;
	appIcon: Media;
};

export type ArchiveProject = {
	period: string;
	title: string;
	description: string;
	thumbnail: Media;
};

export type ProjectListItem = {
	year: string;
	/** What it was built on or with — "VR", "Unreal Engine", "Android". */
	platform: string;
	title: string;
	summary: string;
	/** Where the row goes. Without it the row renders as plain text, not a link. */
	href?: string;
};

export type ProjectsContent = {
	label: string;
	archiveLabel: string;
	featured: readonly FeaturedProject[];
	archive: readonly ArchiveProject[];
	list: readonly ProjectListItem[];
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
		notes: readonly string[];
	};
	highlights: readonly {
		year: string;
		/** Line breaks are honoured. */
		title: string;
		paragraphs: readonly string[];
	}[];
};

/* ------------------------------------------------------------------ *
 * Certificates
 * ------------------------------------------------------------------ */

export type AwardCard = {
	period: string;
	/** Where it was won. Sits above the title, so the prize stays the headline. */
	event?: string;
	title: string;
	awardName: string;
	/**
	 * The card's one line of prose — what the contest actually was, or what the
	 * prize was won with. `**…**` lifts a project's name out of the sentence.
	 */
	description?: string;
	image: Media;
};

export type CompactCard = {
	period: string;
	/** Line breaks are honoured. */
	title: string;
	/**
	 * A result the title cannot carry on its own — a score, a level. Sits
	 * under the title at the issuer's type size, so the name stays the loudest
	 * thing on the card. Omit it where the title says everything.
	 */
	detail?: string;
	host: string;
	image: Media;
};

export type CertificatesContent = {
	awardsLabel: string;
	certificationsLabel: string;
	featured: readonly AwardCard[];
	/** The smaller awards under the featured pair. Omit to drop the block. */
	sub?: readonly CompactCard[];
	certifications: readonly CompactCard[];
	/**
	 * Things someone else picked them for rather than things they won — a
	 * scholarship, a place in a programme. Kept apart from Awards because the
	 * claim is different: not "I came first" but "they chose me".
	 * Omit the block entirely in a market where it carries no weight.
	 */
	selections?: { label: string; items: readonly AwardCard[] };
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
	/** The open end of the trunk — the row the timeline stops on. */
	now: { label: string; detail: string };
};

/* ------------------------------------------------------------------ *
 * Resume
 * ------------------------------------------------------------------ */

export type ResumeContent = {
	eyebrow: string;
	/** Line breaks are honoured. */
	headline: string;
	lead: string;
	direct: { label: string; address: string };
	fields: {
		name: { label: string; placeholder: string };
		email: { label: string; placeholder: string };
	};
	submit: string;
	submitting: string;
	privacy: string;
	errors: {
		"name-required": string;
		"name-too-long": string;
		"email-required": string;
		"email-format": string;
		/** Delivery failed. Hands the reader the address instead of a dead end. */
		send: string;
	};
	sent: { title: string; detail: string; again: string };
};
