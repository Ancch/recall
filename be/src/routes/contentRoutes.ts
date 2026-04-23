import express from "express";
import { addContent, deleteContent, getContent } from "../controllers/content";
import { auth } from "../middlewares/usrmiddleware";

const router = express.Router();
router.post("/", auth, addContent);
router.get("/", auth, getContent);
router.delete("/:contentId", auth, deleteContent);

export default router;