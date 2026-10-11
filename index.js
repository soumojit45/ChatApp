import dotenv from "dotenv/config"
import express from "express"
import cookieParser from "cookie-parser"
import userRouter from "./routes/userRouter.js"
import messageRouter from "./routes/msgRouter.js"
import chatRouter from "./routes/chatRouter.js"
import connectDB from "./config/database.js"
import { connectRedis } from "./config/redis.js"

// dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())

// app.use("/", (req,res)=>{
//     res.json("hello world")
// })


app.use("/user", userRouter)
app.use("/msg", messageRouter)
app.use("/chat", chatRouter)

const startServer = async () => {
    try {
        await connectDB();
        await connectRedis();

        app.listen(process.env.PORT, () => {
            console.log(`Server has started listenting at port ${process.env.PORT}`);
        })
    } catch (error) {
            console.log(error)
    }
}

startServer()