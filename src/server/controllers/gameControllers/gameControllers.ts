import type { NextFunction, Request, Response } from "express";
import Game from "../../../database/models/Game.js";
import CustomError from "../../../CustomError/CustomError.js";
import type { CustomRequest } from "../../types.js";

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

export const deleteGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const game = await Game.findById(id);

    if (!game) {
      res.status(404).json({ message: "Game not found" });
      return;
    }

    await Game.findByIdAndDelete(id);

    res.status(200).json("Game deleted");
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Databaser error"
    );

    next(customError);
  }
};

export const addGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newGame = await Game.create(req.body);

    res.status(201).json({ newGame });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Database error"
    );
    next(customError);
  }
};

export const getGameById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const game = await Game.findById(id);

    if (!game) {
      res.status(404).json({ message: "Game not found" });
      return;
    }

    res.status(200).json({ game });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Database error: game not found"
    );

    next(customError);
  }
};
