import type { FilterQuery } from "mongoose"
import { Transaction } from "./transaction.model"
import { type ITransaction, type ITransactionQuery, TransactionType } from "./transaction.interface"
import AppError from "../../errorHelpers/appError"
import httpStatus from "http-status-codes"

const getMyTransactions = async (userId: string, query: ITransactionQuery) => {
  const { page = 1, limit = 10, type, status, startDate, endDate } = query

  // Build filter
  const filter: FilterQuery<ITransaction> = {
    $or: [{ senderId: userId }, { receiverId: userId }],
  }

  if (type) {
    filter.type = type
  }

  if (status) {
    filter.status = status
  }

  if (startDate || endDate) {
    filter.createdAt = {}
    if (startDate) {
      filter.createdAt.$gte = new Date(startDate)
    }
    if (endDate) {
      filter.createdAt.$lte = new Date(endDate)
    }
  }

  const skip = (page - 1) * limit

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .populate("senderId", "name phone role")
      .populate("receiverId", "name phone role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Transaction.countDocuments(filter),
  ])

  return {
    data: transactions,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}

const getAgentCommissions = async (agentId: string, query: ITransactionQuery) => {
  const { page = 1, limit = 10, startDate, endDate } = query

  // Build filter for commission transactions
  const filter: FilterQuery<ITransaction> = {
    senderId: agentId,
    receiverId: agentId,
    type: TransactionType.COMMISSION,
  }

  if (startDate || endDate) {
    filter.createdAt = {}
    if (startDate) {
      filter.createdAt.$gte = new Date(startDate)
    }
    if (endDate) {
      filter.createdAt.$lte = new Date(endDate)
    }
  }

  const skip = (page - 1) * limit

  const [commissions, total] = await Promise.all([
    Transaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Transaction.countDocuments(filter),
  ])

  // Calculate total commission earned
  const totalCommission = await Transaction.aggregate([
    { $match: filter },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ])

  return {
    data: commissions,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalCommissionEarned: totalCommission[0]?.total || 0,
    },
  }
}

const getAllTransactions = async (query: ITransactionQuery) => {
  const { page = 1, limit = 10, type, status, startDate, endDate } = query

  // Build filter
  const filter: FilterQuery<ITransaction> = {}

  if (type) {
    filter.type = type
  }

  if (status) {
    filter.status = status
  }

  if (startDate || endDate) {
    filter.createdAt = {}
    if (startDate) {
      filter.createdAt.$gte = new Date(startDate)
    }
    if (endDate) {
      filter.createdAt.$lte = new Date(endDate)
    }
  }

  const skip = (page - 1) * limit

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .populate("senderId", "name phone role")
      .populate("receiverId", "name phone role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Transaction.countDocuments(filter),
  ])

  return {
    data: transactions,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}

const getTransactionById = async (transactionId: string, userId: string) => {
  const transaction = await Transaction.findById(transactionId)
    .populate("senderId", "name phone role")
    .populate("receiverId", "name phone role")

  if (!transaction) {
    throw new AppError(httpStatus.NOT_FOUND, "Transaction not found")
  }

  // Check if user has access to this transaction
  if (transaction.senderId._id.toString() !== userId && transaction.receiverId._id.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You don't have access to this transaction")
  }

  return transaction
}

export const TransactionServices = {
  getMyTransactions,
  getAgentCommissions,
  getAllTransactions,
  getTransactionById,
}
