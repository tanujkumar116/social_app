const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(403).json({ message: "Unauthorized access, token missing" });
        }

        let decodedData;
        try {
            decodedData = jwt.verify(token, process.env.JWT_SEC);
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        // ✅ Declare 'user' before using it
        let user = null; // Initialize user as null
        user = await User.findById(decodedData.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = isAuth;
