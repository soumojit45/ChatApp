import jwt from "jsonwebtoken";
import User from "../model/userSchema.js";
import { redisClient } from "../config/redis.js";

export const authUserMiddleware = async (req, res, next) => {
    try {

        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({
                message: "You need to login First"
            })
        }
        const blockedToken = await redisClient.get(`blocklist:${token}`);
        if (blockedToken) {
            return res.status(401).json({
                message: "Please login again"
            });
        }

        const payload = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = payload.id;
        req.token = token;
        req.tokenPayload = payload;

        next();

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" })
    }
}