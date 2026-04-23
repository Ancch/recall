import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types";
import { searchSchema } from "../utils/schema";
import { getEmbedding } from "../services/embeddings";
import { getPineconeIndex } from "../config/pinecone";
import { ContentModel } from "../models";
import { generateText } from "../services/llm";

export async function search(req: AuthenticatedRequest, res: Response) {
    const validation = searchSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({ message: "Search query is required"});
        return;
    }

    const { query } = req.body;
    const userId = req.userId;

    try {

        const queryEmbedding = await getEmbedding(query);
        const pineconeIndex = getPineconeIndex();

        const searchResponse = await pineconeIndex.query({
            vector: queryEmbedding,
            topK: 5,
            filter: {
                userId: userId?.toString() || "",
            },
        });

        const contentIds = searchResponse.matches.map((match: any) => match.id);
        const relevantContent = await ContentModel.find({
            _id: { $in: contentIds },
            userId: userId,
        })

        const contentWithScores = relevantContent.map((content: any) => {
            const match = searchResponse.matches.find((m: any) => m.id === content._id.toString());
            return {
                ...content.toObject(),
                similarityScore: match ? match.score : 0,
            };
        })
        .sort((a: any, b: any) => b.similarityScore - a.similarityScore)
        .slice(0,2);
        

        if (contentWithScores.length === 0) {
            res.json({
                message: 
                    "No relevant content found in your second brain for this query.",
                    results: [],
            });
            return;
        }

        let context = 
            "Below is the relevant information from te user's second brain:\n\n";
        contentWithScores.forEach((item: any, index: number) => {
            context += `[Content ${index + 1}]\nTitle: ${item.title}\nType: ${item.type}\n`;
            if (item.link) context += `Link: ${item.link}\n`;
            context += `Content: ${item.content}\n\n `;

        });

        const prompt = `${context}\n\nUser query: "${query}"\n\nBased on the information above from the user's second brain, please provide a helpful and concise response to their query. If the information doesn't contain a direct answer, try to extract relevant insights that might be helpful. if any is questions asked, try to answer it with your knowledege also.`

        const answer = await generateText(prompt)

        res.json({
            message: "Search results found",
            relevantContent: contentWithScores,
            answer
        });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: "Error processing search request" });
    }
}