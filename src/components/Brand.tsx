import Link from "next/link";

export function Brand({ inverse = false, portal = false }: { inverse?: boolean; portal?: boolean }) {
  return <Link className={`brand${inverse ? " inverse" : ""}`} href="/" aria-label="Tyqora home">
    <svg className="brand-mark" viewBox="0 0 48 48" aria-hidden="true">
      <defs><linearGradient id="brand-gradient" x1="4" y1="4" x2="44" y2="44"><stop stopColor="#39dbc7"/><stop offset=".52" stopColor="#3388ff"/><stop offset="1" stopColor="#9b67ff"/></linearGradient></defs>
      <path d="M24 5.5 40 14.7v18.6L24 42.5 8 33.3V14.7L24 5.5Z" fill="none" stroke="url(#brand-gradient)" strokeWidth="3"/>
      <path d="M16 18.2h16M24 18.2v15.3M18.5 26h11" fill="none" stroke="url(#brand-gradient)" strokeWidth="3" strokeLinecap="round"/>
    </svg>
    <span><strong>TYQORA</strong><small>{portal ? "Customer portal" : "Healthcare intelligence"}</small></span>
  </Link>;
}
