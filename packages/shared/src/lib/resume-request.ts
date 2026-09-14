/**
 * The one definition of a valid resume request. The form and the route
 * handler both import it, so the browser and the Worker can never disagree
 * about what counts as a name or an address.
 */

export type ResumeRequest = { name: string; email: string };

/** Long enough for any real name; short enough that the field is not a payload. */
export const NAME_MAX = 60;
/** The RFC 5321 ceiling for an address. */
export const EMAIL_MAX = 254;

/**
 * Deliberately loose. An address is only truly proven by mail reaching it, and
 * a stricter pattern rejects more real addresses than fake ones. What it does
 * guarantee is the shape the mailer needs: one `@`, a dotted domain, and no
 * whitespace — so the value can never carry a header break into the message
 * the Worker composes.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type ResumeRequestErrorCode = "name-required" | "name-too-long" | "email-required" | "email-format";

export type ResumeRequestErrors = {
	name?: ResumeRequestErrorCode;
	email?: ResumeRequestErrorCode;
};

/**
 * Trimmed, with control characters folded to spaces — the form of the input
 * that is sent and mailed. The fold is what keeps a newline pasted into the
 * name field out of the outgoing message's headers.
 */
export function normalizeResumeRequest({ name, email }: ResumeRequest): ResumeRequest {
	const strip = (value: string) => value.replace(/[\u0000-\u001f\u007f]/g, " ").trim();
	return { name: strip(name), email: strip(email) };
}

export function validateResumeRequest(input: ResumeRequest): ResumeRequestErrors {
	const { name, email } = normalizeResumeRequest(input);
	const errors: ResumeRequestErrors = {};

	if (!name) errors.name = "name-required";
	else if (name.length > NAME_MAX) errors.name = "name-too-long";

	if (!email) errors.email = "email-required";
	else if (email.length > EMAIL_MAX || !EMAIL.test(email)) errors.email = "email-format";

	return errors;
}
