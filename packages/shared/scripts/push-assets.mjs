/**
 * Uploads a market's `assets/` tree to the public R2 bucket.
 *
 * Screenshots, scans and recordings are not shipped inside the Worker, and not
 * committed either: the bucket behind assets.ballbot.dev holds the only copy,
 * and the content file points at it through `asset()` from @ballbot/shared.
 * `assets/` in an app is a gitignored staging tree — put a new file there, run
 * this, and drop it. Every file goes up at the same key: `assets/projects/x/01.png`
 * lands as `projects/x/01.png`, so a path is the same string on disk and in the URL.
 *
 * Run from an app directory:  node ../../packages/shared/scripts/push-assets.mjs <bucket> [dir]
 *
 * Every file is re-sent each run. The tree is a few dozen megabytes and
 * wrangler has no sync, so a diff is not worth the bookkeeping. Cache-Control
 * follows the rule `_headers` used to give the screenshots on the Worker: a
 * stable path rather than a content hash, so an hour of freshness with a week
 * of stale-while-revalidate rather than immutability.
 */
import { execFile } from "node:child_process";
import { readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);

const [bucket, dir = "assets"] = process.argv.slice(2);
if (!bucket) {
	console.error("usage: push-assets.mjs <bucket> [dir]");
	process.exit(1);
}

const CONTENT_TYPES = {
	".avif": "image/avif",
	".gif": "image/gif",
	".jpeg": "image/jpeg",
	".jpg": "image/jpeg",
	".png": "image/png",
	".svg": "image/svg+xml",
	".webp": "image/webp",
	".mp4": "video/mp4",
	".webm": "video/webm",
};
const CACHE_CONTROL = "public,max-age=3600,stale-while-revalidate=604800";
const CONCURRENCY = 2;
/** Attempts per file. The API drops a connection now and then; a second try almost always lands. */
const ATTEMPTS = 4;

// wrangler is hoisted to the workspace root; run its entry point directly
// rather than through npx, which costs a lookup per file and a `.cmd` on Windows.
// The package does not export its bin, so it is found from the manifest instead.
const wrangler = join(dirname(createRequire(import.meta.url).resolve("wrangler/package.json")), "bin/wrangler.js");

async function walk(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		if (entry.name.startsWith(".")) continue;
		const path = join(directory, entry.name);
		if (entry.isDirectory()) files.push(...(await walk(path)));
		else files.push(path);
	}
	return files;
}

const root = resolve(process.cwd(), dir);
const files = (await walk(root)).sort();

const unknown = files.filter((file) => !(extname(file).toLowerCase() in CONTENT_TYPES));
if (unknown.length) {
	console.error(`push-assets: no content type for:\n  ${unknown.join("\n  ")}`);
	process.exit(1);
}

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

async function put(file) {
	const key = relative(root, file).split(sep).join("/");
	for (let attempt = 1; ; attempt += 1) {
		try {
			await upload(key, file);
			break;
		} catch (error) {
			if (attempt === ATTEMPTS) throw error;
			await sleep(1000 * 3 ** (attempt - 1));
		}
	}
	console.log(key);
}

async function upload(key, file) {
	await run(process.execPath, [
		wrangler,
		"r2",
		"object",
		"put",
		`${bucket}/${key}`,
		"--file",
		file,
		"--content-type",
		CONTENT_TYPES[extname(file).toLowerCase()],
		"--cache-control",
		CACHE_CONTROL,
		"--remote",
		"--force",
	]);
}

const queue = [...files];
let failed = 0;
await Promise.all(
	Array.from({ length: CONCURRENCY }, async () => {
		for (let file = queue.shift(); file; file = queue.shift()) {
			try {
				await put(file);
			} catch (error) {
				failed += 1;
				console.error(`FAILED ${relative(root, file)}\n${error.stderr ?? error.message}`);
			}
		}
	}),
);

console.log(`\n${files.length - failed}/${files.length} uploaded to ${bucket}`);
if (failed) process.exit(1);
