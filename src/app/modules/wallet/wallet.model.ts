import { model, Schema } from "mongoose"
import type { IWallet } from "./wallet.interface"

const walletSchema = new Schema<IWallet>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 50, // Initial balance of ৳50
      min: [0, "Balance cannot be negative"],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    dailyLimits: {
      deposit: {
        amount: { type: Number, default: 0 },
        limit: { type: Number, default: 50000 }, // ৳50,000 daily deposit limit
        lastReset: { type: Date, default: Date.now },
      },
      withdrawal: {
        amount: { type: Number, default: 0 },
        limit: { type: Number, default: 25000 }, // ৳25,000 daily withdrawal limit
        lastReset: { type: Date, default: Date.now },
      },
      sendMoney: {
        amount: { type: Number, default: 0 },
        limit: { type: Number, default: 25000 }, // ৳25,000 daily send money limit
        lastReset: { type: Date, default: Date.now },
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

// Index for faster queries
walletSchema.index({ userId: 1 })

export const Wallet = model<IWallet>("Wallet", walletSchema)
