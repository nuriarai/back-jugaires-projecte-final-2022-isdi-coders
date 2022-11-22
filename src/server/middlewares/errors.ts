import chalk from "chalk";
import debugCreator from "debug";
import type { Request, Response, NextFunction } from "express";
import { ValidationError } from "express-validation";
import CustomError from "../../CustomError/CustomError.js";

const debug = debugCreator("social:server:middlewares:errors");

export const notFoundError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new CustomError(
    "Endpoint not found",
    404,
    "Endpoint not found"
  );
  next(error);
};

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction
) => {
  if (error instanceof ValidationError) {
    const validationErrors = (error as ValidationError).details.body.map(
      (error) => error.message
    );

    debug(chalk.red(validationErrors.join("\n")));

    error.publicMessage =
      "Attention! Provided details doesn't meet the requirements: " +
      validationErrors.join(", ");

    error.statusCode = 400;
  }

  const { message, statusCode, publicMessage } = error;

  debug(chalk.red(message));
  debug(chalk.yellow(error));

  const responseMessage = publicMessage || "There was an error on the server";
  const responseStatus = statusCode ?? 500;

  res.status(responseStatus).json({ error: responseMessage });
};
