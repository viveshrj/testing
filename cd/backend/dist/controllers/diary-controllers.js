import Diary from "../models/Diary.js";
export const createDiary = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const userId = res.locals.jwtData.id;
        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required",
                success: false
            });
        }
        const diary = new Diary({
            title: title.trim(),
            content: content.trim(),
            userId,
        });
        const savedDiary = await diary.save();
        return res.status(201).json({
            message: "Diary entry created successfully",
            success: true,
            diary: savedDiary
        });
    }
    catch (error) {
        console.error("Error in createDiary:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create diary entry",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
export const getDiaries = async (req, res) => {
    try {
        const userId = res.locals.jwtData.id;
        const diaries = await Diary.find({ userId })
            .sort({ createdAt: -1 })
            .exec();
        res.status(200).json({
            success: true,
            diaries,
            message: "Diaries retrieved successfully"
        });
    }
    catch (error) {
        console.error("Error in getDiaries:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve diaries",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
//# sourceMappingURL=diary-controllers.js.map