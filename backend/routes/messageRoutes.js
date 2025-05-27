 const express=require("express");
const isAuth = require("../middlewares/isAuth");
const {sendMessage,getAllMessages, getAllChats} = require("../controllers/messageController");
 const router=express.Router();
 router.post("/",isAuth,sendMessage);
 router.get("/:id",isAuth,getAllMessages);
 module.exports=router;