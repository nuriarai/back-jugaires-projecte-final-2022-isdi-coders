import environtment from "../../../loadEnvirontment.js";
import type { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { Credentials, RegisterDataCredentials } from "../../types.js";
import User from "../../../database/models/User.js";
import CustomError from "../../../CustomError/CustomError.js";

interface UserTokenPayload extends JwtPayload {
  id: string;
  username: string;
}

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

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body as Credentials;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      const error = new CustomError("User not found", 401, "Wrong credentials");
      next(error);
      return;
    }

    // Mirar throw new error
    if (!(await bcrypt.compare(password, user.password))) {
      const error = new CustomError(
        "Password incorrect",
        401,
        "Wrong credentials"
      );
      next(error);
      return;
    }

    const tokenPayload: UserTokenPayload = {
      id: user._id.toString(),
      username,
    };

    const token = Jwt.sign(tokenPayload, environtment.secret, {
      expiresIn: "2d",
    });

    res.status(200).json({ token });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Login error"
    );

    next(customError);
  }
};
