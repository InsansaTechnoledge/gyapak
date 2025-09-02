import Question from "../models/QuestionsModel.js";

export const getQuestionList = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = '', category = '', difficulty = '' } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};

    // 🔍 Search by question text or options
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: "i" } },
        { options: { $elemMatch: { $regex: search, $options: "i" } } }
      ];
    }

    // 📂 Filter by category
    if (category) {
      query.category = category;
    }

    // 🎯 Filter by difficulty
    if (difficulty) {
      query.difficulty = difficulty;
    }

    // 📊 Get total count for pagination
    const totalCount = await Question.countDocuments(query);

    // 📜 Fetch questions with pagination
    const questions = await Question.find(query)
      .sort({ createdAt: -1 }) // latest first
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      questions,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Error fetching questions" });
  }
};

export const createQuestion = async (req, res) => {
  const newQuestion = new Question(req.body);
  try {
    await newQuestion.save();
    res.status(200).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: "Error creating question" });
  }
};

export const editQuestion = async (req, res) => {
  const { id } = req.params;
  const questionData = req.body;
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(id, questionData, { new: true });
    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: "Error updating question" });
  }
};

export const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedQuestion = await Question.findByIdAndDelete(id);
    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting question" });
  }
};

export const reuseQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const reusedQuestion = await Question.findById(id);
    if (!reusedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    // Create a copy of the question
    reusedQuestion.lastUsed = Date.now();
    await reusedQuestion.save();
    res.status(201).json(reusedQuestion);
  } catch (error) {
    res.status(500).json({ message: "Error reusing question" });
  }
};
