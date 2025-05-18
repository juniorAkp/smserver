import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./emailTemp.js";
import { transporter, sender } from "../config/email.js";

export const sendVerificationEmail = async (email, token) => {
  try {
    transporter.sendMail({
      from: sender.email,
      to: email,
      text: "Verify",
      subject: "verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", token),
    });
  } catch (error) {
    console.log("error sending mail", error.message);
  }
};

export const sendWelcomeEmail = async (email, username) => {
  try {
    transporter.sendMail({
      from: sender,
      to: email,
      text: "Welcome",
      subject: "Welcome to My World",
      html: WELCOME_EMAIL_TEMPLATE.replace("{userName}", username),
    });
  } catch (error) {
    console.log("error sending mail", error.message);
  }
};

export const sendPasswordResetEmail = async (email, token) => {
  try {
    transporter.sendMail({
      from: sender,
      to: email,
      subject: "Your Password Reset Code",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetCode}", token),
    });
  } catch (error) {
    console.log("error sending password reset email:", error.message);
  }
};

export const sendPasswordResetSuccessEmail = async (email) => {
  try {
    transporter.sendMail({
      from: sender,
      to: email,
      subject: "Your Password Has Been Reset",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
    console.log("Password reset success email sent");
  } catch (error) {
    console.log("Error sending success email:", error.message);
  }
};
