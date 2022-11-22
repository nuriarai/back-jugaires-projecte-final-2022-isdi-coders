import type { Response } from "express";
import { ValidationError } from "express-validation";
import CustomError from "../../CustomError/CustomError";
import { generalError, notFoundError } from "./errors";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("Given the generalError middleware", () => {
  describe("When it receives a CustomError with public message 'Database error: duplicate key' and status code 500 ", () => {
    test("Then it should invoke the status and json method's of received response with the supplied data", () => {
      const message = "text error";
      const statusCode = 409;
      const publicMessage = "Database error: duplicate key";

      const error = new CustomError(message, statusCode, publicMessage);

      generalError(error, null, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith({ error: publicMessage });
    });
  });

  describe("When it receives an error without public message and without status code ", () => {
    test("Then it should invoke the status by default and json method's with default public message", () => {
      const error = new CustomError(null, null, "");

      const statusCode = 500;
      const expectedDefaultPublicMessage = "There was an error on the server";

      generalError(error, null, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith({
        error: expectedDefaultPublicMessage,
      });
    });
  });

  describe("When it is invoked with ValidationError", () => {
    test("Then it should call response method json with 'The details you provided don't meet the requirements: Username already exists'", () => {
      class ValidationErrorCustom extends ValidationError {
        code: string;

        constructor(
          public statusCode: number,
          public privateMessage: string,
          public publicMessage: string
        ) {
          super({ body: [] }, {});
        }
      }
      const error = new ValidationErrorCustom(400, "", "");
      error.details.body[0] = {
        message: "Username already exists",
        name: "ValidationError",
        isJoi: true,
        details: [],
        annotate: jest.fn(),
        _original: "",
      };
      const expectedPublicMessage =
        "Attention! Provided details doesn't meet the requirements: Username already exists";

      generalError(error, null, res as Response, null);

      expect(res.json).toHaveBeenCalledWith({
        error: expectedPublicMessage,
      });
    });
  });
});

describe("Given a notFoundError middleware ", () => {
  describe("When it receives a next function", () => {
    test("Then it should call the received next function with a 404 'Endpoint not found", () => {
      const next = jest.fn();
      const expectedError = new CustomError(
        "Endpoint not found",
        404,
        "Endpoint not found"
      );
      notFoundError(null, null, next);
      expect(next).toHaveBeenCalledWith(expectedError);

      // Expect(next.mock.calls[0][0].tohavepropery("statusCod", 407))--> per provar el codi, fer proves amb això
    });
  });
});
