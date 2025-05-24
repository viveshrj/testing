import { configureGeminiAI } from "../config/ai-config.js";
import Mood from "../models/Mood.js";
// Helper function to analyze sentiment using Gemini
const analyzeSentiment = async (text) => {
    try {
        const model = configureGeminiAI();
        const prompt = `Analyze the sentiment of this text and return a JSON with 'mood' (emotion label) and 'score' (0-1 where 1 is most positive). Text: "${text}"`;
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const sentiment = JSON.parse(response);
        return {
            mood: sentiment.mood || "neutral",
            score: sentiment.score || 0.5
        };
    }
    catch (error) {
        console.error("Error in analyzeSentiment:", error);
        return {
            mood: "neutral",
            score: 0.5
        };
    }
};
export const analyzeConversation = async (req, res, next) => {
    try {
        const { messages, startTime, endTime } = req.body;
        const userId = res.locals.jwtData.id;
        // Combine all messages into a single text for analysis
        const conversationText = messages
            .map((msg) => `${msg.role}: ${msg.content}`)
            .join("\n");
        // Analyze sentiment
        const sentiment = await analyzeSentiment(conversationText);
        // Create mood entry
        const moodEntry = new Mood({
            userId,
            mood: sentiment.mood,
            sentiment: sentiment.score,
            notes: `Chat conversation analysis (${new Date(startTime).toLocaleTimeString()} - ${new Date(endTime).toLocaleTimeString()})`,
            chatContext: conversationText.substring(0, 100) + "...",
            date: new Date()
        });
        await moodEntry.save();
        return res.status(200).json({
            success: true,
            sentiment,
            message: "Conversation analyzed and mood entry created"
        });
    }
    catch (error) {
        console.error("Error in analyzeConversation:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to analyze conversation",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
export const createMoodEntry = async (req, res, next) => {
    try {
        const { mood, sentiment, notes, chatContext } = req.body;
        const userId = res.locals.jwtData.id;
        const moodEntry = new Mood({
            userId,
            mood,
            sentiment,
            notes,
            chatContext,
            date: new Date()
        });
        const savedEntry = await moodEntry.save();
        return res.status(201).json({
            success: true,
            message: "Mood entry created successfully",
            entry: savedEntry
        });
    }
    catch (error) {
        console.error("Error in createMoodEntry:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create mood entry",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
export const getMoodHistory = async (req, res) => {
    try {
        const userId = res.locals.jwtData.id;
        const moodHistory = await Mood.find({ userId })
            .sort({ date: -1 })
            .exec();
        res.status(200).json({
            success: true,
            moodHistory,
            message: "Mood history retrieved successfully"
        });
    }
    catch (error) {
        console.error("Error in getMoodHistory:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve mood history",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
//# sourceMappingURL=mood-controllers.js.map