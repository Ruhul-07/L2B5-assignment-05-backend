
import { z } from "zod";

// Deposit Validation
export const depositValidation = z.object({
  amount: z.coerce
    .number({ error: "Amount must be a number" })
    .min(10, "Minimum deposit amount is ৳10")
    .max(50000, "Maximum single deposit is ৳50,000")
    .refine((val) => val > 0, { message: "Amount must be positive" }),
});

// Withdraw Validation
export const withdrawValidation = z.object({
  amount: z.coerce
    .number({ error: "Amount must be a number" })
    .min(10, "Minimum withdrawal amount is ৳10")
    .max(25000, "Maximum single withdrawal is ৳25,000")
    .refine((val) => val > 0, { message: "Amount must be positive" }),
});

// Send Money Validation
export const sendMoneyValidation = z.object({
  receiverPhone: z
    .string({ error: "Receiver phone is required" })
    .regex(/^(\+88)?01[3-9]\d{8}$/, "Please provide a valid Bangladeshi phone number"),
  amount: z.coerce
    .number({ error: "Amount must be a number" })
    .min(10, "Minimum send amount is ৳10")
    .max(25000, "Maximum single transfer is ৳25,000")
    .refine((val) => val > 0, { message: "Amount must be positive" }),
});

// Cash-In Validation
export const cashInValidation = z.object({
  userPhone: z
    .string({ error: "User phone is required" })
    .regex(/^(\+88)?01[3-9]\d{8}$/, "Please provide a valid Bangladeshi phone number"),
  amount: z.coerce
    .number({ error: "Amount must be a number" })
    .min(50, "Minimum cash-in amount is ৳50")
    .refine((val) => val > 0, { message: "Amount must be positive" }),
});

// Cash-Out Validation
export const cashOutValidation = z.object({
  agentPhone: z
    .string({ error: "Agent phone no is required" })
    .regex(/^(\+88)?01[3-9]\d{8}$/, "Please provide a valid Bangladeshi phone number"),
  amount: z.coerce
    .number({ error: "Amount must be a number" })
    .min(10, "Minimum cash-out amount is ৳10")
    .refine((val) => val > 0, { message: "Amount must be positive" }),
});