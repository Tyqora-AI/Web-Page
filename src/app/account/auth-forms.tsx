"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PasswordInput({ name, confirm = false }: { name: string; confirm?: boolean }) {
  const [visible, setVisible] = useState(false);
  return <span className="password-field">
    <input
      name={name}
      type={visible ? "text" : "password"}
      autoComplete={confirm ? "new-password" : name === "password" ? "current-password" : "new-password"}
      minLength={confirm ? undefined : 10}
      required
    />
    <button type="button" aria-label={`${visible ? "Hide" : "Show"} password`} onClick={() => setVisible(!visible)}>
      {visible ? "Hide" : "Show"}
    </button>
  </span>;
}

export function AuthForms() {
  const [tab, setTab] = useState<"signin" | "register">("signin");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const search = useSearchParams();

  function changeTab(next: "signin" | "register") {
    setTab(next);
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>, kind: "login" | "register") {
    event.preventDefault();
    setBusy(true);
    setError("");
    const body = Object.fromEntries(new FormData(event.currentTarget));
    if (kind === "register" && body.password !== body.confirmPassword) {
      setBusy(false);
      setError("Passwords do not match.");
      return;
    }
    try {
      const response = await fetch(`/api/auth/${kind}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || "The authentication service could not complete your request.");
        return;
      }
      router.push(search.get("next") || "/portal");
      router.refresh();
    } catch {
      setError("We could not reach the authentication service. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return <div className="auth-panel">
    <div className="auth-tabs" role="tablist" aria-label="Account access">
      <button role="tab" aria-selected={tab === "signin"} className={tab === "signin" ? "active" : ""} onClick={() => changeTab("signin")}>Sign in</button>
      <button role="tab" aria-selected={tab === "register"} className={tab === "register" ? "active" : ""} onClick={() => changeTab("register")}>Create account</button>
    </div>

    {tab === "signin" ? <form className="auth-form" onSubmit={(event) => submit(event, "login")}>
      <div><h2>Welcome back</h2><p>Enter your details to access the portal.</p></div>
      <label><span>Email address</span><input name="email" type="email" autoComplete="email" required/></label>
      <label><span>Password</span><PasswordInput name="password"/></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary button-large full-button" disabled={busy}>{busy ? "Signing in..." : "Sign in ->"}</button>
    </form> : <form className="auth-form" onSubmit={(event) => submit(event, "register")}>
      <div><h2>Create an account</h2><p>For healthcare professionals and partner organisations.</p></div>
      <div className="form-grid">
        <label><span>Full name</span><input name="name" autoComplete="name" required minLength={2}/></label>
        <label><span>Work email</span><input name="email" type="email" autoComplete="email" required/></label>
        <label><span>Organisation</span><input name="organization" autoComplete="organization"/></label>
        <label><span>Your role</span><select name="role"><option>Healthcare professional</option><option>Hospital administrator</option><option>Researcher</option><option>Distributor or partner</option><option>Other</option></select></label>
        <label className="form-full"><span>Password</span><PasswordInput name="password" confirm/><small>10+ characters with upper-case, lower-case and a number.</small></label>
        <label className="form-full"><span>Confirm password</span><PasswordInput name="confirmPassword" confirm/></label>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary button-large full-button" disabled={busy}>{busy ? "Creating account..." : "Create account ->"}</button>
    </form>}
  </div>;
}
