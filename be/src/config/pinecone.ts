import { Index, Pinecone } from "@pinecone-database/pinecone";

let pineconeIndex: Index;

export async function initPinecone(): Promise<Index> {
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || '',
    });
    
    pineconeIndex = pinecone.index(process.env.PINECONE_INDEX || '');
    console.log("Connected to Pinecone");
    return pineconeIndex;
  } catch (error) {
    console.error("error connecting to pinecone:", error);
    throw error;
  }
};

export function getPineconeIndex(): Index {
  if (!pineconeIndex) {
    throw new Error("Pinecone index not initialized");
  }
  return pineconeIndex;
};