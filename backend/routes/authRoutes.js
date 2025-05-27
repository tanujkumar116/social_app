const express = require("express");
const { registerUser, loginUser,logoutUser } = require("../controllers/authController.js"); // ✅ Corrected import
const uploadFile = require("../middlewares/multer.js");

const router = express.Router();

router.post("/register", uploadFile, registerUser); // ✅ Ensure function exists
router.post("/login", loginUser);
router.get("/logout",logoutUser);

module.exports = router;
