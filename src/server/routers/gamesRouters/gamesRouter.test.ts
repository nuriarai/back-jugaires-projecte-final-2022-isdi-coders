import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../../app";
import connectDb from "../../../database";
import Game from "../../../database/models/Game";
import { getRandomGamesList } from "../../../factories/gamesFactory";
import type { GameStructure } from "../../types";

let server: MongoMemoryServer;

const gamesList: GameStructure[] = getRandomGamesList(4);

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDb(server.getUri());

  await Game.create(gamesList);
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
