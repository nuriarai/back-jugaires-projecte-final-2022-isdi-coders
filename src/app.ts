import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.disable("x-powered-by");
app.use(cors());

app.use(morgan("dev"));
app.use(express.json());

app.use("/", (req, res) => res.send("Jugaires"));

export default app;
