"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Account = { name: string; country: string };
type AccountState = "loading" | "ready" | "error";

export function CheckoutForm() {
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState<Account | null>(null);
  const [accountState, setAccountState] = useState<AccountState>("loading");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const idempotencyKey = useRef<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    Promise.resolve().then(() => setQuantity(Math.max(1, Math.min(20, Number(sessionStorage.getItem("tyqora_quantity") || 1)))));
    const controller = new AbortController();
    async function loadAccount() {
      try {
        const response = await fetch("/api/auth/me", { signal: controller.signal });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          setError(data.error || "We could not verify your account. Please try again.");
          setAccountState("error");
          return;
        }
        if (!data.user) {
          router.replace("/account?next=/checkout");
          return;
        }
        setUser(data.user);
        setAccountState("ready");
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError("We could not reach the account service. Check your connection and try again.");
        setAccountState("error");
      }
    }
    void loadAccount();
    return () => controller.abort();
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    idempotencyKey.current ||= crypto.randomUUID();
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey.current },
        body: JSON.stringify({ productId: "TYQ-DST01", quantity, delivery: Object.fromEntries(new FormData(event.currentTarget)) }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || "Your request could not be submitted. Please try again.");
        return;
      }
      idempotencyKey.current = null;
      sessionStorage.removeItem("tyqora_quantity");
      router.push("/portal");
      router.refresh();
    } catch {
      setError("The network request failed. You can safely retry without creating a duplicate order.");
    } finally {
      setBusy(false);
    }
  }

  return <div className="checkout-page"><div className="checkout-shell container">
    <Link className="back-link dark" href="/product">← Back to product</Link>
    <div className="checkout-grid"><section><div className="section-kicker">Order request</div><h1>Where should we deliver?</h1><p className="checkout-lead">A Tyqora team member will confirm availability, pricing, regulatory requirements, and payment after reviewing your request.</p>
      {accountState === "loading" && <div className="account-loading" role="status">Loading your account details…</div>}
      {accountState === "error" && <div className="account-loading error" role="alert"><p>{error}</p><button className="button button-primary" onClick={() => location.reload()}>Try again</button></div>}
      {accountState === "ready" && user && <form className="checkout-form" onSubmit={submit}>
        <label><span>Recipient name</span><input name="name" defaultValue={user.name} required/></label>
        <label><span>Phone number</span><input name="phone" type="tel" required/></label>
        <label className="form-full"><span>Street address</span><input name="address" required/></label>
        <label><span>City</span><input name="city" required/></label>
        <label><span>State / region</span><input name="region" required/></label>
        <label><span>Country</span><input name="country" defaultValue={user.country} required/></label>
        <label><span>Postal code</span><input name="postalCode"/></label>
        <label className="form-full"><span>Additional notes</span><textarea name="notes"/></label>
        {error && <p className="form-error form-full" role="alert">{error}</p>}
        <button className="button button-primary button-large form-full" disabled={busy}>{busy ? "Submitting…" : "Submit order request →"}</button>
      </form>}
    </section><aside className="order-summary"><div className="summary-product"><div className="summary-device"><i/><strong>T</strong></div><div><small>TYQ-DST01</small><strong>Digital stethoscope</strong><span>Quantity: {quantity}</span></div></div><div className="summary-line"><span>Indicative unit price</span><strong>$599.00</strong></div><div className="summary-line"><span>Quantity</span><strong>{quantity}</strong></div><div className="summary-line total"><span>Indicative total</span><strong>${(599 * quantity).toFixed(2)}</strong></div><p>No payment is taken at this stage. Taxes, shipping, and market-specific requirements will be confirmed separately.</p></aside></div>
  </div></div>;
}
