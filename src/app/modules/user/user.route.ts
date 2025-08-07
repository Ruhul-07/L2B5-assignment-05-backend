import { Router } from "express";
import { UserControllers } from "./user.contoller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router()

router.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser)
router.get("/allUsers", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllUsers)



// Admin routes for agent management
router.get("/agents", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllAgents)
router.get("/agents/pending", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getPendingAgents)
router.patch("/agents/approve/:agentId", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.approveAgent)
router.patch("/agents/suspend/:agentId", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.suspendAgent)

export const UserRoutes = router