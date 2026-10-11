import express from "express";
import { login,logout,signup,profile,DeleteUser } from "../controllers/userController.js";
import { authUserMiddleware } from "../middlewares/authUserMiddleware.js";
import authenticatedRateLimiter from "../middlewares/authenticatedRateLimiter.js";
import unauthenticatedRateLimiter from "../middlewares/unauthenticatedRateLimiter.js";
import loadUserMiddleware from "../middlewares/loadUserMiddleware.js";

const userRouter = express.Router()

userRouter.post("/login",unauthenticatedRateLimiter,login)
userRouter.post("/logout",authUserMiddleware,authenticatedRateLimiter,logout)
userRouter.post("/signup",unauthenticatedRateLimiter,signup)
userRouter.get("/profile",authUserMiddleware,authenticatedRateLimiter,
                            loadUserMiddleware,profile)
userRouter.delete("/deleteUser",authUserMiddleware,authenticatedRateLimiter,
                                loadUserMiddleware,DeleteUser)

export default userRouter