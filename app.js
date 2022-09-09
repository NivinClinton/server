import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'
import cors from "cors";
import uploadRouter from './routes/uploadRoutes.js'
import multer from 'multer'
import ImageModel from './model/images.js'

dotenv.config()

const app = express()

app.use(express.json());
app.use(cors());

app.use('/user', userRouter)
app.use('/images', imageRouter)
app.use('/fileupload', uploadRouter)



const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + " -- " + file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine }).single("image");
app.post("/single", (req,res) => {
 
  upload(req,res,(err)=>{
    if(err){
      console.log(err);
    }else{
      const newImage = new ImageModel({
        title : req.body.title,
        image:{
          data:req.file.filename,
          contentType:'image/png'
        }
      })
      newImage.save().then(()=>res.send("successfully uploaded")).catch(err=>console.log(err))
    }
  })
  res.send(" Single FIle upload success ");
});

const url = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.lkwbno6.mongodb.net/?retryWrites=true&w=majority`


mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => app.listen(8000))
  .then(() => console.log("mongoDB connected and listen to 8000"))
  .catch((err) => console.log(err));
