import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileUrl: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
    resetPasswordExpires: Date,
    verificationToken: String,
    verificationTokenExpires: Date,
    lastVerificationTokenSent: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
