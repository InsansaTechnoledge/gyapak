import { DetailedTestResult } from "../../models/DetailedTestResult.model.js";
import { APIError } from "../../Utility/ApiError.js";
import { APIResponse } from "../../Utility/ApiResponse.js";
import { getQuestion, getQuestionsByEventId } from "../../Utility/SQL-Queries/question.query.js";
import { addDetailedResultLinktoResult, evaluateResponse, fetchResultForEvent, fetchResultsOfUser, fetchWrongQuestionsSubjectwise } from "../../Utility/SQL-Queries/testResult.query.js";

export const checkUsersAnswers = async (req, res) => {
    try {
        const { answers, userId, exam_id, event_id } = req.body


        const result = await evaluateResponse(answers, userId, exam_id, event_id);

        if (!userId || !exam_id || !event_id || !Array.isArray(answers)) {
            return new APIError(400, ["Missing required fields or invalid input"]).send(res);
        }

        const detailedResult = await DetailedTestResult.create({
            detailedResult: result
        });

        const updatedResult = await addDetailedResultLinktoResult(event_id, userId, detailedResult._id);

        console.log("DR", updatedResult);

        return new APIResponse(200, updatedResult, "Checked answers").send(res);
    }
    catch (e) {
        console.error("❌ Error during evaluation:", e);
        return new APIError(500, [e?.message || "Unknown error", "Failed to evaluate answer"]).send(res);
    }
};


export const getWrongQuestionsSubjectwiseForExam = async (req, res) => {
    try {

        const { examId, userId } = req.body;
        const response = await fetchWrongQuestionsSubjectwise(userId, examId);
        console.log(response);
        const groupedBySubject = response.reduce((acc, curr) => {
            const subject = curr.subject_name;
            if (!acc[subject]) {
                acc[subject] = [];
            }

            acc[subject].push(curr);
            return acc;
        }, {});


        return new APIResponse(200, groupedBySubject, "Result fetched").send(res);
    }
    catch (err) {
        return new APIError(500, [err.message]).send(res);
    }
}

export const getResultsByUser = async (req, res) => {
    try {

        const userId = req.user._id;
        const { examId } = req.params;
        const results = await fetchResultsOfUser(userId, examId);

        return new APIResponse(200, results, "Results fetched successfully").send(res);
    }
    catch (err) {
        console.log(err);
        return new APIError(500, [err.message]).send(res);
    }

}

export const getResultForEvent = async (req, res) => {
    try {
        const userId = req.user._id;
        const { eventId } = req.params;

        const result = await fetchResultForEvent(eventId, userId);

        const detailedResult = await DetailedTestResult.findById(result.detailed_result_id);


        // const wrongAnswers = await Promise.all(
        //     detailedResult.detailedResult.wrong_answers.map(ans => getQuestion(ans.question_id))
        // );

        // const unattemptedAns = await Promise.all(
        //     detailedResult.detailedResult.unattemptedAns.map(ans => getQuestion(ans.question_id))
        // );

        const wrongIds = detailedResult.detailedResult.wrong_answers.map(ans => ans.question_id);
        const unattemptedIds = detailedResult.detailedResult.unattemptedAns.map(ans => ans.question_id);
        const allQuestions = await getQuestionsByEventId(eventId);

        const allQuestionsWithStatus = allQuestions.map(question => {
            if (wrongIds.includes(question.id)) {
                // Find the matching result from detailedResult
                const match = detailedResult.detailedResult.wrong_answers.find(res => res.question_id === question.id);
                // Add the status from detailedResult
                return {
                  ...question,
                  status: 'wrong', // fallback if not found
                    response: match.response
                };
              }
            else if (unattemptedIds.includes(question.id)) {
                // Find the matching result from detailedResult
                const match = detailedResult.detailedResult.unattemptedAns.find(res => res.question_id === question.id);
                // Add the status from detailedResult
                return {
                  ...question,
                  status: 'unattempted', // fallback if not found
                };
              }
            
              // If not wrong, return original question
              return {
                ...question,
                status: 'correct'
              }; 
        });

        console.log("ALL", allQuestionsWithStatus);
        
        const subjectWise = allQuestionsWithStatus.reduce((acc, question) => {
            if(!acc[question.subject_id.name]){
                acc[question.subject_id.name] = [question]
            }
            else{
                acc[question.subject_id.name].push(question);
            }
            
            return acc;
        },{});
        
        const resultData = {
            ...result,
            detailedResult,
            subjectWise
        }


        return new APIResponse(200, resultData, "Result fetched").send(res);


    }
    catch (err) {
        console.log(err);
        return new APIError(500, [err.message]).send(res);
    }
}