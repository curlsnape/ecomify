import express from "express"
import { registerValidator, loginValidator } from "../validators/auth.validator.js"
import {
    registerController,
    loginController,
    refreshTokenController,
    logoutController,
    meController
} from "../controllers/auth.controller.js"
import { authenticate } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/register", registerValidator, registerController)
router.post("/login", loginValidator, loginController)
router.post("/refresh-token", refreshTokenController)
router.post("/logout", authenticate, logoutController)
router.get("/me", authenticate, meController)

export default router
