import express from "express";
import { validate } from "express-validation";
import {
  userLogin,
  userRegister,
} from "../controllers/userControllers/userControllers.js";
import {
  userRegisterSchema,
  userLoginSchema,
} from "../schemas/userRegisterSchema.js";

// eslint-disable-next-line new-cap
const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validate(userRegisterSchema, {}, { abortEarly: false }),
  userRegister
);
usersRouter.post(
  "/login",
  validate(userLoginSchema, {}, { abortEarly: false }),
  userLogin
);

export default usersRouter;
