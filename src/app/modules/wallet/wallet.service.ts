import mongoose from "mongoose"
import httpStatus from "http-status-codes"
import AppError from "../../errorHelpers/appError"
import { User } from "../user/user.model"
import { Wallet } from "./wallet.model"
import { Transaction } from "../transaction/transaction.model"
import type {
  IWallet,
  IDepositRequest,
  IWithdrawRequest,
  ISendMoneyRequest,
  ICashInRequest,
  ICashOutRequest,
} from "./wallet.interface"
import { TransactionType, TransactionStatus } from "../transaction/transaction.interface"
import { Role } from "../user/user.interface"

// Helper function to check and reset daily limits
const checkDailyLimit = (wallet: IWallet, type: "deposit" | "withdrawal" | "sendMoney", amount: number) => {
  const limit = wallet.dailyLimits[type]
  const now = new Date()
  const lastReset = new Date(limit.lastReset)

  // Reset if it's a new day
  if (
    now.getDate() !== lastReset.getDate() ||
    now.getMonth() !== lastReset.getMonth() ||
    now.getFullYear() !== lastReset.getFullYear()
  ) {
    limit.amount = 0
    limit.lastReset = now
  }

  // Check if adding this amount would exceed the daily limit
  if (limit.amount + amount > limit.limit) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Daily ${type} limit exceeded. Remaining: ৳${limit.limit - limit.amount}`,
    )
  }

  // Update the daily amount
  limit.amount += amount
}

const createWallet = async (userId: string): Promise<IWallet> => {
  const existingWallet = await Wallet.findOne({ userId })

  if (existingWallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet already exists for this user")
  }

  const wallet = await Wallet.create({
    userId,
    balance: 50, // Initial balance of ৳50
  })

  return wallet
}

const getMyWallet = async (userId: string) => {
  const wallet = await Wallet.findOne({ userId }).populate("userId", "name phone role")

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found")
  }

  return wallet
}

const getAllWallets = async () => {
  const wallets = await Wallet.find().populate("userId", "name phone role isActive")
  const totalWallets = await Wallet.countDocuments()

  return {
    data: wallets,
    meta: {
      total: totalWallets,
    },
  }
}

const deposit = async (userId: string, payload: IDepositRequest) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { amount } = payload

    // Find wallet
    const wallet = await Wallet.findOne({ userId }).session(session)
    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found")
    }

    if (wallet.isBlocked) {
      throw new AppError(httpStatus.FORBIDDEN, "Wallet is blocked")
    }

    // Check daily limit
    checkDailyLimit(wallet, "deposit", amount)

    // Update wallet balance
    wallet.balance += amount
    await wallet.save({ session })

    // Create transaction record
    const transaction = await Transaction.create(
      [
        {
          senderId: userId,
          receiverId: userId,
          amount,
          type: TransactionType.DEPOSIT,
          status: TransactionStatus.COMPLETED,
          description: "Money added to wallet",
        },
      ],
      { session },
    )

    await session.commitTransaction()

    return {
      wallet,
      transaction: transaction[0],
    }
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

const withdraw = async (userId: string, payload: IWithdrawRequest) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { amount } = payload

    // Find wallet
    const wallet = await Wallet.findOne({ userId }).session(session)
    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found")
    }

    if (wallet.isBlocked) {
      throw new AppError(httpStatus.FORBIDDEN, "Wallet is blocked")
    }

    if (wallet.balance < amount) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance")
    }

    // Check daily limit
    checkDailyLimit(wallet, "withdrawal", amount)

    // Update wallet balance
    wallet.balance -= amount
    await wallet.save({ session })

    // Create transaction record
    const transaction = await Transaction.create(
      [
        {
          senderId: userId,
          receiverId: userId,
          amount,
          type: TransactionType.WITHDRAW,
          status: TransactionStatus.COMPLETED,
          description: "Money withdrawn from wallet",
        },
      ],
      { session },
    )

    await session.commitTransaction()

    return {
      wallet,
      transaction: transaction[0],
    }
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

const sendMoney = async (userId: string, payload: ISendMoneyRequest) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { receiverPhone, amount } = payload

    // Find sender wallet
    const senderWallet = await Wallet.findOne({ userId }).session(session)
    if (!senderWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Sender wallet not found")
    }

    if (senderWallet.isBlocked) {
      throw new AppError(httpStatus.FORBIDDEN, "Your wallet is blocked")
    }

    // Find receiver
    const receiver = await User.findOne({ phone: receiverPhone }).session(session)
    if (!receiver) {
      throw new AppError(httpStatus.NOT_FOUND, "Receiver not found")
    }

    // Find receiver wallet
    const receiverWallet = await Wallet.findOne({ userId: receiver._id }).session(session)
    if (!receiverWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Receiver wallet not found")
    }

    if (receiverWallet.isBlocked) {
      throw new AppError(httpStatus.FORBIDDEN, "Receiver wallet is blocked")
    }

    if (senderWallet.balance < amount) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance")
    }

    // Check daily limit for sender
    checkDailyLimit(senderWallet, "sendMoney", amount)

    // Update balances
    senderWallet.balance -= amount
    receiverWallet.balance += amount

    await senderWallet.save({ session })
    await receiverWallet.save({ session })

    // Create transaction record
    const transaction = await Transaction.create(
      [
        {
          senderId: userId,
          receiverId: receiver._id,
          amount,
          type: TransactionType.SEND_MONEY,
          status: TransactionStatus.COMPLETED,
          description: `Money sent to ${receiverPhone}`,
        },
      ],
      { session },
    )

    await session.commitTransaction()

    return {
      senderWallet,
      receiverWallet,
      transaction: transaction[0],
    }
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

const cashIn = async (agentId: string, payload: ICashInRequest) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { userPhone, amount } = payload
    const commission = amount * 0.01 // 1% commission

    // Find user
    const user = await User.findOne({ phone: userPhone }).session(session)
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }

    // Find user wallet
    const userWallet = await Wallet.findOne({ userId: user._id }).session(session)
    if (!userWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "User wallet not found")
    }

    if (userWallet.isBlocked) {
      throw new AppError(httpStatus.FORBIDDEN, "User wallet is blocked")
    }

    // Find agent wallet
    const agentWallet = await Wallet.findOne({ userId: agentId }).session(session)
    if (!agentWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Agent wallet not found")
    }

     if (agentWallet.isBlocked) {
      throw new AppError(httpStatus.FORBIDDEN, "Agent wallet is blocked")
    }

    if (agentWallet.balance < amount) {
      throw new AppError(httpStatus.BAD_REQUEST, "Agent has insufficient balance")
    }

    // Update balances
    agentWallet.balance -= amount
    agentWallet.balance = parseFloat((agentWallet.balance + commission).toFixed(2));
    userWallet.balance = parseFloat((userWallet.balance + amount).toFixed(2));

    await agentWallet.save({ session })
    await userWallet.save({ session })

    // Create cash-in transaction
    const cashInTransaction = await Transaction.create(
      [
        {
          senderId: agentId,
          receiverId: user._id,
          amount,
          type: TransactionType.CASH_IN,
          status: TransactionStatus.COMPLETED,
          description: `Cash-in for ${userPhone}`,
        },
      ],
      { session },
    )

    // Create commission transaction
    const commissionTransaction = await Transaction.create(
      [
        {
          senderId: agentId,
          receiverId: agentId,
          amount: commission,
          type: TransactionType.COMMISSION,
          status: TransactionStatus.COMPLETED,
          description: "Cash-in commission earned",
        },
      ],
      { session },
    )

    await session.commitTransaction()

    return {
      userWallet,
      agentWallet,
      cashInTransaction: cashInTransaction[0],
      commissionTransaction: commissionTransaction[0],
    }
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

const cashOut = async (userId: string, payload: ICashOutRequest) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { agentPhone, amount } = payload
    const cashOutFee = amount * 0.015 // 1.5% commission
    const totalDebit = amount + cashOutFee;


    // Find User Wallet
    const userWallet = await Wallet.findOne({ userId }).session(session);
    if (!userWallet) {
        throw new AppError(httpStatus.NOT_FOUND, "Your wallet was not found.");
    }
    
    // Check if the user's wallet is blocked
    if (userWallet.isBlocked) {
        throw new AppError(httpStatus.FORBIDDEN, "Your wallet is blocked.");
    }
    
    // Ensure the user has enough balance for the amount + fee
    if (userWallet.balance < totalDebit) {
        throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance to cover cash-out and fees.");
    }

    // --- Find and validate the agent's wallet ---
    const agent = await User.findOne({ phone: agentPhone }).session(session);
    if (!agent) {
        throw new AppError(httpStatus.NOT_FOUND, "Agent not found.");
    }

    // Crucial check: Ensure the receiver is an approved agent
    if (agent.role !== Role.AGENT || !agent.isApproved) {
        throw new AppError(httpStatus.FORBIDDEN, "The provided user is not an approved agent.");
    }

    const agentWallet = await Wallet.findOne({ userId: agent._id }).session(session);
    if (!agentWallet) {
        throw new AppError(httpStatus.NOT_FOUND, "Agent wallet not found.");
    }


    // Update balances
     userWallet.balance = parseFloat((userWallet.balance - totalDebit).toFixed(2));
    agentWallet.balance = parseFloat((agentWallet.balance + amount).toFixed(2));
    agentWallet.balance = parseFloat((agentWallet.balance + cashOutFee).toFixed(2));

    await userWallet.save({ session })
    await agentWallet.save({ session })

    // Create cash-out transaction
    const cashOutTransaction = await Transaction.create(
      [
        {
          senderId: userId,
          receiverId: agent._id,
          amount,
          fee: cashOutFee,
          type: TransactionType.CASH_OUT,
          status: TransactionStatus.COMPLETED,
          description: `User-initiated cash-out to agent ${agentPhone}.`,
        },
      ],
      { session },
    )

    // Create commission transaction
    const commissionTransaction = await Transaction.create(
      [
        {
          senderId: userId,
          receiverId: agent._id,
          amount: cashOutFee,
          type: TransactionType.COMMISSION,
          status: TransactionStatus.COMPLETED,
          description: `Cash-out commission earned from user ${userWallet.userId}`,
        },
      ],
      { session },
    )

    await session.commitTransaction()

    return {
      userWallet,
      agentWallet,
      cashOutTransaction: cashOutTransaction[0],
      commissionTransaction: commissionTransaction[0],
    }
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

const blockWallet = async (userId: string) => {
  const wallet = await Wallet.findOne({ userId })

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found")
  }

  wallet.isBlocked = true
  await wallet.save()

  return wallet
}

const unblockWallet = async (userId: string) => {
  const wallet = await Wallet.findOne({ userId })

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found")
  }

  wallet.isBlocked = false
  await wallet.save()

  return wallet
}

export const WalletServices = {
  createWallet,
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
