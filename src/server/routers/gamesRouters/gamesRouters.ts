import express from "express";
import {
  loadGames,
  deleteGame,
} from "../../controllers/gameControllers/gameControllers.js";

// eslint-disable-next-line new-cap
const gamesRouter = express.Router();

gamesRouter.get("/games", loadGames);
gamesRouter.delete("/delete/:id", deleteGame);

export default gamesRouter;
