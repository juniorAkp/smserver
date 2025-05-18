import express from "express";
import {
  forgotPwd,
  login,
  register,
  resendVerificationToken,
  resetPwd,
  verifyToken,
} from "../controllers/auth.js";

export const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify", verifyToken);
router.post("/forgot-password", forgotPwd);
router.post("/reset-password", resetPwd);
router.post("/resend-token", resendVerificationToken);
