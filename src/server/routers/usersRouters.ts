import express from "express";
import { validate } from "express-validation";
import { userRegister } from "../controllers/userControllers/userControllers.js";
import userRegisterSchema from "../schemas/userRegisterSchema.js";

// eslint-disable-next-line new-cap
const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validate(userRegisterSchema, {}, { abortEarly: false }),
  userRegister
);

export default usersRouter;
