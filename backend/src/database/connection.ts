import mongoose from "mongoose";
import { env, isTest } from "../config/env.js";
import { logger } from "../config/logger.js";

export async function connectDatabase(uri = env.MONGODB_URI): Promise<typeof mongoose> {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    autoIndex: !isTest
  });
  logger.info("MongoDB connected");
  return mongoose;
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
