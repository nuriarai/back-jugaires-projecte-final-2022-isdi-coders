import express from "express";
import {
  loadGames,
  deleteGame,
  addGame,
  getGameById,
} from "../../controllers/gameControllers/gameControllers.js";

// eslint-disable-next-line new-cap
const gamesRouter = express.Router();

gamesRouter.get("/games", loadGames);
gamesRouter.delete("/delete/:id", deleteGame);
gamesRouter.post("/create", addGame);
gamesRouter.get("/game/:id", getGameById);

export default gamesRouter;
