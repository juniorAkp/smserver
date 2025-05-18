import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import config from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: config,
  params: {
    folder: "smsProducts",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

export default upload;
