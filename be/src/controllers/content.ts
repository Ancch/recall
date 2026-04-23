import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types";
import { contentSchema } from "../utils/schema";
import { fetchTwitter, fetchYouTube, fetchWebsite, handleNote } from "../services/mediaHandlers";
import { ContentModel } from "../models";
import { getEmbedding } from "../services/embeddings";
import { getPineconeIndex } from "../config/pinecone";
import mongoose from "mongoose";


export interface YouTubeMetadata {
    title: string;
    description: string;
    thumbnailUrl: string;
}
export const addContent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.userId) {
        res.status(401).json({
            message: "Unauthorized"
        })
        return;
    }
    const input = contentSchema.safeParse(req.body);
    if (!input.success) {
        const errorMessage = input.error.issues.map((e) => e.message).join(", ");
        res.status(400).json({
            message: errorMessage || "invalid format",
            error: input.error.issues,
        });
        return;
    }
    const { link, title, content } = input.data as { link?: string; title?: string; content?: string };
    try {
        let contentToSave = content || "";
        let titleToSave = title || "";
        let imageUrl: string | null = null;
        let metadata;
        if (link) {
            if (link.match(/youtube\.com|youtu\.be/i)) {
                metadata = await fetchYouTube(link);
            } else if (link.match(/twitter\.com|x\.com/i)) {
                metadata = await fetchTwitter(link);
            } else {
                metadata = await fetchWebsite(link);
            }
            titleToSave = titleToSave || metadata.title;
            contentToSave = metadata.content;
            imageUrl = metadata.thumbnail;
        } else {
            metadata = await handleNote(titleToSave, contentToSave);
            titleToSave = metadata.title;
            contentToSave = metadata.content;
        }
    const timestamp = new Date().toLocaleString();
    const textforEmbedding = `Title: ${titleToSave}\nDate: ${timestamp}\nContent: ${contentToSave}`;
        const newContent = await ContentModel.create({
            title: titleToSave,
            link: link || null,
            type: link ? "Url" : "Note",
            content: contentToSave,
            imageUrl,
            tag: [],
            userId: req.userId,
            createdAt: new Date()
        })
        const embedding = await getEmbedding(textforEmbedding);
        const pineconeIndex = getPineconeIndex();

        await pineconeIndex.upsert({
            records: [{
                id: newContent._id.toString(),
                values: embedding,
                metadata: {
                    userId: req.userId,
                    title: titleToSave,
                    contentType: link ? "Url" : "Note",
                    timestamp,
                    snippet: contentToSave.substring(0, 100),
                    imageUrl: imageUrl || ""
                }
            }]
        });
        res.status(200).json({
            message: "Content added successffully",
            contentId: newContent._id,
            imageUrl
        });
    } catch (err) {
        console.error("Error adding content:", err);
        res.status(500).json({ message: "Internal server error" })
    }
}
export const getContent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { userId } = req;
    try {
        const content = await ContentModel.find({ userId: userId }).populate(
            "userId",
            "username"
        );
        if (content.length == 0) {
            res.json({
                content: [
                    {
                        _id: "01",
                        type: "Note",
                        title: "Hey Recall !!",
                        content: 
                            "This is your default content, Click on Add Memory to add more content",
                        imageUrl: null,
                        createdAt: Date.now()
                    },
                ]
            })
            return;
        }
        res.status(200).json({
            content: content.map((item) => ({
                _id: item._id,
                title: item.title,
                type: item.type,
                content: item.content,
                link: item.link || null,
                userId: item.userId,
                createdAt: item.createdAt
            })),
        });
    } catch(error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error"});
    }
};
export const deleteContent = async (req: AuthenticatedRequest<{ contentId: string }>, res: Response): Promise<void> => {
    const { userId } = req;
    const { contentId } = req.params;
    if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
        res.status(400).json({
            error: "Invalid/ missing content ID"
        });
        return;
    }
    try {
        await ContentModel.deleteOne({ _id: contentId, userId });
        const pineconeIndex = getPineconeIndex();
        await pineconeIndex.deleteOne({id: contentId});
        res.json({ message: "Content deleted!"})
    } catch (error) {
        console.error("error deleting content", error);
        res.status(500).json({ message: "Error deleteing content"});
    }
}