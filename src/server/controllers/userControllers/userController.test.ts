import mongoose from "mongoose";
import bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import User from "../../../database/models/User.js";
import CustomError from "../../../CustomError/CustomError.js";
import { userRegister } from "./userControllers.js";

beforeEach(() => {
  jest.clearAllMocks();
});

const req: Partial<Request> = {};
const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const next = jest.fn();

describe("Given a registerUser controller", () => {
  describe("When it receives a request with an username Maria, a password 12345 & a email maria@maria.cat", () => {
    test("Then it should be invoked its method status with a code of 201 and its method json wiht the data supplied", async () => {
      const user = {
        username: "Maria",
        password: "12345",
        email: "maria@maria.cat",
      };
      const expectedStatus = 201;

      req.body = user;
      const userId = new mongoose.Types.ObjectId();
      bcrypt.hash = jest.fn().mockResolvedValueOnce(user.password);
      User.create = jest.fn().mockResolvedValueOnce({ ...user, _id: userId });

      await userRegister(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenLastCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({
        user: {
          username: user.username,
          email: user.email,
          id: userId,
        },
      });
    });
  });

  describe("when it receives a request with an existing user,", () => {
    test("Then it should be invoked its method status with a code of 409 and its mehod json with a message of 'Database error: duplicate key", async () => {
      const user = {
        username: "Maria",
        password: "123456",
        email: "maria@maria.cat",
      };
      const expectedStatus = 409;
      const expectedMessage = "Database error: duplicate key";
      const expectedError = new Error(expectedMessage);
      const message = "Something went wrong with the user creation";
      req.body = user;

      bcrypt.hash = jest.fn();
      User.create = jest.fn().mockRejectedValue(expectedError);

      await userRegister(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(
        new CustomError(expectedMessage, expectedStatus, message)
      );
    });
  });
});
