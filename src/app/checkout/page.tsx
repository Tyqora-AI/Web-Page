import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { CheckoutForm } from "./checkout-form";
export const metadata: Metadata={title:"Order request"};
export default function CheckoutPage(){return <SiteShell footer={false}><CheckoutForm/></SiteShell>}
