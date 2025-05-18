import express from "express";
import { addToCart, updateCart } from "../controllers/cart.js";
export const router = express.Router();

router.post("/add-cart", addToCart);
router.put("/update-cart/:userId", updateCart);
