import { redisClient } from "../config/redis.js";

const unauthenticatedRateLimiter = async (req, res, next) => {
    try {
        const key = `user-IP-${req.ip}`;
        const reqCount = await redisClient.incrBy(key, 1);
        if (reqCount === 1) {
            await redisClient.expire(key, 60);
        }
        if (reqCount > 10) {
            const remainingTime = await redisClient.ttl(key);
            return res.status(429).json({
                message: `too many request for unauthenticated User , 
            please try after ${remainingTime} second`
            })
        }
        next();
    }
    catch (error) {
        console.log("Unauthenticated rate limiter error:", error);
        // If Redis fails, don't stop the entire application.
        next();
    }
}

export default unauthenticatedRateLimiter;