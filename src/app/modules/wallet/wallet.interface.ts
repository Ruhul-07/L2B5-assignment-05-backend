import type { Document } from "mongoose"
import { Types } from "mongoose";

export interface IDailyLimit {
  amount: number
  limit: number
  lastReset: Date
}

export interface IWallet extends Document {
  userId: Types.ObjectId;
  balance: number
  isBlocked: boolean
  dailyLimits: {
    deposit: IDailyLimit
    withdrawal: IDailyLimit
    sendMoney: IDailyLimit
  }
  createdAt: Date
  updatedAt: Date
}

export interface IDepositRequest {
  amount: number
}

export interface IWithdrawRequest {
  amount: number
}

export interface ISendMoneyRequest {
  receiverPhone: string
  amount: number
}

export interface ICashInRequest {
  userPhone: string
  amount: number
}

export interface ICashOutRequest {
  agentPhone: string
  amount: number
}
