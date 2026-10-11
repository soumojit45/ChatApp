import User from "../model/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { signupSchema, loginSchema } from "../Validators/userValidator.js";
import Message from "../model/messageSchema.js";
import Chat from "../model/chatSchema.js";
import { redisClient } from "../config/redis.js";

const createToken = (id, email) => {
    if (!process.env.SECRET_KEY) {
        throw new Error("JWT Secret key is Missing");
    }
    const token = jwt.sign({ id, email }, process.env.SECRET_KEY, { expiresIn: '1h' })
    return token;
}

const cookieOption = {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 1000
}

export const signup = async (req, res) => {

    try {
        const result = signupSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: result.error.issues[0].message
            })
        }

        const { name, age, email, password } = result.data;

        const u = await User.findOne({ email })
        if (u) {
            return res.status(409).json({
                message: "Email ID already exist"
            })
        }
        const hashPassword = await bcrypt.hash(password, 12);

        const userCreated = await User.create({
            name,
            age,
            email,
            password: hashPassword
        });
        const token = createToken(userCreated._id, email);

        res.cookie("token", token, cookieOption);

        res.status(201).json({
            message: "User created SuccessFully",
            name,
            age,
            email
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server error"
        })
    }
}

export const login = async (req, res) => {
    try {

        const result = loginSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: result.error.issues[0].message
            })
        }

        const { email, password } = result.data;

        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(401).json({ message: "Invalide Credentials" })
        }

        const isMatch = await bcrypt.compare(password, existingUser.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalide Credentials" })
        }

        const token = createToken(existingUser._id, email);

        res.cookie("token", token, cookieOption);

        res.status(200).json({
            message: "User Logged in SuccessFully",
            name: existingUser.name,
            age: existingUser.age,
            email: existingUser.email,
            usage: existingUser.usage
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export const logout = async (req, res) => {

    try {
        if (req.token) {
            const token = req.token;
            const payload = req.tokenPayload;

            const currentTime = Math.floor(Date.now() / 1000);
            const remainingTime = payload.exp - currentTime;

            if (remainingTime > 0) {
                await redisClient.set(`blocklist:${token}`, "blocked", { EX: remainingTime });
            }
        }
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
        })

        res.status(200).json({
            message: "User Logged Out Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export const profile = async (req, res) => {
    try {
        res.status(200).json({
            name: req.user.name,
            age: req.user.age,
            usage: req.user.usage,
            email: req.user.email
        })

    }
    catch (err) {

        console.log(err);
        res.status(500).json({
            message: "Internal Server error"
        })
    }
}

export const DeleteUser = async (req, res) => {
    try {
        const userId = req.user._id;

        await Message.deleteMany({ userId })
        await Chat.deleteMany({ userId })
        await User.deleteOne({ _id: userId })

        res.clearCookie("token", {
            httpOnly: true,
            secure: false
        })

        res.status(200).json({
            message: "Account deleted successfully"
        });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            messages: "Internal Server Error"
        })
    }


}