const User = require("../models/userModel");
const getDataurl = require("../utils/urlGenerator");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {
    try {
        const { name, email, password, gender } = req.body;
        const file = req.file; // ✅ Corrected destructuring

        // Validate input
        if (!name || !email || !password || !gender || !file) {
            return res.status(400).json({ message: "Please provide all values" });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Convert file to Data URL
        const fileurl = getDataurl(file);

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Upload image to Cloudinary
        const myCloud = await cloudinary.v2.uploader.upload(fileurl.content);

        // Create new user
        user = await User.create({
            name,
            email,
            password: hashPassword, // ✅ Fixed variable name
            gender,
            profilePic: {
                id: myCloud.public_id,
                url: myCloud.secure_url,
            },
        });

        // Generate authentication token
        generateToken(user._id, res);

        // Send success response
        res.status(201).json({
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User doesn't exist",
            });
        }

        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return res.status(400).json({
                message: "Password not matched, make it correct",
            });
        }

        generateToken(user._id, res);

        return res.json({
            message: "Login successfully",
            user,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
const logoutUser= async(req,res)=>{
     try{
        res.cookie("token","",{maxAge:0})
        return res.json({
            message:"Logout successfully",
        })
     }
     catch(error){
        return res.status(500).json({
            message: error.message,
        });
     }
}


module.exports = { registerUser, loginUser,logoutUser };

