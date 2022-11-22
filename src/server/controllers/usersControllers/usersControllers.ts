import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import type { RegisterDataCredentials } from "../../types.js";
import User from "../../../database/models/User.js";
import CustomError from "../../../CustomError/CustomError.js";

export const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password, email } = req.body as RegisterDataCredentials;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    res.status(201).json({ user: { id: newUser._id, username, email } });
  } catch (error: unknown) {
    const errorObject = error as Error;

    let message = "Something went wrong with the user creation";

    if (errorObject.message.includes("duplicate key error")) {
      message = "Database error: duplicate key";
    }

    const customError = new CustomError(errorObject.message, 409, message);

    next(customError);
  }
};
