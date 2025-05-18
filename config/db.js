import mongoose from "mongoose";

export const setDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected");
  } catch (error) {
    console.log("setDb error:", error.message);
  }
};
