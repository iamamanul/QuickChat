import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js"

// Signup a new user
export const signup = async (req, res)=>{
    const { fullName, email, password, bio, username } = req.body;

    try {
        if (!fullName || !email || !password || !bio || !username){
            return res.json({success: false, message: "Missing Details" })
        }
        const userEmail = await User.findOne({email});
        if(userEmail){
            return res.json({success: false, message: "Email already exists" })
        }
        const userUsername = await User.findOne({username});
        if(userUsername){
            return res.json({success: false, message: "Username already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName, email, username, password: hashedPassword, bio
        });

        const token = generateToken(newUser._id)

        res.json({success: true, userData: newUser, token, message: "Account created successfully"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Controller to login a user
export const login = async (req, res) =>{
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({email});

        if (!userData) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if (!isPasswordCorrect){
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(userData._id);

        res.json({success: true, userData, token, message: "Login successful"})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: false, message: error.message})
    }
}
// Controller to check if user is authenticated
export const checkAuth = (req, res)=>{
    res.json({success: true, user: req.user});
}

// Controller to update user profile details
export const updateProfile = async (req, res)=>{
    try {
        const { profilePic, bio, fullName } = req.body;

        const userId = req.user._id;
        let updatedUser;

        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName}, {new: true});
        } else{
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, bio, fullName}, {new: true});
        }
        res.json({success: true, user: updatedUser})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Controller to search users by username or email
export const searchUsers = async (req, res) => {
    try {
        const { username } = req.params; // this can now be username or email
        const currentUserId = req.user._id;

        // Find user by exact username or exact email, excluding self
        const user = await User.findOne({ 
            $or: [{ username }, { email: username }],
            _id: { $ne: currentUserId } 
        }).select("-password");

        if (!user) {
            return res.json({ success: true, user: null, message: "User not found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Controller to send friend request
export const sendFriendRequest = async (req, res) => {
    try {
        const { targetUserId } = req.body;
        const currentUserId = req.user._id;

        const targetUser = await User.findById(targetUserId);
        if (!targetUser) return res.json({ success: false, message: "User not found" });

        if (targetUser.friends.includes(currentUserId)) {
            return res.json({ success: false, message: "Already friends" });
        }

        if (targetUser.friendRequests.includes(currentUserId)) {
            return res.json({ success: false, message: "Request already sent" });
        }

        targetUser.friendRequests.push(currentUserId);
        await targetUser.save();

        res.json({ success: true, message: "Friend request sent" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Controller to get friend requests
export const getFriendRequests = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('friendRequests', '-password');
        res.json({ success: true, requests: user.friendRequests });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Controller to accept friend request
export const acceptFriendRequest = async (req, res) => {
    try {
        const { targetUserId } = req.body;
        const currentUserId = req.user._id;

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser.friendRequests.includes(targetUserId)) {
            return res.json({ success: false, message: "No friend request found" });
        }

        currentUser.friendRequests = currentUser.friendRequests.filter(id => id.toString() !== targetUserId);
        
        if (!currentUser.friends.includes(targetUserId)) {
            currentUser.friends.push(targetUserId);
        }
        if (!targetUser.friends.includes(currentUserId)) {
            targetUser.friends.push(currentUserId);
        }

        await currentUser.save();
        await targetUser.save();

        res.json({ success: true, message: "Friend request accepted" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Controller to reject friend request
export const rejectFriendRequest = async (req, res) => {
    try {
        const { targetUserId } = req.body;
        const currentUserId = req.user._id;

        const currentUser = await User.findById(currentUserId);

        currentUser.friendRequests = currentUser.friendRequests.filter(id => id.toString() !== targetUserId);
        await currentUser.save();

        res.json({ success: true, message: "Friend request rejected" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Controller to unfriend a user
export const unfriendUser = async (req, res) => {
    try {
        const { targetUserId } = req.body;
        const currentUserId = req.user._id;

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        // Remove from each other's friends list
        currentUser.friends = currentUser.friends.filter(id => id.toString() !== targetUserId);
        if (targetUser) {
            targetUser.friends = targetUser.friends.filter(id => id.toString() !== currentUserId.toString());
            await targetUser.save();
        }
        
        await currentUser.save();

        res.json({ success: true, message: "Unfriended successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};