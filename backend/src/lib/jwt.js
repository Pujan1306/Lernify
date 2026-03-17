import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const setToken = (user) => {
    return jwt.sign({ _id: user._id, email: user.email, name: user.name, image: user.image || null }, ENV.JWT_SECRET, {
        expiresIn: "7d",
    });
} 