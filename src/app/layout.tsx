import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Tyqora — Clinical intelligence for every frontline", template: "%s — Tyqora" },
  description: "Tyqora builds AI-assisted, accessible clinical tools for frontline healthcare teams across Africa.",
  openGraph: { title: "Tyqora Healthcare Intelligence", description: "Clinical clarity, where it matters most.", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>;
}
