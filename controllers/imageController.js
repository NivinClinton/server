import mongoose from "mongoose";
import designCrewUser from "../model/designCrewUser.js";
import images from "../model/images.js";

export const addImage = async (req, res, next) => {
    const { title, image, user } = req.body;
    let existingUser;
    try {
      existingUser = await designCrewUser.findById(user);
    } catch (err) {
      return console.log(err);
    }
    if(!existingUser){
      return res.status(500).json({message: "unable to find the user by this id"})
    }
    const imageDetails = new images({
      title,  
      image,
      user
    });
    try {
      const session = await mongoose.startSession();
      session.startTransaction();
      await imageDetails.save({session});
      existingUser.imagesArray.push(imageDetails);
      await existingUser.save({session});
      await session.commitTransaction();
  
  
    } catch (err) {
      console.log(err);
      return res.status(500).json({message : err})
    }
    return res.status(200).json({ imageDetails });
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