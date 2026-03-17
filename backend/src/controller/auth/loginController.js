import { dbConnect } from "../../lib/dbConnect.js";
import UserModel from "../../model/user.js";
import { setToken } from "../../lib/jwt.js";
import bcrypt from "bcryptjs";

export const LoginController = async (req, res) => {
    await dbConnect();
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const emailExist = await UserModel.findOne({ email });
        if (!emailExist) {
            return res.status(404).json({ success: false, message: "Email not found" });
        }

        const loginType = emailExist.type;

        if (loginType === "oauth") {
            return res.status(400).json({ success: false, message: "Email already exists with Google. Please login with Google" });
        }

        const isPasswordValid = await bcrypt.compare(password, emailExist.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        const user = await UserModel.findById(emailExist._id);

        const token = await setToken(user);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({ success: true, message: "User logged in successfully"});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
        console.log(error);
    }
}
