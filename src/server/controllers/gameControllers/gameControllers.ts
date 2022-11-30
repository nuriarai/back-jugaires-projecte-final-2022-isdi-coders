import type { NextFunction, Request, Response } from "express";
import Game from "../../../database/models/Game.js";
import CustomError from "../../../CustomError/CustomError.js";

export const loadGames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const games = await Game.find();

    if (games.length === 0) {
      const customError = new CustomError(
        "No games in database",
        500,
        "No games in database"
      );
      next(customError);
    }

    res.status(200).json({ games });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Database error"
    );
    next(customError);
  }
};
