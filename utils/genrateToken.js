const jwt=require('jsonwebtoken');

exports.genrateToken=(payload)=>{
const token= jwt.sign(payload,process.env.jwt_secrit,{expiresIn:"30m"});
    return token
}