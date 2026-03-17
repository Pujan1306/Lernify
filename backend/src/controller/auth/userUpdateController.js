import { dbConnect } from "../../lib/dbConnect.js";
import UserModel from "../../model/user.js";
import fs from "fs";

const UpdateUserProfileImage = async (req, res) => {
    await dbConnect();
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Profile image is required" });
        }
        const id = req.user._id; 
        
        const protocol = req.headers["x-forwarded-proto"] || req.protocol;
        const host = req.get("host"); 
        const baseUrl = `${protocol}://${host}`;
        const fileUrl = `${baseUrl}/uploads/profileImage/${req.file.filename}`;
   
        const user = await UserModel.findByIdAndUpdate(
            id, 
            { profileImage: fileUrl },
            { new: true }
        ).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        return res.status(200).json({ 
            success: true, 
            message: "Profile image updated successfully",
            user: user
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Failed to update profile image" , user})
    }
}

export default UpdateUserProfileImage;
