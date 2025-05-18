import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  imageUrl: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
