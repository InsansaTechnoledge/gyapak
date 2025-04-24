import { supabase } from "../../config/supabaseClient.js";

export const createQuestionQuery = async({question , options , correct , explanation , difficulty , subject_id}) => {
    const {data , error} = await supabase
    .from('questions')
    .insert([{
        question,
        options,
        correct,
        explanation,
        difficulty,
        subject_id
    }])
    .select()
    .single();

    if(error) throw error;
    return data;
} 

export const getQuestionBySubject = async(subject_id) => {
    const {data, error} = await supabase
    .from('questions')
    .select('*')
    .eq('subject_id', subject_id)
    .order('created_at' , {ascending: false});

    if(error) throw error;
    return data;
}

export const getQuestionsByEventId = async (event_id) => {
  const { data, error } = await supabase
    .from('event_questions')
    .select('question_id, questions(*, subject_id(id, name))') 
    .eq('event_id', event_id)

  if (error) throw error;

  return data.map(row => row.questions); 
};


export const updateQuestion = async(id, updates) => {
    const {data , error} = await supabase
    .from('questions')
    .update({...updates , updated_at: new Date()})
    .eq('id' , id)
    .select()
    .single();

    if(error) throw error;
    return data;
}


export const deleteQuestion = async(id) => {
    const {data , error} = await supabase
    .from('questions')
    .delete()
    .eq('id', id)
    .select()
    .single();

    if(error) throw error;
    return data;
}

export const getQuestion = async (id) => {
    const {data , error} = await supabase
    .from('questions')
    .select('*, subject_id(id, name)')
    .eq('id', id)
    .single();

    if(error) throw error;
    return data;
}


export const evaluateAttemptedQuestions = async (attempts) => {
    const questionIds = attempts.map((a) => a.questionId);
  
    const { data: questions, error } = await supabase
      .from('questions')
      .select('id, correct')
      .in('id', questionIds);
  
    if (error) throw error;
  
    const results = attempts.map((attempt) => {
      const original = questions.find((q) => q.id === attempt.questionId);
      if (!original) {
        return { questionId: attempt.questionId, status: 'not_found' };
      }
  
      const userAnswer = typeof attempt.answer === 'string'
        ? attempt.answer.trim().toUpperCase()
        : null;
  
      if (!userAnswer || userAnswer === '') {
        return { questionId: attempt.questionId, status: 'unattempted' };
      }
  
      const isCorrect = userAnswer === original.correct?.trim().toUpperCase();
  
      return {
        questionId: attempt.questionId,
        selected: userAnswer,
        correct: original.correct,
        status: isCorrect ? 'correct' : 'incorrect'
      };
    });
  
    return results;
  };
  