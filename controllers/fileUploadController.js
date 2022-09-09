
import multer from "multer";

export const fileUpload = async (req, res, next) => {
    

    try {
        const fileStorageEngine = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, "./images");
            },
            filename: (req, file, cb) => {
                cb(null, Date.now() + " -- " + file.originalname);
            },
        });
        const upload = await multer({ storage: fileStorageEngine });
        await upload.single("image")
        return res.send("uploaded")
    } catch (error) {

    }
}