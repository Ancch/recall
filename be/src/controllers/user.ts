import { Request, Response } from "express";
import { signinschema, signupSchema } from "../utils/schema";
import bcrypt from "bcrypt"
import { UserModel } from "../models";
import { safeParse } from "zod";
import jwt from "jsonwebtoken"


function hashPassword(password: string): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
}
function comparePassword(raw: string, hash: string): boolean {
    return bcrypt.compareSync(raw, hash);
}

export async function signup(req: Request, res: Response): Promise<void> {
    const input = signupSchema.safeParse(req.body);
    if (!input.success) {
        const errorMessage = input.error.issues.map((e) => e.message);
        res.status(411).json({
        // message: errorMessage || "invalid format",
        message: signupSchema.shape,
        error: errorMessage,
    });
    return;
    }

    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            const hashedpassword = await hashPassword(password);
            await UserModel.create({ 
                username, 
                password: hashedpassword 
            });
            res.status(200).json({ message: "User created" })
        } else {
            res.status(500).json({ message: "User name is taken" });
        }
    } catch (err) {
        res.status(500).json({ message: "Internal server error "});
    }
};

export async function signin(req: Request, res: Response) {
    const input = signinschema.safeParse(req.body);
    if (!input.success) {
    const errorMessage = input.error.issues.map((e) => e.message);
    res.status(411).json({
      message: errorMessage || "Invalid format",
      error: errorMessage,
    });
    return;
    }

    const { username, password} = req.body;
    
    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const isValid = comparePassword(password, user.password);
        if (!isValid) {
            res.status(401).json({ message: "Invalid creds" });
            return;
        }

        if (!user._id) {
            res.status(500).json({ message: "Invalid server error" });
            return;
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || '',
            { expiresIn: "7days" }
        );

        res.status(200).json({
            message: "User logged in",
            token,
            username
        })
    } catch (error) {
        console.error("signin error", error);
        res.status(500).json({
            message: "server error"
        });
    }
}