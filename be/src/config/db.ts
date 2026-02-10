import mongoose from "mongoose";
export const MONGODB_URI = process.env.MONGODB_URI as string;

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log("coonnected to mongo");
  } catch (error) {
    console.log("error connecting to mongo");
  } 
} 