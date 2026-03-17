import { dbConnect } from "../../lib/dbConnect.js";
import UserModel from "../../model/user.js";
import bcrypt from "bcryptjs";

export const RegistrationController = async (req, res) => {
    await dbConnect();
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const emailExist = await UserModel.findOne({ email });
        if (emailExist) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create({
            username,
            email,
            password: hashedPassword,
            profileImage: null,
            type: "credentials"
        });

        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
        console.log(error);
    }
}
