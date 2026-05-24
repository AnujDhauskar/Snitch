import dotenv from "dotenv";

dotenv.config({ quiet: true });

if (!process.env.MONGO_URI) {
  throw new Error("Warning: MONGO_URI is not set in environment variables.");
}
if (!process.env.JWT_SECRET) { 
  throw new Error("Warning: JWT_SECRET is not set in environment variables.");
}

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("Warning: GOOGLE_CLIENT_ID is not set in environment variables.");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Warning: GOOGLE_CLIENT_SECRET is not set in environment variables.");
}




export const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET

}

export default config;