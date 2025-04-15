import { supabase } from "../../config/supabaseClient.js";
import fs from "fs";
import csv from "csv-parser";
import { APIError } from "../../Utility/ApiError.js";
import { APIResponse } from "../../Utility/ApiResponse.js";
import { createQuestionQuery, deleteQuestion, getQuestionBySubject, updateQuestion , evaluateAttemptedQuestions } from "../../Utility/SQL-Queries/question.query.js";

export const uploadCSVQuestions = async (req, res) => {

  if (!req.file) {
    return new APIError(400, ['CSV file is missing in request (key: "file")']).send(res);
  }

  const filePath = req.file.path;
  const  subject_id = req.params.id;
  const questions = [];

  try {
    const stream = fs.createReadStream(filePath).pipe(csv());

    stream.on("data", (row) => {
      const formatted = {
        question: row.question,
        options: {
          A: row.optionA,
          B: row.optionB,
          C: row.optionC,
          D: row.optionD,
        },
        correct: row.correct,
        explanation: row.explanation,
        difficulty: row.difficulty?.toLowerCase(), // e/m/h
        subject_id,
      };

      questions.push(formatted);
    });

    stream.on("end", async () => {
      fs.unlinkSync(filePath); 

      const { data, error } = await supabase
        .from("questions")
        .insert(questions)
        .select();

      if (error) {
        return new APIError(500, [error.message, "(1) There was an error uploading CSV file"]).send(res);
      }

      return new APIResponse(200, data, "Successfully uploaded the CSV file").send(res);
    });

    stream.on("error", (err) => {
      return new APIError(500, [err.message, "Error while reading the CSV file"]).send(res);
    });

  } catch (e) {
    return new APIError(500, [e.message, "There was an error uploading the CSV file"]).send(res);
  }
};

export const createQuestions = async(req , res) => {
    try{
        const data = await createQuestionQuery(req.body)

        return new APIResponse(200, data, 'successfully created the questions').send(res);
    } catch(e) {
        return new APIError(500, [e.message , 'there was an error creating the questions']).send(res);
    }
}

export const getQuestionsBySubject = async(req , res) => {
    try{
        const subject_id = req.params.id;

        const data = await getQuestionBySubject(subject_id);
        if(!data ) return new APIError(404, ['no questions found']).send(res);

        return new APIResponse(200, data , `total questions fetched ${data.length}`).send(res);

    } catch(e) {
        return new APIError(500, [e.message, 'there was an error getting the questions']).send(res);
    }
}

export const updateQuestions = async(req , res) => {
    try{

        const {id} = req.params;
        const updates = req.body;

        const data = await updateQuestion(id , updates);
        return new APIResponse(200 , data , 'successfully updated the question').send(res);

    } catch(e) {
        return new APIError(500, [e.message, 'there was an error updating the questions']).send(res);
    }
}

export const deleteQuestions = async (req , res) => {
    try{
        const {id } = req.params;
        if(!id) return new APIError(400 , ['id is required']).send(res);

        const data = await deleteQuestion(id);

        return new APIResponse(200, 'deleted successfully').send(res);

    } catch(e) {
        return new APIError(500 , [e.message, 'there was an error deleting']).send(res);
    }
}

export const evaluateAnswersController = async (req, res) => {
  try {
    console.log("➡️ Received Body:", req.body);

    const { attempts } = req.body;

    if (!Array.isArray(attempts) || attempts.length === 0) {
      return new APIError(400, ["Invalid or empty answers array"]).send(res);
    }

    const evaluation = await evaluateAttemptedQuestions(attempts);

    console.log("✅ Evaluation Result:", evaluation);

    return new APIResponse(200, evaluation, "Answers evaluated").send(res);
  } catch (e) {
    console.error("❌ Error in evaluateSubmittedAnswers:", e);
    return new APIError(500, [e.message || "Unknown error"]).send(res);
  }
};

// Received Body: {
//   attempts: [
//     { questionId: 'cf71f403-a337-418f-9003-2fbc234e9d9e', answer: 'C' },
//     { questionId: 'bbae7e03-120f-4470-be71-7cb8ee906945', answer: 'B' },
//     { questionId: 'fde36eac-b799-436f-b30f-5f2ee14a0481', answer: 'C' },
//     { questionId: '056e99ba-b0b1-401c-adfc-27c6c2ba8e95', answer: 'D' }
//   ]
// }
//
//  Evaluation Result: [
//   {
//     questionId: 'cf71f403-a337-418f-9003-2fbc234e9d9e',
//     selected: 'C',
//     correct: 'C',
//     status: 'correct'
//   },
//   {
//     questionId: 'bbae7e03-120f-4470-be71-7cb8ee906945',
//     selected: 'B',
//     correct: 'B',
//     status: 'correct'
//   },
//   {
//     questionId: 'fde36eac-b799-436f-b30f-5f2ee14a0481',
//     selected: 'C',
//     correct: 'D',
//     status: 'incorrect'
//   },
//   {
//     questionId: '056e99ba-b0b1-401c-adfc-27c6c2ba8e95',
//     selected: 'D',
//     correct: 'B',
//     status: 'incorrect'
//   }
// ]