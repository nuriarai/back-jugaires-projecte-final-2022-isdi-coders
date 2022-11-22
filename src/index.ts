import "./loadEnvirontment.js";
import environtment from "./loadEnvirontment.js";
import startServer from "./server/index.js";

import app from "./app.js";
import debug from "debug";

const { port, dbUrl } = environtment;

await startServer(app, Number(port));
debug(dbUrl);
