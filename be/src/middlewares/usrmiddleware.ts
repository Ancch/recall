import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function auth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers["authorization"];

        if (!authHeader) {
            res.status(401).json({ message: "Auth token missing"});
            return;
        }

        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET || ''
        ) as JwtPayload;

        if (decodedToken && decodedToken.id) {
            req.userId = decodedToken.id;
            next();
        } else {
            res.status(403).json({ message: "Invalid token" })
        }

    } catch (err) {
        console.error("Authentication error:", err);
        res.status(403).json({ message: "You are not signed in" });
    }
}