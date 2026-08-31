import Link from "next/link";
import { Brand } from "./Brand";

export function Footer() {
  return <footer className="site-footer"><div className="container footer-grid">
    <div><Brand inverse/><p>Clinical intelligence designed for every frontline.</p></div>
    <div><strong>Explore</strong><Link href="/#solution">Solution</Link><Link href="/product">TYQ-DST01</Link><Link href="/#impact">Impact</Link></div>
    <div><strong>Company</strong><Link href="/#about">About</Link><Link href="/#contact">Partnerships</Link><a href="mailto:tyqorabiomedics@gmail.com">Contact</a></div>
    <div><strong>Connect</strong><a href="mailto:tyqorabiomedics@gmail.com">Email</a><a href="https://www.linkedin.com/in/tyqora-biomedics-7b835a432" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://x.com/TyqoraBiomedics" target="_blank" rel="noreferrer">X / Twitter</a><a href="https://www.instagram.com/tyqorabiomedics" target="_blank" rel="noreferrer">Instagram</a></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Tyqora. All rights reserved.</span><span>Responsible innovation · Human-centred care</span></div></footer>;
}
