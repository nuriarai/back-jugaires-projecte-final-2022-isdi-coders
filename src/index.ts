import "./loadEnvirontment.js";
import environtment from "./loadEnvirontment.js";
import debug from "debug";
import app from "./app.js";
import startServer from "./server/index.js";
import connectDb from "./database/index.js";

const { port, dbUrl } = environtment;

await connectDb(dbUrl);
await startServer(app, Number(port));
debug(dbUrl);
