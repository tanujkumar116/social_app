const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
        cb(null, true); // ✅ Accept the file
    } else {
        cb(new Error("Invalid file type. Only images and videos are allowed!"), false);
    }
};

const uploadFile = multer({ storage, fileFilter }).single("file");

module.exports = uploadFile;
