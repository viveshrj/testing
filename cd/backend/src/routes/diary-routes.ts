import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { createDiary, getDiaries } from "../controllers/diary-controllers.js";

const diaryRoutes = Router();

diaryRoutes.post("/create", verifyToken, createDiary);
diaryRoutes.get("/entries", verifyToken, getDiaries);

export default diaryRoutes;