import mongoose from "mongoose";
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref :"DesignCrewUser",
    required: true,
  },
});
export default mongoose.model("Images", imageSchema);
