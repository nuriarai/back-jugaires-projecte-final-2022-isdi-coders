import type { NextFunction, Request, Response } from "express";
import CustomError from "../../../CustomError/CustomError";
import Game from "../../../database/models/Game";
import { getRandomGamesList } from "../../../factories/gamesFactory";
import type { CustomRequest, GameStructure } from "../../types";
import { addGame, deleteGame, getGameById, loadGames } from "./gameControllers";

beforeEach(() => jest.clearAllMocks());

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};

const req: Partial<Request> = {
  params: {},
  query: { pagina: "0" },
};

const next = jest.fn();

const gamesList: GameStructure[] = getRandomGamesList(4);

const mockOneGame = gamesList[0];

describe("Given a loadGames controller", () => {
  describe("When it receives a request and there are games in the database", () => {
    test("Then it should call its method status with a 200 code", async () => {
      const statusCode = 200;

      Game.find = jest.fn().mockReturnValueOnce({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest.fn().mockReturnValue(gamesList),
            }),
          }),
        }),
      });

      await loadGames(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });
  });

  describe("When it receives a request/response and there are no games in database", () => {
    test("Then it should call next function with custom error and 'Nno games in database'", async () => {
      const expectedError = new CustomError(
        "No games in database",
        500,
        "Encara no hi ha partides"
      );

      Game.find = jest.fn().mockReturnValueOnce({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest.fn().mockReturnValue([]),
            }),
          }),
        }),
      });

      await loadGames(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives an error ", () => {
    test("Then it should call next function with custom error", async () => {
      const expectedError = new Error();

      Game.find = jest.fn().mockReturnValueOnce({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest.fn().mockRejectedValue(expectedError),
            }),
          }),
        }),
      });

      await loadGames(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with a filter gameBoard in its query params", () => {
    test("Then it should call its method status with a 200 code", async () => {
      const gamesListLong: GameStructure[] = getRandomGamesList(30);

      const mockOneGameLong = gamesListLong[0];

      const req: Partial<Request> = {
        params: {},
        query: { pagina: "0", gameBoard: mockOneGameLong.gameBoard },
      };

      const statusCode = 200;

      /*    Const expectedGames: GameStructure = {
        gameBoard: mockOneGameLong.gameBoard,
      }; */

      Game.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest.fn().mockReturnValue(gamesListLong),
            }),
          }),
        }),
      });

      await loadGames(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(statusCode);
      /*   Expect(res.json).toBeCalledWith({
        isNextPage: false,
        isPreviousPage: false,
        games: expectedGames,
        totalPages: 1,
      }); */
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
      const expectedStatusCode = 404;

      const req: Partial<Request> = {
        params: { id: "3455" },
      };

      Game.findById = jest.fn().mockResolvedValue(undefined);

      await deleteGame(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
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

describe("Given an addGame controller", () => {
  describe("When it receives a request with new data for a new game to create", () => {
    test("Then it should call status method with a 201 status code", async () => {
      const expectedStatusCode = 201;

      const req: Partial<Request> = {
        body: [],
      };

      req.body = mockOneGame;

      Game.create = jest.fn().mockReturnValueOnce(mockOneGame);

      await addGame(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });
  });

  describe("When it receives a request with no data for a new game to create", () => {
    test("Then it should call status method with a 500 status code", async () => {
      const expectedError = new Error();

      const req: Partial<Request> = {
        body: [],
      };

      Game.create = jest.fn().mockRejectedValue(expectedError);

      await addGame(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a getGameById game controller", () => {
  describe("When it receives a request with an existing id in database", () => {
    test("Then it should return a response with a status code of 200", async () => {
      const expectedStatusCode = 200;

      const req: Partial<Request> = {
        params: { id: mockOneGame.id.toString() },
      };

      Game.findById = jest.fn().mockResolvedValueOnce(mockOneGame);
      await getGameById(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith({ game: mockOneGame });
    });
  });

  describe("When it receives a request with a non-existing id in database", () => {
    test("Then it should return a response with a status code of 404", async () => {
      const expectedStatusCode = 404;

      const req: Partial<Request> = {
        params: { id: "3455" },
      };

      Game.findById = jest.fn().mockResolvedValue(undefined);

      await getGameById(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });
  });

  describe("When it receives an error ", () => {
    test("Then it should call next function with custom error", async () => {
      const expectedError = new Error();
      const req: Partial<Request> = {
        params: { id: "3455" },
      };

      Game.findById = jest.fn().mockRejectedValue(expectedError);

      await getGameById(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
