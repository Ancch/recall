// src/types/express.d.ts
export {}; // makes this a module

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}