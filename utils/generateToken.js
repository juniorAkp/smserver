import jwt from "jsonwebtoken";

export const generateToken = async (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_TOKEN, {
    expiresIn: "365d",
  });
  return token;
};
