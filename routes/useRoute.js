const express=require('express');
const multer=require('multer');
const verifayToken=require('../middelware/verifayToken');
const upload=multer();

const verifaytoken=require('../middelware/verifayToken');
const router=express.Router();
const userController=require('../controller/userController');
const uploadimage=require('../middelware/uploadimage');
router.post('/signup',uploadimage.uploadImage
    ,uploadimage.resizeImage('userProfile',500,500),userController.signup);
router.post('/login',userController.login);
router.get('/getuserdata',verifayToken,userController.showuer);

router.post('/follow/:userId',verifayToken,userController.followuser);

router.post('/forgetpassword',upload.none(),userController.resetPasswordCode);

router.post('/resetPassword/:resetToken',upload.none(),userController.resetPassword);
router.get('/profile/:userId',verifaytoken,userController.profile);

module.exports=router;