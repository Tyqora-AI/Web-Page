"use client";

import { FormEvent, useState } from "react";

export function InquiryForm() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setStatus("");
    const form = event.currentTarget;
    const response = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    const data = await response.json(); setBusy(false);
    if (response.ok) { form.reset(); setStatus("Thank you. Our team will be in touch."); } else setStatus(data.error || "Please try again.");
  }
  return <form className="contact-form" onSubmit={submit}>
    <label><span>Name</span><input name="name" autoComplete="name" required placeholder="Your name"/></label>
    <label><span>Work email</span><input name="email" type="email" autoComplete="email" required placeholder="you@organisation.com"/></label>
    <label className="full"><span>Organisation <small>(optional)</small></span><input name="organization" autoComplete="organization" placeholder="Hospital or organisation"/></label>
    <label className="full"><span>How can we help?</span><textarea name="message" required minLength={10} placeholder="Tell us a little about your interest"/></label>
    <button className="button button-primary full" disabled={busy}>{busy ? "Sending…" : "Start a conversation →"}</button>
    {status && <p className="form-status full" role="status">{status}</p>}
  </form>;
}
