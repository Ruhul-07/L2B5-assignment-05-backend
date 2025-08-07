import type { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { WalletServices } from "./wallet.service"

const getMyWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const wallet = await WalletServices.getMyWallet(req.user.userId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Wallet retrieved successfully",
    data: wallet,
  })
})

const getAllWallets = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await WalletServices.getAllWallets()

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All wallets retrieved successfully",
    data: result.data,
    meta: result.meta,
  })
})

const deposit = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await WalletServices.deposit(req.user.userId, req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Money deposited successfully",
    data: result,
  })
})

const withdraw = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await WalletServices.withdraw(req.user.userId, req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Money withdrawn successfully",
    data: result,
  })
})

const sendMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await WalletServices.sendMoney(req.user.userId, req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Money sent successfully",
    data: result,
  })
})

const cashIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await WalletServices.cashIn(req.user.userId, req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cash-in completed successfully",
    data: result,
  })
})

const cashOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await WalletServices.cashOut(req.user.userId, req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cash-out completed successfully",
    data: result,
  })
})

const blockWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params
  const result = await WalletServices.blockWallet(userId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Wallet blocked successfully",
    data: result,
  })
})

const unblockWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params
  const result = await WalletServices.unblockWallet(userId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Wallet unblocked successfully",
    data: result,
  })
})

export const WalletControllers = {
  getMyWallet,
  getAllWallets,
  deposit,
  withdraw,
  sendMoney,
  cashIn,
  cashOut,
  blockWallet,
  unblockWallet,
}
