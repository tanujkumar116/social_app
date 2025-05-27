const Chat = require("../models/chatModel");
const Messages = require("../models/messageModel");

const sendMessage=async(req,res)=>{
    try{
        const {recieverId,message}=req.body;
        const senderId=req.user._id;
        if(!recieverId){
            return res.status(400).json({
                message:"please give reciverid",
            })
        }
        let chat =await Chat.findOne({
            users: { $all:[recieverId,senderId]}, 
        })
        console.log(chat);
        console.log(!chat);
        if(!chat){
            chat=new Chat({
                users:[recieverId,senderId],
                latestMessage:{
                    text:message,
                    sender:senderId,
                },
            })
            await chat.save();
        }
        const newMessage=new Messages({
            chatId:chat._id,
            sender:senderId,
            text:message,
        });
        await newMessage.save(); 
        await chat.updateOne({
            latestMessage:{
                text:message,
                sender:senderId,
            },
        })
        await chat.save();
        return res.status(201).json({
            message:"message sent",newMessage,
        })
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getAllMessages=async(req,res)=>{
    try{
        const id=req.params.id;
        const userId=req.user._id;
        const chat=await Chat.findOne({
            users:{$all:[id,userId]},
        })
        if(!chat) return res.status(404).json({
            message:"no chat available",
        }) 
        const messages=await Messages.find({chatId:chat._id});
        return res.json({
            messages,
        })

    }
    catch (error) {
         return res.status(500).json({ message: error.message });
    }
}
const getAllChats=async(req,res)=>{
    try{
         const chats=await Chat.find();
         return res.json({
            chats,
         })
    }
    catch(error){
        return res.status(500).json({ message: error.message });
    }
}
module.exports={sendMessage,getAllMessages,getAllChats};