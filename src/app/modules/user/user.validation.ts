import { z } from "zod"
import { IsActive, Role } from "./user.interface";

const roles = Object.values(Role) as [Role, ...Role[]];
const activeStates = Object.values(IsActive) as [IsActive, ...IsActive[]];


export const createUserZodSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .trim(),

  phone: z
    .string({
      required_error: "Phone number is required",
      invalid_type_error: "Phone number must be a string",
    })
    .regex(/^(\+88)?01[3-9]\d{8}$/, "Please provide a valid Bangladeshi phone number")
    .trim(),

  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(6, "Password must be at least 6 characters long"),

  role: z
    .enum(roles, {
      invalid_type_error: "Role must be 'user', 'agent', or 'admin'",
    })
    .default(Role.USER)
    .optional(), // Mongoose handles the default, so Zod allows it to be optional

  isActive: z
  .enum(activeStates)
  .optional(), // Mongoose handles the default
  
  isApproved: z.boolean().optional(), // Mongoose handles the default
});