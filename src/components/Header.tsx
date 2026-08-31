"use client";

import Link from "next/link";
import { useState } from "react";
import { Brand } from "./Brand";

export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <Brand />
    <button className="menu-toggle" aria-controls="primary-nav" aria-expanded={open} aria-label="Toggle navigation" onClick={() => setOpen(!open)}><span/><span/><span/></button>
    <nav className={`primary-nav${open ? " open" : ""}`} id="primary-nav" aria-label="Primary navigation">
      <Link href="/#solution" onClick={() => setOpen(false)}>Solution</Link>
      <Link href="/#how-it-works" onClick={() => setOpen(false)}>How it works</Link>
      <Link href="/#impact" onClick={() => setOpen(false)}>Impact</Link>
      <Link href="/product" onClick={() => setOpen(false)}>Product</Link>
      <Link href="/#about" onClick={() => setOpen(false)}>About</Link>
    </nav>
    <div className="header-actions"><Link className="button button-quiet" href="/account">Sign in</Link><Link className="button button-primary header-cta" href="/product">Explore TYQ-DST01</Link></div>
  </header>;
}
