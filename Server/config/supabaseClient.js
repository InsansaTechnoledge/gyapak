import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './env.js';

let supabase = null;

const connectToSupabase = async function(){
    try{
        supabase = createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );
    console.log('connected to supabse');
    }
    catch(e){
        console.error(e, 'error connecting to supabse');
    }
}

export {connectToSupabase , supabase};
