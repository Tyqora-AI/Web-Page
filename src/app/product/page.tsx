import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { ProductClient } from "./product-client";

export const metadata: Metadata = { title: "TYQ-DST01 Digital Stethoscope", description: "Explore Tyqora's AI-assisted digital stethoscope." };
export default function ProductPage() { return <SiteShell><ProductClient/></SiteShell>; }
