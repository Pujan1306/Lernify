import mongoose from "mongoose";
import { ENV } from "./env.js";

let connection = {};

export const dbConnect = async () => {
    try {
        if (connection.isConnected) {
            return;
        }
        const db = await mongoose.connect(ENV.MONGODB_URI);
        connection.isConnected = db.connections[0].readyState;
        console.log("Database connected");
    } catch (error) {
        console.log("Database connection failed", error);
    }
}