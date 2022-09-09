import mongoose from "mongoose";
import multer from "multer";
import designCrewUser from "../model/designCrewUser.js";
import images from "../model/images.js";
import ImageModel from '../model/images.js'

export const addImage = async (req, res, next) => {
  let existingUser;
  let newImage;
  const fileStorageEngine = await multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./images");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + " -- " + file.originalname);
    },
  });
  const upload = await multer({ storage: fileStorageEngine }).single("image");
  

  try {
    existingUser = await designCrewUser.findById(req.params.id);

  } catch (err) {
    return console.log(err);
  }
  if (!existingUser) {
    return res.status(500).json({ message: "unable to find the user by this id" })
  }
  
  await upload(req, res, async (err) => {
    if (err) {
      console.log(err);
    } else {
      newImage = new ImageModel({

        title: req.body.title,
        user: req.params.id,
        image: {
          data: req.file.filename,
          contentType: 'image/png'
        }

      })
      try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await newImage.save({ session });
        existingUser.imagesArray.push(newImage);
        await existingUser.save({ session });
        await session.commitTransaction();
        return res.status(500).json("image added successfully")
      } catch (error) {
       
        return res.status(500).json("unable to add image")
      }

    }
  })
  
};


export const getAllimages = async (req, res, next) => {
  let image;
  try {
    image = await images.find().populate('user');
  } catch (err) {
    console.log(err);
  }
  if (!image) {
    return res.status(400).json({ message: "no images found" });
  }
  return res.status(200).json({ image });
};

export const updateImage = async (req, res, next) => {
  const { title, image } = req.body;
  const imageId = req.params.id;
  let imageDetails;
  try {
    imageDetails = await images.findByIdAndUpdate(imageId, {
      title,
      image,
    });
  } catch (err) {
    console.log(err);
  }
  if (!imageDetails) {
    return res.status(500).json({ message: "unable to find image" });
  }
  return res.status(200).json({ imageDetails });
};
export const deleteImage = async (req, res, next) => {
  const id = req.params.id;
  let image;
  try {
    image = await images.findByIdAndRemove(id).populate('user');
    await image.user.imagesArray.pull(image);
    await image.user.save();
  } catch (err) {
    return console.log(err);
  }
  if (!image) {
    return res.status(404).json({ message: "unable to delete" });
  }
  return res.status(200).json({ message: "successfully deleted" });
};