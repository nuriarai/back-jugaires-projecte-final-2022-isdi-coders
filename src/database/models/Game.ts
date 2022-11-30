import { Schema, model } from "mongoose";

export const gameSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  gameBoard: {
    type: String,
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  pictureBackup: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  addressLocation: {
    type: String,
  },
  minPlayers: {
    type: Number,
    required: true,
  },
  maxPlayers: {
    type: Number,
  },
  duration: {
    type: String,
  },
  observations: {
    type: String,
  },
});

const Game = model("Game", gameSchema, "games");

export default Game;
