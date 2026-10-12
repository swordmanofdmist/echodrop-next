import mongoose from "mongoose";

export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  return mongoose.connect(uri, {
    dbName: "echodrop",
    serverSelectionTimeoutMS: 5000
  });
}
