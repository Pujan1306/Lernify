import mongoose, {Schema} from "mongoose";

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
        trim: true,
        minLength: [3, "Username must be at least 3 characters"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        lowerCase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"]
    },
    password: {
        type: String,
        minLength: [6, "Password must be at least 6 characters"]
    },
    profileImage: {
        type: String,
        default: null
    },
    type: {
        type: String,
        required: true,
        enum: ["credentials", "oauth"],
        default: "credentials"
    }
}, {
    timestamps: true
})

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema)

export default UserModel