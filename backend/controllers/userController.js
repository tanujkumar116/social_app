const User = require("../models/userModel");
const getDataurl = require("../utils/urlGenerator");
const cloudinary =require("cloudinary");
const bcrypt=require("bcrypt");
const myProfile = async (req, res) => {
    try {
        // ✅ Correct way to access user ID
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json(user);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
const UserProfile=async(req,res)=>{
    try{
       const user=await User.findById(req.params.id).select("-password");
       if(!user) return res.status(404).json({
        message:"User not found"
       })
       return res.json(user);
    }
    catch(error){
        return res.status(500).json({
            message: error.message,
        });
    }
}
const followandUnfollowuser=async(req,res)=>{
    try{
         const user=await User.findById(req.params.id);
         const logedinuser=await User.findById(req.user._id);
         if(!user) return res.status(404).json({
            message:"User not found"
           });
        if(user._id.toString() === logedinuser._id.toString()) return res.status(400).json({
            message:"you can't folow your self",
        })
        if(user.followers.includes(logedinuser._id)){
            const indexfollowing=logedinuser.followings.indexOf(user._id);
            const indexfollower=user.followers.indexOf(logedinuser._id);
            user.followers.splice(indexfollower,1);
            logedinuser.followings.splice(indexfollowing,1);
            await user.save();
            await logedinuser.save();
            return res.json({
                message:"User unfollowed",
            })
        }
        else{
             user.followers.push(logedinuser._id);
             logedinuser.followings.push(user._id);
             await user.save();
            await logedinuser.save();
            return res.json({
                message:"User followed",
            })
        }
         
    }
    catch(error){
        return res.status(500).json({
            message: error.message,
        });
    }
}
const userfollowerandfollowings=async(req,res)=>{
    try{
         const user=await User.findById(req.params.id).select("-password").populate("followers", "name email profilePic") // Populate followers
         .populate("followings", "name email profilePic");;
         if(!user) return res.status(404).json({
            message:"User not found"
           });
         const followers=user.followers;
         const followings=user.followings;
         return res.json({
            followers,followings,
         })
    }
    catch(error){
        return res.status(500).json({
            message: error.message,
        });
    }
}
const Updateprofile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { name } = req.body;
        console.log("get name",name);
        if (name) {
            user.name = name;
        }
        const file = req.file;
        if (file) {
            const fileurl = getDataurl(file);
            if (!fileurl || !fileurl.content) {
                return res.status(400).json({ message: "Invalid file data" });
            }
            if (user.profilePic?.id) {
                await cloudinary.v2.uploader.destroy(user.profilePic.id);
            }
            const myCloud = await cloudinary.v2.uploader.upload(fileurl.content);

            user.profilePic = {
                id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        await user.save();
        return res.json({ message: "User profile updated" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const Updatepassword=async (req, res) => {
    try{
        const user=await User.findById(req.user._id);
        const {oldpassword,newpassword}=req.body;
        console.log(oldpassword);
        console.log(newpassword);
        const comparePassword=await bcrypt.compare(oldpassword,user.password);
        if(!comparePassword) return res.status(400).json({
            message:"Incorrect password",
        })
        user.password=await bcrypt.hash(newpassword,10);
        await user.save();
        return res.json({
            message:"password updated", 
        })


    }catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {myProfile,UserProfile,followandUnfollowuser,userfollowerandfollowings,Updateprofile,Updatepassword};
