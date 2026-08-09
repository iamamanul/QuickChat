import User from "../models/User.js";
import jwt from "jsonwebtoken";

const getTokenFromRequest = (req) => {
    const authorizationHeader = req.headers.authorization || req.headers.Authorization;

    if (authorizationHeader?.startsWith("Bearer ")) {
        return authorizationHeader.slice(7).trim();
    }

    return req.headers.token;
};

// Middleware to protect routes
export const protectRoute = async (req, res, next) => {
    try {
        const token = getTokenFromRequest(req);

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(401).json({ success: false, message: error.message });
    }
};