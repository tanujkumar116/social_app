const mongoose=require("mongoose");
const User=require("../models/userModel");
const postSchema=new mongoose.Schema({
    caption:String,
    post:{
        id:String,
        url:String,
    },
    type:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User", 
    }
    ],
    comments:[{
        user: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User", 

        },
        name:{
            type:String,
            required:true,
        },
        comment:{
            type:String,
            required:true, 
        }
    }
    ]
})
const Post=mongoose.model("Post",postSchema);
module.exports=Post;
