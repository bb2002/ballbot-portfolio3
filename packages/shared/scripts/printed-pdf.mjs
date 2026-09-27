/**
 * What render-pdf.mjs reads out of the PDF Chromium prints, the few things it
 * corrects in it, and what its checks read back out of the finished file: the
 * document's title, every link and where it lands, the bookmarks, the fonts,
 * how full each sheet is, and whether the file holds together at all.
 *
 * Chromium (Skia) writes a plain file: every object at the top level, one
 * classic cross-reference table, the page content deflated. That is the only
 * shape read here, and a file of any other shape is refused rather than
 * misread — Playwright is pinned, and the Chromium that writes these with it.
 *
 * A correction is written the way PDF lets a file be edited without being
 * rewritten: an incremental update. The objects that change are appended
 * after the end of the file with a cross-reference section of their own
 * that points back to the original one, and a reader takes the newest copy
 * of each object. The pages themselves are never touched.
 */
import { inflateSync } from "node:zlib";

/** `/Key n 0 R` in a dictionary: the object number it refers to. */
function ref(dict, key) {
	const match = new RegExp(`/${key}\\s+(\\d+)\\s+\\d+\\s+R`).exec(dict);
	return match ? Number(match[1]) : undefined;
}

function refs(list) {
	return [...list.matchAll(/(\d+)\s+\d+\s+R/g)].map((match) => Number(match[1]));
}

/** The file's objects, its catalog and its pages, in order. */
export function readPdf(bytes) {
	const text = bytes.toString("latin1");
	const tail = /startxref\s+(\d+)\s+%%EOF\s*$/.exec(text);
	const xref = tail ? Number(tail[1]) : -1;
	if (!text.startsWith("xref", xref)) {
		throw new Error("the PDF has no classic cross-reference table at its end — Chromium's output has changed shape");
	}

	// Subsections of `first count`, each followed by one `offset generation n|f`
	// row per object from `first` on. A file that was updated since carries a
	// section per update, newest last, each pointing back to the one before
	// (`/Prev`): an object's newest row is the one that counts.
	const offsets = new Map();
	const seen = new Set();
	let trailer;
	for (let at = xref; at >= 0; ) {
		if (!text.startsWith("xref", at)) throw new Error("a cross-reference section of the PDF is not where its trailer says");
		const trailerAt = text.indexOf("trailer", at);
		let number = 0;
		for (const line of text.slice(at + 4, trailerAt).trim().split(/\s*\n\s*/)) {
			const [offset, , kind] = line.split(/\s+/);
			if (kind === undefined) {
				number = Number(offset);
				continue;
			}
			if (!seen.has(number) && kind === "n") offsets.set(number, Number(offset));
			seen.add(number);
			number += 1;
		}
		const dict = /<<([\s\S]*?)>>/.exec(text.slice(trailerAt))?.[1] ?? "";
		trailer ??= dict;
		at = Number(/\/Prev\s+(\d+)/.exec(dict)?.[1] ?? -1);
	}

	/**
	 * One object: its dictionary (or value) and, for a stream, its bytes as
	 * stored and the offset they end at — where `endstream` should follow.
	 */
	const object = (n) => {
		const at = offsets.get(n);
		const head = /(\d+)\s+\d+\s+obj\s*/y;
		head.lastIndex = at ?? -1;
		const found = at === undefined ? null : head.exec(text);
		if (!found || Number(found[1]) !== n) throw new Error(`object ${n} is not where the PDF's table puts it`);
		const end = /stream\r?\n|endobj/g;
		end.lastIndex = head.lastIndex;
		const close = end.exec(text);
		if (!close) throw new Error(`object ${n} never ends`);
		const dict = text.slice(head.lastIndex, close.index).trim();
		if (close[0] === "endobj") return { dict };
		const length = Number(/\/Length\s+(\d+)(?!\s+\d+\s+R)/.exec(dict)?.[1]);
		const start = close.index + close[0].length;
		return { dict, data: bytes.subarray(start, start + length), end: start + length };
	};

	const root = ref(trailer, "Root");
	if (root === undefined) throw new Error("the PDF's trailer names no catalog");
	const catalog = object(root).dict;

	const pages = [];
	const walk = (n) => {
		const node = object(n).dict;
		if (/\/Type\s*\/Pages\b/.test(node)) for (const kid of refs(/\/Kids\s*\[([^\]]*)\]/.exec(node)?.[1] ?? "")) walk(kid);
		else pages.push(n);
	};
	walk(ref(catalog, "Pages"));

	/** A page's width and height in points, off its MediaBox. */
	const size = (index) => {
		const box = /\/MediaBox\s*\[\s*([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s*\]/.exec(object(pages[index]).dict);
		if (!box) throw new Error(`page ${index + 1} carries no MediaBox of its own`);
		return { width: Number(box[3]) - Number(box[1]), height: Number(box[4]) - Number(box[2]) };
	};
	const height = (index) => size(index).height;

	/** A page's drawing, inflated: every content stream it lists, in order. */
	const content = (index) => {
		const dict = object(pages[index]).dict;
		const list = /\/Contents\s*(\[[^\]]*\]|\d+\s+\d+\s+R)/.exec(dict)?.[1] ?? "";
		return refs(list)
			.map((n) => {
				const { dict: stream, data } = object(n);
				return (/\/FlateDecode/.test(stream) ? inflateSync(data) : data).toString("latin1");
			})
			.join("\n");
	};

	/** Every object the newest cross-reference rows list as in use, in number order. */
	const objects = [...offsets.keys()].sort((a, b) => a - b);

	return { bytes, text, xref, trailer, catalog, pages, objects, object, size, height, content };
}

/**
 * What a reader would trip over in the file, as a list of problems — empty
 * when it holds together: every object the table lists opens where it says
 * with its own number, every stream is exactly as long as it claims and
 * deflates if it says it is deflated, the trailer counts every object, and
 * every page has a size and a drawing. The check a second reader makes when
 * it opens the file, done here so a file that only opens after a repair is
 * never pushed.
 */
export function checkStructure(pdf) {
	const problems = [];
	const size = Number(/\/Size\s+(\d+)/.exec(pdf.trailer)?.[1] ?? NaN);
	if (!(size > pdf.objects.at(-1))) problems.push(`the trailer's /Size ${size} does not count object ${pdf.objects.at(-1)}`);
	if (!/\/Type\s*\/Catalog\b/.test(pdf.catalog)) problems.push("the trailer's /Root is not a catalog");
	for (const n of pdf.objects) {
		let object;
		try {
			object = pdf.object(n);
		} catch (error) {
			problems.push(error.message);
			continue;
		}
		if (!object.data) continue;
		if (Number.isNaN(object.end) || !/^\s*endstream/.test(pdf.text.slice(object.end, object.end + 12))) {
			problems.push(`object ${n}'s stream does not end where its /Length says`);
			continue;
		}
		if (/\/Filter\s*\/FlateDecode\b/.test(object.dict)) {
			try {
				inflateSync(object.data);
			} catch {
				problems.push(`object ${n}'s stream does not inflate`);
			}
		}
	}
	for (const [index, n] of pdf.pages.entries()) {
		try {
			const { width, height } = pdf.size(index);
			if (!(width > 0 && height > 0)) problems.push(`page ${index + 1} has no area`);
			if (!/\/Contents\b/.test(pdf.object(n).dict)) problems.push(`page ${index + 1} has no drawing`);
		} catch (error) {
			problems.push(error.message);
		}
	}
	return problems;
}

/** The document information dictionary: the title a viewer shows, and who wrote the file. */
export function readInfo(pdf) {
	const n = ref(pdf.trailer, "Info");
	if (n === undefined) return {};
	const { dict } = pdf.object(n);
	const field = (key) => {
		const token = stringAfter(dict, key);
		return token === undefined ? undefined : decodeString(token);
	};
	return { title: field("Title"), creator: field("Creator"), producer: field("Producer") };
}

/**
 * A PDF string — `(literal)`, whose parentheses nest and can be escaped, or
 * `<hex>` — that follows `/key` in a dictionary, as written; undefined when
 * the key is absent or holds something else.
 */
function stringAfter(dict, key) {
	const found = new RegExp(`/${key}\\s*([(<])`).exec(dict);
	if (!found) return undefined;
	const start = found.index + found[0].length - 1;
	if (found[1] === "<") {
		const end = dict.indexOf(">", start);
		return end < 0 ? undefined : dict.slice(start, end + 1);
	}
	let depth = 0;
	for (let i = start; i < dict.length; i++) {
		if (dict[i] === "\\") i++;
		else if (dict[i] === "(") depth++;
		else if (dict[i] === ")" && --depth === 0) return dict.slice(start, i + 1);
	}
	return undefined;
}

/** A PDF name's characters, its `#xx` escapes read back to bytes and those as UTF-8. */
function decodeName(name) {
	return Buffer.from(name.replace(/#([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16))), "latin1").toString("utf8");
}

const NAME = "/([^\\s/<>[\\]()]*)";
const XYZ = "\\[\\s*(\\d+)\\s+\\d+\\s+R\\s*/XYZ\\s+([-\\d.]+|null)\\s+([-\\d.]+|null)\\s+([-\\d.]+|null)\\s*\\]";

/**
 * The named destinations — every place a link inside the document can land —
 * by name, each with the sheet (0-based) and the point on it, in points from
 * the foot of the sheet as PDF measures. Chromium names each after the id of
 * the element it marks.
 */
export function readDests(pdf) {
	const dests = new Map();
	const n = ref(pdf.catalog, "Dests");
	if (n === undefined) return dests;
	for (const match of pdf.object(n).dict.matchAll(new RegExp(`${NAME}\\s*${XYZ}`, "g"))) {
		dests.set(decodeName(match[1]), { page: pdf.pages.indexOf(Number(match[2])), x: Number(match[3]), y: Number(match[4]) });
	}
	return dests;
}

/**
 * Every link annotation, sheet by sheet: the area it covers and either the
 * address it opens (`uri`) or the named destination it goes to (`dest`). A
 * link Chromium wrote in any other form comes back with neither, and fails
 * whatever check reads it.
 */
export function readLinks(pdf) {
	const links = [];
	for (const [index, n] of pdf.pages.entries()) {
		const list = /\/Annots\s*(\[[^\]]*\]|(\d+)\s+\d+\s+R)/.exec(pdf.object(n).dict);
		if (!list) continue;
		for (const a of refs(list[2] ? pdf.object(Number(list[2])).dict : list[1])) {
			const { dict } = pdf.object(a);
			if (!/\/Subtype\s*\/Link\b/.test(dict)) continue;
			const rect = (/\/Rect\s*\[([^\]]*)\]/.exec(dict)?.[1] ?? "").trim().split(/\s+/).map(Number);
			const uri = /\/S\s*\/URI\b/.test(dict) ? stringAfter(dict, "URI") : undefined;
			const named = new RegExp(`/(?:Dest|D)\\s*${NAME}`).exec(dict)?.[1];
			const quoted = named === undefined ? stringAfter(dict, "Dest") : undefined;
			links.push({
				page: index,
				rect,
				uri: uri === undefined ? undefined : decodeString(uri),
				dest: named !== undefined ? decodeName(named) : quoted !== undefined ? decodeString(quoted) : undefined,
			});
		}
	}
	return links;
}

/**
 * Every font the file carries, once each: the name it is embedded under (a
 * subset tag, `ABCDEF+`, then the face), its kind, and whether its glyphs are
 * in the file. A Type 3 font draws its glyphs itself; any other is embedded
 * only when its descriptor carries the font program.
 */
export function readFonts(pdf) {
	const fonts = [];
	for (const n of pdf.objects) {
		const { dict } = pdf.object(n);
		if (!/\/Type\s*\/Font(?![A-Za-z])/.test(dict)) continue;
		const subtype = /\/Subtype\s*\/(\w+)/.exec(dict)?.[1] ?? "";
		// A composite font's descendant: listed under the Type 0 font it belongs to.
		if (subtype.startsWith("CIDFontType")) continue;
		let descriptor = ref(dict, "FontDescriptor");
		if (subtype === "Type0") {
			const descendant = refs(/\/DescendantFonts\s*\[([^\]]*)\]/.exec(dict)?.[1] ?? "")[0];
			descriptor = descendant === undefined ? undefined : ref(pdf.object(descendant).dict, "FontDescriptor");
		}
		const described = descriptor === undefined ? "" : pdf.object(descriptor).dict;
		const name = new RegExp(`/BaseFont\\s*${NAME}`).exec(dict)?.[1] ?? new RegExp(`/FontName\\s*${NAME}`).exec(described)?.[1] ?? "";
		fonts.push({ n, name: decodeName(name), subtype, embedded: subtype === "Type3" || /\/FontFile[23]?\s+\d+\s+\d+\s+R/.test(described) });
	}
	return fonts;
}

/**
 * Appends `changed` (object number → its new dictionary) to the file as an
 * incremental update. Written in ASCII only, so a character is a byte and
 * the offsets in the new table are exact.
 */
export function amendPdf(pdf, changed) {
	if (!changed.size) return pdf.bytes;
	const { bytes } = pdf;
	let out = bytes[bytes.length - 1] === 0x0a ? "" : "\n";
	const written = [];
	for (const [n, dict] of [...changed].sort(([a], [b]) => a - b)) {
		if (/[^\x00-\x7f]/.test(dict)) throw new Error(`object ${n} would be written with a byte outside ASCII`);
		written.push([n, bytes.length + out.length]);
		out += `${n} 0 obj\n${dict}\nendobj\n`;
	}
	const xref = bytes.length + out.length;
	out += "xref\n";
	for (const [n, at] of written) out += `${n} 1\n${String(at).padStart(10, "0")} 00000 n \n`;
	const trailer = pdf.trailer.replace(/\/Prev\s+\d+/, "").trim();
	out += `trailer\n<<${trailer}\n/Prev ${pdf.xref}>>\nstartxref\n${xref}\n%%EOF\n`;
	return Buffer.concat([bytes, Buffer.from(out, "latin1")]);
}

/** A number as the file writes one: short, and never in exponent form. */
function num(value) {
	return String(Math.round(value * 1000) / 1000);
}

/**
 * The named destinations — where every link inside the document lands — set
 * to where their targets are on paper. Chromium writes them in the layout's
 * own units, as if the page were printed at full size from the top of the
 * sheet: it applies neither the print `scale` nor the sheet's top margin, so
 * a target low on a sheet was sent below itself and its heading scrolled out
 * of view, while the bookmarks, which it places another way, land true.
 * `margin(index)` is the top margin of that sheet, in points.
 */
export function placeDestinations(pdf, { scale, margin }, changed) {
	const n = ref(pdf.catalog, "Dests");
	if (n === undefined) return 0;
	let count = 0;
	const dict = pdf.object(n).dict.replace(
		/\[(\d+)\s+0\s+R\s*\/XYZ\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s*\]/g,
		(whole, page, x, y, zoom) => {
			const index = pdf.pages.indexOf(Number(page));
			if (index < 0) return whole;
			const height = pdf.height(index);
			count += 1;
			return `[${page} 0 R /XYZ ${num(Number(x) * scale)} ${num(height - (margin(index) + (height - Number(y)) * scale))} ${zoom}]`;
		},
	);
	changed.set(n, dict);
	return count;
}

/** A PDF text string — `(literal)` or `<hex>` — as the text it holds. */
function decodeString(token) {
	let bytes;
	if (token.startsWith("<")) {
		bytes = Buffer.from(token.slice(1, -1).replace(/\s+/g, ""), "hex");
	} else {
		const escapes = { n: "\n", r: "\r", t: "\t", b: "\b", f: "\f" };
		const body = token
			.slice(1, -1)
			.replace(/\\(\r?\n|[0-7]{1,3}|.)/g, (_, code) =>
				/^\r?\n$/.test(code) ? "" : /^[0-7]/.test(code) ? String.fromCharCode(parseInt(code, 8)) : (escapes[code] ?? code),
			);
		bytes = Buffer.from(body, "latin1");
	}
	if (bytes[0] === 0xfe && bytes[1] === 0xff) return bytes.subarray(2).swap16().toString("utf16le");
	return bytes.toString("latin1");
}

/** Text as a PDF string that holds any character: UTF-16 with its byte-order mark, in hex. */
function encodeString(text) {
	return `<FEFF${Buffer.from(text, "utf16le").swap16().toString("hex").toUpperCase()}>`;
}

const TITLE = /\/Title\s*(<[0-9A-Fa-f\s]*>|\((?:\\[\s\S]|[^\\)])*\))/;

/** The bookmarks, in reading order, each with its depth, the sheet it opens and the height on it (from the foot, in points). */
export function readOutline(pdf) {
	const items = [];
	const walk = (first, depth) => {
		for (let n = first; n !== undefined; ) {
			const { dict } = pdf.object(n);
			const token = TITLE.exec(dict)?.[1];
			const dest = new RegExp(`/Dest\\s*${XYZ}`).exec(dict);
			items.push({
				n,
				dict,
				depth,
				title: token ? decodeString(token) : "",
				page: dest ? pdf.pages.indexOf(Number(dest[1])) : -1,
				y: dest ? Number(dest[3]) : NaN,
			});
			walk(ref(dict, "First"), depth + 1);
			n = ref(dict, "Next");
		}
	};
	const root = ref(pdf.catalog, "Outlines");
	if (root !== undefined) walk(ref(pdf.object(root).dict, "First"), 0);
	return items;
}

/**
 * The bookmarks retitled. Chromium builds each one from its heading's text
 * as laid out, line by line and run together: the space where a line ends is
 * lost — at a written break and at a wrap alike ("Builder’sCamp") — and a
 * ruby's reading is read into the word it sits over. The page hands over the
 * headings it printed, each as Chromium sees it (`raw`) and as it reads
 * (`title`), and they replace the bookmarks one for one — but only when every
 * bookmark is the heading it is paired with, letters for letters; otherwise
 * the titles stay as Chromium wrote them and the reason is returned.
 */
export function retitleOutline(pdf, headings, changed) {
	const items = readOutline(pdf);
	const letters = (text) => text.replace(/\s+/g, "");
	if (items.length !== headings.length) {
		return `the outline has ${items.length} bookmarks and the page printed ${headings.length} headings`;
	}
	const stray = items.findIndex((item, at) => letters(item.title) !== letters(headings[at].raw));
	if (stray >= 0) return `bookmark ${stray + 1} reads "${items[stray].title}", its heading "${headings[stray].raw}"`;
	for (const [at, item] of items.entries()) {
		if (item.title === headings[at].title) continue;
		changed.set(item.n, item.dict.replace(TITLE, () => `/Title ${encodeString(headings[at].title)}`));
	}
	return null;
}

const IDENTITY = [1, 0, 0, 1, 0, 0];

function multiply(m, n) {
	return [
		m[0] * n[0] + m[1] * n[2],
		m[0] * n[1] + m[1] * n[3],
		m[2] * n[0] + m[3] * n[2],
		m[2] * n[1] + m[3] * n[3],
		m[4] * n[0] + m[5] * n[2] + n[4],
		m[4] * n[1] + m[5] * n[3] + n[5],
	];
}

function apply(m, x, y) {
	return [x * m[0] + y * m[2] + m[4], x * m[1] + y * m[3] + m[5]];
}

/** Numbers, names, strings, brackets and operators, in the order a content stream gives them. */
function* tokens(stream) {
	const token = /\s*(?:%[^\r\n]*|(<<|>>|\[|\]|<[0-9A-Fa-f\s]*>|\/[^\s()<>[\]{}/%]*|[-+]?(?:\d+\.?\d*|\.\d+)|[^\s()<>[\]{}/%]+)|(\())/y;
	while (token.lastIndex < stream.length) {
		const at = token.lastIndex;
		const match = token.exec(stream);
		if (!match) {
			token.lastIndex = at + 1;
			continue;
		}
		if (match[1] !== undefined) {
			yield match[1];
			continue;
		}
		if (match[2] === undefined) continue;
		// A literal string: balanced parentheses, backslash escapes. Its text is
		// not needed, only its end.
		let depth = 1;
		let i = token.lastIndex;
		for (; i < stream.length && depth; i++) {
			if (stream[i] === "\\") i++;
			else if (stream[i] === "(") depth++;
			else if (stream[i] === ")") depth--;
		}
		token.lastIndex = i;
		yield "()";
	}
}

/**
 * How much of each sheet is drawn on: the top and bottom of what it carries,
 * in points from the top of the sheet, the number of text lines, and the
 * number of pictures. Read off the drawing itself — the text, the pictures
 * and every painted shape but a white one (the page's own ground) — and
 * nothing outside `box(index)`, the sheet's content box, so the folio in the
 * foot margin does not count. The foot margin is read on its own: `foot` is
 * the number of text lines set there, which is the folio and nothing else.
 *
 * And what the sheet ends on: `last` is the lowest thing drawn in the box —
 * its kind (`text`, `picture` or `shape`), its size — and `above` is the
 * lowest point of everything drawn over it, so a hairline left alone at the
 * foot of a sheet, with the block it belonged to gone over to the next one,
 * can be told from a rule that closes the text just above it.
 */
export function measureSheets(pdf, box) {
	return pdf.pages.map((_, index) => {
		const height = pdf.height(index);
		const { width } = pdf.size(index);
		const { top: boxTop, bottom: boxBottom } = box(index, height);
		let state = { ctm: IDENTITY, white: false };
		const saved = [];
		let operands = [];
		let path = [];
		let tm = IDENTITY;
		let lm = IDENTITY;
		let leading = 0;
		let size = 0;
		let top = Infinity;
		let bottom = -Infinity;
		let pictures = 0;
		const lines = new Set();
		const foot = new Set();
		const marks = [];

		const mark = (points, kind) => {
			const ys = points.map(([, y]) => height - y);
			const xs = points.map(([x]) => x);
			const markTop = Math.min(...ys);
			const markBottom = Math.max(...ys);
			if (markBottom < boxTop || markTop > boxBottom) return false;
			top = Math.min(top, markTop);
			bottom = Math.max(bottom, markBottom);
			marks.push({ kind, top: markTop, bottom: markBottom, width: Math.max(...xs) - Math.min(...xs) });
			return true;
		};
		const text = () => {
			const m = multiply(tm, state.ctm);
			const em = size * Math.hypot(m[2], m[3]);
			const [, y] = apply(m, 0, 0);
			if (height - y > boxBottom) foot.add(Math.round(height - y));
			else if (mark([[0, y + em * 0.8], [0, y - em * 0.2]], "text")) lines.add(Math.round(height - y));
		};
		const moveLine = (x, y) => {
			lm = multiply([1, 0, 0, 1, x, y], lm);
			tm = lm;
		};

		for (const token of tokens(pdf.content(index))) {
			if (/^[-+.\d]/.test(token) || token.startsWith("/") || token.startsWith("<") || token === "()" || token === "[" || token === "]" || token === "<<" || token === ">>") {
				operands.push(token);
				continue;
			}
			const n = operands.map(Number);
			switch (token) {
				case "q":
					saved.push(state);
					break;
				case "Q":
					state = saved.pop() ?? state;
					break;
				case "cm":
					state = { ...state, ctm: multiply(n, state.ctm) };
					break;
				case "rg":
					state = { ...state, white: n.every((value) => value >= 0.99) };
					break;
				case "g":
					state = { ...state, white: n[0] >= 0.99 };
					break;
				case "k":
					state = { ...state, white: n.every((value) => value <= 0.01) };
					break;
				case "BT":
					tm = lm = IDENTITY;
					break;
				case "Tf":
					size = n[1];
					break;
				case "TL":
					leading = n[0];
					break;
				case "Tm":
					tm = lm = n;
					break;
				case "Td":
					moveLine(n[0], n[1]);
					break;
				case "TD":
					leading = -n[1];
					moveLine(n[0], n[1]);
					break;
				case "T*":
					moveLine(0, -leading);
					break;
				case "'":
				case '"':
					moveLine(0, -leading);
					text();
					break;
				case "Tj":
				case "TJ":
					text();
					break;
				case "Do":
					if (mark([apply(state.ctm, 0, 0), apply(state.ctm, 1, 0), apply(state.ctm, 0, 1), apply(state.ctm, 1, 1)], "picture")) pictures += 1;
					break;
				case "m":
				case "l":
					path.push(apply(state.ctm, n[0], n[1]));
					break;
				case "c":
					path.push(apply(state.ctm, n[0], n[1]), apply(state.ctm, n[2], n[3]), apply(state.ctm, n[4], n[5]));
					break;
				case "v":
				case "y":
					path.push(apply(state.ctm, n[0], n[1]), apply(state.ctm, n[2], n[3]));
					break;
				case "re":
					path.push(
						apply(state.ctm, n[0], n[1]),
						apply(state.ctm, n[0] + n[2], n[1]),
						apply(state.ctm, n[0], n[1] + n[3]),
						apply(state.ctm, n[0] + n[2], n[1] + n[3]),
					);
					break;
				case "f":
				case "F":
				case "f*":
					if (!state.white && path.length) mark(path, "shape");
					path = [];
					break;
				case "S":
				case "s":
				case "B":
				case "B*":
				case "b":
				case "b*":
					if (path.length) mark(path, "shape");
					path = [];
					break;
				case "n":
					path = [];
					break;
			}
			operands = [];
		}

		const lowest = marks.reduce((low, mark) => (!low || mark.bottom > low.bottom ? mark : low), null);
		const above = lowest ? marks.reduce((at, mark) => (mark.bottom < lowest.top - 0.5 ? Math.max(at, mark.bottom) : at), -Infinity) : -Infinity;
		return {
			top: Number.isFinite(top) ? top : null,
			bottom: Number.isFinite(bottom) ? bottom : null,
			lines: lines.size,
			pictures,
			foot: foot.size,
			last: lowest && { kind: lowest.kind, height: lowest.bottom - lowest.top, width: lowest.width, share: lowest.width / width },
			above: Number.isFinite(above) ? above : null,
			box: { top: boxTop, bottom: boxBottom },
		};
	});
}
