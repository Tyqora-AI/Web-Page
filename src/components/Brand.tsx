import Link from "next/link";
import Image from "next/image";

export function Brand({ inverse = false, portal = false }: { inverse?: boolean; portal?: boolean }) {
  return <Link className={`brand${inverse ? " inverse" : ""}`} href="/" aria-label="Tyqora home">
    <span className="brand-lockup" aria-hidden="true">
      <Image className="brand-mark" src="/brand/tyqora-symbol.png" alt="" width={348} height={286} priority />
      <Image className="brand-wordmark" src="/brand/tyqora-wordmark.png" alt="" width={670} height={180} priority />
    </span>
    {portal && <small className="brand-context">Customer portal</small>}
  </Link>;
}
