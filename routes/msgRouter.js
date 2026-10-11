import express from "express"
import { getMessage , sendMessage } from "../controllers/msgController.js";
import { authUserMiddleware } from "../middlewares/authUserMiddleware.js";
import authenticatedRateLimiter from "../middlewares/authenticatedRateLimiter.js";
import loadUserMiddleware from "../middlewares/loadUserMiddleware.js";
import { tokenUsageMiddleware } from "../middlewares/tokenUsageMiddleware.js";

const messageRouter = express.Router();

messageRouter.use(authUserMiddleware);
messageRouter.use(authenticatedRateLimiter);

// getMessage, sendMessage

messageRouter.post("/",tokenUsageMiddleware,loadUserMiddleware,sendMessage); // no msg in chat 
messageRouter.get("/:chatId",loadUserMiddleware,getMessage);
messageRouter.post("/:chatId",tokenUsageMiddleware,loadUserMiddleware,sendMessage);


export default messageRouter;