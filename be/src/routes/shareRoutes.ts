import express from "express";
import { auth } from "../middlewares/usrmiddleware";
import { shareBrain, getBrainByShareLink } from "../controllers/share";

const router = express.Router();
router.post("/", auth, shareBrain);
router.get("/:shareLink", getBrainByShareLink);

export default router;
