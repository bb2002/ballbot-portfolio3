/**
 * The form and the Worker share this module, so a change here silently changes
 * what both of them accept. The two properties worth pinning are the ones the
 * comments in it promise: that the fold neutralises a header break pasted into
 * a field, and that a loose pattern is still a pattern.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import {
	EMAIL_MAX,
	NAME_MAX,
	normalizeResumeRequest,
	validateResumeRequest,
	type ResumeRequest,
} from "./resume-request.ts";

const ok: ResumeRequest = { name: "김이름", email: "reader@example.com" };

test("a valid request raises nothing", () => {
	assert.deepEqual(validateResumeRequest(ok), {});
});

test("normalize trims and folds every control character to a space", () => {
	const folded = normalizeResumeRequest({
		name: "  Bcc: evil@example.com\r\nSubject: x  ",
		email: "\treader@example.com\n",
	});
	// The property the mailer depends on: nothing left that can open a header.
	assert.doesNotMatch(folded.name, /[\r\n]/);
	assert.equal(folded.email, "reader@example.com");
	assert.equal(folded.name, "Bcc: evil@example.com  Subject: x");
});

test("a name that is only whitespace is no name", () => {
	assert.equal(validateResumeRequest({ ...ok, name: "   " }).name, "name-required");
	assert.equal(validateResumeRequest({ ...ok, name: "\n\t" }).name, "name-required");
});

test("the name ceiling is measured after the trim", () => {
	assert.equal(validateResumeRequest({ ...ok, name: "a".repeat(NAME_MAX) }).name, undefined);
	assert.equal(validateResumeRequest({ ...ok, name: "a".repeat(NAME_MAX + 1) }).name, "name-too-long");
	assert.equal(validateResumeRequest({ ...ok, name: ` ${"a".repeat(NAME_MAX)} ` }).name, undefined);
});

test("an address needs one @ and a dotted domain, and nothing more", () => {
	for (const email of ["a@b.co", "first.last+tag@sub.example.co.kr", "ユーザー@例え.jp"]) {
		assert.equal(validateResumeRequest({ ...ok, email }).email, undefined, email);
	}
	for (const email of ["", "   ", "reader", "reader@", "@example.com", "a@b", "a b@c.co", "a@b.c"]) {
		assert.ok(validateResumeRequest({ ...ok, email }).email, `accepted ${JSON.stringify(email)}`);
	}
});

test("an address that clears the RFC ceiling is a format error, not a crash", () => {
	const long = `${"a".repeat(EMAIL_MAX)}@example.com`;
	assert.equal(validateResumeRequest({ ...ok, email: long }).email, "email-format");
});

test("an empty address is reported as missing rather than malformed", () => {
	assert.equal(validateResumeRequest({ ...ok, email: "  " }).email, "email-required");
});

test("both fields are reported at once, so the form can mark both", () => {
	assert.deepEqual(validateResumeRequest({ name: "", email: "" }), {
		name: "name-required",
		email: "email-required",
	});
});
