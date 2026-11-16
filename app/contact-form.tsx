"use client";

import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CONTACT_EMAIL, validateContactMessage } from "./contact-delivery";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const request = useRef<AbortController | null>(null);
  const feedback = useRef<HTMLDivElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);

  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => {
    if (status === "sent" || status === "error") feedback.current?.focus({ preventScroll: true });
  }, [status]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (request.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const data = {
      name: String(fields.get("name") ?? ""),
      email: String(fields.get("email") ?? ""),
      message: String(fields.get("message") ?? ""),
      website: String(fields.get("website") ?? ""),
    };
    const validationError = validateContactMessage(data);
    if (validationError) {
      setError(validationError);
      setStatus("error");
      return;
    }

    const controller = new AbortController();
    request.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      const result: { success?: boolean } = await response.json();
      if (!response.ok || result.success !== true) throw new Error("Message submission failed");
      form.reset();
      setStatus("sent");
    } catch (error) {
      setError(error instanceof Error && error.name === "AbortError"
        ? "The connection timed out. Please try again or email me directly."
        : "Your message couldn’t be submitted. Please try again or email me directly.");
      setStatus("error");
    } finally {
      window.clearTimeout(timeout);
      request.current = null;
    }
  };

  return (
    <form className="contact-form" action="/api/contact" method="POST" onSubmit={submit} aria-label="Contact Khushpreet Singh" aria-busy={status === "sending"}>
      <noscript><style>{`.contact-form fieldset { display: none; }`}</style><p>Please enable JavaScript to use the form, or <a href={`mailto:${CONTACT_EMAIL}`}>email me directly</a>.</p></noscript>
      <div className="contact-honeypot" aria-hidden="true" inert>
        <label htmlFor="contact-website">Leave this field empty</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset disabled={status === "sending"} hidden={status === "sent"}>
        <div className="field">
          <label className="mono" htmlFor="contact-name">Name</label>
          <input ref={nameInput} id="contact-name" name="name" type="text" placeholder="Your name" autoComplete="name" required maxLength={80} />
        </div>
        <div className="field">
          <label className="mono" htmlFor="contact-email">Email</label>
          <input id="contact-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required maxLength={254} />
        </div>
        <div className="field">
          <label className="mono" htmlFor="contact-message">Message</label>
          <textarea id="contact-message" name="message" placeholder="Tell me a little about what you have in mind…" rows={3} required minLength={10} maxLength={4000} />
        </div>
        <div className="contact-actions">
          <p>Or email me at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
          <button className="pill pill--accent" type="submit" disabled={status === "sending"}>
            {status === "sending" ? <>Sending <LoaderCircle className="spin" size={17} aria-hidden="true" /></> : <>Send message <ArrowUpRight size={17} aria-hidden="true" /></>}
          </button>
        </div>
      </fieldset>

      <div ref={feedback} className={`contact-feedback${status === "sent" ? " is-success" : ""}`} role="status" tabIndex={-1}>
        {status === "sent" && (
          <>
            <span className="contact-success-icon"><Check size={22} aria-hidden="true" /></span>
            <h3>Thank you for reaching out.</h3>
            <p>Your message has been submitted.</p>
            <button type="button" className="pill" onClick={() => { setStatus("idle"); window.requestAnimationFrame(() => nameInput.current?.focus()); }}>Send another message <ArrowUpRight size={16} aria-hidden="true" /></button>
          </>
        )}
        {status === "error" && <p className="contact-error">{error} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>}
      </div>
    </form>
  );
}
