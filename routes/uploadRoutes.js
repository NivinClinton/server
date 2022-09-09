import express from  'express'
import multer from  'multer'
import { fileUpload } from '../controllers/fileUploadController.js'

const uploadRouter = express.Router()


uploadRouter.post('/', fileUpload)


export default uploadRouter