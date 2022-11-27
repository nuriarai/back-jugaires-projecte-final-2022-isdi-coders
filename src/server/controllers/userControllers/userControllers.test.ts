import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import User from "../../../database/models/User.js";
import CustomError from "../../../CustomError/CustomError.js";
import { userLogin, userRegister } from "./userControllers.js";
import type { Credentials } from "../../types.js";

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
      const userData = {
        username: "Maria",
        password: "12345",
        email: "maria@maria.cat",
      };
      const expectedStatus = 201;

      req.body = userData;
      const userId = new mongoose.Types.ObjectId();
      bcrypt.hash = jest.fn().mockResolvedValueOnce(userData.password);
      User.create = jest
        .fn()
        .mockResolvedValueOnce({ ...userData, _id: userId });

      await userRegister(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenLastCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({
        user: {
          username: userData.username,
          email: userData.email,
          id: userId,
        },
      });
    });
  });

  describe("when it receives a request with an existing user,", () => {
    test("Then it should be invoked its method status with a code of 409 and its mehod json with a message of 'Database error: duplicate key", async () => {
      const userData = {
        username: "Maria",
        password: "123456",
        email: "maria@maria.cat",
      };
      const expectedStatus = 409;
      const expectedMessage = "Database error: duplicate key";
      const expectedError = new Error(expectedMessage);
      const message = "Something went wrong with the user creation";
      req.body = userData;

      bcrypt.hash = jest.fn();
      User.create = jest.fn().mockRejectedValue(expectedError);

      await userRegister(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(
        new CustomError(expectedMessage, expectedStatus, message)
      );
    });
  });
});

describe("Given a loginUser controller", () => {
  describe("When it receives a correct request  with a username 'admin' ", () => {
    test("Then it should invoke status method with 200 code and json with a token", async () => {
      const userData = {
        username: "admin",
        password: "adminadmin",
      };
      req.body = userData;
      const expectedStatus = 200;
      const expectedResponse = { token: "token" };

      User.findOne = jest.fn().mockResolvedValue({
        username: userData.username,
        password: "hashedpsw",
        _id: new mongoose.Types.ObjectId(),
      });

      bcrypt.compare = jest.fn().mockResolvedValue(true);

      Jwt.sign = jest.fn().mockReturnValue("token");

      await userLogin(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When it receives a request with a non-existing user", () => {
    test("Then it should invoke next with a 401 code and a 'Wrong credentials' error message ", async () => {
      const newCustomError = new CustomError(
        "User not found",
        401,
        "Wrong credentials"
      );

      User.findOne = jest.fn().mockResolvedValue(null);

      await userLogin(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(newCustomError);
    });
  });

  describe("When it receives a request with an existing user 'admin' but wrong password 'mania'", () => {
    test("Then it should invoke next with a 401 code and a 'Wrong credentials' error message ", async () => {
      const userData = {
        username: "admin",
        password: "incorrect",
      };
      req.body = userData;
      const newCustomError = new CustomError(
        "Password incorrect",
        401,
        "Wrong credentials"
      );
      User.findOne = jest.fn().mockResolvedValue({
        username: userData.username,
        password: "adminadmin",
        _id: new mongoose.Types.ObjectId(),
      });
      bcrypt.compare = jest.fn().mockResolvedValue(false);
      await userLogin(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(newCustomError);
    });
  });

  describe("When it receives a request and de bcrypt process fails", () => {
    test("Then it should invoke next with a 500 error code ", async () => {
      const userData: Credentials = {
        username: "admin",
        password: "adminadmin",
      };
      const expectedError = new Error();

      req.body = userData;

      User.findOne = jest.fn().mockResolvedValue({
        ...userData,
        _id: new mongoose.Types.ObjectId(),
      });

      bcrypt.compare = jest.fn().mockRejectedValue(expectedError);
      await userLogin(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
