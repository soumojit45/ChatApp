import express from "express"
import { getSingleChat ,CreateChat,getRecentChat,DeleteChat} from "../controllers/chatController.js";
import { authUserMiddleware } from "../middlewares/authUserMiddleware.js";
import authenticatedRateLimiter from "../middlewares/authenticatedRateLimiter.js";
import loadUserMiddleware from "../middlewares/loadUserMiddleware.js";

const chatRouter = express.Router();

chatRouter.use(authUserMiddleware);
chatRouter.use(loadUserMiddleware);

// getRecentChat: top 20 , getSingleChat , createChat, deleteChat

chatRouter.post("/createChat",CreateChat);
chatRouter.get("/getRecentChat", getRecentChat);
chatRouter.get("/:chatId", getSingleChat);
chatRouter.delete("/:chatId", DeleteChat);

export default chatRouter;