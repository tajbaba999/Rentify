import mongoose from "mongoose";
import dotenv from "dotenv";

// const loadEnv = () => {
//   if (process.env.NODE_ENV === "production") {
//     dotenv.config({ path: ".prod.env" });
//   } else {
//     dotenv.config({ path: ".dev.env" });
//   }
// };

// loadEnv();

dotenv.config({});
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set in environment variables.");
}

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
