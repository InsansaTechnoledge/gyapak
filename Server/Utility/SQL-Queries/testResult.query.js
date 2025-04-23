import { supabase } from "../../config/supabaseClient.js";

export const evaluateResponse = async (answers = [], userId, examId, eventId) => {
    if (!Array.isArray(answers) || answers.length === 0) {
        throw new Error("Answers array is required");
    }

    const questionIds = answers.map(a => a.question_id);

    // 1. Fetch correct answers from the questions table
    const { data: questions, error: questionsError } = await supabase
        .from("questions")
        .select("id, correct")
        .in("id", questionIds);

    if (questionsError) throw questionsError;

    let rightAnsCount = 0;
    const wrongAns = [];
    const unattemptedAns = [];

    for (const ans of answers) {
        const question = questions.find(q => q.id === ans.question_id);
        if (!question) continue;
        if (!ans.response) {
            unattemptedAns.push({
                question_id: ans.question_id,
                user_id: userId,
                type: "unattempted"
            })
        }
        else if (question.correct === ans.response) {
            rightAnsCount++;
        } else {
            wrongAns.push({
                question_id: ans.question_id,
                response: ans.response,
                user_id: userId
            });
        }
    }

    if (wrongAns.length > 0) {
        await storeWrongResponses(wrongAns);
    }

    if (unattemptedAns.length > 0) {
        await storeUnattemptedResponses(unattemptedAns);
    }

    const wrongCount = wrongAns.length;
    const totalAttempted = rightAnsCount + wrongCount;

    // 3. Fetch exam marking scheme
    const { data: exam, error: examError } = await supabase
        .from("exam")
        .select("positive_marks, negative_marks")
        .eq("id", examId)
        .single();

    if (examError) throw examError;

    const marks = rightAnsCount * exam.positive_marks - wrongCount * exam.negative_marks;

    // 4. Store result in results table
    const { data: result, error: resultError } = await supabase
        .from("results")
        .insert([
            {
                exam_id: examId,
                event_id: eventId,
                user_id: userId,
                detailed_result_id: "", // placeholder if not using it
                marks
            }
        ])
        .select()
        .single();


    if (resultError) throw resultError;

    // 5. Final return
    return {
        right_count: rightAnsCount,
        wrong_count: wrongCount,
        total_attempted: totalAttempted,
        marks,
        result_id: result.id,
        wrong_answers: wrongAns.map(({ correct, ...rest }) => rest),
        unattemptedAns
    };
};

export const storeWrongResponses = async (responses) => {
    const { data, error } = await supabase
        .from("user_wrong_responses")
        .upsert(responses, {
            onConflict: ['user_id', 'question_id']
        })
        .select();

    if (error) throw error;
    return data;
}

export const storeUnattemptedResponses = async (responses) => {

    const { data, error } = await supabase
        .from('user_important_questions')
        .upsert(responses, {
            onConflict: ['user_id', 'question_id'],
            ignoreDuplicates: true
        })
        .select();
    
    if (error && Object.keys(error).length > 0) throw error;
    return data;
}

export const storeBookmarkedResponses = async (responses) => {
    const { data, error } = await supabase
        .from('user_important_questions')
        .upsert(responses)
        .select();

    if (error) throw error;
    return data;
}

export const fetchWrongQuestionsSubjectwise = async (userId, examId) => {
    const { data, error } = await supabase
    .rpc('get_user_wrong_questions', {
        examid: examId,
        userid: userId
      });

    if(error) throw error;
    return data;
}

export const fetchResultsOfUser = async (userId, examId) => {
    const { data, error } = await supabase
    .from('results')
    .select('*, event_id(*)')
    .eq('exam_id', examId)
    .eq('user_id', userId)

    console.log("RESULTS",data);

    if(error) throw error;
    return data;
}

export const fetchResultForEvent = async (eventId, userId) => {
    const { data, error } = await supabase
    .from('results')
    .select('*, event_id(*)')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .single();
    
    console.log("RESULTS",data);

    if(error) throw error;
    return data;
}

export const addDetailedResultLinktoResult = async (event_id, user_id, detailed_result_id) => {
    const { data, error} = await supabase
    .from('results')
    .update({ detailed_result_id })
    .eq('event_id', event_id)
    .eq('user_id', user_id)
    .select()
    .single();

    if(error) throw error;
    return data;
}

