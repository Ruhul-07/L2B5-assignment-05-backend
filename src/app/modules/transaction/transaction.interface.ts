import type { Document, Types } from "mongoose"

export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
  SEND_MONEY = "SEND_MONEY",
  CASH_IN = "CASH_IN",
  CASH_OUT = "CASH_OUT",
  COMMISSION = "COMMISSION",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REVERSED = "REVERSED",
}

export interface ITransaction extends Document {
  senderId: Types.ObjectId
  receiverId: Types.ObjectId
  amount: number
  type: TransactionType
  status: TransactionStatus
  fee?: number
  commission?: number
  description?: string
  reference?: string
  createdAt: Date
  updatedAt: Date
}

export interface ITransactionQuery {
  page?: number
  limit?: number
  type?: TransactionType
  status?: TransactionStatus
  startDate?: string
  endDate?: string
}
