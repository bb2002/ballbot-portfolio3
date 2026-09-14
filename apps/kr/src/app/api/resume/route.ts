import { getCloudflareContext } from "@opennextjs/cloudflare";

import { normalizeResumeRequest, validateResumeRequest } from "@ballbot/shared/lib/resume-request";

/**
 * The Resume form's endpoint. It mails the request to the site owner with
 * the visitor's address as `Reply-To`, so answering is one click and the
 * resume goes out from a real mailbox.
 *
 * Delivery rides Cloudflare's Email Sending binding. It is read off the env
 * at request time and *not* declared in wrangler.jsonc: an unbound name there
 * fails the deploy, and the site should keep going up whether or not the
 * mailbox is wired yet. Until it is bound this route answers 503, which the
 * form turns into "write to me directly" with the address beside it — the one
 * failure mode that still gets the reader what they came for.
 *
 * To turn delivery on, add to wrangler.jsonc:
 *   "send_email": [{ "name": "SEND_EMAIL" }]
 * and set RESUME_FROM to an address on a zone verified for sending.
 */
declare global {
	interface CloudflareEnv {
		/** Cloudflare Email Sending binding. Absent until it is configured. */
		SEND_EMAIL?: SendEmail;
		/** Verified sender. Must be on a zone allowed to send. */
		RESUME_FROM?: string;
		/** Inbox the request lands in. */
		RESUME_TO?: string;
	}
}

const FROM = "noreply@ballbot.dev";
const TO = "ballbot@alignnetworks.io";

function fail(error: string, status: number) {
	return Response.json({ error }, { status });
}

export async function POST(request: Request) {
	let payload: unknown;
	try {
		payload = await request.json();
	} catch {
		return fail("malformed", 400);
	}

	const { name, email } = (payload ?? {}) as Record<string, unknown>;
	if (typeof name !== "string" || typeof email !== "string") return fail("malformed", 400);

	// The browser checked this already. It is checked again because the
	// browser is not the only thing that can reach this URL.
	const invalid = validateResumeRequest({ name, email });
	if (invalid.name || invalid.email) return fail(invalid.name ?? invalid.email!, 422);

	const clean = normalizeResumeRequest({ name, email });

	let env: CloudflareEnv;
	try {
		({ env } = await getCloudflareContext({ async: true }));
	} catch {
		// No Workers runtime under this process — a plain `next build` probe, say.
		return fail("unconfigured", 503);
	}

	const mailer = env.SEND_EMAIL;
	if (!mailer) return fail("unconfigured", 503);

	try {
		await mailer.send({
			from: env.RESUME_FROM ?? FROM,
			to: env.RESUME_TO ?? TO,
			replyTo: { name: clean.name, email: clean.email },
			subject: `이력서 요청 · ${clean.name}`,
			text: `${clean.name} <${clean.email}> 님이 이력서를 요청했습니다.`,
		});
	} catch {
		return fail("undelivered", 502);
	}

	return Response.json({ ok: true });
}
