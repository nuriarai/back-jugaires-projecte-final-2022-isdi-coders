import express from "express";
import { loadGames } from "../../controllers/gameControllers/gameControllers.js";

// eslint-disable-next-line new-cap
const gamesRouter = express.Router();

gamesRouter.get("/games", loadGames);

export default gamesRouter;
