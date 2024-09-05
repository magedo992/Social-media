const {ErrorHandler}=require('../utils/ErrorHandler');
const CommentModel=require('../models/commentModel');
const asyncWapper=require('../middelware/asyncwapper');
const post=require('../models/post.model');
const commentModel = require('../models/commentModel');
const postModel = require('../models/post.model');
const { deleteOne } = require('../models/userModel');
const { array } = require('../middelware/uploadimage');
const userModel = require('../models/userModel');

exports.addcomment=asyncWapper(async (req,res,next)=>{
    const content=req.body.content;
    if(!content)
       return next(new ErrorHandler("can not comment empty",421));

const Post=await postModel.findOne({_id:req.params.postId});
    
    
    if(!Post)
        return next( new ErrorHandler("that post is not found",404))
    
    const comment=await commentModel.create({
        content:content,user:req.user.id,
        post:req.params.postId
    })
    if(!comment)
    return next(new ErrorHandler("there is error"),400);
    Post.comments.push(comment._id);
    await Post.save();




    

    return res.status(201).json({"status":"success","data":{
        comment:comment
    }});


});
exports.deleteComment=asyncWapper(async (req,res,next)=>{

 
    const comment=await CommentModel.findById(req.params.commentId);
  
    
 if(!comment)
 {
 return   next(new ErrorHandler("the comment not found",404));
 }
 const post=await postModel.findById(comment.post);
 

 
 if(req.user.id!=comment.user||post.Userid!=req.user.id)
 {
    return next(new ErrorHandler('you can not delete this comment',401));
 }
 await comment.deleteOne();
 res.status(200).json({"status":"successed"});

});
exports.getallcomment=asyncWapper(async (req,res,next)=>{
    const post=await postModel.findById(req.params.postId);
    const comments=await commentModel.find({post:req.params.postId},{'__v':false});
    const user= await userModel.findById(post.Userid,{'__v':false,'token':false,'password':false,
        'email':false,'age':false,followers:false,following:false});
    
    if(!post)
    {
        return next(new ErrorHandler("can not found this post",404))
    }
    if(!user)
    {
        return next(new ErrorHandler("can not found this user",404));
    }
    
    
    if(comments.length==0)
        return next(new ErrorHandler("not comment yet",404));

    res.status(200).json({"status":"success","data":{comments:comments,post:post,user:user}});
});
exports.updateComment=asyncWapper(async (req,res,next)=>{
    const content=req.body.content;
    const comment=await CommentModel.findById(req.params.commentId);

    if(!comment)
        return next(new ErrorHandler("can not found this comment",404));
    if (comment.user.toString() !== req.user.id) {
        return next(new ErrorHandler('You cannot edit this comment', 401));
    }
    comment.content=content;
    
 
   await comment.save();

   res.status(200).json({"status":"updated successed"});
    
})
