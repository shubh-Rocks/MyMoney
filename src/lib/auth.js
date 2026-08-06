import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUND = 13;

export const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUND);
};

export const verifyPassword = async (password, hashedPasword) => {
  return bcrypt.compare(password, hashedPasword);
};

export const generateToken = async (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
};

export const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};
