import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/userRoutes.js'

dotenv.config()

const app = express()

app.use(express.json());

app.use('/user', userRouter)
const url= `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.lkwbno6.mongodb.net/?retryWrites=true&w=majority`


mongoose
    .connect(url,{
        useNewUrlParser: true,      
        useUnifiedTopology: true,       
      })
    .then(() => app.listen(8000))
    .then(() => console.log("mongoDB connected and listen to 8000"))
    .catch((err) => console.log(err));
