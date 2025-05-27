const Post = require("../models/postModel");
const User = require("../models/userModel");
const cloudinary = require("cloudinary");
const getDataurl = require("../utils/urlGenerator");

const newPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const ownerId = req.user._id;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded or incorrect field name" });
        }
        const fileUrl = getDataurl(file);
        const type = req.query.type;
        if (!["post", "reel"].includes(type)) {
            return res.status(400).json({ message: "Invalid post type" });
        }
        let options = {};
        if (type === "reel") {
            options.resource_type = "video"; 
        }
        const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content, options);
        if (!myCloud.secure_url) {
            return res.status(500).json({ message: "Cloudinary upload failed" });
        }

        const post = await Post.create({
            post: {
                id: myCloud.public_id,
                url: myCloud.secure_url,
            },
            caption,
            owner: ownerId,
            type,
        });

        return res.status(201).json({
            message: "Post created successfully",
            post,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const deletePost=async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        if(!post) return res.status(404).json({
            message:"no post available",
        })
        if(post.owner.toString()!==req.user._id.toString()) return res.status(403).json({
            message:"Unauthorized", 
        })
        await cloudinary.v2.uploader.destroy(post.post.id);
        await post.deleteOne();
        return res.json({
            message:"post deleted sucessfully"
        })
    }catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
const getAllPosts=async(req,res)=>{
    try{
      const posts=await Post.find({type:"post"}).sort({createdAt:-1}).populate("owner","-password").populate({
        path:"comments.user",
        select:"-password",
      });
      const reels=await Post.find({type:"reel"}).sort({createdAt:-1}).populate("owner","-password").populate({
        path:"comments.user",
        select:"-password",
      });
      return res.json({
        posts,reels,
      })

    }catch (error) {
        return res.status(500).json({ message: error.message });
    }

}
const likeUnlikePost=async(req,res)=>{
    try{
       const post=await Post.findById(req.params.id);
       if(!post) return res.status(404).json({
        message:"no post available",
       })
       if(post.likes.includes(req.user._id)){
          const indexOflike=post.likes.indexOf(req.user._id);
          post.likes.splice(indexOflike,1);
          await post.save();
          return res.json({
            message:"post disliked",
          })
       }
       else{
          post.likes.push(req.user._id);
          await post.save();
          return res.json({
            message:"post liked",
          })
       }
    }
    catch(error){
      return res.status(500).json({ message: error.message });
    }
}
const commentonPost=async(req,res)=>{
    try{
       const post=await Post.findById(req.params.id);
       if(!post) return res.status(404).json({
        message:"no post available",
       })
       const {comment}=req.body;
       post.comments.push({
         user:req.user._id,
         name:req.user.name,
         comment
       })
       await post.save();
       return res.json({
        message:"comment added",
       })
    }
    catch(error){
        return res.status(500).json({ message: error.message });
    }
}
const deleteComment=async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
       if(!post) return res.status(404).json({
        message:"no post available",
       })
       if (!req.body.commentId) {
        return res.status(404).json({
            message: "Please give comment id"
        });
        }
    const commentIndex = post.comments.findIndex(
        (item) => item._id.toString() === req.body.commentId.toString()
    );

    if (commentIndex === -1) {
        return res.status(400).json({
            message: "Comment not found"
        });
    }
    const comment = post.comments[commentIndex];
    if (post.owner.toString() === req.user._id.toString() || comment.user.toString() === req.user._id.toString()) {
        post.comments.splice(commentIndex, 1);
        await post.save(); 
        return res.status(200).json({
            message: "Comment deleted successfully"
        });
    } else {
        return res.status(403).json({
            message: "Unauthorized to delete this comment"
        });
    }
    }
    catch(error){
        return res.status(500).json({ message: error.message });
    }
}
const editCaption=async(req,res)=>{
    try{
       const post=await Post.findById(req.params.id);
       if(!post) return res.status(404).json({
        message:"no post available",
       })
       if(post.owner.toString()!==req.user._id.toString()) return res.status(403).json({
        message:"Unauthorized", 
      })
      post.caption=req.body.caption;
      await post.save();
      return res.json({
        message:"caption updated",
      })
    }
    catch(error){
        return res.status(500).json({ message: error.message });
    }
}
const follwingposts=async(req,res)=>{
    try{
        const followings=req.user.followings;
        const posts=await Post.find({owner: { $in: followings }, type:"post"}).sort({createdAt:-1}).populate("owner","-password").populate({
            path:"comments.user",
            select:"-password",
          });
          const reels=await Post.find({owner: { $in: followings },type:"reel"}).sort({createdAt:-1}).populate("owner","-password").populate({
            path:"comments.user",
            select:"-password",
          });
          return res.json({
            posts,reels,
          })
    }
    catch(error){
        return res.status(500).json({ message: error.message });
    }
}
module.exports = {newPost,deletePost,getAllPosts,likeUnlikePost,commentonPost,deleteComment,editCaption,follwingposts};
