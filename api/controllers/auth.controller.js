import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({ message: "Sign up success!" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const isValidPassword = await bcrypt.compare(password, validUser.password);
    if (!isValidPassword) {
      return next(errorHandler(401, "wrong credentials"));
    }
    const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET,);
    const { password: hashedPassword, ...rest } = validUser._doc;
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    res.cookie("access_token", token, { httpOnly: true, expires:expires}).status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
