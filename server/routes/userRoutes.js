import express from "express";
import { checkAuth, login, signup, updateProfile, searchUsers, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getFriendRequests, unfriendUser } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkAuth);

userRouter.get("/search/:username", protectRoute, searchUsers);
userRouter.post("/request/send", protectRoute, sendFriendRequest);
userRouter.post("/request/accept", protectRoute, acceptFriendRequest);
userRouter.post("/request/reject", protectRoute, rejectFriendRequest);
userRouter.get("/requests", protectRoute, getFriendRequests);
userRouter.post("/unfriend", protectRoute, unfriendUser);

export default userRouter;