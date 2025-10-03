import Question from "../models/QuestionsModel.js";

// Get today's questions for the website quiz component
export const getTodaysQuestions = async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    // First try to get questions that were marked as used today
    let questions = await Question.find({
      lastUsed: {
        $gte: startOfToday,
        $lt: endOfToday
      }
    });

    // If no questions found for today, get random questions and mark them as used today
    if (questions.length === 0) {
      // Get 5 random questions
      questions = await Question.aggregate([
        { $sample: { size: 5 } }
      ]);
      
      // Update their lastUsed date to today
      const questionIds = questions.map(q => q._id);
      await Question.updateMany(
        { _id: { $in: questionIds } },
        { lastUsed: new Date() }
      );
    }

    res.status(200).json({ 
      success: true,
      questions: questions,
      message: `Found ${questions.length} questions for today`
    });
  } catch (error) {
    console.error("Error fetching today's questions:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch today's questions",
      message: error.message 
    });
  }
};

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
  try {
    console.log("Received question data:", req.body);
    
    // Validate required fields
    const { question, options, correctAnswer, category } = req.body;
    
    if (!question || !options || correctAnswer === undefined || !category) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields",
        required: ["question", "options", "correctAnswer", "category"]
      });
    }

    // Validate options array
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ 
        success: false,
        message: "Options must be an array with at least 2 items"
      });
    }

    // Validate correctAnswer index
    if (correctAnswer < 0 || correctAnswer >= options.length) {
      return res.status(400).json({ 
        success: false,
        message: "correctAnswer must be a valid index for the options array"
      });
    }

    const newQuestion = new Question(req.body);
    const savedQuestion = await newQuestion.save();
    
    console.log("Question created successfully:", savedQuestion._id);
    res.status(201).json({
      success: true,
      question: savedQuestion,
      message: "Question created successfully"
    });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ 
      success: false,
      message: "Error creating question",
      error: error.message,
      details: error.name === 'ValidationError' ? error.errors : undefined
    });
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
