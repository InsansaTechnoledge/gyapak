import { APIError } from "../../Utility/ApiError.js";
import { APIResponse } from "../../Utility/ApiResponse.js";
import { evaluateResponse } from "../../Utility/SQL-Queries/testResult.query.js";

export const checkUsersAnswers = async (req , res) => {
    try{
        const {answers , userId , exam_id, event_id} = req.body 
        const result = await evaluateResponse(answers , userId , exam_id , event_id)

        return new APIResponse(200 , result , 'checked answers').send(res);
    } catch(e) {
        // console.log(e);
        return new APIError(500, [e.message , 'failed to evaluate answer']).send(res)
    }
}