import { APIError } from "../../Utility/ApiError.js";
import { APIResponse } from "../../Utility/ApiResponse.js";
import { evaluateResponse } from "../../Utility/SQL-Queries/testResult.query.js";

export const checkUsersAnswers = async (req , res) => {
    try{
        console.log("TT");
        const {answers , userId , exam_id, event_id} = req.body 
        const result = await evaluateResponse(answers , userId , exam_id , event_id)

    if (!userId || !exam_id || !event_id || !Array.isArray(answers)) {
      return new APIError(400, ["Missing required fields or invalid input"]).send(res);
    }
    return new APIResponse(200, result, "Checked answers").send(res);
  } catch (e) {
    console.error("❌ Error during evaluation:", e);
    return new APIError(500, [e?.message || "Unknown error", "Failed to evaluate answer"]).send(res);
  }
};
