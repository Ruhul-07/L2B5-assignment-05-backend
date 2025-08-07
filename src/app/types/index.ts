// import type { Document } from "mongoose"

// export enum Role {
//     SUPER_ADMIN = "SUPER_ADMIN",
//     ADMIN = "ADMIN",
//     USER = "USER",
//     AGENT = "AGENT",
// }

// export enum IsActive {
//     ACTIVE = "ACTIVE",
//     INACTIVE = "INACTIVE",
//     BLOCKED = "BLOCKED"
// }

// export interface IUser extends Document {
//   _id: string
//   name: string
//   phone: string
//   password: string
//   role: Role
//   isActive: IsActive
//   isVerified: boolean
//   isApproved: boolean // For agents
//   refreshToken?: string
//   createdAt: Date
//   updatedAt: Date
//   comparePassword(candidatePassword: string): Promise<boolean>
// }
