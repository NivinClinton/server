import { addImage, deleteImage, getAllimages, updateImage } from "../controllers/imageController.js"
import express from 'express'

const imageRouter = express.Router()

imageRouter.post('/addimage', addImage)
imageRouter.get('/', getAllimages)
imageRouter.put("/update/:id",updateImage);
imageRouter.delete("/delete/:id",deleteImage);




export default imageRouter
