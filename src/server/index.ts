import chalk from "chalk";
import debugCreator from "debug";
import type { Express } from "express";

const debug = debugCreator("jugaires:server");

const startServer = async (app: Express, port: number) => {
  await new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.green(`Server is listening on port ${port}`));
      resolve(server);
    });

    server.on("error", (error) => {
      debug(chalk.red(`There is an error i server ${error.message}`));
      reject(error);
    });
  });
};

export default startServer;
