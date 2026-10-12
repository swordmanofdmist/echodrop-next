import nextEnv from "@next/env";
import mongoose from "mongoose";
import { connectDb } from "../lib/db.js";

nextEnv.loadEnvConfig(process.cwd());

try {
  await connectDb();
  await mongoose.connection.db.admin().ping();
  console.log(`MongoDB connected successfully. Database: ${mongoose.connection.name}`);
} catch (error) {
  console.error(`MongoDB connection failed (${error.name}). Check MONGODB_URI and database network access.`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
