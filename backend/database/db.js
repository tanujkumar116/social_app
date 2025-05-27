const mongoose = require("mongoose");
require("dotenv").config();

const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "socialapp",
        });
        console.log("Database is connected ✅");

        mongoose.connection.on("connected", () => {
            console.log("Mongoose default connection is open ✅");
        });

        mongoose.connection.on("error", (err) => {
            console.error("Mongoose connection error ❌", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("Mongoose connection is disconnected ⚠️");
        });
        
    } catch (error) {
        console.error("Database connection failed ❌", error);
        process.exit(1);
    }
};

module.exports = connectdb;
