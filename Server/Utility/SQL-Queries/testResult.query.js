import { supabase } from "../../config/supabaseClient";

export const storeWrongResponses = async (responses) => {
    
    

    const {data,error} = await supabase
    .from('user_wrong_responses')
    .insert(responses)
    .select();

    if(error) throw error;
    return data;
}