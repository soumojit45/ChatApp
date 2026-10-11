// database is connected or not 

import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async ()=>{
    await mongoose.connect(process.env.MONGO_URL)
    console.log("Database connected successfully ")
}

export default connectDB;