import Product from "../model/Product.js";
import Category from "../model/Category.js";
import mongoose from "mongoose";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });

export const createProduct = async (req, res) => {
  const { name, price, description, category, countInStock } = req.body;
  if (!name || !price || !description || !category || !countInStock) {
    return res.json("All fields required");
  }
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No file uploaded", success: false });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "smsProducts",
    });
    if (!mongoose.isValidObjectId(category)) {
      return res
        .status(400)
        .json({ error: "Invalid category ID", success: false });
    }
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res
        .status(404)
        .json({ error: "Category not found", success: false });
    }
    const product = await Product.create({
      name,
      price,
      description,
      category,
      countInStock,
      imageUrl: result.secure_url,
    });

    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    console.log("Product creation error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getNewProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(50);
    return res.status(200).json(products);
  } catch (error) {
    console.log("Error in new products", error.message);
    return res.status(500).json({ message: "an unknown error occurred" });
  }
};

export const getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await Product.find().sort({ salesCount: -1 }).limit(50);
    res.status(200).json(topProducts);
  } catch (error) {
    console.error("Error fetching top selling products:", error.message);
    res.status(500).json({ message: "Failed to fetch top selling products" });
  }
};

export const getTopRatedProducts = async (req, res) => {
  try {
    const ratedProducts = await Product.find().sort({ rating: -1 }).limit(50);
    res.status(200).json(ratedProducts);
  } catch (error) {
    console.error("Error fetching top rated products:", error.message);
    res.status(500).json({ message: "Failed to fetch top selling products" });
  }
};

export const getLowestPriceProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ price: -1 }).limit(50);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching low price products:", error.message);
    res.status(500).json({ message: "Failed to fetch top selling products" });
  }
};
