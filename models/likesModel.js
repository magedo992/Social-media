const mongoose=require('mongoose');
const likesschema=new mongoose.Schema({
    user:{type:mongoose.Types.ObjectId,
        required:true,
        ref:'User'},
    post:{type:mongoose.Types.ObjectId,
        required:true,ref:'Post'
    }    
})

module.exports=mongoose.model('Like',likesschema);