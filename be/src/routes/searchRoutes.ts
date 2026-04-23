import { Router } from "express";
import { auth } from "../middlewares/usrmiddleware";
import { search } from "../controllers/search";


const router = Router();

router.post("/", auth, search);

export default router;