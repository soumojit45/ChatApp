import Message from "../model/messageSchema.js";
import Chat from "../model/chatSchema.js";

export const getRecentChat = async (req, res) => {
    try {
        const top20Chat = await Chat.find({ userId: req.user._id })
            .select("topic updatedAt")
            .sort({ updatedAt: -1 })
            .limit(20)

        res.status(200).json({
            message: "Your all recent chats",
            top20Chat
        })

    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const getSingleChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const chat = Chat.findOne({ _id: chatId, userId: req.user._id });

        if (!chat) {
            return res.status(404).json({
                messages: "Sorry not data found"
            })
        }

        res.status(200).json({
            chatId: chat._id,
            userId: chat.userId,
            topic: chat.topic,
            usage: chat.usage
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const DeleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const chat = Chat.find({ userId: req.user._id, _id: chatId })
        if (!chat) {
            res.status(403).json({
                message: "you are not allowed to do this"
            })
        }
        // console.log(chatId)
        await Message.deleteMany({ chatId: chatId }) 
        await Chat.deleteOne({ _id: chatId })
        res.status(200).json({
            message: "Your chat deleted successfully"
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const CreateChat = async (req, res) => {
    try {
        const { model } = req.body;
        if (!model) {
            res.status(400).json({
                message: "model is missing"
            })
        }
        const chats = await Chat.create({
            userId: req.user._id,
            model,
        })

        res.status(201).json({
            chatId: chats._id,
            userId: req.user._id,
            model,
            topic: chats.topic,
            createdAt: chats.createdAt
        })

    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Interna server error"
        })

    }
}