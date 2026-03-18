import jwt from "jsonwebtoken";

export const protectRoute = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("No token found in Authorization header");
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            _id: decoded._id,
            email: decoded.email,
            name: decoded.name,
        };
        next();
    } catch (error) {
        console.log("Token verification failed:", error.message);
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};