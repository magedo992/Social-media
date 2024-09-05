const express=require('express');
const router=express.Router();
const commentController=require('../controller/commentController');
const verifayToken=require('../middelware/verifayToken');
const multer=require('multer');
const upload=multer();


router.post('/:postId',verifayToken,upload.none(),commentController.addcomment);
router.get('/:postId',commentController.getallcomment);
router.delete('/:commentId',verifayToken,commentController.deleteComment);
router.put('/:commentId',verifayToken,upload.none(),commentController.updateComment);

module.exports=router;