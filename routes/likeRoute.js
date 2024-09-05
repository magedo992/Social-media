const likeController=require('../controller/likesControlles');

const verifayToken=require('../middelware/verifayToken');
const express=require('express');
const router=express.Router();

router.post('post/:postId',verifayToken,likeController.likePost);

module.exports=router;