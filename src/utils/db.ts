import mongoose from "mongoose";
import { DATABASE_URL } from "./env";

const db = async (): Promise<string> => {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  try {
    await mongoose.connect(DATABASE_URL);

    console.log("✅ MongoDB connected to:", mongoose.connection.name);
    return "database connected!";
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

export default db;
