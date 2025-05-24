import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { createJournal, getUserJournals } from "../controllers/journal-controllers.js";
import { validate } from "../utils/validators.js";

const journalRoutes = Router();

// Protected routes
journalRoutes.post("/create", validate, verifyToken, createJournal);
journalRoutes.get("/entries", validate, verifyToken, getUserJournals);

export default journalRoutes; 