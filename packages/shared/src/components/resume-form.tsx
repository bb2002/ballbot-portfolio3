"use client";

import { useEffect, useId, useRef, useState } from "react";

import type { ResumeContent } from "../content-types";
import { EMAIL_MAX, NAME_MAX, validateResumeRequest, type ResumeRequestErrorCode } from "../lib/resume-request";

/**
 * The design draws the form at rest: two fields, a filled button, a privacy
 * line. Everything else here is the rest of the state machine that resting
 * frame implies — per-field validation, an in-flight button, a confirmation
 * that replaces the fields, and a failure that hands the reader the direct
 * address rather than leaving them at a dead button.
 *
 * Field metrics come straight off the `Input Field` component in the .pen:
 * 14px medium label, 8px gap, a 52px box with a 1px border and 4px corners.
 */
const FIELD_BOX =
	"bg-bg border-border text-text-primary placeholder:text-text-placeholder h-[52px] w-full rounded-[4px] border px-4 text-[16px] transition-colors duration-200 hover:border-text-placeholder focus:border-text-strong aria-[invalid=true]:border-text-strong";

/** The 52px filled button, matching the hero's primary action on hover. */
const BUTTON =
	"bg-button-bg text-text-inverse flex h-[52px] w-full items-center justify-center rounded-[4px] text-[16px] font-bold transition-[transform,opacity] duration-300 ease-[var(--ease-smooth)] hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0 disabled:translate-y-0 disabled:cursor-progress disabled:opacity-60";

type Status = "idle" | "sending" | "sent" | "failed";

/**
 * Long enough for a cold Worker to boot and a mail API to answer, short enough
 * that the reader is not left watching a disabled button. Without it a request
 * that never resolves — a dropped connection, a proxy holding the socket open —
 * parks the form in `sending` for the rest of the visit with no way back.
 */
const SEND_TIMEOUT_MS = 15_000;

type FieldErrors = { name?: ResumeRequestErrorCode; email?: ResumeRequestErrorCode };

export function ResumeForm({ content }: { content: ResumeContent }) {
	const uid = useId();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [errors, setErrors] = useState<FieldErrors>({});
	const [status, setStatus] = useState<Status>("idle");
	const [sentTo, setSentTo] = useState("");
	const nameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const sentRef = useRef<HTMLParagraphElement>(null);

	const sending = status === "sending";

	/*
	 * The confirmation replaces the form, which takes the submit button — and
	 * with it the keyboard's place in the document — out from under the reader.
	 * Focus moves to the line that answers them, so a screen reader hears the
	 * result instead of being dropped back at the top of the page.
	 */
	useEffect(() => {
		if (status === "sent") sentRef.current?.focus();
	}, [status]);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (sending) return;

		const found = validateResumeRequest({ name, email });
		if (found.name || found.email) {
			setErrors(found);
			// Land the caret on the first field that needs fixing, so a keyboard
			// reader is not sent hunting for the message that just appeared.
			(found.name ? nameRef : emailRef).current?.focus();
			return;
		}

		setErrors({});
		setStatus("sending");

		try {
			const response = await fetch("/api/resume", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ name, email }),
				signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
			});
			if (!response.ok) throw new Error(`resume request: ${response.status}`);
			setSentTo(email.trim());
			setStatus("sent");
		} catch {
			setStatus("failed");
		}
	}

	/** Editing a field retires its message; a stale error under a fixed value reads as a bug. */
	function clear(field: keyof FieldErrors) {
		setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
		if (status === "failed") setStatus("idle");
	}

	if (status === "sent") {
		return (
			<div role="status" className="flex flex-col gap-3">
				<p ref={sentRef} tabIndex={-1} className="text-text-strong text-[20px] font-bold sm:text-[24px]">
					{content.sent.title}
				</p>
				<p className="text-text-secondary text-[15px] leading-[1.6] sm:text-[16px]">
					<span className="text-text-strong font-semibold break-all">{sentTo}</span> {content.sent.detail}
				</p>
				<button
					type="button"
					onClick={() => {
						setStatus("idle");
						setName("");
						setEmail("");
					}}
					className="group text-text-secondary hover:text-text-strong relative self-start py-2 text-[14px] font-semibold transition-colors duration-300"
				>
					{content.sent.again}
					<span
						aria-hidden="true"
						className="bg-text-strong absolute inset-x-0 bottom-1.5 h-px origin-left scale-x-0 transition-transform duration-300 ease-[var(--ease-smooth)] group-hover:scale-x-100"
					/>
				</button>
			</div>
		);
	}

	return (
		// `noValidate`: the browser's own bubbles are English, unstyled and land
		// in the wrong place — these messages are the design's.
		<form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
			<div className="flex flex-col gap-5">
				<Field
					id={`${uid}-name`}
					ref={nameRef}
					messages={content.errors}
					label={content.fields.name.label}
					placeholder={content.fields.name.placeholder}
					value={name}
					error={errors.name}
					disabled={sending}
					autoComplete="name"
					maxLength={NAME_MAX}
					onChange={(next) => {
						setName(next);
						clear("name");
					}}
				/>
				<Field
					id={`${uid}-email`}
					ref={emailRef}
					messages={content.errors}
					type="email"
					inputMode="email"
					label={content.fields.email.label}
					placeholder={content.fields.email.placeholder}
					value={email}
					error={errors.email}
					disabled={sending}
					autoComplete="email"
					maxLength={EMAIL_MAX}
					onChange={(next) => {
						setEmail(next);
						clear("email");
					}}
				/>
			</div>

			{status === "failed" ? (
				<p role="alert" className="text-text-strong text-[14px] leading-[1.6]">
					{content.errors.send}{" "}
					<a
						href={`mailto:${content.direct.address}`}
						className="border-text-strong font-semibold break-all underline-offset-4 hover:border-b"
					>
						{content.direct.address}
					</a>
				</p>
			) : null}

			<button type="submit" disabled={sending} aria-busy={sending} className={BUTTON}>
				{sending ? content.submitting : content.submit}
			</button>

			<p className="text-text-secondary text-[14px] leading-[1.6]">{content.privacy}</p>
		</form>
	);
}

type FieldProps = {
	id: string;
	ref: React.RefObject<HTMLInputElement | null>;
	label: string;
	placeholder: string;
	value: string;
	error?: ResumeRequestErrorCode;
	/** The market's wording for every code this field can raise. */
	messages: ResumeContent["errors"];
	disabled: boolean;
	type?: "text" | "email";
	inputMode?: "email";
	autoComplete: string;
	maxLength?: number;
	onChange: (value: string) => void;
};

function Field({ id, ref, label, error, messages, onChange, type = "text", ...rest }: FieldProps) {
	const errorId = `${id}-error`;
	return (
		<div className="flex flex-col gap-2">
			<label htmlFor={id} className="text-text-secondary text-[14px] font-medium">
				{label}
			</label>
			<input
				{...rest}
				id={id}
				ref={ref}
				type={type}
				aria-invalid={error ? true : undefined}
				aria-describedby={error ? errorId : undefined}
				onChange={(event) => onChange(event.target.value)}
				className={FIELD_BOX}
			/>
			{error ? (
				<p id={errorId} className="text-text-strong text-[13px]">
					{messages[error]}
				</p>
			) : null}
		</div>
	);
}
