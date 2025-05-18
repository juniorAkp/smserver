import express from "express";

export const router = express.Router();
import multer from "multer";
import { addCat, getCat } from "../controllers/category.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/category", upload.single("image"), addCat);
router.get("/get-cat", getCat);
