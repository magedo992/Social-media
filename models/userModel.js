const mongoose=require('mongoose');
const userschema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"your name is required"]
    },
    email:{
        type:String,
        required:[true,"your email is required"]
    },
    
    age:{
        type:Number,
        required:[true,"your age is required"],
        min:18
    },
    userImage:{
        type:String,
        default:"default.jpg"

    },
    password:{
        type:String,
        required:true,
        min:8
    },
    token:String,
    following:[{type:mongoose.Types.ObjectId,ref:'User'}],
    followers:[{type:mongoose.Types.ObjectId,ref:'User'}],
    bio:{
        type:String
    },
    resetToken:{
        type:String,
        default:undefined
    },
    resetTokenExpire:{
        type:Date,
        default:undefined
    },active:{
        type:Boolean,
        default:false
    }
})

module.exports=mongoose.model('User',userschema);