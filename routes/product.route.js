import express from "express";
import {
  createProduct,
  getNewProducts,
  getTopSellingProducts,
  upload,
} from "../controllers/product.js";

export const router = express.Router();

router.post("/upload", upload.single("image"), createProduct);
router.get("/new-product", getNewProducts);
router.get("/top-selling-product", getTopSellingProducts);
