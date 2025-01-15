import { MONGODB_URL } from "@/utils/env";
import mongoose from "mongoose";

let isConnected = false;

const connectDb = async () => {
  if (isConnected) {
    console.log("Database Connected already :)");
    return;
  }
  try {
    // connect db
    await mongoose.connect(String(MONGODB_URL));
    isConnected = true;
    console.log("Database Connected :)");
  } catch (error: any) {
    if (error instanceof Error) {
      console.error(error.message);
      process.exit(1);
    }
    console.error(error.message);
    process.exit(1);
  }
};

export { connectDb };
