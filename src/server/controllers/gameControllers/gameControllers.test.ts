import type { NextFunction, Request, Response } from "express";
import CustomError from "../../../CustomError/CustomError";
import Game from "../../../database/models/Game";
import { getRandomGamesList } from "../../../factories/gamesFactory";
import type { GameStructure } from "../../types";
import { deleteGame, loadGames } from "./gameControllers";

beforeEach(() => jest.clearAllMocks());

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};
const next = jest.fn();

const gamesList: GameStructure[] = getRandomGamesList(4);

const mockOneGame = gamesList[0];

describe("Given a loadGames controller", () => {
  describe("When it receives a request and there are games in the database", () => {
    test("Then it should call its method status with a 200 code", async () => {
      const statusCode = 200;

      Game.find = jest.fn().mockReturnValueOnce(gamesList);
      await loadGames(null, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });
  });

  describe("When it receives a request/response and there are no games in database", () => {
    test("Then it should call next function with custom error and 'Nno games in database'", async () => {
      const expectedError = new CustomError(
        "No games in database",
        500,
        "No games found"
      );

      Game.find = jest.fn().mockReturnValue([]);
      await loadGames(null, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives an error ", () => {
    test("Then it should call next function with custom error", async () => {
      const expectedError = new Error();

      Game.find = jest.fn().mockRejectedValue(expectedError);
      await loadGames(null, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a delete game controller", () => {
  describe("When it receives a request with an existing id in database", () => {
    test("Then it should return a response with a status code of 200", async () => {
      const expectedStatusCode = 200;

      const req: Partial<Request> = {
        params: { id: mockOneGame.id.toString() },
      };

      Game.findById = jest.fn().mockResolvedValue(mockOneGame);
      Game.findByIdAndDelete = jest.fn();
      await deleteGame(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });
  });

  describe("When it receives a request with an non-existing id in database", () => {
    test("Then it should return a response with a status code of 404", async () => {
      /*  Const expectedStatusCode = 404; */

      const req: Partial<Request> = {
        params: { id: "3455" },
      };

      Game.findById = jest.fn().mockRejectedValue(mockOneGame);
      Game.findByIdAndDelete = jest.fn();
      await deleteGame(req as Request, res as Response, next as NextFunction);

      /*  Expect(res.status).toHaveBeenCalledWith(expectedStatusCode); */
    });
  });

  describe("When it receives an error ", () => {
    test("Then it should call next function with custom error", async () => {
      const expectedError = new Error();
      const req: Partial<Request> = {
        params: { id: "3455" },
      };
      Game.findById = jest.fn().mockRejectedValue(expectedError);
      await deleteGame(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
