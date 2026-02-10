import mongoose from "mongoose";


export interface User {
    _id: mongoose.Types.ObjectId;
    username: string;
    password: string;
}

export interface Content {
    _id: mongoose.Types.ObjectId;
    title?: string;
    link?: string;
    type: string;
    content: string;
    tag: string[];
    userId: mongoose.Types.ObjectId;
    imageUrl?: string;
}

export interface Link {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    hash: string;
}

