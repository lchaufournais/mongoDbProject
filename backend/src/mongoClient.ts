import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URL!);
let connected = false;

export const getMongoClient = async () => {
  if (!connected) {
    await client.connect();
    connected = true;
  }
  return client;
};
