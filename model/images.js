import mongoose from "mongoose";
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref : "DesignCrewUser",
    required: true,
  },
});
export default mongoose.model("Images", imageSchema);
