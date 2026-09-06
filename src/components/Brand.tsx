import Link from "next/link";
import Image from "next/image";

export function Brand({ inverse = false, portal = false }: { inverse?: boolean; portal?: boolean }) {
  return <Link className={`brand${inverse ? " inverse" : ""}`} href="/" aria-label="Tyqora home">
    <Image className="brand-mark" src="/brand/tyqora-symbol.png" alt="" width={48} height={48} priority />
    <span><strong>TYQORA</strong><small>{portal ? "Customer portal" : "AI powered healthcare intelligence"}</small></span>
  </Link>;
}
