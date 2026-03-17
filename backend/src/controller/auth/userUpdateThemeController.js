import { dbConnect } from "../../lib/dbConnect.js";
import UserModel from "../../model/user.js";

const UpdateThemeController = async (req, res) => {
    try {
        await dbConnect();
        const id = req.user._id;
        const { theme } = req.body
        if (!id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await UserModel.findByIdAndUpdate(id, { theme }, { new: true }).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "Theme updated successfully", user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export default UpdateThemeController;