import Question from "../models/QuestionsModel.js";

export const getTodaysQuestions = async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const questions = await Question.find({
      lastUsed: {
        $gte: startOfToday,
        $lt: endOfToday
      }
    });
    res.status(200).json({ questions });
  } catch (error) {
    console.error("Error fetching today's questions:", error);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
};