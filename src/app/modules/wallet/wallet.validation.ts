import { z } from "zod"

export const depositValidation = z.object({
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be positive")
    .min(10, "Minimum deposit amount is ৳10")
    .max(50000, "Maximum single deposit is ৳50,000"),
})

export const withdrawValidation = z.object({
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be positive")
    .min(10, "Minimum withdrawal amount is ৳10")
    .max(25000, "Maximum single withdrawal is ৳25,000"),
})

export const sendMoneyValidation = z.object({
  receiverPhone: z
    .string({
      required_error: "Receiver phone is required",
    })
    .regex(/^(\+88)?01[3-9]\d{8}$/, "Please provide a valid Bangladeshi phone number"),
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be positive")
    .min(10, "Minimum send amount is ৳10")
    .max(25000, "Maximum single transfer is ৳25,000"),
})

export const cashInValidation = z.object({
  userPhone: z
    .string({
      required_error: "User phone is required",
    })
    .regex(/^(\+88)?01[3-9]\d{8}$/, "Please provide a valid Bangladeshi phone number"),
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be positive")
    .min(50, "Minimum cash-in amount is ৳50"),
})

export const cashOutValidation = z.object({
  agentPhone: z
    .string({
      required_error: "Agent phone no is required",
    })
    .regex(/^(\+88)?01[3-9]\d{8}$/, "Please provide a valid Bangladeshi phone number"),
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be positive")
    .min(10, "Minimum cash-out amount is ৳10"),
})
