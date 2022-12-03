import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import mongoose from "mongoose";
import type { GameStructure } from "../server/types";

const gamesFactory = Factory.define<GameStructure>(() => ({
  id: new mongoose.Types.ObjectId(),
  owner: new mongoose.Types.ObjectId(),
  gameBoard: faker.animal.cat(),
  dateTime: faker.date.future(),
  picture: faker.image.imageUrl(),
  pictureBackup: faker.image.imageUrl(),
  location: faker.company.name(),
  addressLocation: faker.address.streetAddress(),
  minPlayers: faker.datatype.number({ min: 2 }),
  maxPlayers: faker.datatype.number({ max: 12 }),
  duration: faker.lorem.words(4),
  observations: faker.lorem.lines(2),
}));

export const getRandomGamesList = (number: number) =>
  gamesFactory.buildList(number);

const gamesOneList: GameStructure[] = getRandomGamesList(4);
export const mockOnlyOneGame = gamesOneList[1];
