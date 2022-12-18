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
    let games = [];
    let message = "";
    let countGames;

    const pageOptions = {
      page: +req.query.page || 0,
      limit: 5,
      gameBoard: req.query.gameBoard as string,
    };

    if (pageOptions.gameBoard) {
      countGames = await Game.countDocuments({
        gameBoard: pageOptions.gameBoard,
      });
    } else {
      countGames = await Game.countDocuments();
    }

    if (pageOptions.gameBoard) {
      games = await Game.find({
        gameBoard: { $regex: pageOptions.gameBoard, $options: "i" },
      })
        .sort({ dateTime: -1 })
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .exec();

      countGames = games.length;
      message = "No s'han trobat partides per a aquest joc";
    } else {
      games = await Game.find()
        .sort({ dateTime: -1 })
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .exec();

      countGames = games.length;
      message = "Encara no hi ha partides";
    }

    if (games.length === 0) {
      const customError = new CustomError("No games in database", 500, message);
      next(customError);
    }

    const checkPages = {
      isPreviousPage: pageOptions.page !== 0,
      isNextPage: countGames >= pageOptions.limit * (pageOptions.page + 1),
      totalPages: Math.ceil(countGames / pageOptions.limit),
    };

    res.status(200).json({ ...checkPages, games });
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
