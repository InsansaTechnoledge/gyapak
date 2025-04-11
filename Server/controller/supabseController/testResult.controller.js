import { APIError } from "../../Utility/ApiError.js";
import { APIResponse } from "../../Utility/ApiResponse.js";
import { evaluateResponse, fetchWrongQuestionsSubjectwise } from "../../Utility/SQL-Queries/testResult.query.js";

export const checkUsersAnswers = async (req , res) => {
    try{
        console.log("TT");
        const {answers , userId , exam_id, event_id} = req.body 
        const result = await evaluateResponse(answers , userId , exam_id , event_id)

        return new APIResponse(200 , result , 'checked answers').send(res);
    } catch(e) {
        // console.log(e);
        return new APIError(500, [e.message , 'failed to evaluate answer']).send(res)
    }
}

export const getWrongQuestionsSubjectwiseForExam = async (req,res) => {
    try{

        const {examId, userId} = req.body;
        const response = await fetchWrongQuestionsSubjectwise(userId, examId);
        console.log(response);
        const groupedBySubject = response.reduce((acc, curr) => {
            const subject = curr.subject_name;
            if(!acc[subject]){
                acc[subject] = [];
            }

            acc[subject].push(curr);
            return acc;
        },{});
        

        return new APIResponse(200, groupedBySubject, "Result fetched").send(res);
    }
    catch(err){
        return new APIError(500, [err.message]).send(res);
    }
}