import type { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { TransactionServices } from "./transaction.service"

const getMyTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await TransactionServices.getMyTransactions(req.user.userId, req.query)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Transactions retrieved successfully",
    data: result.data,
    meta: result.meta,
  })
})

const getAgentCommissions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await TransactionServices.getAgentCommissions(req.user.userId, req.query)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Commission history retrieved successfully",
    data: result.data,
    meta: result.meta,
  })
})

const getAllTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await TransactionServices.getAllTransactions(req.query)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All transactions retrieved successfully",
    data: result.data,
    meta: result.meta,
  })
})

const getTransactionById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { transactionId } = req.params
  const result = await TransactionServices.getTransactionById(transactionId, req.user.userId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Transaction retrieved successfully",
    data: result,
  })
})

export const TransactionControllers = {
  getMyTransactions,
  getAgentCommissions,
  getAllTransactions,
  getTransactionById,
}
