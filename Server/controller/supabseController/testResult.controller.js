import { APIError } from "../../Utility/ApiError.js";
import { APIResponse } from "../../Utility/ApiResponse.js";
import { evaluateResponse, fetchWrongQuestionsSubjectwise } from "../../Utility/SQL-Queries/testResult.query.js";

export const checkUsersAnswers = async (req, res) => {
    try {
        console.log("TT");
        const { answers, userId, exam_id, event_id } = req.body
        const result = await evaluateResponse(answers, userId, exam_id, event_id)

        if (!userId || !exam_id || !event_id || !Array.isArray(answers)) {
            return new APIError(400, ["Missing required fields or invalid input"]).send(res);
        }
        return new APIResponse(200, result, "Checked answers").send(res);
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

