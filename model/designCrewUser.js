import mongoose from "mongoose";

const Schema = mongoose.Schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    imagesArray: [{ type: mongoose.Types.ObjectId, ref: "Images", required: true }]
   
    

})

export default mongoose.model("DesignCrewUser", userSchema)