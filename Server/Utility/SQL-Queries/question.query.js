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