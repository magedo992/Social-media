const postModel=require('../models/post.model');
const asyncWapper=require('../middelware/asyncwapper');
const {ErrorHandler}=require('../utils/ErrorHandler');
const commentModel = require('../models/commentModel');
const fs=require('fs');

const path=require('path');
const upload = require('../middelware/uploadimage');
const cloudinary=require('../utils/cloudinary');

exports.createPost=asyncWapper(async (req,res)=>{
const {title}=req.body;

let image='';


const post=await postModel.create({title:title,Userid:req.user.id ,Image:req.file?req.file.filename:null});
res.status(201).json({"status":"success","data":post});
});

exports.getpost=asyncWapper(async (req,res)=>{
    const post=await postModel.findOne({_id:req.params.id});
    if(!post)
    {
      return res.status(404).json({"status":"fail","message":"cannot find the post"});
    }
    res.status(200).json({"status":"sccuss","data":post});
});

exports.updatePost=asyncWapper(async (req,res,next)=>{
    const title=req.body;
    
    
    
    const updatedImage=req.file?req.file.filename:null;

    const post=await postModel.findById(req.params.id);
    
    if(!post){
        return new ErrorHandler("connot find this post",404);
    }
    if(req.user.id!=post.Userid)
    {
        return next(new ErrorHandler('you cannot edit this post',401));
    }
    if(post.Image&&updatedImage)
    {
        const oldImage=path.join(__dirname,"../upload/postImages",post.Image);
        fs.unlink(oldImage,(err)=>{
            if(err)next(new ErrorHandler(err.message,400));
        })
    }
    post.Image=updatedImage;
    post.title=title;
   await post.save();
    res.status(200).json({
        "status":"success",
        "message":"update success"
    })
});

exports.deletePost = asyncWapper(async (req, res, next) => {
    const post = await postModel.findById(req.params.id);
    
    if (!post) {
        return next(new ErrorHandler("Cannot find this post", 404));
    }
    
    if (req.user.id != post.Userid) {
        return next(new ErrorHandler('You cannot delete this post', 401));
    }

   
    await commentModel.deleteMany({ post: req.params.id });
    
 
    await post.deleteOne();

    
    if (post.Image) {
        const imagePath = path.join(__dirname, "../", "upload", "postImages", post.Image);
        
        fs.unlink(imagePath, (err) => {
            if (err) {
                return next(new ErrorHandler(`Error deleting image: ${err.message}`, 500));
            }
        });
    }

    res.status(200).json({
        "status": "success"
    });
});


exports.getallPosts=exports.getAllPosts = asyncWapper(async (req, res) => {
    try {
        const posts = await postModel.find({ },{ "__v": false});

        if (!posts || posts.length === 0) {
            return res.status(404).json({ "status": "fail", "message": "No posts created yet" });
        }

        res.status(200).json({ "status": "success", "data": posts });
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ "status": "error", "message": "Internal Server Error" });
    }
});