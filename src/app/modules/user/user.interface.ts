import type { Document } from "mongoose"

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    AGENT = "AGENT",
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IUser extends Document {
  _id: string
  name: string
  phone: string
  password: string
  role: Role
  isActive: IsActive
  isVerified: boolean
  isApproved: boolean // For agents
  refreshToken?: string
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}


export interface IUpdateProfileRequest {
  name?: string
  phone?: string
}

export interface IChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface IUserProfileResponse {
  user: {
    _id: string
    name: string
    email: string
    phone: string
    role: string
    isActive: boolean
    isApproved: boolean
    createdAt: Date
    updatedAt: Date
  }
  wallet: {
    balance: number
    isBlocked: boolean
  } | null
}
