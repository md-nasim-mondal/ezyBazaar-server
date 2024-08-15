import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGO_URI is not defined in the environment variables");
}

const client = new MongoClient(uri);

export const connectDB = async () => {
  try {
    await client.connect();
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export const getDB = () => {
  return client.db('yourDatabaseName'); // Replace with your actual database name
};
