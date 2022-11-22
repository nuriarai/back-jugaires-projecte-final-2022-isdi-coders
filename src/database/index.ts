import chalk from "chalk";
import debugCreator from "debug";
import mongoose from "mongoose";

const debug = debugCreator("jocs:database");

const connectDb = async (dbUrl: string) => {
  try {
    await mongoose.connect(dbUrl);
    debug(chalk.yellowBright("Connection to database was successfull"));
    mongoose.set("toJSON", {
      virtuals: true,
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return ret;
      },
    });
  } catch {
    debug(chalk.redBright(`Error on database connection`));
  }
};

export default connectDb;
