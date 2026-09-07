"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Brand } from "@/components/Brand";
import type { PublicUser } from "@/lib/db";
import type { Order } from "./page";

export function PortalClient({ initialUser, initialOrders }: { initialUser: PublicUser; initialOrders: Order[] }) {
  const [tab, setTab] = useState<"overview" | "orders" | "profile">("overview");
  const [user, setUser] = useState(initialUser);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const latest = initialOrders[0];

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  async function profile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
    });
    const data = await response.json();
    if (response.ok) {
      setUser(data.user);
      setMessage("Profile updated.");
    } else setMessage(data.error);
  }

  return <main className="dashboard-page">
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Brand inverse/>
        <nav className="dashboard-nav">
          <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>Overview</button>
          <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>Orders</button>
          <button className={tab === "profile" ? "active" : ""} onClick={() => setTab("profile")}>Profile</button>
          <Link href="/product">Explore product</Link>
        </nav>
        <button className="logout-button" onClick={logout}>Sign out <span>↗</span></button>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <strong className="dashboard-user-name">{user.name}</strong>
          <div className="user-avatar">{user.name[0]}</div>
        </header>
        <div className="dashboard-content">
          {tab === "overview" && <section>
            <div className="dashboard-welcome">
              <div><span className="status-pill"><i/> Portal active</span><h1>Welcome, {user.name.split(" ")[0]}.</h1><p>Manage your Tyqora product journey from one clear workspace.</p></div>
              <Link className="button button-primary" href="/product">Explore TYQ-DST01</Link>
            </div>
            <div className="summary-grid">
              <article><small>ORDER REQUESTS</small><strong>{initialOrders.length}</strong><span>All-time requests</span></article>
              <article><small>LATEST STATUS</small><strong className="text-value">{latest?.status || "No request yet"}</strong><span>Updates appear here</span></article>
              <article className="accent-summary"><small>PRODUCT</small><strong className="text-value">TYQ-DST01</strong><span>Early access programme</span></article>
            </div>
            <div className="dashboard-card">
              <div><div className="section-kicker">Recommended next step</div><h2>See what intelligent auscultation can do.</h2><p>Review product capabilities and start an order request when your team is ready.</p><Link className="text-link dark" href="/product">View product →</Link></div>
              <div className="dashboard-wave"><svg viewBox="0 0 300 90"><polyline points="0,48 45,48 56,20 73,76 90,36 106,48 152,48 165,12 184,80 203,30 218,48 300,48"/></svg></div>
            </div>
          </section>}

          {tab === "orders" && <section>
            <div className="panel-heading"><div><div className="section-kicker">Orders</div><h1>Your requests</h1><p>Track submitted product and delivery requests.</p></div><Link className="button button-primary" href="/product">New request</Link></div>
            <div className="orders-list">{initialOrders.length ? initialOrders.map((order) => <article className="order-row-card" key={order.id}>
              <div><small>Order</small><strong>{order.id} · {order.productName}</strong></div>
              <div><small>Date</small><strong>{new Date(order.createdAt).toLocaleDateString()}</strong></div>
              <div><small>Total</small><strong>${(order.totalCents / 100).toFixed(2)} · Qty {order.quantity}</strong></div>
              <span className="order-status">{order.status}</span>
            </article>) : <div className="empty-state"><strong>No order requests yet</strong><p>Your submitted requests will appear here.</p></div>}</div>
          </section>}

          {tab === "profile" && <section>
            <div className="panel-heading"><div><div className="section-kicker">Account</div><h1>Profile details</h1><p>Keep your professional information current.</p></div></div>
            <form className="profile-form" onSubmit={profile}>
              <label><span>Full name</span><input name="name" defaultValue={user.name} required/></label>
              <label><span>Email</span><input value={user.email} disabled/></label>
              <label><span>Organisation</span><input name="organization" defaultValue={user.organization}/></label>
              <label><span>Role</span><select name="role" defaultValue={user.role}><option>Healthcare professional</option><option>Hospital administrator</option><option>Researcher</option><option>Distributor or partner</option><option>Other</option></select></label>
              <label><span>Country</span><input name="country" defaultValue={user.country}/></label>
              <button className="button button-primary">Save changes</button>
              {message && <p role="status">{message}</p>}
            </form>
          </section>}
        </div>
      </div>
    </div>
  </main>;
}
