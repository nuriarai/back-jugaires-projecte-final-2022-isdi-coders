import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../../app";
import connectDb from "../../../database";
import Game from "../../../database/models/Game";
import { getRandomGamesList } from "../../../factories/gamesFactory";
import type { GameStructure } from "../../types";

let server: MongoMemoryServer;
let gameTest: GameStructure;

const gamesList: GameStructure[] = getRandomGamesList(4);
const mockOneGame = gamesList[0];

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDb(server.getUri());

  gameTest = await Game.create(mockOneGame);
});

afterAll(async () => {
  await Game.deleteMany();
  await mongoose.disconnect();
  await server.stop();
});

beforeEach(async () => {
  jest.resetAllMocks();
});

describe("Given a GET games endpoint", () => {
  describe("When it receives a request ", () => {
    test("Then it should respond with a 200 status and a list of games", async () => {
      const statusExpected = 200;

      const response = await request(app)
        .get("/games/games")
        .expect(statusExpected);

      expect(response.body).toHaveProperty("games");
    });
  });
});

describe("Given a DELETE games endpoint", () => {
  describe("When it receives a request ", () => {
    test("Then it should respond with a 200 status and a deleted game message", async () => {
      const statusExpected = 200;

      const { id } = gameTest;

      console.log(id);
      const response = await request(app)
        .delete(`/games/delete/${id.toString()}`)
        .expect(statusExpected);

      expect(response.body).toStrictEqual("Game deleted");
    });
  });
});
