import type { InferSchemaType } from "mongoose";
import type mongoose from "mongoose";
import type { Request } from "express";
import type * as core from "express-serve-static-core";
import type { gameSchema } from "../database/models/Game";

export interface Credentials {
  username: string;
  password: string;
}

export interface RegisterDataCredentials extends Credentials {
  email: string;
}

export interface GameStructure extends InferSchemaType<typeof gameSchema> {
  id?: mongoose.Types.ObjectId;
}

export interface CustomRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any
> extends Request<P, ResBody, ReqBody> {
  id: string;
}
