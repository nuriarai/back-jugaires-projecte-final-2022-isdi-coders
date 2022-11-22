import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import connectDb from "../../database";
import User from "../../database/models/User";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDb(server.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

beforeEach(async () => {
  jest.resetAllMocks();
  await User.deleteMany();
});

describe("Given a POST register endpoint", () => {
  describe("When it receives a request with a username 'Mireia' and a password '12345678' ", () => {
    test("Then it should respond with a 201 status code and username 'Mireia'", async () => {
      const statusExpected = 201;
      const newUserData = {
        username: "Mireia",
        password: "12345678",
        email: "mireia@mireia.com",
      };

      const response = await request(app)
        .post("/users/register")
        .send(newUserData)
        .expect(statusExpected);

      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty(
        "username",
        newUserData.username
      );
      expect(response.body.user).toHaveProperty("email", newUserData.email);
    });
  });

  describe("When it receives a request with a username empty", () => {
    test("Then it should respons with a 400 error and message 'Atention! Provided details...'", async () => {
      const statusExpected = 400;
      // eslint-disable-next-line no-useless-escape
      const messageExpected = `Atention! Provided details doesn't meet the requirements: \"username\" is not allowed to be empty`;
      const newUserData = {
        username: "",
        password: "12345678",
        email: "mireia@mireia.com",
      };

      const response = await request(app)
        .post("/users/register")
        .send(newUserData)
        .expect(statusExpected);

      expect(response.body).toHaveProperty("error", messageExpected);
    });
  });

  describe("When it receives a request with a user's details that already exist in the database", () => {
    test("Then it should respond with a message 'User is already registered' and status 409", async () => {
      const expectedStatus = 409;
      const expectedError = "Database error: duplicate key";
      const newUserData = {
        username: "Maria",
        password: "123456",
        email: "maria@maria.cat",
      };

      await User.create(newUserData);

      const response = await request(app)
        .post("/users/register")
        .send(newUserData)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", expectedError);
    });
  });
});
