import type { Response } from "express";
import CustomError from "../../../CustomError/CustomError";
import Game from "../../../database/models/Game";
import { getRandomGamesList } from "../../../factories/gamesFactory";
import type { GameStructure } from "../../types";
import { loadGames } from "./gameControllers";

beforeEach(() => jest.clearAllMocks());

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};
const next = jest.fn();

const gamesList: GameStructure[] = getRandomGamesList(4);

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
