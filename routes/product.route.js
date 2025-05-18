import express from "express";
import { createProduct, upload } from "../controllers/product.js";

export const router = express.Router();

router.post("/upload", upload.single("image"), createProduct);
