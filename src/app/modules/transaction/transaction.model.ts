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




// import { model, Schema } from "mongoose"
// import { type ITransaction, TransactionType, TransactionStatus } from "./transaction.interface"

// // This is the Mongoose Schema that defines the structure and validation rules
// // for your transaction documents.
// const transactionSchema = new Schema<ITransaction>(
//   {
//     // The sender's ID, referencing the User model.
//     senderId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     // The type of user who is the sender (e.g., 'user', 'agent').
//     senderType: {
//       type: String,
//       enum: ["user", "agent", "admin"],
//       required: true,
//     },
//     // The receiver's ID, also referencing the User model.
//     receiverId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     // The type of user who is the receiver.
//     receiverType: {
//       type: String,
//       enum: ["user", "agent", "admin"],
//       required: true,
//     },
//     // The amount of the transaction.
//     amount: {
//       type: Number,
//       required: true,
//       min: [0, "Amount cannot be negative"],
//     },
//     // The type of transaction (e.g., 'sendMoney', 'cashIn').
//     type: {
//       type: String,
//       enum: Object.values(TransactionType),
//       required: true,
//     },
//     // The current status of the transaction.
//     status: {
//       type: String,
//       enum: Object.values(TransactionStatus),
//       default: TransactionStatus.PENDING,
//     },
//     // Any transaction fees associated with the transaction.
//     fee: {
//       type: Number,
//       default: 0,
//     },
//     // The commission earned by an agent.
//     commission: {
//       type: Number,
//       default: 0,
//     },
//     // A short description for the transaction.
//     description: {
//       type: String,
//       maxlength: [200, "Description cannot exceed 200 characters"],
//       trim: true,
//     },
//     // A unique reference number for the transaction.
//     reference: {
//       type: String,
//       unique: true,
//       sparse: true,
//     },
//   },
//   {
//     timestamps: true,
//     versionKey: false, // Disables the '__v' version key field.
//   },
// )

// // Index the schema for improved query performance.
// // These indexes will help speed up common lookups.
// transactionSchema.index({ senderId: 1, createdAt: -1 })
// transactionSchema.index({ receiverId: 1, createdAt: -1 })
// transactionSchema.index({ type: 1, status: 1 })
// transactionSchema.index({ createdAt: -1 })

// // Pre-save hook to generate a unique reference number.
// // This runs before the document is saved for the first time.
// transactionSchema.pre("save", function (next) {
//   if (this.isNew) {
//     this.reference = `TXN${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`
//   }
//   next()
// })

// export const Transaction = model<ITransaction>("Transaction", transactionSchema)
