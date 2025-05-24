import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { getMoodHistory } from "../controllers/mood-controllers.js";

const moodRoutes = Router();

moodRoutes.get("/history", verifyToken, getMoodHistory);

export default moodRoutes;