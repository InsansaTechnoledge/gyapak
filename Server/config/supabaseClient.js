import { createClient } from '@supabase/supabase-js';

let supabase = null;

const connectToSupabase = async function(){
    try{
        supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
    );
    console.log('connected to supabse');
    }
    catch(e){
        console.error(e, 'error connecting to supabse');
    }
}

export {connectToSupabase , supabase};
