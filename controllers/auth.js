import {
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../lib/sendEmail.js";
import User from "../model/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "../utils/generateToken.js";

//create user
export const register = async (req, res) => {
  const { email, username, password } = req.body;
  //form validation
  if (!email || !username || !password) {
    return res.status(400).json({ message: "Fill in All Fields." });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be 8 characters or more." });
  }
  try {
    //check email exists
    const emailExt = await User.findOne({ email: email });
    if (emailExt) {
      return res
        .status(400)
        .json({ message: "You already have an account. Login." });
    }
    //hashPassword
    const hshPassword = await bcrypt.hash(password, 12);
    //create verificationToken
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    //create user if there is no email found in database
    const user = await User.create({
      username,
      email,
      password: hshPassword,
      verificationToken: token,
      //expires in a day
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    //send Verification email
    await sendVerificationEmail(email, token);
    //return created user
    return res.status(201).json({
      message: "welcome to our platform",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("register error", error.message);
    return res.status(500).json({ message: "an unknown error occurred" });
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req.body;
  //check if token exists
  if (!token) {
    return res.status(400).json({ message: "please enter your token" });
  }
  try {
    //validate if it's the user's token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "invalid or expired token" });
    }
    // validate user and set token to undefined and save user
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, user.username);
    const userToken = await generateToken(user._id);
    return res
      .status(200)
      .json({ message: "user verification complete", userToken });
  } catch (error) {
    console.log("verification error", error.message);
    return res.status(500).json({ message: "an unknown error occurred" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  //validate form details
  if (!email || !password) {
    return res.status(400).json({ message: "Fill in All Fields." });
  }
  try {
    //check if user exists
    const userExt = await User.findOne({ email: email, isVerified: true });
    if (!userExt) {
      return res.status(400).json({
        message:
          "You do not have an account with us or you are not yet verified",
      });
    }
    //check password
    const isMatch = await bcrypt.compare(password, userExt.password);
    if (!isMatch) {
      return res.status(400).json({ message: "invalid password, try again" });
    }
    //update user last login
    userExt.lastLogin = new Date(Date.now());
    await userExt.save();
    //generate jwt token to authenticate user

    const token = await generateToken(userExt._id);

    return res.status(200).json({
      message: "logged in",
      user: {
        ...userExt._doc,
        password: undefined,
      },
      token,
    });
  } catch (error) {
    console.log("Login error", error.message);
    return res.status(500).json({ message: "an unknown error occurred" });
  }
};

export const forgotPwd = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ message: "please provide your email to reset password" });
  }
  try {
    //check if email exists in db
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "no account with this email found" });
    }
    // set the reset token to the user
    const resetToken = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    //send token to the user
    await sendPasswordResetEmail(user.email, resetToken);
    return res.status(200).json({ message: "reset token sent to your email" });
  } catch (error) {
    console.log("Password error", error.message);
    return res.status(500).json({ message: "an unknown error occurred" });
  }
};

export const resetPwd = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: "fill in a fields" });
  }
  // check token validity
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "invalid token or expired token" });
    }
    //hash the password
    const hshPwd = await bcrypt.hash(password, 10);
    //update user fields
    user.password = hshPwd;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    //send email
    await sendPasswordResetSuccessEmail(user.email);
    //save new user detail
    await user.save();
    return res.status(200).json({ message: "password reset successful" });
  } catch (error) {
    console.log("Reset error", error.message);
    return res.status(500).json({ message: "an unknown error occurred" });
  }
};
export const resendVerificationToken = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "No account with this email found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    // Check cooldown (10 minutes)
    const now = Date.now();
    const cooldown = 1 * 60 * 1000; // 11 minute
    if (
      user.lastVerificationTokenSent &&
      now - user.lastVerificationTokenSent.getTime() < cooldown
    ) {
      const remaining = Math.ceil(
        (cooldown - (now - user.lastVerificationTokenSent.getTime())) / 60000
      );
      return res.status(429).json({
        message: `Please wait ${remaining} minute(s) before requesting a new token.`,
      });
    }

    // Generate new token
    const newToken = Math.floor(1000 + Math.random() * 9000).toString();
    user.verificationToken = newToken;
    user.verificationTokenExpires = new Date(now + 24 * 60 * 60 * 1000); // expires in 1 day
    user.lastVerificationTokenSent = new Date(now);

    await user.save();

    // Send the email
    await sendVerificationEmail(user.email, newToken);

    return res.status(200).json({ message: "Verification token resent" });
  } catch (error) {
    console.log("Resend verification error:", error.message);
    return res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};
