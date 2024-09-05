const mongoose=require('mongoose');
const user=require('./userModel');
const Like=require('./likesModel');
const Comment=require('./commentModel');
const {ErrorHandler}=require('../utils/ErrorHandler');
const postschema=new mongoose.Schema({
    title:{
        type:String,
    },
    Image:{
        type:String,
        
    },
    Userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        
    },
    comments:[{type:mongoose.Types.ObjectId,ref:'Comment'}],
    likes:[{type:mongoose.Types.ObjectId,ref:'User'}],
    createdOn:{ type:Date,default:Date.now()}
    
},{timestamps:true});

postschema.pre('deleteMany', { document: true, query: false }, async function(next) {
    try {
        await Like.deleteMany({ post: this._id });
       // await Comment.deleteMany({ post: this._id }); 
        next();
    } catch (err) {
        next(new ErrorHandler(err.message, 400)); 
    }
});


module.exports=mongoose.model('Post',postschema);