const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "socialapp",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB connected");

        mongoose.connection.on("error", (err) => {
            console.error("❌ Mongoose error:", err);
        });
    } catch (err) {
        console.error("❌ Initial MongoDB connection failed:", err);
        process.exit(1);
    }
};

module.exports = connectDB;
