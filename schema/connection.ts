// db.ts

import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectToMongoDB = async (): Promise<void> => {
  try {
    // Replace 'your_database_url' with your actual MongoDB connection string
    const connectionString = process.env.DATABASE_URL;

    await mongoose.connect(connectionString);

  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the application if unable to connect
  }
};

export default connectToMongoDB;
