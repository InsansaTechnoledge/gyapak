import { supabase } from "../../config/supabaseClient.js";
import fs from "fs";
import csv from "csv-parser";
import { APIError } from "../../Utility/ApiError.js";
import { APIResponse } from "../../Utility/ApiResponse.js";
import { createQuestionQuery, deleteQuestion, getQuestionBySubject, updateQuestion , evaluateAttemptedQuestions, getQuestionsByEventId } from "../../Utility/SQL-Queries/question.query.js";


export const uploadCSVQuestions = async (req, res) => {
  const { subject_id, event_id } = req.params;

  if (!req.file) {
    return new APIError(400, ['CSV file is missing in request (key: "file")']).send(res);
  }

  if (!event_id || !subject_id) {
    return new APIError(400, ['Missing event_id or subject_id']).send(res);
  }

  const filePath = req.file.path;
  const questions = [];

  try {
    const stream = fs.createReadStream(filePath).pipe(csv());

    stream.on('data', (row) => {
      questions.push({
        question: row.question,
        options: {
          A: row.optionA,
          B: row.optionB,
          C: row.optionC,
          D: row.optionD,
        },
        correct: row.correct,
        explanation: row.explanation,
        difficulty: row.difficulty?.toLowerCase(),
        subject_id,
      });
    });

    stream.on('end', async () => {
      fs.unlinkSync(filePath);

      const { data: insertedQuestions, error: insertError } = await supabase
        .from('questions')
        .insert(questions)
        .select('id');

      if (insertError) {
        return new APIError(500, [insertError.message, 'Failed to insert questions']).send(res);
      }

      // Map the inserted questions to the event
      const questionMappings = insertedQuestions.map(q => ({
        event_id,
        question_id: q.id
      }));

      const { error: mapError } = await supabase
        .from('event_questions')
        .insert(questionMappings);

      if (mapError) {
        return new APIError(500, [mapError.message, 'Failed to map questions to event']).send(res);
      }

      return new APIResponse(200, { insertedQuestions }, 'Questions uploaded and mapped successfully').send(res);
    });

    stream.on('error', (err) => {
      return new APIError(500, [err.message, 'Error while reading CSV']).send(res);
    });

  } catch (e) {
    console.error('❌ Upload CSV Error:', e.message);
    return new APIError(500, [e.message, 'There was an error uploading the CSV']).send(res);
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

export const getQuestionbyEventid = async (req, res) => {
  try{
    const event_id = req.params.id;

    const data = await getQuestionsByEventId(event_id);
    if(!data ) return new APIError(404, ['no questions found']).send(res);

    return new APIResponse(200, data , `total questions fetched ${data.length}`).send(res);

  } catch (e) {
    return new APIError(500, [e.message, 'there was an error getting the question']).send(res);
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