import { supabase } from "../../config/supabaseClient.js";

export const createSubjectQuery = async (name , description) => {
    const {data , error } = await supabase
    .from('subjects')
    .insert([{name, description}])
    .select()
    .single()

    if(error) throw error;
    return data;
}

export const getAllSubjectsQuerry = async () => {
    const {data, error} = await supabase
    .from('subjects')
    .select('*')
    .order('created_at', {asscending: false})

    if(error) throw error;
    return data;
}

export const updateSubjectQuery = async (id , name , description) => {
    const {data , error} = await supabase
    .from('subjects')
    .update({name , description , updated_at: new Date()})
    .eq('id' , id)
    .select()
    .single()

    if(error) throw error;
    return data;
}

export const deleteSubjectQuery = async (id) => {
    const {data , error} = await supabase
    .from('subjects')
    .delete()
    .eq('id', id)
    .select()
    .single()

    if(error) throw error;
    return data;
}