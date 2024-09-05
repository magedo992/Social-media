const multer=require('multer');
const {ErrorHandler}=require('../utils/ErrorHandler');
const sharp=require('sharp');
const storage=multer.memoryStorage();
const filefiler=(req,file,cb)=>{
    if(file.mimetype.startsWith('image'))
        cb(null,true);
    else cb(new ErrorHandler('you should input an image',false));
}

const upload= multer({
    storage:storage,
    fileFilter:filefiler
});
exports.uploadImage=upload.single('image');

exports.resizeImage=(folder,imageHigh,imageWidth)=>{
   return async (req,res,next)=>{
        if(!req.file)
            return next();
        req.file.filename=`images-${Date.now()}.jpeg`
       await sharp(req.file.buffer).resize(imageHigh,imageWidth)
        .toFormat('jpeg')
        .jpeg({quality:90}).toFile(`upload/${folder}/${req.file.filename}`)
     next();   
    }
}


 

