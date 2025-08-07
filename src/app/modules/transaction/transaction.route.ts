import { Router } from "express"
import { TransactionControllers } from "./transaction.controller"
import { checkAuth } from "../../middlewares/checkAuth"
import { Role } from "../user/user.interface"

const router = Router()

// User and Agent routes
router.get("/my-transactions", checkAuth(Role.USER, Role.AGENT), TransactionControllers.getMyTransactions)

router.get("/:transactionId", checkAuth(Role.USER, Role.AGENT), TransactionControllers.getTransactionById)

// Agent specific routes
router.get("/agent/commissions", checkAuth(Role.AGENT), TransactionControllers.getAgentCommissions)

// Admin routes
router.get("/admin/all", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TransactionControllers.getAllTransactions)

export const TransactionRoutes = router
