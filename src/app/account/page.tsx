import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { sessionUserId } from "@/lib/auth";
import { AuthForms } from "./auth-forms";

export const metadata: Metadata = { title: "Account access" };

export default async function AccountPage() {
  if (await sessionUserId()) redirect("/portal");

  return <main className="auth-page">
    <div className="auth-shell">
      <div className="auth-intro">
        <Link className="back-link" href="/">← Back to home</Link>
        <div>
          <div className="section-kicker light">Tyqora portal</div>
          <h1>Your clinical technology,<br/><em>all in one place.</em></h1>
          <p>Manage product requests, delivery information, and your organisation profile securely.</p>
        </div>
        <div className="auth-testimonial">
          <p>Secure by design. Passwords are strongly hashed and account sessions use protected cookies.</p>
          <span>Privacy-first account access</span>
        </div>
      </div>
      <Suspense fallback={<div className="auth-panel"><p>Loading secure account access…</p></div>}>
        <AuthForms/>
      </Suspense>
    </div>
  </main>;
}
