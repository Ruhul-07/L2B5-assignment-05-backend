import { model, Schema } from "mongoose"
import { type ITransaction, TransactionType, TransactionStatus } from "./transaction.interface"

const transactionSchema = new Schema<ITransaction>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
    fee: {
      type: Number,
      default: 0,
    },
    commission: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    reference: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

// Indexes for better query performance
transactionSchema.index({ senderId: 1, createdAt: -1 })
transactionSchema.index({ receiverId: 1, createdAt: -1 })
transactionSchema.index({ type: 1, status: 1 })
transactionSchema.index({ createdAt: -1 })

// Generate reference number before saving
transactionSchema.pre("save", function (next) {
  if (!this.reference) {
    this.reference = `TXN${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
  }
  next()
})

export const Transaction = model<ITransaction>("Transaction", transactionSchema)
