import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteShell({ children, footer = true }: { children: ReactNode; footer?: boolean }) {
  return <><Header/><main>{children}</main>{footer && <Footer/>}</>;
}
