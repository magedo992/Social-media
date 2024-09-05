const userModel=require('../models/userModel');
const asyncWapper=require('../middelware/asyncwapper');
const genrateToken=require('../utils/genrateToken');
const bcrypt=require('bcrypt');
const fs=require('fs');
const path=require('path');
const upload = require('../middelware/uploadimage');
const {ErrorHandler}=require('../utils/ErrorHandler');
const cloudinary=require('../utils/cloudinary');
const crypto=require('crypto');
const sendEmail = require('../utils/EmailSender');
const { TokenExpiredError } = require('jsonwebtoken');
const PostModel=require('../models/post.model');


exports.signup=asyncWapper(async (req,res,next)=>{
    const{email,password,name,age}=req.body;
 
     
    let a=false;
    if(!email||!password||!name||!age)
    {
     
        return res.status(400).json({message:"you should pass all feldis"});
    }
    const findUser=await userModel.findOne({email:email});
    
    if(findUser)
    { 
        
       return  res.status(400).json({message:"this user is already exist"});  

}
    if(age<18)
    {
       
       return  res.status(400).json({message:"the age must be more than 18"});}
       let image='';
    const hashedpassword=await bcrypt.hash(password,10);
    
    
    
    const user=await new userModel({email,age,password:hashedpassword,name,userImage:image||'default.jpg'});
  const token = genrateToken.genrateToken({id:user._id});
  user.token=token;
    await user.save()
    if(user)
        res.status(201).json({message:"user has been created",data:user,token});
    
    
});

exports.login=asyncWapper(async (req,res,next)=>{
    const {email,password}=req.body;
    const checkUser= await userModel.findOne({email:email});
    if(!checkUser){
        return res.status(404).json({message:"can not found user"})
    }
    const checkPassword=await bcrypt.compare(password,checkUser.password)
    if(checkPassword)
    {
        const token=genrateToken.genrateToken({id:checkUser._id})
        
        
        
        checkUser.token=token;
        return res.status(200).json({"message":"login success","token":token,user:checkUser});
    }
    else{
        next(new ErrorHandler("incorrectPassword",421))
    }
})
exports.showuer=asyncWapper(async (req,res)=>{
   
   
    const users=await userModel.find();

  res.json({userdata:users})
});

exports.followuser=asyncWapper(async (req,res,next)=>{
    const user=await userModel.findById(req.params.userId);
    const cuurentUser=await userModel.findById(req.user.id);
    
    if(!user)
    {
        return res.status(404).json({"status":"fail","message":"can not found this user"});
    }
    if (req.user.id === req.params.userId) {
        return next(new ErrorHandler('You cannot follow yourself', 400));
    }
    if(user.followers.includes(req.user.id))
     {
        cuurentUser.following.pull(user._id);
        user.followers.pull(req.user.id);
        await user.save();
        await cuurentUser.save();
        return res.status(200).json({"status":"succuessec",message:'unfollowed successfully'})
     }
     user.followers.push(req.user.id);

     cuurentUser.following.push(user._id);
    await user.save();
    await cuurentUser.save();
    res.status(200).json({"status":"successed"})

});


exports.resetPasswordCode = asyncWapper(async (req, res, next) => {
    const { email } = req.body;
    const resetToken = crypto.randomBytes(6).toString('hex');
    const resetTokenExpire = Date.now() + 10 * 60 * 1000;

    const user = await userModel.findOneAndUpdate(
        { email: email },
        { resetToken, resetTokenExpire },
        { new: true }
    );

    if (!user) {
        return next(new ErrorHandler('The user was not found', 404));
    }

    const url = `http://localhost:3000/api/resetPassword/${resetToken}`;
    const options = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'Your Password Reset',
        text: `You requested a password reset. Click this link to reset your password: ${url}`
    };
console.log(email);

    await sendEmail.sendEmail(options);

    res.status(200).json({ message: 'Email sent successfully' });
});

exports.resetPassword = asyncWapper(async (req, res, next) => {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    if (!resetToken) {
        return next(new ErrorHandler('The token is required', 400));
    }

    const user = await userModel.findOne({
        resetToken: resetToken,
        resetTokenExpire: { $gt: Date.now() } 
    });

    if (!user) {
        return next(new ErrorHandler('Invalid or expired code', 400));
    }

     const hashPassword= await bcrypt.hash(newPassword,10); 
    
    user.password = hashPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.status(200).json({ message: 'Password has been updated successfully' });
});

exports.profile=asyncWapper(async (req,res,next)=>{
    const user=await userModel.findById(req.params.userId);
    if(!user)
    {
        return next(new ErrorHandler('no user found',404));
    }
    const posts = await PostModel.find({ userId: req.params.userId });
    if (posts.length === 0) {
        return next(new ErrorHandler('No posts found for this user', 404));
    }
    

    res.status(200).json({message:"success",user:user,posts:posts,
        followers:user.followers.length,
        following:user.following.length, followers: user.followers,
        following: user.following
    });
})