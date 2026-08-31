import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80), email: z.email().toLowerCase(),
  organization: z.string().trim().max(120).default(""), role: z.string().trim().max(60).default("Healthcare professional"),
  password: z.string().min(10).max(128).regex(/[A-Z]/).regex(/[a-z]/).regex(/\d/),
});
export const loginSchema = z.object({ email: z.email().toLowerCase(), password: z.string().min(1).max(128) });
export const profileSchema = z.object({ name: z.string().trim().min(2).max(80), organization: z.string().trim().max(120), role: z.string().trim().max(60), country: z.string().trim().max(80) });
export const inquirySchema = z.object({ name: z.string().trim().min(2).max(80), email: z.email().toLowerCase(), organization: z.string().trim().max(120).default(""), message: z.string().trim().min(10).max(1000) });
export const orderSchema = z.object({ productId: z.literal("TYQ-DST01"), quantity: z.number().int().min(1).max(20), delivery: z.object({ name: z.string().trim().min(2).max(100), phone: z.string().trim().min(6).max(40), address: z.string().trim().min(3).max(180), city: z.string().trim().min(2).max(80), region: z.string().trim().min(2).max(80), country: z.string().trim().min(2).max(80), postalCode: z.string().trim().max(20).default(""), notes: z.string().trim().max(500).default("") }) });

export function invalid(error = "Please check the information and try again.") { return Response.json({ error }, { status: 400 }); }
