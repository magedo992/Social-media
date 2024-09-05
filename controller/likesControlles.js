const PostModel=require('../models/post.model');

const {ErrorHandler}=require('../utils/ErrorHandler');
const asyncWapper=require('../middelware/asyncwapper');
const postModel = require('../models/post.model');
const asyncwapper = require('../middelware/asyncwapper');
const { rawListeners } = require('../models/userModel');

exports.likePost=asyncWapper(async (req,res,next)=>{
    const Post=await postModel.findOne({_id:req.params.postId});
   const userId =req.user.id;
    if(!userId )
    {
        return next(new ErrorHandler("you must login", 401));
    }
    if(!Post)
    {
        return next(new ErrorHandler("Post not found", 404));
    }
    if(Post.likes.includes(userId ))
    {
       await Post.updateOne({$pull:{likes:req.user.id}});
        
       return res.status(200).json({"status":"success","message":"unliked successed"});
    }
    Post.likes.push(userId);
    await Post.save();
    res.status(200).json({status:"success","message":"liked success"});
})

