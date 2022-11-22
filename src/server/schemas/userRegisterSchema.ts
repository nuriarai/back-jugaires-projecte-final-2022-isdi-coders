import { Joi } from "express-validation";

const userRegisterSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
  }),
};

export default userRegisterSchema;
