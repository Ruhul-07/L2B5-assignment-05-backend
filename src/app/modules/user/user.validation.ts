import { z } from "zod"
import { IsActive, Role } from "./user.interface";

const roles = Object.values(Role) as [Role, ...Role[]];
const activeStates = Object.values(IsActive) as [IsActive, ...IsActive[]];


export const createUserZodSchema = z.object({
name: z.coerce
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Name is required"
          : "Name must be a string",
    })
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .trim(),

  phone: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Phone number is required"
          : "Phone number must be a string",
    })
    .regex(/^(\+88)?01[3-9]\d{8}$/, "Please provide a valid Bangladeshi phone number")
    .trim(),

  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Password is required"
          : "Password must be a string",
    })
    .min(6, "Password must be at least 6 characters long"),

  role: z
    .enum(roles, {
      error: "Role must be 'user', 'agent', or 'admin'",
    })
    .default(Role.USER)
    .optional(),

  isActive: z
    .enum(activeStates)
    .optional(),

  isApproved: z.boolean().optional(),
});