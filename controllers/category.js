import cloudinary from "../config/cloudinary.js";
import Cart from "../model/Cart.js";
import Category from "../model/Category.js";
export const addCat = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "no name provided" });
  }
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No file uploaded", success: false });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "smsProducts/categories",
    });

    const category = await Category.create({
      name,
      imageUrl: result.secure_url,
    });
    return res.status(201).json({ message: "category created", category });
  } catch (error) {
    console.log("create category error", error.message);
    return res.status(500).json({ message: "an unknown error occurred" });
  }
};

export const getCat = async (req, res) => {
  try {
    const cat = await Category.find();
    if (!cat) return res.status(400).json({ message: "no categories found" });
    return res.status(200).json(cat);
  } catch (error) {
    console.log("get category error", error.message);
    return res.status(500).json({ message: "an unknown error occurred" });
  }
};
