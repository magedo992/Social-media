const express = require('express');
const mongoose=require('mongoose');
require('dotenv').config();
const userRouter=require('./routes/useRoute');
const postRoute=require('./routes/postRoute');
const LikeRoute=require('./routes/likeRoute');
const commentRoute=require('./routes/commentRoute');
const cors=require('cors');
const path=require('path');


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/upload', express.static(path.join(__dirname, 'upload')));


app.use('/api',userRouter);
app.use('/v1/api',postRoute);
app.use('/api/comment',commentRoute)

app.use((err, req, res, next) => {
  

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

 
  const sanitizedMessage = process.env.NODE_ENV === 'production' 
    ? 'An error occurred. Please try again later.' : message;
    
    

  res.status(statusCode).json({ error:sanitizedMessage });
});
mongoose.connect(process.env.DB_url,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
  console.log("connect success");
  
}).catch((err)=>{
  if(err)console.error("there is error ",err);
  
})

app.all('*',(req,res,next)=>{
  res.status(404).json({"status":"fail","messgae":"can not found this route"})
})
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
