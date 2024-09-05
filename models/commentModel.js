const mongoose=require('mongoose');
// const { create } = require('./userModel');  

const commentSchema=new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    post:{
        type:mongoose.Types.ObjectId,
        ref:'Post',
        required:["this is required",true]
    },
    content:{
        type:String,required:true
    },
    createdAt:{
        type:Date,default:Date.now()
    }
});
commentSchema.index({ post: 1 }, { cascadeDelete: true });

module.exports=mongoose.model('Comment',commentSchema);