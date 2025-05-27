const express = require("express");
const connectdb=require('./database/db.js');
const cookieparser=require("cookie-parser");
const {app,server}=require("./socket/socket.js");
const cors = require("cors");
const path=require("path");
require('dotenv').config();
const port = process.env.PORT || 5002; // Default to 5000 if undefined
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow frontend
//using middlewares
app.use(express.json()); 
app.use(cookieparser()); 
const cloudinary=require("cloudinary");
require("dotenv").config();
cloudinary.v2.config({
    cloud_name:process.env.Cloud_name,
    api_key:process.env.Cloudinary_api,
    api_secret:process.env.Cloudinary_secret,
})
connectdb();
server.listen(port, () => {
    console.log(`Server connected on port ${port}`);
});
//importing routes
const userRoutes=require("./routes/userRoutes.js");
const authRoutes=require("./routes/authRoutes.js");
const postRoutes=require("./routes/postRoutes.js");
const messageRoutes=require("./routes/messageRoutes.js");
const isAuth = require("./middlewares/isAuth.js");
const Chat = require("./models/chatModel.js");
const User = require("./models/userModel.js");
//using routes
app.use("/api/user",userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/post",postRoutes);
app.use("/api/message",messageRoutes);
app.get('/api/chats',isAuth,async(req,res)=>{
    try{
        const chats=await Chat.find({
            users:req.user._id,
        }).populate({
            path:"users",
            select:"name profilePic",
        });
        chats.forEach((e)=>{
            e.users=e.users.filter(
                user=>user._id.toString()!==req.user._id.toString()
            )
        })
        return res.json({
           chats,
        })
    }
    catch(error){
        return res.status(500).json({ message: error.message });
    }
})
app.get('/api/userall', isAuth, async (req, res) => {
    try {
        const search = req.query.search || "";

        // Ensure req.user exists before filtering _id
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized request" });
        }

        const users = await User.find({
            name: { $regex: search, $options: "i" }, // Case-insensitive search
            _id: { $ne: req.user._id }, // Exclude the current user
        });

        res.json(users.length > 0 ? users : []); // Ensure an array is always returned
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

const frontendPath = "/home/rgukt/social_app/frontend/dist"; // Full path to frontend build

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});
