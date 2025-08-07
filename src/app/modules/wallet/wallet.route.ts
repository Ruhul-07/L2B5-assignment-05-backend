import { Router } from "express"
import { WalletControllers } from "./wallet.controller"
import { checkAuth } from "../../middlewares/checkAuth"
import { validateRequest } from "../../middlewares/validateRequest"
import { Role } from "../user/user.interface"
import {
  depositValidation,
  withdrawValidation,
  sendMoneyValidation,
  cashInValidation,
  cashOutValidation,
} from "./wallet.validation"

const router = Router()

// User routes
router.get("/my-wallet", checkAuth(Role.USER, Role.AGENT), WalletControllers.getMyWallet)

router.post("/deposit", checkAuth(Role.USER, Role.AGENT), validateRequest(depositValidation), WalletControllers.deposit)

router.post(
  "/withdraw",
  checkAuth(Role.USER, Role.AGENT),
  validateRequest(withdrawValidation),
  WalletControllers.withdraw,
)

router.post("/send-money", checkAuth(Role.USER), validateRequest(sendMoneyValidation), WalletControllers.sendMoney)

// Agent routes
router.post("/cash-in", checkAuth(Role.AGENT), validateRequest(cashInValidation), WalletControllers.cashIn)

router.post("/cash-out", checkAuth(Role.USER), validateRequest(cashOutValidation), WalletControllers.cashOut)

// Admin routes
router.get("/all", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), WalletControllers.getAllWallets)

router.patch("/block/:userId", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), WalletControllers.blockWallet)

router.patch("/unblock/:userId", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), WalletControllers.unblockWallet)

export const WalletRoutes = router
