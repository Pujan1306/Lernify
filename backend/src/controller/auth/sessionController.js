import { dbConnect } from "../../lib/dbConnect.js";
import UserModel from "../../model/user.js";

export const SessionController = async (req, res) => {
    await dbConnect();
    try {
        const id = req.user?._id;
        if (!id) {
            return res.status(200).json({ success: false, message: "No valid session" });
        }

        const user = await UserModel.findById(id).select('-password');
        if (!user) {
            return res.status(200).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(200).json({ success: false, message: "Session check failed" });
        console.log(error);
    }
}