import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL
})

redisClient.on("error", (error) => {
    console.log("redis error : ", error)
})

const connectRedis = async () => {
    await redisClient.connect();
    console.log("redis connected successfully");
}

export { connectRedis, redisClient };