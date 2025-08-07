import { model, Schema } from "mongoose"
import { IsActive, Role, type IUser } from "./user.interface"
import { boolean } from "zod"

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [/^(\+88)?01[3-9]\d{8}$/, "Please enter a valid Bangladeshi phone number"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: boolean,
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false
  },
)

export const User = model<IUser>("User", userSchema)