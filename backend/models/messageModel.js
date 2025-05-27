const mongoose=require("mongoose");
const User=require("../models/userModel");
const Chat=require("../models/chatModel");
const messageSchema=new mongoose.Schema({
    chatId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat", 
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User", 
    },
    text:String,
},{timestamps:true});
const Messages=mongoose.model("Messages",messageSchema);
module.exports=Messages; 