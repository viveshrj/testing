import { NextFunction, Request, Response } from "express";
import Journal from "../models/Journal.js";

export const createJournal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content } = req.body;
    const userId = res.locals.jwtData.id;

    if (!content) {
      return res.status(400).json({
        message: "Content is required",
        success: false
      });
    }

    const journal = new Journal({
      content: content.trim(),
      userId,
    });

    const savedJournal = await journal.save();

    return res.status(201).json({
      message: "Journal entry created successfully",
      success: true,
      journal: {
        content: savedJournal.content,
        createdAt: savedJournal.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in createJournal:", error);
    return res.status(500).json({
      message: "Failed to save journal entry",
      success: false
    });
  }
};

export const getUserJournals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.jwtData.id;

    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false
      });
    }

    const journals = await Journal.find({ userId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .select("content createdAt");

    return res.status(200).json({
      message: "Journals fetched successfully",
      success: true,
      journals,
    });
  } catch (error) {
    console.error("Error in getUserJournals:", error);
    return res.status(500).json({
      message: "Failed to fetch journals",
      success: false
    });
  }
}; 