const express=require('express');
const router=express.Router();
const verifaytoken=require('../middelware/verifayToken');
const postController=require('../controller/postController');
const LikeController=require('../controller/likesControlles');
const uploadimage=require('../middelware/uploadimage');
const multer=require('multer');
const upload=multer();

router.post('/create',verifaytoken,uploadimage.uploadImage,uploadimage.resizeImage('Post',2048 ,2048 ),postController.createPost);
router.get('/',postController.getallPosts);

router.put('/post/:id',verifaytoken,uploadimage.uploadImage,uploadimage.resizeImage('Post',2048 ,2048 ),postController.updatePost).delete('/post/:id',verifaytoken,postController.deletePost);
router.post('/post/like/:postId',verifaytoken,LikeController.likePost);



module.exports=router;