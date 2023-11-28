import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newUser = new User({ username, email, password:hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({ message: "Signup success!" });
  } catch (error) {
    next(error);
  }
};
