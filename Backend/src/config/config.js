import dotenv from "dotenv";

dotenv.config({ quiet: true });

if (!process.env.MONGO_URI) {
  throw new Error("Warning: MONGO_URI is not set in environment variables.");
}
if (!process.env.JWT_SECRET) { 
  throw new Error("Warning: JWT_SECRET is not set in environment variables.");
}




export const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET
}

export default config;