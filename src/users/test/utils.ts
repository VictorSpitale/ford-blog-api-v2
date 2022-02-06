import { Connection } from 'mongoose';

export const clearDatabase = async (
  dbConnection: Connection,
  collection: string,
) => {
  await dbConnection.collection(collection).deleteMany({});
};
