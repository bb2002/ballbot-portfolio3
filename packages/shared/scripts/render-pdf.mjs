/**
 * Prints the whole site to one PDF — the home page, then every project and
 * experience story — checks it, and puts it on the asset bucket for the
 * download link at the end of the hero's actions. The procedure an agent
 * follows around it is docs/how-to-portfolio-to-pdf/SKILL.md.
 *
 * The PDF is not part of the deploy. It is printed from the site as it is
 * served and refreshed on its own schedule, so it can trail the site for a
 * while; this is the quick way to bring the two back together. Two steps,
 * each a script in the app (and at the root, for both markets at once):
 *
 *   npm run pdf        print and verify, into the app's gitignored pdf/ folder
 *   npm run pdf:push   upload the verified file to R2, then check what is served
 *
 * What is printed is the app's /print route (src/app/print/page.tsx) — by
 * default on the market's live host, as readers see it — printed by
 * Chromium through Playwright: A4 landscape, laid out at a desktop width by
 * `SCALE`, with the print rules deciding what paper keeps and where the
 * sheets turn — the document's in theme.css, each component's own as its
 * `print:` utilities. What the file is called is read back off the hero's
 * download link on that page, and the title it carries off the page's
 * <title>, which the print route takes from the same content entry — so the
 * content file is the one place either is written. The key it goes to is
 * read off the link too, but it is not the content's to choose:
 * `downloadLink` holds it to the one key the site's owner approved for the
 * market, and refuses any other.
 *
 * Chromium's file is then corrected where it is wrong (printed-pdf.mjs): the
 * links inside the document are sent to where their targets are on paper,
 * and the bookmarks are titled as their headings read. Then it is checked —
 * the file itself, every sheet, every link, the bookmarks, the fonts, and the
 * text, links and pictures of every page of the site against the document —
 * each check a FAIL, which stops the push, or a WARN, which is reported. The
 * folder gets the PDF, report.json (every check, the file's sha256, where it
 * was printed from — with --local, off which commit and with which
 * uncommitted content — and the last push this folder knows of), a PNG of
 * every page and contact sheets of them, which are there to be looked at: no
 * check sees a clipped line or a blank picture the way an eye does.
 *
 *   --local        print the app's own build instead: `opennextjs-cloudflare
 *                  build`, then `opennextjs-cloudflare preview` on a free local
 *                  port — the Worker `deploy` would upload, on the Workers
 *                  runtime. For a site with changes not yet deployed, or before
 *                  /print is live at all.
 *   --no-build     with --local, serve the .open-next already here as it is
 *   --url <base>   print from a server that is already up (`next dev` on :7770, say)
 *   --out <dir>    the folder to write to, and to push from (default: the app's
 *                  pdf/). One app's, and outside the repository: turbo runs
 *                  each market's task in its own app, so at the root an
 *                  absolute path hands both markets the same folder, and each
 *                  run clears what the other wrote, while a relative one lands
 *                  inside each app, where .gitignore does not reach
 *   --push <bucket>
 *                  send the PDF in the folder to R2 at the key the link names —
 *                  only if report.json is a finished render of this market's,
 *                  has no FAIL, was printed live or with --local and its
 *                  sha256 is the file's — then fetch it back from the public
 *                  host and compare. While it is at it, no render may start
 *                  in the folder, nor another push
 *
 * Playwright does not install its browser with the package. A fresh machine
 * needs it once:  npx playwright install chromium. The page images need
 * poppler's pdftoppm (brew install poppler).
 */
import { execFile, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { once } from "node:events";
import { mkdtempSync, rmSync } from "node:fs";
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { basename, dirname, join, relative, resolve } from "node:path";
import { parseArgs, promisify } from "node:util";

import { chromium } from "playwright";
import sharp from "sharp";

import { ASSET_ORIGIN } from "../src/assets.ts";
import { MARKETS } from "../src/markets.ts";
import {
	amendPdf,
	checkStructure,
	measureSheets,
	placeDestinations,
	readDests,
	readFonts,
	readInfo,
	readLinks,
	readOutline,
	readPdf,
	retitleOutline,
} from "./printed-pdf.mjs";

const run = promisify(execFile);

/**
 * How far the page is shrunk onto the sheet; the layout is as wide as the
 * sheet divided by this. At 0.85 an A4 landscape sheet lays out at 1320px —
 * past `xl`, so every row is the row a desktop reader sees (two featured
 * cards, three archive cards, three certificates across), with the 96px
 * gutter — while 15px body copy still lands on paper at 9.6pt. 0.8 (1403px)
 * gave the same layout with the body at 9pt and the 13px meta lines at 7.8pt,
 * small enough to strain; 0.9 (1247px) drops under `xl` and the archive and
 * the certificates fold into narrower rows. It is not a lever for where the
 * sheets turn: every value moves every break at once.
 */
const SCALE = 0.85;

/** A4 landscape, 297mm across, in CSS px at 96 to the inch. */
const SHEET_PX = (297 / 25.4) * 96;

/**
 * The sheet's top and bottom margins, in points, as theme.css's `@page` sets
 * them — the cover, the first sheet, has none. What Chromium's link targets
 * are measured from, and what bounds the part of a sheet the content fills.
 */
const POINTS_PER_MM = 72 / 25.4;
const MARGIN = { top: 10 * POINTS_PER_MM, bottom: 12 * POINTS_PER_MM };

/** A4 landscape in points, and how far Chromium's rounding may stray from it. */
const A4 = { width: 297 * POINTS_PER_MM, height: 210 * POINTS_PER_MM, slack: 1 };

/**
 * A sheet before the last that is filled less than this far down, or holds
 * this few lines and no picture, is reported: the tail of a block that no
 * longer fitted on the sheet before it.
 */
const SHORT = { fill: 0.15, lines: 5 };

/**
 * A heading with less than this under it, in points, before the foot of its
 * sheet, is a heading left at the bottom with its block gone over to the next
 * one. A heading and one line of text under it measure 34pt; the heading
 * alone, 20 at most.
 */
const STRANDED_HEADING = 24;

/**
 * A hairline — thinner than this, across at least this share of the sheet —
 * that is the last thing on a sheet, with at least this much empty paper over
 * it, has been left behind by the block it opens. One that closes a section
 * before a sheet the print rules turn anyway is where it belongs.
 */
const STRANDED_RULE = { height: 1.5, share: 0.3, gap: 12 };

/**
 * How far above its heading, in points, a link inside the document may land.
 * A chapter's address lands at the top of its first sheet, over the story's
 * head — its meta line and padding, about 78pt above the title; a section,
 * over its label (29pt); an essay, on the rule over its title (24pt).
 */
const LANDING = 120;

/**
 * The faces the document is set in. A glyph none of the site's faces has is
 * drawn from a system font, and that font lands in the file under its own
 * name: anything else here is a character that prints in the wrong face, or
 * as a box. The subset tag (`ABCDEF+`) is Chromium's.
 */
const FONTS = /^(?:[A-Z]{6}\+)?(?:Pretendard(?:JP)?(?:Variable)?|IBMPlexMono)(?:-[A-Za-z]+)?$/;

/**
 * What the site shows on screen and paper deliberately leaves out — the
 * explicit list the completeness check subtracts from each page before it
 * looks for the page's text, links and pictures in the document, and that the
 * document must not show. Each is a way around a screen, or a control, that
 * a printed page has no use for; anything else a page shows the document
 * must show too.
 */
const DROPPED = [
	// The skip link: fixed, so it would print on every sheet, and a keyboard
	// shortcut to <main> that paper has no keyboard for.
	{ what: "the skip link", selector: ".skip-link" },
	// The nav bar and the scroll cue under the hero: ways around the one long
	// page. On paper the cover is the hero alone (theme.css).
	{ what: "the nav bar", selector: "body > div:has(> nav)" },
	{ what: "the scroll cue", selector: "body > a[aria-label]:not(.skip-link)" },
	// The hero's PDF link: a printed page has nothing to save.
	{ what: "the PDF link", selector: "a[download]" },
	// The line for the other market's reader: a way off a site a visitor
	// landed on by mistake, and a document handed out in one language has no
	// wrong host to leave. The cover hides it on purpose.
	{ what: "the other market's line", selector: "header p[lang]" },
	// A story's way back to the list.
	{ what: "the back link", selector: "main > div:first-child:has(a[href^='/#'])" },
	// The slider's count, "01 / 12": decorative (aria-hidden) and about paging,
	// which paper cannot do. Its screens are all printed (ScreenSheet).
	{ what: "the slider's count", selector: "p[aria-hidden='true']" },
	// A link menu's button: it needs a press to open. In print its addresses
	// are set out in the row as links of their own (ProjectLinks).
	{ what: "the link menu's button", selector: "button[aria-haspopup='menu']" },
	// The video: paper cannot play it. A line naming the recording and its
	// YouTube address stands in, which the link check holds the document to.
	{ what: "the video player", selector: "iframe" },
];

/**
 * The window the page is loaded in. As wide as the layout on the sheet,
 * because an image's file is chosen from `sizes` against the window when it
 * loads and never again at print time. Twice the density, so a screenshot
 * holds up on paper — about 226 pixels to the printed inch. The site's own
 * pages are read at the same width, so both sides of the comparison are the
 * same layout.
 */
const VIEWPORT = { width: Math.round(SHEET_PX / SCALE), height: 900 };
const DENSITY = 2;

/**
 * A reader downloads the whole file before the first page shows. The document
 * runs under 5 MiB; one past this means a picture went in uncompressed
 * (`flatten` did not get to it), and is worth stopping for.
 */
const BUDGET = 15 * 1024 * 1024;

/** How long the preview server gets to answer, cold. */
const READY_MS = 120_000;

/** How many times a picture is asked for before it counts as broken (`flatten`). */
const IMAGE_ATTEMPTS = 3;

/** The page images: pdftoppm's resolution, and how the contact sheets lay them out. */
const PAGE_DPI = 110;
const CONTACT = { columns: 4, rows: 4, tile: 480, gap: 16, label: 28 };

/**
 * What the file is stored with on R2, and so what the public host answers
 * with. The download link is on another origin, where a browser ignores
 * `download`, so the object names itself: `attachment` saves it rather than
 * opening it, under the market's own name (`filename*`, RFC 6266/8187) with
 * the key's ASCII name for a client that reads only `filename`.
 *
 * Five minutes of freshness: the edge serves a replaced file for at most that
 * long. What a browser is told is not this — the zone's Browser Cache TTL
 * raises any shorter max-age to its own four hours on the way out, so a
 * reader who downloaded the file within four hours may be handed their own
 * copy again. The push measures what the host actually sends and records it.
 */
const CACHE_CONTROL = "public, max-age=300";
const PUSH_ATTEMPTS = 4;

const { values: options } = parseArgs({
	allowNegative: true,
	options: {
		url: { type: "string" },
		local: { type: "boolean", default: false },
		build: { type: "boolean", default: true },
		out: { type: "string" },
		push: { type: "string" },
	},
});

const app = process.cwd();
const build = resolve(app, ".open-next");

/** The market this app is: its directory's name is its host's first label (apps/kr → kr.ballbot.dev). */
const market = basename(app);
const locale = Object.keys(MARKETS).find((key) => new URL(MARKETS[key]).hostname.split(".")[0] === market);

const out = resolve(options.out ?? join(app, "pdf"));
const FILE = "portfolio.pdf";
const REPORT = "report.json";
const TOOL = "packages/shared/scripts/render-pdf.mjs";

/**
 * Every process group this run started — the build and the preview server —
 * each started as the leader of a group of its own (`track`), so nothing sent
 * to this process reaches them: not a Ctrl+C, not the hangup of a closed
 * terminal. They are stopped on every way out. A signal stops them and then
 * exits as the signal would have (128 + its number); a second one while they
 * stop is ignored, the first is already seeing to it. An error nothing caught
 * does the same, with 1. The `exit` hook is the backstop for a way out that
 * passes none of those — Playwright's own interrupt handler exits once it has
 * closed the browser — and kills whatever is left of each group outright.
 * Only a SIGKILL to this process gets past all of it. The same ways out
 * remove `scratch`, the temporary directory a render hands everything it
 * starts — the build, the preview and Chromium — as TMPDIR: left to the
 * system's own, the OpenNext build and miniflare each leave a folder there on
 * every run, and Playwright one whenever Chromium fails to start, which
 * nothing ever clears.
 */
const groups = new Set();
let scratch = null;
const SIGNALS = { SIGHUP: 1, SIGINT: 2, SIGTERM: 15 };
let leaving = false;
function leave(code) {
	if (leaving) return;
	leaving = true;
	void Promise.allSettled([...groups].map((group) => group.stop())).finally(() => process.exit(code));
}
for (const [signal, number] of Object.entries(SIGNALS)) process.on(signal, () => leave(128 + number));
for (const event of ["uncaughtException", "unhandledRejection"]) {
	process.on(event, (error) => {
		console.error(`render-pdf: ${error instanceof Error ? (error.stack ?? error.message) : error}`);
		leave(1);
	});
}
process.once("exit", () => {
	for (const group of groups) group.kill();
	try {
		if (scratch) rmSync(scratch, { recursive: true, force: true, maxRetries: 3 });
	} catch {
		// A process killed a moment ago may still be writing into it; what is
		// left is a folder of this run's own name, `render-pdf-*`.
	}
});

try {
	if (!locale) throw new Error(`run this from an app directory (apps/kr or apps/jp) — "${market}" is no market in markets.ts`);
	if (options.push) await push(options.push);
	else await renderAndCheck();
} catch (error) {
	console.error(`render-pdf: ${market} — ${error instanceof Error ? error.message : error}`);
	process.exitCode = 1;
	// No summary follows an error, and so no process.cleanup line: what this
	// run started is accounted for here instead.
	if (groups.size) {
		await Promise.allSettled([...groups].map((group) => group.stop()));
		const left = [...groups].filter((group) => group.alive()).length;
		console.error(`render-pdf: ${market} — ${left ? `${left} process groups this run started outlived their stop (SKILL §6-10)` : "every process this run started has stopped"}`);
	}
} finally {
	await Promise.allSettled([...groups].map((group) => group.stop()));
}

/* ------------------------------------------------------------------ *
 * Render and check
 * ------------------------------------------------------------------ */

async function renderAndCheck() {
	if (options.url && options.local) throw new Error("--url and --local each name the server to print from — pass one");
	const startedAt = new Date().toISOString();
	scratch = mkdtempSync(join(tmpdir(), "render-pdf-"));
	process.env.TMPDIR = scratch;
	const previous = await readJson(join(out, REPORT));
	if (previous?.rendering && (await stillRunning(previous.rendering.pid))) {
		throw new Error(
			`another render is writing to ${display(out)} (pid ${previous.rendering.pid}, since ${previous.rendering.startedAt}) — let it finish: two at once clear each other's files`,
		);
	}
	// A push in flight still has the file to upload, and the record of it to
	// write into this report: a render now would clear the one and lose the
	// other.
	if (previous?.pushing && (await stillRunning(previous.pushing.pid))) {
		throw new Error(
			`a push from ${display(out)} is under way (pid ${previous.pushing.pid}, since ${previous.pushing.startedAt}) — render once it has finished, or the record of what it put on R2 is lost`,
		);
	}

	// The last upload this folder knows of, carried over every render since —
	// pushed or not, finished or not: no render may lose the record of what is
	// on R2. Still only a hint: R2 itself is the authority (`wrangler r2 object
	// get … --remote`, SKILL §4). And the last render that finished, for the
	// summary to compare with.
	const lastPush = previous?.push ?? previous?.lastPush ?? null;
	const before = previous?.rendering
		? (previous.previous ?? null)
		: previous?.sha256
			? {
					sha256: previous.sha256,
					undated: previous.undated ?? null,
					pages: previous.pages,
					bytes: previous.bytes,
					finishedAt: previous.finishedAt,
					outline: previous.outline ?? null,
				}
			: null;

	// Until the new report is written, last, the folder's report is a stub
	// that says a render is under way: it carries that record and this run's
	// pid, and a FAIL, so push refuses the folder. A render that fails or is
	// cut short leaves the earlier file and its pages to look at, but no
	// report that vouches for them — a market whose render failed in a
	// two-market run is never pushed as though it had been printed again.
	await mkdir(out, { recursive: true });
	const stub = {
		tool: TOOL,
		market,
		rendering: { pid: process.pid, startedAt },
		previous: before,
		lastPush,
		checks: [{ id: "render.incomplete", item: 9, status: "FAIL", summary: `the render started at ${startedAt} has not finished` }],
	};
	await writeFile(join(out, REPORT), `${JSON.stringify(stub, null, "\t")}\n`);

	let base;
	let source;
	let server;
	let tree = null;
	if (options.url) {
		base = new URL(options.url).origin;
		source = { kind: "url", base };
	} else if (options.local) {
		if (options.build) {
			// The tree the build is made from, read before the build reads it.
			tree = await gitState();
			await buildApp();
		}
		await mustExist(join(build, "worker.js"), "no .open-next/worker.js here — run without --no-build, or `opennextjs-cloudflare build` first");
		const built = (await stat(join(build, "worker.js"))).mtime.toISOString();
		server = serve();
		base = await server.ready;
		source = { kind: "local", base, build: options.build ? "built by this run" : `--no-build: .open-next from ${built}`, builtAt: built };
	} else {
		base = MARKETS[locale];
		source = { kind: "live", base };
		const probe = await fetch(`${base}/print`, { method: "HEAD", redirect: "manual", signal: AbortSignal.timeout(20_000) });
		if (probe.status === 404) {
			throw new Error(
				`${base}/print answered 404: the live site does not have the print route yet — it has not been deployed since it was added. Print the app's own build instead: npm run pdf -- --local`,
			);
		}
		if (!probe.ok) throw new Error(`${base}/print answered ${probe.status}`);
	}
	console.log(`render-pdf: ${market} — printing ${base}/print (${source.kind})`);

	const page = await render(base);

	// Stopped before the file is read over: the checks below need nothing from it.
	let stopped = true;
	if (server) {
		await server.stop();
		stopped = !server.alive();
	}

	// What the last run left goes before anything new is written — all of it
	// but the stub, which the new report replaces once everything is checked.
	for (const name of [FILE, "pages", ...(await readdir(out)).filter((name) => /^contact-\d+\.png$/.test(name))]) {
		await rm(join(out, name), { recursive: true, force: true });
	}

	const checks = [];
	const check = (id, item, status, summary, detail) => checks.push({ id, item, status, summary, ...(detail?.length ? { detail } : {}) });
	const pdf = readPdf(page.bytes);
	const sha256 = createHash("sha256").update(page.bytes).digest("hex");
	const undated = undatedSha256(page.bytes);
	await writeFile(join(out, FILE), page.bytes);

	checkFile(pdf, page, check);
	const sheets = checkSheets(pdf, page, check);
	checkLinks(pdf, page, check);
	checkOutline(pdf, page, check, lastPush?.outline ?? before?.outline);
	checkFonts(pdf, check);
	checkContent(page, check);
	check(
		"page.reveal",
		2,
		page.print.faded.length ? "FAIL" : "PASS",
		page.print.faded.length ? `${page.print.faded.length} printed blocks are caught mid-entrance (faded or moved)` : "no block caught mid-entrance",
		page.print.faded,
	);
	// A picture asked for at fewer pixels than the window's density needs for
	// the width it is laid out at prints soft, and that is the document's
	// doing: its `sizes` told the optimiser too little. One whose original is
	// smaller than its laid-out width is as soft on the site, and no print
	// setting improves it — listed in the report, not warned about.
	const soft = page.print.images.filter((image) => image.asked && image.asked < image.shown * DENSITY);
	const small = page.print.images.filter((image) => image.natural < image.shown && !soft.includes(image));
	check(
		"page.images",
		2,
		soft.length ? "WARN" : "PASS",
		soft.length
			? `${soft.length} pictures were asked for at fewer pixels than they print at, at ${DENSITY}× — look at their \`sizes\``
			: `${page.print.images.length} pictures, each asked for at ${DENSITY}× its printed width or more${small.length ? ` (${small.length} originals are narrower than they print: report.json)` : ""}`,
		[
			...soft.map((image) => `${image.src}: asked for ${image.asked}px, printed ${image.shown}px wide`),
			...small.map((image) => `original smaller than printed — ${image.src}: ${image.natural}px file, ${image.shown}px wide`),
		],
	);
	if (server) check("process.cleanup", 10, stopped ? "PASS" : "FAIL", stopped ? "the preview's process group is gone" : "the preview's process group outlived its stop");

	const images = await pageImages(join(out, FILE), check);

	const report = {
		tool: TOOL,
		market,
		locale,
		source: { ...source, print: `${base}/print` },
		// The tree only where it is what was printed: a --local build this run
		// made. Printed live, off --url or from an .open-next already here, the
		// document is whatever that server was built from, and the checkout
		// beside it is only that — kept under its own name.
		git: tree,
		checkout: tree ? null : await gitState(),
		startedAt,
		finishedAt: new Date().toISOString(),
		file: FILE,
		bytes: page.bytes.length,
		sha256,
		undated,
		pages: pdf.pages.length,
		link: page.link,
		title: page.title,
		outline: page.outline,
		sheets,
		images,
		checks,
		previous: before,
		lastPush,
		push: null,
		remote: null,
	};
	await writeFile(join(out, REPORT), `${JSON.stringify(report, null, "\t")}\n`);
	summarise(report);
	if (checks.some((entry) => entry.status === "FAIL")) process.exitCode = 1;
}

/**
 * The app's own build, the way `deploy` makes it: `sync-public` first — the
 * fonts and marks in public/ are generated, and a fresh checkout has none, so
 * a build without it prints in fallback faces — then the OpenNext build,
 * which runs `next build` and bundles the Worker. Both are run here so a
 * local print is always of the tree as it stands, never of an .open-next an
 * earlier build left behind.
 */
async function buildApp() {
	console.log(`render-pdf: ${market} — building (npm run sync-public, opennextjs-cloudflare build)`);
	await runGroup("npm", ["run", "--silent", "sync-public"]);
	await runGroup(process.execPath, [openNextCli(), "build"]);
}

/**
 * A command in a process group of its own, its output passed through; throws
 * if it does not exit 0. A group that outlives its stop stays tracked, for
 * the `exit` hook and the count on the way out.
 */
async function runGroup(command, args) {
	const child = spawn(command, args, { cwd: app, detached: true, stdio: ["ignore", "inherit", "inherit"] });
	const group = track(child);
	const [code, signal] = await once(child, "exit");
	await group.stop();
	if (!group.alive()) groups.delete(group);
	if (code !== 0) throw new Error(`\`${basename(command)} ${args.join(" ")}\` failed (${signal ?? `exit ${code}`}) — its output is above`);
}

/**
 * The CLI is run by its path, from the app's own copy of the package. The
 * package exports neither its bin nor its manifest — every subpath maps into
 * dist/api — so it is found beside the API entry: `bin` is dist/cli/index.js.
 */
function openNextCli() {
	return join(dirname(createRequire(join(app, "package.json")).resolve("@opennextjs/cloudflare")), "../cli/index.js");
}

/**
 * A process group to stop on the way out. `alive` asks the whole group, not
 * the leader: the CLIs run wrangler through `npm exec`, which runs `workerd`
 * in turn, and signalling only the process started here left `workerd`
 * running.
 */
function track(child) {
	const alive = () => {
		if (!child?.pid) return false;
		try {
			process.kill(-child.pid, 0);
			return true;
		} catch {
			return false;
		}
	};
	const signal = (name) => {
		try {
			process.kill(-child.pid, name);
		} catch {
			// The group is already gone.
		}
	};
	const group = {
		alive,
		/** Last resort, synchronous: for the `exit` handler, which cannot wait. */
		kill: () => alive() && signal("SIGKILL"),
		async stop() {
			if (!alive()) return;
			signal("SIGTERM");
			for (let waited = 0; alive() && waited < 10_000; waited += 100) {
				await new Promise((done) => setTimeout(done, 100));
			}
			if (alive()) signal("SIGKILL");
			for (let waited = 0; alive() && waited < 2_000; waited += 100) {
				await new Promise((done) => setTimeout(done, 100));
			}
		},
	};
	groups.add(group);
	return group;
}

async function mustExist(path, message) {
	try {
		await stat(path);
	} catch {
		throw new Error(message);
	}
}

/** A path as a person reads it in the log: from here when it is under here, whole when it is not. */
function display(path) {
	const near = relative(process.cwd(), path);
	return near.startsWith("..") ? path : near || ".";
}

async function readJson(path) {
	try {
		return JSON.parse(await readFile(path, "utf8"));
	} catch (error) {
		if (error.code === "ENOENT") return null;
		throw new Error(`${display(path)} is not a report this script wrote: ${error.message}`);
	}
}

/**
 * Whether the render or the push a report names (`rendering`, `pushing`) is
 * still at work: its process is alive and is a render-pdf. Once a process is
 * gone its pid may be handed to any other, so being alive is not enough.
 */
async function stillRunning(pid) {
	try {
		process.kill(pid, 0);
		return (await run("ps", ["-o", "command=", "-p", String(pid)])).stdout.includes("render-pdf");
	} catch {
		return false;
	}
}

/**
 * The file's sha256 with the two dates Chromium stamps into its Info
 * dictionary blanked. Every print gets new ones, so two prints of a site that
 * has not changed differ in those bytes alone, and the plain sha256 cannot
 * tell that apart from a change. Equal here, they are the same document.
 */
function undatedSha256(bytes) {
	const text = bytes.toString("latin1").replace(/\/(CreationDate|ModDate) \(D:[^)]*\)/g, "/$1 ()");
	return createHash("sha256").update(text, "latin1").digest("hex");
}

/**
 * `opennextjs-cloudflare preview` on a free port: the same copy of the
 * prerendered pages into the asset tree that `deploy` makes, then
 * `wrangler dev` on the built Worker.
 *
 * The devtools port is left to the system (`--inspector-port 0`, passed
 * through to wrangler). Its default is 9229, and `npm run pdf -- --local` at
 * the root prints both markets at once: two previews probing for it together
 * both took it, and the second runtime died on the bind.
 */
function serve() {
	let log = "";
	let child;
	let group;

	const ready = (async () => {
		const port = await freePort();
		child = spawn(process.execPath, [openNextCli(), "preview", "--port", String(port), "--ip", "127.0.0.1", "--inspector-port", "0"], {
			cwd: app,
			detached: true,
			stdio: ["ignore", "pipe", "pipe"],
		});
		group = track(child);
		const keep = (chunk) => {
			log = (log + chunk).slice(-8000);
		};
		child.stdout.on("data", keep);
		child.stderr.on("data", keep);

		const base = `http://127.0.0.1:${port}`;
		const deadline = Date.now() + READY_MS;
		for (;;) {
			if (child.exitCode !== null || child.signalCode !== null) {
				throw new Error(`the preview server stopped before it answered:\n${log.trim()}`);
			}
			// Not up yet is a refused connection or a timeout, and the loop tries
			// again; an answer is final either way.
			let response;
			try {
				response = await fetch(`${base}/print`, { signal: AbortSignal.timeout(10_000) });
			} catch {
				response = undefined;
			}
			if (response) {
				if (!response.ok) throw new Error(`GET /print answered ${response.status} — is this build older than the route? Build again.`);
				return base;
			}
			if (Date.now() > deadline) throw new Error(`the preview server did not answer within ${READY_MS / 1000}s:\n${log.trim()}`);
			await new Promise((done) => setTimeout(done, 500));
		}
	})();

	return {
		ready,
		alive: () => group?.alive() ?? false,
		stop: async () => group?.stop(),
	};
}

async function freePort() {
	const probe = createServer();
	probe.listen(0, "127.0.0.1");
	await once(probe, "listening");
	const { port } = probe.address();
	probe.close();
	await once(probe, "close");
	return port;
}

/**
 * The document, printed and corrected, and everything the checks need from
 * the browser: the headings and link targets /print printed, what it shows
 * under print media, and the text, links and pictures of each of the site's
 * own pages, read on screen at the width the document is laid out at.
 */
async function render(base) {
	let browser;
	try {
		browser = await chromium.launch();
	} catch (error) {
		throw new Error(`Chromium would not start — on a fresh machine run: npx playwright install chromium\n${error.message.split("\n")[0]}`);
	}

	try {
		// `reducedMotion` as well as the print rules in theme.css: nothing is
		// caught mid-entrance while the page is still on screen, either.
		const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: DENSITY, reducedMotion: "reduce" });
		await context.route(/\/_next\/image\?/, flatten);

		const page = await context.newPage();
		const refused = [];
		page.on("response", (response) => {
			if (response.status() >= 400) refused.push(`${response.status()} ${response.url()}`);
		});
		page.on("requestfailed", (request) => refused.push(`${request.failure()?.errorText ?? "failed"} ${request.url()}`));

		await page.goto(new URL("/print", base).href, { waitUntil: "load", timeout: 120_000 });
		await hydrated(page, "/print");

		await page.emulateMedia({ media: "print" });
		const prepared = await page.evaluate(prepare, MARKETS);
		const link = downloadLink(prepared.download);

		const { broken, fonts } = await page.evaluate(settle);
		if (broken.length || fonts.length) {
			const detail = [...broken.map((src) => `image ${src}`), ...fonts.map((family) => `font ${family}`)];
			const responses = refused.length ? `\nrefused or failed requests:\n  ${refused.join("\n  ")}` : "";
			throw new Error(`the page did not finish loading:\n  ${detail.join("\n  ")}${responses}`);
		}
		const print = await page.evaluate(inspectPrint, DROPPED);

		// The paper is named twice: `format` is what the page's media queries
		// are measured against, and `preferCSSPageSize` lets `@page` set the
		// sheet itself to true A4 (Chromium rounds the named format).
		const printed = await page.pdf({
			format: "A4",
			landscape: true,
			preferCSSPageSize: true,
			printBackground: true,
			scale: SCALE,
			// Tagging is what lets Chromium write the outline: the bookmarks are
			// the document's headings.
			tagged: true,
			outline: true,
		});
		await context.close();

		const site = await readSite(browser, base);
		const { bytes, unpaired } = finish(printed, prepared.headings);
		return {
			base,
			bytes,
			unpaired,
			link,
			title: prepared.title,
			headings: prepared.headings,
			targets: prepared.targets,
			chapters: new Map(prepared.chapters),
			breaks: prepared.breaks,
			print,
			site,
		};
	} finally {
		await browser.close();
	}
}

/** Waits for React to take the page over: `hydrated` is stamped by the first <Reveal> to mount (reveal.tsx). */
async function hydrated(page, path) {
	await page
		.waitForFunction(() => document.documentElement.classList.contains("hydrated"), undefined, { timeout: 60_000 })
		.catch(() => {
			throw new Error(`${path} never hydrated — its scripts did not run`);
		});
}

/**
 * The hero's download link, read off the printed page: the one address on the
 * asset host this market's PDF may be written to, and the key it names in
 * the bucket. Exactly that key, not any file under the market's folder: the
 * site's owner approved two keys, one per market, and nothing else in the
 * bucket is this script's to write — a link copied from the other market's
 * content would overwrite that market's file, and a renamed one would land
 * on a key no one agreed to. A new name takes the owner's word and a change
 * here, before the link that names it ships.
 */
function downloadLink({ href, filename }) {
	let url;
	try {
		url = new URL(href);
	} catch {
		url = null;
	}
	const approved = `/pdf/${market}/portfolio.pdf`;
	if (!url || url.origin !== ASSET_ORIGIN || url.pathname !== approved || url.search || url.hash) {
		throw new Error(
			`the download link's href "${href}" is not ${ASSET_ORIGIN}${approved}, the one key this market's PDF may be written to — set hero.actions.download.href to asset("${approved}"), or ask the site's owner before a new key`,
		);
	}
	if (!filename) throw new Error("the download link names no file (`download` is empty)");
	return { href: url.href, key: url.pathname.slice(1), filename };
}

/**
 * Each page the sitemap lists, read on screen as a reader gets it: its text,
 * the links and pictures it shows, and the videos it embeds — less the
 * chrome in `DROPPED`. A story is read from its <main>: the footer under it
 * is the layout's, printed once at the end of the document. Pictures are not
 * downloaded — only their addresses are compared.
 */
async function readSite(browser, base) {
	const sitemap = await fetch(`${base}/sitemap.xml`, { signal: AbortSignal.timeout(20_000) });
	if (!sitemap.ok) throw new Error(`${base}/sitemap.xml answered ${sitemap.status}`);
	const paths = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
	if (!paths.length) throw new Error(`${base}/sitemap.xml lists no pages`);

	const context = await browser.newContext({ viewport: VIEWPORT, reducedMotion: "reduce" });
	await context.route("**/*", (route) => (["image", "media"].includes(route.request().resourceType()) ? route.abort() : route.fallback()));
	try {
		const page = await context.newPage();
		const pages = [];
		for (const path of paths) {
			const response = await page.goto(new URL(path, base).href, { waitUntil: "load", timeout: 120_000 });
			if (!response?.ok()) throw new Error(`${path} answered ${response?.status()}`);
			await hydrated(page, path);
			pages.push({ path, ...(await page.evaluate(inspectScreen, { dropped: DROPPED, story: path !== "/" })) });
		}
		return pages;
	} finally {
		await context.close();
	}
}

/**
 * Chromium's file, corrected (printed-pdf.mjs). The links inside the document
 * are sent where their targets are on paper, and the bookmarks take their
 * headings' titles — unless they cannot be paired with them, which the
 * outline check then fails on.
 */
function finish(printed, headings) {
	const source = readPdf(printed);
	const margin = (index) => (index === 0 ? 0 : MARGIN.top);
	const changed = new Map();
	placeDestinations(source, { scale: SCALE, margin }, changed);
	const unpaired = retitleOutline(source, headings, changed);
	return { bytes: amendPdf(source, changed), unpaired };
}

/**
 * The optimiser hands Chromium WebP, and a PDF cannot carry WebP as it is:
 * Chromium decodes it and embeds the pixels losslessly, several times the
 * file. A JPEG goes in byte for byte, so every opaque picture is handed over
 * as one — measured, that halves the document. A picture with transparency
 * (an app icon, a cut-out mark) keeps its own file: JPEG has no alpha to hold
 * it in.
 *
 * A failed fetch, a 5xx, a 403 or a 429 is asked for again, twice, before it
 * is handed over: the local preview's /_next/image answers one request in a
 * few thousand with a 500 under the load of a whole document, and passes on
 * whatever status the asset host gave its own fetch — a 403 once, while both
 * markets printed at the same time — and that one picture would otherwise
 * fail the run. Any other 4xx is the same on every asking.
 */
async function flatten(route) {
	let response;
	for (let attempt = 1; ; attempt++) {
		try {
			response = await route.fetch();
			const status = response.status();
			if ((status < 500 && status !== 403 && status !== 429) || attempt === IMAGE_ATTEMPTS) break;
		} catch {
			if (attempt === IMAGE_ATTEMPTS) return route.abort();
		}
		await new Promise((done) => setTimeout(done, 500 * attempt));
	}
	const type = response.headers()["content-type"] ?? "";
	if (!response.ok() || !type.startsWith("image/") || type.startsWith("image/svg")) return route.fulfill({ response });

	const body = await response.body();
	try {
		const { isOpaque } = await sharp(body).stats();
		if (!isOpaque) return route.fulfill({ response, body });
		const jpeg = await sharp(body).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
		return route.fulfill({ status: 200, contentType: "image/jpeg", body: jpeg });
	} catch {
		// A file sharp cannot read goes in as it came; Chromium decides.
		return route.fulfill({ response, body });
	}
}

/**
 * Runs in the page, under print media. Reads the download link, then turns
 * the story pages bound into /print into chapters of one document:
 *
 * — Every id inside a chapter is namespaced under the chapter's own, and the
 *   chapter's `#…` links and ARIA references follow: each story brings its
 *   own `main` and `story-motivation`, and a PDF has one namespace.
 * — A link to a story's address goes to its chapter; `/#section` goes to the
 *   section on the cover pages; any other link to this host is written out on
 *   the market's public host. A PDF resolves a relative link against the
 *   address it was printed from, which may be a local port.
 *
 * And reads off every heading paper keeps, for the bookmarks Chromium builds
 * from them: as Chromium runs its text together (`raw`, a ruby's reading
 * included) and as it reads (`title`). A written line break reads as the
 * space it stands in for — except between two characters of a script written
 * without spaces, where the break in 善隣インターネット / 高等学校 is only a
 * place to turn — and a reading is left out: it is set over its word, not
 * after it. A heading that opens a sheet the print rules turn — a home
 * screen's or a chapter's first — is marked `opens`. And for every place a
 * link inside the document goes, which heading it is meant to show.
 */
function prepare(markets) {
	// `next dev` mounts its overlay in a fixed layer, which prints on every sheet.
	for (const overlay of document.querySelectorAll("nextjs-portal")) overlay.remove();

	const download = document.querySelector("a[download]");
	if (!download) throw new Error("no download link on /print — the hero renders it from `hero.actions.download`");

	const locale = document.documentElement.lang;
	const home = markets[locale];
	if (!home) throw new Error(`<html lang="${locale}"> is not a market in markets.ts`);

	const chapters = new Map();
	for (const chapter of document.querySelectorAll("[data-chapter]")) {
		chapters.set(chapter.dataset.chapter, chapter.id);
		const renamed = new Map();
		for (const element of chapter.querySelectorAll("[id]")) {
			renamed.set(element.id, `${chapter.id}--${element.id}`);
			element.id = renamed.get(element.id);
		}
		for (const name of ["aria-labelledby", "aria-describedby", "aria-controls", "for"]) {
			for (const element of chapter.querySelectorAll(`[${name}]`)) {
				const ids = element.getAttribute(name).split(/\s+/);
				element.setAttribute(name, ids.map((id) => renamed.get(id) ?? id).join(" "));
			}
		}
		for (const anchor of chapter.querySelectorAll('a[href^="#"]')) {
			const id = decodeURIComponent(anchor.getAttribute("href").slice(1));
			if (renamed.has(id)) anchor.setAttribute("href", `#${renamed.get(id)}`);
		}
	}
	if (!chapters.size) throw new Error("no [data-chapter] on /print — the stories are missing from the document");

	for (const anchor of document.querySelectorAll("a[href]")) {
		const raw = anchor.getAttribute("href");
		if (raw.startsWith("#")) continue;
		const url = new URL(raw, location.href);
		if (url.origin !== location.origin) continue;
		const chapter = chapters.get(url.pathname);
		if (chapter) {
			// A place in a story is that place in its chapter, renamed with the
			// rest of the chapter's ids above; one the story does not have is the
			// chapter's top, and the link check names it.
			const place = url.hash && `${chapter}--${decodeURIComponent(url.hash.slice(1))}`;
			anchor.setAttribute("href", `#${place && document.getElementById(place) ? place : chapter}`);
		} else if (url.pathname === "/" && url.hash && document.getElementById(decodeURIComponent(url.hash.slice(1)))) {
			anchor.setAttribute("href", url.hash);
		} else {
			anchor.setAttribute("href", `${home}${url.pathname === "/" ? "" : url.pathname}${url.search}${url.hash}`);
		}
	}

	// What the document is held to before it is printed.
	const seen = new Set();
	const repeated = new Set();
	for (const element of document.querySelectorAll("[id]")) {
		if (seen.has(element.id)) repeated.add(element.id);
		seen.add(element.id);
	}
	if (repeated.size) throw new Error(`ids still repeated: ${[...repeated].join(", ")}`);

	// A link left on the render host would open a local port on paper. Printed
	// off the live site the render host is the public one, where every such
	// link was just written out on purpose.
	const anchors = [...document.querySelectorAll("a[href]")];
	const local =
		location.origin === new URL(home).origin
			? []
			: anchors.filter((anchor) => !anchor.getAttribute("href").startsWith("#") && new URL(anchor.href).origin === location.origin);
	if (local.length) throw new Error(`links still point at the render host: ${local.map((anchor) => anchor.getAttribute("href")).join(", ")}`);
	const inside = anchors.filter((anchor) => anchor.checkVisibility() && anchor.getAttribute("href").startsWith("#"));
	const dangling = inside.map((anchor) => anchor.getAttribute("href")).filter((hash) => !document.getElementById(decodeURIComponent(hash.slice(1))));
	if (dangling.length) throw new Error(`links to nothing in the document: ${[...new Set(dangling)].join(", ")}`);

	const unspaced = /[\u2e80-\u30ff\u3400-\u9fff\uf900-\ufaff\uff00-\uffef]/;
	const printed = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")].filter((heading) => heading.checkVisibility());
	const read = printed
		.map((heading) => {
			let raw = "";
			let title = "";
			const walk = (node, reading) => {
				for (const child of node.childNodes) {
					if (child.nodeType === Node.TEXT_NODE) {
						raw += child.data;
						if (!reading) title += child.data;
					} else if (child.nodeType === Node.ELEMENT_NODE && child.checkVisibility() && child.getAttribute("aria-hidden") !== "true") {
						if (child.localName === "br") {
							raw += "\n";
							title += "\n";
						} else {
							walk(child, reading || child.localName === "rt");
						}
					}
				}
			};
			walk(heading, false);
			title = title
				.replace(/\s+/g, (space, at, all) =>
					space.includes("\n") && unspaced.test(all[at - 1] ?? "") && unspaced.test(all[at + space.length] ?? "") ? "" : " ",
				)
				.trim();
			return { element: heading, raw, title };
		})
		.filter(({ raw }) => raw.trim());
	const elements = read.map(({ element }) => element);

	// The blocks the print rules open a sheet for (theme.css), and the heading each opens on.
	const blocks = [...document.querySelectorAll("body > header[data-section] ~ main > [data-section], [data-chapter]")];
	const opening = new Set(blocks.map((block) => elements.findIndex((element) => block.contains(element))).filter((index) => index >= 0));

	// Where each link inside the document lands, and the heading that is meant
	// to be in view there: the target itself, or the first heading in it.
	const targets = [...new Set(inside.map((anchor) => decodeURIComponent(anchor.getAttribute("href").slice(1))))].map((id) => {
		const target = document.getElementById(id);
		const heading = elements.findIndex((element) => element === target || target.contains(element));
		return { id, heading: heading < 0 ? null : heading };
	});

	return {
		download: { href: download.href, filename: download.getAttribute("download") ?? "" },
		title: document.title,
		headings: read.map(({ raw, title }, index) => ({ raw, title, opens: opening.has(index) })),
		targets,
		chapters: [...chapters],
		breaks: blocks.length,
	};
}

/**
 * Runs in the page, under print media. Every picture paper keeps is fetched
 * now rather than when it scrolls near — nothing scrolls — and decoded, and
 * every face the text asks for has arrived. A picture that is hidden in print
 * (the slider's rail, the viewer) is left alone. Reports what did not load.
 */
async function settle() {
	// A layout under print media first, so the faces print-only text needs are asked for.
	document.body.getBoundingClientRect();
	const printed = [...document.images].filter((image) => image.checkVisibility());
	for (const image of printed) image.loading = "eager";

	const waited = Promise.all(printed.map((image) => image.decode().catch(() => {}))).then(() => document.fonts.ready);
	await Promise.race([waited, new Promise((done) => setTimeout(done, 90_000))]);

	return {
		broken: printed.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
		fonts: [...document.fonts].filter((face) => face.status === "error").map((face) => face.family),
	};
}

/**
 * Runs in the page, under print media, once it is settled: what paper will
 * carry. Any of the dropped chrome still showing; any block caught
 * mid-entrance — a reveal or a load-time entrance whose opacity or transform
 * is not at rest; every picture, with the width the optimiser was asked for,
 * the width of its file and the width it is laid out at; and the text,
 * pictures and links of each part of the document — the home page
 * (everything outside a chapter, the footer included) and each chapter, by
 * the path the story is published at.
 *
 * Shown is laid out and not made invisible. `checkVisibility()` alone passes
 * an element under `visibility: hidden` or `opacity: 0`: laid out, so it has
 * a box, but not drawn — a blank where a picture was, a label with no link
 * under it, since Chromium writes no link annotation for an anchor it does
 * not paint. Only the entrance check, and the choice of a part's top-level
 * blocks, ask for the box alone: a block stuck at opacity 0 is what the first
 * looks for, and a hidden block may still hold a child that shows.
 *
 * It is not painted, though. An anchor or a picture that an ancestor clips
 * away entirely — `overflow: hidden`, a line clamp, `clip-path` — is still
 * shown by this measure, yet Chromium writes no link for it; and `innerText`
 * keeps text at opacity 0 and text clipped away, neither of which reaches
 * paper. So a part's text, pictures and links are what the print's DOM holds
 * there, not what the PDF's own text layer or annotations say is on those
 * sheets. Mapping the sheets back to parts would need the outline, and the
 * layout's footer, which belongs to the home page's part, is printed on the
 * last story's last sheet. Clipped text is left to the eye (SKILL §6-2).
 */
function inspectPrint(dropped) {
	const laidOut = (element) => element.checkVisibility();
	const shown = (element) => element.checkVisibility({ visibilityProperty: true, opacityProperty: true });
	const key = (image) => {
		const url = new URL(image.getAttribute("src") ?? "", location.href);
		const inner = url.pathname === "/_next/image" ? url.searchParams.get("url") : null;
		const target = inner ? new URL(inner, location.href) : url;
		return target.origin === location.origin ? target.pathname : target.href;
	};
	const describe = (element) => `${element.localName}${element.id ? `#${element.id}` : ""} "${(element.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 60)}"`;

	const chrome = dropped.flatMap(({ what, selector }) => [...document.querySelectorAll(selector)].filter(shown).map((element) => `${what}: ${describe(element)}`));
	const faded = [...document.querySelectorAll("[data-reveal], .anim-in")].filter(laidOut).flatMap((element) => {
		const style = getComputedStyle(element);
		return Number(style.opacity) < 1 || style.transform !== "none" ? [`${describe(element)} (opacity ${style.opacity}, transform ${style.transform})`] : [];
	});
	const images = [...document.images].filter(shown).map((image) => {
		const url = new URL(image.currentSrc || image.src, location.href);
		const asked = url.pathname === "/_next/image" ? Number(url.searchParams.get("w")) : null;
		return { src: key(image), asked, natural: image.naturalWidth, shown: Math.round(image.getBoundingClientRect().width) };
	});

	// A link as the PDF will carry it: `#` and the destination's name, or the whole address.
	const target = (anchor) => {
		const href = anchor.getAttribute("href");
		return href.startsWith("#") ? `#${decodeURIComponent(href.slice(1))}` : new URL(href, location.href).href;
	};
	const read = (parts) => ({
		text: parts.map((part) => part.innerText).join("\n"),
		images: [...new Set(parts.flatMap((part) => [...part.querySelectorAll("img")].filter(shown).map(key)))],
		links: [...new Set(parts.flatMap((part) => [...part.querySelectorAll("a[href]")].filter(shown).map(target)))],
	});
	const regions = { "/": read([...document.body.children].filter((element) => !element.matches("[data-chapter]") && laidOut(element))) };
	for (const chapter of document.querySelectorAll("[data-chapter]")) regions[chapter.dataset.chapter] = read([chapter]);

	return { chrome, faded, images, regions };
}

/**
 * Runs in a page of the site, on screen. Opens every link menu in turn and
 * notes the addresses in it — a menu mounts its items only while it is open,
 * so a page read as it loads has none of the repositories behind one, and
 * the document could lose every one of them unseen. Then notes which of the
 * dropped chrome the page has and which videos it embeds, takes the chrome
 * out, and reads what is left: the text, the links a reader can follow and
 * the pictures — by the file each shows, whichever size the optimiser was
 * asked for.
 */
async function inspectScreen({ dropped, story }) {
	const shown = (element) => element.checkVisibility();
	const key = (image) => {
		const url = new URL(image.getAttribute("src") ?? "", location.href);
		const inner = url.pathname === "/_next/image" ? url.searchParams.get("url") : null;
		const target = inner ? new URL(inner, location.href) : url;
		return target.origin === location.origin ? target.pathname : target.href;
	};
	const root = story ? document.querySelector("main") : document.body;

	// A press opens a menu and a second closes it (link-menu.tsx); React
	// renders the items within a frame or two of the press.
	const menus = [];
	for (const button of [...root.querySelectorAll("button[aria-haspopup='menu']")].filter(shown)) {
		button.click();
		let items = [];
		for (let waited = 0; !items.length && waited < 2_000; waited += 20) {
			await new Promise((done) => setTimeout(done, 20));
			items = [...(button.parentElement?.querySelectorAll("[role='menuitem'][href]") ?? [])];
		}
		if (!items.length) throw new Error(`the link menu "${button.getAttribute("aria-label")}" opened no items`);
		menus.push(...items.map((item) => item.href));
		button.click();
		// Closed before the text is read, or its items would count as the page's lines.
		for (let waited = 0; button.parentElement?.querySelector("[role='menu']") && waited < 2_000; waited += 20) {
			await new Promise((done) => setTimeout(done, 20));
		}
	}

	const frames = [...root.querySelectorAll("iframe[src]")].map((frame) => frame.src);
	const matched = dropped.filter(({ selector }) => document.querySelector(selector)).map(({ what }) => what);
	for (const { selector } of dropped) for (const element of document.querySelectorAll(selector)) element.remove();
	return {
		text: root.innerText,
		links: [...new Set([...[...root.querySelectorAll("a[href]")].filter(shown).map((anchor) => anchor.href), ...menus])],
		menus: menus.length,
		images: [...new Set([...root.querySelectorAll("img")].filter(shown).map(key))],
		frames,
		matched,
	};
}

/* ------------------------------------------------------------------ *
 * Checks. Each is recorded with the item of the verification list in
 * docs/how-to-portfolio-to-pdf/SKILL.md it covers.
 * ------------------------------------------------------------------ */

/** The file: its shape, size and title, and whether it holds together (items 1 and 8). */
function checkFile(pdf, page, check) {
	const odd = pdf.pages
		.map((_, index) => ({ index, ...pdf.size(index) }))
		.filter(({ width, height }) => Math.abs(width - A4.width) > A4.slack || Math.abs(height - A4.height) > A4.slack);
	check(
		"pdf.shape",
		1,
		odd.length ? "FAIL" : "PASS",
		odd.length ? `${odd.length} sheets are not A4 landscape` : `${pdf.pages.length} sheets, all A4 landscape`,
		odd.map(({ index, width, height }) => `sheet ${index + 1}: ${width.toFixed(1)} × ${height.toFixed(1)} pt`),
	);
	// The cover, then every block the print rules open a sheet for: fewer
	// sheets than that and a break was lost.
	const least = page.breaks + 1;
	check("pdf.pages", 1, pdf.pages.length >= least ? "PASS" : "FAIL", `${pdf.pages.length} pages (the cover and ${page.breaks} blocks that open a sheet need ${least} at least)`);
	const size = `${(page.bytes.length / 1024 / 1024).toFixed(1)} MiB`;
	check("pdf.size", 1, page.bytes.length <= BUDGET ? "PASS" : "FAIL", `${size} (budget ${BUDGET / 1024 / 1024} MiB)`);
	const { title } = readInfo(pdf);
	check(
		"pdf.title",
		1,
		title && title === page.title ? "PASS" : "FAIL",
		title === page.title ? `Title "${title}"` : `Title "${title ?? ""}", /print's <title> "${page.title}"`,
	);
	const problems = checkStructure(pdf);
	check(
		"file.structure",
		8,
		problems.length ? "FAIL" : "PASS",
		problems.length ? `${problems.length} problems a reader would have to repair` : `${pdf.objects.length} objects, every one where the table says, every stream whole`,
		problems.slice(0, 20),
	);
}

/**
 * The sheets (items 2 and 3): the cover is the hero alone, every block the
 * print rules turn a sheet for opens one, every sheet but the cover carries
 * its folio, and none ends on the stray end of a block.
 */
function checkSheets(pdf, page, check) {
	const margin = (index) => (index === 0 ? 0 : MARGIN.top);
	const sheets = measureSheets(pdf, (index, height) => ({ top: margin(index), bottom: height - (index === 0 ? 0 : MARGIN.bottom) }));
	const outline = readOutline(pdf);
	const paired = outline.length === page.headings.length;
	const last = sheets.length - 1;

	// Which chapter a sheet is in, for the report: the last top-level bookmark
	// that opens on or before it.
	const chapters = outline.filter((item) => item.depth === 0);
	const chapterOf = (index) => chapters.findLast((chapter) => chapter.page >= 0 && chapter.page <= index)?.title ?? "";

	check(
		"cover.chrome",
		2,
		page.print.chrome.length ? "FAIL" : "PASS",
		page.print.chrome.length ? "screen chrome shows on paper" : `none of the ${DROPPED.length} kinds of screen chrome shows on paper`,
		page.print.chrome,
	);

	// Every block the rules open a sheet for starts one: its heading is on a
	// later sheet than the heading before it. The first of them is the first
	// screen after the cover, so this is also what keeps the cover the hero's.
	const late = paired
		? page.headings.flatMap((heading, index) =>
				heading.opens && index > 0 && outline[index].page <= outline[index - 1].page ? [`"${heading.title}" shares sheet ${outline[index].page + 1} with "${page.headings[index - 1].title}"`] : [],
			)
		: ["the bookmarks could not be paired with the headings (see outline)"];
	check(
		"sheets.breaks",
		2,
		late.length ? "FAIL" : "PASS",
		late.length ? "a block the print rules open a sheet for does not" : `the cover holds the hero alone, and each of the ${page.breaks} blocks after it opens a sheet`,
		late,
	);

	const folios = sheets.flatMap((sheet, index) => ((index === 0 ? sheet.foot !== 0 : sheet.foot !== 1) ? [`sheet ${index + 1}: ${sheet.foot} lines in the foot margin`] : []));
	check("sheets.folios", 2, folios.length ? "FAIL" : "PASS", folios.length ? "a folio is missing, or one is on the cover" : `a folio on each of sheets 2–${sheets.length}, none on the cover`, folios);

	const fill = (sheet) => (sheet.bottom === null ? 0 : (sheet.bottom - sheet.box.top) / (sheet.box.bottom - sheet.box.top));
	const short = sheets
		.map((sheet, index) => ({ ...sheet, index, fill: fill(sheet) }))
		.filter((sheet) => sheet.index < last && (sheet.fill < SHORT.fill || (!sheet.pictures && sheet.lines <= SHORT.lines)));
	check(
		"sheets.short",
		3,
		short.length ? "WARN" : "PASS",
		short.length
			? `${short.length} sheets carry only a few lines — the end of a block that no longer fits the sheet before it; look at the print rules around it`
			: "no sheet before the last carries only a few lines",
		short.map(
			(sheet) =>
				`sheet ${sheet.index + 1} (${chapterOf(sheet.index)}): ${sheet.lines} lines${sheet.pictures ? `, ${sheet.pictures} pictures` : ""}, filled ${Math.round(sheet.fill * 100)}% of the way down`,
		),
	);

	// A sheet the rules turn after anyway may end on the rule that closes its
	// section; any other may not.
	const turned = new Set(paired ? page.headings.flatMap((heading, index) => (heading.opens ? [outline[index].page] : [])) : []);
	const rules = sheets.flatMap((sheet, index) => {
		const rule = sheet.last;
		if (index === last || turned.has(index + 1) || !rule || rule.kind !== "shape") return [];
		if (rule.height > STRANDED_RULE.height || rule.share < STRANDED_RULE.share) return [];
		const gap = sheet.bottom - rule.height - (sheet.above ?? sheet.box.top);
		return gap >= STRANDED_RULE.gap ? [`sheet ${index + 1} (${chapterOf(index)}) ends on a rule with ${Math.round(gap)}pt of nothing over it`] : [];
	});
	check("sheets.rules", 3, rules.length ? "WARN" : "PASS", rules.length ? "a rule is left alone at the foot of a sheet" : "no rule is left alone at the foot of a sheet", rules);

	const stranded = paired
		? outline.flatMap((item, index) => {
				if (item.page < 0 || item.page === last) return [];
				const top = pdf.height(item.page) - item.y;
				const under = sheets[item.page].bottom - top;
				return under < STRANDED_HEADING ? [`"${page.headings[index].title}" at the foot of sheet ${item.page + 1}, ${Math.round(under)}pt from the end of it`] : [];
			})
		: [];
	check("sheets.headings", 3, stranded.length ? "WARN" : "PASS", stranded.length ? "a heading ends a sheet, its block on the next one" : "no heading ends a sheet", stranded);

	return sheets.map((sheet, index) => ({
		page: index + 1,
		chapter: chapterOf(index),
		lines: sheet.lines,
		pictures: sheet.pictures,
		fill: Math.round(fill(sheet) * 100) / 100,
	}));
}

/**
 * The links (item 4): every address absolute https and none to the host the
 * page was printed from; every link inside the document to a destination
 * that exists, on the sheet of the heading it is meant to show, at most a
 * head's height above it; every link on the site's pages, those behind a
 * link menu included, with its counterpart in its page's part of the PDF;
 * and no address in the PDF that the site does not link to.
 */
function checkLinks(pdf, page, check) {
	const links = readLinks(pdf);
	const dests = readDests(pdf);
	const outline = readOutline(pdf);
	const render = new URL(page.base);

	const bad = links.flatMap((link) => {
		if (link.dest !== undefined) return [];
		if (link.uri === undefined) return [`sheet ${link.page + 1}: a link that is neither an address nor a destination`];
		let url;
		try {
			url = new URL(link.uri);
		} catch {
			return [`sheet ${link.page + 1}: "${link.uri}" is not an absolute address`];
		}
		if (url.protocol !== "https:") return [`sheet ${link.page + 1}: ${link.uri} is not https`];
		if (url.host === render.host && render.protocol === "http:") return [`sheet ${link.page + 1}: ${link.uri} points at the render host`];
		if (/^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(url.hostname)) return [`sheet ${link.page + 1}: ${link.uri} points at this machine`];
		return [];
	});
	const uris = links.filter((link) => link.uri !== undefined);
	const hosts = [...new Set(uris.map((link) => URL.canParse(link.uri) && new URL(link.uri).host).filter(Boolean))];
	check(
		"links.external",
		4,
		bad.length ? "FAIL" : "PASS",
		bad.length ? `${bad.length} links go nowhere a reader can follow` : `${uris.length} addresses, all https, to ${hosts.join(", ")}`,
		bad,
	);

	const byId = new Map(page.targets.map((target) => [target.id, target.heading]));
	const paired = outline.length === page.headings.length;
	const inside = links.filter((link) => link.dest !== undefined);
	const wrong = inside.flatMap((link) => {
		const dest = dests.get(link.dest);
		if (!dest || dest.page < 0) return [`sheet ${link.page + 1}: #${link.dest} names no destination`];
		const heading = byId.get(link.dest);
		if (heading === undefined || heading === null || !paired) return [];
		const item = outline[heading];
		const above = dest.y - item.y;
		if (item.page !== dest.page) return [`#${link.dest} lands on sheet ${dest.page + 1}, "${page.headings[heading].title}" is on sheet ${item.page + 1}`];
		if (above < -1 || above > LANDING) return [`#${link.dest} lands ${Math.round(Math.abs(above))}pt ${above < 0 ? "below" : "above"} "${page.headings[heading].title}" on sheet ${item.page + 1}`];
		return [];
	});
	check(
		"links.internal",
		4,
		wrong.length ? "FAIL" : "PASS",
		wrong.length ? "a link inside the document lands in the wrong place" : `${inside.length} links inside the document, each landing on its heading`,
		[...new Set(wrong)],
	);

	// The counterpart each link on the site has in the document: a story's
	// address is its chapter, and a place in a story (`#…`) that place in its
	// chapter; a place on the home page is that place on the cover pages; any
	// other page on this host is written out on its public host, and anything
	// else is the same address. A video is its YouTube page. Each must be a
	// link in the PDF, and an anchor shown in the page's own part of the print
	// (`inspectPrint`, which cannot see an anchor clipped away) — the same
	// repository linked from a card and from its story is two links, and
	// losing one is not made good by the other.
	const home = MARKETS[locale];
	const want = new Set([...uris.filter((link) => URL.canParse(link.uri)).map((link) => new URL(link.uri).href), ...inside.map((link) => `#${link.dest}`)]);
	const expectations = page.site.map(({ path, links: hrefs, frames }) => {
		const expected = hrefs.map((href) => {
			const url = new URL(href);
			if (url.origin !== render.origin) return url.href;
			const chapter = page.chapters.get(url.pathname);
			const id = decodeURIComponent(url.hash.slice(1));
			if (chapter) return id ? `#${chapter}--${id}` : `#${chapter}`;
			if (id && url.pathname === "/") return `#${id}`;
			return new URL(`${home}${url.pathname === "/" ? "" : url.pathname}${url.search}${url.hash}`).href;
		});
		for (const frame of frames) {
			const video = /youtube(?:-nocookie)?\.com\/embed\/([\w-]+)/.exec(frame)?.[1];
			if (video) expected.push(`https://www.youtube.com/watch?v=${video}`);
		}
		return { path, expected };
	});
	const missing = expectations.flatMap(({ path, expected }) => {
		const region = new Set(page.print.regions[path]?.links ?? []);
		return expected.flatMap((target) =>
			!want.has(target) ? [`${path}: ${target} — not in the PDF`] : region.has(target) ? [] : [`${path}: ${target} — in the PDF, but not in this page's part of it`],
		);
	});
	const count = expectations.reduce((sum, { expected }) => sum + expected.length, 0);
	const menus = page.site.reduce((sum, entry) => sum + entry.menus, 0);
	check(
		"links.counterparts",
		4,
		missing.length ? "FAIL" : "PASS",
		missing.length
			? `${missing.length} links on the site have no counterpart in their part of the PDF`
			: `all ${count} links and videos on ${page.site.length} pages (${menus} of them behind a link menu) are links in the PDF, each an anchor shown in its own page's part of the print`,
		missing,
	);

	// And the other way: an address the PDF carries that no page of the site
	// links to is a link paper added — a line meant for the screen only, or
	// the other market's host.
	const linked = new Set(expectations.flatMap(({ expected }) => expected));
	const extra = [...new Set(uris.filter((link) => !URL.canParse(link.uri) || !linked.has(new URL(link.uri).href)).map((link) => `sheet ${link.page + 1}: ${link.uri}`))];
	check(
		"links.unexpected",
		4,
		extra.length ? "WARN" : "PASS",
		extra.length ? `${extra.length} addresses in the PDF are linked from no page of the site` : `every address in the PDF is linked from a page of the site`,
		extra,
	);
}

/**
 * The bookmarks (item 5): one per printed heading, each titled as its heading
 * reads. That pairing cannot see a heading paper lost, or one printed at the
 * wrong level — the page and the outline change together — so the shape of
 * the tree, how many bookmarks at each level, is also held to the one last
 * pushed (or, before any push, the last render's), and a change is reported
 * for someone to look at the tree.
 */
function checkOutline(pdf, page, check, baseline) {
	const outline = readOutline(pdf);
	const depths = {};
	for (const item of outline) depths[item.depth + 1] = (depths[item.depth + 1] ?? 0) + 1;
	page.outline = { count: outline.length, depths };
	const wrong =
		outline.length === page.headings.length
			? outline.flatMap((item, index) => (item.title === page.headings[index].title ? [] : [`bookmark ${index + 1} reads "${item.title}", its heading "${page.headings[index].title}"`]))
			: [page.unpaired ?? `the outline has ${outline.length} bookmarks and the page printed ${page.headings.length} headings`];
	check(
		"outline",
		5,
		wrong.length ? "FAIL" : "PASS",
		wrong.length
			? "the bookmarks are not the headings"
			: `${outline.length} bookmarks (${Object.entries(depths)
					.map(([depth, n]) => `${n} at level ${depth}`)
					.join(", ")}), each titled as its heading reads`,
		wrong.slice(0, 20),
	);

	const shape = (outline) => (outline ? Object.entries(outline.depths).map(([depth, n]) => `${depth}:${n}`).join(" ") : "");
	if (!baseline) {
		check("outline.shape", 5, "PASS", `no earlier outline to compare with — level:count ${shape(page.outline)}`);
		return;
	}
	const same = shape(baseline) === shape(page.outline);
	check(
		"outline.shape",
		5,
		same ? "PASS" : "WARN",
		same
			? `as many bookmarks at each level as before (level:count ${shape(page.outline)})`
			: `bookmarks per level were ${shape(baseline)} (${baseline.count}), now ${shape(page.outline)} (${outline.length}) — read the tree (SKILL §6-5): a heading lost or moved, or content that changed`,
	);
}

/** The fonts (item 6): only the site's own faces, all embedded. */
function checkFonts(pdf, check) {
	const fonts = readFonts(pdf);
	const faces = [...new Set(fonts.map((font) => font.name.replace(/^[A-Z]{6}\+/, "")))].sort();
	const stray = [...new Set(fonts.filter((font) => !FONTS.test(font.name) || !font.embedded).map((font) => `${font.name} (${font.subtype}${font.embedded ? "" : ", not embedded"})`))];
	check(
		"fonts",
		6,
		stray.length ? "FAIL" : "PASS",
		stray.length ? "a face other than the site's own is in the file — a glyph fell back to a system font" : `${faces.join(", ")}`,
		stray,
	);
}

/**
 * The content (item 7): every page the sitemap lists is in the document, and
 * every line of text and every picture each page shows is in its part of the
 * document, less the dropped chrome. A picture is compared by its file. Text
 * is compared line for line — a line as `innerText` has it, which breaks at
 * blocks and <br>s, never where the layout wraps, so the same words are the
 * same line on screen and on paper — without its spacing, and counted: a
 * line the site shows twice must be printed twice. Looking for each line
 * anywhere in the part's text instead let a short one go missing unseen
 * whenever the same characters stood inside another line: a story's title,
 * a year, "GitHub". The list of dropped chrome is itself checked: an entry
 * that matches nothing on any page no longer describes the site.
 */
function checkContent(page, check) {
	const listed = page.site.map(({ path }) => path);
	const bound = ["/", ...page.chapters.keys()];
	const unbound = [
		...listed.filter((path) => !bound.includes(path)).map((path) => `${path} is in the sitemap, not in the document`),
		...bound.filter((path) => !listed.includes(path)).map((path) => `${path} is in the document, not in the sitemap`),
	];
	check(
		"content.pages",
		7,
		unbound.length ? "FAIL" : "PASS",
		unbound.length ? "the document and the sitemap disagree about the pages" : `the home page and ${page.chapters.size} stories, as the sitemap lists them`,
		unbound,
	);

	const squash = (text) => text.replace(/\s+/g, "");
	// Each line without its spacing, how many times it is there, and as it reads.
	const counted = (text) => {
		const counts = new Map();
		for (const line of text.split("\n").map((line) => line.trim()).filter(Boolean)) {
			const key = squash(line);
			counts.set(key, { times: (counts.get(key)?.times ?? 0) + 1, line: counts.get(key)?.line ?? line });
		}
		return counts;
	};
	const lost = [];
	const pictures = [];
	let lines = 0;
	let images = 0;
	for (const { path, text, images: shown } of page.site) {
		const region = page.print.regions[path];
		if (!region) continue;
		const printed = counted(region.text);
		const whole = squash(region.text);
		for (const [key, { times, line }] of counted(text)) {
			lines += 1;
			const found = printed.get(key)?.times ?? 0;
			if (found >= times) continue;
			const where = found ? `printed ${found} of the ${times} times the site shows it` : whole.includes(key) ? "not a line of its own on paper, only inside another" : "not in the PDF";
			lost.push(`${path}: ${line.slice(0, 160)} — ${where}`);
		}
		const inPrint = new Set(region.images);
		images += shown.length;
		for (const image of shown) if (!inPrint.has(image)) pictures.push(`${path}: ${image}`);
	}
	check(
		"content.text",
		7,
		lost.length ? "FAIL" : "PASS",
		lost.length ? `${lost.length} lines on the site are not in the PDF` : `all ${lines} lines of text on ${page.site.length} pages are lines of their part of the print`,
		lost,
	);
	check(
		"content.images",
		7,
		pictures.length ? "FAIL" : "PASS",
		pictures.length
			? `${pictures.length} pictures on the site are not shown in their page's part of the print`
			: `all ${images} pictures on the site are shown in their page's part of the print (${Object.entries(page.print.regions).map(([path, region]) => `${path} ${region.images.length}`).join(", ")})`,
		pictures,
	);

	const matched = new Set(page.site.flatMap((entry) => entry.matched));
	const stale = DROPPED.filter(({ what }) => !matched.has(what)).map(({ what, selector }) => `${what} (${selector})`);
	check(
		"content.dropped",
		7,
		stale.length ? "WARN" : "PASS",
		stale.length ? "an entry of the dropped chrome matches nothing on the site — update DROPPED" : `each of the ${DROPPED.length} kinds of dropped chrome is on the site`,
		stale,
	);
}

/**
 * A PNG of every page, for the eye, and contact sheets of them — and, since
 * poppler is a second reader, what it makes of the file (item 8): its page
 * count and title must be ours, it must not complain, and every link inside
 * the document must resolve there to the sheet and height our own reader
 * found. Without poppler there is nothing to look at and no second reader,
 * and a file no one could look at is not one to push: a FAIL.
 *
 * And, from poppler's text, the line breaks (item 2): no printed line opens
 * on a closing mark, a small kana or the prolonged-sound mark, and none ends
 * on an opening bracket — the rules Japanese type is set by (禁則), which
 * the site asks of the browser (`line-break: strict`) and which a print rule
 * could undo unseen: at the size of a contact sheet the body text cannot be
 * read. Poppler's reading order keeps each printed line a line of its own.
 */
async function pageImages(file, check) {
	const pages = join(out, "pages");
	try {
		await run("pdftoppm", ["-v"]);
	} catch (error) {
		// Only a missing binary: an old poppler exits non-zero on -v.
		if (error.code === "ENOENT") {
			check("file.poppler", 8, "FAIL", "pdftoppm is not on PATH: no page images to look at, no second reader — brew install poppler (macOS) or apt install poppler-utils, then render again");
			return { pages: [], contact: [] };
		}
	}

	const complaints = [];
	const info = await run("pdfinfo", [file]);
	complaints.push(...info.stderr.split("\n").filter(Boolean));
	const field = (name) => new RegExp(`^${name}:\\s*(.*)$`, "m").exec(info.stdout)?.[1]?.trim();
	await mkdir(pages, { recursive: true });
	const rendered = await run("pdftoppm", ["-r", String(PAGE_DPI), "-png", file, join(pages, "page")], { maxBuffer: 16 * 1024 * 1024 });
	complaints.push(...rendered.stderr.split("\n").filter(Boolean));

	const names = (await readdir(pages)).filter((name) => /^page-\d+\.png$/.test(name)).sort();
	const pdf = readPdf(await readFile(file));
	const { title } = readInfo(pdf);

	// Poppler's own reading of the named destinations: `Page  [ XYZ x y zoom ] "name"`, pages counted from 1.
	const dests = await run("pdfinfo", ["-dests", file], { maxBuffer: 16 * 1024 * 1024 });
	complaints.push(...dests.stderr.split("\n").filter(Boolean));
	const theirs = new Map(
		[...dests.stdout.matchAll(/^\s*(\d+)\s+\[\s*XYZ\s+(\S+)\s+(\S+)\s+\S+\s*\]\s+"(.*)"\s*$/gm)].map((match) => [match[4], { page: Number(match[1]) - 1, y: Number(match[3]) }]),
	);
	const ours = readDests(pdf);
	const named = [...new Set(readLinks(pdf).flatMap((link) => (link.dest === undefined ? [] : [link.dest])))];
	const unresolved = named.flatMap((name) => {
		const their = theirs.get(name);
		const our = ours.get(name);
		if (!their) return [`poppler finds no destination #${name}`];
		if (!our || their.page !== our.page || Math.abs(their.y - our.y) > 1) {
			return [`poppler lands #${name} on sheet ${their.page + 1} at ${their.y}pt, our reader on sheet ${(our?.page ?? -1) + 1} at ${Math.round(our?.y ?? 0)}pt`];
		}
		return [];
	});

	const disagree = [
		...(Number(field("Pages")) === pdf.pages.length ? [] : [`poppler counts ${field("Pages")} pages`]),
		...(field("Title") === title ? [] : [`poppler reads the title as "${field("Title")}"`]),
		...(names.length === pdf.pages.length ? [] : [`pdftoppm drew ${names.length} pages`]),
		...unresolved,
	];
	const errors = complaints.filter((line) => /error/i.test(line));
	check(
		"file.poppler",
		8,
		errors.length || disagree.length ? "FAIL" : complaints.length ? "WARN" : "PASS",
		errors.length || disagree.length
			? "poppler reads the file differently"
			: complaints.length
				? "poppler read the file with warnings"
				: `poppler reads ${names.length} pages titled "${title}" without a complaint, and lands all ${named.length} destinations the links use where we do`,
		[...disagree, ...complaints.slice(0, 20)],
	);

	const text = (await run("pdftotext", ["-enc", "UTF-8", file, "-"], { maxBuffer: 64 * 1024 * 1024 })).stdout;
	const opens = /^[、。，．・：；？！ー）」』】〕ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮヵヶ々〜]/;
	const closes = /[（「『【〔]$/;
	const broken = text.split("\f").flatMap((sheet, index) =>
		sheet
			.split("\n")
			.map((line) => line.trim())
			.filter((line) => opens.test(line) || closes.test(line))
			.map((line) => `sheet ${index + 1}: ${line.slice(0, 40)}`),
	);
	check(
		"text.kinsoku",
		2,
		broken.length ? "WARN" : "PASS",
		broken.length
			? `${broken.length} printed lines open on a closing mark or small kana, or end on an opening bracket — look at those sheets full size`
			: "no printed line opens on a closing mark or small kana, or ends on an opening bracket",
		broken.slice(0, 30),
	);

	// The contact sheets: the pages in reading order, a few rows at a time,
	// each framed and numbered, so a page that is empty, dark or cut off shows
	// among its neighbours.
	const { columns, rows, tile, gap, label } = CONTACT;
	const height = Math.round((tile * A4.height) / A4.width);
	const contact = [];
	for (let first = 0; first < names.length; first += columns * rows) {
		const batch = names.slice(first, first + columns * rows);
		const lines = Math.ceil(batch.length / columns);
		const width = columns * tile + (columns + 1) * gap;
		const sheetHeight = lines * (height + label) + (lines + 1) * gap;
		const layers = [];
		let overlay = "";
		for (const [at, name] of batch.entries()) {
			const left = gap + (at % columns) * (tile + gap);
			const top = gap + Math.floor(at / columns) * (height + label + gap);
			layers.push({ input: await sharp(join(pages, name)).resize(tile, height, { fit: "fill" }).toBuffer(), left, top: top + label });
			overlay += `<text x="${left}" y="${top + label - 8}" font-family="Helvetica, Arial, sans-serif" font-size="18" fill="#111">p${first + at + 1}</text>`;
			overlay += `<rect x="${left - 0.5}" y="${top + label - 0.5}" width="${tile + 1}" height="${height + 1}" fill="none" stroke="#999"/>`;
		}
		layers.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${sheetHeight}">${overlay}</svg>`), left: 0, top: 0 });
		const name = `contact-${contact.length + 1}.png`;
		await sharp({ create: { width, height: sheetHeight, channels: 3, background: "#e9e9e9" } })
			.composite(layers)
			.png()
			.toFile(join(out, name));
		contact.push(name);
	}
	return { dpi: PAGE_DPI, pages: names.map((name) => `pages/${name}`), contact };
}

/**
 * The commit the checkout is at, and what the tree has on top of it: what a
 * --local build is made from, and so what it prints — the report files it as
 * `git` then, and as `checkout` otherwise (`renderAndCheck`). A count of
 * changed files says little on its own — the content file shows as changed
 * for any edit at all — so this market's content diff is kept as well: its
 * sha256, to tell two renders' content apart at a glance, and its changed
 * lines, to tell which edit a render carried.
 */
async function gitState() {
	try {
		const head = (await run("git", ["rev-parse", "HEAD"], { cwd: app })).stdout.trim();
		const status = (await run("git", ["status", "--porcelain"], { cwd: app })).stdout.split("\n").filter(Boolean);
		const diff = (await run("git", ["diff", "HEAD", "--", "src/content"], { cwd: app, maxBuffer: 16 * 1024 * 1024 })).stdout;
		const lines = diff.split("\n").filter((line) => /^[+-]/.test(line) && !/^(\+\+\+|---) /.test(line));
		const content = diff
			? {
					sha256: createHash("sha256").update(diff).digest("hex"),
					files: (await run("git", ["status", "--porcelain", "--", "src/content"], { cwd: app })).stdout.split("\n").filter(Boolean),
					lines: lines.slice(0, 60).map((line) => line.slice(0, 200)),
					...(lines.length > 60 ? { more: lines.length - 60 } : {}),
				}
			: null;
		return { head, dirty: status.length > 0, changes: status.length, content };
	} catch {
		return null;
	}
}

/** The checks as a table, then one line with the file and the verdict. */
function summarise(report) {
	console.log(`\nrender-pdf: ${market} — ${report.source.print} (${report.source.kind})`);
	for (const entry of report.checks) {
		console.log(`  ${entry.status.padEnd(4)}  ${String(entry.item).padStart(2)}  ${entry.id.padEnd(18)}  ${entry.summary}`);
		if (entry.status !== "PASS") for (const line of entry.detail ?? []) console.log(`${" ".repeat(32)}${line}`);
	}
	const fails = report.checks.filter((entry) => entry.status === "FAIL").length;
	const warns = report.checks.filter((entry) => entry.status === "WARN").length;
	// Chromium stamps every print with its date, so "different bytes" alone
	// says nothing: the undated hash tells an unchanged document apart.
	const same = (earlier) => (earlier.sha256 === report.sha256 ? "the same bytes" : earlier.undated === report.undated ? "the same but for its print date" : "different bytes");
	const was = report.previous ? ` (was ${report.previous.pages} pages, ${same(report.previous)})` : "";
	const size = `${(report.bytes / 1024 / 1024).toFixed(1)} MiB`;
	const sheets = `${report.images.contact.length} contact sheets`;
	console.log(
		`render-pdf: ${market} — ${report.pages} pages${was}, ${size}, sha256 ${report.sha256.slice(0, 12)} → ${display(join(out, report.file))}; ${sheets}; ${fails} FAIL, ${warns} WARN`,
	);
	// The way on names this folder: pushed without `--out`, push would read the
	// app's own pdf/, which holds some other render.
	if (fails) console.log(`render-pdf: ${market} — not pushable until every FAIL is fixed`);
	else if (report.source.kind === "url") console.log(`render-pdf: ${market} — printed off --url, which push refuses: print the file to upload live or with --local`);
	else {
		console.log(
			`render-pdf: ${market} — compare with the published file and look at the pages full size (${display(out)}/pages/, SKILL §4-4 and §4-5), finish SKILL §6's eye column, then: npm run pdf:push${options.out ? ` -- --out ${display(out)}` : ""}`,
		);
		if (report.lastPush?.undated === report.undated) {
			console.log(`render-pdf: ${market} — the same document as the one pushed at ${report.lastPush.pushedAt}, but for its print date: pushing it changes nothing else (SKILL §4-7)`);
		}
	}
}

/* ------------------------------------------------------------------ *
 * Push
 * ------------------------------------------------------------------ */

/**
 * Sends the file the last render checked to R2, and proves what the public
 * host now serves (item 9). It refuses a folder with no report, the other
 * market's folder (handed over with `--out`), a folder whose last render is
 * still running or never finished (its report is the stub `renderAndCheck`
 * starts with, and the file beside it an earlier render's), a folder another
 * push is still sending, a report with a FAIL, a render off `--url` — a dev
 * server, or whatever else was up, not the site or its build — and a file
 * whose bytes are not the ones the report was written for.
 *
 * The key is read off the link the render found, never typed: the market's
 * one approved key on the asset host, which the render already held it to.
 * The upload goes through wrangler, as push-assets.mjs's does, retried: the
 * API drops a connection now and then. From before it starts until the
 * report is written for the last time, the report names this push
 * (`pushing`), and a render refuses the folder: it would clear the file
 * wrangler reads from, and write its own report over the record of the
 * upload with the one it carried from before. Once the upload is in, the
 * push is written into the report before anything else can fail, so the
 * report never says less than R2 holds.
 *
 * Then the file is fetched back. First with a query no one has asked for
 * before (`?v=`, the start of its sha256 and the time of the push in
 * milliseconds, base 36 — the same bytes pushed twice may carry new
 * headers), which no cache holds, so the
 * answer is the object itself: its bytes, type and name must be ours. Then at
 * the plain address readers use. The edge's cache is kept per data centre
 * (colo), so that answer is one colo's: a PASS says that colo serves the new
 * file, and any other that fetched the old one may go on serving it for up
 * to its max-age. A 200 with other bytes is that — reported, not failed. Any
 * other status is a response cached before the upload, which outlives it by
 * hours: a FAIL, for the owner to purge. The plain address is only ever
 * asked for after an upload: a 404 fetched before the first one is cached at
 * the edge for hours, and the wrangler login cannot purge it.
 */
async function push(bucket) {
	const report = await readJson(join(out, REPORT));
	if (!report) throw new Error(`no ${REPORT} in ${display(out)} — render and check first: npm run pdf`);
	// Before the link is read: the other market's link names the other
	// market's key, which `downloadLink` refuses as though the content were
	// wrong, when it is the folder that is.
	if (report.market !== market) {
		throw new Error(
			`${display(join(out, REPORT))} is ${report.market ? `a render of ${report.market}` : "no render of a market"}, not of ${market} — push each market from its own app${report.market ? ` (cd apps/${report.market} && npm run pdf:push)` : ""}; nothing was pushed`,
		);
	}
	if (report.pushing && (await stillRunning(report.pushing.pid))) {
		throw new Error(`a push from ${display(out)} is already under way (pid ${report.pushing.pid}, since ${report.pushing.startedAt}) — nothing was pushed`);
	}
	if (report.rendering) {
		throw new Error(
			(await stillRunning(report.rendering.pid))
				? `a render into ${display(out)} is still running (pid ${report.rendering.pid}) — push once it has finished and its pages are reviewed; nothing was pushed`
				: `the last render into ${display(out)}, started ${report.rendering.startedAt}, did not finish — the PDF there is an earlier render's, and no report vouches for it: render again; nothing was pushed`,
		);
	}
	const fails = report.checks.filter((entry) => entry.status === "FAIL");
	if (fails.length) throw new Error(`the last render failed ${fails.map((entry) => entry.id).join(", ")} — fix it and render again; nothing was pushed`);
	if (report.source?.kind !== "live" && report.source?.kind !== "local") {
		throw new Error(`${display(join(out, REPORT))} is of a render off ${report.source?.print ?? "an unknown source"} (${report.source?.kind}) — print the file to upload live or with --local; nothing was pushed`);
	}
	let bytes;
	try {
		bytes = await readFile(join(out, report.file));
	} catch {
		throw new Error(`${report.file} is missing from ${display(out)} — render again`);
	}
	const sha256 = createHash("sha256").update(bytes).digest("hex");
	if (sha256 !== report.sha256) throw new Error(`${report.file} is not the file the report checked (sha256 ${sha256.slice(0, 12)}, report ${report.sha256.slice(0, 12)}) — render again`);

	const { key, href: url, filename } = downloadLink({ href: report.link.href, filename: report.link.filename });
	const disposition = contentDisposition(filename, basename(key));
	console.log(`render-pdf: ${market} — pushing ${report.file} (${report.pages} pages, sha256 ${sha256.slice(0, 12)}, rendered ${report.finishedAt} from ${report.source.print}) to ${bucket}/${key}`);

	report.pushing = { pid: process.pid, startedAt: new Date().toISOString() };
	await writeFile(join(out, REPORT), `${JSON.stringify(report, null, "\t")}\n`);
	const wrangler = join(dirname(createRequire(import.meta.url).resolve("wrangler/package.json")), "bin/wrangler.js");
	let attempts = 0;
	for (;;) {
		attempts += 1;
		try {
			await run(
				process.execPath,
				[
					wrangler,
					"r2",
					"object",
					"put",
					`${bucket}/${key}`,
					"--file",
					join(out, report.file),
					"--content-type",
					"application/pdf",
					"--content-disposition",
					disposition,
					"--cache-control",
					CACHE_CONTROL,
					"--remote",
				],
				{ cwd: app, maxBuffer: 16 * 1024 * 1024 },
			);
			break;
		} catch (error) {
			if (attempts === PUSH_ATTEMPTS) {
				delete report.pushing;
				await writeFile(join(out, REPORT), `${JSON.stringify(report, null, "\t")}\n`);
				throw new Error(`wrangler r2 object put failed ${attempts} times:\n${(error.stderr || error.message).trim()}`);
			}
			await new Promise((done) => setTimeout(done, 1000 * 3 ** (attempts - 1)));
		}
	}
	const pushedAt = new Date().toISOString();
	report.push = {
		bucket,
		key,
		url,
		pushedAt,
		attempts,
		sha256,
		undated: report.undated ?? null,
		pages: report.pages,
		outline: report.outline,
		headers: { "content-type": "application/pdf", "content-disposition": disposition, "cache-control": CACHE_CONTROL },
	};
	report.lastPush = report.push;
	report.remote = null;
	await writeFile(join(out, REPORT), `${JSON.stringify(report, null, "\t")}\n`);
	console.log(`render-pdf: ${market} — uploaded after ${attempts} attempt${attempts === 1 ? "" : "s"}, recorded in ${REPORT}; fetching it back`);

	const checks = [];
	const edgeAge = /max-age=(\d+)/.exec(CACHE_CONTROL)[1];
	let fresh = null;
	let plain = null;
	try {
		fresh = await fetchBack(`${url}?v=${sha256.slice(0, 12)}-${Date.parse(pushedAt).toString(36)}`);
		const savedAs = savedName(fresh.headers["content-disposition"]);
		const served = [
			...(fresh.status === 200 ? [] : [`answered ${fresh.status}`]),
			...(fresh.sha256 === sha256 ? [] : [`served bytes with sha256 ${fresh.sha256.slice(0, 12)}`]),
			...(fresh.headers["content-type"] === "application/pdf" ? [] : [`Content-Type ${fresh.headers["content-type"]}`]),
			...(/^attachment\b/i.test(fresh.headers["content-disposition"] ?? "") ? [] : [`Content-Disposition "${fresh.headers["content-disposition"] ?? ""}" does not save the file`]),
			...(savedAs === filename ? [] : [`saved as "${savedAs}", not "${filename}"`]),
		];
		checks.push({
			id: "remote.object",
			item: 9,
			status: served.length ? "FAIL" : "PASS",
			summary: served.length ? "the public host does not serve the file that was pushed" : `the object answers with our bytes, application/pdf, saved as ${savedAs}`,
			...(served.length ? { detail: served } : {}),
		});
	} catch (error) {
		checks.push({ id: "remote.object", item: 9, status: "FAIL", summary: `the file could not be fetched back: ${error.message} — it is uploaded; run npm run pdf:push again to check it` });
	}

	try {
		plain = await fetchBack(url);
		const maxAge = Number(/max-age=(\d+)/.exec(plain.headers["cache-control"] ?? "")?.[1] ?? NaN);
		const kept = Number.isNaN(maxAge) ? "its max-age" : `${maxAge}s`;
		const answered = `${plain.headers["cf-cache-status"] ?? "no cache status"}, Age ${plain.headers.age ?? "0"}, colo ${colo(plain.headers["cf-ray"])}`;
		if (plain.status !== 200) {
			checks.push({
				id: "remote.edge",
				item: 9,
				status: "FAIL",
				summary:
					`${url} answers ${plain.status} (${answered}) although the object is there — most likely a response cached before the upload, which the edge keeps ` +
					`for hours (about 4h on this zone), not ${edgeAge}s. Ask again with curl -sI in a minute; if it stays, only the owner can clear it sooner ` +
					`(Cloudflare dashboard → Caching → Purge Cache → Custom Purge, SKILL §8)`,
			});
		} else {
			checks.push({
				id: "remote.edge",
				item: 9,
				status: plain.sha256 === sha256 ? "PASS" : "WARN",
				summary:
					plain.sha256 === sha256
						? `the colo that answered ${url} (${answered}) serves the new file; another colo that fetched the old one may serve it for up to ${edgeAge}s after it did. Readers are told Cache-Control: ${plain.headers["cache-control"]}`
						: `${url} still serves an earlier copy (${answered}) — each colo lets it go within ${edgeAge}s of when it fetched it; a browser that has it may keep it for up to ${kept}`,
			});
		}
	} catch (error) {
		checks.push({ id: "remote.edge", item: 9, status: "WARN", summary: `${url} could not be fetched: ${error.message}` });
	}

	report.remote = { checkedAt: new Date().toISOString(), busted: fresh, plain, checks };
	delete report.pushing;
	await writeFile(join(out, REPORT), `${JSON.stringify(report, null, "\t")}\n`);

	console.log(`\nrender-pdf: ${market} — ${url}`);
	for (const entry of checks) {
		console.log(`  ${entry.status.padEnd(4)}  ${String(entry.item).padStart(2)}  ${entry.id.padEnd(18)}  ${entry.summary}`);
		for (const line of entry.detail ?? []) console.log(`${" ".repeat(32)}${line}`);
	}
	if (plain) {
		const answered = ["content-type", "content-disposition", "cache-control", "etag"].map((name) => `${name}: ${plain.headers[name]}`);
		console.log(`render-pdf: ${market} — served headers:\n  ${answered.join("\n  ")}`);
	}
	if (checks.some((entry) => entry.status === "FAIL")) process.exitCode = 1;
}

/** The data centre a Cloudflare response came from: the code after the ray id (`8c1f…-LAX`). */
function colo(ray) {
	return /-([A-Z]{3})$/.exec(ray ?? "")?.[1] ?? "unknown";
}

/**
 * `attachment`, the key's own name for a client that reads only `filename`,
 * and the market's name in `filename*` — UTF-8, percent-encoded as RFC 8187
 * has that parameter's value: `encodeURIComponent` leaves `'()*` as they are,
 * which RFC 8187 does not allow unencoded.
 */
function contentDisposition(filename, fallback) {
	const encoded = encodeURIComponent(filename).replace(/['()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
	return `attachment; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}

/**
 * The name a `Content-Disposition` header saves its file under: the
 * `filename*` parameter, decoded from its percent-encoding. Read back rather
 * than compared with an encoding made here, which would be the same code as
 * the one that wrote the header and pass whatever it got wrong.
 */
function savedName(disposition) {
	const value = /filename\*=UTF-8''([^;\s]+)/i.exec(disposition ?? "")?.[1];
	if (!value) return null;
	try {
		return decodeURIComponent(value);
	} catch {
		return null;
	}
}

/** One GET of the public file: its status, the headers a cache decision rests on and the colo that answered (`cf-ray`), and its bytes' sha256. */
async function fetchBack(url) {
	const response = await fetch(url, { headers: { "user-agent": "ballbot-render-pdf/1" }, signal: AbortSignal.timeout(60_000) });
	const body = Buffer.from(await response.arrayBuffer());
	const headers = {};
	for (const name of ["content-type", "content-length", "content-disposition", "cache-control", "age", "etag", "last-modified", "cf-cache-status", "cf-ray"]) {
		const value = response.headers.get(name);
		if (value !== null) headers[name] = value;
	}
	return { url, status: response.status, bytes: body.length, sha256: createHash("sha256").update(body).digest("hex"), headers };
}
