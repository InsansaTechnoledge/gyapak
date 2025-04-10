import { supabase } from "../../config/supabaseClient.js";

export const evaluateResponse = async(answers = [] , userId) => {

    if(!Array.isArray(answers) || answers.length === 0) throw new Error('ans array is required');

    const questionIds = answers.map(a => a.question_id);

    // const userId = 

    const {data: questions , error} = await supabase
    .from('questions')
    .select('id, correct')
    .in('id' , questionIds);

    if(error) throw error

    let rightAnsCount = 0;

    const wrongAns = [];

    for(const ans of answers) {
        const question = questions.find(q => q.id === ans.question_id)
        if(!question) continue;

        if(question.correct == ans.response) {
            rightAnsCount++;
        }else {
            wrongAns.push({
                question_id: ans.question_id,
                response: ans.response,
                user_id: userId,
                answered_at: new Date()

            })
        }
    }

    await storeWrongResponses(wrongAns)

    return {
        right_Count: rightAnsCount,
        wrong_answers: wrongAns
    }
}

export const storeWrongResponses = async (responses) => {
    
    const {data,error} = await supabase
    .from('user_wrong_responses')
    .upsert(responses)
    .select();

    if(error) throw error;
    return data;
}

export const storeUnattemptedResponses = async (responses) => {
    const { data, error } = await supabase
  .from('user_important_responses')
  .upsert(responses, {
    onConflict: ['user_id', 'question_id'],
    ignoreDuplicates: true
  })
  .select();

    if(error) throw error;
    return data;
}

export const storeBookmarkedResponses = async (responses) => {
    const {data,error} = await supabase
    .from('user_important_responses')
    .insert(responses)
    .select();

    if(error) throw error;
    return data;
}