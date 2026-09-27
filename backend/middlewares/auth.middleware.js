import jwt from "jsonwebtoken"
import userModel from "../models/user.model.js"
import config from "../config/config.js"
import { asyncHandler } from "../utils/asyncHandler.js"

export const authenticate = asyncHandler(async (req, res, next) => {

    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({
            message: "Token not found"
        })
    }

    const token = authHeader.split(" ")[1]

    const data = jwt.verify(token, config.ACCESS_TOKEN_SECRET)

    const user = await userModel.findById(data.id).select("-passwordHash -refreshTokenHash")

    if (!user) {
        return res.status(401).json({
            message: "Unauthorized User"
        })
    }

    req.user = user

    next()
})
