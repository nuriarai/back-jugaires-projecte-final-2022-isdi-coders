import type { InferSchemaType } from "mongoose";
import type mongoose from "mongoose";
import type { gameSchema } from "../database/models/Game";

export interface Credentials {
  username: string;
  password: string;
}

export interface RegisterDataCredentials extends Credentials {
  email: string;
}

export interface GameStructure extends InferSchemaType<typeof gameSchema> {
  id: mongoose.Types.ObjectId;
}
