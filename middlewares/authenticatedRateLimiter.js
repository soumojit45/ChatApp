import { redisClient } from "../config/redis.js";

const authenticatedRateLimiter = async (req, res, next) => {
    try {
        const userId = req.userId;

        const key = `rate-limit:user:${userId}`;
        const reqCount = await redisClient.incrBy(key, 1);
        if (reqCount == 1) {
            await redisClient.expire(key, 60);
        }
        if (reqCount > 20) {
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

export default authenticatedRateLimiter;