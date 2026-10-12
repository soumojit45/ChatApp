import Message from "../model/messageSchema.js";
import Chat from "../model/chatSchema.js";
import mongoose from "mongoose";
import { buildMessagesForAI } from "../utils/chatContext.js";
import { generateAIResponse } from "../service/openRouterService.js";
import {
    resetUsageIfNeeded,
    hasTokenLimitExceed,
    addUserTokenUsage
} from "../utils/userUsage.js";
import { addChatTokenUsage } from "../utils/tokenUsage.js";
import { updateSummaryIfNeeded } from "../service/summaryService.js";
import { redisClient } from "../config/redis.js";

// getMessage, sendMessage 

export const getMessage = async (req, res) => {
    try {

        const { chatId } = req.params;

        const chat = await Chat.findOne({
            _id: chatId,
            userId: req.user._id
        });

        if (!chat) {
            return res.status(404).json({
                messages: "Chat Not found"
            });
        }

        const messages = await Message.find({
            chatId: chatId
        }).sort({ createdAt: 1 });

        res.status(200).json({
            messages: "Your are all messages are here",
            msg: messages
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            messages: "Internal server error"
        })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { model, content } = req.body;

        // 1. Return immediately on validation failure
        if (!content || content.trim() === "") {
            return res.status(400).json({
                message: "Message content is required"
            });
        }

        let chat;

        if (chatId) {
            if (!mongoose.Types.ObjectId.isValid(chatId)) {
                return res.status(400).json({
                    message: "Invalid chat id"
                });
            }

            chat = await Chat.findOne({
                _id: chatId,
                userId: req.user._id
            });

            if (!chat) {
                return res.status(404).json({
                    message: "Chat not found"
                });
            }
        } else {
            if (!model) {
                return res.status(400).json({
                    message: "Model is required for a new chat"
                });
            }

            // 2. Assign directly to the outer `chat` variable
            chat = await Chat.create({
                userId: req.user._id,
                model,
                topic: content.trim().slice(0, 40)
            });
        }

        const oldMessages = await Message.find({
            chatId: chat._id
        })
            .sort({ createdAt: 1 })
            .skip(chat.summarizedTillMessageNumber || 0);

        const messagesForAI = buildMessagesForAI({
            chat,
            oldMessages,
            CurrentMessage: content.trim()
        });

        // 3. Match variable name with service return value
        const { aiReply, usage } = await generateAIResponse({
            model: chat.model,
            messages: messagesForAI
        });

        const userMessage = await Message.create({
            userId: req.user._id,
            chatId: chat._id,
            role: "user",
            content: content.trim(),
            usage: {
                promptTokens: usage.promptTokens,
                completionTokens: 0,
                totalTokens: usage.promptTokens
            }
        });

        const assistantMessage = await Message.create({
            userId: req.user._id,
            chatId: chat._id,
            role: "assistant",
            content: aiReply,
            usage: {
                promptTokens: 0,
                completionTokens: usage.completionTokens,
                totalTokens: usage.completionTokens
            }
        });

        chat.messageCount = (chat.messageCount || 0) + 2;

        if (chat.topic === "New Chat") {
            chat.topic = content.trim().slice(0, 40);
        }

        await addChatTokenUsage(chat, usage);
        await addUserTokenUsage(req.user, usage.totalTokens);

        await chat.save();
        await req.user.save();

        const tokenUsed = await redisClient.incrBy(req.tokenUsageKey, usage.totalTokens)
        if (tokenUsed === usage.totalTokens) {
            await redisClient.expire(
                req.tokenUsageKey,
                Number(process.env.TOKEN_WINDOW_SECONDS)
            );
        }

        res.status(201).json({
            message: "Message sent successfully",
            chatId: chat._id,
            userMessage,
            reply: aiReply,
            usage,
            tokenUsed,
            tokenLimit: Number(process.env.TOKEN_LIMIT),
            assistantMessage,
        });

        await updateSummaryIfNeeded(chat._id);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};