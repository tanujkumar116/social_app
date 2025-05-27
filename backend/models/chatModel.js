const mongoose=require("mongoose");
const User=require("../models/userModel");
const ChatSchema=new mongoose.Schema({
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User", 
    }],
    latestMessage:{
        text:String,
        sender:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }

    }
},{timestamps:true});
const Chat=mongoose.model("Chat",ChatSchema);
module.exports=Chat;