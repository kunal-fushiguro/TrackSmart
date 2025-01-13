import { MONGODB_URL } from "@/utils/env";
import mongoose from "mongoose";

const connectDb = async () => {
  try {
    // connect db
    await mongoose.connect(String(MONGODB_URL));
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
